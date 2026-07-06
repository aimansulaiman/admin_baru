"use client";

import {
  useCreateMissionMutation,
  useDeleteMissionMutation,
  useGetMissionsQuery,
  useUpdateMissionMutation,
} from "@/app/api/rtk/missionApi";
import type { Mission } from "@/types/mission";
import { useMemo, useState } from "react";

type MissionFormState = {
  name: string;
  description: string;
  numbers: string;
  status: boolean;
  imageFile: File | null;
  imagePreview: string;
};

const emptyForm: MissionFormState = {
  name: "",
  description: "",
  numbers: "",
  status: true,
  imageFile: null,
  imagePreview: "",
};

export const useMissionTable = () => {
  const [page, setPage] = useState(1);

  const [nameInput, setNameInput] = useState("");
  const [statusInput, setStatusInput] = useState("");

  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const [form, setForm] = useState<MissionFormState>(emptyForm);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [message, setMessage] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set(
      "domain_name",
      process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME || "MULA",
    );
    params.set("page", String(page));
    params.set("per_page", "20");

    if (name) params.set("name", name);
    if (status) params.set("status", status);

    return `?${params.toString()}`;
  }, [page, name, status]);

  const { data, isLoading, isError, refetch } =
    useGetMissionsQuery(queryString);

  const [createMission, { isLoading: isCreating }] =
    useCreateMissionMutation();
  const [updateMission, { isLoading: isUpdating }] =
    useUpdateMissionMutation();
  const [deleteMission, { isLoading: isDeleting }] =
    useDeleteMissionMutation();

  const missions = useMemo(() => data?.data || [], [data]);
  const meta = useMemo(() => data?.meta, [data]);

  const handleSearch = () => {
    setPage(1);
    setName(nameInput);
    setStatus(statusInput);
  };

  const handleClearSearch = () => {
    setPage(1);

    setNameInput("");
    setStatusInput("");

    setName("");
    setStatus("");
  };

  const openCreateForm = () => {
    setEditingMission(null);
    setForm(emptyForm);
    setIsFormOpen(true);
    setMessage("");
  };

  const openEditForm = (mission: Mission) => {
    setEditingMission(mission);
    setIsFormOpen(true);

    setForm({
      name: mission.name || "",
      description: mission.description || "",
      numbers: mission.numbers ? String(mission.numbers) : "",
      status:
        typeof mission.status === "boolean"
          ? mission.status
          : String(mission.status) === "true",
      imageFile: null,
      imagePreview: mission.image || "",
    });

    setMessage("");
  };

  const closeForm = () => {
    setEditingMission(null);
    setForm(emptyForm);
    setIsFormOpen(false);
    setMessage("");
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setForm({
        ...form,
        imageFile: null,
        imagePreview: editingMission?.image || "",
      });

      return;
    }

    setForm({
      ...form,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    });
  };

  const buildFormData = () => {
    const formData = new FormData();

    formData.append(
      "domain_name",
      process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME || "MULA",
    );

    formData.append("mission[name]", form.name);
    formData.append("mission[description]", form.description);
    formData.append("mission[numbers]", form.numbers);
    formData.append("mission[status]", String(form.status));

    if (form.imageFile) {
      formData.append("mission[image_file]", form.imageFile);
    }

    return formData;
  };

  const handleSubmit = async () => {
    setMessage("");

    if (!form.name.trim()) {
      setMessage("Mission name is required.");
      return;
    }

    if (!editingMission && !form.imageFile) {
      setMessage("Please choose a mission image from your device.");
      return;
    }

    try {
      if (editingMission) {
        await updateMission({
          id: editingMission.id,
          data: buildFormData(),
        }).unwrap();

        setMessage("Mission updated successfully.");
      } else {
        await createMission(buildFormData()).unwrap();
        setMessage("Mission created successfully.");
      }

      setEditingMission(null);
      setForm(emptyForm);
      setIsFormOpen(false);
    } catch (error: any) {
      console.log("MISSION SAVE ERROR:", error);

      setMessage(
        error?.data?.message || error?.error || "Failed to save mission.",
      );
    }
  };

  const handleDeleteMission = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this mission?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMission(id).unwrap();
      setMessage("Mission deleted successfully.");
    } catch (error: any) {
      console.log("MISSION DELETE ERROR:", error);

      setMessage(
        error?.data?.message || error?.error || "Failed to delete mission.",
      );
    }
  };

  return {
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
    isDeleting,

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
  };
};