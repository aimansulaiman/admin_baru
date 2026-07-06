import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import RewardCampaignPageContent from "./RewardCampaignPageContent";

export const metadata: Metadata = {
  title: "Reward Campaigns",
};

const RewardCampaignsPage = () => {
  return (
    <>
      <Breadcrumb pageName="Reward Campaigns" />

      <RewardCampaignPageContent />
    </>
  );
};

export default RewardCampaignsPage;