"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type Separator = "-" | "_" | "";

function generateSlug(
  text: string,
  separator: Separator,
  lowercase: boolean,
  removeNumbers: boolean,
) {
  let value = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (lowercase) {
    value = value.toLowerCase();
  }

  if (removeNumbers) {
    value = value.replace(/[0-9]/g, "");
  }

  value = value
    .replace(/[^a-zA-Z0-9\s-_]/g, "")
    .trim()
    .replace(/[\s_-]+/g, separator);

  if (separator) {
    const escaped = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    value = value
      .replace(new RegExp(`^${escaped}+`), "")
      .replace(new RegExp(`${escaped}+$`), "");
  }

  return value;
}

export default function SlugGeneratorClient() {
  const [text, setText] = useState(
    "How to Create SEO Friendly URLs for Your Website"
  );

  const [separator, setSeparator] = useState<Separator>("-");
  const [lowercase, setLowercase] = useState(true);
  const [removeNumbers, setRemoveNumbers] = useState(false);

  const result = useMemo(() => {
    const slug = generateSlug(
      text,
      separator,
      lowercase,
      removeNumbers
    );

    return {
      slug,
      length: slug.length,
      words: slug ? slug.split(separator || " ").filter(Boolean).length : 0,
    };
  }, [text, separator, lowercase, removeNumbers]);

  async function copyResult() {
    await navigator.clipboard.writeText(result.slug);
  }

  function resetExample() {
    setText("How to Create SEO Friendly URLs for Your Website");
    setSeparator("-");
    setLowercase(true);
    setRemoveNumbers(false);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate SEO friendly slugs
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Convert titles and text into clean URL slugs for blog posts, products,
          categories and landing pages.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="min-h-[180px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none transition focus:border-black"
        placeholder="Enter your title or text..."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-black">Separator</span>

          <select
            value={separator}
            onChange={(event) =>
              setSeparator(event.target.value as Separator)
            }
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="-">Hyphen -</option>
            <option value="_">Underscore _</option>
            <option value="">No separator</option>
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle
          label="Convert to lowercase"
          checked={lowercase}
          onChange={setLowercase}
        />

        <Toggle
          label="Remove numbers"
          checked={removeNumbers}
          onChange={setRemoveNumbers}
        />
      </div>

      <ToolResultBox title="Generated slug">
        <textarea
          readOnly
          value={result.slug}
          className="min-h-[120px] w-full resize-none rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none"
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ResultCard label="Characters" value={result.length.toLocaleString()} />
          <ResultCard label="Words" value={result.words.toLocaleString()} />
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copyResult}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Copy slug
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset example
        </button>
      </div>

      <ToolInfoBox>
        SEO slugs should usually be short, readable and descriptive. Hyphens are
        commonly preferred for URLs and search engines.
      </ToolInfoBox>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
      <span className="text-sm font-bold text-black">{label}</span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-black"
      />
    </label>
  );
}

function ResultCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-xl font-black text-black">{value}</div>
    </div>
  );
}