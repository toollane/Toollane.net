"use client";

import { useState } from "react";

import { removeBackground } from "@imgly/background-removal";

export default function BackgroundRemoverClient() {
  const [file, setFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const removeImageBackground =
    async () => {
      if (!file) {
        return;
      }

      setLoading(true);

      try {
        const blob =
          await removeBackground(file);

        const url =
          URL.createObjectURL(blob);

        setPreview(url);

        const link =
          document.createElement(

          );

        link.href = url;

        link.download =
          "background-removed.png";

        link.click();
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Background Remover
        </h2>

        <p className="text-black/60 leading-7">
          Remove image backgrounds
          instantly in your browser
          without uploading files.
        </p>
      </div>

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => {
          const selectedFile =
            event.target.files?.[0] ||
            null;

          setFile(selectedFile);

          if (selectedFile) {
            setPreview(
              URL.createObjectURL(
                selectedFile
              )
            );
          }
        }}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <button
        onClick={
          removeImageBackground
        }
        disabled={!file || loading}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold disabled:opacity-50"
      >
        {loading
          ? "Removing Background..."
          : "Remove Background"}
      </button>

      {preview && (
        <div className="bg-white border border-black/10 rounded-3xl p-6 grid gap-4">
          <div className="font-semibold">
            Preview
          </div>

          <img
            src={preview}
            alt="Preview"
            className="max-w-full rounded-2xl border border-black/10"
          />
        </div>
      )}
    </div>
  );
}