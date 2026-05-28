"use client";

import { useMemo, useState } from "react";

export default function OpenGraphGeneratorClient() {
  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [image, setImage] =
    useState("");

  const [url, setUrl] =
    useState("");

  const output = useMemo(() => {
    return `<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${image}" />
<meta property="og:url" content="${url}" />
<meta property="og:type" content="website" />`;
  }, [
    title,
    description,
    image,
    url,
  ]);

  const copyOutput = async () => {
    await navigator.clipboard.writeText(
      output
    );
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Open Graph Generator
        </h2>

        <p className="text-black/60 leading-7">
          Generate Open Graph meta
          tags instantly for websites
          and social sharing.
        </p>
      </div>

      <input
        value={title}
        onChange={(event) =>
          setTitle(
            event.target.value
          )
        }
        placeholder="Page Title"
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <textarea
        value={description}
        onChange={(event) =>
          setDescription(
            event.target.value
          )
        }
        placeholder="Meta Description"
        rows={4}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <input
        value={image}
        onChange={(event) =>
          setImage(
            event.target.value
          )
        }
        placeholder="Image URL"
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <input
        value={url}
        onChange={(event) =>
          setUrl(
            event.target.value
          )
        }
        placeholder="Website URL"
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
        Copy Meta Tags
      </button>
    </div>
  );
}