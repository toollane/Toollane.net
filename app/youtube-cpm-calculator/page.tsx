import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import YoutubeCpmCalculatorClient from "./YoutubeCpmCalculatorClient";

export const metadata: Metadata = {
  title: "YouTube CPM Calculator | Toollane",

  description:
    "Calculate YouTube CPM from revenue and views with Toollane's free online YouTube CPM calculator.",
};

const faqs = [
  {
    question: "How do you calculate YouTube CPM?",

    answer:
      "YouTube CPM is estimated by dividing revenue by views and multiplying the result by 1,000.",
  },

  {
    question: "What does CPM mean on YouTube?",

    answer:
      "CPM means cost per thousand views and is used to estimate revenue or advertiser cost per 1,000 views.",
  },

  {
    question: "Is YouTube CPM the same as creator earnings?",

    answer:

  },
];

export default function YoutubeCpmCalculatorPage() {
  return (
    <ToolPageLayout
      title="YouTube CPM Calculator"
      description="Calculate YouTube CPM from revenue and views instantly online."


      href="/youtube-cpm-calculator"
      faqs={faqs}
    >
      <YoutubeCpmCalculatorClient />
    </ToolPageLayout>
  );
}