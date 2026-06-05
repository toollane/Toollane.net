"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type Props = {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
};

export default function AdSenseBlock({
  slot,
  format = "auto",
}: Props) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {}
  }, []);

  return (
    <div className="my-10 overflow-hidden rounded-[2rem] border border-black/10 bg-white/70 p-4 shadow-sm backdrop-blur">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}