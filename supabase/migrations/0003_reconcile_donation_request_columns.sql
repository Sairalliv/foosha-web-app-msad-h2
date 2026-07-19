-- ==============================================================================
-- RECONCILIATION MIGRATION
-- ==============================================================================
-- The `donations` and `requests` tables (see complete_schema.sql, "Donations
-- Table Schema" / "Requests Table Schema" sections) were written with one set
-- of column names, while lib/supabase/types.ts, lib/supabaseService.ts,
-- components/forms/DonationForm.tsx, components/forms/HelpRequestForm.tsx,
-- and the create_match / confirm_match_pickup RPCs (0002_admin_matching.sql)
-- all assume a different set. This migration brings the DB in line with the
-- app code (the app-side naming is used consistently across many files, so
-- that's the side we standardize on).
--
-- Safe to run on a fresh DB (built from complete_schema.sql + 0002) or on an
-- empty `donations`/`requests` table. Column renames preserve existing data
-- and Postgres automatically repoints dependent RLS policies, so those don't
-- need to be recreated.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- donations: kind -> type, amount_php -> amount, barangay -> location
-- ------------------------------------------------------------------------------
alter table public.donations rename column kind to type;
alter table public.donations rename column amount_php to amount;
alter table public.donations rename column barangay to location;

-- Fresh donations should start out unmatched, not mid-match. (0002 already
-- fixed the CHECK constraint to ('Waiting','matching','Given'); the DEFAULT
-- was never updated to match.)
alter table public.donations alter column status set default 'Waiting';

-- ------------------------------------------------------------------------------
-- requests: requestor_id -> recipient_id, kind -> type, priority -> priority_tier,
--           amount_php -> amount, barangay -> address
-- ------------------------------------------------------------------------------
alter table public.requests rename column requestor_id to recipient_id;
alter table public.requests rename column kind to type;
alter table public.requests rename column priority to priority_tier;
alter table public.requests rename column amount_php to amount;
alter table public.requests rename column barangay to address;

-- Replace the original status constraint/default (pending / awaiting_pickup /
-- dispatched / cancelled) with the lifecycle create_match() and
-- confirm_match_pickup() actually use: unmatched -> matching -> confirmed.
alter table public.requests drop constraint if exists requests_status_check;
alter table public.requests
  add constraint requests_status_check
  check (status in ('unmatched', 'matching', 'confirmed'));
alter table public.requests alter column status set default 'unmatched';

-- ------------------------------------------------------------------------------
-- Indexes referencing the old column names need to be dropped and recreated
-- under the new names (index defs, unlike policies, are not auto-repointed
-- by RENAME COLUMN in every Postgres version, so do it explicitly).
-- ------------------------------------------------------------------------------
drop index if exists idx_requests_recipient_id;
create index if not exists idx_requests_recipient_id on public.requests(recipient_id);
