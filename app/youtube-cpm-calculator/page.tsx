import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import YoutubeCpmCalculatorClient from "./YoutubeCpmCalculatorClient";

export const metadata: Metadata = {
  title: "YouTube CPM Calculator | Toollane",

  description:
    "Calculate YouTube CPM from revenue and views with Toollane's free online YouTube CPM calculator.",
};

export default function YoutubeCpmCalculatorPage() {
  return (
    <ToolPageLayout
      title="YouTube CPM Calculator"
      description="Calculate YouTube CPM from revenue and views instantly online."


      href="/youtube-cpm-calculator"
    >
      <YoutubeCpmCalculatorClient />
    </ToolPageLayout>
  );
}