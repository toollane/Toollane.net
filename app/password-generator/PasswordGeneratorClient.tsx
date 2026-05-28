"use client";

import { useMemo, useState } from "react";

export default function PasswordGeneratorClient() {
  const [length, setLength] =
    useState(16);

  const [uppercase, setUppercase] =
    useState(true);

  const [lowercase, setLowercase] =
    useState(true);

  const [numbers, setNumbers] =
    useState(true);

  const [symbols, setSymbols] =
    useState(true);

  const password = useMemo(() => {
    let chars = "";

    if (uppercase) {
      chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }

    if (lowercase) {
      chars += "abcdefghijklmnopqrstuvwxyz";
    }

    if (numbers) {
      chars += "0123456789";
    }

    if (symbols) {
      chars += "!@#$%^&*()_+-=[]{}";
    }

    if (!chars) {
      return "";
    }

    let result = "";

    for (let i = 0; i < length; i++) {
      result +=
        chars[
          Math.floor(
            Math.random() *
              chars.length
          )
        ];
    }

    return result;
  }, [
    length,
    uppercase,
    lowercase,
    numbers,
    symbols,
  ]);

  const copyPassword = async () => {
    if (!password) {
      return;
    }

    await navigator.clipboard.writeText(
      password
    );
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Strong Password Generator
        </h2>

        <p className="text-black/60 leading-7">
          Generate secure random
          passwords instantly for
          websites, apps and online
          accounts.
        </p>
      </div>

      <div className="grid gap-6 bg-white border border-black/10 rounded-3xl p-6">
        <div>
          <div className="text-sm text-black/50 mb-2">
            Password Length
          </div>

          <input
            type="range"
            min={6}
            max={64}
            value={length}
            onChange={(e) =>
              setLength(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full"
          />

          <div className="mt-2 font-semibold">
            {length} characters
          </div>
        </div>

        <div className="grid gap-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) =>
                setUppercase(
                  e.target.checked
                )
              }
            />

            Uppercase Letters
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) =>
                setLowercase(
                  e.target.checked
                )
              }
            />

            Lowercase Letters
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={numbers}
              onChange={(e) =>
                setNumbers(
                  e.target.checked
                )
              }
            />

            Numbers
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={symbols}
              onChange={(e) =>
                setSymbols(
                  e.target.checked
                )
              }
            />

            Symbols
          </label>
        </div>
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Generated Password
        </div>

        <div className="break-all text-2xl font-bold">
          {password || "—"}
        </div>
      </div>

      <button
        onClick={copyPassword}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
      >
        Copy Password
      </button>
    </div>
  );
}