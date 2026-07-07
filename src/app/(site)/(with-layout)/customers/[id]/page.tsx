import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CustomerProfile from "@/components/Customers/CustomerProfile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Profile",
};

export default async function CustomerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Breadcrumb pageName="Customer Profile" />

      <CustomerProfile id={Number(id)} />
    </>
  );
}