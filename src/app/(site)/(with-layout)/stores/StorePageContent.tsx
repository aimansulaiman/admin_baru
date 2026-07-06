"use client";

import { useStoreTable } from "@/components/Stores/StoreTable";
import type { Store } from "@/types/store";
import CustomerStyleTable from "@/components/common/CustomerStyleTable";
import { TableActionButton } from "@/components/common/TableActionButton";

const StorePageContent = () => {
  const {
    stores,
    meta,
    page,
    nameInput,
    form,
    editingStore,
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
    handleDeleteStore,
  } = useStoreTable();

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
        <StoreStatCard
          title="Total Stores"
          value={meta?.stats.total_stores || 0}
        />

        <StoreStatCard
          title="Active Stores"
          value={meta?.stats.active_stores || 0}
        />

        <StoreStatCard
          title="Inactive Stores"
          value={meta?.stats.inactive_stores || 0}
        />
      </div>

      <div className="mb-6 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white">
              Store Management
            </h2>

            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              Isi maklumat store mengikut form yang disediakan.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-lg bg-primary px-5 py-3 font-medium text-white"
          >
            + Add Store
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            placeholder="Search store name or title..."
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
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-dark dark:text-white">
                  {editingStore ? "Edit Store" : "Add New Store"}
                </h3>

                <p className="mt-1 border-l-4 border-primary bg-primary/5 px-4 py-3 text-sm text-dark-5 dark:text-dark-6">
                  Isi maklumat store mengikut form yang disediakan
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

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Pilih Client
              </label>

              <select
                value={process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME || "MULA"}
                disabled
                className="rounded-lg border border-stroke bg-gray-2 px-4 py-3 outline-none dark:border-dark-3 dark:bg-dark-2"
              >
                <option value="MULA">MULA</option>
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Gambar Store
                </label>

                <div className="flex items-center gap-3 rounded-lg border border-stroke px-4 py-3 dark:border-dark-3">
                  <label className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      required={!editingStore}
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

                {form.imagePreview ? (
                  <img
                    src={
                      form.imagePreview.startsWith("blob:")
                        ? form.imagePreview
                        : form.imagePreview.startsWith("http")
                          ? form.imagePreview
                          : `${imageBaseUrl}${form.imagePreview}`
                    }
                    alt="Store preview"
                    className="mt-4 h-56 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="mt-4 flex h-56 w-full items-center justify-center rounded-lg border border-dashed border-stroke text-sm text-dark-5 dark:border-dark-3">
                    No image selected
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <StoreInput
                  label="Nama Penuh"
                  value={form.name}
                  required
                  onChange={(value) => setForm({ ...form, name: value })}
                />
              </div>

              <StoreInput
                label="Title"
                value={form.title}
                onChange={(value) => setForm({ ...form, title: value })}
              />

              <StoreInput
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => setForm({ ...form, email: value })}
              />

              <StoreInput
                label="No Telefon"
                value={form.phone_number}
                onChange={(value) =>
                  setForm({ ...form, phone_number: value })
                }
              />

              <StoreInput
                label="Address"
                value={form.address}
                onChange={(value) => setForm({ ...form, address: value })}
              />

              <StoreInput
                label="Opening Hours"
                placeholder="e.g. 09:00"
                value={form.opening_hours}
                onChange={(value) =>
                  setForm({ ...form, opening_hours: value })
                }
              />

              <StoreInput
                label="Closing Hours"
                placeholder="e.g. 18:00"
                value={form.closing_hours}
                onChange={(value) =>
                  setForm({ ...form, closing_hours: value })
                }
              />

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
                  placeholder="Enter store description"
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-dark dark:text-white">
                  Aktif
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(event) =>
                      setForm({ ...form, active: event.target.checked })
                    }
                    className="h-4 w-4"
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isCreating || isUpdating}
                className="rounded-lg bg-primary px-5 py-3 font-medium text-white disabled:opacity-60"
              >
                {isCreating || isUpdating ? "Saving..." : "Save Store"}
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
          <div className="p-6">Loading stores...</div>
        ) : isError ? (
          <div className="p-6">
            <p className="mb-3 text-red">Failed to load stores.</p>

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
            <CustomerStyleTable minWidth="1100px">
  <thead>
    <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        NO
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        IMAGE
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        STORE NAME
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        TITLE
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        PHONE
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        EMAIL
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
    {stores.map((store: Store, index: number) => (
      <tr
        key={store.id}
        className="border-b border-stroke last:border-b-0 dark:border-dark-3"
      >
        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          {(page - 1) * 20 + index + 1}
        </td>

        <td className="px-6 py-4">
          {store.image ? (
            <img
              src={
                store.image.startsWith("http")
                  ? store.image
                  : `${imageBaseUrl}${store.image}`
              }
              alt={store.name || "Store"}
              className="h-16 w-28 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-16 w-28 items-center justify-center rounded-lg bg-gray-2 text-xs dark:bg-dark-2">
              No Image
            </div>
          )}
        </td>

        <td className="px-6 py-4 text-sm font-medium text-dark dark:text-white">
          {store.name || "-"}
        </td>

        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          {store.title || "-"}
        </td>

        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          {store.phone_number || "-"}
        </td>

        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          {store.email || "-"}
        </td>

        <td className="px-6 py-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              store.active
                ? "bg-primary/10 text-primary"
                : "bg-red-light-6 text-red"
            }`}
          >
            {store.active ? "Active" : "Inactive"}
          </span>
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <TableActionButton onClick={() => openEditForm(store)}>
              Edit
            </TableActionButton>

            <TableActionButton
              variant="danger"
              onClick={() => handleDeleteStore(store.id)}
            >
              Delete
            </TableActionButton>
          </div>
        </td>
      </tr>
    ))}

    {stores.length === 0 && (
      <tr>
        <td
          colSpan={8}
          className="px-6 py-8 text-center text-sm text-dark-5 dark:text-dark-6"
        >
          No stores found.
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

type StoreStatCardProps = {
  title: string;
  value: string | number;
};

const StoreStatCard = ({ title, value }: StoreStatCardProps) => {
  return (
    <div className="rounded-[10px] bg-white p-5 text-center shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h3 className="text-2xl font-bold text-dark dark:text-white">{value}</h3>
      <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">{title}</p>
    </div>
  );
};

type StoreInputProps = {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
};

const StoreInput = ({
  label,
  value,
  type = "text",
  required = false,
  placeholder = "",
  onChange,
}: StoreInputProps) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
      />
    </div>
  );
};

export default StorePageContent;