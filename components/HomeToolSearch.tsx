"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { categories, tools } from "@/data/tools";

export default function HomeToolSearch() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTools = useMemo(() => {
    const search = query.toLowerCase().trim();

    return tools
      .filter((tool) => {
        const matchesCategory =
          activeCategory === "all" || tool.categorySlug === activeCategory;

        const matchesSearch =
          !search ||
          tool.name.toLowerCase().includes(search) ||
          tool.description.toLowerCase().includes(search) ||
          tool.category.toLowerCase().includes(search) ||
          tool.keywords?.some((keyword) =>
            keyword.toLowerCase().includes(search)
          );

        return matchesCategory && matchesSearch;
      })
      .sort(
        (a, b) =>
          Number(b.popular) - Number(a.popular) ||
          a.name.localeCompare(b.name)
      );
  }, [query, activeCategory]);

  const visibleTools = filteredTools.slice(0, 12);
  const hasActiveSearch = query.trim() || activeCategory !== "all";

  return (
    <div className="rounded-[2.5rem] border border-black/10 bg-white/85 p-4 shadow-sm backdrop-blur sm:p-5">
      <div className="flex items-center gap-3 rounded-[1.5rem] border border-black/10 bg-white px-4 py-4">
        <Search className="h-5 w-5 shrink-0 text-black/40" />

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools, e.g. PDF, baby names, calculator..."
          className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-black/35 sm:text-base"
        />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${
            activeCategory === "all"
              ? "bg-black text-white"
              : "border border-black/10 bg-[#fff8df] text-black"
          }`}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => setActiveCategory(category.slug)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${
              activeCategory === category.slug
                ? "bg-black text-white"
                : "border border-black/10 bg-[#fff8df] text-black"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {hasActiveSearch && (
        <div className="mt-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm font-bold text-black">
              {filteredTools.length} tools found
            </p>

            {filteredTools.length > 12 && (
              <p className="text-xs font-semibold text-black/50">
                Showing top 12
              </p>
            )}
          </div>

          {visibleTools.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-2xl border border-black/10 bg-[#fff8df] p-4 transition hover:border-black"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-xs font-black text-white">
                      {tool.icon}
                    </div>

                    <div>
                      <div className="font-black leading-snug text-black">
                        {tool.shortName || tool.name}
                      </div>

                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-black/55">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-black/10 bg-[#fff8df] p-6 text-center text-sm text-black/60">
              No tools found. Try another keyword or category.
            </div>
          )}
        </div>
      )}
    </div>
  );
}