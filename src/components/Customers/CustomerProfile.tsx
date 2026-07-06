"use client";

import { useGetCustomerQuery } from "@/app/api/rtk/customerApi";
import Link from "next/link";

export default function CustomerProfile({ id }: { id: number }) {
  const { data: customer, isLoading, isError, refetch } = useGetCustomerQuery(id);

  function formatNumber(value: number | string | null | undefined) {
    return Number(value || 0).toLocaleString();
  }

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        Loading customer profile...
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="mb-3 text-red">Failed to load customer profile.</p>

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

  const initials = customer.full_name
    ? customer.full_name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CU";

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="p-6 text-center">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 text-4xl font-bold text-primary">
            {initials}
          </div>

          <h2 className="mt-5 text-xl font-semibold text-dark dark:text-white">
            {customer.full_name || "-"}
          </h2>

          <div className="mt-3 space-y-1 text-sm text-dark-5 dark:text-dark-6">
            <p>Gender: {customer.gender || "-"}</p>
            <p>Customer Number: {customer.customer_number || "-"}</p>
            <p>Email: {customer.email || "-"}</p>
            <p>Date of Birth: {customer.dob || "-"}</p>
            <p>Phone: {customer.phone_number || "-"}</p>
          </div>

          <Link
            href="/customers"
            className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 font-medium text-white"
          >
            Back to Customer List
          </Link>
        </div>

        <div className="grid grid-cols-2 border-t border-stroke dark:border-dark-3">
          <div className="border-r border-stroke p-5 text-center dark:border-dark-3">
            <p className="text-2xl font-bold text-dark dark:text-white">
              {formatNumber(customer.total_cards)}
            </p>

            <p className="text-sm text-dark-5 dark:text-dark-6">Total Cards</p>
          </div>

          <div className="p-5 text-center">
            <p className="text-2xl font-bold text-dark dark:text-white">
              {formatNumber(customer.current_total_points)}
            </p>

            <p className="text-sm text-dark-5 dark:text-dark-6">
              Current Points
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke bg-primary px-6 py-4 dark:border-dark-3">
          <h3 className="font-semibold text-white">Customer Management</h3>
        </div>

        <div className="p-6">
          <div className="mb-6 flex flex-wrap gap-4 border-b border-stroke pb-4 dark:border-dark-3">
            <span className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              Points Summary
            </span>

            <span className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              {customer.total_cards} Customer Cards
            </span>

            <span className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              {customer.total_transactions} Transaction History
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Points Earned This Year"
              value={customer.points_earned_this_year}
            />

            <SummaryCard
              title="Points Deducted This Year"
              value={customer.points_deducted_this_year}
            />

            <SummaryCard
              title="Net Points This Year"
              value={customer.net_points_this_year}
            />

            <SummaryCard
              title="Current Total Points"
              value={customer.current_total_points}
            />
          </div>

          <div className="mt-8">
            <h4 className="mb-4 font-semibold text-dark dark:text-white">
              Customer Cards
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
                    <th className="px-6 py-4">Card Number</th>
                    <th className="px-6 py-4">Balance</th>
                    <th className="px-6 py-4">Points</th>
                  </tr>
                </thead>

                <tbody>
                  {(customer.cards || []).map((card) => (
                    <tr
                      key={card.id}
                      className="border-b border-stroke last:border-b-0 dark:border-dark-3"
                    >
                      <td className="px-6 py-4">{card.card_number || "-"}</td>
                      <td className="px-6 py-4">{formatNumber(card.balance)}</td>
                      <td className="px-6 py-4">{formatNumber(card.points)}</td>
                    </tr>
                  ))}

                  {(customer.cards || []).length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-6 text-center text-dark-5 dark:text-dark-6"
                      >
                        No cards found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="mb-4 font-semibold text-dark dark:text-white">
              Recent Transaction History
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Points</th>
                  </tr>
                </thead>

                <tbody>
                  {(customer.recent_transactions || []).map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-stroke last:border-b-0 dark:border-dark-3"
                    >
                      <td className="px-6 py-4">
                        {transaction.description || "-"}
                      </td>

                      <td className="px-6 py-4">
                        {transaction.transaction_type || "-"}
                      </td>

                      <td className="px-6 py-4">
                        {formatNumber(transaction.amount)}
                      </td>

                      <td className="px-6 py-4">
                        {formatNumber(transaction.points)}
                      </td>
                    </tr>
                  ))}

                  {(customer.recent_transactions || []).length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-6 text-center text-dark-5 dark:text-dark-6"
                      >
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number | string | null | undefined;
}) {
  return (
    <div className="rounded-[10px] bg-primary/10 p-6 text-center">
      <p className="text-3xl font-bold text-primary">
        {Number(value || 0).toLocaleString()}
      </p>

      <p className="mt-3 text-sm font-medium text-dark dark:text-white">
        {title}
      </p>
    </div>
  );
}