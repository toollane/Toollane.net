import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CssMinifierClient from "./CssMinifierClient";

export const metadata: Metadata = {
  title:
    "CSS Minifier | Toollane",

  description:
    "Minify CSS instantly with Toollane's free online CSS minifier.",
};

export default function CssMinifierPage() {
  return (
    <ToolPageLayout
      title="CSS Minifier"
      description="Minify CSS code instantly online."


      href="/css-minifier"
    >
      <CssMinifierClient />
    </ToolPageLayout>
  );
}