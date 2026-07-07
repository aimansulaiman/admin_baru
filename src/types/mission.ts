export type Mission = {
  id: number;

  name: string | null;
  image: string | null;
  description: string | null;
  numbers: number | string | null;

  status: boolean;
  active: boolean;

  loyalty_client_id: number | null;
  loyalty_clients_id?: number | null;
  client_name: string | null;
  client_domain_name: string | null;

  created_at: string;
  updated_at: string;
};

export type MissionStats = {
  total_missions: number;
  active_missions: number;
  inactive_missions: number;
};

export type MissionListMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  stats: MissionStats;
};

export type MissionListResponse = {
  success: boolean;
  data: Mission[];
  meta: MissionListMeta;
};

export type MissionResponse = {
  success: boolean;
  message?: string;
  data: Mission;
};

export type DeleteMissionResponse = {
  success: boolean;
  message: string;
  id: number | string;
};