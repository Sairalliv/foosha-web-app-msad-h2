-- OPTIONAL example data, for local development / demos only.
-- This file is intentionally named .example.sql so Supabase CLI migration
-- tooling does NOT pick it up automatically alongside the numbered/named
-- migrations in this folder. The organizations, phone numbers, and
-- coordinates below are illustrative placeholders, not real partners --
-- rename this file (dropping .example) and run it manually only if you
-- want sample pins on the map before real partner data exists.

-- Insert mock data for Cebu Province
INSERT INTO public.donation_locations 
(organization_name, description, address, city, municipality, barangay, latitude, longitude, contact_number, operating_hours, donation_type, status, category)
VALUES
(
  'Cebu Food Bank',
  'Central food bank serving Metro Cebu.',
  'Mango Avenue, Cebu City',
  'Cebu City',
  NULL,
  'Kamputhaw',
  10.3157, 123.8854,
  '+63 917 123 4567',
  'Mon-Fri: 8:00 AM - 5:00 PM',
  ARRAY['Canned Goods', 'Rice', 'Water'],
  'Accepting Donations',
  'Food Donation Center'
),
(
  'Talisay Community Pantry',
  'Community pantry driven by local volunteers.',
  'Lawaan 1, Talisay City',
  'Talisay City',
  NULL,
  'Lawaan',
  10.2520, 123.8378,
  '+63 918 987 6543',
  'Sat-Sun: 9:00 AM - 12:00 PM',
  ARRAY['Vegetables', 'Canned Goods', 'Hygiene Kits'],
  'High Need',
  'Community Pantry'
),
(
  'Mandaue Relief Center',
  'Partner NGO focusing on disaster relief and daily sustenance.',
  'A.S. Fortuna St., Mandaue City',
  'Mandaue City',
  NULL,
  'Banilad',
  10.3340, 123.9213,
  '+63 32 345 6789',
  'Everyday: 8:00 AM - 8:00 PM',
  ARRAY['Clothes', 'Blankets', 'Rice'],
  'Accepting Donations',
  'Partner NGO'
),
(
  'Lapu-Lapu Active Drive',
  'Special donation drive for recent typhoon victims.',
  'Mactan Shrine area, Lapu-Lapu City',
  'Lapu-Lapu City',
  NULL,
  'Mactan',
  10.3083, 124.0150,
  '+63 922 111 2222',
  'Mon-Sat: 10:00 AM - 6:00 PM',
  ARRAY['Water', 'Medicines', 'Ready-to-eat Meals'],
  'Urgent',
  'Active Donation Drive'
),
(
  'Consolacion Pickup Hub',
  'A designated hub for bulk donation pickups.',
  'SM City Consolacion area',
  'Consolacion',
  'Consolacion',
  'Pitogo',
  10.3846, 123.9610,
  '+63 999 888 7777',
  'Wed-Sun: 1:00 PM - 5:00 PM',
  ARRAY['Bulk Rice', 'Boxed Goods'],
  'Accepting Donations',
  'Pickup Location'
);
