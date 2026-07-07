"use client";

import {
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useGetBannersQuery,
  useUpdateBannerMutation,
} from "@/app/api/rtk/bannerApi";
import type { Banner } from "@/types/banner";
import { useMemo, useState } from "react";

type BannerFormState = {
  title: string;
  display_position: string;
  active: boolean;
  imageFile: File | null;
  imagePreview: string;
};

const emptyForm: BannerFormState = {
  title: "",
  display_position: "0",
  active: true,
  imageFile: null,
  imagePreview: "",
};

export const useBannerTable = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<BannerFormState>(emptyForm);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
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

    if (search) {
      params.set("title", search);
    }

    return `?${params.toString()}`;
  }, [page, search]);

  const { data, isLoading, isError, refetch } = useGetBannersQuery(queryString);

  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const banners = useMemo(() => data?.data || [], [data]);
  const meta = useMemo(() => data?.meta, [data]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const openCreateForm = () => {
    setEditingBanner(null);
    setForm(emptyForm);
    setIsFormOpen(true);
    setMessage("");
  };

  const openEditForm = (banner: Banner) => {
    setEditingBanner(banner);
    setIsFormOpen(true);

    setForm({
      title: banner.title || banner.name || "",
      display_position: String(
        banner.display_position || banner.position || "0",
      ),
      active: banner.active ?? banner.status ?? true,
      imageFile: null,
      imagePreview: banner.image || "",
    });

    setMessage("");
  };

  const closeForm = () => {
    setEditingBanner(null);
    setForm(emptyForm);
    setIsFormOpen(false);
    setMessage("");
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setForm({
        ...form,
        imageFile: null,
        imagePreview: editingBanner?.image || "",
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

    formData.append("banner[title]", form.title);
    formData.append("banner[display_position]", form.display_position);
    formData.append("banner[position]", form.display_position);
    formData.append("banner[active]", String(form.active));
    formData.append("banner[status]", String(form.active));

    if (form.imageFile) {
      formData.append("banner[image_file]", form.imageFile);
    }

    return formData;
  };

  const handleSubmit = async () => {
    setMessage("");

    if (!form.title.trim()) {
      setMessage("Banner title is required.");
      return;
    }

    if (!editingBanner && !form.imageFile) {
      setMessage("Please choose a banner image from your device.");
      return;
    }

    try {
      if (editingBanner) {
        await updateBanner({
          id: editingBanner.id,
          data: buildFormData(),
        }).unwrap();

        setMessage("Banner updated successfully.");
      } else {
        await createBanner(buildFormData()).unwrap();
        setMessage("Banner created successfully.");
      }

      setEditingBanner(null);
      setForm(emptyForm);
      setIsFormOpen(false);
    } catch (error: any) {
      console.log("BANNER SAVE ERROR:", error);

      setMessage(error?.data?.message || error?.error || "Failed to save banner.");
    }
  };

  const handleDeleteBanner = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this banner?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteBanner(id).unwrap();
      setMessage("Banner deleted successfully.");
    } catch (error: any) {
      console.log("BANNER DELETE ERROR:", error);

      setMessage(error?.data?.message || error?.error || "Failed to delete banner.");
    }
  };

  return {
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
    isDeleting,

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
  };
};