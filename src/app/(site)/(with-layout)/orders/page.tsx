import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import OrderPageContent from "./OrderPageContent";

export const metadata: Metadata = {
  title: "Orders Records",
};

const OrdersPage = () => {
  return (
    <>
      <Breadcrumb pageName="Orders Records" />

      <OrderPageContent />
    </>
  );
};

export default OrdersPage;