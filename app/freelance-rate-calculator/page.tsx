import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import FreelanceRateCalculatorClient from "./FreelanceRateCalculatorClient";

export const metadata: Metadata = {
  title: "Freelance Rate Calculator | Toollane",

  description:
    "Calculate your freelance hourly rate, monthly revenue target and annual revenue goal with Toollane's free online calculator.",
};

const faqs = [
  {
    question: "How do you calculate a freelance hourly rate?",

    answer:
      "A freelance hourly rate can be estimated by adding your income goal and business costs, then dividing by annual billable hours.",
  },

  {
    question: "Why use billable hours instead of total working hours?",

    answer:
      "Freelancers often spend time on admin, marketing and unpaid work, so billable hours are usually lower than total working hours.",
  },

  {
    question: "Can I use different currencies?",

    answer:
      "Yes. You can choose common currencies such as USD, EUR, GBP, CAD and AUD.",
  },
];

export default function FreelanceRateCalculatorPage() {
  return (
    <ToolPageLayout
      title="Freelance Rate Calculator"
      description="Calculate your hourly freelance rate and revenue target instantly online."


      href="/freelance-rate-calculator"
      faqs={faqs}
    >
      <FreelanceRateCalculatorClient />
    </ToolPageLayout>
  );
}