import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import MerchandisePageContent from "./MerchandisePageContent";

export const metadata: Metadata = {
  title: "Merchandise",
};

const MerchandisesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Merchandise" />

      <MerchandisePageContent />
    </>
  );
};

export default MerchandisesPage;