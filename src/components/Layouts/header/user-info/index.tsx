"use client";

import { ChevronUpIcon } from "@/assets/icons";
import { useLogoutMutation } from "@/app/api/rtk/authApi";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { LogOutIcon, UserIcon } from "./icons";

type StoredUser = {
  id?: number;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  img?: string | null;
  role?: string | null;
};

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const router = useRouter();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    const storedUser = localStorage.getItem("mula_auth_user");

    if (!storedUser) {
      setUser(null);
      setIsLoadingUser(false);
      return;
    }

    try {
      setUser(JSON.parse(storedUser) as StoredUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  const userName =
    user?.full_name ||
    user?.name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    "MULA User";

  const userRole = user?.role || "Admin";

  const initials = useMemo(() => {
    const nameParts = userName.trim().split(" ").filter(Boolean);

    if (!nameParts.length) {
      return "MU";
    }

    const firstInitial = nameParts[0]?.[0] || "";
    const secondInitial = nameParts[1]?.[0] || "";

    return `${firstInitial}${secondInitial}`.toUpperCase() || "MU";
  }, [userName]);

  async function handleLogout() {
    const confirmed = window.confirm("Are you sure you want to logout?");

    if (!confirmed) {
      return;
    }

    setIsOpen(false);

    const loadingId = toast.loading("Logging out...");

    try {
      await logout().unwrap();
      toast.success("Logged out successfully");
    } catch {
      toast.success("Logged out locally");
    } finally {
      localStorage.removeItem("mula_auth_token");
      localStorage.removeItem("mula_auth_user");
      document.cookie = "mula_auth_token=; path=/; max-age=0; SameSite=Lax";

      toast.dismiss(loadingId);
      router.replace("/auth/sign-in");
    }
  }

  if (isLoadingUser) {
    return (
      <div className="flex items-center gap-3" role="presentation">
        <span className="inline-block size-12 animate-pulse rounded-full bg-gray-200" />

        <div className="relative h-7 w-fit">
          <span className="flex h-7 w-30 animate-pulse items-center justify-end rounded-full bg-gray-200 pr-2" />

          <ChevronUpIcon
            aria-hidden
            className="absolute top-1/2 right-2 -translate-y-1/2 rotate-180 text-gray-400/60"
            strokeWidth={1.5}
          />
        </div>
      </div>
    );
  }

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="cursor-pointer rounded align-middle ring-primary ring-offset-2 outline-none focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          <UserAvatar initials={initials} />

          <figcaption className="flex items-center gap-1 font-medium text-dark max-[1024px]:sr-only dark:text-dark-6">
            <span className="max-w-24 truncate">{userName}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md min-[230px]:min-w-70 dark:border-dark-3 dark:bg-gray-dark"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-3 px-5 py-4">
          <UserAvatar initials={initials} />

          <figcaption className="min-w-0">
            <div className="truncate text-base font-semibold capitalize leading-none text-dark dark:text-white">
              {userName}
            </div>

            <div className="mt-2 truncate text-sm font-medium capitalize leading-none text-gray-6">
              {userRole}
            </div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] *:cursor-pointer dark:text-dark-6">
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.25 ring-primary outline-0 hover:bg-gray-2 hover:text-dark focus-visible:ring-1 dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">View profile</span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2.25 ring-primary outline-0 hover:bg-gray-2 hover:text-dark focus-visible:ring-1 dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={handleLogout}
          >
            <LogOutIcon />

            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}

type UserAvatarProps = {
  initials: string;
};

function UserAvatar({ initials }: UserAvatarProps) {
  return (
    <span className="flex size-12 items-center justify-center rounded-full border bg-gray-2 text-sm font-bold uppercase text-dark outline-none dark:border-dark-4 dark:bg-dark-2 dark:text-white">
      {initials}
    </span>
  );
}