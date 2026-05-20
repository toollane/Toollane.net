import Link from "next/link";

import ToolSearch from "@/components/ToolSearch";
import { tools } from "@/data/tools";

const groupedTools = tools.reduce((acc, tool) => {
  if (!acc[tool.category]) {
    acc[tool.category] = [];
  }

  acc[tool.category].push(tool);

  return acc;
}, {} as Record<string, typeof tools>);

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fff8df] text-[#171717]">
      <section className="relative overflow-hidden border-b border-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ffe680,_transparent_35%),radial-gradient(circle_at_top_right,_#ffd6e7,_transparent_30%)]" />

        <div className="relative max-w-6xl mx-auto px-6 py-28">
          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-black/10 bg-white/70 backdrop-blur px-4 py-2 text-sm mb-8 shadow-sm">
              ⚡ Free tools · No signup · Instant results
            </div>

            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-8 tracking-tight">
              Simple tools that
              <br />
              feel effortless.
            </h1>

            <p className="text-xl text-black/65 leading-8 mb-10 max-w-2xl">
              Toollane helps you convert, calculate and solve everyday tasks
              with fast, clean and distraction-free online tools.
            </p>

            <ToolSearch />

            <div className="flex flex-wrap gap-4 mt-6">
              <Link
                href="/percentage-calculator"
                className="bg-black text-white px-7 py-4 rounded-2xl hover:scale-[1.02] transition shadow-lg"
              >
                Try Percentage Calculator
              </Link>

              <Link
                href="/category/quick-math-daily-calculators"
                className="bg-white/80 border border-black/10 px-7 py-4 rounded-2xl hover:bg-white transition shadow-sm"
              >
                Browse all tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-10">
          <p className="text-sm font-semibold text-black/50 mb-3 uppercase tracking-widest">
            Popular tools
          </p>

          <h2 className="text-4xl font-bold tracking-tight">
            Start with what people use most
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.slice(0, 6).map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-white/75 backdrop-blur border border-black/10 rounded-3xl p-8 hover:bg-white hover:-translate-y-1 hover:shadow-xl transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#fff0a8] border border-black/10 flex items-center justify-center text-xl mb-6">
                ✦
              </div>

              <h3 className="text-2xl font-semibold mb-3 group-hover:translate-x-1 transition">
                {tool.name}
              </h3>

              <p className="text-black/60 leading-7">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white/55 border-y border-black/10">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-12">
            <p className="text-sm font-semibold text-black/50 mb-3 uppercase tracking-widest">
              Categories
            </p>

            <h2 className="text-4xl font-bold tracking-tight">
              Find the right tool faster
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(groupedTools).map(
              ([category, categoryTools]) => (
                <Link
                  key={category}
                  href={`/category/${categoryTools[0].categorySlug}`}
                  className="bg-[#fffdf4] border border-black/10 rounded-3xl p-8 hover:bg-white hover:shadow-xl transition"
                >
                  <div className="flex items-start justify-between gap-6 mb-6">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">
                        {category}
                      </h3>

                      <p className="text-black/55">
                        {categoryTools.length} tools available
                      </p>
                    </div>

                    <div className="text-2xl">→</div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {categoryTools.slice(0, 3).map((tool) => (
                      <span
                        key={tool.href}
                        className="bg-white border border-black/10 px-3 py-2 rounded-xl text-sm text-black/70"
                      >
                        {tool.name}
                      </span>
                    ))}
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold text-black/50 mb-3 uppercase tracking-widest">
              Built for focus
            </p>

            <h2 className="text-4xl font-bold tracking-tight mb-6">
              Calm design. Fast results. No friction.
            </h2>

            <p className="text-lg text-black/60 leading-8">
              Toollane is designed to reduce cognitive load: clear inputs,
              instant feedback, soft contrast and no unnecessary steps.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              ["⚡", "Instant feedback", "Results update as you type."],
              ["🧠", "Low mental effort", "Simple labels and predictable layouts."],
              ["📱", "Mobile friendly", "Comfortable to use on any device."],
            ].map(([icon, title, text]) => (
              <div
                key={title}
                className="bg-white/75 border border-black/10 rounded-3xl p-6 shadow-sm"
              >
                <div className="text-3xl mb-3">{icon}</div>

                <h3 className="text-xl font-semibold mb-2">
                  {title}
                </h3>

                <p className="text-black/60">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}