import {
  banUser,
  deleteUser,
  impersonateUser,
  logoutUser,
  makeAdmin,
  unbanUser,
} from "@/actions/user";
import {
  EllipsisHorizontal,
  LogoutIcon,
  ShieldUserIcon,
  TrashIcon,
  UserBlockIcon,
  UserCheckIcon,
  UserIdCardIcon,
} from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { authClient } from "@/lib/auth/auth-client";
import { UserRole } from "@/lib/auth/permissions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmationModal from "./confirmation-modal";

export type ManageTeamUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  banned: boolean;
  createdAt: string;
};

export default function UserActionsDropdown({
  user,
  disabled = false,
}: {
  user: ManageTeamUser;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { refetch } = authClient.useSession();

  const isAdmin = user?.role === "admin";
  const isBanned = user?.banned;
  type PendingAction =
    | "makeAdmin"
    | "logout"
    | "ban"
    | "unban"
    | "impersonate"
    | "delete"
    | null;

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const openConfirm = (action: PendingAction) => {
    setIsOpen(false);
    setPendingAction(action);
    setModalOpen(true);
  };

  const executePendingAction = async () => {
    setModalOpen(false);
    setIsOpen(false);

    const toastId = toast.loading("Loading...");

    try {
      let res: any = null;

      switch (pendingAction) {
        case "makeAdmin":
          res = await makeAdmin();
          break;
        case "logout":
          res = await logoutUser();
          break;
        case "ban":
          res = await banUser();
          break;
        case "unban":
          res = await unbanUser();
          break;
        case "impersonate":
          res = await impersonateUser();
          break;
        case "delete":
          res = await deleteUser(user);
          break;
        default:
          throw new Error("No action to perform");
      }

      if (res instanceof Error) {
        toast.error(res.message || "An error occurred", { id: toastId });
      } else if (res && res.success) {
        toast.success(res.message, { id: toastId });
        if (pendingAction === "impersonate") {
          await refetch();
        }
        router.refresh();
      } else if (pendingAction === "delete") {
        toast.success("User deleted successfully", { id: toastId });
        router.refresh();
      } else {
        toast.success("Action completed", { id: toastId });
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while performing the action",
        { id: toastId },
      );
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <>
      <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
        <DropdownTrigger
          disabled={disabled}
          className="flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-md text-dark-4 hover:bg-gray-2 hover:text-dark disabled:cursor-not-allowed disabled:opacity-50 dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
        >
          <span className="sr-only">Open actions for {user.name}</span>
          <EllipsisHorizontal />
        </DropdownTrigger>

        <DropdownContent
          align="end"
          className="mt-1 w-52 space-y-1.5 rounded-lg border border-stroke bg-white p-2 shadow-2 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card"
        >
          <button
            type="button"
            disabled={disabled || isAdmin}
            onClick={() => openConfirm("makeAdmin")}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2.25 text-left font-medium text-dark-4 hover:bg-gray-2 hover:text-dark disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-dark-4 disabled:opacity-70 dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <ShieldUserIcon className="size-5" />
            <span>Make Admin</span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => openConfirm("logout")}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2.25 text-left font-medium text-dark-4 hover:bg-gray-2 hover:text-dark disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-dark-4 disabled:opacity-70 dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <LogoutIcon className="size-5" />
            <span>Logout User</span>
          </button>

          {isBanned ? (
            <button
              type="button"
              disabled={disabled || isAdmin}
              onClick={() => openConfirm("unban")}
              className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2.25 text-left font-medium text-dark-4 hover:bg-gray-2 hover:text-dark disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-dark-4 disabled:opacity-70 dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
            >
              <UserCheckIcon className="size-5" />
              <span>Unban User</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={disabled || isAdmin}
              onClick={() => openConfirm("ban")}
              className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2.25 text-left font-medium text-dark-4 hover:bg-gray-2 hover:text-dark disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-dark-4 disabled:opacity-70 dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
            >
              <UserBlockIcon className="size-5" />
              <span>Ban User</span>
            </button>
          )}

          <button
            type="button"
            disabled={disabled || isAdmin}
            onClick={() => openConfirm("impersonate")}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2.25 text-left font-medium text-dark-4 hover:bg-gray-2 hover:text-dark disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-dark-4 disabled:opacity-70 dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIdCardIcon className="size-5" />
            <span>Impersonate User</span>
          </button>

          <button
            type="button"
            disabled={disabled || isAdmin}
            onClick={() => openConfirm("delete")}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2.25 text-left font-medium text-dark-4 hover:bg-gray-2 hover:text-dark disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-dark-4 disabled:opacity-70 dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <TrashIcon className="size-5" />
            <span>Delete User</span>
          </button>
        </DropdownContent>
      </Dropdown>
      <ConfirmationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          pendingAction === "makeAdmin"
            ? `Promote ${user.name} to admin?`
            : pendingAction === "logout"
              ? `Logout ${user.name}?`
              : pendingAction === "ban"
                ? `Ban ${user.name}?`
                : pendingAction === "unban"
                  ? `Unban ${user.name}?`
                  : pendingAction === "impersonate"
                    ? `Impersonate ${user.name}?`
                    : pendingAction === "delete"
                      ? `Delete ${user.name}?`
                      : undefined
        }
        description={
          pendingAction === "delete"
            ? "This will permanently delete the user. This action cannot be undone."
            : pendingAction === "impersonate"
              ? "You will begin impersonating this user and the session will change."
              : pendingAction === "logout"
                ? "This will revoke all active sessions for the user."
                : pendingAction === "ban"
                  ? "Temporarily ban this user from accessing the system."
                  : pendingAction === "unban"
                    ? "Remove ban from the user."
                    : pendingAction === "makeAdmin"
                      ? "Grant admin privileges to this user."
                      : undefined
        }
        confirmLabel={
          pendingAction === "delete"
            ? "Delete"
            : pendingAction === "ban"
              ? "Ban"
              : "Confirm"
        }
        onConfirm={executePendingAction}
      />
    </>
  );
}
