"use client";

import { useEffect, useState } from "react";

import QRCode from "qrcode";

export default function WifiQrGeneratorClient() {
  const [ssid, setSsid] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [security, setSecurity] =
    useState("WPA");

  const [qrCode, setQrCode] =
    useState("");

  useEffect(() => {
    if (!ssid.trim()) {
      setQrCode("");
      return;
    }

    const wifiString =
      `WIFI:T:${security};S:${ssid};P:${password};;`;

    QRCode.toDataURL(wifiString, {
      width: 500,
      margin: 2,
    })
      .then(setQrCode)
      .catch(() =>
        setQrCode("")
      );
  }, [
    ssid,
    password,
    security,
  ]);

  const downloadQrCode = () => {
    if (!qrCode) {
      return;
    }

    const link =
      document.createElement("a");

    link.href = qrCode;
    link.download = "wifi-qr-code.png";
    link.click();
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          WiFi QR Generator
        </h2>

        <p className="text-black/60 leading-7">
          Create a scannable WiFi QR
          code for guests, offices,
          cafés and homes instantly.
        </p>
      </div>

      <input
        value={ssid}
        onChange={(event) =>
          setSsid(event.target.value)
        }
        placeholder="WiFi Name (SSID)"
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <input
        value={password}
        onChange={(event) =>
          setPassword(
            event.target.value
          )
        }
        placeholder="WiFi Password"
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <select
        value={security}
        onChange={(event) =>
          setSecurity(
            event.target.value
          )
        }
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      >
        <option value="WPA">
          WPA/WPA2
        </option>

        <option value="WEP">
          WEP
        </option>

        <option value="nopass">
          No Password
        </option>
      </select>

      {qrCode ? (
        <div className="grid gap-6">
          <div className="bg-white border border-black/10 rounded-3xl p-8 flex justify-center">
            <img
              src={qrCode}
              alt="WiFi QR Code"
              className="w-full max-w-sm"
            />
          </div>

          <button
            onClick={
              downloadQrCode
            }
            className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
          >
            Download WiFi QR
          </button>
        </div>
      ) : (
        <div className="bg-white border border-black/10 rounded-3xl p-6 text-black/40">
          Enter WiFi information to
          generate a QR code.
        </div>
      )}
    </div>
  );
}