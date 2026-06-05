"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Menu, Search, X } from "lucide-react";

import { categories, tools } from "@/data/tools";

const mainNav = [
  { name: "Calculators", slug: "calculators" },
  { name: "Generators", slug: "generators" },
  { name: "Image & PDF", slug: "image-pdf-tools" },
  { name: "Developer", slug: "developer-tools" },
  { name: "SEO", slug: "seo-tools" },
  { name: "Business", slug: "business-tools" },
  { name: "Text Tools", slug: "text-tools" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const categoryData = useMemo(() => {
    return mainNav
      .map((navItem) => {
        const category = categories.find((item) => item.slug === navItem.slug);
        const categoryTools = tools
          .filter((tool) => tool.categorySlug === navItem.slug)
          .sort(
            (a, b) =>
              Number(b.popular) - Number(a.popular) ||
              a.name.localeCompare(b.name)
          );

        return {
          ...navItem,
          description: category?.description || "",
          tools: categoryTools,
        };
      })
      .filter((item) => item.tools.length);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (mobileOpen) {
        setHidden(false);
        setLastScrollY(currentScrollY);
        return;
      }

      if (currentScrollY < 80) {
        setHidden(false);
      } else if (currentScrollY > lastScrollY) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, mobileOpen]);

  return (
    <header
  className={`sticky top-0 z-50 border-b border-black/10 bg-[#fff8df]/90 backdrop-blur-xl transition-transform duration-300 ${
    hidden ? "-translate-y-full" : "translate-y-0"
  }`}
>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          
  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black p-0">
  <Image
    src="/logo-navbar.png"
    alt="Toollane Logo"
    width={48}
    height={48}
    priority
    className="h-full w-full object-contain"
  />
</div>

          <div className="hidden sm:block">
            <div className="text-xl font-black tracking-tight">Toollane</div>
            <div className="text-xs text-black/50">Fast online tools</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {categoryData.map((category) => (
            <div key={category.slug} className="group relative py-7">
              <Link
                href={`/category/${category.slug}`}
                className="flex items-center gap-1 text-sm font-semibold text-black/70 transition hover:text-black"
              >
                {category.name}
                <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
              </Link>

              <div className="invisible fixed left-1/2 top-20 z-50 w-[min(calc(100vw-2rem),760px)] -translate-x-1/2 translate-y-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="rounded-[2rem] border border-black/10 bg-white p-4 shadow-2xl">
                  <div className="mb-4 flex items-start justify-between gap-6 rounded-[1.5rem] bg-[#fff8df] p-5">
                    <div>
                      <div className="text-lg font-black text-black">
                        {category.name}
                      </div>

                      <p className="mt-2 max-w-md text-sm leading-6 text-black/60">
                        {category.description}
                      </p>
                    </div>

                    <Link
                      href={`/category/${category.slug}`}
                      className="shrink-0 rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                    >
                      View all
                    </Link>
                  </div>

                  <div className="max-h-[min(430px,calc(100vh-14rem))] overflow-y-auto pr-2">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {category.tools.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          className="group/tool rounded-2xl border border-black/10 bg-white p-4 transition hover:border-black hover:bg-[#fff8df]"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-xs font-black text-white">
                              {tool.icon}
                            </div>

                            <div>
                              <div className="font-black leading-snug text-black group-hover/tool:underline">
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
                  </div>
                </div>
              </div>
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/#tools"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:border-black"
          >
            <Search className="h-4 w-4" />
            Search
          </Link>

          <Link
            href="/category/generators"
            className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Explore Tools
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white/70 lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-black/10 bg-[#fff8df] lg:hidden">
          <div className="space-y-4 px-4 py-5">
            <Link
              href="/#tools"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-4 text-sm font-bold text-white"
            >
              <Search className="h-4 w-4" />
              Search all tools
            </Link>

            {categoryData.map((category) => (
              <div
                key={category.slug}
                className="rounded-[1.75rem] border border-black/10 bg-white/80 p-4"
              >
                <Link
                  href={`/category/${category.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-black text-black">{category.name}</div>
                    <div className="mt-1 text-xs text-black/50">
                      {category.tools.length} tools
                    </div>
                  </div>

                  <span className="text-sm font-bold">View all →</span>
                </Link>

                <div className="mt-4 grid gap-2">
                  {category.tools.slice(0, 8).map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-2xl border border-black/10 bg-[#fff8df] px-4 py-3 text-sm font-semibold text-black"
                    >
                      {tool.shortName || tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}