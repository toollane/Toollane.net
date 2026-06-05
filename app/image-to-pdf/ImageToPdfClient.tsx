"use client";

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type ImageFile = {
  id: string;
  file: File;
  previewUrl: string;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function ImageToPdfClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [images, setImages] = useState<ImageFile[]>([]);
  const [pageSize, setPageSize] = useState<"fit" | "a4">("fit");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function addImages(selectedFiles: FileList | File[]) {
    setError("");

    const imageFiles = Array.from(selectedFiles).filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );

    if (!imageFiles.length) {
      setError("Please select JPG or PNG image files.");
      return;
    }

    const nextImages = imageFiles.map((file) => ({
      id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...nextImages]);
  }

  function removeImage(id: string) {
    setImages((current) => {
      const item = current.find((image) => image.id === id);

      if (item) {
        URL.revokeObjectURL(item.previewUrl);
      }

      return current.filter((image) => image.id !== id);
    });
  }

  function clearImages() {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));

    setImages([]);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function moveImage(id: string, direction: "up" | "down") {
    setImages((current) => {
      const index = current.findIndex((image) => image.id === id);

      if (index === -1) return current;

      const nextIndex = direction === "up" ? index - 1 : index + 1;

      if (nextIndex < 0 || nextIndex >= current.length) return current;

      const updated = [...current];
      const temp = updated[index];

      updated[index] = updated[nextIndex];
      updated[nextIndex] = temp;

      return updated;
    });
  }

  async function createPdf() {
    setError("");

    if (!images.length) {
      setError("Please select at least one image.");
      return;
    }

    setLoading(true);

    try {
      const pdf = await PDFDocument.create();

      for (const image of images) {
        const bytes = await image.file.arrayBuffer();

        const embeddedImage =
          image.file.type === "image/png"
            ? await pdf.embedPng(bytes)
            : await pdf.embedJpg(bytes);

        const originalWidth = embeddedImage.width;
        const originalHeight = embeddedImage.height;

        if (pageSize === "fit") {
          const page = pdf.addPage([originalWidth, originalHeight]);

          page.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: originalWidth,
            height: originalHeight,
          });
        } else {
          const a4Width = 595.28;
          const a4Height = 841.89;
          const margin = 36;

          const page = pdf.addPage([a4Width, a4Height]);
          const maxWidth = a4Width - margin * 2;
          const maxHeight = a4Height - margin * 2;

          const scale = Math.min(
            maxWidth / originalWidth,
            maxHeight / originalHeight
          );

          const width = originalWidth * scale;
          const height = originalHeight * scale;

          page.drawImage(embeddedImage, {
            x: (a4Width - width) / 2,
            y: (a4Height - height) / 2,
            width,
            height,
          });
        }
      }

      const pdfBytes = await pdf.save();
      const pdfArrayBuffer = new ArrayBuffer(pdfBytes.length);
      const pdfUint8Array = new Uint8Array(pdfArrayBuffer);

      pdfUint8Array.set(pdfBytes);

      const blob = new Blob([pdfArrayBuffer], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "images-to-pdf.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch {
      setError(
        "Something went wrong while creating the PDF. Please make sure your images are valid JPG or PNG files."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert images to PDF
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Upload JPG or PNG images, arrange them in the right order and create a
          single PDF directly in your browser.
        </p>
      </div>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          addImages(event.dataTransfer.files);
        }}
        className="rounded-[2rem] border-2 border-dashed border-black/15 bg-[#fff8df] p-6 text-center transition hover:border-black/25 sm:p-8"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          multiple
          onChange={(event) => {
            if (event.target.files) {
              addImages(event.target.files);
            }
          }}
          className="hidden"
        />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-sm font-black text-white">
          IMG
        </div>

        <h3 className="mt-5 text-lg font-bold text-black">
          Drop images here
        </h3>

        <p className="mt-2 text-sm leading-6 text-black/60">
          Add one or more JPG or PNG images. Files stay in your browser.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Choose images
        </button>
      </div>

      {error && <ToolErrorBox message={error} />}

      <ToolResultBox title="PDF settings">
        <label className="block">
          <span className="text-sm font-bold text-black">Page size</span>

          <select
            value={pageSize}
            onChange={(event) => setPageSize(event.target.value as "fit" | "a4")}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="fit">Fit each page to image size</option>
            <option value="a4">A4 page with centered image</option>
          </select>
        </label>
      </ToolResultBox>

      {images.length > 0 ? (
        <ToolResultBox title="Selected images">
          <div className="grid gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <img
                    src={image.previewUrl}
                    alt={image.file.name}
                    className="h-16 w-16 rounded-xl border border-black/10 object-cover"
                  />

                  <div className="min-w-0">
                    <div className="truncate font-bold text-black">
                      {index + 1}. {image.file.name}
                    </div>

                    <div className="mt-1 text-xs text-black/50">
                      {formatFileSize(image.file.size)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => moveImage(image.id, "up")}
                    disabled={index === 0 || loading}
                    className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold disabled:opacity-40"
                  >
                    Up
                  </button>

                  <button
                    type="button"
                    onClick={() => moveImage(image.id, "down")}
                    disabled={index === images.length - 1 || loading}
                    className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold disabled:opacity-40"
                  >
                    Down
                  </button>

                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    disabled={loading}
                    className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold text-red-600 disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Add one or more images to create a PDF. You can reorder images before
          downloading the final file.
        </ToolInfoBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={createPdf}
          disabled={!images.length || loading}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Creating PDF..." : "Create PDF"}
        </button>

        <button
          type="button"
          onClick={clearImages}
          disabled={!images.length || loading}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear images
        </button>
      </div>
    </div>
  );
}