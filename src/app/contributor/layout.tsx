import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contributor Portal - PrepGenie",
  description: "Create and submit verified questions to PrepGenie's question bank",
};

export default function ContributorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
