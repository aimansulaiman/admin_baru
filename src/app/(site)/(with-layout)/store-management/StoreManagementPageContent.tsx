"use client";

import {
  useGetStoreManagementOrdersQuery,
  useGetStoreManagementSummaryQuery,
} from "@/app/api/rtk/storeManagementApi";
import { useGetStoresQuery } from "@/app/api/rtk/storeApi";
import CustomerStyleTable from "@/components/common/CustomerStyleTable";
import type { Store } from "@/types/store";
import { useEffect, useMemo, useState } from "react";

const moneyFormatter = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
});

const StoreManagementPageContent = () => {
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");

  const domainName = process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME || "MULA";

  const storeQueryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("domain_name", domainName);
    params.set("per_page", "100");

    return `?${params.toString()}`;
  }, [domainName]);

  const {
    data: storesResponse,
    isLoading: isStoresLoading,
    isError: isStoresError,
    refetch: refetchStores,
  } = useGetStoresQuery(storeQueryString, {
    pollingInterval: 10000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const stores = storesResponse?.data || [];

  useEffect(() => {
    if (!selectedStoreId && stores.length > 0) {
      setSelectedStoreId(String(stores[0].id));
    }
  }, [selectedStoreId, stores]);

  const currentStore = useMemo(() => {
    return stores.find((store) => String(store.id) === selectedStoreId) || null;
  }, [stores, selectedStoreId]);

  const dashboardQueryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("domain_name", domainName);

    if (selectedStoreId) {
      params.set("store_id", selectedStoreId);
    }

    return `?${params.toString()}`;
  }, [domainName, selectedStoreId]);

  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    refetch: refetchSummary,
  } = useGetStoreManagementSummaryQuery(dashboardQueryString, {
    pollingInterval: 10000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: !selectedStoreId,
  });

  const {
    data: orders,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useGetStoreManagementOrdersQuery(dashboardQueryString, {
    pollingInterval: 10000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: !selectedStoreId,
  });

  const pendingOrders = useMemo(() => {
    return filterOrdersByStatus(orders || [], ["pending"]);
  }, [orders]);

  const preparingOrders = useMemo(() => {
    return filterOrdersByStatus(orders || [], ["preparing", "processing"]);
  }, [orders]);

  const readyOrders = useMemo(() => {
    return filterOrdersByStatus(orders || [], [
      "ready",
      "ready_for_pickup",
      "ready for pickup",
    ]);
  }, [orders]);

  const handleRefresh = () => {
    refetchStores();

    if (selectedStoreId) {
      refetchSummary();
      refetchOrders();
    }
  };

  const isLoading = isStoresLoading || isSummaryLoading || isOrdersLoading;
  const isError = isStoresError || isSummaryError || isOrdersError;

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
          Loading store management data...
        </p>
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="mb-4 text-sm font-medium text-red">
          Failed to load store management data.
        </p>

        <button
          type="button"
          onClick={handleRefresh}
          className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark dark:text-white">
            Store Management
          </h1>

          <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
            Main dashboard for monitoring store activity, orders, revenue,
            products, and customers. Data automatically updates every 10
            seconds.
          </p>
        </div>

        <div className="text-sm font-medium text-dark-5 dark:text-dark-6">
          Dashboard /{" "}
          <span className="font-semibold text-primary">Store Management</span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusSummaryCard
          title="Pending Orders"
          value={summary.pendingOrders || pendingOrders.length}
          icon="◷"
          accent="red"
        />

        <StatusSummaryCard
          title="Preparing"
          value={preparingOrders.length}
          icon="♨"
          accent="yellow"
        />

        <StatusSummaryCard
          title="Ready for Pickup"
          value={readyOrders.length}
          icon="✓"
          accent="green"
        />

        <StatusSummaryCard
          title="Today's Revenue"
          value={moneyFormatter.format(summary.totalRevenue || 0)}
          icon="$"
          accent="blue"
        />
      </section>

      <section className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">
              Store Dashboard
            </h2>

            <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
              Select client and store to view order activity.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-opacity-90"
          >
            Refresh
          </button>
        </div>
      </section>

      <section className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="grid gap-5 xl:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Select Client
            </label>

            <select
              value={domainName}
              disabled
              className="w-full rounded-lg border border-stroke bg-white px-4 py-3 text-sm text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value={domainName}>{domainName}</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Select Store
            </label>

            <select
              value={selectedStoreId}
              onChange={(event) => setSelectedStoreId(event.target.value)}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-3 text-sm text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              {stores.length > 0 ? (
                stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {getStoreDisplayName(store)}
                  </option>
                ))
              ) : (
                <option value="">No stores found</option>
              )}
            </select>
          </div>
        </div>

        <p className="mt-4 text-xs text-dark-5 dark:text-dark-6">
          Data will refresh automatically every 10 seconds.
        </p>
      </section>

      {currentStore && (
        <section className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <h3 className="text-base font-bold text-dark dark:text-white">
            Current Store
          </h3>

          <div className="mt-4 rounded-lg border border-stroke bg-gray-2 p-4 dark:border-dark-3 dark:bg-dark-2">
            <p className="text-sm font-semibold text-dark dark:text-white">
              {getStoreDisplayName(currentStore)}
            </p>

            <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
              Address: {currentStore.address || "-"}
            </p>

            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              Email: {currentStore.email || "-"}
            </p>

            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              Phone: {currentStore.phone_number || "-"}
            </p>
          </div>
        </section>
      )}

      <section className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stroke px-6 py-5 dark:border-dark-3">
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">
              Order Management
            </h2>

            <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
              View latest order activity for the selected store.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-opacity-90"
          >
            Refresh
          </button>
        </div>

        <div className="border-b border-stroke px-6 py-5 dark:border-dark-3">
          <div className="flex flex-wrap gap-3">
            <OrderTab
              label="Pending Orders"
              count={summary.pendingOrders || pendingOrders.length}
            />

            <OrderTab label="Preparing" count={preparingOrders.length} />

            <OrderTab label="Ready for Pickup" count={readyOrders.length} />
          </div>
        </div>

        <CustomerStyleTable minWidth="760px">
          <thead>
            <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
              <th className="px-6 py-4 font-medium text-dark dark:text-white">
                ORDER
              </th>

              <th className="px-6 py-4 font-medium text-dark dark:text-white">
                CUSTOMER
              </th>

              <th className="px-6 py-4 font-medium text-dark dark:text-white">
                STATUS
              </th>

              <th className="px-6 py-4 font-medium text-dark dark:text-white">
                AMOUNT
              </th>

              <th className="px-6 py-4 font-medium text-dark dark:text-white">
                DATE
              </th>
            </tr>
          </thead>

          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-stroke last:border-b-0 dark:border-dark-3"
                >
                  <td className="px-6 py-4 text-sm font-medium text-dark dark:text-white">
                    {order.order_number || `#${order.id}`}
                  </td>

                  <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
                    {order.customer_name || "-"}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-dark dark:text-white">
                    {moneyFormatter.format(order.total_amount || 0)}
                  </td>

                  <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
                    {formatDate(order.created_at)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-dark-5 dark:text-dark-6"
                >
                  No paid orders.
                </td>
              </tr>
            )}
          </tbody>
        </CustomerStyleTable>
      </section>
    </div>
  );
};

const StatusSummaryCard = ({
  title,
  value,
  icon,
  accent,
}: {
  title: string;
  value: string | number;
  icon: string;
  accent: "red" | "yellow" | "green" | "blue";
}) => {
  const accentClass = {
    red: "text-red",
    yellow: "text-[#f59e0b]",
    green: "text-[#10b981]",
    blue: "text-primary",
  }[accent];

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
            {title}
          </p>

          <h3 className={`mt-3 text-2xl font-bold ${accentClass}`}>
            {value}
          </h3>
        </div>

        <div className={`text-3xl leading-none ${accentClass}`}>{icon}</div>
      </div>
    </div>
  );
};

const OrderTab = ({ label, count }: { label: string; count: number }) => {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-3 py-2 text-sm font-medium text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white">
      <span className="flex size-5 items-center justify-center rounded bg-primary text-xs font-bold text-white">
        {count}
      </span>

      {label}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string | null }) => {
  const normalizedStatus = status || "unknown";

  return (
    <span className="rounded-full bg-gray-2 px-3 py-1 text-xs font-medium capitalize text-dark-5 dark:bg-dark-2 dark:text-dark-6">
      {normalizedStatus.replaceAll("_", " ")}
    </span>
  );
};

const getStoreDisplayName = (store: Store) => {
  return store.title || store.name || `Store #${store.id}`;
};

const filterOrdersByStatus = (
  orders: { status: string | null }[],
  statuses: string[],
) => {
  return orders.filter((order) => {
    const currentStatus = (order.status || "").toLowerCase();

    return statuses.includes(currentStatus);
  });
};

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString();
};

export default StoreManagementPageContent;