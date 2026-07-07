export type OrderLineItem = {
  id: number;
  product_id: number | null;
  merchandise_id: number | null;
  product_name: string | null;
  merchandise_name: string | null;
  quantity: number;
  price: number | string | null;
  subtotal: number | string | null;
};

export type Order = {
  id: number;
  order_number: string | null;

  loyalty_customer_id: number | null;
  customer_name: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;

  store_id: number | null;
  store_name: string | null;

  total_amount: number | string | null;
  subtotal?: number | string | null;
  tax_amount?: number | string | null;
  discount_amount?: number | string | null;

  status: string | null;
  payment_status: string | null;
  payment_method?: string | null;

  items_count: number;
  line_items?: OrderLineItem[];

  cancellation_reason?: string | null;
  deleted_at?: string | null;

  loyalty_client_id: number | null;
  client_name: string | null;
  client_domain_name: string | null;

  created_at: string;
  updated_at: string;
};

export type OrderStats = {
  total_orders?: number;
  pending_orders?: number;
  completed_orders?: number;
  cancelled_orders?: number;
  total_sales?: number | string;
};

export type OrderListMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  stats?: OrderStats;
};

export type OrderListResponse = {
  success: boolean;
  data: Order[];
  meta: OrderListMeta;
};

export type OrderResponse = {
  success: boolean;
  message?: string;
  data: Order;
};

export type UpdateOrderInput = {
  status?: string;
  payment_status?: string;
  cancellation_reason?: string;
};

export type DeleteOrderResponse = {
  success: boolean;
  message: string;
  id: number | string;
};