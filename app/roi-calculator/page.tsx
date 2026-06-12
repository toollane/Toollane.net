import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";
import { getToolByHref } from "@/data/tools";
import { getToolMetadata } from "@/lib/metadata";

import RoiCalculatorClient from "./RoiCalculatorClient";

const tool = getToolByHref("/roi-calculator");

export const metadata: Metadata = getToolMetadata("/roi-calculator");

export default function RoiCalculatorPage() {
  return (
    <ToolPageLayout tool={tool}>
      <RoiCalculatorClient />
    </ToolPageLayout>
  );
}