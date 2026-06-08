import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imprint | Toollane",
  description: "Legal notice and provider information for Toollane.",
  alternates: {
    canonical: "/imprint",
  },
};

export default function ImprintPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-8">
        Imprint
      </h1>

      <div className="space-y-8 text-gray-700 leading-7">
        <section>
          <h2 className="font-semibold mb-2">
            Information according to § 5 DDG
          </h2>

          <p>
            Nicklas Wolf<br />
            Am Dorfe 3<br />
            37133 Friedland<br />
            Germany
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">
            Contact
          </h2>

          <p>
            Email:{" "}
            <a
              href="mailto:toolfixio@gmail.com"
              className="underline"
            >
              toolfixio@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">
            Responsible for content
          </h2>

          <p>
            Nicklas Wolf
          </p>
        </section>
      </div>
    </main>
  );
}