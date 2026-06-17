import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import QrCodeScannerClient from "./QrCodeScannerClient";

export const metadata: Metadata = {
  title: "QR Code Scanner | Toollane",

  description:
    "Scan QR codes instantly with Toollane's free online QR code scanner.",


  alternates: {
    canonical: "/qr-code-scanner",
  },
};

export default function QrCodeScannerPage() {
  return (
    <ToolPageLayout
      title="QR Code Scanner"
      description="Scan QR codes instantly online."


      href="/qr-code-scanner"
    >
      <QrCodeScannerClient />
    </ToolPageLayout>
  );
}