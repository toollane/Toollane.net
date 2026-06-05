"use client";

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type FileWithId = {
  id: string;
  file: File;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function PdfMergerClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState<FileWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function addFiles(selectedFiles: FileList | File[]) {
    setError("");

    const pdfFiles = Array.from(selectedFiles).filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
    );

    if (!pdfFiles.length) {
      setError("Please select valid PDF files.");
      return;
    }

    setFiles((current) => [
      ...current,
      ...pdfFiles.map((file) => ({
        id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        file,
      })),
    ]);
  }

  function removeFile(id: string) {
    setFiles((current) => current.filter((item) => item.id !== id));
  }

  function clearFiles() {
    setFiles([]);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function moveFile(id: string, direction: "up" | "down") {
    setFiles((current) => {
      const index = current.findIndex((item) => item.id === id);

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

  async function mergePdfs() {
    setError("");

    if (files.length < 2) {
      setError("Please select at least two PDF files to merge.");
      return;
    }

    setLoading(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const bytes = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );

        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const pdfArrayBuffer = new ArrayBuffer(mergedBytes.length);
      const pdfUint8Array = new Uint8Array(pdfArrayBuffer);

      pdfUint8Array.set(mergedBytes);

      const blob = new Blob([pdfArrayBuffer], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "merged.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch {
      setError(
        "Something went wrong while merging the PDF files. Please make sure all files are valid PDFs and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Merge PDF files online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Upload multiple PDF files, arrange them in the right order and merge
          them into one PDF directly in your browser.
        </p>
      </div>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          addFiles(event.dataTransfer.files);
        }}
        className="rounded-[2rem] border-2 border-dashed border-black/15 bg-[#fff8df] p-6 text-center transition hover:border-black/25 sm:p-8"
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          onChange={(event) => {
            if (event.target.files) {
              addFiles(event.target.files);
            }
          }}
          className="hidden"
        />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-sm font-black text-white">
          PDF
        </div>

        <h3 className="mt-5 text-lg font-bold text-black">
          Drop PDF files here
        </h3>

        <p className="mt-2 text-sm leading-6 text-black/60">
          Select two or more PDF files. Files stay in your browser and are not
          uploaded.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Choose PDF files
        </button>
      </div>

      {error && <ToolErrorBox message={error} />}

      {files.length > 0 ? (
        <ToolResultBox title="Selected PDFs">
          <div className="grid gap-3">
            {files.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="truncate font-bold text-black">
                    {index + 1}. {item.file.name}
                  </div>

                  <div className="mt-1 text-xs text-black/50">
                    {formatFileSize(item.file.size)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => moveFile(item.id, "up")}
                    disabled={index === 0 || loading}
                    className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold disabled:opacity-40"
                  >
                    Up
                  </button>

                  <button
                    type="button"
                    onClick={() => moveFile(item.id, "down")}
                    disabled={index === files.length - 1 || loading}
                    className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold disabled:opacity-40"
                  >
                    Down
                  </button>

                  <button
                    type="button"
                    onClick={() => removeFile(item.id)}
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
          Add at least two PDF files to create one combined document. You can
          reorder files before merging.
        </ToolInfoBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={mergePdfs}
          disabled={files.length < 2 || loading}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Merging PDFs..." : "Merge PDFs"}
        </button>

        <button
          type="button"
          onClick={clearFiles}
          disabled={!files.length || loading}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear files
        </button>
      </div>
    </div>
  );
}