import type { Metadata } from "next";
import Link from "next/link";

import FAQSchema from "@/components/FAQSchema";
import HomeToolSearch from "@/components/HomeToolSearch";
import { categories, tools } from "@/data/tools";

export const metadata: Metadata = {
  title: "Free Online Tools for SEO, PDF & Business | Toollane",
  description:
    "Use fast, free and mobile-friendly online tools for SEO, PDFs, images, calculators, business, creators, developers and everyday work.",
  alternates: {
    canonical: "https://toollane.net",
  },
  openGraph: {
    title: "Toollane - Free Online Tools",
    description:
      "Fast, free and mobile-friendly online tools for SEO, PDFs, images, business, calculators and everyday work.",
    url: "https://toollane.net",
    siteName: "Toollane",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toollane - Free Online Tools",
    description:
      "Fast, free and mobile-friendly online tools for SEO, PDFs, images, business, calculators and everyday work.",
  },
};

const featuredCollections = [
  {
    title: "SEO Tools",
    description:
      "Create metadata, check keyword usage, build slugs and prepare websites for search engines.",
    href: "/category/seo-tools",
  },
  {
    title: "PDF & Image Tools",
    description:
      "Compress, convert, merge, resize and process files directly in your browser.",
    href: "/category/image-pdf-tools",
  },
  {
    title: "Business Tools",
    description:
      "Create invoices, resumes, receipts, business names and practical documents faster.",
    href: "/category/business-tools",
  },
];

const qualityPrinciples = [
  {
    title: "Focused tools",
    description:
      "Each Toollane tool is built around a clear task, so users can get a useful result without unnecessary steps.",
  },
  {
    title: "Clear navigation",
    description:
      "Tools are grouped into categories and collections, making it easier to find related tools for the same workflow.",
  },
  {
    title: "Privacy-aware workflows",
    description:
      "Many file-based tools are designed to work directly in the browser, which can help keep common file tasks fast and simple.",
  },
  {
    title: "Helpful context",
    description:
      "Tool pages include descriptions, usage guidance, related tools and practical notes to help users understand the result.",
  },
];

const faqs = [
  {
    question: "Are Toollane tools free to use?",
    answer:
      "Yes. Toollane provides free online tools for everyday tasks, SEO, PDFs, images, business, calculators, developers and creators.",
  },
  {
    question: "Do Toollane tools work on mobile?",
    answer:
      "Yes. Toollane is designed to work on phones, tablets and desktop devices, so you can use tools from different screen sizes.",
  },
  {
    question: "Are files uploaded to a server?",
    answer:
      "Many file-based Toollane tools process files directly in your browser. When a tool works locally, your files are not uploaded to a server for processing.",
  },
  {
    question: "What can I use Toollane for?",
    answer:
      "Toollane can help with calculations, PDF tasks, image conversion, SEO preparation, text formatting, developer utilities, business documents and creative generators.",
  },
  {
    question: "How does Toollane make money?",
    answer:
      "Toollane may earn revenue through advertising and affiliate links while keeping the tools free to use.",
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
              ⚡ Fast • Free • Mobile-Friendly
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Free Online Tools for SEO, PDF, Business and Productivity
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-black/65 sm:text-xl">
              Toollane offers fast, free and privacy-friendly online tools for
              SEO, PDFs, images, calculators, business, creators and developers.
              Use focused tools directly in your browser to complete everyday
              digital tasks faster.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-black/60">
                {tools.length} free tools
              </span>

              <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-black/60">
                {categories.length} categories
              </span>

              <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-black/60">
                No signup required
              </span>

              <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-black/60">
                Works on mobile
              </span>

              <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-black/60">
                Browser-based tools
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tools"
                className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
              >
                Browse all tools
              </Link>

              <a
                href="#categories"
                className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:border-black/20 hover:shadow-sm"
              >
                Browse categories
              </a>
            </div>

            <div id="tools" className="mt-10 max-w-5xl">
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

              <p className="mt-3 text-black/60">
                Start with commonly used Toollane tools for calculations,
                documents, SEO, text, files and everyday productivity.
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
          id="categories"
          className="border-y border-black/10 bg-white/40"
        >
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <h2 className="text-3xl font-black tracking-tight">
              Browse Categories
            </h2>

            <p className="mt-3 max-w-2xl text-black/60">
              Explore tools by topic. Categories help you find the right tool
              faster and discover related tools for the same task or workflow.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-6 transition hover:border-black/20 hover:shadow-md"
                >
                  <h3 className="text-xl font-bold">{category.name}</h3>

                  <p className="mt-3 text-sm leading-6 text-black/60">
                    {category.description}
                  </p>

                  <div className="mt-5 text-sm font-semibold">
                    Open Category →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight">
              Featured Tool Collections
            </h2>

            <p className="mt-3 max-w-2xl text-black/60">
              Toollane is organized into useful collections for search,
              productivity, documents, creators, developers and daily work.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {featuredCollections.map((collection) => (
              <Link
                key={collection.href}
                href={collection.href}
                className="rounded-[2rem] border border-black/10 bg-white/75 p-7 shadow-sm transition hover:-translate-y-1 hover:border-black/20 hover:shadow-lg"
              >
                <h3 className="text-2xl font-black">{collection.title}</h3>

                <p className="mt-4 text-sm leading-7 text-black/60">
                  {collection.description}
                </p>

                <div className="mt-6 text-sm font-bold">
                  Explore collection →
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-black/10 bg-white/40">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight">
                What makes Toollane useful?
              </h2>

              <p className="mt-3 max-w-3xl text-black/60">
                Toollane is built as a practical online toolbox. The goal is to
                provide simple, focused tools that help users complete common
                digital tasks without slow workflows, unnecessary signups or
                complicated software.
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
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="rounded-[2.5rem] border border-black/10 bg-white/70 p-8 shadow-sm backdrop-blur sm:p-12">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Fast Online Tools for Everyday Work
            </h2>

            <div className="mt-8 space-y-6 text-black/65 leading-8">
              <p>
                Toollane provides a growing collection of free online tools for
                SEO, developers, PDFs, images, productivity, business, creators
                and calculators. Every tool is designed to be fast, clean and
                easy to use on mobile and desktop.
              </p>

              <p>
                The platform includes tools for file conversion, PDF workflows,
                image editing, text formatting, finance and business
                calculations, creator tools, developer utilities and baby name
                inspiration. Each category is designed to help users move from a
                specific need to a practical result.
              </p>

              <p>
                Many tools process files directly in your browser, which can
                improve speed and privacy for common file tasks. For calculators
                and planning tools, results are based on the values entered and
                should be used as helpful estimates rather than professional
                advice.
              </p>

              <p>
                Toollane may earn money through advertising and affiliate links,
                while keeping the tools free to use. The goal is to provide
                practical tools that save time without unnecessary signups,
                clutter or slow workflows.
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
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
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
        </section>
      </main>
    </>
  );
}