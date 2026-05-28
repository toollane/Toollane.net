"use client";

import { useMemo, useState } from "react";

function xmlNodeToObject(node: Element): unknown {
  const obj: Record<string, unknown> = {};

  if (
    node.children.length === 0
  ) {
    return node.textContent || "";
  }

  Array.from(node.children).forEach(
    (child) => {
      obj[child.nodeName] =
        xmlNodeToObject(child);
    }
  );

  return obj;
}

export default function XmlToJsonClient() {
  const [xml, setXml] =
    useState("");

  const result = useMemo(() => {
    if (!xml.trim()) {
      return {
        json: "",
        error: "",
      };
    }

    try {
      const parser =
        new DOMParser();

      const xmlDoc =
        parser.parseFromString(
          xml,

        );

      const parserError =
        xmlDoc.querySelector(

        );

      if (parserError) {
        return {
          json: "",
          error:

        };
      }

      const root =
        xmlDoc.documentElement;

      const jsonObject = {
        [root.nodeName]:
          xmlNodeToObject(root),
      };

      return {
        json: JSON.stringify(
          jsonObject,
          null,
          2
        ),
        error: "",
      };
    } catch {
      return {
        json: "",
        error:

      };
    }
  }, [xml]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          XML to JSON Converter
        </h2>

        <p className="text-black/60 leading-7">
          Convert XML data into
          readable JSON instantly
          in your browser.
        </p>
      </div>

      <textarea
        value={xml}
        onChange={(event) =>
          setXml(event.target.value)
        }
        placeholder={`<user>
  <name>John</name>
  <email>john@example.com</email>
</user>`}
        rows={12}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white font-mono text-sm"
      />

      {result.error && (
        <div className="bg-white border border-black/10 rounded-3xl p-6 text-red-500">
          {result.error}
        </div>
      )}

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          JSON Output
        </div>

        <pre className="whitespace-pre-wrap break-words text-sm font-mono">
          {result.json || "—"}
        </pre>
      </div>
    </div>
  );
}