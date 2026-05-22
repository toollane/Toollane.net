import type { Metadata } from "next";

import Link from "next/link";

import { tools } from "@/data/tools";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const filteredTools = tools.filter(
    (tool) => tool.categorySlug === slug
  );

  if (filteredTools.length === 0) {
    return {
      title: "Category Not Found | Toollane",
    };
  }

  const categoryName =
    filteredTools[0].category;

  return {
    title: `${categoryName} | Toollane`,

    description:
      `Explore free online ${categoryName.toLowerCase()} built for speed, simplicity and productivity.`,

    openGraph: {
      title: `${categoryName} | Toollane`,

      description:
        `Explore free online ${categoryName.toLowerCase()} built for speed and simplicity.`,
    },
  };
}

export default async function CategoryPage({
  params,
}: Props) {
  const { slug } = await params;

  const filteredTools = tools.filter(
    (tool) => tool.categorySlug === slug
  );

  if (filteredTools.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#fff8df]">
        <h1 className="text-3xl font-bold">
          Category not found
        </h1>
      </main>
    );
  }

  const categoryName =
    filteredTools[0].category;

  return (
    <main className="min-h-screen bg-[#fff8df] text-[#171717]">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-black/10">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ffe680,_transparent_35%),radial-gradient(circle_at_top_right,_#ffd6e7,_transparent_30%)]" />

        <div className="relative max-w-6xl mx-auto px-6 py-24">

          <div className="max-w-3xl">

            <div className="inline-flex items-center rounded-full border border-black/10 bg-white/70 backdrop-blur px-4 py-2 text-sm mb-6 shadow-sm">
              {filteredTools.length} tools available
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              {categoryName}
            </h1>

            <p className="text-xl text-black/60 leading-8">
              Explore free online {categoryName.toLowerCase()} built for speed, simplicity and productivity.
            </p>

          </div>

        </div>

      </section>



      {/* TOOLS */}

      <section className="max-w-6xl mx-auto px-6 py-20">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-white/75 backdrop-blur border border-black/10 rounded-3xl p-8 hover:bg-white hover:-translate-y-1 hover:shadow-xl transition"
            >

              <div className="w-12 h-12 rounded-2xl bg-[#fff0a8] border border-black/10 flex items-center justify-center text-xl mb-6">
                ✦
              </div>

              <h2 className="text-2xl font-semibold mb-3 group-hover:translate-x-1 transition">
                {tool.name}
              </h2>

              <p className="text-black/60 leading-7">
                {tool.description}
              </p>

            </Link>
          ))}

        </div>

      </section>



      {/* SEO CONTENT */}

      <section className="border-t border-black/10 bg-white/40">

        <div className="max-w-4xl mx-auto px-6 py-20">

          <h2 className="text-4xl font-bold tracking-tight mb-8">
            Free {categoryName}
          </h2>

          <div className="space-y-6 text-lg text-black/65 leading-8">

            <p>
              Toollane provides fast, free and easy-to-use {categoryName.toLowerCase()} for everyday productivity.
            </p>

            <p>
              All tools are optimized for desktop and mobile devices and designed with a strong focus on simplicity and speed.
            </p>

            <p>
              Whether you need quick calculations, conversions or utility tools, Toollane helps you solve tasks instantly without registration or unnecessary complexity.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}