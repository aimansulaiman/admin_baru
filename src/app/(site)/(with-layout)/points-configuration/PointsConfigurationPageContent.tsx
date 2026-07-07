"use client";

import { usePointsConfigurationForm } from "@/components/PointsConfiguration/PointsConfigurationForm";

const PointsConfigurationPageContent = () => {
  const {
    configuration,
    defaultPoints,
    message,

    isLoading,
    isError,
    isUpdating,

    refetch,
    handleDefaultPointsChange,
    handleReset,
    handleSubmit,
  } = usePointsConfigurationForm();

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        Loading points configuration...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="mb-3 text-red">Failed to load points configuration.</p>

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
    <>
      {message && (
        <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          {message}
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <PointsCard
          title="Default Points"
          value={configuration?.default_points || 0}
        />

        <PointsCard
          title="Total Customers"
          value={configuration?.total_customers || 0}
        />

        <PointsCard
          title="Total Points Distributed"
          value={configuration?.total_points_distributed || 0}
        />
      </div>

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke px-6 py-4 dark:border-dark-3">
          <h2 className="text-xl font-semibold text-dark dark:text-white">
            Points Configuration
          </h2>

          <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
            Configure the default points used by MULA loyalty system.
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="max-w-xl">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Default Points
              </label>

              <input
                type="number"
                min="0"
                value={defaultPoints}
                onChange={(event) =>
                  handleDefaultPointsChange(event.target.value)
                }
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
              />

              <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
                This value is saved inside the loyalty client configuration.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={isUpdating}
                className="rounded-lg bg-primary px-5 py-3 font-medium text-white disabled:opacity-60"
              >
                {isUpdating ? "Saving..." : "Save Configuration"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-stroke px-5 py-3 font-medium text-dark dark:border-dark-3 dark:text-white"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

type PointsCardProps = {
  title: string;
  value: string | number;
};

const PointsCard = ({ title, value }: PointsCardProps) => {
  return (
    <div className="rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
        {title}
      </p>

      <h3 className="mt-2 text-2xl font-bold text-dark dark:text-white">
        {value}
      </h3>
    </div>
  );
};

export default PointsConfigurationPageContent;