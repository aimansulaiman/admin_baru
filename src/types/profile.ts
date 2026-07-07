export type ProfileClient = {
  id: number | null;
  name: string | null;
  domain_name: string | null;
  email: string | null;
  phone_number: string | null;
  active: boolean | null;
};

export type AdminProfile = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  role: string | null;
  superadmin: boolean | null;
  initials: string;
  loyalty_client_id: number | null;
  client: ProfileClient;
  created_at: string;
  updated_at: string;
};

export type ProfileResponse = {
  success: boolean;
  message?: string;
  data: AdminProfile;
};