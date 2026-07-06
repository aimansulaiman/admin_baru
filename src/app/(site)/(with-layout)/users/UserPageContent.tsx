"use client";

import { useUserTable } from "@/components/Users/UserTable";
import type { User } from "@/types/user";
import CustomerStyleTable from "@/components/common/CustomerStyleTable";
import {
  TableActionButton,
  TableActionLink,
} from "@/components/common/TableActionButton";

const formatDate = (value: string | null) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString();
};

const formatDateTime = (value: string | null) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
};

const UserPageContent = () => {
  const {
    page,
    setPage,

    nameInput,
    setNameInput,

    emailInput,
    setEmailInput,

    users,
    meta,

    isLoading,
    isFetching,

    handleFilter,
    handleClear,
  } = useUserTable();

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark dark:text-white">
            Rekod User
          </h1>

          <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
            View registered users and their basic account history.
          </p>
        </div>

        <div className="text-sm font-medium text-dark-5 dark:text-dark-6">
          Dashboard /{" "}
          <span className="font-semibold text-primary">Rekod User</span>
        </div>
      </section>

      <section className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="Search user name..."
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
            />

            <input
              type="text"
              value={emailInput}
              onChange={(event) => setEmailInput(event.target.value)}
              placeholder="Search email..."
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
            />
          </div>

          <div className="flex gap-3 xl:shrink-0">
            <button
              type="button"
              onClick={handleFilter}
              className="min-w-[90px] rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-opacity-90"
            >
              Filter
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="min-w-[90px] rounded-lg border border-stroke px-5 py-3 text-sm font-semibold text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stroke px-6 py-5 dark:border-dark-3">
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">
              User Records
            </h2>

            <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
              New user registration is handled from the login page.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <CustomerStyleTable minWidth="1000px">
  <thead>
    <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        ID
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        NAME
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        EMAIL
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        CLIENT
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        CREATED DATE
      </th>

      <th className="px-6 py-4 font-medium text-dark dark:text-white">
        LAST UPDATED
      </th>
    </tr>
  </thead>

  <tbody>
    {isLoading || isFetching ? (
      <tr>
        <td
          colSpan={6}
          className="px-6 py-8 text-center text-sm text-dark-5 dark:text-dark-6"
        >
          Loading users...
        </td>
      </tr>
    ) : users.length === 0 ? (
      <tr>
        <td
          colSpan={6}
          className="px-6 py-8 text-center text-sm text-dark-5 dark:text-dark-6"
        >
          No users found.
        </td>
      </tr>
    ) : (
      users.map((user: User) => (
        <tr
          key={user.id}
          className="border-b border-stroke last:border-b-0 dark:border-dark-3"
        >
          <td className="px-6 py-4 text-sm text-dark dark:text-white">
            #{user.id}
          </td>

          <td className="px-6 py-4 text-sm text-dark dark:text-white">
            <div>
              <p className="font-semibold">{user.full_name || "-"}</p>

              <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
                First name: {user.first_name || "-"} | Last name:{" "}
                {user.last_name || "-"}
              </p>
            </div>
          </td>

          <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
            {user.email || "-"}
          </td>

          <td className="px-6 py-4 text-sm text-dark dark:text-white">
            <div>
              <p>{user.client_name || "MULA"}</p>

              <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
                {user.client_domain_name || "-"}
              </p>
            </div>
          </td>

          <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
            {formatDate(user.created_at)}
          </td>

          <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
            {formatDateTime(user.updated_at)}
          </td>
        </tr>
      ))
    )}
  </tbody>
</CustomerStyleTable>
        </div>

        {meta && meta.total_pages > 1 && (
          <div className="flex items-center justify-between border-t border-stroke px-6 py-5 dark:border-dark-3">
            <p className="text-sm text-dark-5 dark:text-dark-6">
              Page {meta.page} of {meta.total_pages}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="rounded-lg border border-stroke px-4 py-2 text-sm font-semibold text-dark disabled:opacity-50 dark:border-dark-3 dark:text-white"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={page >= meta.total_pages}
                onClick={() => setPage(page + 1)}
                className="rounded-lg border border-stroke px-4 py-2 text-sm font-semibold text-dark disabled:opacity-50 dark:border-dark-3 dark:text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserPageContent;