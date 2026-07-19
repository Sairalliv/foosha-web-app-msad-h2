-- ==============================================================================
-- Add a `category` column to `donations`.
-- ==============================================================================
-- The donor-facing donation form now asks food donors to classify their
-- items (e.g. "Rice & Grains", "Canned Goods") in addition to the free-text
-- description. Cash donations don't use this column, so it's left NULL.
-- ==============================================================================

alter table public.donations
  add column if not exists category text default null;

comment on column public.donations.category is
  'Food donation category selected from a fixed list in the donor form (e.g. Rice & Grains, Canned Goods). NULL for cash donations.';
