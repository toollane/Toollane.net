import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Toollane | Free Online Tools",
  description:
    "Learn more about Toollane, a fast and privacy-friendly online tools platform for creators, developers, marketers, businesses and everyday users.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fff8df] text-[#171717]">
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-black/10 bg-white/80 p-8 shadow-sm backdrop-blur sm:p-12">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            About Toollane
          </h1>

          <div className="mt-8 space-y-6 text-black/70 leading-8">
            <p>
              Toollane is a growing collection of fast, modern and free online
              tools for creators, developers, marketers, businesses and everyday
              users.
            </p>

            <p>
              The goal of Toollane is simple: make common digital tasks easier.
              Whether you need to convert files, format text, calculate business
              metrics, generate ideas or prepare content, Toollane aims to offer
              simple tools that work quickly in the browser.
            </p>

            <p>
              Many Toollane tools are designed to run directly on your device.
              This helps keep the experience fast and privacy-friendly because
              files and inputs often do not need to be uploaded to a server.
            </p>

            <p>
              Toollane is operated by Nicklas Wolf from Germany. The platform is
              actively developed and improved with a focus on usability,
              performance, mobile-friendly design and clear navigation.
            </p>

            <p>
              For questions, feedback or legal information, please visit the
              Contact, Privacy Policy, Terms and Imprint pages linked in the
              footer.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}