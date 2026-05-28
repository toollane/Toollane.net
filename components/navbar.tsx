"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { tools } from "@/data/tools";

const categoryOrder = [








];

export default function Navbar() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const groupedTools = useMemo(() => {
    return categoryOrder
      .map((category) => {
        const categoryTools = tools.filter((tool) => tool.category === category);

        return {
          category,
          slug: categoryTools[0]?.categorySlug || "",
          tools: categoryTools,
        };
      })
      .filter((group) => group.tools.length > 0);
  }, []);

  const popularTools = useMemo(() => {
    return tools.filter((tool) => tool.popular).slice(0, 8);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#fff8df]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Toollane Home">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white shadow-sm">
            T
          </div>

          <div className="leading-tight">
            <div className="text-lg font-bold tracking-tight text-black">
              Toollane
            </div>
            <div className="text-xs font-medium text-black/50">
              Fast online tools
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/" className="text-sm font-medium text-black/70 transition hover:text-black">
            Home
          </Link>

          {groupedTools.map((group) => (
            <div
              key={group.category}
              className="relative"
              onMouseEnter={() => setOpenCategory(group.category)}
              onMouseLeave={() => setOpenCategory(null)}
            >
              <Link
                href={`/category/${group.slug}`}
                className="text-sm font-medium text-black/70 transition hover:text-black"
              >
                {group.category}
              </Link>

              {openCategory === group.category && (
                <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4">
                  <div className="max-h-[70vh] w-80 overflow-y-auto rounded-3xl border border-black/10 bg-white/95 p-3 shadow-2xl backdrop-blur-xl">
                    <Link
                      href={`/category/${group.slug}`}
                      className="mb-2 block rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white"
                    >
                      View all {group.category}
                    </Link>

                    {group.tools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="block rounded-2xl px-4 py-3 transition hover:bg-black/5"
                      >
                        <div className="text-sm font-semibold text-black">
                          {tool.name}
                        </div>
                        <div className="mt-1 line-clamp-2 text-xs leading-5 text-black/55">
                          {tool.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/qr-code-generator"
            className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02]"
          >
            Popular Tool
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black shadow-sm lg:hidden"
          aria-label="Open menu"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-black/10 bg-[#fff8df]/95 backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-h-[calc(100vh-72px)] max-w-7xl overflow-y-auto px-4 py-5 sm:px-6">
            <div className="grid gap-3">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl bg-white px-4 py-4 font-semibold text-black shadow-sm"
              >
                Home
              </Link>

              <div className="rounded-3xl border border-black/10 bg-white p-4">
                <div className="mb-3 text-xs font-bold uppercase tracking-wide text-black/40">
                  Popular Tools
                </div>

                <div className="grid gap-2">
                  {popularTools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-2xl bg-black/[0.03] px-4 py-3"
                    >
                      <div className="text-sm font-semibold text-black">
                        {tool.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {groupedTools.map((group) => (
                <details
                  key={group.category}
                  className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm"
                >
                  <summary className="cursor-pointer text-base font-bold text-black">
                    {group.category}
                  </summary>

                  <div className="mt-4 grid gap-2">
                    <Link
                      href={`/category/${group.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white"
                    >
                      View all {group.category}
                    </Link>

                    {group.tools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-2xl bg-black/[0.03] px-4 py-3"
                      >
                        <div className="text-sm font-semibold text-black">
                          {tool.name}
                        </div>
                        <div className="mt-1 text-xs leading-5 text-black/55">
                          {tool.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}