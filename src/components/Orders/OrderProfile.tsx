"use client";

import { useGetOrderQuery } from "@/app/api/rtk/orderApi";
import Link from "next/link";

export default function OrderProfile({ id }: { id: number }) {
  const { data: order, isLoading, isError, refetch } = useGetOrderQuery(id);

  function money(value: number | string | null | undefined) {
    return `RM ${Number(value || 0).toFixed(2)}`;
  }

  function formatDate(value: string | null | undefined) {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString();
  }

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        Loading order detail...
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="mb-3 text-red">Failed to load order detail.</p>

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
const orderAny: any = order;
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-dark dark:text-white">
              Order {order.order_number}
            </h2>

            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              Order detail, customer information and purchased items.
            </p>
          </div>

          <Link
            href="/orders"
            className="rounded-lg border border-stroke px-5 py-3 font-medium text-dark dark:border-dark-3 dark:text-white"
          >
            Back to Orders
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard title="Total Price" value={money(orderAny.total_price)} />
        <SummaryCard title="Reward Discount" value={money(orderAny.reward_discount)} />
        <SummaryCard title="Final Total" value={money(orderAny.final_total)} />
        <SummaryCard title="Items" value={order.items_count} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <InfoSection
          title="Order Information"
          items={[
            ["Order Number", order.order_number],
            ["Status", orderAny.status_label || order.status],            ["Payment Status", order.payment_status],
            ["Payment Provider", orderAny.payment_provider],
            ["Payment Amount", money(orderAny.payment_amount)],
            ["Bill Amount", money(orderAny.bill_amount)],
            ["Created At", formatDate(order.created_at)],
            ["Updated At", formatDate(order.updated_at)],
          ]}
        />

        <InfoSection
          title="Customer & Store"
          items={[
            ["Customer Name", order.customer_name],
            ["Customer Email", order.customer_email],
            ["Customer Phone", orderAny.customer_phone_number],
            ["Store Name", order.store_name],
            ["Client Name", order.client_name],
            ["Client Domain", order.client_domain_name],
            ["Cancellation Reason", order.cancellation_reason],
            ["Deleted At", formatDate(order.deleted_at)],
          ]}
        />
      </div>

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke px-6 py-4 dark:border-dark-3">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Order Items
          </h3>
        </div>

        <div className="overflow-x-auto p-6">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Unit Price</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Preference</th>
              </tr>
            </thead>

            <tbody>
              {(order.line_items || []).map((item:any) => (
                <tr
                  key={item.id}
                  className="border-b border-stroke last:border-b-0 dark:border-dark-3"
                >
                  <td className="px-6 py-4 font-medium text-dark dark:text-white">
                    {item.item_name || "-"}
                  </td>

                  <td className="px-6 py-4">{item.item_type || "-"}</td>

                  <td className="px-6 py-4">{item.quantity}</td>

                  <td className="px-6 py-4">{money(item.unit_price)}</td>

                  <td className="px-6 py-4">{money(item.total_price)}</td>

                  <td className="px-6 py-4">
                    {[item.size, item.temperature, item.sugar, item.ice, item.note]
                      .filter(Boolean)
                      .join(" | ") || "-"}
                  </td>
                </tr>
              ))}

              {(order.line_items || []).length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-dark-5 dark:text-dark-6"
                  >
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
        {title}
      </p>

      <h3 className="mt-2 text-2xl font-bold text-dark dark:text-white">
        {value || "-"}
      </h3>
    </div>
  );
}

function InfoSection({
  title,
  items,
}: {
  title: string;
  items: [string, string | number | null | undefined][];
}) {
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="border-b border-stroke px-6 py-4 dark:border-dark-3">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          {title}
        </h3>
      </div>

      <div className="grid gap-4 p-6 md:grid-cols-2">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-stroke bg-gray-2 px-5 py-4 dark:border-dark-3 dark:bg-dark-2"
          >
            <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
              {label}
            </p>

            <p className="mt-2 break-words font-semibold text-dark dark:text-white">
              {value || "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}