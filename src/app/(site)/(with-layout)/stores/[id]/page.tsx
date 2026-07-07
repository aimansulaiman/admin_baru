import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import StoreProfile from "@/components/Stores/StoreProfile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store Detail",
};

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Breadcrumb pageName="Store Detail" />

      <StoreProfile id={Number(id)} />
    </>
  );
}