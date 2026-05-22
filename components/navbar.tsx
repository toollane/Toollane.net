"use client";

import Link from "next/link";
import { useState } from "react";

import { tools } from "@/data/tools";

const groupedTools = tools.reduce((acc, tool) => {
  if (!acc[tool.category]) {
    acc[tool.category] = {
      slug: tool.categorySlug,
      tools: [],
    };
  }

  acc[tool.category].tools.push(tool);

  return acc;
}, {} as Record<
  string,
  {
    slug: string;
    tools: typeof tools;
  }
>);

export default function Navbar() {
  const [openCategory, setOpenCategory] =
    useState<string | null>(null);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#fff8df]/80 border-b border-black/10">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold shadow-sm">
            T
          </div>

          <div>
            <div className="text-xl font-bold tracking-tight">
              Toollane
            </div>

            <div className="text-xs text-black/50">
              Fast online tools
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <Link
            href="/"
            className="text-black/70 hover:text-black transition"
          >
            Home
          </Link>

          {Object.entries(groupedTools).map(
            ([category, data]) => (
              <div
                key={category}
                className="relative"
                onMouseEnter={() =>
                  setOpenCategory(category)
                }
                onMouseLeave={() =>
                  setOpenCategory(null)
                }
              >
                <Link
                  href={`/category/${data.slug}`}
                  className="text-black/70 hover:text-black transition"
                >
                  {category}
                </Link>

                {openCategory === category && (
                  <div className="absolute top-full left-0 pt-4">
                    <div className="w-80 max-h-[70vh] overflow-y-auto rounded-3xl border border-black/10 bg-white/95 backdrop-blur-xl shadow-2xl p-3">
                      {data.tools.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          className="block rounded-2xl px-4 py-3 hover:bg-black/5 transition"
                        >
                          <div className="font-medium mb-1">
                            {tool.name}
                          </div>

                          <div className="text-sm text-black/50">
                            {tool.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </nav>

        <div className="hidden md:flex lg:flex items-center gap-4">
          <Link
            href="/percentage-calculator"
            className="bg-black text-white px-5 py-3 rounded-2xl hover:scale-[1.02] transition shadow-lg"
          >
            Popular Tool
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden border border-black/10 bg-white/70 px-4 py-3 rounded-2xl"
          aria-label="Open menu"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-black/10 bg-[#fff8df]/95 backdrop-blur-xl max-h-[80vh] overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block text-lg font-medium"
            >
              Home
            </Link>

            {Object.entries(groupedTools).map(
              ([category, data]) => (
                <div key={category}>
                  <Link
                    href={`/category/${data.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block text-lg font-semibold mb-3"
                  >
                    {category}
                  </Link>

                  <div className="grid gap-2">
                    {data.tools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setMobileOpen(false)}
                        className="block bg-white/70 border border-black/10 rounded-2xl p-4"
                      >
                        <div className="font-medium">
                          {tool.name}
                        </div>

                        <div className="text-sm text-black/55 mt-1">
                          {tool.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}