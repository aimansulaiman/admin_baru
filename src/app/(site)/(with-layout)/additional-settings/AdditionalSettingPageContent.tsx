"use client";

import { useAdditionalSettingForm } from "@/components/AdditionalSettings/AdditionalSettingForm";

const AdditionalSettingPageContent = () => {
  const {
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
  } = useAdditionalSettingForm();

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
    <>
      {message && (
        <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          {message}
        </div>
      )}

      <div className="mb-6 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <h2 className="text-xl font-semibold text-dark dark:text-white">
          Additional Settings
        </h2>

        <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
          Manage extra MULA loyalty client configuration.
        </p>
      </div>

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke px-6 py-4 dark:border-dark-3">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Client Settings
          </h3>

          <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
            Domain: {setting?.domain_name || "-"}
          </p>
        </div>

        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <SettingInput
              label="Client Name"
              value={form.name}
              onChange={(value) => handleChange("name", value)}
            />

            <SettingInput
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => handleChange("email", value)}
            />

            <SettingInput
              label="Phone Number"
              value={form.phone_number}
              onChange={(value) => handleChange("phone_number", value)}
            />

            <SettingInput
              label="Website"
              value={form.website}
              onChange={(value) => handleChange("website", value)}
            />

            <SettingInput
              label="Default Points"
              type="number"
              value={form.default_points}
              onChange={(value) => handleChange("default_points", value)}
            />

            <SettingInput
              label="Minimum Points"
              type="number"
              value={form.minimum_points}
              onChange={(value) => handleChange("minimum_points", value)}
            />

            <SettingInput
              label="Maximum Points"
              type="number"
              value={form.maximum_points}
              onChange={(value) => handleChange("maximum_points", value)}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Status
              </label>

              <select
                value={form.active ? "true" : "false"}
                onChange={(event) =>
                  handleChange("active", event.target.value === "true")
                }
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Address
              </label>

              <textarea
                value={form.address}
                onChange={(event) =>
                  handleChange("address", event.target.value)
                }
                rows={4}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isUpdating}
              className="rounded-lg bg-primary px-5 py-3 font-medium text-white disabled:opacity-60"
            >
              {isUpdating ? "Saving..." : "Save Settings"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-stroke px-5 py-3 font-medium text-dark dark:border-dark-3 dark:text-white"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

type SettingInputProps = {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
};

const SettingInput = ({
  label,
  value,
  type = "text",
  onChange,
}: SettingInputProps) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
      />
    </div>
  );
};

export default AdditionalSettingPageContent;