"use client";

import { useCustomerTable } from "@/components/Customers/CustomerTable";
import CustomerStyleTable from "@/components/common/CustomerStyleTable";
import {
  TableActionButton,
  TableActionLink,
} from "@/components/common/TableActionButton";
import type { Customer } from "@/types/customer";

const CustomerPageContent = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,

    customers,
    meta,
    form,
    setForm,
    message,
    isFormOpen,
    editingCustomer,

    isLoading,
    isError,
    isUpdating,
    isDeleting,

    refetch,
    handleSearch,
    handleReset,
    openEditForm,
    closeForm,
    handleFormSubmit,
    handleDelete,
  } = useCustomerTable();

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        Loading customers...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="mb-3 text-red">Failed to load customers.</p>

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
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke px-6 py-4 dark:border-dark-3">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white">
              Customer List
            </h2>

            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              Customers are registered from the mobile app.
            </p>
          </div>
        </div>

        <div className="p-6">
          {message && (
            <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
              {message}
            </div>
          )}

          <form
  onSubmit={handleSearch}
  className="mb-5 grid items-end gap-4"
  style={{
    gridTemplateColumns: "240px 240px 240px 100px 100px",
  }}
>
  <div>
    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
      Name
    </label>

    <input
      value={name}
      onChange={(event) => setName(event.target.value)}
      placeholder="Search name..."
      className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
    />
  </div>

  <div>
    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
      Email
    </label>

    <input
      value={email}
      onChange={(event) => setEmail(event.target.value)}
      placeholder="Search email..."
      className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
    />
  </div>

  <div>
    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
      Phone
    </label>

    <input
      value={phoneNumber}
      onChange={(event) => setPhoneNumber(event.target.value)}
      placeholder="Search phone..."
      className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
    />
  </div>

  <button
    type="submit"
    className="w-[100px] rounded-lg bg-primary px-5 py-3 font-medium text-white"
  >
    Search
  </button>

  <button
    type="button"
    onClick={handleReset}
    className="w-[100px] rounded-lg border border-stroke px-5 py-3 font-medium text-dark dark:border-dark-3 dark:text-white"
  >
    Reset
  </button>
</form>

          <div className="mb-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Total Customers: {meta?.total || 0}
            </span>
          </div>
        </div>

        <CustomerStyleTable minWidth="900px">
          <thead>
            <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
              <th className="px-6 py-4 font-medium text-dark dark:text-white">
                BIL
              </th>

              <th className="px-6 py-4 font-medium text-dark dark:text-white">
                NAME
              </th>

              <th className="px-6 py-4 font-medium text-dark dark:text-white">
                EMAIL
              </th>

              <th className="px-6 py-4 font-medium text-dark dark:text-white">
                PHONE
              </th>

              <th className="px-6 py-4 font-medium text-dark dark:text-white">
                STATUS
              </th>

              <th className="px-6 py-4 font-medium text-dark dark:text-white">
                ACTION
              </th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer: Customer, index: number) => (
              <tr
                key={customer.id}
                className="border-b border-stroke last:border-b-0 dark:border-dark-3"
              >
                <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
                  {index + 1}
                </td>

                <td className="px-6 py-4 font-medium text-dark dark:text-white">
                  {customer.full_name || "-"}
                </td>

                <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
                  {customer.email || "-"}
                </td>

                <td className="px-6 py-4 text-sm text-dark-5 dark:text-dark-6">
                  {customer.phone_number || "-"}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      customer.active
                        ? "bg-primary/10 text-primary"
                        : "bg-red-light-6 text-red"
                    }`}
                  >
                    {customer.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <TableActionLink href={`/customers/${customer.id}`}>
                      View
                    </TableActionLink>

                    <TableActionButton onClick={() => openEditForm(customer)}>
                      Edit
                    </TableActionButton>

                    <TableActionButton
                      variant="danger"
                      disabled={isDeleting}
                      onClick={() => handleDelete(customer)}
                    >
                      Delete
                    </TableActionButton>
                  </div>
                </td>
              </tr>
            ))}

            {customers.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-sm text-dark-5 dark:text-dark-6"
                >
                  No Customers Found
                </td>
              </tr>
            )}
          </tbody>
        </CustomerStyleTable>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-dark dark:text-white">
                Edit Customer
              </h3>

              <button
                type="button"
                onClick={closeForm}
                className="text-lg font-bold text-dark dark:text-white"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="grid gap-4 md:grid-cols-2"
            >
              <CustomerInput
                label="First Name"
                value={form.first_name}
                required
                onChange={(value) => setForm({ ...form, first_name: value })}
              />

              <CustomerInput
                label="Last Name"
                value={form.last_name}
                onChange={(value) => setForm({ ...form, last_name: value })}
              />

              <CustomerInput
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => setForm({ ...form, email: value })}
              />

              <CustomerInput
                label="Phone Number"
                value={form.phone_number}
                onChange={(value) =>
                  setForm({ ...form, phone_number: value })
                }
              />

              <CustomerInput
                label="Date of Birth"
                type="date"
                value={form.dob}
                onChange={(value) => setForm({ ...form, dob: value })}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Gender
                </label>

                <select
                  value={form.gender}
                  onChange={(event) =>
                    setForm({ ...form, gender: event.target.value })
                  }
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Status
                </label>

                <select
                  value={form.active ? "true" : "false"}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      active: event.target.value === "true",
                    })
                  }
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-stroke px-5 py-3 font-medium text-dark dark:border-dark-3 dark:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-lg bg-primary px-5 py-3 font-medium text-white disabled:opacity-60"
                >
                  {isUpdating ? "Saving..." : "Save Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

type CustomerInputProps = {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

const CustomerInput = ({
  label,
  value,
  type = "text",
  required = false,
  onChange,
}: CustomerInputProps) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
      />
    </div>
  );
};

export default CustomerPageContent;