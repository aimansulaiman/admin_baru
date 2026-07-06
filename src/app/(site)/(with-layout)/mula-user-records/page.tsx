import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MulaUserRecordsTable from "@/components/MulaUserRecords/MulaUserRecordsTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MULA User Records",
};

export default function MulaUserRecordsPage() {
  return (
    <>
      <Breadcrumb pageName="Rekod User" />

      <MulaUserRecordsTable />
    </>
  );
}