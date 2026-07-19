-- ==============================================================================
-- Add a `category` column to `requests`.
-- ==============================================================================
-- Mirrors 0005_add_donation_category.sql: the recipient-facing "Request
-- Help" form now asks food requestors to classify what they need (e.g.
-- "Rice & Grains", "Canned Goods") in addition to the free-text
-- description, and to give a quantity via the existing `amount` column.
-- Cash requests don't use this column, so it's left NULL.
-- ==============================================================================

alter table public.requests
  add column if not exists category text default null;

comment on column public.requests.category is
  'Food request category selected from a fixed list in the request-help form (e.g. Rice & Grains, Canned Goods). NULL for cash requests.';
