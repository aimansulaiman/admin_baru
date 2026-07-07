"use client";

import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "@/app/api/rtk/productApi";
import { useGetSubTaxonsQuery, useGetTaxonsQuery } from "@/app/api/rtk/taxonApi";
import type { Product, ProductForm } from "@/types/product";
import { useMemo, useState } from "react";

const initialForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  loyalty_taxon_id: "",
  loyalty_sub_taxon_id: "",
  imageFile: null,
  imagePreview: "",
};

export const useProductTable = () => {
  const [page, setPage] = useState(1);
  const [nameInput, setNameInput] = useState("");

  const [form, setForm] = useState<ProductForm>(initialForm);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [message, setMessage] = useState("");

  const domainName = process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME || "MULA";

  const productQueryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("domain_name", domainName);
    params.set("page", String(page));
    params.set("per_page", "1000");

    return `?${params.toString()}`;
  }, [domainName, page]);

  const taxonQueryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("domain_name", domainName);
    params.set("per_page", "100");

    return `?${params.toString()}`;
  }, [domainName]);

  const subTaxonQueryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("domain_name", domainName);
    params.set("per_page", "100");

    if (form.loyalty_taxon_id) {
      params.set("loyalty_taxon_id", form.loyalty_taxon_id);
    }

    return `?${params.toString()}`;
  }, [domainName, form.loyalty_taxon_id]);

  const {
    data: productsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetProductsQuery(productQueryString);

  const { data: taxonsResponse } = useGetTaxonsQuery(taxonQueryString);

  const { data: subTaxonsResponse } = useGetSubTaxonsQuery(subTaxonQueryString);

  const [createProduct, { isLoading: isCreating }] =
    useCreateProductMutation();

  const [updateProduct, { isLoading: isUpdating }] =
    useUpdateProductMutation();

  const [deleteProduct, { isLoading: isDeleting }] =
    useDeleteProductMutation();

  const rawProducts = productsResponse?.data || [];

  const products = useMemo(() => {
    const keyword = nameInput.trim().toLowerCase();

    if (!keyword) {
      return rawProducts;
    }

    return rawProducts.filter((product) => {
      const searchableText = [
        product.name,
        product.description,
        product.price,
        product.loyalty_taxon_name,
        product.loyalty_sub_taxon_name,
        product.client_name,
        product.client_domain_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [rawProducts, nameInput]);

 const taxons = taxonsResponse?.data || [];
const rawSubTaxons = subTaxonsResponse?.data || [];

const subTaxons = useMemo(() => {
  if (!form.loyalty_taxon_id) {
    return [];
  }

  return rawSubTaxons.filter((subTaxon) => {
    return String(subTaxon.loyalty_taxon_id) === String(form.loyalty_taxon_id);
  });
}, [rawSubTaxons, form.loyalty_taxon_id]);

  const meta = productsResponse?.meta || null;

  const handleSearch = () => {
    setPage(1);
  };

  const handleClearSearch = () => {
    setNameInput("");
    setPage(1);
  };

  const openCreateForm = () => {
    setEditingProduct(null);
    setForm(initialForm);
    setIsFormOpen(true);
    setMessage("");
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ? String(product.price) : "",
      loyalty_taxon_id: product.loyalty_taxon_id
        ? String(product.loyalty_taxon_id)
        : "",
      loyalty_sub_taxon_id: product.loyalty_sub_taxon_id
        ? String(product.loyalty_sub_taxon_id)
        : "",
      imageFile: null,
      imagePreview: product.image || "",
    });

    setIsFormOpen(true);
    setMessage("");
  };

  const closeForm = () => {
    setEditingProduct(null);
    setForm(initialForm);
    setIsFormOpen(false);
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setForm((previousForm) => ({
        ...previousForm,
        imageFile: null,
        imagePreview: "",
      }));

      return;
    }

    setForm((previousForm) => ({
      ...previousForm,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const buildProductFormData = () => {
    const formData = new FormData();

    formData.append("product[name]", form.name);
    formData.append("product[description]", form.description);
    formData.append("product[price]", form.price);
    formData.append("domain_name", domainName);

    if (form.loyalty_taxon_id) {
      formData.append("product[loyalty_taxon_id]", form.loyalty_taxon_id);
    }

    if (form.loyalty_sub_taxon_id) {
      formData.append(
        "product[loyalty_sub_taxon_id]",
        form.loyalty_sub_taxon_id,
      );
    }

    if (form.imageFile) {
      formData.append("product[image_file]", form.imageFile);
    }

    return formData;
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!form.price.trim()) {
      alert("Please enter product price.");
      return;
    }

    if (!editingProduct && !form.imageFile) {
      alert("Please choose product image.");
      return;
    }

    try {
      const formData = buildProductFormData();

      if (editingProduct) {
        await updateProduct({
          id: editingProduct.id,
          data: formData,
        }).unwrap();

        setMessage("Product updated successfully.");
      } else {
        await createProduct(formData).unwrap();

        setMessage("Product created successfully.");
      }

      closeForm();
      refetch();
    } catch (error: any) {
      alert(error?.data?.message || error?.message || "Failed to save product.");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id).unwrap();

      setMessage("Product deleted successfully.");
      refetch();
    } catch (error: any) {
      alert(
        error?.data?.message || error?.message || "Failed to delete product.",
      );
    }
  };

  return {
    products,
    taxons,
    subTaxons,
    meta,
    page,
    nameInput,
    form,
    editingProduct,
    isFormOpen,
    message,

    isLoading,
    isFetching,
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
    handleDeleteProduct,
  };
};