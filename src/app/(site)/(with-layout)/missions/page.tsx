import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import MissionPageContent from "./MissionPageContent";

export const metadata: Metadata = {
  title: "Missions",
};

const MissionsPage = () => {
  return (
    <>
      <Breadcrumb pageName="Missions" />

      <MissionPageContent />
    </>
  );
};

export default MissionsPage;