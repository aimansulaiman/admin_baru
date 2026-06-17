import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Team",
};

export default function ManageTeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
