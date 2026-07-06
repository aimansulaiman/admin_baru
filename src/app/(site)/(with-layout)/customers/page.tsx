import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import CustomerPageContent from "./CustomerPageContent";

export const metadata: Metadata = {
  title: "Customers",
};

const CustomersPage = () => {
  return (
    <>
      <Breadcrumb pageName="Customers" />

      <CustomerPageContent />
    </>
  );
};

export default CustomersPage;