"use client";

import {
  useCreateCheckinRewardMutation,
  useDeleteCheckinRewardMutation,
  useGetCheckinRewardsQuery,
  useUpdateCheckinRewardMutation,
} from "@/app/api/rtk/checkinRewardApi";
import type { CheckinReward } from "@/types/checkinReward";
import { useMemo, useState } from "react";

type CheckinRewardFormState = {
  day_number: string;
  points_reward: string;
  bonus_points: string;
  reward_type: string;
  reward_config: string;
  is_milestone: boolean;
  active: boolean;
};

const emptyForm: CheckinRewardFormState = {
  day_number: "",
  points_reward: "",
  bonus_points: "",
  reward_type: "points",
  reward_config: "",
  is_milestone: false,
  active: true,
};

export const useCheckinRewardTable = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState<CheckinRewardFormState>(emptyForm);
  const [editingReward, setEditingReward] = useState<CheckinReward | null>(
    null,
  );
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
    useGetCheckinRewardsQuery(queryString);

  const [createCheckinReward, { isLoading: isCreating }] =
    useCreateCheckinRewardMutation();

  const [updateCheckinReward, { isLoading: isUpdating }] =
    useUpdateCheckinRewardMutation();

  const [deleteCheckinReward, { isLoading: isDeleting }] =
    useDeleteCheckinRewardMutation();

  const rawRewards = data?.data || [];

  const rewards = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return rawRewards;
    }

    return rawRewards.filter((reward) => {
      const searchableText = [
        reward.day_number,
        reward.points_reward,
        reward.bonus_points,
        reward.reward_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [rawRewards, search]);

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
    setEditingReward(null);
    setForm(emptyForm);
    setIsFormOpen(true);
    setMessage("");
  };

  const openEditForm = (reward: CheckinReward) => {
    setEditingReward(reward);
    setIsFormOpen(true);

    setForm({
      day_number: reward.day_number ? String(reward.day_number) : "",
      points_reward: reward.points_reward ? String(reward.points_reward) : "",
      bonus_points: reward.bonus_points ? String(reward.bonus_points) : "",
      reward_type: reward.reward_type || "points",
      reward_config: reward.reward_config || "",
      is_milestone: reward.is_milestone || false,
      active: reward.active ?? true,
    });

    setMessage("");
  };

  const closeForm = () => {
    setEditingReward(null);
    setForm(emptyForm);
    setIsFormOpen(false);
    setMessage("");
  };

  const buildPayload = () => {
    return {
      day_number: form.day_number,
      points_reward: form.points_reward,
      bonus_points: form.bonus_points,
      reward_type: form.reward_type,
      reward_config: form.reward_config,
      is_milestone: form.is_milestone,
      active: form.active,
    };
  };

  const handleSubmit = async () => {
    setMessage("");

    try {
      if (editingReward) {
        await updateCheckinReward({
          id: editingReward.id,
          data: buildPayload(),
        }).unwrap();

        setMessage("Check-in reward updated successfully.");
      } else {
        await createCheckinReward(buildPayload()).unwrap();

        setMessage("Check-in reward created successfully.");
      }

      setEditingReward(null);
      setForm(emptyForm);
      setIsFormOpen(false);
      refetch();
    } catch (error: any) {
      console.log("CHECK-IN REWARD SAVE ERROR:", error);

      setMessage(
        error?.data?.message ||
          error?.error ||
          "Failed to save check-in reward.",
      );
    }
  };

  const handleDeleteReward = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this check-in reward?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCheckinReward(id).unwrap();

      setMessage("Check-in reward deleted successfully.");
      refetch();
    } catch (error: any) {
      console.log("CHECK-IN REWARD DELETE ERROR:", error);

      setMessage(
        error?.data?.message ||
          error?.error ||
          "Failed to delete check-in reward.",
      );
    }
  };

  return {
    rewards,
    meta,
    page,
    searchInput,
    form,
    editingReward,
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
    handleSubmit,
    handleDeleteReward,
  };
};