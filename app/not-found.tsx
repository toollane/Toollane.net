import Link from "next/link";

import HomeToolSearch from "@/components/HomeToolSearch";
import { categories, tools } from "@/data/tools";

export default function NotFound() {
  const popularTools = tools.filter((tool) => tool.popular).slice(0, 8);

  return (
    <main className="min-h-screen bg-[#fff8df] text-black">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="rounded-[2.5rem] border border-black/10 bg-white/80 p-8 shadow-sm backdrop-blur sm:p-12">
          <div className="text-sm font-black uppercase tracking-wider text-black/40">
            Error 404
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Page Not Found
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/65">
            The page you are looking for may have been moved, deleted or never
            existed. Try searching Toollane or explore one of our popular tools.
          </p>

          <div className="mt-10">
            <HomeToolSearch />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-2xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              Go to Homepage
            </Link>

            <Link
              href="/category/calculators"
              className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-black transition hover:border-black"
            >
              Browse Tools
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black tracking-tight">
          Popular Tools
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-[2rem] border border-black/10 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-black">{tool.name}</h3>

              <p className="mt-3 text-sm leading-6 text-black/60">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black tracking-tight">
          Browse Categories
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="rounded-[2rem] border border-black/10 bg-white p-6 transition hover:shadow-md"
            >
              <h3 className="font-black">{category.name}</h3>

              <p className="mt-3 text-sm leading-6 text-black/60">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}