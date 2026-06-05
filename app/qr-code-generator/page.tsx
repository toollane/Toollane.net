import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import QrCodeGeneratorClient from "./QrCodeGeneratorClient";

export const metadata: Metadata = {
  title:
    "QR Code Generator | Toollane",

  description:
    "Generate QR codes instantly with Toollane's free online QR code generator.",
};

export default function QrCodeGeneratorPage() {
  return (
    <ToolPageLayout
      title="QR Code Generator"
      description="Generate QR codes instantly online."


      href="/qr-code-generator"
    >
      <QrCodeGeneratorClient />
    </ToolPageLayout>
  );
}