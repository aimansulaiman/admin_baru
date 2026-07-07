import type { DashboardSummary } from "@/types/dashboard";
import { apiRequest } from "./setup";

type DashboardSummaryResponse = {
  success: boolean;
  data: DashboardSummary;
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const result = await apiRequest<DashboardSummaryResponse>(
    "/api/dashboard/summary",
  );

  return result.data;
}