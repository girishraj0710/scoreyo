import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teacher Portal - PrepGenie",
  description: "Create and submit verified questions to PrepGenie's question bank",
};

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
