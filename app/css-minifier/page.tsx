import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CssMinifierClient from "./CssMinifierClient";

export const metadata: Metadata = {
  title:
    "CSS Minifier | Toollane",

  description:
    "Minify CSS instantly with Toollane's free online CSS minifier.",
};

const faqs = [
  {
    question:
      "What does a CSS minifier do?",

    answer:

  },

  {
    question:
      "Why minify CSS?",

    answer:

  },

  {
    question:
      "Who uses CSS minifiers?",

    answer:
      "Developers, designers and website owners use CSS minifiers to optimize stylesheets.",
  },
];

export default function CssMinifierPage() {
  return (
    <ToolPageLayout
      title="CSS Minifier"
      description="Minify CSS code instantly online."


      href="/css-minifier"
      faqs={faqs}
    >
      <CssMinifierClient />
    </ToolPageLayout>
  );
}