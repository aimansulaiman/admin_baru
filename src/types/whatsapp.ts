export type WhatsappCounts = {
  all: number;
  sent: number;
  queue: number;
  unsent: number;
  expired: number;
};

export type WhatsappRecipient = {
  id: number;
  name: string | null;
  ic_number: string | null;
  birthday: string | null;
  age: number | null;
  phone_number: string | null;
  pdm: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
};

export type WhatsappData = {
  total_update_counts: WhatsappCounts;
  recent_update_counts: WhatsappCounts;
  recipients: WhatsappRecipient[];
};

export type WhatsappMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
};

export type WhatsappResponse = {
  success: boolean;
  data: WhatsappData;
  meta: WhatsappMeta;
};

export type SendWhatsappInput = {
  phone_numbers: string;
  message_body: string;
  image_url?: string;
};

export type SendWhatsappResponse = {
  success: boolean;
  message: string;
  data?: {
    queued_count: number;
    counts: WhatsappCounts;
  };
};