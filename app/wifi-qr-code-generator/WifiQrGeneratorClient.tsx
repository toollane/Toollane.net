"use client";

import { useMemo, useState } from "react";

import QRCode from "react-qr-code";

import ToolInfoBox from "@/components/ToolInfoBox";

type Security = "WPA" | "WEP" | "nopass";

export default function WifiQrCodeGeneratorClient() {
  const [ssid, setSsid] = useState("MyWiFi");
  const [password, setPassword] = useState("password123");
  const [security, setSecurity] =
    useState<Security>("WPA");

  const qrValue = useMemo(() => {
    return `WIFI:T:${security};S:${ssid};P:${password};;`;
  }, [ssid, password, security]);

  function downloadQr() {
    const svg = document.getElementById("wifi-qr");

    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const blob = new Blob([source], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "wifi-qr-code.svg";
    link.click();

    URL.revokeObjectURL(url);
  }

  function resetExample() {
    setSsid("MyWiFi");
    setPassword("password123");
    setSecurity("WPA");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate WiFi QR codes
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Create scannable WiFi QR codes for guests, offices, events, cafes and
          smart devices.
        </p>
      </div>

      <div className="grid gap-4">
        <Input label="WiFi name (SSID)" value={ssid} onChange={setSsid} />

        <Input label="Password" value={password} onChange={setPassword} />

        <label className="block">
          <span className="text-sm font-bold text-black">
            Security type
          </span>

          <select
            value={security}
            onChange={(event) =>
              setSecurity(event.target.value as Security)
            }
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="WPA">WPA / WPA2</option>
            <option value="WEP">WEP</option>
            <option value="nopass">No password</option>
          </select>
        </label>
      </div>

      <div className="flex justify-center rounded-[2rem] border border-black/10 bg-white p-8">
        <QRCode
          id="wifi-qr"
          value={qrValue}
          size={260}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={downloadQr}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Download QR code
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset
        </button>
      </div>

      <ToolInfoBox>
        Install the required package before using this component:
        <br />
        <br />
        <code>npm install react-qr-code</code>
      </ToolInfoBox>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />
    </label>
  );
}