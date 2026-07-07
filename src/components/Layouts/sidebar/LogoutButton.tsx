"use client";

import { useLogoutMutation } from "@/app/api/rtk/authApi";
import { useRouter } from "next/navigation";
import { Authentication } from "./icons";

const LogoutButton = () => {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");

    if (!confirmed) {
      return;
    }

    try {
      await logout().unwrap();
    } catch {
      // Still logout locally even if API logout fails.
    } finally {
      localStorage.removeItem("mula_auth_token");
      localStorage.removeItem("mula_auth_user");

      router.replace("/auth/sign-in");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left font-medium text-red hover:bg-red/10 disabled:opacity-60"
    >
      <Authentication className="size-6 shrink-0" aria-hidden="true" />

      <span>{isLoading ? "Logging out..." : "Logout"}</span>
    </button>
  );
};

export default LogoutButton;