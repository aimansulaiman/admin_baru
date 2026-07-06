"use client";

import {
  useCreateBugReportMutation,
  useGetBugReportsQuery,
  useUpdateBugReportMutation,
} from "@/app/api/rtk/bugReportApi";
import type {
  BugReport,
  CreateBugReportInput,
  UpdateBugReportInput,
} from "@/types/bugReport";
import { FormEvent, useMemo, useState } from "react";

const initialCreateForm: CreateBugReportInput = {
  title: "",
  description: "",
  priority: "low",
  category: "bug",
  url_path: "",
  browser_info: "",
  steps_to_reproduce: "",
  expected_behavior: "",
  actual_behavior: "",
  admin_notes: "",
};

export const useBugReportTable = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [selectedBugReport, setSelectedBugReport] = useState<BugReport | null>(
    null,
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [createForm, setCreateForm] =
    useState<CreateBugReportInput>(initialCreateForm);

  const [updateForm, setUpdateForm] = useState<UpdateBugReportInput>({
    status: "",
    priority: "",
    category: "",
    admin_notes: "",
  });

  const queryFilters = useMemo(
    () => ({
      page,
      perPage: 20,
      status: status || undefined,
      priority: priority || undefined,
      category: category || undefined,
      search: search || undefined,
    }),
    [page, status, priority, category, search],
  );

  const { data, isLoading, isFetching, refetch } =
    useGetBugReportsQuery(queryFilters);

  const [createBugReport, { isLoading: isCreating }] =
    useCreateBugReportMutation();

  const [updateBugReport, { isLoading: isUpdating }] =
    useUpdateBugReportMutation();

  const bugReports = data?.data || [];
  const meta = data?.meta;
  const stats = data?.stats;

  const handleFilter = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleClear = () => {
    setPage(1);
    setStatus("");
    setPriority("");
    setCategory("");
    setSearchInput("");
    setSearch("");
  };

  const openCreateModal = () => {
    setCreateForm(initialCreateForm);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateForm(initialCreateForm);
    setIsCreateModalOpen(false);
  };

  const handleCreateFormChange = (
    key: keyof CreateBugReportInput,
    value: string,
  ) => {
    setCreateForm((previousForm) => ({
      ...previousForm,
      [key]: value,
    }));
  };

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!createForm.title.trim()) {
      alert("Please enter bug title.");
      return;
    }

    if (!createForm.description.trim()) {
      alert("Please enter bug description.");
      return;
    }

    try {
      await createBugReport({
        ...createForm,
        url_path: window.location.pathname,
        browser_info: navigator.userAgent,
      }).unwrap();

      closeCreateModal();
      refetch();
      alert("Bug report created successfully.");
    } catch (error: any) {
      alert(
        error?.data?.message ||
          error?.message ||
          "Failed to create bug report.",
      );
    }
  };

  const openUpdateModal = (bugReport: BugReport) => {
    setSelectedBugReport(bugReport);

    setUpdateForm({
      status: bugReport.status || "open",
      priority: bugReport.priority || "low",
      category: bugReport.category || "bug",
      admin_notes: bugReport.admin_notes || "",
    });

    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setSelectedBugReport(null);
    setIsUpdateModalOpen(false);
  };

  const handleUpdateFormChange = (
    key: keyof UpdateBugReportInput,
    value: string,
  ) => {
    setUpdateForm((previousForm) => ({
      ...previousForm,
      [key]: value,
    }));
  };

  const handleUpdateSubmit = async () => {
    if (!selectedBugReport) {
      return;
    }

    try {
      await updateBugReport({
        id: selectedBugReport.id,
        data: updateForm,
      }).unwrap();

      closeUpdateModal();
      refetch();
      alert("Bug report updated successfully.");
    } catch (error: any) {
      alert(
        error?.data?.message ||
          error?.message ||
          "Failed to update bug report.",
      );
    }
  };

  return {
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
  };
};