"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type Rule = {
  id: string;
  userAgent: string;
  allow: string;
  disallow: string;
};

export default function RobotsTxtGeneratorClient() {
  const [sitemapUrl, setSitemapUrl] = useState("https://toollane.net/sitemap.xml");
  const [hostUrl, setHostUrl] = useState("https://toollane.net");
  const [crawlDelay, setCrawlDelay] = useState("");
  const [copied, setCopied] = useState(false);

  const [rules, setRules] = useState<Rule[]>([
    {
      id: crypto.randomUUID(),
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
  ]);

  const robotsTxt = useMemo(() => {
    const blocks = rules.map((rule) => {
      const lines = [`User-agent: ${rule.userAgent || "*"}`];

      if (rule.allow.trim()) {
        lines.push(`Allow: ${rule.allow.trim()}`);
      }

      if (rule.disallow.trim()) {
        lines.push(`Disallow: ${rule.disallow.trim()}`);
      }

      if (crawlDelay.trim()) {
        lines.push(`Crawl-delay: ${crawlDelay.trim()}`);
      }

      return lines.join("\n");
    });

    const extraLines = [];

    if (sitemapUrl.trim()) {
      extraLines.push(`Sitemap: ${sitemapUrl.trim()}`);
    }

    if (hostUrl.trim()) {
      extraLines.push(`Host: ${hostUrl.trim()}`);
    }

    return [...blocks, ...extraLines].filter(Boolean).join("\n\n");
  }, [rules, sitemapUrl, hostUrl, crawlDelay]);

  function updateRule(id: string, key: keyof Rule, value: string) {
    setRules((current) =>
      current.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              [key]: value,
            }
          : rule
      )
    );

    setCopied(false);
  }

  function addRule() {
    setRules((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        userAgent: "Googlebot",
        allow: "/",
        disallow: "",
      },
    ]);
  }

  function removeRule(id: string) {
    setRules((current) => current.filter((rule) => rule.id !== id));
  }

  function loadDefault() {
    setSitemapUrl("https://toollane.net/sitemap.xml");
    setHostUrl("https://toollane.net");
    setCrawlDelay("");
    setRules([
      {
        id: crypto.randomUUID(),
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
    ]);
    setCopied(false);
  }

  function loadStrict() {
    setSitemapUrl("https://toollane.net/sitemap.xml");
    setHostUrl("https://toollane.net");
    setCrawlDelay("");
    setRules([
      {
        id: crypto.randomUUID(),
        userAgent: "*",
        allow: "/",
        disallow: "/admin/",
      },
      {
        id: crypto.randomUUID(),
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
    ]);
    setCopied(false);
  }

  async function copyRobotsTxt() {
    await navigator.clipboard.writeText(robotsTxt);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  function downloadRobotsTxt() {
    const blob = new Blob([robotsTxt], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "robots.txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate robots.txt
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Create a clean robots.txt file for search engines. Add crawl rules,
          sitemap URLs and blocked paths for your website.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-black">Sitemap URL</span>

            <input
              value={sitemapUrl}
              onChange={(event) => {
                setSitemapUrl(event.target.value);
                setCopied(false);
              }}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
              placeholder="https://example.com/sitemap.xml"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">Host URL</span>

            <input
              value={hostUrl}
              onChange={(event) => {
                setHostUrl(event.target.value);
                setCopied(false);
              }}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
              placeholder="https://example.com"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-bold text-black">
            Crawl delay optional
          </span>

          <input
            value={crawlDelay}
            onChange={(event) => {
              setCrawlDelay(event.target.value);
              setCopied(false);
            }}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            placeholder="Example: 10"
          />
        </label>

        <div className="grid gap-4">
          {rules.map((rule, index) => (
            <div
              key={rule.id}
              className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="font-bold text-black">Rule #{index + 1}</div>

                {rules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRule(rule.id)}
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-black/5"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="text-sm font-bold text-black">
                    User-agent
                  </span>

                  <input
                    value={rule.userAgent}
                    onChange={(event) =>
                      updateRule(rule.id, "userAgent", event.target.value)
                    }
                    className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                    placeholder="*"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-black">Allow</span>

                  <input
                    value={rule.allow}
                    onChange={(event) =>
                      updateRule(rule.id, "allow", event.target.value)
                    }
                    className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                    placeholder="/"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-black">
                    Disallow
                  </span>

                  <input
                    value={rule.disallow}
                    onChange={(event) =>
                      updateRule(rule.id, "disallow", event.target.value)
                    }
                    className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                    placeholder="/admin/"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={addRule}
            className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
          >
            Add rule
          </button>

          <button
            type="button"
            onClick={loadDefault}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Default template
          </button>

          <button
            type="button"
            onClick={loadStrict}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Strict template
          </button>
        </div>
      </div>

      <ToolResultBox title="Generated robots.txt">
        <pre className="max-h-[520px] overflow-auto rounded-2xl border border-black/10 bg-white p-5 text-left font-mono text-sm leading-7 text-black">
          <code>{robotsTxt}</code>
        </pre>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={copyRobotsTxt}
            className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
          >
            {copied ? "Copied!" : "Copy robots.txt"}
          </button>

          <button
            type="button"
            onClick={downloadRobotsTxt}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Download robots.txt
          </button>
        </div>
      </ToolResultBox>

      <ToolInfoBox>
        A robots.txt file tells search engines which paths they may crawl. It
        does not protect private content. Sensitive pages should be protected by
        authentication, not only robots.txt.
      </ToolInfoBox>
    </div>
  );
}