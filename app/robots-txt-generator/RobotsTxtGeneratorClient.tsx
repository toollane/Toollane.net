"use client";

import { useMemo, useState } from "react";

export default function RobotsTxtGeneratorClient() {
  const [sitemap, setSitemap] =
    useState("");

  const [disallow, setDisallow] =
    useState("");

  const output = useMemo(() => {
    return `User-agent: *
Disallow: ${disallow}

Sitemap: ${sitemap}`;
  }, [sitemap, disallow]);

  const copyOutput = async () => {
    await navigator.clipboard.writeText(
      output
    );
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Robots.txt Generator
        </h2>

        <p className="text-black/60 leading-7">
          Generate robots.txt files
          instantly for search engine
          crawling and SEO.
        </p>
      </div>

      <input
        value={disallow}
        onChange={(event) =>
          setDisallow(
            event.target.value
          )
        }
        placeholder="/private/"
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <input
        value={sitemap}
        onChange={(event) =>
          setSitemap(
            event.target.value
          )
        }
        placeholder="https://example.com/sitemap.xml"
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <pre className="whitespace-pre-wrap break-words text-sm font-mono">
          {output}
        </pre>
      </div>

      <button
        onClick={copyOutput}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
      >
        Copy robots.txt
      </button>
    </div>
  );
}