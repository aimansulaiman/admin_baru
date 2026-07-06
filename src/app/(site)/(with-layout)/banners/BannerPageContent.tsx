"use client";

import { useBannerTable } from "@/components/Banners/BannerTable";
import type { Banner } from "@/types/banner";
import CustomerStyleTable from "@/components/common/CustomerStyleTable";
import { TableActionButton } from "@/components/common/TableActionButton";

const BannerPageContent = () => {
  const {
    banners,
    meta,
    page,
    searchInput,
    form,
    editingBanner,
    isFormOpen,
    message,

    isLoading,
    isError,
    isCreating,
    isUpdating,

    setPage,
    setSearchInput,
    setForm,

    refetch,
    handleSearch,
    handleClearSearch,
    openCreateForm,
    openEditForm,
    closeForm,
    handleImageChange,
    handleSubmit,
    handleDeleteBanner,
  } = useBannerTable();

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
        <BannerStatCard title="Total Banners" value={meta?.stats.total_banners || 0} />
        <BannerStatCard title="Active Banners" value={meta?.stats.active_banners || 0} />
        <BannerStatCard title="Inactive Banners" value={meta?.stats.inactive_banners || 0} />
      </div>

      <div className="mb-6 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white">
              Banner Management
            </h2>

            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              Upload banner images directly from your device.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-lg bg-primary px-5 py-3 font-medium text-white"
          >
            + Add New Banner
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search banner..."
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
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-dark dark:text-white">
                  {editingBanner ? "Edit Banner" : "Add New Banner"}
                </h3>

                <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
                  Recommended size: 1200x400 pixels. Supported formats: JPG, PNG, GIF, WEBP.
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
              <BannerInput
                label="Banner Title"
                value={form.title}
                required
                onChange={(value) => setForm({ ...form, title: value })}
              />

              <BannerInput
                label="Display Position"
                type="number"
                value={form.display_position}
                onChange={(value) =>
                  setForm({ ...form, display_position: value })
                }
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Banner Image
                </label>

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white">
                    Choose
                    <input
                      type="file"
                      accept="image/*"
                      required={!editingBanner}
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

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Active
                </label>

                <select
                  value={form.active ? "true" : "false"}
                  onChange={(event) =>
                    setForm({ ...form, active: event.target.value === "true" })
                  }
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
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
                    alt="Banner preview"
                    className="h-56 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center rounded-lg border border-dashed border-stroke text-sm text-dark-5 dark:border-dark-3">
                    No image selected
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isCreating || isUpdating}
                className="rounded-lg bg-primary px-5 py-3 font-medium text-white disabled:opacity-60"
              >
                {isCreating || isUpdating ? "Saving..." : "Add Banner"}
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
          <div className="p-6">Loading banners...</div>
        ) : isError ? (
          <div className="p-6">
            <p className="mb-3 text-red">Failed to load banners.</p>

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
            <div className="overflow-x-auto">
              <CustomerStyleTable minWidth="900px">
  <thead>
    <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        NO
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        IMAGE
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        BANNER TITLE
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        POSITION
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        ACTIVE
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        ACTION
      </th>
    </tr>
  </thead>

  <tbody>
    {banners.map((banner: Banner, index: number) => (
      <tr
        key={banner.id}
        className="border-b border-stroke last:border-b-0 dark:border-dark-3"
      >
        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          {(page - 1) * 20 + index + 1}
        </td>

        <td className="px-6 py-4">
          {banner.image ? (
            <img
              src={
                banner.image.startsWith("http")
                  ? banner.image
                  : `${imageBaseUrl}${banner.image}`
              }
              alt={banner.title || banner.name || "Banner"}
              className="h-16 w-28 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-16 w-28 items-center justify-center rounded-lg bg-gray-2 text-xs dark:bg-dark-2">
              No Image
            </div>
          )}
        </td>

        <td className="px-6 py-4 text-sm font-medium text-dark dark:text-white">
          {banner.title || banner.name || "-"}
        </td>

        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          {banner.display_position || banner.position || 0}
        </td>

        <td className="px-6 py-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              banner.active || banner.status
                ? "bg-primary/10 text-primary"
                : "bg-red-light-6 text-red"
            }`}
          >
            {banner.active || banner.status ? "Active" : "Inactive"}
          </span>
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <TableActionButton onClick={() => openEditForm(banner)}>
              Edit
            </TableActionButton>

            <TableActionButton
              variant="danger"
              onClick={() => handleDeleteBanner(banner.id)}
            >
              Delete
            </TableActionButton>
          </div>
        </td>
      </tr>
    ))}

    {banners.length === 0 && (
      <tr>
        <td
          colSpan={6}
          className="px-6 py-8 text-center text-sm text-dark-5 dark:text-dark-6"
        >
          No banners found.
        </td>
      </tr>
    )}
  </tbody>
</CustomerStyleTable>
            </div>

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

type BannerStatCardProps = {
  title: string;
  value: string | number;
};

const BannerStatCard = ({ title, value }: BannerStatCardProps) => {
  return (
    <div className="rounded-[10px] bg-white p-5 text-center shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h3 className="text-2xl font-bold text-dark dark:text-white">{value}</h3>
      <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">{title}</p>
    </div>
  );
};

type BannerInputProps = {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

const BannerInput = ({
  label,
  value,
  type = "text",
  required = false,
  onChange,
}: BannerInputProps) => {
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

export default BannerPageContent;