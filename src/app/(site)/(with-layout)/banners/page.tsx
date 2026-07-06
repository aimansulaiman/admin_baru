import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import BannerPageContent from "./BannerPageContent";

export const metadata: Metadata = {
  title: "Banners",
};

const BannerPage = () => {
  return (
    <>
      <Breadcrumb pageName="Banners" />

      <BannerPageContent />
    </>
  );
};

export default BannerPage;