import Link from "next/link";
import { tools } from "@/data/tools";

type Props = {
  currentHref: string;
  categorySlug: string;
};

export default function RelatedTools({
  currentHref,
  categorySlug,
}: Props) {
  const relatedTools = tools.filter(
    (tool) =>
      tool.categorySlug === categorySlug &&
      tool.href !== currentHref
  );

  if (relatedTools.length === 0) {
    return null;
  }

  return (
    <section className="mt-20">
      <h2 className="text-3xl font-bold mb-8">
        Related Tools
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="border rounded-2xl p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">
              {tool.name}
            </h3>

            <p className="text-gray-600">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}