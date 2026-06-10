import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contributor Portal - Krakkify",
  description: "Create and submit verified questions to Krakkify's question bank",
};

export default function ContributorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
