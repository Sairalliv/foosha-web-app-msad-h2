-- ==============================================================================
-- ADD QUANTITY COLUMN FOR FOOD ITEMS
-- ==============================================================================
-- Separates the single 'amount' column (which previously handled both item counts
-- and monetary values) into two distinct columns:
-- 'quantity' (integer) for food items
-- 'amount' (integer/numeric) for cash donations
-- ==============================================================================

-- 1. Add quantity column to both tables
alter table public.donations add column quantity integer;
alter table public.requests add column quantity integer;

-- 2. Migrate existing food records to use quantity instead of amount
update public.donations set quantity = amount, amount = null where type = 'food';
update public.requests set quantity = amount, amount = null where type = 'food';
