"use client";

import { MenuIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { Notification } from "./notification";
import { SearchInput } from "./search-input";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-5 md:px-5 2xl:px-10 dark:border-stroke-dark dark:bg-gray-dark">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="relative z-50 rounded-lg border border-stroke bg-white px-1.5 py-1 text-dark lg:hidden dark:border-stroke-dark dark:bg-[#020D1A] dark:text-white hover:dark:bg-[#FFFFFF1A]"
        >
          <MenuIcon />

          <span className="sr-only">Toggle Sidebar</span>
        </button>

        {isMobile && (
          <Link href="/store-management" className="flex items-center gap-2">
            <Image
              src="/images/logo/MulaLogo.png"
              width={100}
              height={100}
              alt="MULA Coffee"
              className="h-9 w-9 object-contain"
              priority
            />

            <div className="leading-tight">
              <p className="text-sm font-bold text-dark dark:text-white">
                MULA
              </p>

              <p className="text-xs font-medium text-dark-5 dark:text-dark-6">
                Coffee
              </p>
            </div>
          </Link>
        )}
      </div>

      <div className="max-xl:hidden">
        <div className="mb-0.5 text-heading-5 font-bold text-dark dark:text-white">
          Dashboard
        </div>

        <p className="font-medium">MULA Coffee Management System</p>
      </div>

      <div className="ml-auto flex items-center gap-2 2xsm:gap-4">
        <SearchInput />

        <ThemeToggleSwitch />

        <Notification />

        <UserInfo />
      </div>
    </header>
  );
}