"use client";

import { useEffect, useState } from "react";

import {
  Html5QrcodeScanner,
} from "html5-qrcode";

export default function QrCodeScannerClient() {
  const [result, setResult] =
    useState("");

  useEffect(() => {
    const scanner =
      new Html5QrcodeScanner(

        {
          fps: 10,
          qrbox: 250,
        },
        false
      );

    scanner.render(
      (decodedText) => {
        setResult(decodedText);

        scanner.clear();
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          QR Code Scanner
        </h2>

        <p className="text-black/60 leading-7">
          Scan QR codes instantly
          using your device camera
          directly in your browser.
        </p>
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-4">
        <div id="qr-reader" />
      </div>

      {result && (
        <div className="bg-white border border-black/10 rounded-3xl p-6 break-all">
          <div className="font-semibold mb-3">
            Scan Result
          </div>

          <div className="text-black/70">
            {result}
          </div>

          <a
            href={result}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-black text-white rounded-2xl px-5 py-3 font-semibold"
          >
            Open Link
          </a>
        </div>
      )}
    </div>
  );
}