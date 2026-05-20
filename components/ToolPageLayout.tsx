import { ReactNode } from "react";

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
  categoryName: string;
  categorySlug: string;
  href: string;
  faqs: FAQ[];
  children: ReactNode;
};

export default function ToolPageLayout({
  title,
  description,
  categoryName,
  categorySlug,
  href,
  faqs,
  children,
}: Props) {
  return (
    <>
      <FAQSchema faqs={faqs} />

      <BreadcrumbSchema
        categoryName={categoryName}
        categorySlug={categorySlug}
        toolName={title}
        toolHref={href}
      />

      <main className="min-h-screen bg-[#fff8df] text-[#171717]">
        <section className="relative overflow-hidden border-b border-black/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ffe680,_transparent_35%),radial-gradient(circle_at_top_right,_#ffd6e7,_transparent_30%)]" />

          <div className="relative max-w-3xl mx-auto px-6 py-20">
            <Breadcrumbs
              categoryName={categoryName}
              categorySlug={categorySlug}
              toolName={title}
            />

            <div className="inline-flex items-center rounded-full border border-black/10 bg-white/70 backdrop-blur px-4 py-2 text-sm mb-6 shadow-sm">
              ⚡ Free tool · Instant results
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              {title}
            </h1>

            <p className="text-xl text-black/60 leading-8">
              {description}
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-14">
          <div className="bg-white/75 backdrop-blur border border-black/10 rounded-3xl p-6 md:p-8 shadow-sm">
            {children}
          </div>

          <FAQSection faqs={faqs} />

          <RelatedTools
            currentHref={href}
            categorySlug={categorySlug}
          />
        </section>
      </main>
    </>
  );
}