import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ListSorterClient from "./ListSorterClient";

export const metadata: Metadata = {
  title: "List Sorter | Toollane",

  description:
    "Sort lists alphabetically online with Toollane's free list sorter.",
};

export default function ListSorterPage() {
  return (
    <ToolPageLayout
      title="List Sorter"
      description="Sort lists alphabetically online."


      href="/list-sorter"
    >
      <ListSorterClient />
    </ToolPageLayout>
  );
}