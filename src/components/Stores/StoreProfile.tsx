"use client";

import { useGetStoreQuery } from "@/app/api/rtk/storeApi";
import Link from "next/link";

export default function StoreProfile({ id }: { id: number }) {
  const { data: store, isLoading, isError, refetch } = useGetStoreQuery(id);

  function formatNumber(value: number | string | null | undefined) {
    return Number(value || 0).toLocaleString();
  }

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        Loading store detail...
      </div>
    );
  }

  if (isError || !store) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="mb-3 text-red">Failed to load store detail.</p>

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
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-dark dark:text-white">
              {store.title || store.name || "Store Detail"}
            </h2>

            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              {store.description || "Store information and ordering summary."}
            </p>
          </div>

          <Link
            href="/stores"
            className="rounded-lg border border-stroke px-5 py-3 font-medium text-dark dark:border-dark-3 dark:text-white"
          >
            Back to Stores
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard title="Total Orders" value={store.orders_count} />
        <SummaryCard title="Orders Today" value={store.orders_today_count} />
        <SummaryCard title="Pending Orders" value={store.pending_orders_count} />
        <SummaryCard title="Today Revenue" value={store.today_revenue} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-6 py-4 dark:border-dark-3">
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Store Information
            </h3>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2">
            <InfoItem label="Store Name" value={store.name} />
            <InfoItem label="Title" value={store.title} />
            <InfoItem label="Email" value={store.email} />
            <InfoItem label="Phone Number" value={store.phone_number} />
            <InfoItem label="Website" value={store.website} />
            <InfoItem label="Prefix" value={store.prefix} />
            <InfoItem label="Opening Hours" value={store.opening_hours} />
            <InfoItem label="Closing Hours" value={store.closing_hours} />
            <InfoItem label="Manager Name" value={store.manager_name} />
            <InfoItem label="Manager Contact" value={store.manager_contact} />
            <InfoItem
              label="Status"
              value={store.active ? "Active" : "Inactive"}
            />
            <InfoItem label="Client" value={store.client_name} />

            <div className="md:col-span-2">
              <InfoItem label="Address" value={store.address} />
            </div>

            <div className="md:col-span-2">
              <InfoItem label="Description" value={store.description} />
            </div>
          </div>
        </div>

        <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-6 py-4 dark:border-dark-3">
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Order Status
            </h3>
          </div>

          <div className="space-y-4 p-6">
            <StatusRow label="Pending" value={store.pending_orders_count} />
            <StatusRow label="Preparing" value={store.preparing_orders_count} />
            <StatusRow label="Ready" value={store.ready_orders_count} />
            <StatusRow label="Total Orders" value={store.orders_count} />
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
    <div className="rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
        {title}
      </p>

      <h3 className="mt-2 text-2xl font-bold text-dark dark:text-white">
        {Number(value || 0).toLocaleString()}
      </h3>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | null | undefined;
}) {
  return (
    <div className="rounded-lg border border-stroke bg-gray-2 px-5 py-4 dark:border-dark-3 dark:bg-dark-2">
      <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
        {label}
      </p>

      <p className="mt-2 break-words font-semibold text-dark dark:text-white">
        {value || "-"}
      </p>
    </div>
  );
}

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: number | string | null | undefined;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-stroke px-4 py-3 dark:border-dark-3">
      <span className="font-medium text-dark dark:text-white">{label}</span>

      <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
        {Number(value || 0).toLocaleString()}
      </span>
    </div>
  );
}