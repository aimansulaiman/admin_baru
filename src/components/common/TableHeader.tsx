"use client";

import { useGetUsersQuery } from "@/app/api/rtk/userApi";
import { useMemo, useState } from "react";
import Link from "next/link";

export interface TableHeaderProps {
    mainTitle:string
    subTitle:string
}

const TableHeader = ({mainTitle,subTitle}: TableHeaderProps) => {
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="border-b border-stroke px-6 py-4 dark:border-dark-3">
        <h2 className="text-xl font-semibold text-dark dark:text-white">
          {mainTitle}
        </h2>

        <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
          {subTitle}
        </p>
      </div>
      </div>
  );
};

export default TableHeader