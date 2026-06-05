import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";
import { getToolByHref } from "@/data/tools";
import { getToolMetadata } from "@/lib/metadata";

import BabyNameGeneratorClient from "./BabyNameGeneratorClient";

const tool = getToolByHref("/baby-name-generator");

export const metadata: Metadata = getToolMetadata("/baby-name-generator");

export default function BabyNameGeneratorPage() {
  return (
    <ToolPageLayout tool={tool}>
      <BabyNameGeneratorClient />
    </ToolPageLayout>
  );
}