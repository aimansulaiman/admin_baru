export type Customer = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  dob: string | null;
  gender: string | null;
  customer_number: string | null;
  active: boolean;

  loyalty_client_id: number | null;
  client_name: string | null;
  client_domain_name: string | null;

  cards_count?: number;
  orders_count?: number;
  transactions_count?: number;
  total_points?: number;

  created_at: string;
  updated_at: string;
};

export type CustomerListMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
};

export type CustomerListResponse = {
  success: boolean;
  data: Customer[];
  meta: CustomerListMeta;
};

export type CustomerResponse = {
  success: boolean;
  message?: string;
  data: Customer;
};

export type CreateCustomerInput = {
  first_name: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  dob?: string;
  gender?: string;
  customer_number?: string;
  active?: boolean;
};

export type UpdateCustomerInput = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  dob?: string;
  gender?: string;
  customer_number?: string;
  active?: boolean;
};

export type DeleteCustomerResponse = {
  success: boolean;
  message: string;
  id: number | string;
};