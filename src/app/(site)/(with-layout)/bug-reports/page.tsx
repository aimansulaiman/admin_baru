import { Metadata } from "next";
import BugReportPageContent from "./BugReportPageContent";

export const metadata: Metadata = {
  title: "Bug Reports",
};

const BugReportsPage = () => {
  return <BugReportPageContent />;
};

export default BugReportsPage;