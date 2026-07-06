"use client";

import {
  useGetPointsConfigurationQuery,
  useUpdatePointsConfigurationMutation,
} from "@/app/api/rtk/pointsConfigurationApi";
import { useMemo, useState } from "react";

export const usePointsConfigurationForm = () => {
  const [defaultPoints, setDefaultPoints] = useState("");
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
    useGetPointsConfigurationQuery(queryString);

  const [updatePointsConfiguration, { isLoading: isUpdating }] =
    useUpdatePointsConfigurationMutation();

  const configuration = useMemo(() => {
    return data;
  }, [data]);

  const currentDefaultPoints = useMemo(() => {
    return configuration?.default_points
      ? String(configuration.default_points)
      : "0";
  }, [configuration]);

  const formDefaultPoints = useMemo(() => {
    return defaultPoints || currentDefaultPoints;
  }, [defaultPoints, currentDefaultPoints]);

  const handleDefaultPointsChange = (value: string) => {
    setDefaultPoints(value);
  };

  const handleReset = () => {
    setDefaultPoints("");
    setMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    try {
      await updatePointsConfiguration({
        default_points: formDefaultPoints,
      }).unwrap();

      setMessage("Points configuration updated successfully.");
      setDefaultPoints("");
    } catch {
      setMessage("Failed to update points configuration.");
    }
  };

  return {
    configuration,
    defaultPoints: formDefaultPoints,
    message,

    isLoading,
    isError,
    isUpdating,

    refetch,
    handleDefaultPointsChange,
    handleReset,
    handleSubmit,
  };
};