import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contributor Portal - Scoreyo",
  description: "Create and submit verified questions to Scoreyo's question bank",
};

export default function ContributorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
