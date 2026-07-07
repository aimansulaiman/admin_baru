import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import OrderProfile from "@/components/Orders/OrderProfile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Detail",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Breadcrumb pageName="Order Detail" />

      <OrderProfile id={Number(id)} />
    </>
  );
}