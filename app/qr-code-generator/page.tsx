import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import QrCodeGeneratorClient from "./QrCodeGeneratorClient";

export const metadata: Metadata = {
  title:
    "QR Code Generator | Toollane",

  description:
    "Generate QR codes instantly with Toollane's free online QR code generator.",
};

const faqs = [
  {
    question:
      "What does a QR code generator do?",

    answer:
      "It creates scannable QR codes for URLs, text, contact data, WiFi access and more.",
  },

  {
    question:
      "Can I download the QR code?",

    answer:

  },

  {
    question:
      "What can QR codes be used for?",

    answer:
      "QR codes are used for websites, restaurant menus, business cards, WiFi sharing and social media.",
  },
];

export default function QrCodeGeneratorPage() {
  return (
    <ToolPageLayout
      title="QR Code Generator"
      description="Generate QR codes instantly online."


      href="/qr-code-generator"
      faqs={faqs}
    >
      <QrCodeGeneratorClient />
    </ToolPageLayout>
  );
}