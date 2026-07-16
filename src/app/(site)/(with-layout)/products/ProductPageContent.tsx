"use client";

import { useProductTable } from "@/components/Products/ProductTable";
import type { Product } from "@/types/product";
import type { SubTaxon, Taxon } from "@/types/taxon";
import CustomerStyleTable from "@/components/common/CustomerStyleTable";
import {
  TableActionButton,
  TableActionLink,
} from "@/components/common/TableActionButton";


const ProductPageContent = () => {
  const {
    products,
    taxons,
    subTaxons,
    meta,
    page,
    nameInput,
    form,
    editingProduct,
    isFormOpen,
    message,

    isLoading,
    isError,
    isCreating,
    isUpdating,

    setPage,
    setNameInput,
    setForm,

    refetch,
    handleSearch,
    handleClearSearch,
    openCreateForm,
    openEditForm,
    closeForm,
    handleImageChange,
    handleSubmit,
    handleDeleteProduct,
  } = useProductTable();

  const imageBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/loyalty/v1", "") || "";

  return (
    <>
      {message && (
        <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          {message}
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <ProductStatCard
          title="Total Products"
          value={meta?.stats.total_products || 0}
        />

        <ProductStatCard
          title="With Taxon"
          value={meta?.stats.with_taxon || 0}
        />

        <ProductStatCard
          title="Without Taxon"
          value={meta?.stats.without_taxon || 0}
        />
      </div>

      <div className="mb-6 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white">
              Product Management
            </h2>

            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              Manage MULA products with direct image upload.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-lg bg-primary px-5 py-3 font-medium text-white"
          >
            + Add Product
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            placeholder="Search product name..."
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
          />

          <button
            type="button"
            onClick={handleSearch}
            className="rounded-lg bg-primary px-5 py-3 font-medium text-white"
          >
            Search
          </button>

          <button
            type="button"
            onClick={handleClearSearch}
            className="rounded-lg border border-stroke px-5 py-3 font-medium text-dark dark:border-dark-3 dark:text-white"
          >
            Clear
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-dark dark:text-white">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h3>

                <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
                  Upload product image directly from your device.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="text-xl font-semibold text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ProductInput
                label="Product Name"
                value={form.name}
                required
                onChange={(value) => setForm({ ...form, name: value })}
              />

              <ProductInput
                label="Price"
                type="number"
                value={form.price}
                required
                onChange={(value) => setForm({ ...form, price: value })}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Taxon
                </label>

                <select
                  value={form.loyalty_taxon_id}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      loyalty_taxon_id: event.target.value,
                      loyalty_sub_taxon_id: "",
                    })
                  }
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                >
                  <option value="">Select taxon</option>

                  {taxons.map((taxon: Taxon) => (
                    <option key={taxon.id} value={taxon.id}>
                      {taxon.name || `Taxon #${taxon.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Sub Taxon
                </label>

                <select
                  value={form.loyalty_sub_taxon_id}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      loyalty_sub_taxon_id: event.target.value,
                    })
                  }
                  disabled={!form.loyalty_taxon_id}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary disabled:bg-gray-2 disabled:opacity-70 dark:border-dark-3 dark:disabled:bg-dark-2"
                >
                  <option value="">
                    {form.loyalty_taxon_id
                      ? "Select sub taxon"
                      : "Select taxon first"}
                  </option>

                  {subTaxons.map((subTaxon: SubTaxon) => (
                    <option key={subTaxon.id} value={subTaxon.id}>
                      {subTaxon.name || `Sub Taxon #${subTaxon.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Product Image
                </label>

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white">
                    Choose
                    <input
                      type="file"
                      accept="image/*"
                      required={!editingProduct}
                      onChange={(event) =>
                        handleImageChange(event.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                  </label>

                  <span className="text-sm text-dark-5 dark:text-dark-6">
                    {form.imageFile ? form.imageFile.name : "No file chosen"}
                  </span>
                </div>

                <p className="mt-2 text-xs text-dark-5 dark:text-dark-6">
                  Upload from device only. Image URL is not used.
                </p>
              </div>

              <div className="md:col-span-2">
                {form.imagePreview ? (
                  <img
                    src={
                      form.imagePreview.startsWith("blob:")
                        ? form.imagePreview
                        : form.imagePreview.startsWith("http")
                          ? form.imagePreview
                          : `${imageBaseUrl}${form.imagePreview}`
                    }
                    alt="Product preview"
                    className="h-56 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center rounded-lg border border-dashed border-stroke text-sm text-dark-5 dark:border-dark-3">
                    No image selected
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  rows={4}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isCreating || isUpdating}
                className="rounded-lg bg-primary px-5 py-3 font-medium text-white disabled:opacity-60"
              >
                {isCreating || isUpdating ? "Saving..." : "Save Product"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-stroke px-5 py-3 font-medium text-dark dark:border-dark-3 dark:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        {isLoading ? (
          <div className="p-6">Loading products...</div>
        ) : isError ? (
          <div className="p-6">
            <p className="mb-3 text-red">Failed to load products.</p>

            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <CustomerStyleTable minWidth="1250px">
  <thead>
    <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        NO
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        IMAGE
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        PRODUCT
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        DESCRIPTION
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        PRICE
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        ORIGINAL PRICE
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        TAXON
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        SUB TAXON
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        ACTION
      </th>
    </tr>
  </thead>

  <tbody>
    {products.map((product: Product, index: number) => (
      <tr
        key={product.id}
        className="border-b border-stroke last:border-b-0 dark:border-dark-3"
      >
        <td className="px-6 py-4 text-sm">
          {(page - 1) * 20 + index + 1}
        </td>

        <td className="px-6 py-4">
          {product.image ? (
            <>
            <img
              src={
                product.image.startsWith("http")
                  ? product.image
                  : `${imageBaseUrl}${product.image}`
              }
              alt={product.name || "Product"}
              className="h-16 w-28 rounded-lg object-cover"
            />
            <label>{     product.image.startsWith("http")
                  ? product.image
                  : `${imageBaseUrl}${product.image}`}</label>
            </>
          ) : (
            <div className="flex h-16 w-28 items-center justify-center rounded-lg bg-gray-2 text-xs dark:bg-dark-2">
              No Image
            </div>
          )}
        </td>

        <td className="px-6 py-4 text-sm font-medium text-dark dark:text-white">
          {product.name || "-"}
        </td>

        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          <p className="line-clamp-2 max-w-[260px]">
            {product.description || "-"}
          </p>
        </td>

        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          RM {product.price || "0.00"}
        </td>

        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          RM {product.original_price || "0.00"}
        </td>

        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          {product.loyalty_taxon_name || product.loyalty_taxon_id || "-"}
        </td>

        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          {product.loyalty_sub_taxon_name ||
            product.loyalty_sub_taxon_id ||
            "-"}
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <td className="px-6 py-4">
  <div className="flex items-center gap-2">
    <TableActionLink href={`/products/${product.id}`}>
      Info
    </TableActionLink>

    <TableActionLink href={`/products/${product.id}/inventory`}>
      Stock
    </TableActionLink>

    <TableActionButton onClick={() => openEditForm(product)}>
      Edit
    </TableActionButton>

    <TableActionButton
      variant="danger"
      onClick={() => handleDeleteProduct(product.id)}
    >
      Delete
    </TableActionButton>
  </div>
</td>
          </div>
        </td>
      </tr>
    ))}

    {products.length === 0 && (
      <tr>
        <td
          colSpan={9}
          className="px-6 py-8 text-center text-sm text-dark-5 dark:text-dark-6"
        >
          No products found.
        </td>
      </tr>
    )}
  </tbody>
</CustomerStyleTable>
            

            {meta && (
              <div className="flex items-center justify-between px-6 py-4">
                <p className="text-sm text-dark-5">
                  Page {meta.page} of {meta.total_pages || 1}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="rounded-lg border border-stroke px-4 py-2 text-sm disabled:opacity-50 dark:border-dark-3"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={page >= (meta.total_pages || 1)}
                    onClick={() => setPage(page + 1)}
                    className="rounded-lg border border-stroke px-4 py-2 text-sm disabled:opacity-50 dark:border-dark-3"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

type ProductStatCardProps = {
  title: string;
  value: string | number;
};

const ProductStatCard = ({ title, value }: ProductStatCardProps) => {
  return (
    <div className="rounded-[10px] bg-white p-5 text-center shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h3 className="text-2xl font-bold text-dark dark:text-white">{value}</h3>
      <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">{title}</p>
    </div>
  );
};

type ProductInputProps = {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

const ProductInput = ({
  label,
  value,
  type = "text",
  required = false,
  onChange,
}: ProductInputProps) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
      />
    </div>
  );
};

export default ProductPageContent;