import type { Metadata } from "next";
import Link from "next/link";

import FAQSchema from "@/components/FAQSchema";
import HomeToolSearch from "@/components/HomeToolSearch";
import { categories, tools } from "@/data/tools";

export const metadata: Metadata = {
  title: "All Free Online Tools | Toollane",
  description:
    "Browse free Toollane tools by task, category and workflow. Find calculators, PDF tools, image tools, SEO tools, text tools, developer utilities and generators.",
  alternates: {
    canonical: "https://toollane.net/tools",
  },
  openGraph: {
    title: "All Free Online Tools | Toollane",
    description:
      "Browse free Toollane tools by task, category and workflow. Find calculators, PDF tools, image tools, SEO tools, text tools, developer utilities and generators.",
    url: "https://toollane.net/tools",
    siteName: "Toollane",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Free Online Tools | Toollane",
    description:
      "Browse free Toollane tools by task, category and workflow. Find calculators, PDF tools, image tools, SEO tools, text tools, developer utilities and generators.",
  },
};

type Tool = (typeof tools)[number];

type WorkflowCard = {
  title: string;
  description: string;
  href: string;
  label: string;
};

const workflowCards: WorkflowCard[] = [
  {
    title: "Choose a baby name",
    description:
      "Use the Baby Name Generator and curated baby name collections to explore names by gender, meaning, origin and style.",
    href: "/baby-names",
    label: "Open name tools",
  },
  {
    title: "Plan a home decision",
    description:
      "Estimate affordability, mortgage payments, closing costs, property taxes and rent vs buy scenarios.",
    href: "/real-estate-calculators",
    label: "Open real estate tools",
  },
  {
    title: "Work with PDF files",
    description:
      "Compress, merge, split or convert PDF files directly in your browser with focused document tools.",
    href: "/category/pdf-tools",
    label: "Open PDF tools",
  },
  {
    title: "Optimize images",
    description:
      "Resize, compress, crop or convert images for websites, uploads, documents and everyday use.",
    href: "/category/image-tools",
    label: "Open image tools",
  },
  {
    title: "Clean up text or code",
    description:
      "Format, convert, count, clean and transform text, JSON, XML, CSV and developer-friendly content.",
    href: "/category/developer-tools",
    label: "Open developer tools",
  },
  {
    title: "Calculate everyday numbers",
    description:
      "Use practical calculators for finance, business, health, time, real estate and daily planning.",
    href: "/category/calculators",
    label: "Open calculators",
  },
];

const faqs = [
  {
    question: "What can I find on the Toollane tools page?",
    answer:
      "The tools page helps you find free Toollane tools by task, workflow and category, including calculators, PDF tools, image tools, text tools, developer tools, SEO tools and generators.",
  },
  {
    question: "Are Toollane tools free?",
    answer:
      "Yes. Toollane tools are designed to be free to use and do not require an account for normal use.",
  },
  {
    question: "How should I choose the right tool?",
    answer:
      "Start with the task you want to complete. You can search directly, open a workflow such as baby names or real estate, or browse tools by category.",
  },
  {
    question: "Can I use Toollane tools on mobile?",
    answer:
      "Yes. Toollane is designed for phones, tablets and desktop devices, although some file tools may be easier to use on larger screens.",
  },
];

function getToolsByCategory(categorySlug: string) {
  return tools
    .filter((tool) => tool.categorySlug === categorySlug)
    .sort((a, b) => {
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;

      return a.name.localeCompare(b.name);
    });
}

export default function ToolsPage() {
  const popularTools = tools.filter((tool) => tool.popular).slice(0, 12);

  return (
    <>
      <FAQSchema faqs={faqs} />

      <main className="min-h-screen bg-[#fff8df] text-black">
        <section className="relative overflow-hidden border-b border-black/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ffe680,_transparent_35%),radial-gradient(circle_at_top_right,_#ffd6e7,_transparent_30%)]" />

          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
            <div className="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur">
              Toollane Directory
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              All Free Online Tools
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-black/65 sm:text-xl">
              Find the right Toollane tool by task, workflow or category. Search
              for a tool, start with a common workflow, or browse calculators,
              PDF tools, image tools, text tools, developer utilities and
              generators.
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

              <a
                href="#all-categories"
                className="rounded-2xl border border-black/10 bg-white/80 px-6 py-4 text-sm font-bold text-black transition hover:border-black"
              >
                Browse categories
              </a>
            </div>

            <div className="mt-10 max-w-5xl">
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
              Toollane is organized around practical tasks. Choose a workflow if
              you know the result you want, or use search when you already know
              the tool name.
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
                  Start with commonly used tools for documents, calculations,
                  search, text, files and everyday productivity.
                </p>
              </div>

              <a
                href="#all-tools"
                className="inline-flex rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-bold text-black transition hover:border-black/20 hover:shadow-sm"
              >
                View all tools →
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {popularTools.map((tool) => (
                <ToolCard key={tool.href} tool={tool} />
              ))}
            </div>
          </div>
        </section>

        <section
          id="all-categories"
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight">
              Browse tools by category
            </h2>

            <p className="mt-3 max-w-3xl text-black/60">
              Categories group related tools by purpose. Use them when you want
              to explore a full area such as calculators, PDF tools, image
              tools, SEO tools, text tools, business tools, generators or
              developer utilities.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const categoryTools = getToolsByCategory(category.slug);

              return (
                <a
                  key={category.slug}
                  href={`#${category.slug}`}
                  className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-black/20 hover:shadow-md"
                >
                  <h3 className="text-xl font-bold">{category.name}</h3>

                  <p className="mt-3 text-sm leading-6 text-black/60">
                    {category.description}
                  </p>

                  <div className="mt-5 text-sm font-semibold">
                    {categoryTools.length} tools →
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <section className="border-y border-black/10 bg-white/40">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-16">
            <div className="rounded-[2.5rem] border border-black/10 bg-white/80 p-8 shadow-sm sm:p-10">
              <h2 className="text-3xl font-black tracking-tight">
                How to use Toollane
              </h2>

              <div className="mt-8 grid gap-4">
                <StepCard
                  number="1"
                  title="Search or choose a workflow"
                  description="Use the search bar when you know the tool you need, or start from a workflow such as baby names, real estate, PDFs or images."
                />
                <StepCard
                  number="2"
                  title="Open a focused tool"
                  description="Each tool is designed around one practical task, with inputs, results and guidance on the same page."
                />
                <StepCard
                  number="3"
                  title="Review the result"
                  description="Use results as helpful output, then check important calculations, file changes, names or data before relying on them."
                />
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-black/10 bg-black p-8 text-white shadow-sm sm:p-10">
              <h2 className="text-3xl font-black tracking-tight">
                What Toollane is built for
              </h2>

              <div className="mt-6 space-y-5 text-sm leading-7 text-white/65 sm:text-base">
                <p>
                  Toollane is built for fast browser-based tasks: calculating,
                  formatting, compressing, converting, generating and comparing.
                </p>

                <p>
                  The goal is to help users complete small but important tasks
                  without signing up, installing software or switching between
                  many different websites.
                </p>

                <p>
                  For important financial, legal, medical or business decisions,
                  Toollane results should be treated as estimates or working
                  outputs, not professional advice.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="all-tools"
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-black tracking-tight">
              All tools by category
            </h2>

            <p className="mt-3 max-w-3xl text-black/60">
              Every tool below links to a dedicated page with a focused
              workflow, explanation, related tools and practical guidance.
            </p>
          </div>

          <div className="grid gap-12">
            {categories.map((category) => {
              const categoryTools = getToolsByCategory(category.slug);

              if (!categoryTools.length) {
                return null;
              }

              return (
                <section
                  key={category.slug}
                  id={category.slug}
                  className="scroll-mt-24"
                >
                  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight">
                        {category.name}
                      </h3>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">
                        {category.description}
                      </p>
                    </div>

                    <Link
                      href={`/category/${category.slug}`}
                      className="inline-flex rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-bold text-black transition hover:border-black/20 hover:shadow-sm"
                    >
                      Open category →
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {categoryTools.map((tool) => (
                      <ToolCard key={tool.href} tool={tool} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        <section className="border-t border-black/10 bg-white/40">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
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