import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import AdditionalSettingPageContent from "./AdditionalSettingPageContent";

export const metadata: Metadata = {
  title: "Additional Settings",
};

const AdditionalSettingPage = () => {
  return (
    <>
      <Breadcrumb pageName="Additional Settings" />

      <AdditionalSettingPageContent />
    </>
  );
};

export default AdditionalSettingPage;