"use client";

import { useMerchandiseTable } from "@/components/Merchandises/MerchandiseTable";
import type { Merchandise } from "@/types/merchandise";
import CustomerStyleTable from "@/components/common/CustomerStyleTable";
import {
  TableActionButton,
  TableActionLink,
} from "@/components/common/TableActionButton";
import Link from "next/link";

const MerchandisePageContent = () => {
  const {
    name,
    setName,
    active,
    setActive,
    currentlyActive,
    setCurrentlyActive,

    merchandises,
    meta,
    stats,
    form,
    setForm,
    message,
    isFormOpen,
    editingMerchandise,

    isLoading,
    isError,
    isCreating,
    isUpdating,
    isDeleting,

    refetch,
    handleSearch,
    handleReset,
    openAddForm,
    openEditForm,
    closeForm,
    handleFormSubmit,
    handleDelete,
  } = useMerchandiseTable();

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        Loading merchandises...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="mb-3 text-red">Failed to load merchandises.</p>

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
        <MerchandiseStatsCard
          title="Total Merchandise"
          value={stats?.total_merchandises || meta?.total || 0}
        />

        <MerchandiseStatsCard
          title="Active"
          value={stats?.active_merchandises || 0}
        />

        <MerchandiseStatsCard
          title="Inactive"
          value={stats?.inactive_merchandises || 0}
        />

        <MerchandiseStatsCard
          title="Currently Active"
          value={stats?.currently_active_merchandises || 0}
        />
      </div>

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke px-6 py-4 dark:border-dark-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-dark dark:text-white">
                Merchandise
              </h2>

              <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
                Manage MULA merchandise, reward items, price, image and active dates.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="rounded-lg bg-primary px-5 py-3 font-medium text-white"
            >
              Add Merchandise
            </button>
          </div>
        </div>

        <div className="p-6">
          <form
            onSubmit={handleSearch}
            className="mb-5 grid gap-4 md:grid-cols-4"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Merchandise Name
              </label>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Search merchandise..."
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Status
              </label>

              <select
                value={active}
                onChange={(event) => setActive(event.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Currently Active
              </label>

              <select
                value={currentlyActive}
                onChange={(event) => setCurrentlyActive(event.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
              >
                <option value="">All</option>
                <option value="true">Current</option>
                <option value="false">Not Current</option>
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
              Total Merchandises: {meta?.total || 0}
            </span>
          </div>

          <div className="overflow-x-auto">
            <CustomerStyleTable minWidth="1000px">
  <thead>
    <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        BIL
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        NAME
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        PRICE
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        DATE
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        STATUS
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        CURRENT
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        ACTION
      </th>
    </tr>
  </thead>

  <tbody>
    {merchandises.map((merchandise: Merchandise, index: number) => (
      <tr
        key={merchandise.id}
        className="border-b border-stroke last:border-b-0 dark:border-dark-3"
      >
        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          {index + 1}
        </td>

        <td className="px-6 py-4">
          <p className="font-medium text-dark dark:text-white">
            {merchandise.name || "-"}
          </p>

          <p className="mt-1 line-clamp-1 text-sm text-dark-5 dark:text-dark-6">
            {merchandise.description || "-"}
          </p>
        </td>

        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          {merchandise.display_price ||
            `RM ${merchandise.harga || merchandise.price || "0.00"}`}
        </td>

        <td className="px-6 py-4">
          <div className="text-sm">
            <p className="text-dark dark:text-white">
              {merchandise.start_date || "-"}
            </p>

            <p className="text-dark-5 dark:text-dark-6">
              to {merchandise.end_date || "-"}
            </p>
          </div>
        </td>

        <td className="px-6 py-4">
          <MerchandiseBadge value={merchandise.active} />
        </td>

        <td className="px-6 py-4">
          <MerchandiseBadge value={merchandise.currently_active} />
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <TableActionLink href={`/merchandises/${merchandise.id}`}>
              View
            </TableActionLink>

            <TableActionButton onClick={() => openEditForm(merchandise)}>
              Edit
            </TableActionButton>

            <TableActionButton
              variant="danger"
              disabled={isDeleting}
              onClick={() => handleDelete(merchandise)}
            >
              Delete
            </TableActionButton>
          </div>
        </td>
      </tr>
    ))}

    {merchandises.length === 0 && (
      <tr>
        <td
          colSpan={7}
          className="px-6 py-8 text-center text-sm text-dark-5 dark:text-dark-6"
        >
          No Merchandises Found
        </td>
      </tr>
    )}
  </tbody>
</CustomerStyleTable>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-dark dark:text-white">
                {editingMerchandise ? "Edit Merchandise" : "Add Merchandise"}
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
              onSubmit={handleFormSubmit}
              className="grid gap-4 md:grid-cols-2"
            >
              <MerchandiseInput
                label="Name"
                value={form.name}
                required
                onChange={(value) => setForm({ ...form, name: value })}
              />

              <MerchandiseInput
                label="Harga"
                type="number"
                value={form.harga}
                onChange={(value) => setForm({ ...form, harga: value })}
              />

              <MerchandiseInput
                label="Image URL"
                value={form.image}
                onChange={(value) => setForm({ ...form, image: value })}
              />

              <MerchandiseInput
                label="Start Date"
                type="date"
                value={form.start_date}
                onChange={(value) => setForm({ ...form, start_date: value })}
              />

              <MerchandiseInput
                label="End Date"
                type="date"
                value={form.end_date}
                onChange={(value) => setForm({ ...form, end_date: value })}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Status
                </label>

                <select
                  value={form.active ? "true" : "false"}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      active: event.target.value === "true",
                    })
                  }
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                  className="min-h-[100px] w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                />
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
                  {isCreating || isUpdating
                    ? "Saving..."
                    : "Save Merchandise"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

type MerchandiseStatsCardProps = {
  title: string;
  value: string | number;
};

const MerchandiseStatsCard = ({
  title,
  value,
}: MerchandiseStatsCardProps) => {
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

type MerchandiseInputProps = {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

const MerchandiseInput = ({
  label,
  value,
  type = "text",
  required = false,
  onChange,
}: MerchandiseInputProps) => {
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

type MerchandiseBadgeProps = {
  value: boolean | undefined;
};

const MerchandiseBadge = ({ value }: MerchandiseBadgeProps) => {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${
        value ? "bg-primary/10 text-primary" : "bg-red-light-6 text-red"
      }`}
    >
      {value ? "Active" : "Inactive"}
    </span>
  );
};

export default MerchandisePageContent;