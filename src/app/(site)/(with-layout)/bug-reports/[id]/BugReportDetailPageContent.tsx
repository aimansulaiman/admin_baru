"use client";

import {
  useGetBugReportQuery,
  useUpdateBugReportMutation,
} from "@/app/api/rtk/bugReportApi";
import Link from "next/link";
import { useState } from "react";

type Props = {
  id: string;
};

const formatText = (value: string | null | undefined) => {
  if (!value) {
    return "-";
  }

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDateTime = (value: string | null) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
};

const getStatusBadgeClass = (status: string) => {
  if (status === "resolved") {
    return "bg-green-500 text-white";
  }

  if (status === "in_progress") {
    return "bg-blue-500 text-white";
  }

  if (status === "closed") {
    return "bg-gray-500 text-white";
  }

  return "bg-red-500 text-white";
};

const getPriorityBadgeClass = (priority: string) => {
  if (priority === "critical") {
    return "bg-red-600 text-white";
  }

  if (priority === "high") {
    return "bg-pink-500 text-white";
  }

  if (priority === "medium") {
    return "bg-yellow-500 text-white";
  }

  return "bg-green-500 text-white";
};

const DetailBox = ({
  title,
  children,
  headerClassName = "bg-gray-100 text-dark",
}: {
  title: string;
  children: React.ReactNode;
  headerClassName?: string;
}) => {
  return (
    <div className="rounded-lg border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className={`rounded-t-lg px-4 py-3 font-semibold ${headerClassName}`}>
        {title}
      </div>

      <div className="whitespace-pre-line p-4 text-sm text-dark dark:text-white">
        {children || "-"}
      </div>
    </div>
  );
};

const BugReportDetailPageContent = ({ id }: Props) => {
  const { data: bugReport, isLoading, refetch } = useGetBugReportQuery(id);

  const [updateBugReport, { isLoading: isUpdating }] =
    useUpdateBugReportMutation();

  const [selectedPriority, setSelectedPriority] = useState("");

  const handlePriorityChange = async (priority: string) => {
    if (!bugReport) {
      return;
    }

    try {
      await updateBugReport({
        id: bugReport.id,
        data: {
          priority,
        },
      }).unwrap();

      refetch();
      setSelectedPriority("");
      alert("Priority updated successfully.");
    } catch (error: any) {
      alert(
        error?.data?.message ||
          error?.message ||
          "Failed to update priority.",
      );
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!bugReport) {
      return;
    }

    try {
      await updateBugReport({
        id: bugReport.id,
        data: {
          status,
        },
      }).unwrap();

      refetch();
      alert("Status updated successfully.");
    } catch (error: any) {
      alert(
        error?.data?.message ||
          error?.message ||
          "Failed to update status.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
        Loading bug report...
      </div>
    );
  }

  if (!bugReport) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
        Bug report not found.
      </div>
    );
  }

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark">
      <div className="flex items-center justify-between border-b border-stroke bg-primary px-5 py-4 dark:border-dark-3">
        <h1 className="text-base font-semibold text-white">
          Bug Report #{bugReport.id}
        </h1>

        <div className="flex items-center gap-2">
          <Link
            href="/bug-reports"
            className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600"
          >
            Back to Reports
          </Link>

          <button
            type="button"
            onClick={() => handleStatusChange("in_progress")}
            disabled={isUpdating}
            className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600 disabled:opacity-60"
          >
            Mark In Progress
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange("resolved")}
            disabled={isUpdating}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
          >
            Resolve
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 p-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <div className="rounded-lg border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-dark dark:text-white">
                {bugReport.title}
              </h2>

              <div className="flex gap-2">
                <span
                  className={`rounded px-2 py-1 text-xs font-semibold ${getPriorityBadgeClass(
                    bugReport.priority,
                  )}`}
                >
                  {formatText(bugReport.priority)}
                </span>

                <span
                  className={`rounded px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(
                    bugReport.status,
                  )}`}
                >
                  {formatText(bugReport.status)}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-dark dark:text-white">
                Description
              </p>

              <div className="rounded-lg border border-stroke p-4 text-sm text-dark dark:border-dark-3 dark:text-white">
                {bugReport.description || "-"}
              </div>
            </div>
          </div>

          <DetailBox title="Steps to Reproduce">
            {bugReport.steps_to_reproduce}
          </DetailBox>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <DetailBox
              title="Expected Behavior"
              headerClassName="bg-green-500 text-white"
            >
              {bugReport.expected_behavior}
            </DetailBox>

            <DetailBox
              title="Actual Behavior"
              headerClassName="bg-pink-500 text-white"
            >
              {bugReport.actual_behavior}
            </DetailBox>
          </div>

          <DetailBox title="Technical Information">
            <div className="space-y-3">
              <div>
                <span className="font-semibold">Page URL: </span>
                <span>{bugReport.url_path || "-"}</span>
              </div>

              <div>
                <span className="font-semibold">Browser: </span>
                <span>{bugReport.browser_info || "-"}</span>
              </div>
            </div>
          </DetailBox>
        </div>

        <div className="space-y-5">
          <div className="rounded-lg border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
            <div className="border-b border-stroke bg-gray-100 px-4 py-3 font-semibold text-dark dark:border-dark-3">
              Report Details
            </div>

            <div className="space-y-4 p-4 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>
                <span
                  className={`rounded px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(
                    bugReport.status,
                  )}`}
                >
                  {formatText(bugReport.status)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Priority:</span>
                <span
                  className={`rounded px-2 py-1 text-xs font-semibold ${getPriorityBadgeClass(
                    bugReport.priority,
                  )}`}
                >
                  {formatText(bugReport.priority)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Category:</span>
                <span>{formatText(bugReport.category)}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Client:</span>
                <span>{bugReport.client_name || "System-wide"}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Created:</span>
                <span>{formatDateTime(bugReport.created_at)}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Resolved:</span>
                <span>{formatDateTime(bugReport.resolved_at)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
            <div className="border-b border-stroke bg-gray-100 px-4 py-3 font-semibold text-dark dark:border-dark-3">
              Quick Actions
            </div>

            <div className="space-y-4 p-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                  Change Priority
                </label>

                <select
                  value={selectedPriority}
                  onChange={(event) => {
                    setSelectedPriority(event.target.value);
                    handlePriorityChange(event.target.value);
                  }}
                  disabled={isUpdating}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                >
                  <option value="">Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                  Change Status
                </label>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange("open")}
                    disabled={isUpdating}
                    className="rounded-lg border border-stroke px-4 py-2 text-sm font-semibold hover:bg-gray-100 disabled:opacity-60 dark:border-dark-3"
                  >
                    Open
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange("in_progress")}
                    disabled={isUpdating}
                    className="rounded-lg border border-stroke px-4 py-2 text-sm font-semibold hover:bg-gray-100 disabled:opacity-60 dark:border-dark-3"
                  >
                    In Progress
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange("resolved")}
                    disabled={isUpdating}
                    className="rounded-lg border border-stroke px-4 py-2 text-sm font-semibold hover:bg-gray-100 disabled:opacity-60 dark:border-dark-3"
                  >
                    Resolved
                  </button>
                </div>
              </div>
            </div>
          </div>

          {bugReport.admin_notes && (
            <DetailBox title="Admin Notes">{bugReport.admin_notes}</DetailBox>
          )}
        </div>
      </div>
    </div>
  );
};

export default BugReportDetailPageContent;