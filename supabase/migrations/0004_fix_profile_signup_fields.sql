-- ==============================================================================
-- Fix profile creation on signup: persist full_name and role
-- ==============================================================================
-- Two bugs this addresses:
--
-- 1. public.profiles never had a `full_name` column — only `first_name` /
--    `last_name` — even though every read in the app (types.ts, DonorDashboard,
--    admin components, dashboard/page.tsx, supabaseService.ts joins) expects
--    `profiles.full_name`. Any select of `full_name` was failing/undefined.
--
-- 2. handle_new_user() (the trigger that copies auth.users signup metadata into
--    public.profiles) never read the `role` key at all, and read
--    `first_name`/`last_name` instead of the single `full_name` field that
--    RegisterForm/registerAction actually send. Every new signup silently got
--    role = 'recipient' (the column default) no matter what was selected.
-- ==============================================================================

alter table public.profiles
  add column if not exists full_name text;

create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_role public.user_role;
begin
  -- Coerce whatever role string arrived in metadata into the enum, falling
  -- back to 'recipient' if it's missing or not one of the known values
  -- (e.g. a Google sign-in with no role metadata at all).
  begin
    v_role := (new.raw_user_meta_data->>'role')::public.user_role;
  exception when others then
    v_role := 'recipient';
  end;
  if v_role is null then
    v_role := 'recipient';
  end if;

  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    v_role
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger already exists and points at this function by name, so no need to
-- recreate it — CREATE OR REPLACE above is enough to pick up the new body.
