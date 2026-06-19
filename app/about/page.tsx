import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Toollane | Free Online Tools",
  description:
    "Learn more about Toollane, a fast and privacy-friendly online tools platform for creators, developers, marketers, businesses and everyday users.",
  alternates: {
    canonical: "https://toollane.net/about",
  },
  openGraph: {
    title: "About Toollane | Free Online Tools",
    description:
      "Learn more about Toollane, a fast and privacy-friendly online tools platform for creators, developers, marketers, businesses and everyday users.",
    url: "https://toollane.net/about",
    siteName: "Toollane",
    type: "website",
  },
};

const audiences = [
  "Creators who need fast tools for content, images, links and naming ideas.",
  "Developers who want simple utilities for formatting, converting and checking data.",
  "Marketers and website owners who need SEO, metadata and content preparation tools.",
  "Students, freelancers and everyday users who want quick browser-based solutions.",
  "Small businesses that need practical calculators, documents and productivity helpers.",
];

const principles = [
  {
    title: "Focused tools",
    text: "Each Toollane tool is designed around a specific task, so users can get a useful result without unnecessary complexity.",
  },
  {
    title: "Fast access",
    text: "Toollane is built for quick use on mobile and desktop, with simple pages and clear workflows.",
  },
  {
    title: "Helpful context",
    text: "Tool pages include explanations, related tools, usage notes and practical guidance to help users understand the result.",
  },
  {
    title: "Privacy-aware design",
    text: "Many file-based tools are designed to work directly in the browser when possible, reducing the need to upload files for common tasks.",
  },
];

const toolAreas = [
  "PDF and image tools",
  "SEO and website tools",
  "Business and finance calculators",
  "Text and writing tools",
  "Developer utilities",
  "Generators and idea tools",
  "Creator and social media tools",
  "Baby name tools and inspiration pages",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fff8df] text-[#171717]">
      <section className="relative overflow-hidden border-b border-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ffe680,_transparent_35%),radial-gradient(circle_at_top_right,_#ffd6e7,_transparent_30%)]" />

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur">
            About Toollane
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            A growing platform for fast, practical online tools
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-black/65 sm:text-xl">
            Toollane is a collection of free online tools for creators,
            developers, marketers, businesses and everyday users. The platform
            is built to make common digital tasks faster, simpler and easier to
            complete directly in the browser.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/tools"
              className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              Browse all tools
            </Link>

            <Link
              href="/contact"
              className="rounded-2xl border border-black/10 bg-white/80 px-6 py-4 text-sm font-bold text-black transition hover:border-black"
            >
              Contact Toollane
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="rounded-[2.5rem] border border-black/10 bg-white/80 p-8 shadow-sm backdrop-blur sm:p-12">
          <h2 className="text-3xl font-black tracking-tight">
            What is Toollane?
          </h2>

          <div className="mt-8 space-y-6 text-black/70 leading-8">
            <p>
              Toollane is designed as a practical online toolbox. Instead of
              using separate apps, spreadsheets or complicated software for
              small tasks, users can open a focused tool, enter the required
              information and get a result directly on the page.
            </p>

            <p>
              The goal is to provide useful tools for everyday work: converting
              files, preparing PDFs, resizing images, calculating financial or
              business values, formatting text, generating ideas, preparing SEO
              assets and completing other common browser-based tasks.
            </p>

            <p>
              Toollane is operated by Nicklas Wolf from Germany. The platform is
              actively developed and improved with a focus on usability,
              performance, mobile-friendly design, clear navigation and useful
              supporting information.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white/40">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight">
              Who uses Toollane?
            </h2>

            <p className="mt-3 max-w-3xl text-black/60">
              Toollane is built for people who want to complete common online
              tasks quickly without unnecessary signups, slow workflows or heavy
              software.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {audiences.map((item) => (
              <div
                key={item}
                className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm"
              >
                <p className="text-sm leading-7 text-black/65">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tight">
            What kind of tools does Toollane offer?
          </h2>

          <p className="mt-3 max-w-3xl text-black/60">
            Toollane covers a growing range of practical categories. Each
            category is created to help users find related tools for the same
            type of task or workflow.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {toolAreas.map((area) => (
            <div
              key={area}
              className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm"
            >
              <h3 className="text-lg font-black">{area}</h3>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/tools"
            className="inline-flex rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            Explore the tools directory →
          </Link>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white/40">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight">
              How Toollane is built
            </h2>

            <p className="mt-3 max-w-3xl text-black/60">
              Toollane focuses on speed, clarity and usefulness. The platform is
              continuously improved with better tools, clearer pages, stronger
              internal navigation and more helpful explanations.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {principles.map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm"
              >
                <h3 className="text-xl font-black">{item.title}</h3>

                <p className="mt-3 text-sm leading-7 text-black/60">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-black/10 bg-white/80 p-8 shadow-sm">
            <h2 className="text-2xl font-black tracking-tight">
              Privacy and file handling
            </h2>

            <p className="mt-5 leading-8 text-black/65">
              Many Toollane tools are designed to work directly in the browser
              when possible. This can make common tasks faster and more
              privacy-friendly because files and inputs often do not need to be
              uploaded to a server for processing. Each tool may work
              differently depending on the task, file type and browser support.
            </p>

            <div className="mt-6">
              <Link
                href="/privacy"
                className="text-sm font-bold underline underline-offset-4"
              >
                Read the Privacy Policy →
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-white/80 p-8 shadow-sm">
            <h2 className="text-2xl font-black tracking-tight">
              Free access and monetization
            </h2>

            <p className="mt-5 leading-8 text-black/65">
              Toollane is free to use. To keep the tools available, the platform
              may earn revenue through advertising or affiliate links. This
              helps support hosting, development and ongoing improvements while
              keeping the tools accessible to users.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/terms"
                className="text-sm font-bold underline underline-offset-4"
              >
                Terms →
              </Link>

              <Link
                href="/imprint"
                className="text-sm font-bold underline underline-offset-4"
              >
                Imprint →
              </Link>

              <Link
                href="/contact"
                className="text-sm font-bold underline underline-offset-4"
              >
                Contact →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}