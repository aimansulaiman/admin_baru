import type { DashboardSummary } from "@/types/dashboard";

export async function GET() {
  const data: DashboardSummary = {
    totalUsers: 120,
    totalOrders: 58,
    totalRevenue: 2450,
    totalProducts: 34,
  };

  return Response.json({
    success: true,
    data,
  });
}