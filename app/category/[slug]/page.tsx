import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { categories, tools } from "@/data/tools";
import { siteConfig } from "@/app/seo";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  const title = `${category.name} - Free Online Tools | Toollane`;
  const description = `${category.description} Explore fast, free and mobile-friendly ${category.name.toLowerCase()} on Toollane.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/category/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/category/${category.slug}`,
      siteName: "Toollane",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryTools = tools
    .filter((tool) => tool.categorySlug === category.slug)
    .sort(
      (a, b) =>
        Number(b.popular) - Number(a.popular) || a.name.localeCompare(b.name)
    );

  const popularCategoryTools = categoryTools
    .filter((tool) => tool.popular)
    .slice(0, 6);

  const otherCategories = categories.filter(
    (item) => item.slug !== category.slug
  );

  return (
    <main className="min-h-screen bg-[#fff8df] text-black">
      <section className="relative overflow-hidden border-b border-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ffe680,_transparent_35%),radial-gradient(circle_at_top_right,_#ffd6e7,_transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-5 inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur">
            Toollane Category
          </div>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            {category.name}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/65">
            {category.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-black/60">
              {categoryTools.length} tools
            </span>
            <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-black/60">
              Free to use
            </span>
            <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-black/60">
              Mobile-friendly
            </span>
          </div>
        </div>
      </section>

      {!!popularCategoryTools.length && (
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight">
              Popular {category.name}
            </h2>
            <p className="mt-3 text-black/60">
              Start with the most used tools in this category.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularCategoryTools.map((tool) => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tight">
            All {category.name}
          </h2>

          <p className="mt-3 max-w-2xl text-black/60">
            Browse all available {category.name.toLowerCase()} on Toollane.
          </p>
        </div>

        {categoryTools.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryTools.map((tool) => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-black/10 bg-white p-8 text-center">
            <h2 className="text-2xl font-black">No tools found</h2>
            <p className="mt-3 text-black/60">
              This category has no tools yet.
            </p>
          </div>
        )}
      </section>

      <section className="border-y border-black/10 bg-white/40">
  <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
    <div className="rounded-[2.5rem] border border-black/10 bg-white/75 p-8 shadow-sm backdrop-blur sm:p-12">
      <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
        Free {category.name} for everyday work
      </h2>

      <div className="mt-8 space-y-6 text-black/65 leading-8">
        <p>
          Toollane&apos;s {category.name.toLowerCase()} are designed to help
          users complete practical online tasks faster. This category includes{" "}
          {categoryTools.length} tools that are built for speed, simplicity and
          mobile-friendly use.
        </p>

        <p>
          Whether you are working on personal projects, business tasks,
          content creation, development, documents, images, SEO or everyday
          productivity, these tools are made to be easy to access directly in
          your browser.
        </p>

        <p>
          Each tool in this category is designed with a clean interface,
          straightforward inputs and fast results. Toollane avoids unnecessary
          complexity so you can focus on completing the task instead of learning
          complicated software.
        </p>

        <h3 className="pt-4 text-2xl font-black text-black">
          What you can do with {category.name}
        </h3>

        <ul className="list-disc space-y-2 pl-6">
          <li>Complete common online tasks faster</li>
          <li>Use tools directly on desktop, tablet or mobile</li>
          <li>Access free tools without creating an account</li>
          <li>Find related tools in the same category</li>
          <li>Save time on repetitive digital workflows</li>
        </ul>

        <h3 className="pt-4 text-2xl font-black text-black">
          Why use Toollane&apos;s {category.name.toLowerCase()}?
        </h3>

        <p>
          Toollane focuses on useful tools, fast loading pages and clear
          navigation. The goal is to make online tools easier to find and easier
          to use, whether you need one quick result or several tools for a
          larger workflow.
        </p>
      </div>
    </div>
  </div>
</section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h2 className="text-3xl font-black tracking-tight">
          Explore More Tool Categories
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {otherCategories.map((item) => (
            <Link
              key={item.slug}
              href={`/category/${item.slug}`}
              className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-black/20 hover:shadow-md"
            >
              <h3 className="text-xl font-black">{item.name}</h3>

              <p className="mt-3 text-sm leading-6 text-black/60">
                {item.description}
              </p>

              <div className="mt-5 text-sm font-bold">Open category →</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function ToolCard({
  tool,
}: {
  tool: {
    href: string;
    icon: string;
    name: string;
    description: string;
  };
}) {
  return (
    <Link
      href={tool.href}
      className="group rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-black/20 hover:shadow-md"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
        {tool.icon}
      </div>

      <h3 className="text-xl font-bold group-hover:underline">{tool.name}</h3>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/60">
        {tool.description}
      </p>

      <div className="mt-5 text-sm font-semibold text-black">Open tool →</div>
    </Link>
  );
}