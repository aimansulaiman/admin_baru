"use client";

import { useGetStatisticsQuery } from "@/app/api/rtk/statisticsApi";
import { useMemo } from "react";

export default function StatisticsCards() {
  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set(
      "domain_name",
      process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME || "MULA",
    );

    return `?${params.toString()}`;
  }, []);

  const { data, isLoading, isError, refetch } =
    useGetStatisticsQuery(queryString);

  const statistics = data?.data;

  function formatNumber(value: number | string | null | undefined) {
    return Number(value || 0).toLocaleString();
  }

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        Loading statistics...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="mb-3 text-red">Failed to load statistics.</p>

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

  return (
    <div className="space-y-6">
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <h2 className="text-xl font-semibold text-dark dark:text-white">
          Statistics MULA
        </h2>

        <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
          Summary data loaded from old Ruby on Rails website using RTK Query.
        </p>

        <div className="mt-4 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          Client: {statistics?.client?.name || "-"} (
          {statistics?.client?.domain_name || "-"})
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
            Total Customers
          </p>

          <h3 className="mt-3 text-3xl font-bold text-dark dark:text-white">
            {formatNumber(statistics?.total_customer)}
          </h3>
        </div>

        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
            Active Customers
          </p>

          <h3 className="mt-3 text-3xl font-bold text-dark dark:text-white">
            {formatNumber(statistics?.total_active_customers)}
          </h3>
        </div>

        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
            Customer Cards
          </p>

          <h3 className="mt-3 text-3xl font-bold text-dark dark:text-white">
            {formatNumber(statistics?.total_customer_cards)}
          </h3>
        </div>

        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
            Transactions This Month
          </p>

          <h3 className="mt-3 text-3xl font-bold text-dark dark:text-white">
            {formatNumber(statistics?.total_transactions_this_month)}
          </h3>
        </div>

        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
            Total Points Distributed
          </p>

          <h3 className="mt-3 text-3xl font-bold text-dark dark:text-white">
            {formatNumber(statistics?.total_points_distributed)}
          </h3>
        </div>
      </div>
    </div>
  );
}