import Link from "next/link";

import { tools } from "@/data/tools";

const categories = [
  {
    name: "Quick Math & Daily Calculators",
    href: "/category/quick-math-daily-calculators",
  },

  {
    name: "Media & Social Helpers",
    href: "/category/media-social-helpers",
  },

  {
    name: "Dev & Design Utilities",
    href: "/category/dev-design-utilities",
  },

  {
    name: "Office & Data Converters",
    href: "/category/office-data-converters",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#171717] text-white">

      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* BRAND */}

          <div>

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center font-bold">
                T
              </div>

              <div>

                <div className="text-xl font-bold">
                  Toollane
                </div>

                <div className="text-sm text-white/50">
                  Fast online tools
                </div>

              </div>

            </div>

            <p className="text-white/60 leading-7">
              Free calculators, converters and utility tools built for speed, simplicity and productivity.
            </p>

          </div>



          {/* CATEGORIES */}

          <div>

            <h3 className="font-semibold mb-5">
              Categories
            </h3>

            <div className="space-y-3">

              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="block text-white/60 hover:text-white transition"
                >
                  {category.name}
                </Link>
              ))}

            </div>

          </div>



          {/* POPULAR TOOLS */}

          <div>

            <h3 className="font-semibold mb-5">
              Popular Tools
            </h3>

            <div className="space-y-3">

              {tools.slice(0, 5).map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="block text-white/60 hover:text-white transition"
                >
                  {tool.name}
                </Link>
              ))}

            </div>

          </div>



          {/* LEGAL */}

          <div>

            <h3 className="font-semibold mb-5">
              Legal
            </h3>

            <div className="space-y-3">

              <Link
                href="/imprint"
                className="block text-white/60 hover:text-white transition"
              >
                Imprint
              </Link>

              <Link
                href="/privacy-policy"
                className="block text-white/60 hover:text-white transition"
              >
                Privacy Policy
              </Link>

            </div>

          </div>

        </div>



        {/* BOTTOM */}

        <div className="border-t border-white/10 mt-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-sm text-white/40">
            © 2026 Toollane. All rights reserved.
          </p>

          <p className="text-sm text-white/30">
            Built for fast everyday productivity.
          </p>

        </div>

      </div>

    </footer>
  );
}