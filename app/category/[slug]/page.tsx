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

  const categoryName =
    filteredTools[0]?.category || "Category";

  return {
    title: `${categoryName} | Toollane`,
    description: `Browse the best ${categoryName.toLowerCase()} online on Toollane.`,
  };
}

export default async function CategoryPage({
  params,
}: Props) {
  const { slug } = await params;

  const filteredTools = tools.filter(
    (tool) => tool.categorySlug === slug
  );

  const categoryName =
    filteredTools[0]?.category || "Category";

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="max-w-6xl mx-auto px-6 py-20">

        <h1 className="text-5xl font-bold mb-12">
          {categoryName}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="border rounded-2xl p-6 hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-semibold mb-2">
                {tool.name}
              </h2>

              <p className="text-gray-600">
                {tool.description}
              </p>
            </Link>
          ))}

        </div>

      </section>
    </main>
  );
}