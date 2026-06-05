import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import TextRepeaterClient from "./TextRepeaterClient";

export const metadata: Metadata = {
  title: "Text Repeater | Toollane",

  description:
    "Repeat text multiple times instantly with Toollane's free online text repeater.",
};

export default function TextRepeaterPage() {
  return (
    <ToolPageLayout
      title="Text Repeater"
      description="Repeat text multiple times instantly online."


      href="/text-repeater"
    >
      <TextRepeaterClient />
    </ToolPageLayout>
  );
}