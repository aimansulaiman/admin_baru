"use client";

import { useMissionTable } from "@/components/Missions/MissionTable";
import type { Mission } from "@/types/mission";
import CustomerStyleTable from "@/components/common/CustomerStyleTable";
import { TableActionButton } from "@/components/common/TableActionButton";

const MissionPageContent = () => {
  const {
    missions,
    meta,
    page,

    nameInput,
    statusInput,

    form,
    editingMission,
    isFormOpen,
    message,

    isLoading,
    isError,
    isCreating,
    isUpdating,

    setPage,
    setNameInput,
    setStatusInput,
    setForm,

    refetch,
    handleSearch,
    handleClearSearch,
    openCreateForm,
    openEditForm,
    closeForm,
    handleImageChange,
    handleSubmit,
    handleDeleteMission,
  } = useMissionTable();

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
        <MissionStatCard
          title="Total Missions"
          value={meta?.stats?.total_missions || 0}
        />

        <MissionStatCard
          title="Active"
          value={meta?.stats?.active_missions || 0}
        />

        <MissionStatCard
          title="Inactive"
          value={meta?.stats?.inactive_missions || 0}
        />
      </div>

      <div className="mb-6 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white">
              Mission Management
            </h2>

            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              Manage old MULA missions. Sub missions are not used on this page.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-lg bg-primary px-5 py-3 font-medium text-white"
          >
            + Add Mission
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="grid gap-3 md:grid-cols-4">
          <input
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            placeholder="Search mission name..."
            className="rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
          />

          <select
            value={statusInput}
            onChange={(event) => setStatusInput(event.target.value)}
            className="rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

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
                  {editingMission ? "Edit Mission" : "Add Mission"}
                </h3>

                <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
                  Upload mission image directly from your device.
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
              <MissionInput
                label="Mission Name"
                value={form.name}
                required
                onChange={(value) => setForm({ ...form, name: value })}
              />

              <MissionInput
                label="Numbers"
                type="number"
                value={form.numbers}
                onChange={(value) => setForm({ ...form, numbers: value })}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Status
                </label>

                <select
                  value={form.status ? "true" : "false"}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      status: event.target.value === "true",
                    })
                  }
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Mission Image
                </label>

                <div className="flex items-center gap-3 rounded-lg border border-stroke px-4 py-3 dark:border-dark-3">
                  <label className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      required={!editingMission}
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
                    alt="Mission preview"
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
                {isCreating || isUpdating ? "Saving..." : "Save Mission"}
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
          <div className="p-6">Loading missions...</div>
        ) : isError ? (
          <div className="p-6">
            <p className="mb-3 text-red">Failed to load missions.</p>

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
              <CustomerStyleTable minWidth="1000px">
  <thead>
    <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        NO
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        IMAGE
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        NAME
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        NUMBERS
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        STATUS
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        ACTION
      </th>
    </tr>
  </thead>

  <tbody>
    {missions.map((mission: Mission, index: number) => (
      <tr
        key={mission.id}
        className="border-b border-stroke last:border-b-0 dark:border-dark-3"
      >
        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          {(page - 1) * 20 + index + 1}
        </td>

        <td className="px-6 py-4">
          {mission.image ? (
            <img
              src={
                mission.image.startsWith("http")
                  ? mission.image
                  : `${imageBaseUrl}${mission.image}`
              }
              alt={mission.name || "Mission"}
              className="h-16 w-28 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-16 w-28 items-center justify-center rounded-lg bg-gray-2 text-xs dark:bg-dark-2">
              No Image
            </div>
          )}
        </td>

        <td className="px-6 py-4 text-sm font-medium text-dark dark:text-white">
          {mission.name || "-"}
        </td>

        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          {mission.numbers || "-"}
        </td>

        <td className="px-6 py-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              mission.status
                ? "bg-primary/10 text-primary"
                : "bg-red-light-6 text-red"
            }`}
          >
            {mission.status ? "Active" : "Inactive"}
          </span>
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <TableActionButton onClick={() => openEditForm(mission)}>
              Edit
            </TableActionButton>

            <TableActionButton
              variant="danger"
              onClick={() => handleDeleteMission(mission.id)}
            >
              Delete
            </TableActionButton>
          </div>
        </td>
      </tr>
    ))}

    {missions.length === 0 && (
      <tr>
        <td
          colSpan={6}
          className="px-6 py-8 text-center text-sm text-dark-5 dark:text-dark-6"
        >
          No missions found.
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

type MissionStatCardProps = {
  title: string;
  value: string | number;
};

const MissionStatCard = ({ title, value }: MissionStatCardProps) => {
  return (
    <div className="rounded-[10px] bg-white p-5 text-center shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h3 className="text-2xl font-bold text-dark dark:text-white">{value}</h3>
      <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">{title}</p>
    </div>
  );
};

type MissionInputProps = {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

const MissionInput = ({
  label,
  value,
  type = "text",
  required = false,
  onChange,
}: MissionInputProps) => {
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

export default MissionPageContent;