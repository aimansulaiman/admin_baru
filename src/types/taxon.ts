export type Taxon = {
  id: number;
  name: string | null;

  loyalty_client_id: number | null;
  client_name: string | null;
  client_domain_name: string | null;

  sub_taxons_count?: number;

  created_at: string;
  updated_at: string;
};

export type SubTaxon = {
  id: number;
  name: string | null;
  category: string | null;

  loyalty_taxon_id: number | null;
  taxon_name: string | null;

  loyalty_client_id: number | null;
  client_name: string | null;
  client_domain_name: string | null;

  created_at: string;
  updated_at: string;
};

export type TaxonListMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
};

export type SubTaxonListMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
};

export type TaxonListResponse = {
  success: boolean;
  data: Taxon[];
  meta: TaxonListMeta;
};

export type TaxonResponse = {
  success: boolean;
  message?: string;
  data: Taxon;
};

export type SubTaxonListResponse = {
  success: boolean;
  data: SubTaxon[];
  meta: SubTaxonListMeta;
};

export type SubTaxonResponse = {
  success: boolean;
  message?: string;
  data: SubTaxon;
};

export type CreateTaxonInput = {
  name: string;
};

export type UpdateTaxonInput = {
  name?: string;
};

export type CreateSubTaxonInput = {
  name: string;
  category?: string;
  loyalty_taxon_id: number;
};

export type UpdateSubTaxonInput = {
  name?: string;
  category?: string;
  loyalty_taxon_id?: number;
};

export type DeleteTaxonResponse = {
  success: boolean;
  message: string;
  id: number | string;
};

export type DeleteSubTaxonResponse = {
  success: boolean;
  message: string;
  id: number | string;
};