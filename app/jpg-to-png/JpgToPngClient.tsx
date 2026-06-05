"use client";

import { useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type ConvertedImage = {
  url: string;
  originalName: string;
  originalSize: number;
  convertedSize: number;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image could not be loaded."));
    };

    image.src = url;
  });
}

export default function JpgToPngClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [convertedImage, setConvertedImage] =
    useState<ConvertedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(selectedFiles: FileList | File[]) {
    setError("");

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (convertedImage) {
      URL.revokeObjectURL(convertedImage.url);
    }

    setConvertedImage(null);

    const selectedFile = Array.from(selectedFiles)[0];

    if (!selectedFile) return;

    const isJpg =
      selectedFile.type === "image/jpeg" ||
      selectedFile.name.toLowerCase().endsWith(".jpg") ||
      selectedFile.name.toLowerCase().endsWith(".jpeg");

    if (!isJpg) {
      setError("Please select a valid JPG or JPEG image.");
      setFile(null);
      setPreviewUrl("");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  }

  function clearImage() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (convertedImage) {
      URL.revokeObjectURL(convertedImage.url);
    }

    setFile(null);
    setPreviewUrl("");
    setConvertedImage(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function convertImage() {
    setError("");

    if (!file) {
      setError("Please select a JPG image first.");
      return;
    }

    if (convertedImage) {
      URL.revokeObjectURL(convertedImage.url);
      setConvertedImage(null);
    }

    setLoading(true);

    try {
      const image = await loadImage(file);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas is not supported.");
      }

      canvas.width = image.width;
      canvas.height = image.height;

      context.drawImage(image, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });

      if (!blob) {
        throw new Error("Could not create PNG image.");
      }

      const url = URL.createObjectURL(blob);

      setConvertedImage({
        url,
        originalName: file.name,
        originalSize: file.size,
        convertedSize: blob.size,
      });
    } catch {
      setError(
        "Something went wrong while converting the JPG image. Please try another file."
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadImage() {
    if (!convertedImage) return;

    const cleanName = convertedImage.originalName.replace(/\.[^.]+$/, "");
    const link = document.createElement("a");

    link.href = convertedImage.url;
    link.download = `${cleanName}.png`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert JPG to PNG
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Upload a JPG image and convert it to PNG directly in your browser.
          Your image stays on your device and is not uploaded.
        </p>
      </div>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
        className="rounded-[2rem] border-2 border-dashed border-black/15 bg-[#fff8df] p-6 text-center transition hover:border-black/25 sm:p-8"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,.jpg,.jpeg"
          onChange={(event) => {
            if (event.target.files) {
              handleFiles(event.target.files);
            }
          }}
          className="hidden"
        />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-sm font-black text-white">
          JPG
        </div>

        <h3 className="mt-5 text-lg font-bold text-black">
          Drop a JPG image here
        </h3>

        <p className="mt-2 text-sm leading-6 text-black/60">
          Choose one JPG or JPEG image to convert to PNG.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Choose JPG image
        </button>
      </div>

      {error && <ToolErrorBox message={error} />}

      {file && previewUrl ? (
        <ToolResultBox title="Selected image">
          <div className="grid gap-4 sm:grid-cols-[140px_1fr] sm:items-center">
            <img
              src={previewUrl}
              alt={file.name}
              className="h-32 w-full rounded-2xl border border-black/10 object-contain sm:h-32"
            />

            <div className="min-w-0 rounded-2xl border border-black/10 bg-white p-4">
              <div className="truncate font-bold text-black">{file.name}</div>

              <div className="mt-1 text-xs text-black/50">
                Original size: {formatFileSize(file.size)}
              </div>
            </div>
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Upload a JPG image to convert it into PNG format. PNG is useful for
          screenshots, graphics and high-quality image workflows.
        </ToolInfoBox>
      )}

      {convertedImage && (
        <ToolResultBox title="Converted PNG">
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                  Original
                </div>

                <div className="mt-2 text-lg font-black text-black">
                  {formatFileSize(convertedImage.originalSize)}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                  PNG file
                </div>

                <div className="mt-2 text-lg font-black text-black">
                  {formatFileSize(convertedImage.convertedSize)}
                </div>
              </div>
            </div>

            <img
              src={convertedImage.url}
              alt="Converted PNG result"
              className="max-h-[420px] w-full rounded-2xl border border-black/10 bg-white object-contain p-3"
            />

            <button
              type="button"
              onClick={downloadImage}
              className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              Download PNG
            </button>
          </div>
        </ToolResultBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={convertImage}
          disabled={!file || loading}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Converting image..." : "Convert to PNG"}
        </button>

        <button
          type="button"
          onClick={clearImage}
          disabled={!file || loading}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear image
        </button>
      </div>
    </div>
  );
}