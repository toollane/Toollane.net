import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Toollane | Support, Feedback & Business Inquiries",
  description:
    "Contact Toollane for support, feedback, partnerships, business inquiries or questions about the online tools platform.",
  alternates: {
    canonical: "https://toollane.net/contact",
  },
  openGraph: {
    title: "Contact Toollane",
    description:
      "Contact Toollane for support, feedback, partnerships, business inquiries or questions about the online tools platform.",
    url: "https://toollane.net/contact",
    siteName: "Toollane",
    type: "website",
  },
};

const contactReasons = [
  {
    title: "Tool feedback",
    text: "Share feedback about an existing Toollane tool, report confusing results or suggest improvements.",
  },
  {
    title: "Bug reports",
    text: "Report technical issues, broken links, layout problems or unexpected behavior on a tool page.",
  },
  {
    title: "Business inquiries",
    text: "Contact Toollane about partnerships, collaborations, advertising or other business-related topics.",
  },
  {
    title: "Privacy or legal questions",
    text: "Ask questions related to privacy, terms, imprint information or the way Toollane operates.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#fff8df] text-[#171717]">
      <section className="relative overflow-hidden border-b border-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ffe680,_transparent_35%),radial-gradient(circle_at_top_right,_#ffd6e7,_transparent_30%)]" />

        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur">
            Contact Toollane
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Support, feedback and business inquiries
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-black/65">
            Use this page to contact Toollane about support questions, tool
            feedback, technical issues, partnerships or business inquiries.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="rounded-[2.5rem] border border-black/10 bg-white/80 p-8 shadow-sm backdrop-blur sm:p-12">
          <h2 className="text-3xl font-black tracking-tight">
            Email contact
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-black/65">
            For support, feedback, partnerships or business inquiries, please
            contact Toollane by email. Include the page URL, browser/device
            information and a short description if you are reporting a technical
            issue.
          </p>

          <div className="mt-8 rounded-2xl border border-black/10 bg-[#fff8df] p-6">
            <div className="text-sm font-bold text-black/50">
              Contact email
            </div>

            <a
              href="mailto:contact@toollane.net"
              className="mt-2 inline-flex text-xl font-black text-black underline underline-offset-4"
            >
              contact@toollane.net
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white/40">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight">
              What you can contact Toollane about
            </h2>

            <p className="mt-3 max-w-3xl text-black/60">
              Toollane is actively developed and improved. Feedback helps make
              the tools clearer, faster and more useful.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {contactReasons.map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm"
              >
                <h3 className="text-xl font-black">{item.title}</h3>

                <p className="mt-3 text-sm leading-7 text-black/60">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-black/10 bg-white/80 p-8 shadow-sm">
            <h2 className="text-2xl font-black tracking-tight">
              Legal and privacy information
            </h2>

            <p className="mt-5 leading-8 text-black/65">
              For legal information, privacy details and terms of use, please
              visit the dedicated pages below.
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
                href="/imprint"
                className="text-sm font-bold underline underline-offset-4"
              >
                Imprint →
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-white/80 p-8 shadow-sm">
            <h2 className="text-2xl font-black tracking-tight">
              About Toollane
            </h2>

            <p className="mt-5 leading-8 text-black/65">
              Toollane is a free online tools platform operated by Nicklas Wolf
              from Germany. The platform focuses on practical browser-based
              tools for productivity, SEO, PDFs, images, business, developers
              and everyday tasks.
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
      </section>
    </main>
  );
}