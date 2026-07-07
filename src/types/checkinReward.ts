export type CheckinReward = {
  id: number;

  day_number: number | string | null;
  day: number | string | null;

  points_reward: number | string | null;
  points: number | string | null;

  bonus_points: number | string | null;
  reward_type: string | null;
  reward_config: string | null;
  is_milestone: boolean;

  active: boolean;
  status: boolean;

  loyalty_client_id: number | null;
  client_name: string | null;
  client_domain_name: string | null;

  created_at: string;
  updated_at: string;
};

export type CheckinRewardStats = {
  total_checkin_rewards: number;
  active_checkin_rewards: number;
  inactive_checkin_rewards: number;
};

export type CheckinRewardListMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  stats: CheckinRewardStats;
};

export type CheckinRewardListResponse = {
  success: boolean;
  data: CheckinReward[];
  meta: CheckinRewardListMeta;
};

export type CheckinRewardResponse = {
  success: boolean;
  message?: string;
  data: CheckinReward;
};

export type CreateCheckinRewardInput = {
  day_number: number | string;
  points_reward: number | string;
  bonus_points?: number | string;
  reward_type?: string;
  reward_config?: string;
  is_milestone?: boolean;
  active?: boolean;
};

export type UpdateCheckinRewardInput = {
  day_number?: number | string;
  points_reward?: number | string;
  bonus_points?: number | string;
  reward_type?: string;
  reward_config?: string;
  is_milestone?: boolean;
  active?: boolean;
};

export type DeleteCheckinRewardResponse = {
  success: boolean;
  message: string;
  id: number | string;
};