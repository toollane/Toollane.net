import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import JsonMinifierClient from "./JsonMinifierClient";

export const metadata: Metadata = {
  title: "JSON Minifier | Toollane",

  description:
    "Minify JSON instantly with Toollane's free online JSON minifier.",
};

const faqs = [
  {
    question: "What does a JSON minifier do?",

    answer:
      "A JSON minifier removes unnecessary spaces, indentation and line breaks from JSON.",
  },

  {
    question: "Does minifying JSON change the data?",

    answer:

  },

  {
    question: "Why use a JSON minifier?",

    answer:
      "It helps reduce JSON size for APIs, storage, configuration files and web projects.",
  },
];

export default function JsonMinifierPage() {
  return (
    <ToolPageLayout
      title="JSON Minifier"
      description="Minify JSON instantly online."


      href="/json-minifier"
      faqs={faqs}
    >
      <JsonMinifierClient />
    </ToolPageLayout>
  );
}