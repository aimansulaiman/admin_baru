"use client";

import { getUsers } from "@/actions/user";
import {
  ChevronLeft,
  ChevronRight,
  Clipboard,
  ClipboardCheck,
} from "@/assets/icons";
import { UserRole } from "@/lib/auth/permissions";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { PointerUp } from "../icons";
import SectionHeader from "./section-header";
import UserActionsDropdown, { ManageTeamUser } from "./user-action-dropdown";

type UserTableProps = {
  initialUsers: ManageTeamUser[];
};

export default function UserTable({ initialUsers }: UserTableProps) {
  const [users, setUsers] = useState<any>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const firstRenderRef = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const requestId = ++requestIdRef.current;
      setIsLoading(true);

      void (async () => {
        try {
          const nextUsers = await getUsers(searchTerm);

          if (requestId === requestIdRef.current) {
            setUsers(nextUsers);
          }
        } catch (error) {
          if (requestId === requestIdRef.current) {
            setUsers([]);
          }

          // Keep the table responsive even if the search request fails.
          console.error("Failed to fetch users", error);
        } finally {
          if (requestId === requestIdRef.current) {
            setIsLoading(false);
          }
        }
      })();
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const handleCopyId = async (id: string) => {
    const copied = await copyToClipboard(id);

    if (copied) {
      setCopiedId(id);
      toast.success("ID copied to clipboard");
      window.setTimeout(() => {
        setCopiedId((currentId) => (currentId === id ? null : currentId));
      }, 1500);
      return;
    }

    toast.error("Failed to copy ID");
  };

  const userColumns: ColumnDef<ManageTeamUser>[] = [
    {
      id: "id",
      header: "Id",
      accessorKey: "id",
      enableColumnFilter: false,
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      enableColumnFilter: true,
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      enableColumnFilter: false,
    },
    {
      id: "emailVerified",
      header: "Email Verified",
      accessorKey: "emailVerified",
      cell: ({ getValue }) =>
        getValue<boolean>() ? "Verified" : "Not verified",
    },
    {
      id: "role",
      header: "Role",
      accessorKey: "role",
      enableColumnFilter: true,
      cell: ({ getValue }) => {
        const role = getValue<UserRole>();
        return role ? role.charAt(0).toUpperCase() + role.slice(1) : "-";
      },
    },
    {
      id: "createdAt",
      header: "Joined At",
      accessorKey: "createdAt",
      cell: ({ getValue }) => dayjs(getValue<string>()).format("DD MMM, YYYY"),
    },
    {
      id: "actions",
      header: "Actions",
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => (
        <UserActionsDropdown user={row.original} disabled={isLoading} />
      ),
    },
  ];

  const table = useReactTable({
    data: users,
    columns: userColumns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: true,
  });

  const visibleRows = table.getRowModel().rows.length;
  const totalRows = table.getPrePaginationRowModel().rows.length;

  return (
    <section className="data-table-common rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <SectionHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isLoading={isLoading}
        pageSize={table.getState().pagination.pageSize}
        setPageSize={(pageSize) => table.setPageSize(pageSize)}
      />

      {/* Table */}
      <div className="grid grid-cols-1 overflow-x-auto">
        <table className="datatable-table datatable-one border-collapse! px-4 md:px-8">
          <thead className="border-separate px-4 align-top">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                className="border-t border-stroke dark:border-dark-3"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="align-top whitespace-nowrap first-of-type:pl-4! last-of-type:pr-4! first-of-type:md:pl-8! last-of-type:md:pr-8!"
                  >
                    <div>
                      <div
                        className={cn(
                          "flex items-center",
                          header.column.getCanSort()
                            ? "cursor-pointer"
                            : "cursor-default",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>

                        {header.column.getCanSort() && (
                          <div className="ml-2 inline-flex flex-col space-y-0.5">
                            <PointerUp />
                            <PointerUp className="rotate-180" />
                          </div>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={userColumns.length}
                  className="py-24! text-center first-of-type:pl-4! last-of-type:pr-4! first-of-type:md:pl-8! last-of-type:md:pr-8!"
                >
                  No data found
                </td>
              </tr>
            )}

            {table.getRowModel().rows.map((row) => (
              <tr
                className="border-t border-stroke dark:border-dark-3"
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`${
                      cell.column.id === "id"
                        ? "w-50 max-w-50 pl-4! sm:pl-8!"
                        : cell.column.id === "email"
                          ? "w-64 max-w-64"
                          : cell.column.id === "actions"
                            ? "pr-4! md:pr-8!"
                            : ""
                    } truncate`}
                  >
                    {cell.column.id === "id" ? (
                      <div className="flex items-center gap-1">
                        <span className="truncate">
                          {cell.getValue<string>()}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyId(cell.getValue<string>())}
                          className="shrink-0 cursor-pointer text-dark-4 hover:text-dark disabled:cursor-not-allowed disabled:opacity-50 dark:text-dark-6 dark:hover:text-white"
                          aria-label={`Copy ${cell.getValue<string>()}`}
                          disabled={isLoading}
                        >
                          {copiedId === cell.getValue<string>() ? (
                            <ClipboardCheck className="size-4.5" />
                          ) : (
                            <Clipboard className="size-4.5" />
                          )}
                        </button>
                      </div>
                    ) : cell.column.id === "email" ? (
                      <span className="block truncate">
                        {cell.getValue<string>()}
                      </span>
                    ) : cell.column.id === "role" ? (
                      <span className="capitalize">
                        {cell.getValue<UserRole>()}
                      </span>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-7.5 py-7">
        <div className="flex items-center">
          <button
            className="flex items-center justify-center rounded-[3px] p-1.75 hover:bg-primary hover:text-white disabled:pointer-events-none"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft width={18} height={18} />
          </button>

          {Array.from(
            { length: table.getPageCount() },
            (_, index) => index,
          ).map((pageIndex) => (
            <button
              key={pageIndex}
              onClick={() => table.setPageIndex(pageIndex)}
              className={`${
                table.getState().pagination.pageIndex === pageIndex &&
                "bg-primary text-white"
              } mx-1 flex items-center justify-center rounded-[3px] p-1.5 px-3.75 font-medium hover:bg-primary hover:text-white`}
            >
              {pageIndex + 1}
            </button>
          ))}

          <button
            className="flex items-center justify-center rounded-[3px] p-1.75 hover:bg-primary hover:text-white disabled:pointer-events-none"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight width={18} height={18} />
          </button>
        </div>

        <div className="font-medium text-dark-4 dark:text-dark-6">
          Showing {visibleRows} results of {totalRows}
        </div>
      </div>
    </section>
  );
}
