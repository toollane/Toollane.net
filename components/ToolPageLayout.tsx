import { ReactNode } from "react";
import Link from "next/link";

import { tools } from "@/data/tools";

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

function getCategoryBenefit(categoryName: string) {
  switch (categoryName) {
    case "Calculators":
      return "Built for fast calculations, quick estimates and everyday decisions.";
    case "Image & PDF Tools":
      return "Process files directly in your browser with a clean, privacy-friendly workflow.";
    case "Developer Tools":
      return "Format, validate, convert and inspect technical data without opening heavy software.";
    case "SEO Tools":
      return "Prepare metadata, content and URLs for better search visibility.";
    case "Business Tools":
      return "Create practical business documents, assets and calculations faster.";
    case "Text Tools":
      return "Clean, format, count and transform text with simple browser-based tools.";
    case "Generators":
      return "Generate ideas, names, codes and creative assets in seconds.";
    default:
      return "Use a fast, simple and mobile-friendly online tool directly in your browser.";
  }
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
              ⚡ Free · Fast · Mobile-Friendly
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-black sm:text-5xl lg:text-6xl">
              {pageTitle}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-black/65 sm:text-xl">
              {pageDescription}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <TrustCard title="No signup" text="Use the tool instantly." />
              <TrustCard title="Mobile-ready" text="Works on phones and desktop." />
              <TrustCard title="Fast results" text="Get answers directly on the page." />
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

          <section className="mt-10 grid gap-4 lg:grid-cols-3">
            <InfoPanel
              title="Built for speed"
              text={getCategoryBenefit(categoryName)}
            />
            <InfoPanel
              title="Browser-based"
              text="Toollane tools are designed to work directly in your browser with a simple, focused interface."
            />
            <InfoPanel
              title="Use it again"
              text="Need this tool often? Save this page to your phone home screen for quick access."
            />
          </section>

          <div className="mt-10 rounded-[2rem] border border-black/10 bg-white/70 p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black tracking-tight text-black">
              How to use the {pageTitle}
            </h2>

            <ol className="mt-5 grid gap-4 text-sm leading-7 text-black/65 sm:text-base lg:grid-cols-3">
              <li className="rounded-2xl border border-black/10 bg-white p-5">
                <strong className="block text-black">1. Enter your input</strong>
                Add the values, text, files or settings required by the tool.
              </li>
              <li className="rounded-2xl border border-black/10 bg-white p-5">
                <strong className="block text-black">2. Check the result</strong>
                Review the instant result directly on the page.
              </li>
              <li className="rounded-2xl border border-black/10 bg-white p-5">
                <strong className="block text-black">3. Copy or use it</strong>
                Copy, download or apply the result to your task.
              </li>
            </ol>
          </div>

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

function TrustCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/75 p-4 shadow-sm backdrop-blur">
      <div className="text-sm font-black text-black">{title}</div>
      <div className="mt-1 text-xs leading-5 text-black/55">{text}</div>
    </div>
  );
}

function InfoPanel({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-sm">
      <h2 className="text-lg font-black text-black">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-black/60">{text}</p>
    </div>
  );
}