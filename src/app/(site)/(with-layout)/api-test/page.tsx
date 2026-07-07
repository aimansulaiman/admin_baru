import { getDashboardSummary } from "@/api/dashboardApi";

export default async function ApiTestPage() {
  const summary = await getDashboardSummary();

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h1 className="mb-6 text-2xl font-bold text-dark dark:text-white">
        API Test Page
      </h1>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-stroke p-4 dark:border-dark-3">
          <p className="text-sm">Total Users</p>
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            {summary.totalUsers}
          </h2>
        </div>

        <div className="rounded-lg border border-stroke p-4 dark:border-dark-3">
          <p className="text-sm">Total Orders</p>
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            {summary.totalOrders}
          </h2>
        </div>

        <div className="rounded-lg border border-stroke p-4 dark:border-dark-3">
          <p className="text-sm">Total Revenue</p>
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            RM {summary.totalRevenue}
          </h2>
        </div>

        <div className="rounded-lg border border-stroke p-4 dark:border-dark-3">
          <p className="text-sm">Total Products</p>
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            {summary.totalProducts}
          </h2>
        </div>
      </div>
    </div>
  );
}