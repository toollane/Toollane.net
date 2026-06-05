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
    maximumFractionDigits: currency === "JPY" ? 0 : 4,
  }).format(value);
}

function normalizeQuantity(quantity: number, unitSize: number, packCount: number) {
  return quantity * unitSize * packCount;
}

export default function UnitPriceCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  const [priceA, setPriceA] = useState(12.99);
  const [quantityA, setQuantityA] = useState(1);
  const [unitSizeA, setUnitSizeA] = useState(750);
  const [packCountA, setPackCountA] = useState(1);
  const [discountA, setDiscountA] = useState(0);
  const [shippingA, setShippingA] = useState(0);

  const [priceB, setPriceB] = useState(19.99);
  const [quantityB, setQuantityB] = useState(2);
  const [unitSizeB, setUnitSizeB] = useState(500);
  const [packCountB, setPackCountB] = useState(1);
  const [discountB, setDiscountB] = useState(10);
  const [shippingB, setShippingB] = useState(0);

  const [error, setError] = useState("");

  const result = useMemo(() => {
    const values = [
      priceA,
      quantityA,
      unitSizeA,
      packCountA,
      discountA,
      shippingA,
      priceB,
      quantityB,
      unitSizeB,
      packCountB,
      discountB,
      shippingB,
    ];

    if (values.some((value) => value < 0) || quantityA <= 0 || quantityB <= 0 || unitSizeA <= 0 || unitSizeB <= 0 || packCountA <= 0 || packCountB <= 0) {
      return null;
    }

    if (discountA > 100 || discountB > 100) {
      return null;
    }

    const totalQuantityA = normalizeQuantity(quantityA, unitSizeA, packCountA);
    const totalQuantityB = normalizeQuantity(quantityB, unitSizeB, packCountB);

    const totalCostA = priceA * (1 - discountA / 100) + shippingA;
    const totalCostB = priceB * (1 - discountB / 100) + shippingB;

    const unitPriceA = totalCostA / totalQuantityA;
    const unitPriceB = totalCostB / totalQuantityB;

    const winner = unitPriceA < unitPriceB ? "A" : unitPriceB < unitPriceA ? "B" : "Tie";
    const savingsPerUnit = Math.abs(unitPriceA - unitPriceB);
    const savingsPercent =
      Math.max(unitPriceA, unitPriceB) > 0
        ? (savingsPerUnit / Math.max(unitPriceA, unitPriceB)) * 100
        : 0;

    return {
      totalQuantityA,
      totalQuantityB,
      totalCostA,
      totalCostB,
      unitPriceA,
      unitPriceB,
      winner,
      savingsPerUnit,
      savingsPercent,
    };
  }, [
    priceA,
    quantityA,
    unitSizeA,
    packCountA,
    discountA,
    shippingA,
    priceB,
    quantityB,
    unitSizeB,
    packCountB,
    discountB,
    shippingB,
  ]);

  function validateInputs() {
    const values = [
      priceA,
      quantityA,
      unitSizeA,
      packCountA,
      discountA,
      shippingA,
      priceB,
      quantityB,
      unitSizeB,
      packCountB,
      discountB,
      shippingB,
    ];

    if (values.some((value) => value < 0)) {
      setError("Values cannot be negative.");
      return false;
    }

    if (quantityA <= 0 || quantityB <= 0 || unitSizeA <= 0 || unitSizeB <= 0 || packCountA <= 0 || packCountB <= 0) {
      setError("Quantities, unit sizes and pack counts must be greater than zero.");
      return false;
    }

    if (discountA > 100 || discountB > 100) {
      setError("Discounts must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setPriceA(12.99);
    setQuantityA(1);
    setUnitSizeA(750);
    setPackCountA(1);
    setDiscountA(0);
    setShippingA(0);
    setPriceB(19.99);
    setQuantityB(2);
    setUnitSizeB(500);
    setPackCountB(1);
    setDiscountB(10);
    setShippingB(0);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Compare unit prices
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Compare two products by real unit price including pack size,
          quantity, discounts and shipping.
        </p>
      </div>

      <div className="grid gap-5">
        <CurrencySelect currency={currency} setCurrency={setCurrency} />

        <ProductInputs
          title="Product A"
          price={priceA}
          setPrice={setPriceA}
          quantity={quantityA}
          setQuantity={setQuantityA}
          unitSize={unitSizeA}
          setUnitSize={setUnitSizeA}
          packCount={packCountA}
          setPackCount={setPackCountA}
          discount={discountA}
          setDiscount={setDiscountA}
          shipping={shippingA}
          setShipping={setShippingA}
          validateInputs={validateInputs}
        />

        <ProductInputs
          title="Product B"
          price={priceB}
          setPrice={setPriceB}
          quantity={quantityB}
          setQuantity={setQuantityB}
          unitSize={unitSizeB}
          setUnitSize={setUnitSizeB}
          packCount={packCountB}
          setPackCount={setPackCountB}
          discount={discountB}
          setDiscount={setDiscountB}
          shipping={shippingB}
          setShipping={setShippingB}
          validateInputs={validateInputs}
        />

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="Unit price comparison">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Best value" value={result.winner === "Tie" ? "Tie" : `Product ${result.winner}`} highlight />
            <ResultCard label="Product A unit price" value={formatCurrency(result.unitPriceA, currency)} />
            <ResultCard label="Product B unit price" value={formatCurrency(result.unitPriceB, currency)} />
            <ResultCard label="Savings per unit" value={formatCurrency(result.savingsPerUnit, currency)} />
            <ResultCard label="Savings percent" value={`${result.savingsPercent.toFixed(2)}%`} />
            <ResultCard label="Product A total quantity" value={result.totalQuantityA.toLocaleString()} />
            <ResultCard label="Product B total quantity" value={result.totalQuantityB.toLocaleString()} />
            <ResultCard label="Product A total cost" value={formatCurrency(result.totalCostA, currency)} />
            <ResultCard label="Product B total cost" value={formatCurrency(result.totalCostB, currency)} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid product values to compare real unit price.
        </ToolInfoBox>
      )}
    </div>
  );
}

function ProductInputs({
  title,
  price,
  setPrice,
  quantity,
  setQuantity,
  unitSize,
  setUnitSize,
  packCount,
  setPackCount,
  discount,
  setDiscount,
  shipping,
  setShipping,
  validateInputs,
}: {
  title: string;
  price: number;
  setPrice: (value: number) => void;
  quantity: number;
  setQuantity: (value: number) => void;
  unitSize: number;
  setUnitSize: (value: number) => void;
  packCount: number;
  setPackCount: (value: number) => void;
  discount: number;
  setDiscount: (value: number) => void;
  shipping: number;
  setShipping: (value: number) => void;
  validateInputs: () => void;
}) {
  return (
    <div className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-5">
      <h3 className="font-black text-black">{title}</h3>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <NumberInput label="Total price" value={price} onChange={setPrice} onBlur={validateInputs} />
        <NumberInput label="Quantity purchased" value={quantity} onChange={setQuantity} onBlur={validateInputs} />
        <NumberInput label="Unit size" value={unitSize} onChange={setUnitSize} onBlur={validateInputs} />
        <NumberInput label="Pack count" value={packCount} onChange={setPackCount} onBlur={validateInputs} />
        <NumberInput label="Discount %" value={discount} onChange={setDiscount} onBlur={validateInputs} />
        <NumberInput label="Shipping cost" value={shipping} onChange={setShipping} onBlur={validateInputs} />
      </div>
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