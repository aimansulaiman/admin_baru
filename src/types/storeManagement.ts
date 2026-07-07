export type StoreManagementSummary = {
  totalStores: number;
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
};

export type StoreManagementOrder = {
  id: number;
  order_number: string | null;
  customer_name: string | null;
  status: string | null;
  total_amount: number;
  created_at: string;
  updated_at: string;
};

export type StoreManagementSummaryResponse = {
  success: boolean;
  data: StoreManagementSummary;
};

export type StoreManagementOrdersResponse = {
  success: boolean;
  data: StoreManagementOrder[];
};