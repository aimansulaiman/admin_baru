"use client";

import {
  useCreateRewardCampaignMutation,
  useDeleteRewardCampaignMutation,
  useGetRewardCampaignsQuery,
  useUpdateRewardCampaignMutation,
} from "@/app/api/rtk/rewardCampaignApi";
import type { RewardCampaign } from "@/types/rewardCampaign";
import { useMemo, useState } from "react";

type RewardCampaignFormState = {
  title: string;
  points: string;
  code: string;
  usage_limit: string;
  discount_type: string;
  discount_value: string;
  min_order_amount: string;
  start_date: string;
  end_date: string;
  description: string;
  status: boolean;
  imageFile: File | null;
  imagePreview: string;
};

const emptyForm: RewardCampaignFormState = {
  title: "",
  points: "",
  code: "",
  usage_limit: "",
  discount_type: "percentage",
  discount_value: "",
  min_order_amount: "",
  start_date: "",
  end_date: "",
  description: "",
  status: true,
  imageFile: null,
  imagePreview: "",
};

export const useRewardCampaignTable = () => {
  const [page, setPage] = useState(1);

  const [titleInput, setTitleInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [statusInput, setStatusInput] = useState("");

  const [search, setSearch] = useState({
    title: "",
    code: "",
    status: "",
  });

  const [form, setForm] = useState<RewardCampaignFormState>(emptyForm);
  const [editingCampaign, setEditingCampaign] =
    useState<RewardCampaign | null>(null);
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

  const { data, isLoading, isError, refetch } =
    useGetRewardCampaignsQuery(queryString);

  const [createRewardCampaign, { isLoading: isCreating }] =
    useCreateRewardCampaignMutation();

  const [updateRewardCampaign, { isLoading: isUpdating }] =
    useUpdateRewardCampaignMutation();

  const [deleteRewardCampaign, { isLoading: isDeleting }] =
    useDeleteRewardCampaignMutation();

  const rawCampaigns = data?.data || [];

  const campaigns = useMemo(() => {
    const titleKeyword = search.title.trim().toLowerCase();
    const codeKeyword = search.code.trim().toLowerCase();
    const statusKeyword = search.status.trim().toLowerCase();

    return rawCampaigns.filter((campaign) => {
      const titleText = String(campaign.title || "").toLowerCase();
      const codeText = String(campaign.code || "").toLowerCase();

      const campaignStatus =
        typeof campaign.status === "boolean"
          ? campaign.status
            ? "true"
            : "false"
          : String(campaign.status || "").toLowerCase();

      const statusText =
        campaignStatus === "true" ? "true active" : "false inactive";

      const matchesTitle = !titleKeyword || titleText.includes(titleKeyword);

      const matchesCode = !codeKeyword || codeText.includes(codeKeyword);

      const matchesStatus =
        !statusKeyword || statusText.includes(statusKeyword);

      return matchesTitle && matchesCode && matchesStatus;
    });
  }, [rawCampaigns, search]);

  const meta = useMemo(() => data?.meta, [data]);

  const handleSearch = () => {
    setPage(1);

    setSearch({
      title: titleInput,
      code: codeInput,
      status: statusInput,
    });
  };

  const handleClearSearch = () => {
    setPage(1);

    setTitleInput("");
    setCodeInput("");
    setStatusInput("");

    setSearch({
      title: "",
      code: "",
      status: "",
    });
  };

  const openCreateForm = () => {
    setEditingCampaign(null);
    setForm(emptyForm);
    setIsFormOpen(true);
    setMessage("");
  };

  const openEditForm = (campaign: RewardCampaign) => {
    setEditingCampaign(campaign);
    setIsFormOpen(true);

    setForm({
      title: campaign.title || "",
      points: campaign.points ? String(campaign.points) : "",
      code: campaign.code || "",
      usage_limit: campaign.usage_limit ? String(campaign.usage_limit) : "",
      discount_type: campaign.discount_type || "percentage",
      discount_value: campaign.discount_value
        ? String(campaign.discount_value)
        : "",
      min_order_amount: campaign.min_order_amount
        ? String(campaign.min_order_amount)
        : "",
      start_date: campaign.start_date || "",
      end_date: campaign.end_date || "",
      description: campaign.description || "",
      status:
        typeof campaign.status === "boolean"
          ? campaign.status
          : String(campaign.status) === "true",
      imageFile: null,
      imagePreview: campaign.image || "",
    });

    setMessage("");
  };

  const closeForm = () => {
    setEditingCampaign(null);
    setForm(emptyForm);
    setIsFormOpen(false);
    setMessage("");
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setForm({
        ...form,
        imageFile: null,
        imagePreview: editingCampaign?.image || "",
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

    formData.append("reward_campaign[title]", form.title);
    formData.append("reward_campaign[points]", form.points);
    formData.append("reward_campaign[code]", form.code);
    formData.append("reward_campaign[usage_limit]", form.usage_limit);
    formData.append("reward_campaign[discount_type]", form.discount_type);
    formData.append("reward_campaign[discount_value]", form.discount_value);
    formData.append(
      "reward_campaign[min_order_amount]",
      form.min_order_amount,
    );
    formData.append("reward_campaign[start_date]", form.start_date);
    formData.append("reward_campaign[end_date]", form.end_date);
    formData.append("reward_campaign[description]", form.description);
    formData.append("reward_campaign[status]", String(form.status));

    if (form.imageFile) {
      formData.append("reward_campaign[image_file]", form.imageFile);
    }

    return formData;
  };

  const handleSubmit = async () => {
    setMessage("");

    if (!form.title.trim()) {
      setMessage("Campaign title is required.");
      return;
    }

    if (!form.points.trim()) {
      setMessage("Points is required.");
      return;
    }

    if (!editingCampaign && !form.imageFile) {
      setMessage("Please choose a reward campaign image from your device.");
      return;
    }

    try {
      if (editingCampaign) {
        await updateRewardCampaign({
          id: editingCampaign.id,
          data: buildFormData(),
        }).unwrap();

        setMessage("Reward campaign updated successfully.");
      } else {
        await createRewardCampaign(buildFormData()).unwrap();

        setMessage("Reward campaign created successfully.");
      }

      setEditingCampaign(null);
      setForm(emptyForm);
      setIsFormOpen(false);
      refetch();
    } catch (error: any) {
      console.log("REWARD CAMPAIGN SAVE ERROR:", error);

      setMessage(
        error?.data?.message ||
          error?.error ||
          "Failed to save reward campaign.",
      );
    }
  };

  const handleDeleteCampaign = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reward campaign?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteRewardCampaign(id).unwrap();

      setMessage("Reward campaign deleted successfully.");
      refetch();
    } catch (error: any) {
      console.log("REWARD CAMPAIGN DELETE ERROR:", error);

      setMessage(
        error?.data?.message ||
          error?.error ||
          "Failed to delete reward campaign.",
      );
    }
  };

  return {
    campaigns,
    meta,
    page,

    titleInput,
    codeInput,
    statusInput,

    form,
    editingCampaign,
    isFormOpen,
    message,

    isLoading,
    isError,
    isCreating,
    isUpdating,
    isDeleting,

    setPage,
    setTitleInput,
    setCodeInput,
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
    handleDeleteCampaign,
  };
};