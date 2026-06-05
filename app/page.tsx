import type { Metadata } from "next";
import Link from "next/link";

import HomeToolSearch from "@/components/HomeToolSearch";
import { categories, tools } from "@/data/tools";

export const metadata: Metadata = {
  title: "Toollane - Free Online Tools for SEO, PDFs, Images, Business & More",
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

const faqs = [
  {
    question: "Are Toollane tools free to use?",
    answer:
      "Yes. Toollane provides free online tools for everyday tasks, SEO, PDFs, images, business, calculators and developers.",
  },
  {
    question: "Do Toollane tools work on mobile?",
    answer:
      "Yes. Toollane is designed mobile-first, so tools are built to work smoothly on phones, tablets and desktop devices.",
  },
  {
    question: "Are files uploaded to a server?",
    answer:
      "Many file-based tools process files locally in your browser. When a tool works locally, your files are not uploaded to a server.",
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
    <main className="min-h-screen bg-[#fff8df] text-black">
      <section className="relative overflow-hidden border-b border-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ffe680,_transparent_35%),radial-gradient(circle_at_top_right,_#ffd6e7,_transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
          <div className="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur">
            ⚡ Fast • Free • Mobile-Friendly
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Free Online Tools
            <span className="block">Built for Speed</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-black/65 sm:text-xl">
            Toollane offers fast, free and privacy-friendly online tools for
            SEO, PDFs, images, calculators, business, creators and developers.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
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

          <div id="tools" className="mt-10 max-w-5xl">
            <HomeToolSearch />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tight">Popular Tools</h2>
          <p className="mt-3 text-black/60">
            Start with the tools people use most.
          </p>
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

      <section className="border-y border-black/10 bg-white/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <h2 className="text-3xl font-black tracking-tight">
            Browse Categories
          </h2>

          <p className="mt-3 max-w-2xl text-black/60">
            Explore tools by topic. Clear categories help users find the right
            tool faster and create a stronger SEO structure.
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
            productivity, documents, creators and daily work.
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
              <div className="mt-6 text-sm font-bold">Explore collection →</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-black/10 bg-white/40">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
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
                Many tools process files directly in your browser, which helps
                improve speed and privacy. Toollane is built as a lightweight
                platform with useful pages, clear categories and fast access to
                everyday online tools.
              </p>

              <p>
                Toollane may earn money through advertising and affiliate links,
                while keeping the tools free to use. The goal is to provide
                practical tools that save time without unnecessary signups,
                clutter or slow workflows.
              </p>
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
  );
}