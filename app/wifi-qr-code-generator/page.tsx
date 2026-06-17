import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import WifiQrGeneratorClient from "./WifiQrGeneratorClient";

export const metadata: Metadata = {
  title:
    "WiFi QR Generator | Toollane",

  description:
    "Generate WiFi QR codes instantly with Toollane's free online WiFi QR generator.",


  alternates: {
    canonical: "/wifi-qr-generator",
  },
};

export default function WifiQrGeneratorPage() {
  return (
    <ToolPageLayout
      title="WiFi QR Generator"
      description="Generate WiFi QR codes instantly online."


      href="/wifi-qr-generator"
    >
      <WifiQrGeneratorClient />
    </ToolPageLayout>
  );
}