import { getUsers } from "@/actions/user";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import hasPermission from "@/utils/hasPermission";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import UserTable from "./_components/user-table";

export default async function ManageTeamPage() {
  const permission = await hasPermission({
    user: ["list"],
  });

  if (!permission) {
    return redirect(
      `/?toast_type=error&message=${encodeURIComponent(
        "You don't have permission to access Manage Team page",
      )}`,
    );
  }

  const initialUsers = await getUsers();

  return (
    <div className="mx-auto w-full">
      <Breadcrumb pageName="Staff TEMU" />

      <Suspense fallback={<span>Loading users...</span>}>
        <UserTable initialUsers={initialUsers} />
      </Suspense>
    </div>
  );
}
