"use client";

import {
  useGetWhatsappQuery,
  useSendWhatsappMessagesMutation,
} from "@/app/api/rtk/whatsappApi";
import { useMemo, useState } from "react";

export const useWhatsappPanel = () => {
  const [page, setPage] = useState(1);

  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [pdmInput, setPdmInput] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pdm, setPdm] = useState("");

  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [message, setMessage] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("domain_name", process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME || "MULA");
    params.set("page", String(page));
    params.set("per_page", "20");

    if (name) params.set("name", name);
    if (phone) params.set("phone", phone);
    if (pdm) params.set("pdm", pdm);

    return `?${params.toString()}`;
  }, [page, name, phone, pdm]);

  const { data, isLoading, isError, refetch } =
    useGetWhatsappQuery(queryString);

  const [sendWhatsappMessages, { isLoading: isSending }] =
    useSendWhatsappMessagesMutation();

  const recipients = useMemo(() => data?.data.recipients || [], [data]);
  const counts = useMemo(
    () =>
      data?.data.total_update_counts || {
        all: 0,
        sent: 0,
        queue: 0,
        unsent: 0,
        expired: 0,
      },
    [data],
  );
  const meta = useMemo(() => data?.meta, [data]);

  const handleSearch = () => {
    setPage(1);
    setName(nameInput);
    setPhone(phoneInput);
    setPdm(pdmInput);
  };

  const handleClearSearch = () => {
    setPage(1);
    setNameInput("");
    setPhoneInput("");
    setPdmInput("");
    setName("");
    setPhone("");
    setPdm("");
  };

  const addRecipientPhone = (phoneNumber: string | null) => {
    if (!phoneNumber) return;

    setPhoneNumbers((currentValue) => {
      if (!currentValue) return phoneNumber;
      return `${currentValue}\n${phoneNumber}`;
    });
  };

  const handleSend = async () => {
    setMessage("");

    try {
      const response = await sendWhatsappMessages({
        phone_numbers: phoneNumbers,
        message_body: messageBody,
        image_url: imageUrl,
      }).unwrap();

      setMessage(response.message || "Whatsapp messages queued successfully.");
      setPhoneNumbers("");
      setMessageBody("");
      setImageUrl("");
    } catch (error: any) {
      console.log("WHATSAPP SEND ERROR:", error);

      setMessage(
        error?.data?.message ||
          error?.error ||
          "Failed to send Whatsapp messages.",
      );
    }
  };

  return {
    recipients,
    counts,
    meta,
    page,

    nameInput,
    phoneInput,
    pdmInput,
    phoneNumbers,
    messageBody,
    imageUrl,
    message,

    isLoading,
    isError,
    isSending,

    setPage,
    setNameInput,
    setPhoneInput,
    setPdmInput,
    setPhoneNumbers,
    setMessageBody,
    setImageUrl,

    refetch,
    handleSearch,
    handleClearSearch,
    addRecipientPhone,
    handleSend,
  };
};