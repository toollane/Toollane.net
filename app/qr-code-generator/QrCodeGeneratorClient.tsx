"use client";

import { useEffect, useState } from "react";

import QRCode from "qrcode";

export default function QrCodeGeneratorClient() {
  const [text, setText] =
    useState("");

  const [qrCode, setQrCode] =
    useState("");

  useEffect(() => {
    if (!text.trim()) {
      setQrCode("");
      return;
    }

    QRCode.toDataURL(text, {
      width: 500,
      margin: 2,
    })
      .then(setQrCode)
      .catch(() =>
        setQrCode("")
      );
  }, [text]);

  const downloadQrCode = () => {
    if (!qrCode) {
      return;
    }

    const link =
      document.createElement("a");

    link.href = qrCode;
    link.download = "qr-code.png";
    link.click();
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          QR Code Generator
        </h2>

        <p className="text-black/60 leading-7">
          Generate QR codes instantly
          for URLs, WiFi, social media,
          business cards and more.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(event) =>
          setText(event.target.value)
        }
        placeholder="Enter URL, text, email or any content..."
        rows={5}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      {qrCode ? (
        <div className="grid gap-6">
          <div className="bg-white border border-black/10 rounded-3xl p-8 flex justify-center">
            <img
              src={qrCode}
              alt="Generated QR Code"
              className="w-full max-w-sm"
            />
          </div>

          <button
            onClick={
              downloadQrCode
            }
            className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
          >
            Download QR Code
          </button>
        </div>
      ) : (
        <div className="bg-white border border-black/10 rounded-3xl p-6 text-black/40">
          Enter text or a URL to
          generate a QR code.
        </div>
      )}
    </div>
  );
}