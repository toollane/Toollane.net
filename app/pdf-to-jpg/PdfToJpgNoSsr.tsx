"use client";

import dynamic from "next/dynamic";

const PdfToJpgClient = dynamic(() => import("./PdfToJpgClient"), {
  ssr: false,
  loading: () => (
    <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
      <div className="text-sm font-bold text-black">Loading converter...</div>

      <p className="mt-2 text-sm leading-6 text-black/60">
        The PDF to JPG converter is loading in your browser.
      </p>
    </div>
  ),
});

export default function PdfToJpgNoSsr() {
  return <PdfToJpgClient />;
}