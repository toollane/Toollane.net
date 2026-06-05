import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PomodoroTimerClient from "./PomodoroTimerClient";

export const metadata: Metadata = {
  title: "Pomodoro Timer | Toollane",

  description:
    "Use a free online Pomodoro timer for focus, productivity, studying and work sessions.",
};

export default function PomodoroTimerPage() {
  return (
    <ToolPageLayout
      title="Pomodoro Timer"
      description="Use a free online Pomodoro timer for focus and productivity."


      href="/pomodoro-timer"
    >
      <PomodoroTimerClient />
    </ToolPageLayout>
  );
}