import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UserProfile from "@/components/Users/UserProfile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Detail",
};

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Breadcrumb pageName="User Detail" />

      <UserProfile id={Number(id)} />
    </>
  );
}