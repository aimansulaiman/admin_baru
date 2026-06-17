import { SearchIcon } from "@/assets/icons";
import { type Dispatch, type SetStateAction } from "react";
import Spinner from "./spinner";

type SectionHeaderProps = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
};

export default function SectionHeader({
  searchTerm,
  setSearchTerm,
  isLoading,
  pageSize,
  setPageSize,
}: SectionHeaderProps) {
  return (
    <div className="flex justify-between px-4 py-4.5 sm:px-7.5">
      <div className="relative z-20 w-full max-w-103.5">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2.5 outline-none focus:border-primary sm:px-5 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
          placeholder="Search by id, name, or email..."
        />

        <button
          type="button"
          disabled={isLoading}
          className="absolute top-0 right-0 flex h-11.5 w-11.5 items-center justify-center rounded-r-md bg-primary text-white disabled:cursor-not-allowed"
        >
          {isLoading ? <Spinner /> : <SearchIcon className="size-4.5" />}
        </button>
      </div>

      <div className="flex items-center font-medium">
        <p className="hidden pl-2 font-medium text-dark sm:block dark:text-current">
          Per Page:
        </p>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="bg-transparent pl-2.5"
        >
          {[5, 10, 20, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
