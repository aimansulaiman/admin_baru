"use client";

import { useUpdateOrderMutation } from "@/app/api/rtk/orderApi";
import {
  useGetStoreManagementOrdersQuery,
  useGetStoreManagementSummaryQuery,
} from "@/app/api/rtk/storeManagementApi";
import { useGetStoresQuery } from "@/app/api/rtk/storeApi";
import CustomerStyleTable from "@/components/common/CustomerStyleTable";
import type { Store } from "@/types/store";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const moneyFormatter = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
});

type StoreManagementOrderLineItem = {
  id?: number | string;
  item_name?: string | null;
  name?: string | null;
  quantity?: number | string | null;
  note?: string | null;
};

type StoreManagementOrder = {
  id: number | string;
  order_number?: string | null;
  customer_name?: string | null;
  customer_full_name?: string | null;
  order_items?: StoreManagementOrderLineItem[];

  customer?: {
    full_name?: string | null;
    name?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    phone_number?: string | null;
  } | null;

  status?: string | null;
  store_id?: number | string | null;
  store_name?: string | null;

  total_amount?: number | string | null;
  final_total?: number | string | null;
  total_price?: number | string | null;
  payment_amount?: number | string | null;
  bill_amount?: number | string | null;

  created_at?: string | null;

  line_items?: StoreManagementOrderLineItem[];

  fulfillment_type?: string | null;
  table_number?: string | null;

  traffic_level?: string | null;
  estimated_minutes?: number | string | null;
  estimated_completion_at?: string | null;
};

const getOrderItemName = (
  item: StoreManagementOrderLineItem,
): string => {
  return (
    item.item_name ||
    item.name ||
    "Unknown item"
  );
};

const StoreManagementPageContent = () => {
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");

  const [activeOrderTab, setActiveOrderTab] = useState<
    "pending" | "preparing" | "ready"
  >("pending");

  const previousPendingOrderIdsRef = useRef<string[]>([]);
  const hasInitializedSoundRef = useRef(false);
  const previousSelectedStoreIdRef = useRef("");

  const newOrderAudioRef = useRef<HTMLAudioElement | null>(null);
  const isNewOrderSoundPlayingRef = useRef(false);

  const domainName =
    process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME || "MULA";

  const storeQueryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("domain_name", domainName);
    params.set("per_page", "100");

    return `?${params.toString()}`;
  }, [domainName]);

  const [updateOrder, { isLoading: isUpdatingOrder }] =
    useUpdateOrderMutation();

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
    return (
      stores.find((store) => String(store.id) === selectedStoreId) ||
      null
    );
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
    data: ordersResponse,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useGetStoreManagementOrdersQuery(dashboardQueryString, {
    pollingInterval: 10000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: !selectedStoreId,
  });

  const storeManagementOrders = useMemo(() => {
    const allOrders = normalizeOrdersResponse(ordersResponse);

    if (!selectedStoreId || !currentStore) {
      return allOrders;
    }

    const selectedStorePrefix = String(
      (currentStore as Store & { prefix?: string | null }).prefix || "",
    ).toLowerCase();

    const selectedStoreName =
      getStoreDisplayName(currentStore).toLowerCase();

    return allOrders.filter((order) => {
      const orderStoreId = String(order.store_id || "");

      if (orderStoreId) {
        return orderStoreId === String(selectedStoreId);
      }

      const orderNumber = String(
        order.order_number || "",
      ).toLowerCase();

      if (selectedStorePrefix) {
        return orderNumber.startsWith(selectedStorePrefix);
      }

      const orderStoreName = String(
        order.store_name || "",
      ).toLowerCase();

      if (orderStoreName) {
        return orderStoreName === selectedStoreName;
      }

      return false;
    });
  }, [ordersResponse, selectedStoreId, currentStore]);

  const pendingOrders = useMemo(() => {
    return filterOrdersByStatus(storeManagementOrders, [
      "paid",
      "pending",
    ]);
  }, [storeManagementOrders]);

  const preparingOrders = useMemo(() => {
    return filterOrdersByStatus(storeManagementOrders, [
      "preparing",
      "processing",
    ]);
  }, [storeManagementOrders]);

  const readyOrders = useMemo(() => {
    return filterOrdersByStatus(storeManagementOrders, [
      "pickup_or_deliver",
      "ready",
      "ready_for_pickup",
      "ready for pickup",
    ]);
  }, [storeManagementOrders]);

  const todaysRevenue = useMemo(() => {
    return storeManagementOrders
      .filter((order) => isToday(order.created_at))
      .filter((order) => {
        const currentStatus = String(
          order.status || "",
        ).toLowerCase();

        return [
          "paid",
          "pending",
          "preparing",
          "processing",
          "pickup_or_deliver",
          "ready",
          "ready_for_pickup",
          "completed",
        ].includes(currentStatus);
      })
      .reduce((total, order) => {
        return total + getOrderAmount(order);
      }, 0);
  }, [storeManagementOrders]);

  useEffect(() => {
    const currentPendingOrderIds = pendingOrders.map((order) =>
      String(order.id),
    );

    if (previousSelectedStoreIdRef.current !== selectedStoreId) {
      previousSelectedStoreIdRef.current = selectedStoreId;
      previousPendingOrderIdsRef.current = currentPendingOrderIds;
      hasInitializedSoundRef.current = true;

      if (currentPendingOrderIds.length > 0) {
        startNewOrderSound(
          newOrderAudioRef,
          isNewOrderSoundPlayingRef,
        );
      } else {
        stopNewOrderSound(
          newOrderAudioRef,
          isNewOrderSoundPlayingRef,
        );
      }

      return;
    }

    if (!hasInitializedSoundRef.current) {
      previousPendingOrderIdsRef.current = currentPendingOrderIds;
      hasInitializedSoundRef.current = true;

      if (currentPendingOrderIds.length > 0) {
        startNewOrderSound(
          newOrderAudioRef,
          isNewOrderSoundPlayingRef,
        );
      }

      return;
    }

    if (currentPendingOrderIds.length > 0) {
      startNewOrderSound(
        newOrderAudioRef,
        isNewOrderSoundPlayingRef,
      );
    } else {
      stopNewOrderSound(
        newOrderAudioRef,
        isNewOrderSoundPlayingRef,
      );
    }

    previousPendingOrderIdsRef.current = currentPendingOrderIds;
  }, [pendingOrders, selectedStoreId]);

  const activeTabOrders = useMemo(() => {
    if (activeOrderTab === "pending") {
      return pendingOrders;
    }

    if (activeOrderTab === "preparing") {
      return preparingOrders;
    }

    return readyOrders;
  }, [
    activeOrderTab,
    pendingOrders,
    preparingOrders,
    readyOrders,
  ]);

  const handleMoveOrder = async (
    orderId: number | string,
    nextStatus: string,
  ) => {
    try {
      if (nextStatus === "PREPARING") {
        stopNewOrderSound(
          newOrderAudioRef,
          isNewOrderSoundPlayingRef,
        );
      }

      await updateOrder({
        id: Number(orderId),
        data: {
          status: nextStatus,
        } as any,
      }).unwrap();

      refetchSummary();
      refetchOrders();
    } catch (error: any) {
      console.log("UPDATE ORDER STATUS ERROR:", error);

      alert(
        error?.data?.message ||
          error?.error ||
          error?.message ||
          "Failed to update order status.",
      );
    }
  };

  const handleSetTraffic = async (
    orderId: number | string,
    trafficLevel: "HIGH" | "MEDIUM" | "LOW",
  ) => {
    try {
      await updateOrder({
        id: Number(orderId),
        data: {
          traffic_level: trafficLevel,
        } as any,
      }).unwrap();

      await Promise.all([
        refetchSummary(),
        refetchOrders(),
      ]);
    } catch (error: any) {
      console.log("UPDATE TRAFFIC ERROR:", error);

      alert(
        error?.data?.error ||
          error?.data?.message ||
          error?.error ||
          error?.message ||
          "Failed to set estimated completion time.",
      );
    }
  };

  const handleRefresh = () => {
    refetchStores();

    if (selectedStoreId) {
      refetchSummary();
      refetchOrders();
    }
  };

  const isLoading =
    isStoresLoading ||
    isSummaryLoading ||
    isOrdersLoading;

  const isError =
    isStoresError ||
    isSummaryError ||
    isOrdersError;

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
            Main dashboard for monitoring store activity, orders,
            revenue, products, and customers. Data automatically
            updates every 10 seconds.
          </p>
        </div>

        <div className="text-sm font-medium text-dark-5 dark:text-dark-6">
          Dashboard /{" "}
          <span className="font-semibold text-primary">
            Store Management
          </span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusSummaryCard
          title="Pending Orders"
          value={pendingOrders.length}
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
          value={moneyFormatter.format(todaysRevenue)}
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
              <option value={domainName}>
                {domainName}
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Select Store
            </label>

            <select
              value={selectedStoreId}
              onChange={(event) =>
                setSelectedStoreId(event.target.value)
              }
              className="w-full rounded-lg border border-stroke bg-white px-4 py-3 text-sm text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              {stores.length > 0 ? (
                stores.map((store) => (
                  <option
                    key={store.id}
                    value={store.id}
                  >
                    {getStoreDisplayName(store)}
                  </option>
                ))
              ) : (
                <option value="">
                  No stores found
                </option>
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
              count={pendingOrders.length}
              isActive={activeOrderTab === "pending"}
              onClick={() =>
                setActiveOrderTab("pending")
              }
            />

            <OrderTab
              label="Preparing"
              count={preparingOrders.length}
              isActive={activeOrderTab === "preparing"}
              onClick={() =>
                setActiveOrderTab("preparing")
              }
            />

            <OrderTab
              label="Ready for Pickup"
              count={readyOrders.length}
              isActive={activeOrderTab === "ready"}
              onClick={() =>
                setActiveOrderTab("ready")
              }
            />
          </div>
        </div>

        <CustomerStyleTable minWidth="1200px">
  <thead>
    <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
      <th className="w-[120px] px-3 py-4 font-medium text-dark dark:text-white">
        ORDER
      </th>

      <th className="w-[130px] px-4 py-4 font-medium text-dark dark:text-white">
        CUSTOMER
      </th>

      <th className="w-[120px] whitespace-nowrap px-4 py-4 font-medium text-dark dark:text-white">
        TYPE
      </th>

      <th className="w-[70px] px-3 py-4 font-medium text-dark dark:text-white">
        TABLE
      </th>

      <th className="w-[230px] px-4 py-4 font-medium text-dark dark:text-white">
        ESTIMATED TIME
      </th>

      <th className="w-[230px] px-4 py-4 font-medium text-dark dark:text-white">
        ITEMS
      </th>

      <th className="w-[100px] whitespace-nowrap px-3 py-4 font-medium text-dark dark:text-white">
        AMOUNT
      </th>

      <th className="w-[110px] whitespace-nowrap px-3 py-4 font-medium text-dark dark:text-white">
        DATE
      </th>

      <th className="w-[150px] px-3 py-4 font-medium text-dark dark:text-white">
        ACTION
      </th>
    </tr>
  </thead>

  <tbody>
    {activeTabOrders.length > 0 ? (
      activeTabOrders.map((order) => (
        <tr
          key={order.id}
          className="border-b border-stroke last:border-b-0 dark:border-dark-3"
        >
          <td className="w-[120px] break-words px-3 py-5 text-sm font-medium text-dark dark:text-white">
            {order.order_number || `#${order.id}`}
          </td>

          <td className="w-[150px] px-4 py-4 text-sm text-dark-5 dark:text-dark-6">
            {getCustomerName(order)}
          </td>

          <td className="w-[120px] whitespace-nowrap px-4 py-5">
            <FulfillmentBadge value={order.fulfillment_type} />
          </td>

          <td className="w-[120px] px-3 py-4 text-sm text-dark-5 dark:text-dark-6">
            {String(order.fulfillment_type || "").toUpperCase() ===
            "DINE_IN"
              ? order.table_number || "-"
              : "-"}
          </td>

          <td className="w-[400px] px-4 py-4">
            <div className="min-w-[210px] space-y-3">
              <EstimatedTimeDisplay order={order} />

              <div className="flex flex-wrap gap-2">
  {[
    {
      level: "HIGH" as const,
      label: "High · 40m",
      activeClass: "bg-red text-white",
    },
    {
      level: "MEDIUM" as const,
      label: "Medium · 30m",
      activeClass: "bg-[#f59e0b] text-white",
    },
    {
      level: "LOW" as const,
      label: "Low · 20m",
      activeClass: "bg-[#10b981] text-white",
    },
  ].map((traffic) => {
    const isSelected =
      String(order.traffic_level || "").toUpperCase() ===
      traffic.level;

    return (
      <button
        key={traffic.level}
        type="button"
        disabled={isUpdatingOrder}
        onClick={() =>
          handleSetTraffic(order.id, traffic.level)
        }
        className={[
          "rounded-md px-2.5 py-1.5 text-xs font-semibold",
          "transition-all duration-200",
          "hover:-translate-y-0.5 hover:shadow-md",
          "active:translate-y-0 active:shadow-sm",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isSelected
            ? traffic.activeClass
            : "bg-gray-3 text-dark-5 hover:bg-gray-4 dark:bg-dark-3 dark:text-dark-6 dark:hover:bg-dark-2",
        ].join(" ")}
      >
        {traffic.label}
      </button>
    );
  })}
</div>
            </div>
          </td>

          <td className="w-[100px] px-4 py-4">
            <div className="min-w-[210px] space-y-3">
              {(order.order_items ?? order.line_items ?? [])
                .length > 0 ? (
                (order.order_items ?? order.line_items ?? []).map(
                  (item, index) => (
                    <div key={item.id ?? index}>
                      <p className="text-sm font-medium text-dark dark:text-white">
                        {Number(item.quantity || 0)}x{" "}
                        {getOrderItemName(item)}
                      </p>

                      {item.note ? (
                        <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
                          {item.note}
                        </p>
                      ) : null}
                    </div>
                  ),
                )
              ) : (
                <span className="text-sm text-dark-5 dark:text-dark-6">
                  {getOrderItemsText(order)}
                </span>
              )}
            </div>
          </td>

          <td className="w-[100px] whitespace-nowrap px-3 py-4 text-sm font-medium text-dark dark:text-white">
            {moneyFormatter.format(getOrderAmount(order))}
          </td>

          <td className="w-[110px] whitespace-nowrap px-3 py-4 text-sm text-dark-5 dark:text-dark-6">
            {formatDate(order.created_at)}
          </td>

          <td className="w-[150px] px-3 py-4">
            <div className="flex items-center gap-2">
              <Link
                href={`/orders/${order.id}`}
                className="rounded-lg border border-stroke px-4 py-2 text-sm font-semibold text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
              >
                View
              </Link>

              {activeOrderTab === "pending" && (
                <button
                  type="button"
                  disabled={isUpdatingOrder}
                  onClick={() =>
                    handleMoveOrder(order.id, "PREPARING")
                  }
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-opacity-90 disabled:opacity-60"
                >
                  Accept
                </button>
              )}

              {activeOrderTab === "preparing" && (
                <button
                  type="button"
                  disabled={isUpdatingOrder}
                  onClick={() =>
                    handleMoveOrder(
                      order.id,
                      "PICKUP_OR_DELIVER",
                    )
                  }
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-opacity-90 disabled:opacity-60"
                >
                  Ready
                </button>
              )}

              {activeOrderTab === "ready" && (
                <button
                  type="button"
                  disabled={isUpdatingOrder}
                  onClick={() =>
                    handleMoveOrder(order.id, "COMPLETED")
                  }
                  className="rounded-lg bg-[#10b981] px-4 py-2 text-sm font-semibold text-white hover:bg-opacity-90 disabled:opacity-60"
                >
                  Done
                </button>
              )}
            </div>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td
          colSpan={10}
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

          <h3
            className={`mt-3 text-2xl font-bold ${accentClass}`}
          >
            {value}
          </h3>
        </div>

        <div
          className={`text-3xl leading-none ${accentClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const OrderTab = ({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
        isActive
          ? "border-primary bg-primary text-white"
          : "border-stroke bg-white text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
      }`}
    >
      <span
        className={`flex size-5 items-center justify-center rounded text-xs font-bold ${
          isActive
            ? "bg-white text-primary"
            : "bg-primary text-white"
        }`}
      >
        {count}
      </span>

      {label}
    </button>
  );
};

const StatusBadge = ({
  status,
}: {
  status: string | null;
}) => {
  const normalizedStatus = status || "unknown";

  return (
    <span className="rounded-full bg-gray-2 px-3 py-1 text-xs font-medium capitalize text-dark-5 dark:bg-dark-2 dark:text-dark-6">
      {normalizedStatus.replaceAll("_", " ")}
    </span>
  );
};

type FulfillmentBadgeProps = {
  value?: string | null;
};

const FulfillmentBadge = ({
  value,
}: FulfillmentBadgeProps) => {
  const normalizedValue = String(
    value || "TAKE_AWAY",
  ).toUpperCase();

  const className =
    normalizedValue === "DINE_IN"
      ? "bg-primary/10 text-primary"
      : "bg-yellow-light-4 text-yellow-dark-2";

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${className}`}
    >
      {formatFulfillmentType(normalizedValue)}
    </span>
  );
};

const formatFulfillmentType = (
  value?: string | null,
) => {
  if (!value) {
    return "TAKE AWAY";
  }

  return value.replaceAll("_", " ");
};

const EstimatedTimeDisplay = ({
  order,
}: {
  order: StoreManagementOrder;
}) => {
  if (!order.estimated_completion_at) {
    return (
      <div>
        <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
          Not selected
        </p>

        <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
          Select a traffic level
        </p>
      </div>
    );
  }

  const estimatedDate = new Date(
    order.estimated_completion_at,
  );

  if (Number.isNaN(estimatedDate.getTime())) {
    return (
      <p className="text-sm text-dark-5 dark:text-dark-6">
        Invalid estimated time
      </p>
    );
  }

  return (
    <div>
      <p className="text-sm font-bold text-dark dark:text-white">
        {estimatedDate.toLocaleTimeString("en-MY", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
        {formatTrafficLevel(order.traffic_level)}
        {order.estimated_minutes
          ? ` · ${order.estimated_minutes} minutes`
          : ""}
      </p>
    </div>
  );
};

const formatTrafficLevel = (
  value?: string | null,
) => {
  if (!value) {
    return "Traffic not selected";
  }

  return `${value.toUpperCase()} traffic`;
};

const normalizeOrdersResponse = (
  ordersResponse: unknown,
): StoreManagementOrder[] => {
  if (Array.isArray(ordersResponse)) {
    return ordersResponse as StoreManagementOrder[];
  }

  if (
    ordersResponse &&
    typeof ordersResponse === "object" &&
    "data" in ordersResponse &&
    Array.isArray(
      (ordersResponse as { data?: unknown }).data,
    )
  ) {
    return (
      ordersResponse as {
        data: StoreManagementOrder[];
      }
    ).data;
  }

  return [];
};

const getStoreDisplayName = (store: Store) => {
  return (
    store.title ||
    store.name ||
    `Store #${store.id}`
  );
};

const filterOrdersByStatus = (
  orders: StoreManagementOrder[],
  statuses: string[],
) => {
  return orders.filter((order) => {
    const currentStatus = String(
      order.status || "",
    ).toLowerCase();

    return statuses.includes(currentStatus);
  });
};

const getCustomerName = (
  order: StoreManagementOrder,
) => {
  const customer = order.customer;

  const generatedName = [
    customer?.first_name,
    customer?.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    order.customer_name ||
    order.customer_full_name ||
    customer?.full_name ||
    customer?.name ||
    generatedName ||
    "Walk-in Customer"
  );
};

const getTableNumberText = (
  order: StoreManagementOrder,
) => {
  const fulfillmentType = String(
    order.fulfillment_type || "TAKE_AWAY",
  ).toUpperCase();

  if (fulfillmentType !== "DINE_IN") {
    return "-";
  }

  const tableNumber = String(
    order.table_number || "",
  ).trim();

  return tableNumber
    ? `Table ${tableNumber}`
    : "Not provided";
};

const convertCentToRinggit = (
  value: number | string | null | undefined,
) => {
  const amountInCent = Number(
    String(value || "").replace(/[^\d.-]/g, ""),
  );

  if (!Number.isFinite(amountInCent)) {
    return 0;
  }

  return amountInCent / 100;
};

const getOrderAmount = (
  order: StoreManagementOrder,
) => {
  const values = [
    order.total_amount,
    order.payment_amount,
    order.bill_amount,
    order.final_total,
    order.total_price,
  ];

  const positiveValue = values
    .map((value) =>
      Number(
        String(value || "").replace(/[^\d.-]/g, ""),
      ),
    )
    .find(
      (value) =>
        Number.isFinite(value) && value > 0,
    );

  if (!positiveValue) {
    return 0;
  }

  return positiveValue / 100;
};

const getOrderItemsText = (
  order: StoreManagementOrder,
) => {
  const lineItems = order.line_items || [];

  if (lineItems.length === 0) {
    return "-";
  }

  return lineItems
    .map((item) => {
      const quantity = item.quantity || 1;

      return `${quantity}x ${
        item.item_name ||
        item.name ||
        "Item"
      }`;
    })
    .join(", ");
};

const getOrderNotesText = (
  order: StoreManagementOrder,
) => {
  const notes = (order.line_items || [])
    .map((item) => item.note)
    .filter(Boolean);

  return notes.length > 0
    ? notes.join(", ")
    : "-";
};

const startNewOrderSound = (
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  isPlayingRef: React.MutableRefObject<boolean>,
) => {
  if (isPlayingRef.current) {
    return;
  }

  if (!audioRef.current) {
    audioRef.current = new Audio(
      "/sounds/new-order.mp3",
    );

    audioRef.current.loop = true;
    audioRef.current.volume = 0.8;
  }

  audioRef.current.currentTime = 0;

  audioRef.current
    .play()
    .then(() => {
      isPlayingRef.current = true;
    })
    .catch((error) => {
      console.log(
        "NEW ORDER SOUND ERROR:",
        error,
      );
    });
};

const stopNewOrderSound = (
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  isPlayingRef: React.MutableRefObject<boolean>,
) => {
  if (!audioRef.current) {
    return;
  }

  audioRef.current.pause();
  audioRef.current.currentTime = 0;
  isPlayingRef.current = false;
};

const isToday = (
  value: string | null | undefined,
) => {
  if (!value) {
    return false;
  }

  const date = new Date(value);
  const today = new Date();

  return (
    date.getFullYear() ===
      today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

const formatDate = (
  value: string | null | undefined,
) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString();
};

export default StoreManagementPageContent;