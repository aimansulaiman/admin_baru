"use client";

import {
  useGetAdditionalSettingQuery,
  useUpdateAdditionalSettingMutation,
} from "@/app/api/rtk/additionalSettingsApi";
import type { AdditionalSetting } from "@/types/additionalSettings";
import { useEffect, useMemo, useState } from "react";

type AdditionalSettingFormState = {
  name: string;
  email: string;
  phone_number: string;
  website: string;
  address: string;
  default_points: string;
  minimum_points: string;
  maximum_points: string;
  active: boolean;
};

const emptyForm: AdditionalSettingFormState = {
  name: "",
  email: "",
  phone_number: "",
  website: "",
  address: "",
  default_points: "",
  minimum_points: "",
  maximum_points: "",
  active: true,
};

export const useAdditionalSettingForm = () => {
  const [form, setForm] = useState<AdditionalSettingFormState>(emptyForm);
  const [message, setMessage] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set(
      "domain_name",
      process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME || "MULA",
    );

    return `?${params.toString()}`;
  }, []);

  const { data, isLoading, isError, refetch } =
    useGetAdditionalSettingQuery(queryString);

  const [updateAdditionalSetting, { isLoading: isUpdating }] =
    useUpdateAdditionalSettingMutation();

  const setting = useMemo(() => {
    return data;
  }, [data]);

  useEffect(() => {
    if (!setting) {
      return;
    }

    setForm({
      name: setting.name || "",
      email: setting.email || "",
      phone_number: setting.phone_number || "",
      website: setting.website || "",
      address: setting.address || "",
      default_points: setting.default_points
        ? String(setting.default_points)
        : "",
      minimum_points: setting.minimum_points
        ? String(setting.minimum_points)
        : "",
      maximum_points: setting.maximum_points
        ? String(setting.maximum_points)
        : "",
      active: setting.active ?? true,
    });
  }, [setting]);

  const handleChange = (
    field: keyof AdditionalSettingFormState,
    value: string | boolean,
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleReset = () => {
    if (!setting) {
      setForm(emptyForm);
      return;
    }

    setForm({
      name: setting.name || "",
      email: setting.email || "",
      phone_number: setting.phone_number || "",
      website: setting.website || "",
      address: setting.address || "",
      default_points: setting.default_points
        ? String(setting.default_points)
        : "",
      minimum_points: setting.minimum_points
        ? String(setting.minimum_points)
        : "",
      maximum_points: setting.maximum_points
        ? String(setting.maximum_points)
        : "",
      active: setting.active ?? true,
    });

    setMessage("");
  };

  const handleSubmit = async () => {
    setMessage("");

    try {
      await updateAdditionalSetting(form).unwrap();
      setMessage("Additional settings updated successfully.");
    } catch (error: any) {
      console.log("ADDITIONAL SETTING SAVE ERROR:", error);

      setMessage(
        error?.data?.message ||
          error?.error ||
          "Failed to update additional settings.",
      );
    }
  };

  return {
    setting,
    form,
    message,

    isLoading,
    isError,
    isUpdating,

    refetch,
    handleChange,
    handleReset,
    handleSubmit,
  };
};