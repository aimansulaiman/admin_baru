"use client";

import { useGetUserQuery } from "@/app/api/rtk/userApi";
import Link from "next/link";

export default function UserProfile({ id }: { id: number }) {
  const { data: user, isLoading, isError, refetch } = useGetUserQuery(id);

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        Loading user detail...
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="mb-3 text-red">Failed to load selected user.</p>

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

  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "US";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="px-6 pt-10 pb-8 text-center">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-stroke bg-primary/10 text-4xl font-bold text-primary shadow-sm dark:border-dark-3 dark:bg-dark-2">
            {initials}
          </div>

          <h2 className="mt-5 text-2xl font-bold text-dark dark:text-white">
            {user.full_name || "User"}
          </h2>

          <p className="mt-1 text-sm font-medium text-primary">
            {user.email || "-"}
          </p>

          <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
            {user.client_name || "MULA Coffee"}
          </p>

          <Link
            href="/users"
            className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 font-medium text-white"
          >
            Back to Users
          </Link>
        </div>

        <div className="border-t border-stroke px-6 py-6 dark:border-dark-3">
          <h3 className="mb-5 text-lg font-semibold text-dark dark:text-white">
            Selected User Information
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoItem label="User ID" value={user.id} />
            <InfoItem label="First Name" value={user.first_name} />
            <InfoItem label="Last Name" value={user.last_name} />
            <InfoItem label="Full Name" value={user.full_name} />
            <InfoItem label="Email" value={user.email} />
            <InfoItem label="Client Name" value={user.client_name} />
            <InfoItem label="Client Domain" value={user.client_domain_name} />
            <InfoItem label="Loyalty Client ID" value={user.loyalty_client_id} />
            <InfoItem label="Created At" value={formatDate(user.created_at)} />
            <InfoItem label="Updated At" value={formatDate(user.updated_at)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-lg border border-stroke bg-gray-2 px-5 py-4 dark:border-dark-3 dark:bg-dark-2">
      <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
        {label}
      </p>

      <p className="mt-2 break-words font-semibold text-dark dark:text-white">
        {value || "-"}
      </p>
    </div>
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString();
}