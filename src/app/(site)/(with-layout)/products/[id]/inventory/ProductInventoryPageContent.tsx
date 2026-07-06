"use client";

import {
  useCreateProductInventoryMutation,
  useDeleteProductInventoryMutation,
  useGetProductInventoryQuery,
  useUpdateProductInventoryMutation,
} from "@/app/api/rtk/inventoryApi";
import { useGetStoresQuery } from "@/app/api/rtk/storeApi";
import CustomerStyleTable from "@/components/common/CustomerStyleTable";
import type {
  CreateInventoryInput,
  InventoryModifier,
  InventorySizePricing,
} from "@/types/inventory";
import Link from "next/link";
import { useMemo, useState } from "react";
import { TableActionButton } from "@/components/common/TableActionButton";

type ProductInventoryPageContentProps = {
  productId: string;
};

type SizeRow = {
  size: string;
  price: string;
};

const initialForm: CreateInventoryInput = {
  store_id: "",
  price: "",
  stock: "",
  is_available: true,
  size_pricing: {},
};

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ProductInventoryPageContent = ({
  productId,
}: ProductInventoryPageContentProps) => {
  const [activeTab, setActiveTab] = useState<"product_info" | "stock">("stock");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInventory, setEditingInventory] =
    useState<InventoryModifier | null>(null);

  const [form, setForm] = useState<CreateInventoryInput>(initialForm);
  const [sizeRows, setSizeRows] = useState<SizeRow[]>([]);

  const domainName = process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME || "MULA";

  const storeQueryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("domain_name", domainName);
    params.set("per_page", "100");

    return `?${params.toString()}`;
  }, [domainName]);

  const {
    data: inventoryResponse,
    isLoading,
    isError,
    refetch,
  } = useGetProductInventoryQuery(productId);

  const { data: storesResponse } = useGetStoresQuery(storeQueryString);

  const [createInventory, { isLoading: isCreating }] =
    useCreateProductInventoryMutation();

  const [updateInventory, { isLoading: isUpdating }] =
    useUpdateProductInventoryMutation();

  const [deleteInventory, { isLoading: isDeleting }] =
    useDeleteProductInventoryMutation();

  const product = inventoryResponse?.product;
  const inventoryModifiers = inventoryResponse?.data || [];
  const stores = storesResponse?.data || [];

  const imageBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/loyalty/v1", "") || "";

  const productImage = product?.image
    ? product.image.startsWith("http")
      ? product.image
      : `${imageBaseUrl}${product.image}`
    : "";

  const openCreateForm = () => {
    setEditingInventory(null);
    setForm(initialForm);
    setSizeRows([]);
    setIsFormOpen(true);
  };

  const openEditForm = (inventory: InventoryModifier) => {
    const sizePricing = inventory.size_pricing || {};

    setEditingInventory(inventory);

    setForm({
      store_id: inventory.store_id ? String(inventory.store_id) : "",
      price: inventory.price ? String(inventory.price) : "",
      stock: inventory.stock ? String(inventory.stock) : "",
      is_available: inventory.is_available ?? true,
      size_pricing: sizePricing,
    });

    setSizeRows(
      Object.entries(sizePricing).map(([size, price]) => ({
        size,
        price: String(price),
      })),
    );

    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingInventory(null);
    setForm(initialForm);
    setSizeRows([]);
    setIsFormOpen(false);
  };

  const addSizeRow = () => {
    setSizeRows((currentRows) => [...currentRows, { size: "", price: "" }]);
  };

  const updateSizeRow = (
    index: number,
    key: keyof SizeRow,
    value: string,
  ) => {
    setSizeRows((currentRows) =>
      currentRows.map((row, rowIndex) => {
        if (rowIndex !== index) {
          return row;
        }

        return {
          ...row,
          [key]: value,
        };
      }),
    );
  };

  const removeSizeRow = (index: number) => {
    setSizeRows((currentRows) =>
      currentRows.filter((_row, rowIndex) => rowIndex !== index),
    );
  };

  const buildSizePricing = () => {
    const sizePricing: InventorySizePricing = {};

    sizeRows.forEach((row) => {
      if (row.size.trim() && row.price.trim()) {
        sizePricing[row.size.trim().toLowerCase()] = row.price.trim();
      }
    });

    return sizePricing;
  };

  const handleSubmit = async () => {
    if (!form.store_id) {
      alert("Please select store.");
      return;
    }

    if (!form.stock) {
      alert("Please enter stock quantity.");
      return;
    }

    if (!form.price) {
      alert("Please enter price.");
      return;
    }

    try {
      const payload = {
        ...form,
        size_pricing: buildSizePricing(),
      };

      if (editingInventory) {
        await updateInventory({
          productId,
          inventoryId: editingInventory.id,
          data: payload,
        }).unwrap();

        alert("Inventory updated successfully.");
      } else {
        await createInventory({
          productId,
          data: payload,
        }).unwrap();

        alert("Inventory created successfully.");
      }

      closeForm();
      refetch();
    } catch (error: any) {
      alert(
        error?.data?.message || error?.message || "Failed to save inventory.",
      );
    }
  };

  const handleDelete = async (inventoryId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this stock?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteInventory({
        productId,
        inventoryId,
      }).unwrap();

      alert("Inventory deleted successfully.");
      refetch();
    } catch (error: any) {
      alert(
        error?.data?.message ||
          error?.message ||
          "Failed to delete inventory.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="text-sm text-dark-5 dark:text-dark-6">
          Loading stock...
        </p>
      </div>
    );
  }

  if (isError || !inventoryResponse || !product) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="mb-4 text-sm font-medium text-red">
          Failed to load stock.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-dark dark:text-white">
            Stock Management
          </h1>

          <div className="text-sm font-medium text-dark-5 dark:text-dark-6">
            Products / <span className="font-semibold text-primary">Stock</span>
          </div>
        </section>

        <section className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-6 py-5 dark:border-dark-3">
            <div className="flex flex-wrap gap-3">
              <Link
  href={`/products/${productId}`}
  className="rounded-lg border border-stroke px-5 py-3 text-sm font-semibold text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
>
  Product Info
</Link>

              <button
                type="button"
                onClick={() => setActiveTab("stock")}
                className={`rounded-lg px-5 py-3 text-sm font-semibold ${
                  activeTab === "stock"
                    ? "bg-primary text-white"
                    : "border border-stroke text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
                }`}
              >
                Stock Management
              </button>
            </div>
          </div>

          {activeTab === "product_info" ? (
            <div className="p-6">
              <div className="rounded-lg border border-stroke p-6 dark:border-dark-3">
                <div className="grid gap-6 md:grid-cols-[180px_1fr]">
                  <div>
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={product.name || "Product"}
                        className="h-36 w-36 rounded-lg border border-stroke object-cover p-1 dark:border-dark-3"
                      />
                    ) : (
                      <div className="flex h-36 w-36 items-center justify-center rounded-lg border border-dashed border-stroke text-xs text-dark-5 dark:border-dark-3 dark:text-dark-6">
                        No Image
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold capitalize text-dark dark:text-white">
                      {product.name || "-"}
                    </h3>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <InfoRow
                        label="Harga"
                        value={`RM ${product.price || "0.00"}`}
                        highlight
                      />

                      <InfoRow
                        label="Original Price"
                        value={`RM ${product.original_price || "0.00"}`}
                      />

                      <InfoRow
                        label="Description"
                        value={product.description || "-"}
                      />

                      <InfoRow
                        label="Tarikh Daftar"
                        value={formatDate(product.created_at)}
                      />

                      <InfoRow
                        label="Taxon"
                        value={
                          product.loyalty_taxon_name ||
                          String(product.loyalty_taxon_id || "-")
                        }
                      />

                      <InfoRow
                        label="Sub Taxon"
                        value={
                          product.loyalty_sub_taxon_name ||
                          String(product.loyalty_sub_taxon_id || "-")
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stroke px-6 py-5 dark:border-dark-3">
                <h2 className="text-xl font-bold text-dark dark:text-white">
                  {product?.name || "Stock List"}
                </h2>

                <button
                  type="button"
                  onClick={openCreateForm}
                  className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-opacity-90"
                >
                  + Add New Stock
                </button>
              </div>

              <div className="mb-4 px-6 pt-6">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Total Stock Records: {inventoryModifiers.length}
                </span>
              </div>

              <CustomerStyleTable minWidth="1000px">
                <thead>
                  <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
                    <th className="px-6 py-4 font-medium text-dark dark:text-white">
                      BIL
                    </th>

                    <th className="px-6 py-4 font-medium text-dark dark:text-white">
                      STORE NAME
                    </th>

                    <th className="px-6 py-4 font-medium text-dark dark:text-white">
                      STOCK
                    </th>

                    <th className="px-6 py-4 font-medium text-dark dark:text-white">
                      PRICE
                    </th>

                    <th className="px-6 py-4 font-medium text-dark dark:text-white">
                      SIZE VARIANTS
                    </th>

                    <th className="px-6 py-4 font-medium text-dark dark:text-white">
                      AVAILABLE
                    </th>

                    <th className="px-6 py-4 font-medium text-dark dark:text-white">
                      UPDATED DATE
                    </th>

                    <th className="px-6 py-4 font-medium text-dark dark:text-white">
                      ACTION
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {inventoryModifiers.map((inventory, index) => (
                    <tr
                      key={inventory.id}
                      className="border-b border-stroke last:border-b-0 dark:border-dark-3"
                    >
                      <td className="px-6 py-4">{index + 1}</td>

                      <td className="px-6 py-4 font-medium text-dark dark:text-white">
                        {inventory.store_name || "-"}
                      </td>

                      <td className="px-6 py-4 text-dark-5 dark:text-dark-6">
                        {inventory.stock || 0}
                      </td>

                      <td className="px-6 py-4 text-dark-5 dark:text-dark-6">
                        RM {inventory.price || "0.00"}
                      </td>

                      <td className="px-6 py-4 text-dark-5 dark:text-dark-6">
                        <SizePricingDisplay
                          sizePricing={inventory.size_pricing || {}}
                        />
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            inventory.is_available
                              ? "bg-primary/10 text-primary"
                              : "bg-red-light-6 text-red"
                          }`}
                        >
                          {inventory.is_available ? "Yes" : "No"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-dark-5 dark:text-dark-6">
                        {formatDate(inventory.updated_at)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                         <TableActionButton onClick={() => openEditForm(inventory)}>
  Edit
</TableActionButton>

<TableActionButton
  variant="danger"
  disabled={isDeleting}
  onClick={() => handleDelete(inventory.id)}
>
  Delete
</TableActionButton>
                        </div>
                    </td>
                    </tr>
                  ))}

                  {inventoryModifiers.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-8 text-center text-dark-5 dark:text-dark-6"
                      >
                        No stock records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </CustomerStyleTable>
            </>
          )}

          <div className="flex justify-center gap-3 border-t border-stroke px-6 py-5 dark:border-dark-3">
            <Link
              href="/products"
              className="rounded-lg bg-red px-6 py-3 text-sm font-semibold text-white hover:bg-opacity-90"
            >
              Back
            </Link>

            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg border border-stroke px-6 py-3 text-sm font-semibold text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
            >
              Refresh
            </button>
          </div>
        </section>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-dark dark:text-white">
                {editingInventory ? "Edit Stock" : "Add Stock"}
              </h3>

              <button
                type="button"
                onClick={closeForm}
                className="text-lg font-bold text-dark dark:text-white"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
              className="grid gap-4 md:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Store
                </label>

                <select
                  value={form.store_id}
                  onChange={(event) =>
                    setForm({ ...form, store_id: event.target.value })
                  }
                  disabled={Boolean(editingInventory)}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary disabled:bg-gray-2 disabled:opacity-70 dark:border-dark-3 dark:disabled:bg-dark-2"
                >
                  <option value="">Select store</option>

                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.title || store.name || `Store #${store.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <InventoryInput
                label="Stock Quantity"
                type="number"
                value={form.stock}
                onChange={(value) => setForm({ ...form, stock: value })}
              />

              <InventoryInput
                label="Store Price"
                type="number"
                value={form.price}
                onChange={(value) => setForm({ ...form, price: value })}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Available
                </label>

                <select
                  value={form.is_available ? "true" : "false"}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      is_available: event.target.value === "true",
                    })
                  }
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="md:col-span-2 rounded-lg border border-stroke p-5 dark:border-dark-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-dark dark:text-white">
                    Size Pricing
                  </h3>

                  <button
                    type="button"
                    onClick={addSizeRow}
                    className="rounded-lg border border-stroke px-4 py-2 text-sm font-semibold text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
                  >
                    + Add Size
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {sizeRows.map((row, index) => (
                    <div
                      key={`${row.size}-${index}`}
                      className="grid gap-3 md:grid-cols-[1fr_1fr_100px]"
                    >
                      <input
                        value={row.size}
                        onChange={(event) =>
                          updateSizeRow(index, "size", event.target.value)
                        }
                        placeholder="Size name"
                        className="rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                      />

                      <input
                        type="number"
                        value={row.price}
                        onChange={(event) =>
                          updateSizeRow(index, "price", event.target.value)
                        }
                        placeholder="Size price"
                        className="rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                      />

                      <button
                        type="button"
                        onClick={() => removeSizeRow(index)}
                        className="rounded-lg bg-red px-4 py-3 text-sm font-semibold text-white hover:bg-opacity-90"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {sizeRows.length === 0 && (
                    <div className="rounded-lg bg-gray-2 p-4 text-sm text-dark-5 dark:bg-dark-2 dark:text-dark-6">
                      No size pricing.
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-stroke px-5 py-3 font-medium text-dark dark:border-dark-3 dark:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="rounded-lg bg-primary px-5 py-3 font-medium text-white disabled:opacity-60"
                >
                  {isCreating || isUpdating ? "Saving..." : "Save Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

type InfoRowProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

const InfoRow = ({ label, value, highlight = false }: InfoRowProps) => {
  return (
    <div>
      <p className="text-sm font-semibold text-dark-5 dark:text-dark-6">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-semibold ${
          highlight ? "text-red" : "text-dark dark:text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

type InventoryInputProps = {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
};

const InventoryInput = ({
  label,
  value,
  type = "text",
  onChange,
}: InventoryInputProps) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
      />
    </div>
  );
};

const SizePricingDisplay = ({
  sizePricing,
}: {
  sizePricing: InventorySizePricing;
}) => {
  const entries = Object.entries(sizePricing || {});

  if (entries.length === 0) {
    return <span>-</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(([size, price]) => (
        <span
          key={size}
          className="rounded-full bg-gray-2 px-3 py-1 text-xs font-semibold text-dark-5 dark:bg-dark-2 dark:text-dark-6"
        >
          {size}: RM {price}
        </span>
      ))}
    </div>
  );
};

export default ProductInventoryPageContent;