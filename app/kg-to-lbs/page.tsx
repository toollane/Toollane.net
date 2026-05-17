"use client";

import { useState } from "react";

export default function KgToLbsPage() {
  const [kg, setKg] = useState("");
  
  const lbs =
    kg === ""
      ? ""
      : (parseFloat(kg) * 2.20462).toFixed(2);

  return (
    <main className="min-h-screen bg-white text-black p-8">
      <div className="max-w-xl mx-auto">
        
        <h1 className="text-4xl font-bold mb-4">
          KG to LBS Converter
        </h1>

        <p className="mb-6 text-gray-600">
          Convert kilograms to pounds instantly.
        </p>

        <div className="border rounded-2xl p-6 shadow-sm">
          
          <label className="block mb-2 font-medium">
            Kilograms
          </label>

          <input
            type="number"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            placeholder="Enter kilograms"
            className="w-full border rounded-lg p-3 mb-6"
          />

          <div>
            <p className="text-lg text-gray-500 mb-2">
              Pounds
            </p>

            <div className="text-3xl font-bold">
              {lbs || "0"} lbs
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}