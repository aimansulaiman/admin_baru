"use client";

import {
  useCreateSubTaxonMutation,
  useCreateTaxonMutation,
  useDeleteSubTaxonMutation,
  useDeleteTaxonMutation,
  useGetSubTaxonsQuery,
  useGetTaxonsQuery,
  useUpdateSubTaxonMutation,
  useUpdateTaxonMutation,
} from "@/app/api/rtk/taxonApi";
import type { SubTaxon, Taxon } from "@/types/taxon";
import { useMemo, useState } from "react";

type TaxonFormState = {
  name: string;
};

type SubTaxonFormState = {
  name: string;
  category: string;
  loyalty_taxon_id: string;
};

const emptyTaxonForm: TaxonFormState = {
  name: "",
};

const emptySubTaxonForm: SubTaxonFormState = {
  name: "",
  category: "",
  loyalty_taxon_id: "",
};

export const useTaxonTable = () => {
  const [taxonName, setTaxonName] = useState("");
  const [subTaxonName, setSubTaxonName] = useState("");
  const [selectedTaxonId, setSelectedTaxonId] = useState("");

  const [taxonSearch, setTaxonSearch] = useState({
    name: "",
  });

  const [subTaxonSearch, setSubTaxonSearch] = useState({
    name: "",
    loyalty_taxon_id: "",
  });

  const [isTaxonFormOpen, setIsTaxonFormOpen] = useState(false);
  const [isSubTaxonFormOpen, setIsSubTaxonFormOpen] = useState(false);

  const [editingTaxon, setEditingTaxon] = useState<Taxon | null>(null);
  const [editingSubTaxon, setEditingSubTaxon] = useState<SubTaxon | null>(null);

  const [taxonForm, setTaxonForm] = useState<TaxonFormState>(emptyTaxonForm);

  const [subTaxonForm, setSubTaxonForm] =
    useState<SubTaxonFormState>(emptySubTaxonForm);

  const [message, setMessage] = useState("");

  const taxonQueryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set(
      "domain_name",
      process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME || "MULA",
    );

    params.set("page", "1");
    params.set("per_page", "20");

    if (taxonSearch.name) {
      params.set("name", taxonSearch.name);
    }

    return `?${params.toString()}`;
  }, [taxonSearch]);

  const subTaxonQueryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set(
      "domain_name",
      process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME || "MULA",
    );

    params.set("page", "1");
    params.set("per_page", "20");

    if (subTaxonSearch.name) {
      params.set("name", subTaxonSearch.name);
    }

    if (subTaxonSearch.loyalty_taxon_id) {
      params.set("taxon_id", subTaxonSearch.loyalty_taxon_id);
    }

    return `?${params.toString()}`;
  }, [subTaxonSearch]);

  const {
    data: taxonData,
    isLoading: isTaxonLoading,
    isError: isTaxonError,
    refetch: refetchTaxons,
  } = useGetTaxonsQuery(taxonQueryString);

  const {
    data: subTaxonData,
    isLoading: isSubTaxonLoading,
    isError: isSubTaxonError,
    refetch: refetchSubTaxons,
  } = useGetSubTaxonsQuery(subTaxonQueryString);

  const [createTaxon, { isLoading: isCreatingTaxon }] =
    useCreateTaxonMutation();

  const [updateTaxon, { isLoading: isUpdatingTaxon }] =
    useUpdateTaxonMutation();

  const [deleteTaxon, { isLoading: isDeletingTaxon }] =
    useDeleteTaxonMutation();

  const [createSubTaxon, { isLoading: isCreatingSubTaxon }] =
    useCreateSubTaxonMutation();

  const [updateSubTaxon, { isLoading: isUpdatingSubTaxon }] =
    useUpdateSubTaxonMutation();

  const [deleteSubTaxon, { isLoading: isDeletingSubTaxon }] =
    useDeleteSubTaxonMutation();

  const taxons = useMemo(() => {
    return taxonData?.data || [];
  }, [taxonData]);

  const subTaxons = useMemo(() => {
    return subTaxonData?.data || [];
  }, [subTaxonData]);

  const taxonMeta = useMemo(() => {
    return taxonData?.meta;
  }, [taxonData]);

  const subTaxonMeta = useMemo(() => {
    return subTaxonData?.meta;
  }, [subTaxonData]);

  const handleTaxonSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setTaxonSearch({
      name: taxonName,
    });
  };

  const handleSubTaxonSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubTaxonSearch({
      name: subTaxonName,
      loyalty_taxon_id: selectedTaxonId,
    });
  };

  const handleTaxonReset = () => {
    setTaxonName("");

    setTaxonSearch({
      name: "",
    });
  };

  const handleSubTaxonReset = () => {
    setSubTaxonName("");
    setSelectedTaxonId("");

    setSubTaxonSearch({
      name: "",
      loyalty_taxon_id: "",
    });
  };

  const openAddTaxonForm = () => {
    setEditingTaxon(null);
    setTaxonForm(emptyTaxonForm);
    setMessage("");
    setIsTaxonFormOpen(true);
  };

  const openEditTaxonForm = (taxon: Taxon) => {
    setEditingTaxon(taxon);

    setTaxonForm({
      name: taxon.name || "",
    });

    setMessage("");
    setIsTaxonFormOpen(true);
  };

  const closeTaxonForm = () => {
    setIsTaxonFormOpen(false);
    setEditingTaxon(null);
    setTaxonForm(emptyTaxonForm);
  };

  const openAddSubTaxonForm = () => {
    setEditingSubTaxon(null);
    setSubTaxonForm(emptySubTaxonForm);
    setMessage("");
    setIsSubTaxonFormOpen(true);
  };

  const openEditSubTaxonForm = (subTaxon: SubTaxon) => {
    setEditingSubTaxon(subTaxon);

    setSubTaxonForm({
      name: subTaxon.name || "",
      category: subTaxon.category || "",
      loyalty_taxon_id: subTaxon.loyalty_taxon_id
        ? String(subTaxon.loyalty_taxon_id)
        : "",
    });

    setMessage("");
    setIsSubTaxonFormOpen(true);
  };

  const closeSubTaxonForm = () => {
    setIsSubTaxonFormOpen(false);
    setEditingSubTaxon(null);
    setSubTaxonForm(emptySubTaxonForm);
  };

  const handleTaxonFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setMessage("");

    try {
      if (editingTaxon) {
        await updateTaxon({
          id: editingTaxon.id,
          data: taxonForm,
        }).unwrap();

        setMessage("Taxon updated successfully.");
      } else {
        await createTaxon(taxonForm).unwrap();

        setMessage("Taxon added successfully.");
      }

      closeTaxonForm();
    } catch {
      setMessage("Failed to save taxon. Please check required fields.");
    }
  };

  const handleSubTaxonFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setMessage("");

    const selectedTaxon = taxons.find(
      (taxon) => String(taxon.id) === subTaxonForm.loyalty_taxon_id,
    );

    const payload = {
      name: subTaxonForm.name,
      category: subTaxonForm.category || selectedTaxon?.name || "",
      loyalty_taxon_id: Number(subTaxonForm.loyalty_taxon_id),
    };

    try {
      if (editingSubTaxon) {
        await updateSubTaxon({
          id: editingSubTaxon.id,
          data: payload,
        }).unwrap();

        setMessage("Sub taxon updated successfully.");
      } else {
        await createSubTaxon(payload).unwrap();

        setMessage("Sub taxon added successfully.");
      }

      closeSubTaxonForm();
    } catch {
      setMessage("Failed to save sub taxon. Please check required fields.");
    }
  };

  const handleDeleteTaxon = async (taxon: Taxon) => {
    const confirmDelete = window.confirm(`Delete taxon ${taxon.name}?`);

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteTaxon(taxon.id).unwrap();
      setMessage("Taxon deleted successfully.");
    } catch {
      setMessage("Failed to delete taxon.");
    }
  };

  const handleDeleteSubTaxon = async (subTaxon: SubTaxon) => {
    const confirmDelete = window.confirm(`Delete sub taxon ${subTaxon.name}?`);

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteSubTaxon(subTaxon.id).unwrap();
      setMessage("Sub taxon deleted successfully.");
    } catch {
      setMessage("Failed to delete sub taxon.");
    }
  };

  return {
    taxonName,
    setTaxonName,
    subTaxonName,
    setSubTaxonName,
    selectedTaxonId,
    setSelectedTaxonId,

    taxons,
    subTaxons,
    taxonMeta,
    subTaxonMeta,

    taxonForm,
    setTaxonForm,
    subTaxonForm,
    setSubTaxonForm,

    message,

    isTaxonFormOpen,
    isSubTaxonFormOpen,
    editingTaxon,
    editingSubTaxon,

    isTaxonLoading,
    isSubTaxonLoading,
    isTaxonError,
    isSubTaxonError,

    isCreatingTaxon,
    isUpdatingTaxon,
    isDeletingTaxon,

    isCreatingSubTaxon,
    isUpdatingSubTaxon,
    isDeletingSubTaxon,

    refetchTaxons,
    refetchSubTaxons,

    handleTaxonSearch,
    handleSubTaxonSearch,
    handleTaxonReset,
    handleSubTaxonReset,

    openAddTaxonForm,
    openEditTaxonForm,
    closeTaxonForm,

    openAddSubTaxonForm,
    openEditSubTaxonForm,
    closeSubTaxonForm,

    handleTaxonFormSubmit,
    handleSubTaxonFormSubmit,

    handleDeleteTaxon,
    handleDeleteSubTaxon,
  };
};