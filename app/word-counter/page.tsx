import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";
import { getToolByHref } from "@/data/tools";
import { getToolMetadata } from "@/lib/metadata";

import WordCounterClient from "./WordCounterClient";

const tool = getToolByHref("/word-counter");

export const metadata: Metadata = getToolMetadata("/word-counter");

export default function WordCounterPage() {
  return (
    <ToolPageLayout tool={tool}>
      <WordCounterClient />
    </ToolPageLayout>
  );
}