export type Product = {
  id: number;

  image: string | null;
  name: string | null;
  description: string | null;

  price: number | string | null;
  original_price: number | string | null;

  loyalty_taxon_id: number | null;
  loyalty_taxon_name: string | null;

  loyalty_sub_taxon_id: number | null;
  loyalty_sub_taxon_name: string | null;

  loyalty_client_id: number | null;
  client_name: string | null;
  client_domain_name: string | null;

  created_at: string;
  updated_at: string;
};

export type ProductForm = {
  name: string;
  description: string;
  price: string;
  loyalty_taxon_id: string;
  loyalty_sub_taxon_id: string;
  imageFile: File | null;
  imagePreview: string;
};

export type ProductStats = {
  total_products: number;
  with_taxon: number;
  without_taxon: number;
};

export type ProductListMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  stats: ProductStats;
};

export type ProductListResponse = {
  success: boolean;
  data: Product[];
  meta: ProductListMeta;
};

export type ProductResponse = {
  success: boolean;
  message?: string;
  data: Product;
};

export type DeleteProductResponse = {
  success: boolean;
  message: string;
  id: number | string;
};