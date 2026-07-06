"use client";

import { useCheckinRewardTable } from "@/components/CheckinRewards/CheckinRewardTable";
import type { CheckinReward } from "@/types/checkinReward";
import CustomerStyleTable from "@/components/common/CustomerStyleTable";
import { TableActionButton } from "@/components/common/TableActionButton";

const CheckinRewardPageContent = () => {
  const {
    rewards,
    meta,
    page,
    searchInput,
    form,
    editingReward,
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
    handleSubmit,
    handleDeleteReward,
  } = useCheckinRewardTable();

  return (
    <>
      {message && (
        <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          {message}
        </div>
      )}

      <div className="mb-6 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white">
              Check-in Rewards
            </h2>

            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              Manage daily check-in reward rules for MULA customers.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-lg bg-primary px-5 py-3 font-medium text-white"
          >
            Add Reward
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search reward..."
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
                  {editingReward
                    ? "Edit Check-in Reward"
                    : "Add Check-in Reward"}
                </h3>

                <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
                  Configure check-in day, points reward and milestone status.
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
              <CheckinRewardInput
                label="Day Number"
                type="number"
                value={form.day_number}
                required
                onChange={(value) =>
                  setForm({ ...form, day_number: value })
                }
              />

              <CheckinRewardInput
                label="Points Reward"
                type="number"
                value={form.points_reward}
                required
                onChange={(value) =>
                  setForm({ ...form, points_reward: value })
                }
              />

              <CheckinRewardInput
                label="Bonus Points"
                type="number"
                value={form.bonus_points}
                onChange={(value) =>
                  setForm({ ...form, bonus_points: value })
                }
              />

              <CheckinRewardInput
                label="Reward Type"
                value={form.reward_type}
                onChange={(value) =>
                  setForm({ ...form, reward_type: value })
                }
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Milestone
                </label>

                <select
                  value={form.is_milestone ? "true" : "false"}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      is_milestone: event.target.value === "true",
                    })
                  }
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

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
                  Reward Config
                </label>

                <textarea
                  value={form.reward_config}
                  onChange={(event) =>
                    setForm({ ...form, reward_config: event.target.value })
                  }
                  rows={4}
                  placeholder="Optional reward configuration"
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
                {isCreating || isUpdating ? "Saving..." : "Save Reward"}
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
          <div className="p-6">Loading check-in rewards...</div>
        ) : isError ? (
          <div className="p-6">
            <p className="mb-3 text-red">Failed to load check-in rewards.</p>

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
        DAY NUMBER
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        POINTS REWARD
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        BONUS POINTS
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        REWARD TYPE
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        MILESTONE
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
    {rewards.map((reward: CheckinReward, index: number) => (
      <tr
        key={reward.id}
        className="border-b border-stroke last:border-b-0 dark:border-dark-3"
      >
        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          {(page - 1) * 20 + index + 1}
        </td>

        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          {reward.day_number || "-"}
        </td>

        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          {reward.points_reward || 0}
        </td>

        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          {reward.bonus_points || 0}
        </td>

        <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
          {reward.reward_type || "-"}
        </td>

        <td className="px-6 py-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              reward.is_milestone
                ? "bg-primary/10 text-primary"
                : "bg-gray-2 text-dark-5 dark:bg-dark-2 dark:text-dark-6"
            }`}
          >
            {reward.is_milestone ? "Yes" : "No"}
          </span>
        </td>

        <td className="px-6 py-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              reward.active
                ? "bg-primary/10 text-primary"
                : "bg-red-light-6 text-red"
            }`}
          >
            {reward.active ? "Active" : "Inactive"}
          </span>
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <TableActionButton onClick={() => openEditForm(reward)}>
              Edit
            </TableActionButton>

            <TableActionButton
              variant="danger"
              onClick={() => handleDeleteReward(reward.id)}
            >
              Delete
            </TableActionButton>
          </div>
        </td>
      </tr>
    ))}

    {rewards.length === 0 && (
      <tr>
        <td
          colSpan={8}
          className="px-6 py-8 text-center text-sm text-dark-5 dark:text-dark-6"
        >
          No check-in rewards found.
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

type CheckinRewardInputProps = {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

const CheckinRewardInput = ({
  label,
  value,
  type = "text",
  required = false,
  onChange,
}: CheckinRewardInputProps) => {
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

export default CheckinRewardPageContent;