import { Metadata } from "next";
import BugReportDetailPageContent from "./BugReportDetailPageContent";

export const metadata: Metadata = {
  title: "Bug Report Details",
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const BugReportDetailPage = async ({ params }: Props) => {
  const { id } = await params;

  return <BugReportDetailPageContent id={id} />;
};

export default BugReportDetailPage;