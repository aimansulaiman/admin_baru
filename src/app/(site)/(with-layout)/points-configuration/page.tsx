import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import PointsConfigurationPageContent from "./PointsConfigurationPageContent";

export const metadata: Metadata = {
  title: "Points Configuration",
};

const PointsConfigurationPage = () => {
  return (
    <>
      <Breadcrumb pageName="Points Configuration" />

      <PointsConfigurationPageContent />
    </>
  );
};

export default PointsConfigurationPage;