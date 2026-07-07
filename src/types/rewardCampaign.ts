export type RewardCampaign = {
  id: number;

  title: string | null;
  points: number | string | null;
  image: string | null;

  code: string | null;
  usage_limit: number | string | null;
  used_count: number | string | null;
  claimed_count: number | string | null;

  discount_type: "percentage" | "fixed" | string | null;
  discount_value: number | string | null;
  min_order_amount: number | string | null;

  start_date: string | null;
  end_date: string | null;
  description: string | null;
  status: boolean | string | null;

  loyalty_clients_id: number | null;
  loyalty_client_id?: number | null;
  client_name: string | null;
  client_domain_name: string | null;

  created_at: string;
  updated_at: string;
};

export type RewardCampaignStats = {
  total_campaigns?: number;
  active_campaigns?: number;
  inactive_campaigns?: number;
  percentage_campaigns?: number;
  fixed_campaigns?: number;
};

export type RewardCampaignListMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  stats?: RewardCampaignStats;
};

export type RewardCampaignListResponse = {
  success: boolean;
  data: RewardCampaign[];
  meta: RewardCampaignListMeta;
};

export type RewardCampaignResponse = {
  success: boolean;
  message?: string;
  data: RewardCampaign;
};

export type CreateRewardCampaignInput = {
  title: string;
  points?: number | string;
  image?: string;
  code?: string;
  usage_limit?: number | string;
  discount_type?: string;
  discount_value?: number | string;
  min_order_amount?: number | string;
  start_date?: string;
  end_date?: string;
  description?: string;
};

export type UpdateRewardCampaignInput = {
  title?: string;
  points?: number | string;
  image?: string;
  code?: string;
  usage_limit?: number | string;
  discount_type?: string;
  discount_value?: number | string;
  min_order_amount?: number | string;
  start_date?: string;
  end_date?: string;
  description?: string;
};

export type DeleteRewardCampaignResponse = {
  success: boolean;
  message: string;
  id: number | string;
};