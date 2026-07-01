import { ReactNode } from "react";
import Link from "next/link";

import { tools } from "@/data/tools";
import { hubs } from "@/data/hubs";

import FAQSection from "@/components/FAQSection";
import FAQSchema from "@/components/FAQSchema";
import RelatedTools from "@/components/RelatedTools";
import Breadcrumbs from "@/components/Breadcrumbs";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import ToolSchema from "@/components/ToolSchema";
import ToolContentSection from "@/components/ToolContentSection";

type FAQ = {
  question: string;
  answer: string;
};

type Tool = {
  category: string;
  categorySlug: string;
  name: string;
  shortName?: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  href: string;
  icon: string;
  popular?: boolean;
  keywords?: string[];
  faqs?: FAQ[];
};

type Props = {
  tool?: Tool;
  title?: string;
  description?: string;
  href?: string;
  faqs?: FAQ[];
  children: ReactNode;
};

type Hub = (typeof hubs)[number];

function getMatchingHub(pageHref: string) {
  return hubs.find((hub) =>
    hub.toolHrefs.some((toolHref) => toolHref === pageHref)
  );
}

export default function ToolPageLayout({
  tool,
  title,
  description,
  href,
  faqs,
  children,
}: Props) {
  const resolvedHref = tool?.href || href || "";
  const matchedTool = tool || tools.find((item) => item.href === resolvedHref);

  if (!matchedTool && !title) {
    throw new Error(
      "ToolPageLayout requires either a tool object or title, description and href props."
    );
  }

  const pageTitle = matchedTool?.name || title || "Tool";
  const pageDescription =
    matchedTool?.description || description || "Use this free online tool.";
  const pageHref = matchedTool?.href || resolvedHref;

  const categoryName = matchedTool?.category || "Tools";
  const categorySlug = matchedTool?.categorySlug || "tools";
  const pageFaqs = faqs?.length ? faqs : matchedTool?.faqs || [];
  const matchingHub = getMatchingHub(pageHref);

  return (
    <>
      {pageFaqs.length > 0 && <FAQSchema faqs={pageFaqs} />}

      <BreadcrumbSchema
        categoryName={categoryName}
        categorySlug={categorySlug}
        toolName={pageTitle}
        toolHref={pageHref}
      />

      <ToolSchema
        name={pageTitle}
        description={pageDescription}
        url={`https://toollane.net${pageHref}`}
      />

      <main className="min-h-screen bg-[#fff8df] text-[#171717]">
        <section className="relative overflow-hidden border-b border-black/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ffe680,_transparent_35%),radial-gradient(circle_at_top_right,_#ffd6e7,_transparent_30%)]" />

          <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
            <Breadcrumbs
              categoryName={categoryName}
              categorySlug={categorySlug}
              toolName={pageTitle}
            />

            <div className="mt-6 inline-flex items-center rounded-full border border-black/10 bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-wide text-black/70 shadow-sm backdrop-blur sm:text-sm">
              Free online tool
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-black sm:text-5xl lg:text-6xl">
              {pageTitle}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-black/65 sm:text-xl">
              {pageDescription}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <TrustCard title="No signup" text="Use the tool directly." />
              <TrustCard
                title="Focused workflow"
                text="Inputs and results stay on one page."
              />
              <TrustCard
                title="Mobile-friendly"
                text="Designed for phone and desktop use."
              />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#tool"
                className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
              >
                Use tool now
              </a>

              <Link
                href={`/category/${categorySlug}`}
                className="rounded-2xl border border-black/10 bg-white/80 px-6 py-4 text-sm font-bold text-black transition hover:border-black"
              >
                Browse {categoryName}
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div
            id="tool"
            className="rounded-[2rem] border border-black/10 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-6 lg:p-8"
          >
            {children}
          </div>

          {matchingHub && <ToolHubLink hub={matchingHub} />}

          <ToolContentSection
            title={pageTitle}
            description={pageDescription}
            category={categoryName}
          />

          <RelatedTools currentHref={pageHref} categorySlug={categorySlug} />

          {pageFaqs.length > 0 && (
            <div className="mt-14">
              <FAQSection faqs={pageFaqs} />
            </div>
          )}
        </section>
      </main>
    </>
  );
}

function ToolHubLink({ hub }: { hub: Hub }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-black/10 bg-black p-6 text-white shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-white/50">
            Related tool collection
          </div>

          <h2 className="mt-2 text-2xl font-black tracking-tight">
            {hub.linkTitle}
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
            {hub.linkDescription}
          </p>
        </div>

        <Link
          href={hub.href}
          className="shrink-0 rounded-2xl bg-white px-6 py-4 text-center text-sm font-bold text-black transition hover:opacity-90"
        >
          Open collection →
        </Link>
      </div>
    </section>
  );
}

function TrustCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/75 p-4 shadow-sm backdrop-blur">
      <div className="text-sm font-black text-black">{title}</div>
      <div className="mt-1 text-xs leading-5 text-black/55">{text}</div>
    </div>
  );
}