"use client";

import { useWhatsappPanel } from "@/components/Whatsapp/WhatsappPanel";
import type { WhatsappRecipient } from "@/types/whatsapp";

const WhatsappPageContent = () => {
  const {
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
  } = useWhatsappPanel();

  return (
    <>
      {message && (
        <div className="mb-4 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          {message}
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-5">
        <WhatsappCountCard title="All" value={counts.all} />
        <WhatsappCountCard title="Sent" value={counts.sent} />
        <WhatsappCountCard title="Queue" value={counts.queue} />
        <WhatsappCountCard title="Unsent" value={counts.unsent} />
        <WhatsappCountCard title="Expired" value={counts.expired} />
      </div>

      <div className="mb-6 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <h2 className="text-xl font-semibold text-dark dark:text-white">
          Whatsapp Blasting
        </h2>

        <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
          Send Whatsapp messages to selected recipients based on the MULA recipient list.
        </p>
      </div>

      <div className="mb-6 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Send Message
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Phone Numbers
            </label>

            <textarea
              value={phoneNumbers}
              onChange={(event) => setPhoneNumbers(event.target.value)}
              rows={6}
              placeholder="One phone number per line"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Message Body
            </label>

            <textarea
              value={messageBody}
              onChange={(event) => setMessageBody(event.target.value)}
              rows={6}
              placeholder="Enter Whatsapp message"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Image URL
            </label>

            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="Optional image URL"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            className="rounded-lg bg-primary px-5 py-3 font-medium text-white disabled:opacity-60"
          >
            {isSending ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Search Recipients
        </h3>

        <div className="grid gap-3 md:grid-cols-3">
          <input
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            placeholder="Search name"
            className="rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
          />

          <input
            value={phoneInput}
            onChange={(event) => setPhoneInput(event.target.value)}
            placeholder="Search phone"
            className="rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
          />

          <input
            value={pdmInput}
            onChange={(event) => setPdmInput(event.target.value)}
            placeholder="Search PDM"
            className="rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
          />
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={handleSearch}
            className="rounded-lg bg-primary px-5 py-3 font-medium text-white"
          >
            Search
          </button>

          <button
            type="button"
            onClick={handleClearSearch}
            className="rounded-lg border border-stroke px-5 py-3 font-medium text-dark dark:border-dark-3 dark:text-white"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        {isLoading ? (
          <div className="p-6">Loading recipients...</div>
        ) : isError ? (
          <div className="p-6">
            <p className="mb-3 text-red">Failed to load Whatsapp recipients.</p>

            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] table-auto">
                <thead>
                  <tr className="border-b border-stroke text-left dark:border-dark-3">
                    <th className="px-6 py-4 text-sm font-semibold text-dark dark:text-white">
                      No
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-dark dark:text-white">
                      Name
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-dark dark:text-white">
                      IC Number
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-dark dark:text-white">
                      Age
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-dark dark:text-white">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-dark dark:text-white">
                      PDM
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-dark dark:text-white">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recipients.map((recipient: WhatsappRecipient, index: number) => (
                    <tr
                      key={recipient.id}
                      className="border-b border-stroke dark:border-dark-3"
                    >
                      <td className="px-6 py-4 text-sm">
                        {(page - 1) * 20 + index + 1}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-dark dark:text-white">
                        {recipient.name || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {recipient.ic_number || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {recipient.age || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {recipient.phone_number || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {recipient.pdm || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <button
                          type="button"
                          onClick={() => addRecipientPhone(recipient.phone_number)}
                          className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white"
                        >
                          Add Phone
                        </button>
                      </td>
                    </tr>
                  ))}

                  {recipients.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-sm text-dark-5"
                      >
                        No recipients found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {meta && (
              <div className="flex items-center justify-between px-6 py-4">
                <p className="text-sm text-dark-5">
                  Page {meta.page} of {meta.total_pages || 1}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="rounded-lg border border-stroke px-4 py-2 text-sm disabled:opacity-50 dark:border-dark-3"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={page >= (meta.total_pages || 1)}
                    onClick={() => setPage(page + 1)}
                    className="rounded-lg border border-stroke px-4 py-2 text-sm disabled:opacity-50 dark:border-dark-3"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

type WhatsappCountCardProps = {
  title: string;
  value: string | number;
};

const WhatsappCountCard = ({ title, value }: WhatsappCountCardProps) => {
  return (
    <div className="rounded-[10px] bg-white p-5 text-center shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h3 className="text-2xl font-bold text-dark dark:text-white">{value}</h3>
      <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">{title}</p>
    </div>
  );
};

export default WhatsappPageContent;