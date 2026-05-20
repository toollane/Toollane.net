"use client";

import { useState } from "react";

export default function AspectRatioCalculatorClient() {
  const [originalWidth, setOriginalWidth] =
    useState("");

  const [originalHeight, setOriginalHeight] =
    useState("");

  const [newWidth, setNewWidth] =
    useState("");

  const [newHeight, setNewHeight] =
    useState("");

  function calculateAspectRatio(
    width: string,
    height: string,
    resizedWidth: string
  ) {
    setOriginalWidth(width);
    setOriginalHeight(height);
    setNewWidth(resizedWidth);

    const widthNumber =
      parseFloat(width);

    const heightNumber =
      parseFloat(height);

    const resizedWidthNumber =
      parseFloat(resizedWidth);

    if (
      isNaN(widthNumber) ||
      isNaN(heightNumber) ||
      isNaN(resizedWidthNumber)
    ) {
      setNewHeight("");
      return;
    }

    const calculatedHeight =
      (resizedWidthNumber *
        heightNumber) /
      widthNumber;

    setNewHeight(
      calculatedHeight.toFixed(0)
    );
  }

  return (
    <div className="border rounded-2xl p-8 shadow-sm">

      <div className="grid gap-6">

        <div>
          <label className="block mb-2 font-medium">
            Original Width
          </label>

          <input
            type="number"
            value={originalWidth}
            onChange={(e) =>
              calculateAspectRatio(
                e.target.value,
                originalHeight,
                newWidth
              )
            }
            placeholder="1920"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Original Height
          </label>

          <input
            type="number"
            value={originalHeight}
            onChange={(e) =>
              calculateAspectRatio(
                originalWidth,
                e.target.value,
                newWidth
              )
            }
            placeholder="1080"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            New Width
          </label>

          <input
            type="number"
            value={newWidth}
            onChange={(e) =>
              calculateAspectRatio(
                originalWidth,
                originalHeight,
                e.target.value
              )
            }
            placeholder="1280"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Calculated Height
          </label>

          <input
            type="text"
            value={newHeight}
            readOnly
            className="w-full border rounded-xl px-4 py-3 bg-gray-100"
          />
        </div>

      </div>

    </div>
  );
}