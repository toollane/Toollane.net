import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PomodoroTimerClient from "./PomodoroTimerClient";

export const metadata: Metadata = {
  title: "Pomodoro Timer | Toollane",

  description:
    "Use a free online Pomodoro timer for focus, productivity, studying and work sessions.",
};

const faqs = [
  {
    question: "What is a Pomodoro timer?",

    answer:

  },

  {
    question: "How does the Pomodoro technique work?",

    answer:

  },

  {
    question: "Who can use a Pomodoro timer?",

    answer:
      "Students, workers, creators and anyone who wants to improve focus can use a Pomodoro timer.",
  },
];

export default function PomodoroTimerPage() {
  return (
    <ToolPageLayout
      title="Pomodoro Timer"
      description="Use a free online Pomodoro timer for focus and productivity."


      href="/pomodoro-timer"
      faqs={faqs}
    >
      <PomodoroTimerClient />
    </ToolPageLayout>
  );
}