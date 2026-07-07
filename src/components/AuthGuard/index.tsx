"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("mula_auth_token");
    const user = localStorage.getItem("mula_auth_user");

    if (!token || !user) {
      localStorage.removeItem("mula_auth_token");
      localStorage.removeItem("mula_auth_user");
      document.cookie = "mula_auth_token=; path=/; max-age=0; SameSite=Lax";

      router.replace(`/auth/sign-in?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    setIsChecking(false);
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-2 dark:bg-[#020d1a]">
        <div className="rounded-lg bg-white px-6 py-4 text-sm font-medium text-dark shadow-1 dark:bg-gray-dark dark:text-white">
          Checking session...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}