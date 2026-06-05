"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";

function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

export default function TipCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [billAmount, setBillAmount] = useState(85);
  const [tipPercent, setTipPercent] = useState(18);
  const [people, setPeople] = useState(2);
  const [taxPercent, setTaxPercent] = useState(0);
  const [serviceChargePercent, setServiceChargePercent] = useState(0);
  const [tipOnTax, setTipOnTax] = useState(false);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      billAmount < 0 ||
      tipPercent < 0 ||
      people <= 0 ||
      taxPercent < 0 ||
      serviceChargePercent < 0
    ) {
      return null;
    }

    const taxAmount = billAmount * (taxPercent / 100);
    const serviceCharge = billAmount * (serviceChargePercent / 100);
    const tipBase = tipOnTax ? billAmount + taxAmount : billAmount;
    const tipAmount = tipBase * (tipPercent / 100);
    const total = billAmount + taxAmount + serviceCharge + tipAmount;

    return {
      taxAmount,
      serviceCharge,
      tipAmount,
      total,
      perPerson: total / people,
      billPerPerson: billAmount / people,
      tipPerPerson: tipAmount / people,
    };
  }, [
    billAmount,
    tipPercent,
    people,
    taxPercent,
    serviceChargePercent,
    tipOnTax,
  ]);

  function validateInputs() {
    if (billAmount < 0 || tipPercent < 0 || taxPercent < 0 || serviceChargePercent < 0) {
      setError("Values cannot be negative.");
      return false;
    }

    if (people <= 0) {
      setError("Number of people must be greater than zero.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setBillAmount(85);
    setTipPercent(18);
    setPeople(2);
    setTaxPercent(0);
    setServiceChargePercent(0);
    setTipOnTax(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate tip and split bill
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate tip, tax, service charge and split the final bill between
          multiple people.
        </p>
      </div>

      <div className="grid gap-5">
        <CurrencySelect currency={currency} setCurrency={setCurrency} />

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Bill amount" value={billAmount} onChange={setBillAmount} onBlur={validateInputs} />
          <NumberInput label="Tip %" value={tipPercent} onChange={setTipPercent} onBlur={validateInputs} />
          <NumberInput label="Number of people" value={people} onChange={setPeople} onBlur={validateInputs} />
          <NumberInput label="Tax %" value={taxPercent} onChange={setTaxPercent} onBlur={validateInputs} />
          <NumberInput label="Service charge %" value={serviceChargePercent} onChange={setServiceChargePercent} onBlur={validateInputs} />
        </div>

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
          <span>
            <span className="block text-sm font-bold text-black">
              Tip on tax
            </span>
            <span className="mt-1 block text-xs leading-5 text-black/50">
              Include tax in the amount used to calculate the tip.
            </span>
          </span>

          <input
            type="checkbox"
            checked={tipOnTax}
            onChange={(event) => setTipOnTax(event.target.checked)}
            className="h-5 w-5 accent-black"
          />
        </label>

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="Tip result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Total bill" value={formatCurrency(result.total, currency)} highlight />
            <ResultCard label="Per person" value={formatCurrency(result.perPerson, currency)} />
            <ResultCard label="Tip amount" value={formatCurrency(result.tipAmount, currency)} />
            <ResultCard label="Tip per person" value={formatCurrency(result.tipPerPerson, currency)} />
            <ResultCard label="Bill per person" value={formatCurrency(result.billPerPerson, currency)} />
            <ResultCard label="Tax amount" value={formatCurrency(result.taxAmount, currency)} />
            <ResultCard label="Service charge" value={formatCurrency(result.serviceCharge, currency)} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid bill details to calculate tip and split amount.
        </ToolInfoBox>
      )}
    </div>
  );
}

function CurrencySelect({ currency, setCurrency }: { currency: CurrencyCode; setCurrency: (currency: CurrencyCode) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">Currency</span>
      <select value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)} className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black">
        <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="CAD">CAD</option><option value="AUD">AUD</option><option value="CHF">CHF</option><option value="JPY">JPY</option>
      </select>
    </label>
  );
}

function NumberInput({ label, value, onChange, onBlur }: { label: string; value: number; onChange: (value: number) => void; onBlur: () => void }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>
      <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} onBlur={onBlur} className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black" />
    </label>
  );
}

function ResultCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? "border-black bg-black text-white" : "border-black/10 bg-white text-black"}`}>
      <div className={`text-xs font-bold uppercase tracking-wide ${highlight ? "text-white/50" : "text-black/40"}`}>{label}</div>
      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}