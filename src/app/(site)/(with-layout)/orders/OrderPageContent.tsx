"use client";

import { useOrderTable } from "@/components/Orders/OrderTable";
import type { Order } from "@/types/order";
import Link from "next/link";

const OrderPageContent = () => {
  const {
    orderNumber,
    setOrderNumber,
    customerName,
    setCustomerName,
    storeName,
    setStoreName,
    status,
    setStatus,
    paymentStatus,
    setPaymentStatus,

    orders,
    meta,
    stats,
    form,
    setForm,
    message,
    isFormOpen,
    editingOrder,

    isLoading,
    isError,
    isUpdating,
    isDeleting,

    refetch,
    handleSearch,
    handleReset,
    openEditForm,
    closeForm,
    handleFormSubmit,
    handleDelete,
  } = useOrderTable();

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        Loading orders...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="mb-3 text-red">Failed to load orders.</p>

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
    <>
      {message && (
        <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          {message}
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <OrderStatsCard title="Total Orders" value={stats?.total_orders || meta?.total || 0} />
        <OrderStatsCard title="Pending" value={stats?.pending_orders || 0} />
        <OrderStatsCard title="Completed" value={stats?.completed_orders || 0} />
        <OrderStatsCard title="Cancelled" value={stats?.cancelled_orders || 0} />
      </div>

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke px-6 py-4 dark:border-dark-3">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white">
              Orders Records
            </h2>

            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              Search, view, update status and delete selected order.
            </p>
          </div>
        </div>

        <div className="p-6">
          <form
            onSubmit={handleSearch}
            className="mb-5 grid gap-4 md:grid-cols-6"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Order No
              </label>

              <input
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                placeholder="Order no..."
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Customer
              </label>

              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Customer..."
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Store
              </label>

              <input
                value={storeName}
                onChange={(event) => setStoreName(event.target.value)}
                placeholder="Store..."
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Status
              </label>

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Payment
              </label>

              <select
                value={paymentStatus}
                onChange={(event) => setPaymentStatus(event.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="rounded-lg bg-primary px-5 py-3 font-medium text-white"
              >
                Search
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-stroke px-5 py-3 font-medium text-dark dark:border-dark-3 dark:text-white"
              >
                Reset
              </button>
            </div>
          </form>

          <div className="mb-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Total Orders: {meta?.total || 0}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
                  <th className="px-6 py-4 font-medium text-dark dark:text-white">
                    BIL
                  </th>
                  <th className="px-6 py-4 font-medium text-dark dark:text-white">
                    ORDER NO
                  </th>
                  <th className="px-6 py-4 font-medium text-dark dark:text-white">
                    CUSTOMER
                  </th>
                  <th className="px-6 py-4 font-medium text-dark dark:text-white">
                    STORE
                  </th>
                  <th className="px-6 py-4 font-medium text-dark dark:text-white">
                    TOTAL
                  </th>
                  <th className="px-6 py-4 font-medium text-dark dark:text-white">
                    STATUS
                  </th>
                  <th className="px-6 py-4 font-medium text-dark dark:text-white">
                    PAYMENT
                  </th>
                  <th className="px-6 py-4 font-medium text-dark dark:text-white">
                    ACTION
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order: Order, index: number) => (
                  <tr
                    key={order.id}
                    className="border-b border-stroke last:border-b-0 dark:border-dark-3"
                  >
                    <td className="px-6 py-4">{index + 1}</td>

                    <td className="px-6 py-4 font-medium text-dark dark:text-white">
                      {order.order_number || `#${order.id}`}
                    </td>

                    <td className="px-6 py-4">{order.customer_name || "-"}</td>

                    <td className="px-6 py-4">{order.store_name || "-"}</td>

                    <td className="px-6 py-4">
                      RM {order.total_amount || "0.00"}
                    </td>

                    <td className="px-6 py-4">
                      <OrderBadge value={order.status || "-"} />
                    </td>

                    <td className="px-6 py-4">
                      <OrderBadge value={order.payment_status || "-"} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/orders/${order.id}`}
                          className="text-sm font-medium text-primary"
                        >
                          View
                        </Link>

                        <button
                          type="button"
                          onClick={() => openEditForm(order)}
                          className="text-sm font-medium text-primary"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => handleDelete(order)}
                          className="text-sm font-medium text-red"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-dark-5 dark:text-dark-6"
                    >
                      No Orders Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-dark dark:text-white">
                Edit Order {editingOrder?.order_number || ""}
              </h3>

              <button
                type="button"
                onClick={closeForm}
                className="text-lg font-bold text-dark dark:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Order Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      status: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Payment Status
                </label>

                <select
                  value={form.payment_status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      payment_status: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                >
                  <option value="">Select Payment Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Cancellation Reason
                </label>

                <textarea
                  value={form.cancellation_reason}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      cancellation_reason: event.target.value,
                    })
                  }
                  placeholder="Optional"
                  className="min-h-[90px] w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-stroke px-5 py-3 font-medium text-dark dark:border-dark-3 dark:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-lg bg-primary px-5 py-3 font-medium text-white disabled:opacity-60"
                >
                  {isUpdating ? "Saving..." : "Save Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

type OrderStatsCardProps = {
  title: string;
  value: string | number;
};

const OrderStatsCard = ({ title, value }: OrderStatsCardProps) => {
  return (
    <div className="rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
        {title}
      </p>

      <h3 className="mt-2 text-2xl font-bold text-dark dark:text-white">
        {value}
      </h3>
    </div>
  );
};

type OrderBadgeProps = {
  value: string;
};

const OrderBadge = ({ value }: OrderBadgeProps) => {
  const normalizedValue = value.toLowerCase();

  const className =
    normalizedValue === "completed" || normalizedValue === "paid"
      ? "bg-primary/10 text-primary"
      : normalizedValue === "cancelled" ||
          normalizedValue === "failed" ||
          normalizedValue === "refunded"
        ? "bg-red-light-6 text-red"
        : "bg-yellow-light-4 text-yellow-dark-2";

  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${className}`}>
      {value}
    </span>
  );
};

export default OrderPageContent;