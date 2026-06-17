import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RandomNamePickerClient from "./RandomNamePickerClient";

export const metadata: Metadata = {
  title: "Random Name Picker | Toollane",

  description:
    "Pick a random name instantly with Toollane's free online random name picker.",


  alternates: {
    canonical: "/random-name-picker",
  },
};

export default function RandomNamePickerPage() {
  return (
    <ToolPageLayout
      title="Random Name Picker"
      description="Pick a random name from a list instantly online."


      href="/random-name-picker"
    >
      <RandomNamePickerClient />
    </ToolPageLayout>
  );
}