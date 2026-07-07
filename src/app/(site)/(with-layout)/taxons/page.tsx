import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import TaxonPageContent from "./TaxonPageContent";

export const metadata: Metadata = {
  title: "Taxons",
};

const TaxonsPage = () => {
  return (
    <>
      <Breadcrumb pageName="Taxons" />

      <TaxonPageContent />
    </>
  );
};

export default TaxonsPage;