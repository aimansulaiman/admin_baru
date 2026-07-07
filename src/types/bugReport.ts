export type BugReport = {
  id: number;

  user_id: number | null;
  loyalty_client_id: number | null;

  title: string;
  description: string;

  priority: string;
  status: string;
  category: string;

  url_path: string | null;
  browser_info: string | null;
  steps_to_reproduce: string | null;
  expected_behavior: string | null;
  actual_behavior: string | null;

  attachments: string | null;
  assigned_to_id: number | null;
  admin_notes: string | null;
  resolved_at: string | null;

  client_name: string | null;
  client_domain_name: string | null;

  created_at: string;
  updated_at: string;
};

export type BugReportStats = {
  total_reports: number;
  open: number;
  in_progress: number;
  resolved: number;
  high_priority: number;
};

export type BugReportListMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
};

export type BugReportListResponse = {
  success: boolean;
  data: BugReport[];
  meta: BugReportListMeta;
  stats: BugReportStats;
};

export type BugReportResponse = {
  success: boolean;
  message?: string;
  data: BugReport;
};

export type BugReportFilters = {
  domainName?: string;
  page?: number;
  perPage?: number;
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
};

export type CreateBugReportInput = {
  title: string;
  description: string;
  priority: string;
  category: string;
  url_path?: string;
  browser_info?: string;
  steps_to_reproduce?: string;
  expected_behavior?: string;
  actual_behavior?: string;
  admin_notes?: string;
};

export type UpdateBugReportInput = {
  priority?: string;
  status?: string;
  category?: string;
  assigned_to_id?: number | null;
  admin_notes?: string;
};