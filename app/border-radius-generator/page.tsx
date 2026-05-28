import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import BorderRadiusGeneratorClient from "./BorderRadiusGeneratorClient";

export const metadata: Metadata = {
  title: "CSS Border Radius Generator | Toollane",
  description:
    "Create CSS border radius values visually with Toollane's free online border radius generator.",
};

const faqs = [
  {
    question: "What is a border radius generator?",
    answer:

  },
  {
    question: "Can I set each corner separately?",
    answer:
      "Yes. You can adjust top left, top right, bottom right and bottom left values.",
  },
  {
    question: "Who uses border radius generators?",
    answer:
      "Web designers and developers use them to style cards, buttons, images and layouts.",
  },
];

export default function BorderRadiusGeneratorPage() {
  return (
    <ToolPageLayout
      title="CSS Border Radius Generator"
      description="Create rounded corners visually and copy CSS instantly."


      href="/border-radius-generator"
      faqs={faqs}
    >
      <BorderRadiusGeneratorClient />
    </ToolPageLayout>
  );
}