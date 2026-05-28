"use client";

import { useState } from "react";

export default function ImageToPdfClient() {
  const [images, setImages] = useState<string[]>([]);

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        setImages((current) => [...current, reader.result as string]);
      };

      reader.readAsDataURL(file);
    });
  };

  const printAsPdf = () => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Images to PDF</title>
          <style>
            body { margin: 0; padding: 24px; font-family: Arial, sans-serif; }
            img { max-width: 100%; page-break-after: always; margin-bottom: 24px; }
          </style>
        </head>
        <body>
          ${images.map((image) => `<img src="${image}" />`).join("")}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Image to PDF Converter</h2>

        <p className="text-black/60 leading-7">
          Combine images into a printable PDF using your browser print dialog.
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      {images.length > 0 && (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`Selected ${index + 1}`}
                className="rounded-2xl border border-black/10"
              />
            ))}
          </div>

          <button
            onClick={printAsPdf}
            className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
          >
            Print / Save as PDF
          </button>
        </>
      )}
    </div>
  );
}