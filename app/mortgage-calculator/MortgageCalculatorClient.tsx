"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function MortgageCalculatorClient() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanYears, setLoanYears] = useState(30);
  const [propertyTax, setPropertyTax] = useState(300);
  const [insurance, setInsurance] = useState(120);
  const [hoa, setHoa] = useState(0);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    const loanAmount = homePrice - downPayment;

    if (
      homePrice <= 0 ||
      downPayment < 0 ||
      loanAmount <= 0 ||
      interestRate < 0 ||
      loanYears <= 0 ||
      propertyTax < 0 ||
      insurance < 0 ||
      hoa < 0
    ) {
      return null;
    }

    const monthlyRate = interestRate / 100 / 12;
    const payments = loanYears * 12;

    const principalAndInterest =
      monthlyRate === 0
        ? loanAmount / payments
        : (loanAmount *
            monthlyRate *
            Math.pow(1 + monthlyRate, payments)) /
          (Math.pow(1 + monthlyRate, payments) - 1);

    const monthlyPayment =
      principalAndInterest + propertyTax + insurance + hoa;

    const totalPaid = monthlyPayment * payments;
    const totalInterest = principalAndInterest * payments - loanAmount;

    return {
      loanAmount,
      principalAndInterest,
      monthlyPayment,
      totalPaid,
      totalInterest,
    };
  }, [
    homePrice,
    downPayment,
    interestRate,
    loanYears,
    propertyTax,
    insurance,
    hoa,
  ]);

  function validateInputs() {
    if (homePrice <= 0) {
      setError("Home price must be greater than zero.");
      return false;
    }

    if (downPayment < 0) {
      setError("Down payment cannot be negative.");
      return false;
    }

    if (downPayment >= homePrice) {
      setError("Down payment must be lower than the home price.");
      return false;
    }

    if (interestRate < 0) {
      setError("Interest rate cannot be negative.");
      return false;
    }

    if (loanYears <= 0) {
      setError("Loan term must be greater than zero.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setHomePrice(400000);
    setDownPayment(80000);
    setInterestRate(6.5);
    setLoanYears(30);
    setPropertyTax(300);
    setInsurance(120);
    setHoa(0);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate mortgage payments
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate your monthly mortgage payment including principal, interest,
          property tax, insurance and HOA fees.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput
            label="Home price"
            value={homePrice}
            onChange={setHomePrice}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Down payment"
            value={downPayment}
            onChange={setDownPayment}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Interest rate %"
            value={interestRate}
            onChange={setInterestRate}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Loan term years"
            value={loanYears}
            onChange={setLoanYears}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Monthly property tax"
            value={propertyTax}
            onChange={setPropertyTax}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Monthly insurance"
            value={insurance}
            onChange={setInsurance}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Monthly HOA fees"
            value={hoa}
            onChange={setHoa}
            onBlur={validateInputs}
          />
        </div>

        {error && <ToolErrorBox message={error} />}

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit"
        >
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="Mortgage estimate">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              label="Monthly payment"
              value={formatCurrency(result.monthlyPayment)}
              highlight
            />

            <ResultCard
              label="Principal & interest"
              value={formatCurrency(result.principalAndInterest)}
            />

            <ResultCard
              label="Loan amount"
              value={formatCurrency(result.loanAmount)}
            />

            <ResultCard
              label="Total interest"
              value={formatCurrency(result.totalInterest)}
            />

            <ResultCard
              label="Total paid"
              value={formatCurrency(result.totalPaid)}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            Estimated monthly payment:{" "}
            <strong className="text-black">
              {formatCurrency(result.monthlyPayment)}
            </strong>
            . This includes loan payment, tax, insurance and HOA assumptions.
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid mortgage details to calculate your estimated monthly
          payment.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This mortgage calculator provides an estimate only. Actual payments may
        vary based on lender fees, taxes, insurance, PMI and local rules.
      </ToolInfoBox>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onBlur: () => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        onBlur={onBlur}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />
    </label>
  );
}

function ResultCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "border-black bg-black text-white"
          : "border-black/10 bg-white text-black"
      }`}
    >
      <div
        className={`text-xs font-bold uppercase tracking-wide ${
          highlight ? "text-white/50" : "text-black/40"
        }`}
      >
        {label}
      </div>

      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}