import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ListSorterClient from "./ListSorterClient";

export const metadata: Metadata = {
  title: "List Sorter | Toollane",

  description:
    "Sort lists alphabetically online with Toollane's free list sorter.",
};

const faqs = [
  {
    question: "What does a list sorter do?",

    answer:

  },

  {
    question: "What can I sort with this tool?",

    answer:
      "You can sort names, words, product lists, tasks, keywords or any line-based text.",
  },

  {
    question: "How should I enter my list?",

    answer:

  },
];

export default function ListSorterPage() {
  return (
    <ToolPageLayout
      title="List Sorter"
      description="Sort lists alphabetically online."


      href="/list-sorter"
      faqs={faqs}
    >
      <ListSorterClient />
    </ToolPageLayout>
  );
}