-- ==============================================================================
-- FOOSHA PROJECT: SUPABASE POSTGRESQL SCHEMA
-- ==============================================================================
-- Description: Complete production-ready schema for Food Waste Alliance platform
-- Features: Auth, Profiles, Food Donations, Help Requests, Logistics, Notifications, RLS, Donation Locations Map
-- ==============================================================================

-- ==============================================================================
-- 1. EXTENSIONS & ENUMS
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Enums for constrained column values
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('admin', 'donor', 'volunteer', 'recipient');

DROP TYPE IF EXISTS food_category CASCADE;
CREATE TYPE food_category AS ENUM ('fresh', 'cooked', 'pantry', 'other');

DROP TYPE IF EXISTS donation_status CASCADE;
CREATE TYPE donation_status AS ENUM ('pending', 'accepted', 'picked_up', 'delivered', 'cancelled');

DROP TYPE IF EXISTS request_status CASCADE;
CREATE TYPE request_status AS ENUM ('pending', 'matched', 'fulfilled', 'cancelled');

DROP TYPE IF EXISTS message_status CASCADE;
CREATE TYPE message_status AS ENUM ('unread', 'read', 'resolved');

-- ==============================================================================
-- 2. TABLES & SAFELY ADDING MISSING COLUMNS
-- ==============================================================================

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL
);

ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS first_name TEXT,
    ADD COLUMN IF NOT EXISTS last_name TEXT,
    ADD COLUMN IF NOT EXISTS username TEXT,
    ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'recipient'::user_role NOT NULL,
    ADD COLUMN IF NOT EXISTS avatar_url TEXT,
    ADD COLUMN IF NOT EXISTS phone TEXT,
    ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false NOT NULL,
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true NOT NULL,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;

-- USER SESSIONS
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL
);

ALTER TABLE public.user_sessions
    ADD COLUMN IF NOT EXISTS session_token TEXT,
    ADD COLUMN IF NOT EXISTS ip_address TEXT,
    ADD COLUMN IF NOT EXISTS user_agent TEXT,
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;

-- LOGIN HISTORY
CREATE TABLE IF NOT EXISTS public.login_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL
);

ALTER TABLE public.login_history
    ADD COLUMN IF NOT EXISTS login_timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ADD COLUMN IF NOT EXISTS ip_address TEXT,
    ADD COLUMN IF NOT EXISTS user_agent TEXT,
    ADD COLUMN IF NOT EXISTS status TEXT;

-- PASSWORD RESET TOKENS
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL
);

ALTER TABLE public.password_reset_tokens
    ADD COLUMN IF NOT EXISTS token TEXT,
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;

-- EMAIL VERIFICATION TOKENS
CREATE TABLE IF NOT EXISTS public.email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL
);

ALTER TABLE public.email_verification_tokens
    ADD COLUMN IF NOT EXISTS token TEXT,
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;

-- ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.activity_logs
    ADD COLUMN IF NOT EXISTS action TEXT,
    ADD COLUMN IF NOT EXISTS entity_type TEXT,
    ADD COLUMN IF NOT EXISTS entity_id UUID,
    ADD COLUMN IF NOT EXISTS details JSONB,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL
);

ALTER TABLE public.notifications
    ADD COLUMN IF NOT EXISTS title TEXT,
    ADD COLUMN IF NOT EXISTS message TEXT,
    ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false NOT NULL,
    ADD COLUMN IF NOT EXISTS link TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;

-- FOOD DONATIONS
CREATE TABLE IF NOT EXISTS public.food_donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL
);

ALTER TABLE public.food_donations
    ADD COLUMN IF NOT EXISTS food_name TEXT,
    ADD COLUMN IF NOT EXISTS category food_category,
    ADD COLUMN IF NOT EXISTS quantity TEXT,
    ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS pickup_address TEXT,
    ADD COLUMN IF NOT EXISTS contact_number TEXT,
    ADD COLUMN IF NOT EXISTS pickup_time TEXT,
    ADD COLUMN IF NOT EXISTS status donation_status DEFAULT 'pending'::donation_status NOT NULL,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;

-- HELP REQUESTS
CREATE TABLE IF NOT EXISTS public.help_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL
);

ALTER TABLE public.help_requests
    ADD COLUMN IF NOT EXISTS recipient_name TEXT,
    ADD COLUMN IF NOT EXISTS needs_description TEXT,
    ADD COLUMN IF NOT EXISTS people_count TEXT,
    ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN DEFAULT false NOT NULL,
    ADD COLUMN IF NOT EXISTS delivery_address TEXT,
    ADD COLUMN IF NOT EXISTS contact_number TEXT,
    ADD COLUMN IF NOT EXISTS status request_status DEFAULT 'pending'::request_status NOT NULL,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;

-- DELIVERIES / MATCHES
CREATE TABLE IF NOT EXISTS public.deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donation_id UUID REFERENCES public.food_donations(id) ON DELETE RESTRICT NOT NULL
);

ALTER TABLE public.deliveries
    ADD COLUMN IF NOT EXISTS request_id UUID,
    ADD COLUMN IF NOT EXISTS volunteer_id UUID,
    ADD COLUMN IF NOT EXISTS status donation_status DEFAULT 'accepted'::donation_status NOT NULL,
    ADD COLUMN IF NOT EXISTS picked_up_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;

-- CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
);

ALTER TABLE public.contact_messages
    ADD COLUMN IF NOT EXISTS name TEXT,
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS message TEXT,
    ADD COLUMN IF NOT EXISTS status message_status DEFAULT 'unread'::message_status NOT NULL,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;


-- ==============================================================================
-- 3. TRIGGERS & FUNCTIONS
-- ==============================================================================

-- Helper function to auto-update 'updated_at' columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_updated_at_column trigger to all relevant tables idempotently
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_food_donations_updated_at ON public.food_donations;
CREATE TRIGGER update_food_donations_updated_at BEFORE UPDATE ON public.food_donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_help_requests_updated_at ON public.help_requests;
CREATE TRIGGER update_help_requests_updated_at BEFORE UPDATE ON public.help_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_deliveries_updated_at ON public.deliveries;
CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON public.deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sync Auth Users to Profiles (Supabase Best Practice)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function for Admin Authorization checks in RLS policies
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- FOOD DONATIONS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Donations are viewable by everyone." ON public.food_donations;
DROP POLICY IF EXISTS "Donors can create donations." ON public.food_donations;
DROP POLICY IF EXISTS "Donors can update own donations." ON public.food_donations;

CREATE POLICY "Donations are viewable by everyone." ON public.food_donations FOR SELECT USING (true);
CREATE POLICY "Donors can create donations." ON public.food_donations FOR INSERT WITH CHECK (auth.uid() = donor_id);
CREATE POLICY "Donors can update own donations." ON public.food_donations FOR UPDATE USING (auth.uid() = donor_id);

-- ------------------------------------------------------------------------------
-- HELP REQUESTS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Help requests are viewable by everyone." ON public.help_requests;
DROP POLICY IF EXISTS "Recipients can create help requests." ON public.help_requests;
DROP POLICY IF EXISTS "Recipients can update own requests." ON public.help_requests;

CREATE POLICY "Help requests are viewable by everyone." ON public.help_requests FOR SELECT USING (true);
CREATE POLICY "Recipients can create help requests." ON public.help_requests FOR INSERT WITH CHECK (auth.uid() = recipient_id);
CREATE POLICY "Recipients can update own requests." ON public.help_requests FOR UPDATE USING (auth.uid() = recipient_id);

-- ------------------------------------------------------------------------------
-- DELIVERIES POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Deliveries viewable by involved parties." ON public.deliveries;
DROP POLICY IF EXISTS "Volunteers can create deliveries." ON public.deliveries;
DROP POLICY IF EXISTS "Volunteers can update their deliveries." ON public.deliveries;

CREATE POLICY "Deliveries viewable by involved parties." ON public.deliveries FOR SELECT USING (
    auth.uid() = volunteer_id OR
    auth.uid() IN (SELECT donor_id FROM public.food_donations WHERE id = donation_id) OR
    auth.uid() IN (SELECT recipient_id FROM public.help_requests WHERE id = request_id)
);
CREATE POLICY "Volunteers can create deliveries." ON public.deliveries FOR INSERT WITH CHECK (auth.uid() = volunteer_id);
CREATE POLICY "Volunteers can update their deliveries." ON public.deliveries FOR UPDATE USING (auth.uid() = volunteer_id);

-- ------------------------------------------------------------------------------
-- USER DATA POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own notifications." ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications." ON public.notifications;
DROP POLICY IF EXISTS "Users can view own login history." ON public.login_history;
DROP POLICY IF EXISTS "Users can view own sessions." ON public.user_sessions;

CREATE POLICY "Users can view own notifications." ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications." ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own login history." ON public.login_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own sessions." ON public.user_sessions FOR SELECT USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- ADMIN OVERRIDE POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins have full access to food_donations" ON public.food_donations;
DROP POLICY IF EXISTS "Admins have full access to help_requests" ON public.help_requests;
DROP POLICY IF EXISTS "Admins have full access to deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Admins have full access to contact_messages" ON public.contact_messages;

CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to food_donations" ON public.food_donations FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to help_requests" ON public.help_requests FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to deliveries" ON public.deliveries FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to contact_messages" ON public.contact_messages FOR ALL USING (is_admin());

-- ==============================================================================
-- 5. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

CREATE INDEX IF NOT EXISTS idx_food_donations_donor_id ON public.food_donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_food_donations_status ON public.food_donations(status);
CREATE INDEX IF NOT EXISTS idx_food_donations_created_at ON public.food_donations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_help_requests_recipient_id ON public.help_requests(recipient_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_status ON public.help_requests(status);
CREATE INDEX IF NOT EXISTS idx_help_requests_created_at ON public.help_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_deliveries_volunteer_id ON public.deliveries(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_donation_id ON public.deliveries(donation_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_request_id ON public.deliveries(request_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON public.deliveries(status);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id_is_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON public.login_history(user_id);

-- ==============================================================================
-- 6. SCHEMA COMMENTS
-- ==============================================================================
COMMENT ON TABLE public.profiles IS 'Extended user profiles tied to Supabase auth.users.';
COMMENT ON TABLE public.food_donations IS 'Surplus food items posted by donors for distribution.';
COMMENT ON TABLE public.help_requests IS 'Requests for food assistance from beneficiaries or kitchens.';
COMMENT ON TABLE public.deliveries IS 'Delivery tracking for volunteer riders moving food from donors to recipients.';
COMMENT ON TABLE public.contact_messages IS 'Public contact form submissions and inquiries.';
COMMENT ON TABLE public.user_sessions IS 'Tracks active user sessions extending basic auth features.';
COMMENT ON TABLE public.login_history IS 'Security audit logs for user logins.';

-- ============================================================
-- Donations Table Schema
-- ============================================================

-- 1. Create the donations table
create table if not exists donations (
  id          uuid default gen_random_uuid() primary key,
  created_at  timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Links the donation to a logged-in user in auth.users
  donor_id    uuid not null references auth.users(id) on delete cascade,

  -- Donor's display name, resolved from profile at insert time
  donor_name  text not null default 'Anonymous',

  -- 'food' or 'cash'
  kind        text not null check (kind in ('food', 'cash')),

  -- Free-text: "Rice (5kg), canned sardines" or "₱500 cash gift"
  description text not null,

  -- Only for cash donations, NULL for food
  amount_php  numeric(10, 2) default null,

  -- Donor's barangay, resolved from their profile
  barangay    text default null,

  -- Status lifecycle: matching → awaiting_pickup → confirmed
  status      text default 'matching' not null
    check (status in ('matching', 'unmatched', 'awaiting_pickup', 'confirmed'))
);

-- ============================================================
-- 2. Enable Row Level Security (RLS)
-- ============================================================
alter table donations enable row level security;

-- Policy A: Anyone can view donations (public read for matching/browse display)
DROP POLICY IF EXISTS "Allow public read access" on donations;
create policy "Allow public read access" on donations
  for select using (true);

-- Policy B: Only the authenticated user can insert their own donation.
DROP POLICY IF EXISTS "Allow authenticated insert" on donations;
create policy "Allow authenticated insert" on donations
  for insert with check (auth.uid() = donor_id);

-- Policy C: Only the donor themselves can update their own donation.
DROP POLICY IF EXISTS "Allow donor to update own donation" on donations;
create policy "Allow donor to update own donation" on donations
  for update using (auth.uid() = donor_id);

-- ============================================================
-- Requests Table Schema
-- ============================================================

-- 1. Create the requests table
create table if not exists requests (
  id              uuid default gen_random_uuid() primary key,
  created_at      timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Links the request to a logged-in user in auth.users
  requestor_id    uuid not null references auth.users(id) on delete cascade,

  -- Requestor's display name, resolved from profile at insert time
  requestor_name  text not null,

  -- 'food' or 'cash'
  kind            text not null check (kind in ('food', 'cash')),

  -- Priority level for auto-matching: 'elderly', 'pwd', 'infant', 'general'
  priority        text not null default 'general'
    check (priority in ('elderly', 'pwd', 'infant', 'general')),

  -- Free-text: "Rice (5kg), canned sardines" or "₱500 cash assistance"
  description     text not null,

  -- Only for cash requests, NULL for food
  amount_php      numeric(10, 2) default null,

  -- Requestor's barangay, resolved from their profile
  barangay        text default null,

  -- Status lifecycle: pending → matching → awaiting_pickup → dispatched → confirmed → cancelled
  status          text default 'pending' not null
    check (status in ('pending', 'matching', 'awaiting_pickup', 'dispatched', 'confirmed', 'cancelled'))
);

-- ============================================================
-- 2. Enable Row Level Security (RLS)
-- ============================================================
alter table requests enable row level security;

-- Policy A: Anyone can view requests (public read for matching/admin display)
DROP POLICY IF EXISTS "Allow public read access" on requests;
create policy "Allow public read access" on requests
  for select using (true);

-- Policy B: Only the authenticated user can insert their own request.
DROP POLICY IF EXISTS "Allow authenticated insert" on requests;
create policy "Allow authenticated insert" on requests
  for insert with check (auth.uid() = requestor_id);

-- Policy C: Only the requestor themselves can update their own request.
DROP POLICY IF EXISTS "Allow requestor to update own request" on requests;
create policy "Allow requestor to update own request" on requests
  for update using (auth.uid() = requestor_id);

-- ============================================================
-- Donation Locations Map Schema (Added Feature)
-- ============================================================

-- 1. Create the donation_locations table
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

-- 2. Enable Row Level Security
ALTER TABLE public.donation_locations ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Allow public read access to donation locations
DROP POLICY IF EXISTS "Allow public read access" on public.donation_locations;
CREATE POLICY "Allow public read access" ON public.donation_locations
  FOR SELECT USING (true);

-- 4. Apply auto-update timestamp trigger
DROP TRIGGER IF EXISTS update_donation_locations_updated_at ON public.donation_locations;
CREATE TRIGGER update_donation_locations_updated_at 
  BEFORE UPDATE ON public.donation_locations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Insert mock data for Cebu Province
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
