import Link from "next/link";

import { tools } from "@/data/tools";

type RelatedToolsProps = {
  currentHref: string;
  categorySlug: string;
  limit?: number;
};

export default function RelatedTools({
  currentHref,
  categorySlug,
  limit = 6,
}: RelatedToolsProps) {
  const relatedTools = tools
    .filter(
      (tool) =>
        tool.href !== currentHref &&
        tool.categorySlug === categorySlug
    )
    .slice(0, limit);

  if (!relatedTools.length) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-black">
          Related Tools
        </h2>

        <p className="mt-2 text-black/60">
          More useful tools from the same category.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-3xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-black/20 hover:shadow-md"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
              {tool.icon}
            </div>

            <div className="text-lg font-bold text-black group-hover:underline">
              {tool.name}
            </div>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/60">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}