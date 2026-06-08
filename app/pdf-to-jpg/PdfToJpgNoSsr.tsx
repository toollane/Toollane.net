"use client";

import dynamic from "next/dynamic";

const PdfToJpgClient = dynamic(
  () => import("./PdfToJpgClient"),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-3xl border border-black/10 bg-white p-6 text-black/60">
        Loading converter...
      </div>
    ),
  }
);

export default function PdfToJpgNoSsr() {
  return <PdfToJpgClient />;
}