import type { Product } from "./product";

export type InventorySizePricing = Record<string, number | string>;

export type InventoryModifier = {
  id: number;
  store_id: number | null;
  store_name: string | null;

  product_id: number | null;
  loyalty_client_id: number | null;

  price: number | string | null;
  stock: number | string | null;
  is_available: boolean | null;

  item_category: string | null;
  size_pricing: InventorySizePricing;

  created_at: string;
  updated_at: string;
};

export type InventoryListResponse = {
  success: boolean;
  data: InventoryModifier[];
  product: Product;
};

export type InventoryResponse = {
  success: boolean;
  message?: string;
  data: InventoryModifier;
};

export type DeleteInventoryResponse = {
  success: boolean;
  message: string;
  id: number | string;
};

export type CreateInventoryInput = {
  store_id: string;
  price: string;
  stock: string;
  is_available: boolean;
  size_pricing: InventorySizePricing;
};

export type UpdateInventoryInput = {
  store_id?: string;
  price?: string;
  stock?: string;
  is_available?: boolean;
  size_pricing?: InventorySizePricing;
};