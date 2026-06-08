"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function xmlNodeToObject(node: Element): unknown {
  const children = Array.from(node.children);
  const attributes = Array.from(node.attributes);

  if (!children.length) {
    const text = node.textContent?.trim() || "";

    if (!attributes.length) {
      return text;
    }

    return {
      _attributes: Object.fromEntries(
        attributes.map((attribute) => [attribute.name, attribute.value])
      ),
      _text: text,
    };
  }

  const obj: Record<string, unknown> = {};

  if (attributes.length) {
    obj._attributes = Object.fromEntries(
      attributes.map((attribute) => [attribute.name, attribute.value])
    );
  }

  children.forEach((child) => {
    const value = xmlNodeToObject(child);
    const key = child.nodeName;

    if (obj[key]) {
      obj[key] = Array.isArray(obj[key])
        ? [...(obj[key] as unknown[]), value]
        : [obj[key], value];
    } else {
      obj[key] = value;
    }
  });

  return obj;
}

export default function XmlToJsonClient() {
  const [xml, setXml] = useState("");

  const result = useMemo(() => {
    if (!xml.trim()) {
      return {
        json: "",
        error: "",
      };
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "application/xml");
      const parserError = xmlDoc.querySelector("parsererror");

      if (parserError) {
        return {
          json: "",
          error: "Invalid XML input. Please check your XML syntax.",
        };
      }

      const root = xmlDoc.documentElement;

      const jsonObject = {
        [root.nodeName]: xmlNodeToObject(root),
      };

      return {
        json: JSON.stringify(jsonObject, null, 2),
        error: "",
      };
    } catch {
      return {
        json: "",
        error: "Could not convert XML to JSON.",
      };
    }
  }, [xml]);

  function loadExample() {
    setXml(`<user>
  <name>John</name>
  <email>john@example.com</email>
  <role>Admin</role>
</user>`);
  }

  function clearXml() {
    setXml("");
  }

  async function copyJson() {
    if (!result.json) return;

    await navigator.clipboard.writeText(result.json);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert XML to JSON
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Paste XML data and instantly convert it into readable JSON directly in
          your browser.
        </p>
      </div>

      {result.error && <ToolErrorBox message={result.error} />}

      <ToolResultBox title="XML input">
        <textarea
          value={xml}
          onChange={(event) => setXml(event.target.value)}
          placeholder={`<user>
  <name>John</name>
  <email>john@example.com</email>
</user>`}
          rows={12}
          className="w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition placeholder:text-black/35 focus:border-black"
        />

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadExample}
            className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
          >
            Load example
          </button>

          <button
            type="button"
            onClick={clearXml}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Clear
          </button>
        </div>
      </ToolResultBox>

      <ToolResultBox title="JSON output">
        <pre className="min-h-[180px] whitespace-pre-wrap break-words rounded-[2rem] border border-black/10 bg-white p-5 font-mono text-sm leading-7 text-black">
          {result.json || "Converted JSON will appear here."}
        </pre>

        <button
          type="button"
          onClick={copyJson}
          disabled={!result.json}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Copy JSON
        </button>
      </ToolResultBox>

      <ToolInfoBox>
        This XML to JSON converter runs in your browser. It is useful for
        developers, API testing, configuration files and data transformation
        workflows.
      </ToolInfoBox>
    </div>
  );
}