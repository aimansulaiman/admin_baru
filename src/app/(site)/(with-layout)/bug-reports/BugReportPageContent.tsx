"use client";

import { useBugReportTable } from "@/components/BugReports/BugReportsTable";
import type {
  BugReport,
  CreateBugReportInput,
  UpdateBugReportInput,
} from "@/types/bugReport";
import CustomerStyleTable from "@/components/common/CustomerStyleTable";
import {
  TableActionButton,
  TableActionLink,
} from "@/components/common/TableActionButton";
import Link from "next/link";
import type { FormEvent } from "react";

const statusOptions = [
  { label: "All Statuses", value: "" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

const priorityOptions = [
  { label: "All Priorities", value: "" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

const categoryOptions = [
  { label: "All Categories", value: "" },
  { label: "Bug", value: "bug" },
  { label: "UI Issue", value: "ui_issue" },
  { label: "Performance", value: "performance" },
  { label: "Data Issue", value: "data_issue" },
  { label: "Feature Request", value: "feature_request" },
  { label: "Other", value: "other" },
];

const formatText = (value: string | null | undefined) => {
  if (!value) {
    return "-";
  }

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (value: string | null) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString();
};

const getStatusBadgeClass = (status: string) => {
  if (status === "resolved") {
    return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
  }

  if (status === "in_progress") {
    return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
  }

  if (status === "closed") {
    return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
  }

  return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";
};

const getPriorityBadgeClass = (priority: string) => {
  if (priority === "critical") {
    return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
  }

  if (priority === "high") {
    return "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400";
  }

  if (priority === "medium") {
    return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
  }

  return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
};

type BugReportCreateModalProps = {
  form: CreateBugReportInput;
  isCreating: boolean;
  onChange: (key: keyof CreateBugReportInput, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

const BugReportCreateModal = ({
  form,
  isCreating,
  onChange,
  onSubmit,
  onClose,
}: BugReportCreateModalProps) => {
  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[10px] bg-white p-6 shadow-xl dark:bg-gray-dark">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-stroke pb-5 dark:border-dark-3">
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">
              Report New Bug
            </h2>

            <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
              Fill in the issue details so the admin can review and fix it.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-stroke px-4 py-2 text-sm font-semibold text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
          >
            Close
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Title
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(event) => onChange("title", event.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Category
              </label>

              <select
                value={form.category}
                onChange={(event) => onChange("category", event.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
              >
                <option value="bug">Bug</option>
                <option value="ui_issue">UI Issue</option>
                <option value="performance">Performance</option>
                <option value="data_issue">Data Issue</option>
                <option value="feature_request">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  onChange("description", event.target.value)
                }
                rows={5}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Priority
              </label>

              <select
                value={form.priority}
                onChange={(event) => onChange("priority", event.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="lg:col-span-3">
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Steps to reproduce
              </label>

              <textarea
                value={form.steps_to_reproduce || ""}
                onChange={(event) =>
                  onChange("steps_to_reproduce", event.target.value)
                }
                rows={4}
                placeholder={"1. Go to...\n2. Click on...\n3. See error..."}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Expected behavior
              </label>

              <textarea
                value={form.expected_behavior || ""}
                onChange={(event) =>
                  onChange("expected_behavior", event.target.value)
                }
                rows={4}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Actual behavior
              </label>

              <textarea
                value={form.actual_behavior || ""}
                onChange={(event) =>
                  onChange("actual_behavior", event.target.value)
                }
                rows={4}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={isCreating}
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-opacity-90 disabled:opacity-60"
            >
              {isCreating ? "Creating..." : "Create Bug Report"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stroke px-5 py-3 text-sm font-semibold text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

type BugReportUpdateModalProps = {
  status: string;
  priority: string;
  category: string;
  adminNotes: string;
  isUpdating: boolean;
  onChange: (key: keyof UpdateBugReportInput, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

const BugReportUpdateModal = ({
  status,
  priority,
  category,
  adminNotes,
  isUpdating,
  onChange,
  onSubmit,
  onClose,
}: BugReportUpdateModalProps) => {
  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-[10px] bg-white p-6 shadow-xl dark:bg-gray-dark">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-stroke pb-5 dark:border-dark-3">
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">
              Update Bug Report
            </h2>

            <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
              Update status, priority, category, or admin notes.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-stroke px-4 py-2 text-sm font-semibold text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Status
            </label>

            <select
              value={status}
              onChange={(event) => onChange("status", event.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Priority
            </label>

            <select
              value={priority}
              onChange={(event) => onChange("priority", event.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Category
            </label>

            <select
              value={category}
              onChange={(event) => onChange("category", event.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
            >
              <option value="bug">Bug</option>
              <option value="ui_issue">UI Issue</option>
              <option value="performance">Performance</option>
              <option value="data_issue">Data Issue</option>
              <option value="feature_request">Feature Request</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Admin Notes
            </label>

            <textarea
              value={adminNotes}
              onChange={(event) => onChange("admin_notes", event.target.value)}
              rows={5}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isUpdating}
            className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-opacity-90 disabled:opacity-60"
          >
            {isUpdating ? "Updating..." : "Update Report"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-stroke px-5 py-3 text-sm font-semibold text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const BugReportPageContent = () => {
  const {
    page,
    setPage,

    status,
    setStatus,

    priority,
    setPriority,

    category,
    setCategory,

    searchInput,
    setSearchInput,

    bugReports,
    meta,
    stats,

    isLoading,
    isFetching,
    isCreating,
    isUpdating,

    isCreateModalOpen,
    isUpdateModalOpen,

    createForm,
    updateForm,

    handleFilter,
    handleClear,

    openCreateModal,
    closeCreateModal,
    handleCreateFormChange,
    handleCreateSubmit,

    openUpdateModal,
    closeUpdateModal,

    handleUpdateFormChange,
    handleUpdateSubmit,
  } = useBugReportTable();

  return (
    <>
      <div className="space-y-6">
        <section className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-dark dark:text-white">
              Bug Reports
            </h1>

            <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
              Track reported issues, update status, and review bug details.
            </p>
          </div>

          <div className="text-sm font-medium text-dark-5 dark:text-dark-6">
            Dashboard /{" "}
            <span className="font-semibold text-primary">Bug Reports</span>
          </div>
        </section>

        <section className="grid grid-cols-5 gap-4">
          <BugStatCard title="Total Reports" value={stats?.total_reports || 0} />
          <BugStatCard title="Open" value={stats?.open || 0} />
          <BugStatCard title="In Progress" value={stats?.in_progress || 0} />
          <BugStatCard title="Resolved" value={stats?.resolved || 0} />
          <BugStatCard title="High Priority" value={stats?.high_priority || 0} /> 
        </section>

        <section className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
              >
                {statusOptions.map((option) => (
                  <option
                    key={option.value || "all-status"}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
              >
                {priorityOptions.map((option) => (
                  <option
                    key={option.value || "all-priority"}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
              >
                {categoryOptions.map((option) => (
                  <option
                    key={option.value || "all-category"}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search title..."
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap gap-3 2xl:shrink-0">
              <button
                type="button"
                onClick={handleFilter}
                className="min-w-[90px] rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-opacity-90"
              >
                Filter
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="min-w-[90px] rounded-lg border border-stroke px-5 py-3 text-sm font-semibold text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={openCreateModal}
                className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-opacity-90"
              >
                Report New Bug
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stroke px-6 py-5 dark:border-dark-3">
            <div>
              <h2 className="text-xl font-bold text-dark dark:text-white">
                Bug Report Records
              </h2>

              <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
                List of bug reports submitted by users or administrators.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <CustomerStyleTable minWidth="1000px">
  <thead>
    <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        ID
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        TITLE
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        CLIENT
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        PRIORITY
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        STATUS
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        CATEGORY
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        CREATED
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        ACTION
      </th>
    </tr>
  </thead>

  <tbody>
    {isLoading || isFetching ? (
      <tr>
        <td
          colSpan={8}
          className="px-6 py-8 text-center text-sm text-dark-5 dark:text-dark-6"
        >
          Loading bug reports...
        </td>
      </tr>
    ) : bugReports.length === 0 ? (
      <tr>
        <td
          colSpan={8}
          className="px-6 py-8 text-center text-sm text-dark-5 dark:text-dark-6"
        >
          No bug reports found.
        </td>
      </tr>
    ) : (
      bugReports.map((bugReport: BugReport) => (
        <tr
          key={bugReport.id}
          className="border-b border-stroke last:border-b-0 dark:border-dark-3"
        >
          <td className="px-6 py-4 text-sm text-dark dark:text-white">
            #{bugReport.id}
          </td>

          <td className="px-6 py-4 text-sm text-dark dark:text-white">
            <div>
              <p className="font-semibold">{bugReport.title}</p>

              <p className="mt-1 line-clamp-1 text-xs text-dark-5 dark:text-dark-6">
                {bugReport.description}
              </p>
            </div>
          </td>

          <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
            {bugReport.client_name || "System-wide"}
          </td>

          <td className="px-6 py-4">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityBadgeClass(
                bugReport.priority,
              )}`}
            >
              {formatText(bugReport.priority)}
            </span>
          </td>

          <td className="px-6 py-4">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                bugReport.status,
              )}`}
            >
              {formatText(bugReport.status)}
            </span>
          </td>

          <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
            {formatText(bugReport.category)}
          </td>

          <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
            {formatDate(bugReport.created_at)}
          </td>

          <td className="px-6 py-4">
            <div className="flex items-center gap-2">
              <TableActionLink href={`/bug-reports/${bugReport.id}`}>
                View
              </TableActionLink>

              <TableActionButton onClick={() => openUpdateModal(bugReport)}>
                Edit
              </TableActionButton>
            </div>
          </td>
        </tr>
      ))
    )}
  </tbody>
</CustomerStyleTable>
          </div>

          {meta && meta.total_pages > 1 && (
            <div className="flex items-center justify-between border-t border-stroke px-6 py-5 dark:border-dark-3">
              <p className="text-sm text-dark-5 dark:text-dark-6">
                Page {meta.page} of {meta.total_pages}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-lg border border-stroke px-4 py-2 text-sm font-semibold text-dark disabled:opacity-50 dark:border-dark-3 dark:text-white"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={page >= meta.total_pages}
                  onClick={() => setPage(page + 1)}
                  className="rounded-lg border border-stroke px-4 py-2 text-sm font-semibold text-dark disabled:opacity-50 dark:border-dark-3 dark:text-white"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {isCreateModalOpen && (
        <BugReportCreateModal
          form={createForm}
          isCreating={isCreating}
          onChange={handleCreateFormChange}
          onSubmit={handleCreateSubmit}
          onClose={closeCreateModal}
        />
      )}

      {isUpdateModalOpen && (
        <BugReportUpdateModal
          status={updateForm.status || "open"}
          priority={updateForm.priority || "low"}
          category={updateForm.category || "bug"}
          adminNotes={updateForm.admin_notes || ""}
          isUpdating={isUpdating}
          onChange={handleUpdateFormChange}
          onSubmit={handleUpdateSubmit}
          onClose={closeUpdateModal}
        />
      )}
    </>
  );
};

const BugStatCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => {
  return (
    <div className="flex min-h-[120px] flex-col justify-center rounded-[10px] bg-white p-6 text-center shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h3 className="text-2xl font-bold leading-none text-dark dark:text-white">
        {value}
      </h3>

      <p className="mt-3 min-h-[40px] text-sm font-medium leading-5 text-dark-5 dark:text-dark-6">
        {title}
      </p>
    </div>
  );
};

export default BugReportPageContent;