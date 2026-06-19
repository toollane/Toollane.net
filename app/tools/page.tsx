import type { Metadata } from "next";
import Link from "next/link";

import FAQSchema from "@/components/FAQSchema";
import HomeToolSearch from "@/components/HomeToolSearch";
import { categories, tools } from "@/data/tools";

export const metadata: Metadata = {
  title: "All Free Online Tools | Toollane",
  description:
    "Browse all free Toollane tools for SEO, PDFs, images, calculators, business, developers, text, generators and everyday productivity.",
  alternates: {
    canonical: "https://toollane.net/tools",
  },
  openGraph: {
    title: "All Free Online Tools | Toollane",
    description:
      "Browse all free Toollane tools for SEO, PDFs, images, calculators, business, developers, text, generators and everyday productivity.",
    url: "https://toollane.net/tools",
    siteName: "Toollane",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Free Online Tools | Toollane",
    description:
      "Browse all free Toollane tools for SEO, PDFs, images, calculators, business, developers, text, generators and everyday productivity.",
  },
};

const faqs = [
  {
    question: "What can I find on the Toollane tools page?",
    answer:
      "The tools page lists Toollane's free online tools by category, including calculators, SEO tools, PDF tools, image tools, business tools, text tools, developer tools and generators.",
  },
  {
    question: "Are all Toollane tools free?",
    answer:
      "Yes. Toollane tools are designed to be free to use without requiring an account.",
  },
  {
    question: "How are Toollane tools organized?",
    answer:
      "Tools are grouped by category so users can quickly find related tools for the same task or workflow.",
  },
  {
    question: "Can I use Toollane tools on mobile?",
    answer:
      "Yes. Toollane is designed to work on phones, tablets and desktop devices.",
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
              Browse every Toollane tool in one place. Find free online tools
              for SEO, PDFs, images, calculators, business, developers, text,
              generators and everyday productivity.
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
                href="#all-categories"
                className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
              >
                Browse categories
              </a>

              <Link
                href="/"
                className="rounded-2xl border border-black/10 bg-white/80 px-6 py-4 text-sm font-bold text-black transition hover:border-black"
              >
                Back to homepage
              </Link>
            </div>

            <div className="mt-10 max-w-5xl">
              <HomeToolSearch />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                Popular Tools
              </h2>

              <p className="mt-3 max-w-2xl text-black/60">
                Start with commonly used tools for calculations, documents,
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
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-black/20 hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
                  {tool.icon}
                </div>

                <h3 className="text-lg font-bold group-hover:underline">
                  {tool.name}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/60">
                  {tool.description}
                </p>

                <div className="mt-5 text-sm font-semibold text-black">
                  Open Tool →
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          id="all-categories"
          className="border-y border-black/10 bg-white/40"
        >
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight">
                Tool Categories
              </h2>

              <p className="mt-3 max-w-3xl text-black/60">
                Categories help you find related tools for the same workflow.
                Use the directory to jump to calculators, SEO tools, PDF and
                image tools, text tools, business tools, generators and
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
                    className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-6 transition hover:border-black/20 hover:shadow-md"
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
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="rounded-[2.5rem] border border-black/10 bg-white/70 p-8 shadow-sm backdrop-blur sm:p-12">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              A Complete Directory of Practical Online Tools
            </h2>

            <div className="mt-8 space-y-6 text-black/65 leading-8">
              <p>
                The Toollane tools directory brings together free online tools
                for everyday digital tasks. Instead of searching across multiple
                websites, users can browse tools by category, open the right
                tool and complete a focused task directly in the browser.
              </p>

              <p>
                Toollane includes calculators, SEO utilities, PDF and image
                tools, business helpers, text tools, developer utilities and
                generators. Each tool is designed around a specific workflow, so
                users can quickly understand what the tool does and how to use
                it.
              </p>

              <p>
                Many tools are built for fast browser-based use and do not
                require an account. File-based tools, calculators and generators
                may have different settings or limitations, so users should
                always review the result before using it for important work.
              </p>
            </div>
          </div>
        </section>

        <section
          id="all-tools"
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-black tracking-tight">
              Browse All Tools by Category
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
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="group rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-black/20 hover:shadow-lg"
                      >
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
                          {tool.icon}
                        </div>

                        <h4 className="text-lg font-bold group-hover:underline">
                          {tool.name}
                        </h4>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/60">
                          {tool.description}
                        </p>

                        <div className="mt-5 text-sm font-semibold text-black">
                          Open Tool →
                        </div>
                      </Link>
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
              Frequently Asked Questions
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