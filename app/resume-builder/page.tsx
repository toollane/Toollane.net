import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ResumeBuilderClient from "./ResumeBuilderClient";

export const metadata: Metadata = {
  title:
    "Resume Builder | Toollane",

  description:
    "Create professional resumes instantly with Toollane's free online resume builder.",
};

const faqs = [
  {
    question:
      "What does a resume builder do?",

    answer:

  },

  {
    question:
      "Who uses resume builders?",

    answer:
      "Students, job seekers, freelancers and professionals use resume builders.",
  },

  {
    question:
      "Can I download my resume?",

    answer:

  },
];

export default function ResumeBuilderPage() {
  return (
    <ToolPageLayout
      title="Resume Builder"
      description="Create professional resumes instantly online."


      href="/resume-builder"
      faqs={faqs}
    >
      <ResumeBuilderClient />
    </ToolPageLayout>
  );
}