import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import StatisticsCards from "@/components/Statistics/StatisticsCards";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistics",
};

export default function StatisticsPage() {
  return (
    <>
      <Breadcrumb pageName="Statistics" />

      <StatisticsCards />
    </>
  );
}