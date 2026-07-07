"use client";

import {
  useDeleteOrderMutation,
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from "@/app/api/rtk/orderApi";
import type { Order } from "@/types/order";
import { useMemo, useState } from "react";

type OrderFormState = {
  status: string;
  payment_status: string;
  cancellation_reason: string;
};

const emptyForm: OrderFormState = {
  status: "",
  payment_status: "",
  cancellation_reason: "",
};

export const useOrderTable = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const [search, setSearch] = useState({
    order_number: "",
    customer_name: "",
    store: "",
    status: "",
    payment_status: "",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [form, setForm] = useState<OrderFormState>(emptyForm);
  const [message, setMessage] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set(
      "domain_name",
      process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME || "MULA",
    );

    params.set("page", "1");
    params.set("per_page", "20");

    if (search.order_number) {
      params.set("order_number", search.order_number);
    }

    if (search.customer_name) {
      params.set("customer_name", search.customer_name);
    }

    if (search.store) {
      params.set("store", search.store);
    }

    if (search.status) {
      params.set("status", search.status);
    }

    if (search.payment_status) {
      params.set("payment_status", search.payment_status);
    }

    return `?${params.toString()}`;
  }, [search]);

const { data, isLoading, isError, refetch } = useGetOrdersQuery(queryString, {
  pollingInterval: 10000,
  refetchOnFocus: true,
  refetchOnReconnect: true,
});

  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const orders = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const meta = useMemo(() => {
    return data?.meta;
  }, [data]);

  const stats = useMemo(() => {
    return meta?.stats;
  }, [meta]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSearch({
      order_number: orderNumber,
      customer_name: customerName,
      store: storeName,
      status,
      payment_status: paymentStatus,
    });
  };

  const handleReset = () => {
    setOrderNumber("");
    setCustomerName("");
    setStoreName("");
    setStatus("");
    setPaymentStatus("");

    setSearch({
      order_number: "",
      customer_name: "",
      store: "",
      status: "",
      payment_status: "",
    });
  };

  const openEditForm = (order: Order) => {
    setEditingOrder(order);

    setForm({
      status: order.status || "",
      payment_status: order.payment_status || "",
      cancellation_reason: order.cancellation_reason || "",
    });

    setMessage("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingOrder(null);
    setForm(emptyForm);
  };

  const handleFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setMessage("");

    if (!editingOrder) {
      return;
    }

    try {
      await updateOrder({
        id: editingOrder.id,
        data: {
          status: form.status,
          payment_status: form.payment_status,
          cancellation_reason: form.cancellation_reason,
        },
      }).unwrap();

      setMessage("Order updated successfully.");
      closeForm();
      refetch();
    } catch (error: any) {
      console.log("ORDER UPDATE ERROR:", error);

      setMessage(
        error?.data?.message || error?.error || "Failed to update order.",
      );
    }
  };

  const handleDelete = async (order: Order) => {
    const confirmDelete = window.confirm(
      `Delete/cancel order ${order.order_number || order.id}?`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteOrder(order.id).unwrap();

      setMessage("Order deleted successfully.");
      refetch();
    } catch (error: any) {
      console.log("ORDER DELETE ERROR:", error);

      setMessage(
        error?.data?.message || error?.error || "Failed to delete order.",
      );
    }
  };

  return {
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
  };
};