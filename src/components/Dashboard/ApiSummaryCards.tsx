"use client";

import { useGetDashboardSummaryQuery } from "@/app/api/rtk/dashboardApi";

export default function ApiSummaryCards() {
  const {
    data: summary,
    isLoading,
    isError,
    refetch,
  } = useGetDashboardSummaryQuery();

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="text-dark-5 dark:text-dark-6">
          Loading dashboard data...
        </p>
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="mb-3 text-red">Failed to load dashboard summary.</p>

        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: summary.totalUsers,
    },
    {
      title: "Total Orders",
      value: summary.totalOrders,
    },
    {
      title: "Total Revenue",
      value: `RM ${summary.totalRevenue}`,
    },
    {
      title: "Total Products",
      value: summary.totalProducts,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card"
        >
          <p className="mb-2 text-body-sm font-medium text-dark-6 dark:text-dark-4">
            {card.title}
          </p>

          <h4 className="text-heading-6 font-bold text-dark dark:text-white">
            {card.value}
          </h4>
        </div>
      ))}
    </div>
  );
}