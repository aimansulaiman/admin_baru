"use client";

import { useTaxonTable } from "@/components/Taxons/TaxonTable";
import type { SubTaxon, Taxon } from "@/types/taxon";
import { TableActionButton } from "@/components/common/TableActionButton";

const TaxonPageContent = () => {
  const {
    taxonName,
    setTaxonName,
    subTaxonName,
    setSubTaxonName,
    selectedTaxonId,
    setSelectedTaxonId,

    taxons,
    subTaxons,
    taxonMeta,
    subTaxonMeta,

    taxonForm,
    setTaxonForm,
    subTaxonForm,
    setSubTaxonForm,

    message,

    isTaxonFormOpen,
    isSubTaxonFormOpen,
    editingTaxon,
    editingSubTaxon,

    isTaxonLoading,
    isSubTaxonLoading,
    isTaxonError,
    isSubTaxonError,

    isCreatingTaxon,
    isUpdatingTaxon,
    isDeletingTaxon,

    isCreatingSubTaxon,
    isUpdatingSubTaxon,
    isDeletingSubTaxon,

    refetchTaxons,
    refetchSubTaxons,

    handleTaxonSearch,
    handleSubTaxonSearch,
    handleTaxonReset,
    handleSubTaxonReset,

    openAddTaxonForm,
    openEditTaxonForm,
    closeTaxonForm,

    openAddSubTaxonForm,
    openEditSubTaxonForm,
    closeSubTaxonForm,

    handleTaxonFormSubmit,
    handleSubTaxonFormSubmit,

    handleDeleteTaxon,
    handleDeleteSubTaxon,
  } = useTaxonTable();

  if (isTaxonLoading || isSubTaxonLoading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        Loading taxons...
      </div>
    );
  }

  if (isTaxonError || isSubTaxonError) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="mb-3 text-red">Failed to load taxon data.</p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => refetchTaxons()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Retry Taxons
          </button>

          <button
            type="button"
            onClick={() => refetchSubTaxons()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Retry Sub Taxons
          </button>
        </div>
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

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-6 py-4 dark:border-dark-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-dark dark:text-white">
                  Taxon List
                </h2>

                <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
                  Manage main product categories.
                </p>
              </div>

              <button
                type="button"
                onClick={openAddTaxonForm}
                className="rounded-lg bg-primary px-5 py-3 font-medium text-white"
              >
                Add Taxon
              </button>
            </div>
          </div>

          <div className="p-6">
            <form
              onSubmit={handleTaxonSearch}
              className="mb-5 grid gap-4 md:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Taxon Name
                </label>

                <input
                  value={taxonName}
                  onChange={(event) => setTaxonName(event.target.value)}
                  placeholder="Search taxon..."
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                />
              </div>

              <div className="flex items-end gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-5 py-3 font-medium text-white"
                >
                  Search
                </button>

                <button
                  type="button"
                  onClick={handleTaxonReset}
                  className="rounded-lg border border-stroke px-5 py-3 font-medium text-dark dark:border-dark-3 dark:text-white"
                >
                  Reset
                </button>
              </div>
            </form>

            <div className="mb-4">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Total Taxons: {taxonMeta?.total || 0}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
                    <th className="px-6 py-4 font-medium text-dark dark:text-white">
                      BIL
                    </th>
                    <th className="px-6 py-4 font-medium text-dark dark:text-white">
                      NAME
                    </th>
                    <th className="px-6 py-4 font-medium text-dark dark:text-white">
                      SUB TAXONS
                    </th>
                    <th className="px-6 py-4 font-medium text-dark dark:text-white">
                      ACTION
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {taxons.map((taxon: Taxon, index: number) => (
                    <tr
                      key={taxon.id}
                      className="border-b border-stroke last:border-b-0 dark:border-dark-3"
                    >
                      <td className="px-6 py-4">{index + 1}</td>

                      <td className="px-6 py-4 font-medium text-dark dark:text-white">
                        {taxon.name || "-"}
                      </td>

                      <td className="px-6 py-4">
                        {taxon.sub_taxons_count || 0}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <TableActionButton onClick={() => openEditTaxonForm(taxon)}>
  Edit
</TableActionButton>

<TableActionButton
  variant="danger"
  disabled={isDeletingTaxon}
  onClick={() => handleDeleteTaxon(taxon)}
>
  Delete
</TableActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {taxons.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-dark-5 dark:text-dark-6"
                      >
                        No Taxons Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-6 py-4 dark:border-dark-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-dark dark:text-white">
                  Sub Taxon List
                </h2>

                <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
                  Manage sub categories under each taxon.
                </p>
              </div>

              <button
                type="button"
                onClick={openAddSubTaxonForm}
                className="rounded-lg bg-primary px-5 py-3 font-medium text-white"
              >
                Add Sub Taxon
              </button>
            </div>
          </div>

          <div className="p-6">
            <form
              onSubmit={handleSubTaxonSearch}
              className="mb-5 grid gap-4 md:grid-cols-3"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Sub Taxon Name
                </label>

                <input
                  value={subTaxonName}
                  onChange={(event) => setSubTaxonName(event.target.value)}
                  placeholder="Search sub taxon..."
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Parent Taxon
                </label>

                <select
                  value={selectedTaxonId}
                  onChange={(event) => setSelectedTaxonId(event.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                >
                  <option value="">All Taxons</option>

                  {taxons.map((taxon: Taxon) => (
                    <option key={taxon.id} value={taxon.id}>
                      {taxon.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-5 py-3 font-medium text-white"
                >
                  Search
                </button>

                <button
                  type="button"
                  onClick={handleSubTaxonReset}
                  className="rounded-lg border border-stroke px-5 py-3 font-medium text-dark dark:border-dark-3 dark:text-white"
                >
                  Reset
                </button>
              </div>
            </form>

            <div className="mb-4">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Total Sub Taxons: {subTaxonMeta?.total || 0}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-stroke bg-gray-2 text-left dark:border-dark-3 dark:bg-dark-2">
                    <th className="px-6 py-4 font-medium text-dark dark:text-white">
                      BIL
                    </th>
                    <th className="px-6 py-4 font-medium text-dark dark:text-white">
                      NAME
                    </th>
                    <th className="px-6 py-4 font-medium text-dark dark:text-white">
                      PARENT
                    </th>
                    <th className="px-6 py-4 font-medium text-dark dark:text-white">
                      ACTION
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {subTaxons.map((subTaxon: SubTaxon, index: number) => (
                    <tr
                      key={subTaxon.id}
                      className="border-b border-stroke last:border-b-0 dark:border-dark-3"
                    >
                      <td className="px-6 py-4">{index + 1}</td>

                      <td className="px-6 py-4 font-medium text-dark dark:text-white">
                        {subTaxon.name || "-"}
                      </td>

                      <td className="px-6 py-4">
                        {subTaxon.taxon_name || subTaxon.category || "-"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <TableActionButton onClick={() => openEditSubTaxonForm(subTaxon)}>
  Edit
</TableActionButton>

<TableActionButton
  variant="danger"
  disabled={isDeletingSubTaxon}
  onClick={() => handleDeleteSubTaxon(subTaxon)}
>
  Delete
</TableActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {subTaxons.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-dark-5 dark:text-dark-6"
                      >
                        No Sub Taxons Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isTaxonFormOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-dark dark:text-white">
                {editingTaxon ? "Edit Taxon" : "Add Taxon"}
              </h3>

              <button
                type="button"
                onClick={closeTaxonForm}
                className="text-lg font-bold text-dark dark:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleTaxonFormSubmit}>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Taxon Name
              </label>

              <input
                value={taxonForm.name}
                required
                onChange={(event) =>
                  setTaxonForm({
                    ...taxonForm,
                    name: event.target.value,
                  })
                }
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
              />

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeTaxonForm}
                  className="rounded-lg border border-stroke px-5 py-3 font-medium text-dark dark:border-dark-3 dark:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreatingTaxon || isUpdatingTaxon}
                  className="rounded-lg bg-primary px-5 py-3 font-medium text-white disabled:opacity-60"
                >
                  {isCreatingTaxon || isUpdatingTaxon
                    ? "Saving..."
                    : "Save Taxon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSubTaxonFormOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-dark dark:text-white">
                {editingSubTaxon ? "Edit Sub Taxon" : "Add Sub Taxon"}
              </h3>

              <button
                type="button"
                onClick={closeSubTaxonForm}
                className="text-lg font-bold text-dark dark:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubTaxonFormSubmit} className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Sub Taxon Name
                </label>

                <input
                  value={subTaxonForm.name}
                  required
                  onChange={(event) =>
                    setSubTaxonForm({
                      ...subTaxonForm,
                      name: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Parent Taxon
                </label>

                <select
                  value={subTaxonForm.loyalty_taxon_id}
                  required
                  onChange={(event) =>
                    setSubTaxonForm({
                      ...subTaxonForm,
                      loyalty_taxon_id: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                >
                  <option value="">Select Taxon</option>

                  {taxons.map((taxon: Taxon) => (
                    <option key={taxon.id} value={taxon.id}>
                      {taxon.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Category
                </label>

                <input
                  value={subTaxonForm.category}
                  onChange={(event) =>
                    setSubTaxonForm({
                      ...subTaxonForm,
                      category: event.target.value,
                    })
                  }
                  placeholder="Optional. Uses parent taxon name if empty."
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeSubTaxonForm}
                  className="rounded-lg border border-stroke px-5 py-3 font-medium text-dark dark:border-dark-3 dark:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreatingSubTaxon || isUpdatingSubTaxon}
                  className="rounded-lg bg-primary px-5 py-3 font-medium text-white disabled:opacity-60"
                >
                  {isCreatingSubTaxon || isUpdatingSubTaxon
                    ? "Saving..."
                    : "Save Sub Taxon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TaxonPageContent;