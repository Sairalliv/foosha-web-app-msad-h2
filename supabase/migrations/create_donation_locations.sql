-- Create the table
CREATE TABLE IF NOT EXISTS public.donation_locations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name text NOT NULL,
  description text,
  address text NOT NULL,
  city text,
  municipality text,
  barangay text,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  contact_number text,
  operating_hours text,
  donation_type text[],
  status text DEFAULT 'Accepting Donations',
  category text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.donation_locations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to donation locations
CREATE POLICY "Allow public read access" ON public.donation_locations
  FOR SELECT
  USING (true);

-- No rows are seeded here. Real donation-center/pantry/NGO listings should be
-- entered through an admin tool or inserted directly once you have actual
-- partner organizations to list — see seed_donation_locations.example.sql
-- for a few illustrative example rows you can adapt or delete.
