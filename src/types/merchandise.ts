export type InventoryModifier = {
  id: number;
  name?: string | null;
  quantity?: number | string | null;
  stock?: number | string | null;
  created_at?: string;
  updated_at?: string;
};

export type Merchandise = {
  id: number;

  name: string | null;
  description: string | null;
  image: string | null;

  price: number | string | null;
  harga: number | string | null;
  display_price: string | null;

  start_date: string | null;
  end_date: string | null;

  active: boolean;
  currently_active?: boolean;

  loyalty_client_id: number | null;
  loyalty_clients_id?: number | null;
  client_name: string | null;
  client_domain_name: string | null;

  inventory_modifiers?: InventoryModifier[];

  created_at: string;
  updated_at: string;
};

export type MerchandiseStats = {
  total_merchandises?: number;
  active_merchandises?: number;
  inactive_merchandises?: number;
  currently_active_merchandises?: number;
};

export type MerchandiseListMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  stats?: MerchandiseStats;
};

export type MerchandiseListResponse = {
  success: boolean;
  data: Merchandise[];
  meta: MerchandiseListMeta;
};

export type MerchandiseResponse = {
  success: boolean;
  message?: string;
  data: Merchandise;
};

export type CreateMerchandiseInput = {
  name: string;
  description?: string;
  image?: string;
  price?: number | string;
  harga?: number | string;
  start_date?: string;
  end_date?: string;
  active?: boolean;
};

export type UpdateMerchandiseInput = {
  name?: string;
  description?: string;
  image?: string;
  price?: number | string;
  harga?: number | string;
  start_date?: string;
  end_date?: string;
  active?: boolean;
};

export type DeleteMerchandiseResponse = {
  success: boolean;
  message: string;
  id: number | string;
};