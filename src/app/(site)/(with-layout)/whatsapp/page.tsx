import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import WhatsappPageContent from "./WhatsappPageContent";

export const metadata: Metadata = {
  title: "Whatsapp",
};

const WhatsappPage = () => {
  return (
    <>
      <Breadcrumb pageName="Whatsapp" />

      <WhatsappPageContent />
    </>
  );
};

export default WhatsappPage;