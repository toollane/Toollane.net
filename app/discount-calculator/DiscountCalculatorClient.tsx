"use client";

import { useMemo, useState } from "react";

export default function DiscountCalculatorClient() {
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");

  const result = useMemo(() => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);

    if (isNaN(price) || isNaN(discount)) {
      return {
        saved: "",
        finalPrice: "",
      };
    }

    const saved = price * (discount / 100);
    const finalPrice = price - saved;

    return {
      saved: saved.toFixed(2),
      finalPrice: finalPrice.toFixed(2),
    };
  }, [originalPrice, discountPercent]);

  return (
    <div className="grid gap-6">
      <div>
        <label className="block mb-2 font-medium">
          Original Price
        </label>

        <input
          type="number"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          placeholder="100"
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Discount %
        </label>

        <input
          type="number"
          value={discountPercent}
          onChange={(e) => setDiscountPercent(e.target.value)}
          placeholder="20"
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            You Save
          </div>

          <div className="text-3xl font-bold">
            {result.saved || "0"}$
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Final Price
          </div>

          <div className="text-3xl font-bold">
            {result.finalPrice || "0"}$
          </div>
        </div>
      </div>
    </div>
  );
}