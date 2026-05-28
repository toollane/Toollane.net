import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RandomNamePickerClient from "./RandomNamePickerClient";

export const metadata: Metadata = {
  title: "Random Name Picker | Toollane",

  description:
    "Pick a random name instantly with Toollane's free online random name picker.",
};

const faqs = [
  {
    question: "What does a random name picker do?",

    answer:

  },

  {
    question: "Who can use a random name picker?",

    answer:
      "Teachers, teams, creators and event organizers can use it for classrooms, raffles, giveaways and group activities.",
  },

  {
    question: "How do I enter names?",

    answer:
      "Enter one name per line, then click the button to randomly pick a name.",
  },
];

export default function RandomNamePickerPage() {
  return (
    <ToolPageLayout
      title="Random Name Picker"
      description="Pick a random name from a list instantly online."


      href="/random-name-picker"
      faqs={faqs}
    >
      <RandomNamePickerClient />
    </ToolPageLayout>
  );
}