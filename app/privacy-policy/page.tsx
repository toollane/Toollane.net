import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Toollane",
  description:
    "Read the Toollane Privacy Policy and learn how Toollane handles browser-based tools, contact requests, cookies, analytics and advertising services.",
  alternates: {
    canonical: "https://toollane.net/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Toollane",
    description:
      "Read the Toollane Privacy Policy and learn how Toollane handles browser-based tools, contact requests, cookies, analytics and advertising services.",
    url: "https://toollane.net/privacy-policy",
    siteName: "Toollane",
    type: "website",
  },
};

const sections = [
  {
    title: "1. Overview",
    content: [
      "Toollane respects your privacy and aims to provide fast, useful and privacy-aware online tools. This Privacy Policy explains what information may be processed when you use Toollane, how browser-based tools work and how third-party services such as analytics or advertising may be used.",
      "Toollane is operated by Nicklas Wolf from Germany. If you have questions about this Privacy Policy, you can contact Toollane by email.",
    ],
  },
  {
    title: "2. Information you provide",
    content: [
      "When you use Toollane, you may enter text, values, files, settings or other information into a tool. Many tools are designed to process this information directly in your browser where possible.",
      "If you contact Toollane by email, the information you send, such as your email address, message content and any details you provide, may be used to respond to your request.",
    ],
  },
  {
    title: "3. Browser-based tool processing",
    content: [
      "Many Toollane tools are designed to run directly in your browser. This can mean that files, text or other inputs are processed locally on your device instead of being uploaded to a Toollane server for processing.",
      "The exact behavior may vary by tool, file type, browser support and technical requirements. You should avoid entering highly sensitive personal, financial, medical, legal or confidential information into online tools unless you are comfortable doing so.",
    ],
  },
  {
    title: "4. Automatically processed technical information",
    content: [
      "When you visit Toollane, standard technical information may be processed automatically by hosting providers, browser technologies or security systems. This may include information such as your IP address, browser type, device type, pages visited, referrer information, timestamps and basic usage data.",
      "This information may be used to provide the website, improve performance, understand usage patterns, prevent abuse and maintain the security and reliability of the platform.",
    ],
  },
  {
    title: "5. Cookies and similar technologies",
    content: [
      "Toollane may use cookies or similar technologies for website functionality, analytics, advertising, performance measurement and user experience improvements.",
      "You can usually manage or block cookies through your browser settings. Some features may not work correctly if cookies or browser storage are disabled.",
    ],
  },
  {
    title: "6. Analytics",
    content: [
      "Toollane may use analytics services to understand how users interact with the website, which tools are used, which pages need improvement and how the platform performs across devices.",
      "Analytics data may include usage information such as visited pages, device information, browser information and interaction patterns. Analytics is used to improve the website and user experience.",
    ],
  },
  {
    title: "7. Advertising and Google AdSense",
    content: [
      "Toollane may use advertising services such as Google AdSense. Third-party vendors, including Google, may use cookies to serve ads based on a user's prior visits to Toollane or other websites.",
      "Google's use of advertising cookies enables Google and its partners to serve ads to users based on visits to Toollane and/or other sites on the internet.",
      "Third-party ad providers may place or read cookies in your browser, use web beacons or use similar technologies to collect information for ad serving, personalization, measurement and fraud prevention, where permitted by applicable law and user consent settings.",
    ],
  },
  {
    title: "8. Consent for users in certain regions",
    content: [
      "For users in regions where consent is required, such as the European Economic Area, the United Kingdom or Switzerland, Toollane may display a consent notice or cookie banner before using certain cookies or advertising technologies.",
      "Where required, users may be asked to provide consent for personalized ads, cookies, analytics or similar technologies. Users may also be able to change their consent choices depending on the consent tool used on the website.",
    ],
  },
  {
    title: "9. External links",
    content: [
      "Toollane may link to external websites, services or third-party resources. Toollane is not responsible for the content, privacy practices or policies of external websites.",
      "When you leave Toollane and visit another website, the privacy policy of that external website applies.",
    ],
  },
  {
    title: "10. Data retention",
    content: [
      "Toollane keeps personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by law.",
      "Email inquiries may be retained for a reasonable period to handle support, legal, business or administrative needs.",
    ],
  },
  {
    title: "11. Your rights",
    content: [
      "Depending on your location and applicable law, you may have rights related to your personal information. These may include the right to request access, correction, deletion, restriction, objection or portability.",
      "To make a privacy-related request, contact Toollane by email. Toollane may need to verify your request before responding.",
    ],
  },
  {
    title: "12. Children's privacy",
    content: [
      "Toollane is a general online tools platform and is not intended to knowingly collect personal information from children.",
      "Baby name pages and baby name tools are intended as informational resources for parents and name research. They are not intended to collect personal information from children.",
    ],
  },
  {
    title: "13. Changes to this Privacy Policy",
    content: [
      "Toollane may update this Privacy Policy from time to time to reflect changes in the website, tools, legal requirements or third-party services.",
      "The updated version will be published on this page. Continued use of Toollane after changes are published means you accept the updated Privacy Policy.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#fff8df] text-[#171717]">
      <section className="relative overflow-hidden border-b border-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ffe680,_transparent_35%),radial-gradient(circle_at_top_right,_#ffd6e7,_transparent_30%)]" />

        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur">
            Privacy Policy
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            How Toollane handles privacy, cookies and advertising
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-black/65">
            This Privacy Policy explains how Toollane may process information
            when you use the website, contact Toollane, use browser-based tools
            or interact with analytics and advertising technologies.
          </p>

          <p className="mt-5 text-sm font-bold text-black/50">
            Last updated: June 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="rounded-[2.5rem] border border-black/10 bg-white/80 p-8 shadow-sm backdrop-blur sm:p-12">
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-black tracking-tight text-black">
                  {section.title}
                </h2>

                <div className="mt-5 space-y-4 text-black/70 leading-8">
                  {section.content.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white/40">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-black/10 bg-white/80 p-8 shadow-sm">
              <h2 className="text-2xl font-black tracking-tight">
                Advertising choices
              </h2>

              <p className="mt-5 leading-8 text-black/65">
                Users can learn more about how Google uses information from
                sites and apps that use Google services, and can manage certain
                advertising preferences through Google&apos;s advertising
                settings.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold underline underline-offset-4"
                >
                  Google partner sites policy →
                </a>

                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold underline underline-offset-4"
                >
                  Google ad settings →
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/10 bg-white/80 p-8 shadow-sm">
              <h2 className="text-2xl font-black tracking-tight">
                Contact and related pages
              </h2>

              <p className="mt-5 leading-8 text-black/65">
                For privacy-related questions, contact Toollane by email. You
                can also review the Terms, Imprint and Contact pages for more
                information about Toollane.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="text-sm font-bold underline underline-offset-4"
                >
                  Contact →
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
          </div>
        </div>
      </section>
    </main>
  );
}