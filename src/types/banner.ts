export type Banner = {
  id: number;

  title: string | null;
  name: string | null;
  image: string | null;

  display_position: number | string | null;
  position: number | string | null;

  active: boolean;
  status: boolean;

  loyalty_client_id: number | null;
  loyalty_clients_id?: number | null;
  client_name: string | null;
  client_domain_name: string | null;

  created_at: string;
  updated_at: string;
};

export type BannerStats = {
  total_banners: number;
  active_banners: number;
  inactive_banners: number;
};

export type BannerListMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  stats: BannerStats;
};

export type BannerListResponse = {
  success: boolean;
  data: Banner[];
  meta: BannerListMeta;
};

export type BannerResponse = {
  success: boolean;
  message?: string;
  data: Banner;
};

export type DeleteBannerResponse = {
  success: boolean;
  message: string;
  id: number | string;
};