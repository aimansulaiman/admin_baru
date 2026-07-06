import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import CheckinRewardPageContent from "./CheckinRewardPageContent";

export const metadata: Metadata = {
  title: "Check-in Rewards",
};

const CheckinRewardPage = () => {
  return (
    <>
      <Breadcrumb pageName="Check-in Rewards" />

      <CheckinRewardPageContent />
    </>
  );
};

export default CheckinRewardPage;