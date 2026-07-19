"use client";

import {
  useCreateMerchandiseMutation,
  useDeleteMerchandiseMutation,
  useGetMerchandisesQuery,
  useUpdateMerchandiseMutation,
} from "@/app/api/rtk/merchandiseApi";
import type { Merchandise } from "@/types/merchandise";
import { useMemo, useState } from "react";

type MerchandiseFormState = {
  name: string;
  description: string;
  image: string;
  imageFile: File | null;
  imagePreview: string;
  price: string;
  harga: string;
  start_date: string;
  end_date: string;
  active: boolean;
};

const emptyForm: MerchandiseFormState = {
  name: "",
  description: "",
  image: "",
  imageFile: null,
  imagePreview: "",
  price: "",
  harga: "",
  start_date: "",
  end_date: "",
  active: true,
};

export const useMerchandiseTable = () => {
  const [name, setName] = useState("");
  const [active, setActive] = useState("");
  const [currentlyActive, setCurrentlyActive] = useState("");

  const [search, setSearch] = useState({
    name: "",
    active: "",
    currently_active: "",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMerchandise, setEditingMerchandise] =
    useState<Merchandise | null>(null);

  const [form, setForm] = useState<MerchandiseFormState>(emptyForm);
  const [message, setMessage] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set(
      "domain_name",
      process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME || "MULA",
    );

    params.set("page", "1");
    params.set("per_page", "20");

    if (search.name) {
      params.set("name", search.name);
    }

    if (search.active) {
      params.set("active", search.active);
    }

    if (search.currently_active) {
      params.set("currently_active", search.currently_active);
    }

    return `?${params.toString()}`;
  }, [search]);

  const { data, isLoading, isError, refetch } =
    useGetMerchandisesQuery(queryString);

  const [createMerchandise, { isLoading: isCreating }] =
    useCreateMerchandiseMutation();

  const [updateMerchandise, { isLoading: isUpdating }] =
    useUpdateMerchandiseMutation();

  const [deleteMerchandise, { isLoading: isDeleting }] =
    useDeleteMerchandiseMutation();

  const merchandises = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const meta = useMemo(() => {
    return data?.meta;
  }, [data]);

  const stats = useMemo(() => {
    return meta?.stats;
  }, [meta]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSearch({
      name,
      active,
      currently_active: currentlyActive,
    });
  };

  const handleReset = () => {
    setName("");
    setActive("");
    setCurrentlyActive("");

    setSearch({
      name: "",
      active: "",
      currently_active: "",
    });
  };

  const handleImageChange = (
  event: React.ChangeEvent<HTMLInputElement>,
) => {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!allowedTypes.includes(file.type)) {
    setMessage("Please choose a JPG, PNG, WEBP or GIF image.");
    return;
  }

  const maximumSize = 5 * 1024 * 1024;

  if (file.size > maximumSize) {
    setMessage("Image size must be below 5 MB.");
    return;
  }

  if (form.imagePreview.startsWith("blob:")) {
    URL.revokeObjectURL(form.imagePreview);
  }

  setForm((currentForm) => ({
    ...currentForm,
    imageFile: file,
    imagePreview: URL.createObjectURL(file),
  }));

  setMessage("");
};

  const openAddForm = () => {
    setEditingMerchandise(null);
    setForm(emptyForm);
    setMessage("");
    setIsFormOpen(true);
  };

  const openEditForm = (merchandise: Merchandise) => {
  setEditingMerchandise(merchandise);

  setForm({
    name: merchandise.name || "",
    description: merchandise.description || "",
    image: merchandise.image || "",
    imageFile: null,
    imagePreview: merchandise.image || "",
    price: merchandise.price ? String(merchandise.price) : "",
    harga: merchandise.harga ? String(merchandise.harga) : "",
    start_date: merchandise.start_date || "",
    end_date: merchandise.end_date || "",
    active: merchandise.active ?? true,
  });

  setMessage("");
  setIsFormOpen(true);
};

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingMerchandise(null);
    setForm(emptyForm);
  };

  const buildFormData = () => {
  const formData = new FormData();

  formData.append("merchandise[name]", form.name);
  formData.append("merchandise[description]", form.description);
  formData.append("merchandise[price]", form.price);
  formData.append("merchandise[harga]", form.harga);
  formData.append("merchandise[start_date]", form.start_date);
  formData.append("merchandise[end_date]", form.end_date);
  formData.append("merchandise[active]", String(form.active));

  if (form.imageFile) {
    formData.append("merchandise[image_file]", form.imageFile);
  } else if (form.image) {
    formData.append("merchandise[image]", form.image);
  }

  return formData;
};

  const handleFormSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();
  setMessage("");

  const formData = buildFormData();

  try {
    if (editingMerchandise) {
      await updateMerchandise({
        id: editingMerchandise.id,
        formData,
      }).unwrap();

      setMessage("Merchandise updated successfully.");
    } else {
      await createMerchandise(formData).unwrap();

      setMessage("Merchandise added successfully.");
    }

    closeForm();
  } catch (error) {
    console.error("Failed to save merchandise:", error);

    setMessage(
      "Failed to save merchandise. Please check the required fields.",
    );
  }
};

  const handleDelete = async (merchandise: Merchandise) => {
    const confirmDelete = window.confirm(
      `Delete merchandise ${merchandise.name}?`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteMerchandise(merchandise.id).unwrap();
      setMessage("Merchandise deleted successfully.");
    } catch {
      setMessage("Failed to delete merchandise.");
    }
  };

  return {
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
  handleImageChange,
};
};