"use client";

import {
  useDeleteCustomerMutation,
  useGetCustomersQuery,
  useUpdateCustomerMutation,
} from "@/app/api/rtk/customerApi";
import type { Customer } from "@/types/customer";
import { useMemo, useState } from "react";

type CustomerFormState = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  dob: string;
  gender: string;
  active: boolean;
};

const emptyForm: CustomerFormState = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  dob: "",
  gender: "",
  active: true,
};

export const useCustomerTable = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [search, setSearch] = useState({
    name: "",
    email: "",
    phone_number: "",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState<CustomerFormState>(emptyForm);
  const [message, setMessage] = useState("");

  const domainName = process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME || "MULA";

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("domain_name", domainName);
    params.set("page", "1");
    params.set("per_page", "20");

    if (search.name) {
      params.set("name", search.name);
    }

    if (search.email) {
      params.set("email", search.email);
    }

    if (search.phone_number) {
      params.set("phone_number", search.phone_number);
    }

    return `?${params.toString()}`;
  }, [domainName, search]);

  const { data, isLoading, isError, refetch } =
    useGetCustomersQuery(queryString);

  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();

  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();

  const customers = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const meta = useMemo(() => {
    return data?.meta;
  }, [data]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSearch({
      name,
      email,
      phone_number: phoneNumber,
    });
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhoneNumber("");

    setSearch({
      name: "",
      email: "",
      phone_number: "",
    });
  };

  const openEditForm = (customer: Customer) => {
    setEditingCustomer(customer);

    setForm({
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      email: customer.email || "",
      phone_number: customer.phone_number || "",
      dob: customer.dob || "",
      gender: customer.gender || "",
      active: customer.active ?? true,
    });

    setMessage("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCustomer(null);
    setForm(emptyForm);
  };

  const handleFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setMessage("");

    if (!editingCustomer) {
      setMessage("Customer can only be registered from the app.");
      return;
    }

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone_number: form.phone_number,
      dob: form.dob,
      gender: form.gender,
      active: form.active,
    };

    try {
      await updateCustomer({
        id: editingCustomer.id,
        data: payload,
      }).unwrap();

      setMessage("Customer updated successfully.");

      closeForm();
      refetch();
    } catch (error: any) {
      console.log("CUSTOMER UPDATE ERROR:", error);

      setMessage(
        error?.data?.message ||
          error?.error ||
          "Failed to update customer. Please check required fields.",
      );
    }
  };

  const handleDelete = async (customer: Customer) => {
    const confirmDelete = window.confirm(
      `Delete customer ${customer.full_name || customer.email}?`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteCustomer(customer.id).unwrap();

      setMessage("Customer deleted successfully.");
      refetch();
    } catch (error: any) {
      console.log("CUSTOMER DELETE ERROR:", error);

      setMessage(
        error?.data?.message || error?.error || "Failed to delete customer.",
      );
    }
  };

  return {
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
  };
};