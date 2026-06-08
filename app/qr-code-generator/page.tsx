import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";
import { getToolByHref } from "@/data/tools";
import { getToolMetadata } from "@/lib/metadata";

import QrCodeGeneratorClient from "./QrCodeGeneratorClient";

const tool = getToolByHref("/qr-code-generator");

export const metadata: Metadata = getToolMetadata("/qr-code-generator");

export default function QrCodeGeneratorPage() {
  return (
    <ToolPageLayout tool={tool}>
      <QrCodeGeneratorClient />
    </ToolPageLayout>
  );
}