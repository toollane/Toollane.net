"use client";

import { useMemo, useRef, useState } from "react";
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

function createSafeFileName(value: string) {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/\.pdf$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${cleaned || "merged"}.pdf`;
}

export default function PdfMergerClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState<FileWithId[]>([]);
  const [fileName, setFileName] = useState("merged.pdf");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [mergedSize, setMergedSize] = useState<number | null>(null);

  const totalSize = useMemo(
    () => files.reduce((sum, item) => sum + item.file.size, 0),
    [files]
  );

  function revokeDownloadUrl() {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl("");
      setMergedSize(null);
    }
  }

  function addFiles(selectedFiles: FileList | File[]) {
    setError("");
    revokeDownloadUrl();

    const incomingFiles = Array.from(selectedFiles);

    const pdfFiles = incomingFiles.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
    );

    if (!pdfFiles.length) {
      setError("Please select valid PDF files.");
      return;
    }

    setFiles((current) => {
      const existingKeys = new Set(
        current.map((item) => `${item.file.name}-${item.file.size}`)
      );

      const newFiles = pdfFiles
        .filter((file) => !existingKeys.has(`${file.name}-${file.size}`))
        .map((file) => ({
          id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
          file,
        }));

      if (!newFiles.length) {
        setError("These PDF files are already in the list.");
        return current;
      }

      return [...current, ...newFiles];
    });
  }

  function removeFile(id: string) {
    revokeDownloadUrl();
    setFiles((current) => current.filter((item) => item.id !== id));
  }

  function clearFiles() {
    revokeDownloadUrl();
    setFiles([]);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function moveFile(id: string, direction: "up" | "down") {
    revokeDownloadUrl();

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
    revokeDownloadUrl();

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

      setDownloadUrl(url);
      setMergedSize(blob.size);

      const link = document.createElement("a");

      link.href = url;
      link.download = createSafeFileName(fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setError(
        "Something went wrong while merging the PDF files. Please make sure all files are valid, unlocked PDF documents and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadAgain() {
    if (!downloadUrl) return;

    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = createSafeFileName(fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Merge PDF files online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Upload multiple PDF files, arrange them in the right order and combine
          them into one PDF directly in your browser.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Selected files" value={String(files.length)} />
        <StatCard label="Total size" value={formatFileSize(totalSize)} />
        <StatCard label="Privacy" value="Browser-based" />
      </div>

      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          addFiles(event.dataTransfer.files);
        }}
        className={`rounded-[2rem] border-2 border-dashed p-6 text-center transition sm:p-8 ${
          dragActive
            ? "border-black bg-white"
            : "border-black/15 bg-[#fff8df] hover:border-black/25"
        }`}
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
          Select two or more PDF files. Your files stay in your browser and are
          not uploaded to a server.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Choose PDF files
        </button>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-black">Output file name</span>

        <input
          type="text"
          value={fileName}
          onChange={(event) => {
            revokeDownloadUrl();
            setFileName(event.target.value);
          }}
          className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
        />

        <p className="mt-2 text-xs leading-5 text-black/50">
          The file will be saved as {createSafeFileName(fileName)}.
        </p>
      </label>

      {error && <ToolErrorBox message={error} />}

      {files.length > 0 ? (
        <ToolResultBox title="Selected PDFs">
          <div className="mb-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
            The merge order follows the list below. Move files up or down before
            merging if needed.
          </div>

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
                    className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold transition hover:border-black disabled:opacity-40"
                  >
                    Up
                  </button>

                  <button
                    type="button"
                    onClick={() => moveFile(item.id, "down")}
                    disabled={index === files.length - 1 || loading}
                    className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold transition hover:border-black disabled:opacity-40"
                  >
                    Down
                  </button>

                  <button
                    type="button"
                    onClick={() => removeFile(item.id)}
                    disabled={loading}
                    className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold text-red-600 transition hover:border-red-300 disabled:opacity-40"
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

        {downloadUrl && (
          <button
            type="button"
            onClick={downloadAgain}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Download again
          </button>
        )}

        <button
          type="button"
          onClick={clearFiles}
          disabled={!files.length || loading}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear files
        </button>
      </div>

      {downloadUrl && (
        <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-black text-black">Merged PDF ready</h3>

          <p className="mt-3 text-sm leading-7 text-black/60">
            Your merged PDF has been created and downloaded. You can download it
            again without reprocessing the files.
          </p>

          {mergedSize !== null && (
            <div className="mt-4 text-sm font-bold text-black/60">
              Output size: {formatFileSize(mergedSize)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-lg font-black text-black">{value}</div>
    </div>
  );
}