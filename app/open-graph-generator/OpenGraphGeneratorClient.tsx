"use client";

import { useMemo, useState } from "react";

import ToolResultBox from "@/components/ToolResultBox";

export default function OpenGraphGeneratorClient() {
  const [title, setTitle] = useState(
    "Example Website"
  );

  const [description, setDescription] = useState(
    "Example website description for social sharing."
  );

  const [url, setUrl] = useState(
    "https://example.com"
  );

  const [image, setImage] = useState(
    "https://example.com/og-image.jpg"
  );

  const [siteName, setSiteName] = useState(
    "Example"
  );

  const result = useMemo(() => {
    return `<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${image}" />
<meta property="og:site_name" content="${siteName}" />
<meta property="og:type" content="website" />`;
  }, [title, description, url, image, siteName]);

  async function copyResult() {
    await navigator.clipboard.writeText(result);
  }

  function resetExample() {
    setTitle("Example Website");

    setDescription(
      "Example website description for social sharing."
    );

    setUrl("https://example.com");

    setImage(
      "https://example.com/og-image.jpg"
    );

    setSiteName("Example");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate Open Graph meta tags
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Create Open Graph tags for Facebook, LinkedIn, X/Twitter previews and
          social sharing optimization.
        </p>
      </div>

      <div className="grid gap-4">
        <Input label="Page title" value={title} onChange={setTitle} />

        <Textarea
          label="Description"
          value={description}
          onChange={setDescription}
        />

        <Input label="Page URL" value={url} onChange={setUrl} />

        <Input label="Image URL" value={image} onChange={setImage} />

        <Input
          label="Site name"
          value={siteName}
          onChange={setSiteName}
        />
      </div>

      <ToolResultBox title="Generated Open Graph tags">
        <textarea
          readOnly
          value={result}
          className="min-h-[260px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm text-black outline-none"
        />
      </ToolResultBox>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={copyResult}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Copy tags
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-3 min-h-[140px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm text-black outline-none transition focus:border-black"
      />
    </label>
  );
}