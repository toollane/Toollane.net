import { ReactNode } from "react";

import { tools } from "@/data/tools";

import FAQSection from "@/components/FAQSection";
import FAQSchema from "@/components/FAQSchema";
import RelatedTools from "@/components/RelatedTools";
import Breadcrumbs from "@/components/Breadcrumbs";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

type FAQ = {
  question: string;
  answer: string;
};

type Props = {
  title: string;
  description: string;
  href: string;
  faqs?: FAQ[];
  children: ReactNode;
};

export default function ToolPageLayout({
  title,
  description,
  href,
  faqs,
  children,
}: Props) {
  const tool = tools.find((item) => item.href === href);

  const categoryName = tool?.category || "Tools";
  const categorySlug = tool?.categorySlug || "tools";
  const pageFaqs = faqs?.length ? faqs : tool?.faqs || [];

  return (
    <>
      <FAQSchema faqs={pageFaqs} />

      <BreadcrumbSchema
        categoryName={categoryName}
        categorySlug={categorySlug}
        toolName={title}
        toolHref={href}
      />

      <main className="min-h-screen bg-[#fff8df] text-[#171717]">
        <section className="relative overflow-hidden border-b border-black/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ffe680,_transparent_35%),radial-gradient(circle_at_top_right,_#ffd6e7,_transparent_30%)]" />

          <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <Breadcrumbs
              categoryName={categoryName}
              categorySlug={categorySlug}
              toolName={title}
            />

            <div className="mb-6 inline-flex items-center rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
              ⚡ Free online tool · Instant results
            </div>

            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-black sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60 sm:text-xl">
              {description}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="rounded-[2rem] border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur sm:p-7 lg:p-9">
            {children}
          </div>

          <RelatedTools currentHref={href} categorySlug={categorySlug} />

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