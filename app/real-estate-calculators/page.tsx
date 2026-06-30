import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Real Estate Calculators | Mortgage & Home Buying Tools",
  description:
    "Use free real estate calculators to plan home affordability, mortgage payments, closing costs, property tax, rent vs buy decisions, refinancing and rental property returns.",
  alternates: {
    canonical: "https://toollane.net/real-estate-calculators",
  },
};

type HubTool = {
  name: string;
  description: string;
  href: string;
  badge: string;
};

type ToolGroup = {
  title: string;
  description: string;
  tools: HubTool[];
};

type PathItem = {
  title: string;
  description: string;
  steps: {
    label: string;
    href: string;
  }[];
};

type DecisionCard = {
  title: string;
  question: string;
  description: string;
  href: string;
  label: string;
};

const toolGroups: ToolGroup[] = [
  {
    title: "Plan your home budget",
    description:
      "Start with affordability and savings calculators before comparing mortgage payments or buying costs.",
    tools: [
      {
        name: "Home Affordability Calculator",
        description:
          "Estimate how much house you can afford based on income, debts, down payment, mortgage rate and DTI limits.",
        href: "/home-affordability-calculator",
        badge: "Budget",
      },
      {
        name: "Down Payment Calculator",
        description:
          "Calculate your target down payment, total cash needed, savings gap and estimated time to reach your goal.",
        href: "/down-payment-calculator",
        badge: "Savings",
      },
    ],
  },
  {
    title: "Estimate buying costs",
    description:
      "Estimate mortgage payments, closing costs and property taxes before making a home buying decision.",
    tools: [
      {
        name: "Mortgage Calculator",
        description:
          "Calculate monthly mortgage payments and total interest based on loan amount, rate and term.",
        href: "/mortgage-calculator",
        badge: "Mortgage",
      },
      {
        name: "Closing Cost Calculator",
        description:
          "Estimate buyer closing costs, prepaid taxes, insurance reserves, lender fees and cash needed to close.",
        href: "/closing-cost-calculator",
        badge: "Closing",
      },
      {
        name: "Property Tax Calculator",
        description:
          "Estimate annual property tax, monthly tax cost, effective tax rate and projected property taxes.",
        href: "/property-tax-calculator",
        badge: "Taxes",
      },
    ],
  },
  {
    title: "Compare mortgage options",
    description:
      "Compare loan offers, payment schedules, interest costs and long-term amortization.",
    tools: [
      {
        name: "Mortgage Comparison Calculator",
        description:
          "Compare mortgage options by monthly payment, interest rate, upfront costs and estimated ownership-period cost.",
        href: "/mortgage-comparison-calculator",
        badge: "Compare",
      },
      {
        name: "Amortization Calculator",
        description:
          "Calculate monthly loan payments, total interest, payoff date and an annual amortization schedule.",
        href: "/amortization-calculator",
        badge: "Schedule",
      },
    ],
  },
  {
    title: "Decide whether to rent or buy",
    description:
      "Compare renting with buying by looking at long-term costs, equity, rent growth and investment assumptions.",
    tools: [
      {
        name: "Rent vs Buy Calculator",
        description:
          "Compare the long-term cost of renting vs buying a home, including mortgage payments, rent growth and home equity.",
        href: "/rent-vs-buy-calculator",
        badge: "Decision",
      },
    ],
  },
  {
    title: "Optimize an existing mortgage",
    description:
      "Estimate whether refinancing or extra payments could reduce your interest cost or shorten your loan.",
    tools: [
      {
        name: "Mortgage Refinance Calculator",
        description:
          "Compare your current mortgage with a refinance option and estimate savings, break-even time and refinance costs.",
        href: "/mortgage-refinance-calculator",
        badge: "Refinance",
      },
      {
        name: "Mortgage Payoff Calculator",
        description:
          "Calculate how extra mortgage payments can shorten your loan, reduce interest and help you pay off faster.",
        href: "/mortgage-payoff-calculator",
        badge: "Payoff",
      },
    ],
  },
  {
    title: "Analyze investment property",
    description:
      "Estimate rental income, operating expenses, cash flow and investment returns for a rental property.",
    tools: [
      {
        name: "Rental Property Calculator",
        description:
          "Estimate rental property cash flow, cap rate, cash-on-cash return, net operating income and break-even rent.",
        href: "/rental-property-calculator",
        badge: "Investing",
      },
    ],
  },
];

const decisionCards: DecisionCard[] = [
  {
    title: "Buying power",
    question: "Can I afford this home?",
    description:
      "Start with income, monthly debts, down payment and estimated mortgage rate before looking at a specific property.",
    href: "/home-affordability-calculator",
    label: "Check affordability",
  },
  {
    title: "Monthly payment",
    question: "What would the mortgage cost each month?",
    description:
      "Estimate principal, interest and the long-term impact of loan amount, rate and term.",
    href: "/mortgage-calculator",
    label: "Estimate payment",
  },
  {
    title: "Cash needed",
    question: "How much money do I need before closing?",
    description:
      "Compare your down payment target with estimated closing costs, prepaid costs and savings gap.",
    href: "/closing-cost-calculator",
    label: "Estimate cash to close",
  },
  {
    title: "Rent or buy",
    question: "Is buying better than renting?",
    description:
      "Compare ownership costs, rent growth, home equity and time horizon before assuming buying is always better.",
    href: "/rent-vs-buy-calculator",
    label: "Compare rent vs buy",
  },
];

const paths: PathItem[] = [
  {
    title: "First-time home buyer",
    description:
      "Start with affordability, estimate your down payment, then calculate mortgage payments and closing costs.",
    steps: [
      {
        label: "Home Affordability",
        href: "/home-affordability-calculator",
      },
      {
        label: "Down Payment",
        href: "/down-payment-calculator",
      },
      {
        label: "Mortgage",
        href: "/mortgage-calculator",
      },
      {
        label: "Closing Costs",
        href: "/closing-cost-calculator",
      },
    ],
  },
  {
    title: "Compare buying vs renting",
    description:
      "Estimate affordability first, then compare the long-term financial difference between renting and buying.",
    steps: [
      {
        label: "Home Affordability",
        href: "/home-affordability-calculator",
      },
      {
        label: "Rent vs Buy",
        href: "/rent-vs-buy-calculator",
      },
      {
        label: "Property Tax",
        href: "/property-tax-calculator",
      },
    ],
  },
  {
    title: "Existing homeowner",
    description:
      "Use refinance and payoff calculators to estimate whether changing your mortgage strategy could save money.",
    steps: [
      {
        label: "Refinance",
        href: "/mortgage-refinance-calculator",
      },
      {
        label: "Mortgage Payoff",
        href: "/mortgage-payoff-calculator",
      },
      {
        label: "Amortization",
        href: "/amortization-calculator",
      },
    ],
  },
  {
    title: "Rental property investor",
    description:
      "Estimate mortgage payments, property taxes and rental property returns before comparing investment assumptions.",
    steps: [
      {
        label: "Mortgage",
        href: "/mortgage-calculator",
      },
      {
        label: "Property Tax",
        href: "/property-tax-calculator",
      },
      {
        label: "Rental Property",
        href: "/rental-property-calculator",
      },
    ],
  },
];

const faqs = [
  {
    question: "What can I calculate with these real estate calculators?",
    answer:
      "You can estimate home affordability, mortgage payments, closing costs, property taxes, rent vs buy scenarios, refinance savings, mortgage payoff timelines, amortization schedules and rental property returns.",
  },
  {
    question: "Which calculator should I start with?",
    answer:
      "If you are buying a home, start with the Home Affordability Calculator and Down Payment Calculator. If you already know the price and loan amount, start with the Mortgage Calculator.",
  },
  {
    question: "Are these real estate calculators exact?",
    answer:
      "No. They provide estimates based on your inputs. Actual costs can vary by lender, location, tax rules, insurance, market conditions, closing costs and personal financial situation.",
  },
  {
    question: "Do these calculators replace professional advice?",
    answer:
      "No. These calculators are for planning and comparison only. For financial, mortgage, tax, legal or investment decisions, consider speaking with a qualified professional.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function RealEstateCalculatorsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <section className="overflow-hidden rounded-[2rem] border border-black/10 bg-[#fff8df] p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="max-w-4xl">
          <div className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-black/60">
            Real estate tools
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-black sm:text-5xl lg:text-6xl">
            Real Estate Calculators
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-black/65 sm:text-lg">
            Plan real estate decisions step by step. Estimate what you can
            afford, compare mortgage payments, review buying costs, test rent vs
            buy scenarios and analyze rental property assumptions before making
            a bigger financial decision.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <HeroStat label="Start with" value="Budget" />
            <HeroStat label="Compare" value="Scenarios" />
            <HeroStat label="Use for" value="Planning" />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/home-affordability-calculator"
              className="rounded-2xl bg-black px-6 py-4 text-center text-sm font-bold text-white transition hover:opacity-90"
            >
              Start with Affordability
            </Link>

            <Link
              href="/mortgage-calculator"
              className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-center text-sm font-bold text-black transition hover:border-black"
            >
              Open Mortgage Calculator
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-black tracking-tight text-black">
            Start with the real estate question you need to answer
          </h2>

          <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
            A calculator is most useful when it answers a specific decision.
            Choose the question that matches your situation, then compare a few
            realistic scenarios instead of relying on a single estimate.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {decisionCards.map((card) => (
            <DecisionQuestionCard key={card.href} card={card} />
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-black">
            Choose a real estate calculator
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-black/60 sm:text-base">
            Use the calculators below in the order that matches your real estate
            decision. Start with affordability and buying costs, then compare
            mortgage options, rent vs buy scenarios or investment property
            returns.
          </p>
        </div>

        <div className="grid gap-6">
          {toolGroups.map((group) => (
            <section
              key={group.title}
              className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="max-w-3xl">
                <h3 className="text-xl font-black tracking-tight text-black">
                  {group.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-black/60">
                  {group.description}
                </p>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.tools.map((tool) => (
                  <ToolCard key={tool.href} tool={tool} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-black/10 bg-[#fff8df] p-5 shadow-sm sm:p-6">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-black tracking-tight text-black">
            What to compare before making a real estate decision
          </h2>

          <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
            Real estate decisions are rarely about one number. A low monthly
            payment can still come with high closing costs, property taxes,
            repairs or long-term interest. Use these checks to compare the full
            picture.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <PlanningCard
            title="Monthly payment"
            description="Compare principal, interest, estimated taxes, insurance and other recurring costs."
          />
          <PlanningCard
            title="Cash needed upfront"
            description="Look beyond the down payment. Closing costs, prepaid taxes, insurance and reserves can change the true cash requirement."
          />
          <PlanningCard
            title="Interest over time"
            description="A lower payment is not always cheaper if the loan lasts longer or carries higher total interest."
          />
          <PlanningCard
            title="Time horizon"
            description="The better option may change if you plan to move in three years versus staying for ten or more years."
          />
          <PlanningCard
            title="Risk and flexibility"
            description="Consider job stability, emergency savings, maintenance costs and whether the payment leaves room for other goals."
          />
          <PlanningCard
            title="Local assumptions"
            description="Taxes, insurance, closing costs, rent growth and property expenses can vary widely by location."
          />
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-black tracking-tight text-black">
            Suggested calculator paths
          </h2>

          <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
            Not sure where to start? Choose the path that best matches your
            current real estate goal.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {paths.map((path) => (
            <div
              key={path.title}
              className="rounded-2xl border border-black/10 bg-[#fff8df] p-5"
            >
              <h3 className="text-lg font-black text-black">{path.title}</h3>

              <p className="mt-2 text-sm leading-6 text-black/60">
                {path.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {path.steps.map((step, index) => (
                  <Link
                    key={step.href}
                    href={step.href}
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-black transition hover:border-black"
                  >
                    {index + 1}. {step.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-2xl font-black tracking-tight text-black">
            How to use these real estate calculators
          </h2>

          <div className="mt-5 grid gap-4">
            <StepCard
              number="1"
              title="Start with your goal"
              description="Choose whether you are buying a home, comparing rent vs buy, refinancing, paying off a mortgage or analyzing a rental property."
            />

            <StepCard
              number="2"
              title="Enter realistic assumptions"
              description="Use realistic numbers for income, debts, mortgage rates, taxes, insurance, closing costs, rent, vacancy or maintenance."
            />

            <StepCard
              number="3"
              title="Compare multiple scenarios"
              description="Change one assumption at a time to understand how rates, down payments, taxes or expenses affect the result."
            />

            <StepCard
              number="4"
              title="Use results as estimates"
              description="Treat calculator results as planning estimates, not as financial, tax, legal, mortgage or investment advice."
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-black p-5 text-white shadow-sm sm:p-6">
          <h2 className="text-2xl font-black tracking-tight">
            Popular starting points
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/60">
            These tools are often the best first step for home buyers,
            homeowners and real estate investors.
          </p>

          <div className="mt-6 grid gap-3">
            <DarkLink
              href="/home-affordability-calculator"
              label="Home Affordability Calculator"
            />
            <DarkLink
              href="/mortgage-calculator"
              label="Mortgage Calculator"
            />
            <DarkLink
              href="/rent-vs-buy-calculator"
              label="Rent vs Buy Calculator"
            />
            <DarkLink
              href="/rental-property-calculator"
              label="Rental Property Calculator"
            />
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-black tracking-tight text-black">
            Common input mistakes to avoid
          </h2>

          <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
            Small input changes can create very different results. Before using
            an estimate for planning, review the assumptions that usually move
            real estate calculations the most.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <MistakeCard
            title="Using only the listing price"
            description="The purchase price is only one part of the decision. Taxes, insurance, loan costs, repairs and closing costs can change the real budget."
          />
          <MistakeCard
            title="Ignoring interest-rate changes"
            description="Mortgage rates can strongly affect affordability and monthly payments. Compare more than one rate scenario."
          />
          <MistakeCard
            title="Forgetting ongoing costs"
            description="Maintenance, insurance, HOA fees, vacancy, utilities and property tax increases can matter after the purchase."
          />
          <MistakeCard
            title="Treating estimates as guarantees"
            description="Calculator results depend on your inputs. Actual loan terms, taxes, fees and investment returns can differ."
          />
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-2xl font-black tracking-tight text-black">
          Frequently asked questions
        </h2>

        <div className="mt-6 grid gap-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-black/10 bg-white p-5"
            >
              <h3 className="text-base font-black text-black">
                {faq.question}
              </h3>

              <p className="mt-2 text-sm leading-7 text-black/60">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-black/10 bg-[#fff8df] p-5 sm:p-6">
        <h2 className="text-xl font-black tracking-tight text-black">
          Real estate calculator disclaimer
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/65">
          Toollane real estate calculators provide estimates for planning and
          comparison only. Actual costs, payments, taxes, insurance, returns,
          loan terms and investment results can vary by lender, location,
          market conditions, property type and personal financial situation.
          These tools do not provide financial, tax, legal, mortgage or
          investment advice.
        </p>
      </section>
    </main>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-2xl font-black text-black">{value}</div>
    </div>
  );
}

function DecisionQuestionCard({ card }: { card: DecisionCard }) {
  return (
    <Link
      href={card.href}
      className="group rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-black hover:shadow-md"
    >
      <div className="inline-flex rounded-full border border-black/10 bg-[#fff8df] px-3 py-1 text-xs font-bold text-black/60">
        {card.title}
      </div>

      <h3 className="mt-4 text-lg font-black tracking-tight text-black">
        {card.question}
      </h3>

      <p className="mt-2 text-sm leading-6 text-black/60">
        {card.description}
      </p>

      <div className="mt-4 text-sm font-bold text-black">
        {card.label}{" "}
        <span className="inline-block transition group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}

function ToolCard({ tool }: { tool: HubTool }) {
  return (
    <Link
      href={tool.href}
      className="group rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-black hover:shadow-md"
    >
      <div className="inline-flex rounded-full border border-black/10 bg-[#fff8df] px-3 py-1 text-xs font-bold text-black/60">
        {tool.badge}
      </div>

      <h4 className="mt-4 text-lg font-black tracking-tight text-black">
        {tool.name}
      </h4>

      <p className="mt-2 text-sm leading-6 text-black/60">
        {tool.description}
      </p>

      <div className="mt-4 text-sm font-bold text-black">
        Open calculator{" "}
        <span className="inline-block transition group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}

function PlanningCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <h3 className="text-base font-black text-black">{title}</h3>

      <p className="mt-2 text-sm leading-7 text-black/60">{description}</p>
    </div>
  );
}

function MistakeCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[#fff8df] p-5">
      <h3 className="text-base font-black text-black">{title}</h3>

      <p className="mt-2 text-sm leading-7 text-black/60">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-sm font-black text-white">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-black text-black">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-black/60">{description}</p>
      </div>
    </div>
  );
}

function DarkLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-black"
    >
      {label} →
    </Link>
  );
}