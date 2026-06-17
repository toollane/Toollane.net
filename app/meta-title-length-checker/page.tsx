import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import MetaTitleLengthCheckerClient from "./MetaTitleLengthCheckerClient";

export const metadata: Metadata = {
  title: "Meta Title Length Checker | Toollane",

  description:
    "Check meta title length instantly with Toollane's free online SEO title length checker.",


  alternates: {
    canonical: "/meta-title-length-checker",
  },
};

export default function MetaTitleLengthCheckerPage() {
  return (
    <ToolPageLayout
      title="Meta Title Length Checker"
      description="Check SEO title length instantly online."


      href="/meta-title-length-checker"
    >
      <MetaTitleLengthCheckerClient />
    </ToolPageLayout>
  );
}