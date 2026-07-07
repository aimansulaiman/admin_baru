export type PointsConfiguration = {
  id: number;
  client_name: string | null;
  client_domain_name: string | null;
  default_points: number | string | null;

  total_customers: number;
  total_points_distributed: number | string;

  created_at: string;
  updated_at: string;
};

export type PointsConfigurationResponse = {
  success: boolean;
  message?: string;
  data: PointsConfiguration;
};

export type UpdatePointsConfigurationInput = {
  default_points: number | string;
};