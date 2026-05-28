import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import WifiQrGeneratorClient from "./WifiQrGeneratorClient";

export const metadata: Metadata = {
  title:
    "WiFi QR Generator | Toollane",

  description:
    "Generate WiFi QR codes instantly with Toollane's free online WiFi QR generator.",
};

const faqs = [
  {
    question:
      "What does a WiFi QR generator do?",

    answer:

  },

  {
    question:
      "Can guests scan the QR code to join WiFi?",

    answer:

  },

  {
    question:
      "Can I download the WiFi QR code?",

    answer:

  },
];

export default function WifiQrGeneratorPage() {
  return (
    <ToolPageLayout
      title="WiFi QR Generator"
      description="Generate WiFi QR codes instantly online."


      href="/wifi-qr-generator"
      faqs={faqs}
    >
      <WifiQrGeneratorClient />
    </ToolPageLayout>
  );
}