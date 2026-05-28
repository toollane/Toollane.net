"use client";

import { useState } from "react";

import heic2any from "heic2any";

export default function HeicToJpgClient() {
  const [preview, setPreview] =
    useState("");

  const [converted, setConverted] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setLoading(true);
    setError("");
    setConverted("");

    try {
      const convertedBlob =
        (await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.92,
        })) as Blob;

      const previewUrl =
        URL.createObjectURL(file);

      const convertedUrl =
        URL.createObjectURL(
          convertedBlob
        );

      setPreview(previewUrl);
      setConverted(convertedUrl);
    } catch {
      setError(

      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          HEIC to JPG Converter
        </h2>

        <p className="text-black/60 leading-7">
          Convert iPhone HEIC photos
          into JPG instantly in your
          browser.
        </p>
      </div>

      <input
        type="file"
        accept=".heic,image/heic"
        onChange={
          handleFileChange
        }
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      {loading && (
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          Converting image...
        </div>
      )}

      {error && (
        <div className="bg-white border border-black/10 rounded-3xl p-6 text-red-500">
          {error}
        </div>
      )}

      {preview && (
        <div className="grid gap-6">
          <div>
            <div className="text-sm text-black/50 mb-2">
              Original HEIC
            </div>

            <img
              src={preview}
              alt="Original HEIC"
              className="max-w-full rounded-3xl border border-black/10"
            />
          </div>

          {converted && (
            <>
              <div>
                <div className="text-sm text-black/50 mb-2">
                  Converted JPG
                </div>

                <img
                  src={converted}
                  alt="Converted JPG"
                  className="max-w-full rounded-3xl border border-black/10"
                />
              </div>

              <a
                href={converted}
                download="converted-image.jpg"
                className="bg-black text-white rounded-2xl px-6 py-4 font-semibold text-center"
              >
                Download JPG
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}