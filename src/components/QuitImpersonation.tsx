"use client";

import { LogoutIcon } from "@/assets/icons";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function QuitImpersonation() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const { refetch } = authClient.useSession();

  // Check if session is being impersonated
  const isImpersonating = !!session?.session?.impersonatedBy;

  if (!isImpersonating) {
    return null;
  }

  const handleStopImpersonating = async () => {
    const toastId = toast.loading("Quitting impersonation...");

    try {
      await authClient.admin.stopImpersonating();

      router.push("/manage-team");
      refetch();
      router.refresh();

      toast.success("Successfully quit impersonation.", { id: toastId });
    } catch (error) {
      toast.error("Failed to quit impersonation.", { id: toastId });
    }
  };

  return (
    <button
      onClick={handleStopImpersonating}
      className="hover:bg-opacity-90 fixed right-4 bottom-4 z-50 flex cursor-pointer items-center justify-center gap-2 rounded-[7px] border border-primary bg-primary p-2.75 pl-2.25 text-center font-medium text-white transition disabled:opacity-60"
    >
      <LogoutIcon className="size-4.5" /> Quit Impersonation
    </button>
  );
}
