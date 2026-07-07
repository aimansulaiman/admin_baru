"use client";

import { useGetAdditionalSettingQuery } from "@/app/api/rtk/additionalSettingsApi";
import { useMemo } from "react";

export default function AdditionalSettingsPanel() {
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

const response: any = data;
const settings = response?.data?.settings || [];
const client = response?.data?.client;

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        Loading additional settings...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="mb-3 text-red">Failed to load additional settings.</p>

        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <h2 className="text-xl font-semibold text-dark dark:text-white">
          Additional Settings MULA
        </h2>

        <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
          Advanced configuration options loaded from the old Ruby on Rails
          website using RTK Query.
        </p>

        <div className="mt-4 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          Client: {client?.name || "-"} ({client?.domain_name || "-"})
        </div>
      </div>

      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
          <h3 className="font-semibold text-primary">Coming Soon</h3>

          <p className="mt-1 text-sm text-dark dark:text-white">
            Additional application configuration options will be available here.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {settings.map((setting: any) => (
            <div
              key={setting.key}
              className="rounded-lg border border-stroke p-5 dark:border-dark-3"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h4 className="font-semibold text-dark dark:text-white">
                  {setting.title}
                </h4>

                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {setting.status}
                </span>
              </div>

              <p className="text-sm text-dark-5 dark:text-dark-6">
                {setting.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}