export interface DonationLocation {
  id: string;
  organization_name: string;
  description: string | null;
  address: string;
  city: string | null;
  municipality: string | null;
  barangay: string | null;
  latitude: number;
  longitude: number;
  contact_number: string | null;
  operating_hours: string | null;
  donation_type: string[] | null;
  status: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}
