"use client";

import { useEffect, useMemo, useState } from "react";

type StoredUser = {
  id?: number;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  loyalty_client_id?: number | null;
  client_name?: string | null;
  client_domain_name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export default function AdminProfileCard() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("mula_auth_user");

    if (!storedUser) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setUser(JSON.parse(storedUser) as StoredUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fullName = useMemo(() => {
    if (user?.full_name) {
      return user.full_name;
    }

    if (user?.name) {
      return user.name;
    }

    const generatedName = [user?.first_name, user?.last_name]
      .filter(Boolean)
      .join(" ");

    return generatedName || "Admin User";
  }, [user]);

  const initials = useMemo(() => {
    const nameParts = fullName.trim().split(" ").filter(Boolean);

    if (!nameParts.length) {
      return "AD";
    }

    const firstInitial = nameParts[0]?.[0] || "";
    const secondInitial = nameParts[1]?.[0] || "";

    return `${firstInitial}${secondInitial}`.toUpperCase() || "AD";
  }, [fullName]);

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="mb-3 text-red">No logged-in user found.</p>

        <p className="text-sm text-dark-5 dark:text-dark-6">
          Please log in again to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="px-6 pt-8 pb-8 text-center">
          <div className="inline-flex h-32 w-32 items-center justify-center rounded-full border border-stroke bg-primary/10 text-4xl font-bold text-primary shadow-card dark:border-dark-3">
            {initials}
          </div>

          <h2 className="mt-4 text-2xl font-bold text-dark dark:text-white">
            {fullName}
          </h2>

          <p className="mt-1 text-sm font-medium text-primary">
            {user.role || "Admin"}
          </p>

          <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
            {user.client_name || "MULA Coffee"} Admin Centre
          </p>

          <div className="mt-6 flex justify-center">
            <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              {user.role || "Admin"}
            </span>
          </div>
        </div>

        <div className="border-t border-stroke px-6 py-6 dark:border-dark-3">
          <h3 className="mb-5 text-lg font-semibold text-dark dark:text-white">
            Personal Information
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoItem label="First Name" value={user.first_name} />
            <InfoItem label="Last Name" value={user.last_name} />
            <InfoItem label="Full Name" value={fullName} />
            <InfoItem label="Email Address" value={user.email} />
            <InfoItem label="Role" value={user.role || "Admin"} />
            <InfoItem label="User ID" value={user.id} />
          </div>
        </div>

        <div className="border-t border-stroke px-6 py-6 dark:border-dark-3">
          <h3 className="mb-5 text-lg font-semibold text-dark dark:text-white">
            Client Information
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoItem label="Client Name" value={user.client_name} />
            <InfoItem label="Domain Name" value={user.client_domain_name} />
            <InfoItem label="Client ID" value={user.loyalty_client_id} />
            <InfoItem label="Client Status" value="Active" />
          </div>
        </div>

        <div className="border-t border-stroke px-6 py-6 dark:border-dark-3">
          <h3 className="mb-5 text-lg font-semibold text-dark dark:text-white">
            Account Timeline
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
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