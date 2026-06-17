import Link from "next/link";

import { categories, tools } from "@/data/tools";

type RelatedToolsProps = {
  currentHref: string;
  categorySlug: string;
  limit?: number;
};

function getRelatedTools({
  currentHref,
  categorySlug,
  limit,
}: {
  currentHref: string;
  categorySlug: string;
  limit: number;
}) {
  const categoryTools = tools
    .filter((tool) => tool.categorySlug === categorySlug)
    .sort(
      (a, b) =>
        Number(b.popular) - Number(a.popular) || a.name.localeCompare(b.name)
    );

  const currentIndex = categoryTools.findIndex(
    (tool) => tool.href === currentHref
  );

  if (currentIndex === -1) {
    return categoryTools
      .filter((tool) => tool.href !== currentHref)
      .slice(0, limit);
  }

  const selectedTools: typeof tools = [];
  const selectedHrefs = new Set<string>();

  function addTool(tool: (typeof tools)[number] | undefined) {
    if (!tool) {
      return;
    }

    if (tool.href === currentHref) {
      return;
    }

    if (selectedHrefs.has(tool.href)) {
      return;
    }

    if (selectedTools.length >= limit) {
      return;
    }

    selectedTools.push(tool);
    selectedHrefs.add(tool.href);
  }

  for (let distance = 1; selectedTools.length < limit; distance += 1) {
    const previousTool = categoryTools[currentIndex - distance];
    const nextTool = categoryTools[currentIndex + distance];

    if (!previousTool && !nextTool) {
      break;
    }

    addTool(previousTool);
    addTool(nextTool);
  }

  if (selectedTools.length < limit) {
    for (const tool of categoryTools) {
      addTool(tool);

      if (selectedTools.length >= limit) {
        break;
      }
    }
  }

  return selectedTools;
}

export default function RelatedTools({
  currentHref,
  categorySlug,
  limit = 6,
}: RelatedToolsProps) {
  const relatedTools = getRelatedTools({
    currentHref,
    categorySlug,
    limit,
  });

  const category = categories.find((item) => item.slug === categorySlug);

  if (!relatedTools.length && !category) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-black">Related Tools</h2>

        <p className="mt-2 text-black/60">
          More useful tools from the same category.
        </p>
      </div>

      {!!relatedTools.length && (
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
      )}

      {category && (
        <div className="mt-5 rounded-3xl border border-black/10 bg-[#fff8df] p-5">
          <div className="text-sm font-bold text-black">
            Browse the full category
          </div>

          <p className="mt-2 text-sm leading-6 text-black/60">
            Explore all {category.name.toLowerCase()} available on Toollane.
          </p>

          <Link
            href={`/category/${category.slug}`}
            className="mt-4 inline-flex rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            Open {category.name} →
          </Link>
        </div>
      )}
    </section>
  );
}