import type { Metadata } from "next";
import StoreManagementPageContent from "./StoreManagementPageContent";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function StoreManagementPage() {
  return <StoreManagementPageContent />;
}