export type AdditionalSetting = {
  id: number;

  name: string | null;
  domain_name: string | null;

  email: string | null;
  phone_number: string | null;
  website: string | null;
  address: string | null;

  default_points: number | string | null;
  minimum_points: number | string | null;
  maximum_points: number | string | null;

  active: boolean;

  created_at: string;
  updated_at: string;
};

export type AdditionalSettingResponse = {
  success: boolean;
  message?: string;
  data: AdditionalSetting;
};

export type UpdateAdditionalSettingInput = {
  name?: string;
  email?: string;
  phone_number?: string;
  website?: string;
  address?: string;
  default_points?: string;
  minimum_points?: string;
  maximum_points?: string;
  active?: boolean;
};