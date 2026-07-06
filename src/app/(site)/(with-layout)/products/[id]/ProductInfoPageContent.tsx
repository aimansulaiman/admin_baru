"use client";

import { useGetProductQuery } from "@/app/api/rtk/productApi";
import Link from "next/link";

type ProductInfoPageContentProps = {
  productId: string;
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

const ProductInfoPageContent = ({ productId }: ProductInfoPageContentProps) => {
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useGetProductQuery(productId);

  const imageBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/loyalty/v1", "") || "";

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="text-sm text-dark-5 dark:text-dark-6">
          Loading product info...
        </p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="mb-4 text-sm font-medium text-red">
          Failed to load product info.
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

  const productImage = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${imageBaseUrl}${product.image}`
    : "";

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark dark:text-white">
            Product Info
          </h1>

          <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
            View product details, image, price, description, and registration
            date.
          </p>
        </div>

        <div className="text-sm font-medium text-dark-5 dark:text-dark-6">
          Products /{" "}
          <span className="font-semibold text-primary">Product Info</span>
        </div>
      </section>

      <section className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke px-6 py-5 dark:border-dark-3">
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/products/${productId}`}
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white"
            >
              Product Info
            </Link>

            <Link
              href={`/products/${productId}/inventory`}
              className="rounded-lg border border-stroke px-5 py-3 text-sm font-semibold text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
            >
              Stock Management
            </Link>
          </div>
        </div>

        <div className="border-b border-stroke px-6 py-5 dark:border-dark-3">
          <h2 className="text-xl font-bold text-dark dark:text-white">
            Product Details
          </h2>

          <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
            Basic information for this product.
          </p>
        </div>

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

          <div className="mt-6 flex justify-center gap-3 rounded-lg border border-stroke p-6 dark:border-dark-3">
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
        </div>
      </section>
    </div>
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

export default ProductInfoPageContent;