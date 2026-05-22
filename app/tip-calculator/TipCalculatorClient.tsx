"use client";

import { useMemo, useState } from "react";

export default function TipCalculatorClient() {
  const [billAmount, setBillAmount] = useState("");
  const [tipPercent, setTipPercent] = useState("15");
  const [people, setPeople] = useState("1");

  const result = useMemo(() => {
    const bill = parseFloat(billAmount);
    const tip = parseFloat(tipPercent);
    const numberOfPeople = parseFloat(people);

    if (
      isNaN(bill) ||
      isNaN(tip) ||
      isNaN(numberOfPeople) ||
      numberOfPeople <= 0
    ) {
      return {
        tipAmount: "",
        totalAmount: "",
        perPerson: "",
      };
    }

    const tipAmount = bill * (tip / 100);
    const totalAmount = bill + tipAmount;
    const perPerson = totalAmount / numberOfPeople;

    return {
      tipAmount: tipAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      perPerson: perPerson.toFixed(2),
    };
  }, [billAmount, tipPercent, people]);

  return (
    <div className="grid gap-6">
      <div>
        <label className="block mb-2 font-medium">
          Bill Amount
        </label>

        <input
          type="number"
          value={billAmount}
          onChange={(e) => setBillAmount(e.target.value)}
          placeholder="100"
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Tip %
        </label>

        <input
          type="number"
          value={tipPercent}
          onChange={(e) => setTipPercent(e.target.value)}
          placeholder="15"
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Number of People
        </label>

        <input
          type="number"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          placeholder="1"
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Tip Amount
          </div>

          <div className="text-3xl font-bold">
            {result.tipAmount || "0"}$
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Total
          </div>

          <div className="text-3xl font-bold">
            {result.totalAmount || "0"}$
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Per Person
          </div>

          <div className="text-3xl font-bold">
            {result.perPerson || "0"}$
          </div>
        </div>
      </div>
    </div>
  );
}