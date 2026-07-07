export type StatisticsClient = {
  id: number;
  name: string | null;
  domain_name: string | null;
};

export type StatisticsData = {
  client: StatisticsClient;
  total_customer: number;
  total_active_customers: number;
  total_customer_cards: number;
  total_transactions_this_month: number;
  total_points_distributed: number | string;
};

export type StatisticsResponse = {
  success: boolean;
  message?: string;
  data: StatisticsData;
};