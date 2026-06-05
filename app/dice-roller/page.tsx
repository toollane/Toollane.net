import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import DiceRollerClient from "./DiceRollerClient";

export const metadata: Metadata = {
  title: "Dice Roller | Toollane",

  description:
    "Roll a virtual dice instantly with Toollane's free online dice roller.",
};

export default function DiceRollerPage() {
  return (
    <ToolPageLayout
      title="Dice Roller"
      description="Roll a virtual dice instantly online."


      href="/dice-roller"
    >
      <DiceRollerClient />
    </ToolPageLayout>
  );
}