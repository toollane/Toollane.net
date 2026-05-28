import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import DiceRollerClient from "./DiceRollerClient";

export const metadata: Metadata = {
  title: "Dice Roller | Toollane",

  description:
    "Roll a virtual dice instantly with Toollane's free online dice roller.",
};

const faqs = [
  {
    question: "What does a dice roller do?",

    answer:

  },

  {
    question: "Can I choose the number of sides?",

    answer:
      "Yes. You can enter the number of sides, such as 6, 10, 12 or 20.",
  },

  {
    question: "Why use an online dice roller?",

    answer:
      "It is useful for games, classrooms, random decisions and quick simulations.",
  },
];

export default function DiceRollerPage() {
  return (
    <ToolPageLayout
      title="Dice Roller"
      description="Roll a virtual dice instantly online."


      href="/dice-roller"
      faqs={faqs}
    >
      <DiceRollerClient />
    </ToolPageLayout>
  );
}