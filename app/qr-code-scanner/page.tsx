import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import QrCodeScannerClient from "./QrCodeScannerClient";

export const metadata: Metadata = {
  title: "QR Code Scanner | Toollane",

  description:
    "Scan QR codes instantly with Toollane's free online QR code scanner.",
};

const faqs = [
  {
    question:
      "What does a QR code scanner do?",

    answer:

  },

  {
    question:
      "Are images or camera data uploaded?",

    answer:

  },

  {
    question:
      "Can I scan QR codes on mobile?",

    answer:
      "Yes. The QR scanner works on phones, tablets, and desktop devices with a camera.",
  },
];

export default function QrCodeScannerPage() {
  return (
    <ToolPageLayout
      title="QR Code Scanner"
      description="Scan QR codes instantly online."


      href="/qr-code-scanner"
      faqs={faqs}
    >
      <QrCodeScannerClient />
    </ToolPageLayout>
  );
}