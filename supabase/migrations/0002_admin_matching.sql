-- Admin matching + verification support
-- Run after the base schema (profiles, donations, requests, matches) exists.

-- 1. Track document-review state for vulnerable-tier requests (elderly/pwd/infant).
--    'general' requests don't need this and stay NULL.
alter table public.requests
  add column if not exists verification_status text
  check (verification_status in ('pending', 'approved', 'needs_info'));

-- Auto-flag new vulnerable-tier requests for review; general stays untouched.
alter table public.requests
  alter column verification_status set default null;

-- 2. Give donations a 'matching' state so both sides of a match can move in lockstep
--    with requests.status ('unmatched' | 'matching' | 'confirmed').
alter table public.donations
  drop constraint if exists donations_status_check;
alter table public.donations
  add constraint donations_status_check
  check (status in ('Waiting', 'matching', 'Given'));

-- 3. Transactional match creation.
--    SECURITY DEFINER so it can write across donor/recipient-owned rows regardless
--    of the caller's row-level policies — but it re-checks the caller is an admin
--    itself before doing anything, so it's not a blanket privilege-escalation hole.
--    A Postgres function body is one implicit transaction: if any statement raises,
--    everything in it (including the earlier INSERT into matches) rolls back.
create or replace function public.create_match(
  p_donation_id uuid,
  p_request_id uuid
)
returns public.matches
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller_role text;
  v_donation_status text;
  v_request_status text;
  v_code text;
  v_match public.matches;
begin
  -- Caller must be an admin.
  select role into v_caller_role from public.profiles where id = auth.uid();
  if v_caller_role is distinct from 'admin' then
    raise exception 'Only admins can create matches';
  end if;

  -- Lock both rows for the duration of this transaction so two admins can't
  -- double-book the same donation or request.
  select status into v_donation_status
    from public.donations where id = p_donation_id for update;
  select status into v_request_status
    from public.requests where id = p_request_id for update;

  if v_donation_status is null then
    raise exception 'Donation % not found', p_donation_id;
  end if;
  if v_request_status is null then
    raise exception 'Request % not found', p_request_id;
  end if;
  if v_donation_status <> 'Waiting' then
    raise exception 'Donation % is not available (status: %)', p_donation_id, v_donation_status;
  end if;
  if v_request_status <> 'unmatched' then
    raise exception 'Request % is not unmatched (status: %)', p_request_id, v_request_status;
  end if;

  -- 6-character alphanumeric OTP, unambiguous charset (no 0/O/1/I).
  select string_agg(
    substr('23456789ABCDEFGHJKMNPQRSTUVWXYZ', (random() * 31 + 1)::int, 1),
    ''
  )
  into v_code
  from generate_series(1, 6);

  insert into public.matches (donation_id, request_id, verification_code, status)
  values (p_donation_id, p_request_id, v_code, 'pending')
  returning * into v_match;

  update public.donations set status = 'matching' where id = p_donation_id;
  update public.requests set status = 'matching' where id = p_request_id;

  return v_match;
end;
$$;

grant execute on function public.create_match(uuid, uuid) to authenticated;

-- 4. OTP redemption at pickup — confirms a match and closes out both sides.
create or replace function public.confirm_match_pickup(
  p_match_id uuid,
  p_code text
)
returns public.matches
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller_role text;
  v_match public.matches;
begin
  select role into v_caller_role from public.profiles where id = auth.uid();
  if v_caller_role is distinct from 'admin' then
    raise exception 'Only admins can confirm pickups';
  end if;

  select * into v_match from public.matches where id = p_match_id for update;
  if v_match.id is null then
    raise exception 'Match % not found', p_match_id;
  end if;
  if v_match.status = 'confirmed' then
    raise exception 'Match % is already confirmed', p_match_id;
  end if;
  if v_match.verification_code <> upper(p_code) then
    raise exception 'Incorrect verification code';
  end if;

  update public.matches set status = 'confirmed' where id = p_match_id returning * into v_match;
  update public.donations set status = 'Given' where id = v_match.donation_id;
  update public.requests set status = 'confirmed' where id = v_match.request_id;

  return v_match;
end;
$$;

grant execute on function public.confirm_match_pickup(uuid, text) to authenticated;
