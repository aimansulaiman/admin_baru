import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AdminProfileCard from "@/components/Profile/AdminProfileCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <>
      <Breadcrumb pageName="Profile" />

      <AdminProfileCard />
    </>
  );
}