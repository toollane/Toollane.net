import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { tools } from "@/data/tools";

type Props = {
  params: {
    slug: string;
  };
};

const categories = Array.from(
  new Map(
    tools.map((tool) => [
      tool.categorySlug,
      {
        name: tool.category,
        slug: tool.categorySlug,
      },
    ])
  ).values()
);

export function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const category = categories.find((item) => item.slug === params.slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} | Free Online Tools`,
    description: `Explore free online ${category.name.toLowerCase()} on Toollane. Fast browser-based tools with instant results.`,
    alternates: {
      canonical: `https://toollane.net/category/${category.slug}`,
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const category = categories.find((item) => item.slug === params.slug);

  if (!category) {
    notFound();
  }

  const categoryTools = tools.filter(
    (tool) => tool.categorySlug === category.slug
  );

  return (
    <main className="min-h-screen bg-[#fff8df] text-black">
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-5 inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold shadow-sm">
            Toollane Category
          </div>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            {category.name}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">
            Explore fast, free and browser-based {category.name.toLowerCase()}.
            Every tool is built for quick results, clean UX and everyday use.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              All {category.name}
            </h2>

            <p className="mt-2 text-black/60">
              {categoryTools.length} tools available in this category.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-black/20 hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
                {tool.icon}
              </div>

              <h3 className="text-xl font-bold group-hover:underline">
                {tool.name}
              </h3>

              <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/60">
                {tool.description}
              </p>

              <div className="mt-5 text-sm font-semibold text-black">
                Open tool →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}