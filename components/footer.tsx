import Link from "next/link";

import { tools } from "@/data/tools";

const footerCategories = [








];

export default function Footer() {
  const groupedTools = footerCategories
    .map((category) => {
      const categoryTools = tools
        .filter((tool) => tool.category === category)
        .slice(0, 6);

      return {
        category,
        slug: categoryTools[0]?.categorySlug || "",
        tools: categoryTools,
      };
    })
    .filter((group) => group.tools.length > 0);

  const popularTools = tools
    .filter((tool) => tool.popular)
    .slice(0, 8);

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-bold text-black shadow-sm">
                T
              </div>

              <div>
                <div className="text-xl font-bold text-white">
                  Toollane
                </div>

                <div className="text-sm text-white/55">
                  Fast online tools
                </div>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
              Toollane offers fast and modern browser-based tools for
              productivity, SEO, business, development and everyday work.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
              >
                Contact
              </Link>

              <Link
                href="/privacy-policy"
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
              >
                Privacy
              </Link>

              <Link
                href="/terms"
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
              >
                Terms
              </Link>

              <Link
                href="/disclaimer"
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
              >
                Disclaimer
              </Link>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                Popular
              </div>

              <div className="grid gap-3">
                {popularTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="text-sm font-medium text-white/65 transition hover:text-white"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>

            {groupedTools.slice(0, 3).map((group) => (
              <div key={group.category}>
                <Link
                  href={`/category/${group.slug}`}
                  className="mb-5 block text-xs font-bold uppercase tracking-[0.2em] text-white/35 transition hover:text-white"
                >
                  {group.category}
                </Link>

                <div className="grid gap-3">
                  {group.tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="text-sm font-medium text-white/65 transition hover:text-white"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {groupedTools.slice(3).map((group) => (
            <div key={group.category}>
              <Link
                href={`/category/${group.slug}`}
                className="mb-5 block text-xs font-bold uppercase tracking-[0.2em] text-white/35 transition hover:text-white"
              >
                {group.category}
              </Link>

              <div className="grid gap-3">
                {group.tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="text-sm font-medium text-white/65 transition hover:text-white"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/40">
          © {new Date().getFullYear()} Toollane. All rights reserved.
        </div>
      </div>
    </footer>
  );
}