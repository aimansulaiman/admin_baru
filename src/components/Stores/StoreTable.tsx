"use client";

import {
  useCreateStoreMutation,
  useDeleteStoreMutation,
  useGetStoresQuery,
  useUpdateStoreMutation,
} from "@/app/api/rtk/storeApi";
import type { Store } from "@/types/store";
import { useMemo, useState } from "react";

type StoreFormState = {
  name: string;
  title: string;
  email: string;
  phone_number: string;
  address: string;
  opening_hours: string;
  closing_hours: string;
  description: string;
  active: boolean;
  imageFile: File | null;
  imagePreview: string;
};

const emptyForm: StoreFormState = {
  name: "",
  title: "",
  email: "",
  phone_number: "",
  address: "",
  opening_hours: "",
  closing_hours: "",
  description: "",
  active: true,
  imageFile: null,
  imagePreview: "",
};

export const useStoreTable = () => {
  const [page, setPage] = useState(1);
  const [nameInput, setNameInput] = useState("");

  const [form, setForm] = useState<StoreFormState>(emptyForm);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [message, setMessage] = useState("");

  const domainName = process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME || "MULA";

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("domain_name", domainName);
    params.set("page", "1");
    params.set("per_page", "1000");

    return `?${params.toString()}`;
  }, [domainName]);

  const { data, isLoading, isError, refetch } = useGetStoresQuery(queryString);

  const [createStore, { isLoading: isCreating }] = useCreateStoreMutation();
  const [updateStore, { isLoading: isUpdating }] = useUpdateStoreMutation();
  const [deleteStore, { isLoading: isDeleting }] = useDeleteStoreMutation();

  const rawStores = data?.data || [];

  const stores = useMemo(() => {
    const keyword = nameInput.trim().toLowerCase();

    if (!keyword) {
      return rawStores;
    }

    return rawStores.filter((store) => {
      const searchableText = [
        store.name,
        store.title,
        store.email,
        store.phone_number,
        store.address,
        store.description,
        store.opening_hours,
        store.closing_hours,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [rawStores, nameInput]);

  const meta = useMemo(() => data?.meta, [data]);

  const handleSearch = () => {
    setPage(1);
  };

  const handleClearSearch = () => {
    setPage(1);
    setNameInput("");
  };

  const openCreateForm = () => {
    setEditingStore(null);
    setForm(emptyForm);
    setIsFormOpen(true);
    setMessage("");
  };

  const openEditForm = (store: Store) => {
    setEditingStore(store);
    setIsFormOpen(true);

    setForm({
      name: store.name || "",
      title: store.title || "",
      email: store.email || "",
      phone_number: store.phone_number || "",
      address: store.address || "",
      opening_hours: store.opening_hours || "",
      closing_hours: store.closing_hours || "",
      description: store.description || "",
      active: store.active ?? true,
      imageFile: null,
      imagePreview: store.image || "",
    });

    setMessage("");
  };

  const closeForm = () => {
    setEditingStore(null);
    setForm(emptyForm);
    setIsFormOpen(false);
    setMessage("");
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setForm({
        ...form,
        imageFile: null,
        imagePreview: editingStore?.image || "",
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

    formData.append("domain_name", domainName);

    formData.append("store[name]", form.name);
    formData.append("store[title]", form.title);
    formData.append("store[email]", form.email);
    formData.append("store[phone_number]", form.phone_number);
    formData.append("store[address]", form.address);
    formData.append("store[opening_hours]", form.opening_hours);
    formData.append("store[closing_hours]", form.closing_hours);
    formData.append("store[description]", form.description);
    formData.append("store[active]", String(form.active));

    if (form.imageFile) {
      formData.append("store[image_file]", form.imageFile);
    }

    return formData;
  };

  const handleSubmit = async () => {
    setMessage("");

    if (!form.name.trim()) {
      setMessage("Store name is required.");
      return;
    }

    if (!editingStore && !form.imageFile) {
      setMessage("Please choose a store image from your device.");
      return;
    }

    try {
      if (editingStore) {
        await updateStore({
          id: editingStore.id,
          data: buildFormData(),
        }).unwrap();

        setMessage("Store updated successfully.");
      } else {
        await createStore(buildFormData()).unwrap();

        setMessage("Store created successfully.");
      }

      setEditingStore(null);
      setForm(emptyForm);
      setIsFormOpen(false);
      refetch();
    } catch (error: any) {
      console.log("STORE SAVE ERROR:", error);

      setMessage(
        error?.data?.message || error?.error || "Failed to save store.",
      );
    }
  };

  const handleDeleteStore = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this store?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteStore(id).unwrap();

      setMessage("Store deleted successfully.");
      refetch();
    } catch (error: any) {
      console.log("STORE DELETE ERROR:", error);

      setMessage(
        error?.data?.message || error?.error || "Failed to delete store.",
      );
    }
  };

  return {
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
    isDeleting,

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
  };
};