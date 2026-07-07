"use client";

import { useGetUsersQuery } from "@/app/api/rtk/userApi";
import { useMemo, useState } from "react";

export const useUserTable = () => {
  const [page, setPage] = useState(1);

  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("per_page", "20");

    if (name) {
      params.set("name", name);
    }

    if (email) {
      params.set("email", email);
    }

    return `?${params.toString()}`;
  }, [page, name, email]);

  const { data, isLoading, isFetching, refetch } = useGetUsersQuery(queryString);

  const users = data?.data || [];
  const meta = data?.meta;

  const handleFilter = () => {
    setPage(1);
    setName(nameInput);
    setEmail(emailInput);
  };

  const handleClear = () => {
    setPage(1);
    setNameInput("");
    setEmailInput("");
    setName("");
    setEmail("");
    refetch();
  };

  return {
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
  };
};