import type { Metadata } from "next";
import Link from "next/link";

import FAQSchema from "@/components/FAQSchema";
import HomeToolSearch from "@/components/HomeToolSearch";
import { categories, tools } from "@/data/tools";

export const metadata: Metadata = {
  title: "Free Online Tools for Everyday Tasks | Toollane",
  description:
    "Use free Toollane tools for everyday tasks, PDFs, images, calculators, baby names, real estate, SEO, text, business and developer workflows.",
  alternates: {
    canonical: "https://toollane.net",
  },
  openGraph: {
    title: "Toollane - Free Online Tools",
    description:
      "Free online tools for everyday tasks, PDFs, images, calculators, baby names, real estate, SEO, text and developer workflows.",
    url: "https://toollane.net",
    siteName: "Toollane",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toollane - Free Online Tools",
    description:
      "Free online tools for everyday tasks, PDFs, images, calculators, baby names, real estate, SEO, text and developer workflows.",
  },
};

type Tool = (typeof tools)[number];

type WorkflowCard = {
  title: string;
  description: string;
  href: string;
  label: string;
};

type Principle = {
  title: string;
  description: string;
};

const workflowCards: WorkflowCard[] = [
  {
    title: "Choose a baby name",
    description:
      "Explore girl, boy and unisex names by meaning, origin and style, or use the Baby Name Generator to build a shortlist.",
    href: "/baby-names",
    label: "Open baby name tools",
  },
  {
    title: "Plan a home decision",
    description:
      "Estimate affordability, mortgage payments, closing costs, property taxes, rent vs buy scenarios and rental returns.",
    href: "/real-estate-calculators",
    label: "Open real estate tools",
  },
  {
    title: "Work with files",
    description:
      "Find tools for PDF, image and file workflows such as compressing, converting, resizing, splitting and merging.",
    href: "/tools#all-tools",
    label: "Browse file tools",
  },
  {
    title: "Clean up text or code",
    description:
      "Format, convert, count and transform text, JSON, XML, CSV and developer-friendly content.",
    href: "/tools#all-tools",
    label: "Browse text tools",
  },
  {
    title: "Calculate everyday numbers",
    description:
      "Use calculators for money, business, real estate, time, dates, health and everyday planning.",
    href: "/tools#all-tools",
    label: "Browse calculators",
  },
  {
    title: "Create names and ideas",
    description:
      "Use generators for names, writing ideas, business tasks, creative prompts and practical everyday decisions.",
    href: "/tools#all-tools",
    label: "Browse generators",
  },
];

const qualityPrinciples: Principle[] = [
  {
    title: "Task-first navigation",
    description:
      "Toollane is organized around practical tasks and workflows, not only long lists of tool names.",
  },
  {
    title: "Focused tool pages",
    description:
      "Each tool is designed around a specific job, with inputs, results, explanations and related tools in one place.",
  },
  {
    title: "Useful context",
    description:
      "Tool pages include guidance, examples, notes and limitations so users can better understand the result.",
  },
  {
    title: "No account required",
    description:
      "Toollane tools are built for quick access without forcing users through a signup flow for normal use.",
  },
];

const faqs = [
  {
    question: "What is Toollane?",
    answer:
      "Toollane is a free online tools platform for everyday digital tasks, including calculators, PDF tools, image tools, text tools, developer utilities, baby name tools, real estate calculators and generators.",
  },
  {
    question: "Are Toollane tools free to use?",
    answer:
      "Yes. Toollane tools are designed to be free to use and do not require an account for normal use.",
  },
  {
    question: "How should I find the right tool?",
    answer:
      "You can search for a tool, browse by category or start with a workflow such as baby names, real estate, PDFs, images, calculators or developer utilities.",
  },
  {
    question: "Do Toollane tools work on mobile?",
    answer:
      "Yes. Toollane is designed for phones, tablets and desktop devices, although some file-based tools may be easier to use on larger screens.",
  },
  {
    question: "Are calculator results professional advice?",
    answer:
      "No. Calculator and planning results are estimates based on the values entered. Important financial, legal, tax, medical or business decisions should be checked with a qualified professional.",
  },
];

export default function HomePage() {
  const popularTools = tools.filter((tool) => tool.popular).slice(0, 12);

  return (
    <>
      <FAQSchema faqs={faqs} />

      <main className="min-h-screen bg-[#fff8df] text-black">
        <section className="relative overflow-hidden border-b border-black/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ffe680,_transparent_35%),radial-gradient(circle_at_top_right,_#ffd6e7,_transparent_30%)]" />

          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
            <div className="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur">
              Simple tools. Clear results.
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Free Online Tools for Everyday Tasks
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-black/65 sm:text-xl">
              Toollane helps you complete focused online tasks faster. Search
              for a tool, start with a workflow or browse free tools for PDFs,
              images, calculators, baby names, real estate, SEO, text, business
              and developer work.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-black/60">
                {tools.length} tools
              </span>

              <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-black/60">
                {categories.length} categories
              </span>

              <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-black/60">
                No signup required
              </span>

              <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-black/60">
                Mobile-friendly
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#workflows"
                className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
              >
                Start by workflow
              </a>

              <Link
                href="/tools"
                className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:border-black/20 hover:shadow-sm"
              >
                Browse all tools
              </Link>
            </div>

            <div id="tools" className="mt-10 max-w-5xl">
              <HomeToolSearch />
            </div>
          </div>
        </section>

        <section
          id="workflows"
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
        >
          <div className="mb-8 max-w-3xl">
            <h2 className="text-3xl font-black tracking-tight">
              Start with what you want to do
            </h2>

            <p className="mt-3 text-black/60">
              Toollane is easier to use when you start with the task, not the
              tool name. Choose a workflow below or search directly.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {workflowCards.map((workflow) => (
              <WorkflowCard key={workflow.href} workflow={workflow} />
            ))}
          </div>
        </section>

        <section className="border-y border-black/10 bg-white/40">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-black tracking-tight">
                  Popular Tools
                </h2>

                <p className="mt-3 max-w-2xl text-black/60">
                  Start with commonly used Toollane tools for calculations,
                  documents, text, files, names and everyday productivity.
                </p>
              </div>

              <Link
                href="/tools"
                className="inline-flex rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-bold text-black transition hover:border-black/20 hover:shadow-sm"
              >
                View all tools →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {popularTools.map((tool) => (
                <ToolCard key={tool.href} tool={tool} />
              ))}
            </div>
          </div>
        </section>

        <section
          id="categories"
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
        >
          <h2 className="text-3xl font-black tracking-tight">
            Browse tools by category
          </h2>

          <p className="mt-3 max-w-2xl text-black/60">
            Categories help you find related tools for the same kind of task.
            Use them when you want to explore a full area such as calculators,
            PDF tools, image tools, generators, SEO, text or developer
            utilities.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-black/20 hover:shadow-md"
              >
                <h3 className="text-xl font-bold">{category.name}</h3>

                <p className="mt-3 text-sm leading-6 text-black/60">
                  {category.description}
                </p>

                <div className="mt-5 text-sm font-semibold">
                  Open category →
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-black/10 bg-white/40">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-20">
            <div className="rounded-[2.5rem] border border-black/10 bg-white/80 p-8 shadow-sm sm:p-10">
              <h2 className="text-3xl font-black tracking-tight">
                How Toollane helps
              </h2>

              <p className="mt-4 text-sm leading-7 text-black/60 sm:text-base">
                Toollane is designed for small but important tasks that should
                not require complicated software. Each tool focuses on one job:
                calculate, convert, compress, format, generate, compare or
                prepare something useful.
              </p>

              <div className="mt-8 grid gap-4">
                <StepCard
                  number="1"
                  title="Search or choose a workflow"
                  description="Use search when you know the tool name, or start with a workflow such as baby names, real estate, PDFs, images or calculators."
                />
                <StepCard
                  number="2"
                  title="Use a focused tool page"
                  description="Tool pages include inputs, results, usage guidance, related tools and practical notes in one place."
                />
                <StepCard
                  number="3"
                  title="Review important results"
                  description="Use outputs as helpful results or estimates, then check important calculations, files, names or data before relying on them."
                />
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-black/10 bg-black p-8 text-white shadow-sm sm:p-10">
              <h2 className="text-3xl font-black tracking-tight">
                What Toollane is built for
              </h2>

              <div className="mt-6 space-y-5 text-sm leading-7 text-white/65 sm:text-base">
                <p>
                  Toollane is built for practical browser-based tasks: working
                  with documents, cleaning up text, running calculations,
                  exploring names, preparing web content and comparing everyday
                  options.
                </p>

                <p>
                  The goal is to make common tasks faster without forcing users
                  into a signup flow or a complicated app when a focused web tool
                  is enough.
                </p>

                <p>
                  Some tools provide estimates, transformations or generated
                  ideas. Important financial, legal, tax, medical, business or
                  family decisions should always be reviewed carefully.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight">
              Why use Toollane?
            </h2>

            <p className="mt-3 max-w-3xl text-black/60">
              Toollane is not meant to be a random list of utilities. The site
              is organized around clear tasks, useful categories and practical
              workflows.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {qualityPrinciples.map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm"
              >
                <h3 className="text-lg font-black">{item.title}</h3>

                <p className="mt-3 text-sm leading-7 text-black/60">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-black/10 bg-white/40">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="rounded-[2.5rem] border border-black/10 bg-white/80 p-8 shadow-sm backdrop-blur sm:p-12">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                A practical online toolbox
              </h2>

              <div className="mt-8 space-y-6 text-black/65 leading-8">
                <p>
                  Toollane brings together free online tools for everyday
                  digital tasks. Instead of switching between many small
                  websites, users can search once, open a focused tool and
                  complete a specific task directly in the browser.
                </p>

                <p>
                  The platform includes tools for calculations, real estate
                  planning, baby name discovery, PDF workflows, image tasks,
                  text formatting, developer utilities, SEO preparation,
                  business tasks and creative generators.
                </p>

                <p>
                  File tools, calculators and generators all have different use
                  cases. A compressed file should be checked before reuse, a
                  calculator result should be treated as an estimate, and a
                  generated name or idea should be reviewed in context.
                </p>

                <div className="pt-2">
                  <Link
                    href="/tools"
                    className="inline-flex rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                  >
                    Explore all Toollane tools →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="text-3xl font-black tracking-tight">
            Frequently asked questions
          </h2>

          <div className="mt-8 grid gap-4">
            {faqs.map((item) => (
              <div
                key={item.question}
                className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm"
              >
                <h3 className="text-lg font-black">{item.question}</h3>

                <p className="mt-3 text-sm leading-7 text-black/60">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

function WorkflowCard({ workflow }: { workflow: WorkflowCard }) {
  return (
    <Link
      href={workflow.href}
      className="group rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-black/20 hover:shadow-lg"
    >
      <h3 className="text-xl font-black tracking-tight text-black">
        {workflow.title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-black/60">
        {workflow.description}
      </p>

      <div className="mt-5 text-sm font-bold text-black">
        {workflow.label}{" "}
        <span className="inline-block transition group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      className="group rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-black/20 hover:shadow-lg"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
        {tool.icon}
      </div>

      <h3 className="text-lg font-bold group-hover:underline">{tool.name}</h3>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/60">
        {tool.description}
      </p>

      <div className="mt-5 text-sm font-semibold text-black">Open Tool →</div>
    </Link>
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