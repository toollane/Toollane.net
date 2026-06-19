import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Imprint | Toollane",
  description:
    "Legal notice, provider information and contact details for Toollane.",
  alternates: {
    canonical: "https://toollane.net/imprint",
  },
  openGraph: {
    title: "Imprint | Toollane",
    description:
      "Legal notice, provider information and contact details for Toollane.",
    url: "https://toollane.net/imprint",
    siteName: "Toollane",
    type: "website",
  },
};

export default function ImprintPage() {
  return (
    <main className="min-h-screen bg-[#fff8df] text-[#171717]">
      <section className="relative overflow-hidden border-b border-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ffe680,_transparent_35%),radial-gradient(circle_at_top_right,_#ffd6e7,_transparent_30%)]" />

        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur">
            Legal Notice
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Imprint
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-black/65">
            Legal notice and provider information for Toollane.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="rounded-[2.5rem] border border-black/10 bg-white/80 p-8 shadow-sm backdrop-blur sm:p-12">
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-black tracking-tight">
                Information according to § 5 DDG
              </h2>

              <p className="mt-5 leading-8 text-black/70">
                Nicklas Wolf
                <br />
                Am Dorfe 3
                <br />
                37133 Friedland
                <br />
                Germany
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tight">
                Contact
              </h2>

              <p className="mt-5 leading-8 text-black/70">
                Email:{" "}
                <a
                  href="mailto:contact@toollane.net"
                  className="font-bold underline underline-offset-4"
                >
                  contact@toollane.net
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tight">
                Responsible for content
              </h2>

              <p className="mt-5 leading-8 text-black/70">
                Nicklas Wolf
                <br />
                Address as stated above.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tight">
                About this website
              </h2>

              <p className="mt-5 leading-8 text-black/70">
                Toollane is a free online tools platform for practical
                browser-based tasks, including calculators, PDF tools, image
                tools, SEO tools, text tools, developer utilities, generators
                and business tools.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tight">
                Liability for content
              </h2>

              <div className="mt-5 space-y-4 leading-8 text-black/70">
                <p>
                  The content on Toollane is created with care. However,
                  Toollane does not guarantee that all information, tool results,
                  calculations, generated outputs or file processing results are
                  always complete, accurate, current or suitable for a specific
                  purpose.
                </p>

                <p>
                  Toollane tools are provided for informational, productivity
                  and utility purposes. Users are responsible for checking
                  results before using them for important decisions or
                  professional work.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tight">
                Liability for external links
              </h2>

              <p className="mt-5 leading-8 text-black/70">
                Toollane may contain links to external websites. Toollane has no
                control over the content of external websites and is not
                responsible for their content, availability, privacy practices or
                terms. The respective provider or operator of the linked website
                is responsible for its own content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black tracking-tight">
                Copyright
              </h2>

              <p className="mt-5 leading-8 text-black/70">
                The Toollane website, design, structure, branding and original
                content are protected by applicable copyright and intellectual
                property laws. Reproduction, distribution or commercial reuse of
                substantial parts of the website requires permission unless
                permitted by law.
              </p>
            </section>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white/40">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-black/10 bg-white/80 p-8 shadow-sm">
              <h2 className="text-2xl font-black tracking-tight">
                Related pages
              </h2>

              <p className="mt-5 leading-8 text-black/65">
                Review the Privacy Policy, Terms and Contact page for more
                information about Toollane.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/privacy-policy"
                  className="text-sm font-bold underline underline-offset-4"
                >
                  Privacy Policy →
                </Link>

                <Link
                  href="/terms"
                  className="text-sm font-bold underline underline-offset-4"
                >
                  Terms →
                </Link>

                <Link
                  href="/contact"
                  className="text-sm font-bold underline underline-offset-4"
                >
                  Contact →
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/10 bg-white/80 p-8 shadow-sm">
              <h2 className="text-2xl font-black tracking-tight">
                About Toollane
              </h2>

              <p className="mt-5 leading-8 text-black/65">
                Toollane is operated from Germany and focuses on fast,
                mobile-friendly and practical online tools for everyday digital
                work.
              </p>

              <div className="mt-6">
                <Link
                  href="/about"
                  className="text-sm font-bold underline underline-offset-4"
                >
                  Learn more about Toollane →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}