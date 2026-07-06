"use client";

import { useGetWhatsappDashboardQuery } from "@/app/api/rtk/whatsappApi";
import type { WhatsappRecipient } from "@/types/whatsapp";
import { useMemo, useState } from "react";

export default function WhatsappDashboard() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pdm, setPdm] = useState("");

  const [messageBody, setMessageBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [selectedRecipients, setSelectedRecipients] = useState<
    WhatsappRecipient[]
  >([]);

  const [search, setSearch] = useState({
    name: "",
    phone: "",
    pdm: "",
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("page", "1");
    params.set("per_page", "20");

    if (search.name) {
      params.set("name", search.name);
    }

    if (search.phone) {
      params.set("phone", search.phone);
    }

    if (search.pdm) {
      params.set("pdm", search.pdm);
    }

    return `?${params.toString()}`;
  }, [search]);

  const { data, isLoading, isError, refetch } =
    useGetWhatsappDashboardQuery(queryString);

  const totalCounts = useMemo(() => {
  return data?.data?.total_update_counts;
  }, [data]);

  const recentCounts = useMemo(() => {
  return data?.data?.recent_update_counts;
  }, [data]);

  const recipients = useMemo(() => {
  return data?.data?.recipients || [];
  }, [data]);

  const meta = useMemo(() => {
  return data?.meta;
  }, [data]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSearch({
      name,
      phone,
      pdm,
    });
  }

  function handleReset() {
    setName("");
    setPhone("");
    setPdm("");

    setSearch({
      name: "",
      phone: "",
      pdm: "",
    });
  }

  function isSelected(recipientId: number) {
    return selectedRecipients.some((recipient) => recipient.id === recipientId);
  }

  function toggleRecipient(recipient: WhatsappRecipient) {
    if (isSelected(recipient.id)) {
      setSelectedRecipients((current) =>
        current.filter((item) => item.id !== recipient.id),
      );

      return;
    }

    setSelectedRecipients((current) => [...current, recipient]);
  }

  function selectAllRecipients() {
    setSelectedRecipients(recipients);
  }

  function clearSelectedRecipients() {
    setSelectedRecipients([]);
  }

  function formatNumber(value: number | null | undefined) {
    return Number(value || 0).toLocaleString();
  }

  const previewMessage =
    selectedRecipients.length > 0
      ? messageBody.replace(
          "{name}",
          selectedRecipients[0]?.name || "there",
        )
      : messageBody;

  if (isLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        Loading Whatsapp dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="mb-3 text-red">Failed to load Whatsapp dashboard.</p>

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
          Whatsapp MULA
        </h2>

        <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
          Whatsapp dashboard and recipient selection migrated from the old Ruby
          on Rails website using RTK Query.
        </p>
      </div>

      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Total Update
        </h3>

        <div className="grid gap-4 md:grid-cols-5">
          <StatusCard title="All" value={totalCounts?.all} />
          <StatusCard title="Sent" value={totalCounts?.sent} />
          <StatusCard title="Queue" value={totalCounts?.queue} />
          <StatusCard title="Unsent" value={totalCounts?.unsent} />
          <StatusCard title="Expired" value={totalCounts?.expired} />
        </div>
      </div>

      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Recent Update
        </h3>

        <div className="grid gap-4 md:grid-cols-5">
          <StatusCard title="All" value={recentCounts?.all} />
          <StatusCard title="Sent" value={recentCounts?.sent} />
          <StatusCard title="Queue" value={recentCounts?.queue} />
          <StatusCard title="Unsent" value={recentCounts?.unsent} />
          <StatusCard title="Expired" value={recentCounts?.expired} />
        </div>
      </div>

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke px-6 py-4 dark:border-dark-3">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Senarai Pilihan Individu
          </h3>

          <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
            Select recipients and prepare message draft. Real sending is not
            enabled yet.
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSearch} className="mb-5 grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Name
              </label>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Cari Name..."
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Phone
              </label>

              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Cari Phone..."
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                PDM
              </label>

              <input
                value={pdm}
                onChange={(event) => setPdm(event.target.value)}
                placeholder="Cari PDM..."
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
              />
            </div>

            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="rounded-lg bg-primary px-5 py-3 font-medium text-white"
              >
                Cari
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

          <div className="mb-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Total Recipients: {formatNumber(meta?.total)}
            </span>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Selected: {selectedRecipients.length}
            </span>

            <button
              type="button"
              onClick={selectAllRecipients}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Pilih Semua
            </button>

            <button
              type="button"
              onClick={clearSelectedRecipients}
              className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark dark:border-dark-3 dark:text-white"
            >
              Reset Selection
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
                  <th className="px-6 py-4 font-medium text-dark dark:text-white">
                    SELECT
                  </th>

                  <th className="px-6 py-4 font-medium text-dark dark:text-white">
                    NAME
                  </th>

                  <th className="px-6 py-4 font-medium text-dark dark:text-white">
                    I/C NUMBER
                  </th>

                  <th className="px-6 py-4 font-medium text-dark dark:text-white">
                    BIRTHDAY
                  </th>

                  <th className="px-6 py-4 font-medium text-dark dark:text-white">
                    AGE
                  </th>

                  <th className="px-6 py-4 font-medium text-dark dark:text-white">
                    MOBILE NUMBER
                  </th>

                  <th className="px-6 py-4 font-medium text-dark dark:text-white">
                    PDM
                  </th>
                </tr>
              </thead>

              <tbody>
                {recipients.map((recipient) => (
                  <tr
                    key={recipient.id}
                    className="border-b border-stroke last:border-b-0 dark:border-dark-3"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected(recipient.id)}
                        onChange={() => toggleRecipient(recipient)}
                      />
                    </td>

                    <td className="px-6 py-4 font-medium text-dark dark:text-white">
                      {recipient.name || "-"}
                    </td>

                    <td className="px-6 py-4">{recipient.ic_number || "-"}</td>

                    <td className="px-6 py-4">{recipient.birthday || "-"}</td>

                    <td className="px-6 py-4">{recipient.age || "-"}</td>

                    <td className="px-6 py-4">
                      {recipient.phone_number || "-"}
                    </td>

                    <td className="px-6 py-4">{recipient.pdm || "-"}</td>
                  </tr>
                ))}

                {recipients.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-dark-5 dark:text-dark-6"
                    >
                      No Data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Message Draft
        </h3>

        <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          Use {"{name}"} to automatically replace recipient name in the message.
        </div>

        <div className="grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Message
            </label>

            <textarea
              value={messageBody}
              onChange={(event) => setMessageBody(event.target.value)}
              rows={4}
              placeholder="Hi, {name}..."
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Image URL Optional
            </label>

            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
            />
          </div>

          <div className="rounded-lg border border-stroke p-4 dark:border-dark-3">
            <p className="mb-2 text-sm font-medium text-dark dark:text-white">
              Preview
            </p>

            <p className="whitespace-pre-wrap text-sm text-dark-5 dark:text-dark-6">
              {previewMessage || "No message yet."}
            </p>

            {imageUrl && (
              <p className="mt-3 text-sm text-dark-5 dark:text-dark-6">
                Image URL: {imageUrl}
              </p>
            )}
          </div>

          <button
            type="button"
            disabled
            className="w-fit rounded-lg bg-gray-6 px-5 py-3 font-medium text-white opacity-70"
          >
            Send Whatsapp Message Disabled
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusCard({
  title,
  value,
}: {
  title: string;
  value: number | null | undefined;
}) {
  return (
    <div className="rounded-[10px] border border-stroke p-4 dark:border-dark-3">
      <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
        {title}
      </p>

      <h3 className="mt-2 text-2xl font-bold text-dark dark:text-white">
        {Number(value || 0).toLocaleString()}
      </h3>
    </div>
  );
}