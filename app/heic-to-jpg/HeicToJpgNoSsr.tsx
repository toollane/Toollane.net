"use client";

import dynamic from "next/dynamic";

const HeicToJpgClient = dynamic(
  () => import("./HeicToJpgClient"),
  {
    ssr: false,
  }
);

export default function HeicToJpgNoSsr() {
  return <HeicToJpgClient />;
}