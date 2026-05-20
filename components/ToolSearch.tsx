"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { tools } from "@/data/tools";

export default function ToolSearch() {
  const [query, setQuery] =
    useState("");

  const filteredTools = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    return tools.filter((tool) =>
      `${tool.name} ${tool.description} ${tool.category}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="relative max-w-2xl">

      <input
        type="text"
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
        placeholder="Search tools..."
        className="w-full bg-white/80 backdrop-blur border border-black/10 rounded-3xl px-6 py-5 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10"
      />

      {filteredTools.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-xl border border-black/10 rounded-3xl shadow-2xl overflow-hidden z-50">

          {filteredTools
            .slice(0, 8)
            .map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="block px-6 py-5 hover:bg-black/5 transition border-b border-black/5 last:border-0"
              >

                <div className="font-semibold mb-1">
                  {tool.name}
                </div>

                <div className="text-sm text-black/55">
                  {tool.description}
                </div>

              </Link>
            ))}

        </div>
      )}

    </div>
  );
}