import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ResumeBuilderClient from "./ResumeBuilderClient";

export const metadata: Metadata = {
  title:
    "Resume Builder | Toollane",

  description:
    "Create professional resumes instantly with Toollane's free online resume builder.",
};

export default function ResumeBuilderPage() {
  return (
    <ToolPageLayout
      title="Resume Builder"
      description="Create professional resumes instantly online."


      href="/resume-builder"
    >
      <ResumeBuilderClient />
    </ToolPageLayout>
  );
}