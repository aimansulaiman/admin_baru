export type Store = {
  id: number;

  name: string | null;
  title: string | null;
  image: string | null;

  email: string | null;
  phone_number: string | null;
  address: string | null;

  opening_hours: string | null;
  closing_hours: string | null;
  description: string | null;

  manager_name: string | null;
  manager_contact: string | null;
  website: string | null;
  prefix: string | null;

  active: boolean;

  loyalty_client_id: number | null;
  client_name: string | null;
  client_domain_name: string | null;

  created_at: string;
  updated_at: string;
};

export type StoreStats = {
  total_stores: number;
  active_stores: number;
  inactive_stores: number;
};

export type StoreListMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  stats: StoreStats;
};

export type StoreListResponse = {
  success: boolean;
  data: Store[];
  meta: StoreListMeta;
};

export type StoreResponse = {
  success: boolean;
  message?: string;
  data: Store;
};

export type DeleteStoreResponse = {
  success: boolean;
  message: string;
  id: number | string;
};