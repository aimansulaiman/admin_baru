import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import UserPageContent from "./UserPageContent";

export const metadata: Metadata = {
  title: "Rekod User",
};

const UsersPage = () => {
  return (
    <>

      <UserPageContent />
    </>
  );
};

export default UsersPage;