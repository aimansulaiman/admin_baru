import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import StorePageContent from "./StorePageContent";

export const metadata: Metadata = {
  title: "Stores",
};

const StoresPage = () => {
  return (
    <>
      <Breadcrumb pageName="Stores" />

      <StorePageContent />
    </>
  );
};

export default StoresPage;