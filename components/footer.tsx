import Link from "next/link";
import Image from "next/image";

import CookieSettingsButton from "@/components/CookieSettingsButton";
import { categories, tools } from "@/data/tools";

const footerPages = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms", href: "/terms" },
  { name: "Imprint", href: "/imprint" },
];

const featuredToolHrefs = [
  "/baby-name-generator",
  "/pdf-merger",
  "/image-compressor",
  "/percentage-calculator",
  "/resume-builder",
  "/invoice-generator",
];

export default function Footer() {
  const featuredTools = tools.filter((tool) =>
    featuredToolHrefs.includes(tool.href)
  );

  return (
    <footer className="border-t border-black/10 bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-0">
  <Image
    src="/logo-navbar.png"
    alt="Toollane Logo"
    width={48}
    height={48}
    className="h-full w-full object-contain"
  />
</div>

              <div>
                <div className="text-2xl font-black">Toollane</div>
                <div className="text-sm text-white/60">Fast online tools</div>
              </div>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/65">
              Fast, free and mobile-friendly online tools for SEO, PDFs,
              images, business, creators, developers and everyday work.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/50">
              Categories
            </h3>

            <ul className="mt-5 space-y-4">
              {categories.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/category/${item.slug}`}
                    className="text-sm text-white/70 transition hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/50">
              Popular Tools
            </h3>

            <ul className="mt-5 space-y-4">
              {featuredTools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="text-sm text-white/70 transition hover:text-white"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/50">
              Legal & Company
            </h3>

            <ul className="mt-5 space-y-4">
              {footerPages.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              <li>
                <CookieSettingsButton />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 text-sm text-white/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Toollane. All rights reserved.</p>
            <p>Built for speed, mobile usability and privacy.</p>
          </div>

          <p className="mt-5 max-w-3xl text-xs leading-6 text-white/40">
            Toollane may display ads or use affiliate links. Some tools process
            files locally in your browser. Please review our privacy policy and
            cookie settings for more information.
          </p>
        </div>
      </div>
    </footer>
  );
}