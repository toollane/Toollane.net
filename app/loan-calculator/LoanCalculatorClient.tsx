"use client";

import { useMemo, useState, type ReactNode } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD";

type AmortizationRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
};

function parseNumber(value: string) {
  const normalized = value.replace(",", ".").trim();

  if (!normalized) return 0;

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number, currency: Currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatMonths(months: number) {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years <= 0) {
    return `${remainingMonths} month${remainingMonths === 1 ? "" : "s"}`;
  }

  if (remainingMonths === 0) {
    return `${years} year${years === 1 ? "" : "s"}`;
  }

  return `${years} year${years === 1 ? "" : "s"}, ${remainingMonths} month${
    remainingMonths === 1 ? "" : "s"
  }`;
}

function calculateLoan({
  loanAmount,
  annualRate,
  loanYears,
  extraMonthlyPayment,
}: {
  loanAmount: number;
  annualRate: number;
  loanYears: number;
  extraMonthlyPayment: number;
}) {
  if (
    loanAmount <= 0 ||
    annualRate < 0 ||
    loanYears <= 0 ||
    extraMonthlyPayment < 0
  ) {
    return null;
  }

  const monthlyRate = annualRate / 100 / 12;
  const scheduledMonths = Math.round(loanYears * 12);

  const baseMonthlyPayment =
    monthlyRate === 0
      ? loanAmount / scheduledMonths
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, scheduledMonths)) /
        (Math.pow(1 + monthlyRate, scheduledMonths) - 1);

  const monthlyPayment = baseMonthlyPayment + extraMonthlyPayment;

  let balance = loanAmount;
  let month = 0;
  let totalInterest = 0;
  let totalPaid = 0;

  const amortization: AmortizationRow[] = [];

  while (balance > 0.005 && month < 1200) {
    const interest = balance * monthlyRate;
    const principal = Math.min(monthlyPayment - interest, balance);

    if (principal <= 0) {
      return null;
    }

    const payment = principal + interest;

    balance = Math.max(0, balance - principal);
    totalInterest += interest;
    totalPaid += payment;
    month += 1;

    amortization.push({
      month,
      payment,
      principal,
      interest,
      balance,
    });
  }

  const scheduledTotalPaid = baseMonthlyPayment * scheduledMonths;
  const scheduledTotalInterest = scheduledTotalPaid - loanAmount;
  const interestSaved = Math.max(0, scheduledTotalInterest - totalInterest);
  const monthsSaved = Math.max(0, scheduledMonths - month);

  return {
    baseMonthlyPayment,
    monthlyPayment,
    scheduledMonths,
    payoffMonths: month,
    totalPaid,
    totalInterest,
    scheduledTotalInterest,
    interestSaved,
    monthsSaved,
    amortization,
  };
}

export default function LoanCalculatorClient() {
  const [loanAmount, setLoanAmount] = useState("25000");
  const [annualRate, setAnnualRate] = useState("7.5");
  const [loanYears, setLoanYears] = useState("5");
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState("0");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [showFirstMonths, setShowFirstMonths] = useState(false);
  const [showYearlySummary, setShowYearlySummary] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      loanAmount: parseNumber(loanAmount),
      annualRate: parseNumber(annualRate),
      loanYears: parseNumber(loanYears),
      extraMonthlyPayment: parseNumber(extraMonthlyPayment),
    }),
    [loanAmount, annualRate, loanYears, extraMonthlyPayment]
  );

  const result = useMemo(
    () =>
      calculateLoan({
        loanAmount: numericValues.loanAmount,
        annualRate: numericValues.annualRate,
        loanYears: numericValues.loanYears,
        extraMonthlyPayment: numericValues.extraMonthlyPayment,
      }),
    [numericValues]
  );

  const previewRows = useMemo(() => {
    if (!result) return [];

    return result.amortization.slice(0, 12);
  }, [result]);

  const yearlyRows = useMemo(() => {
    if (!result) return [];

    return result.amortization.filter(
      (row) =>
        row.month % 12 === 0 || row.month === result.amortization.length
    );
  }, [result]);

  function validateInputs() {
    if (numericValues.loanAmount <= 0) {
      setError("Loan amount must be greater than zero.");
      return false;
    }

    if (numericValues.annualRate < 0) {
      setError("Interest rate cannot be negative.");
      return false;
    }

    if (numericValues.loanYears <= 0) {
      setError("Loan term must be greater than zero.");
      return false;
    }

    if (numericValues.extraMonthlyPayment < 0) {
      setError("Extra monthly payment cannot be negative.");
      return false;
    }

    if (!result) {
      setError(
        "This loan cannot be paid off with the current payment settings. Increase the loan term or reduce the interest rate."
      );
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setLoanAmount("25000");
    setAnnualRate("7.5");
    setLoanYears("5");
    setExtraMonthlyPayment("0");
    setCurrency("USD");
    setShowFirstMonths(false);
    setShowYearlySummary(false);
    setError("");
  }

  function applyScenario(
    amount: string,
    rate: string,
    years: string,
    extraPayment = "0"
  ) {
    setLoanAmount(amount);
    setAnnualRate(rate);
    setLoanYears(years);
    setExtraMonthlyPayment(extraPayment);
    setShowFirstMonths(false);
    setShowYearlySummary(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate loan payments online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate monthly payments, total interest, payoff time and the impact
          of extra monthly payments for personal loans, auto loans and other
          fixed-rate loans.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Loan amount"
          value={formatCurrency(numericValues.loanAmount, currency)}
        />
        <StatCard
          label="Interest rate"
          value={`${formatNumber(numericValues.annualRate)}%`}
        />
        <StatCard
          label="Loan term"
          value={`${formatNumber(numericValues.loanYears)} years`}
        />
      </div>

      <ToolResultBox title="Loan details">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextNumberInput
            label="Loan amount"
            value={loanAmount}
            onChange={setLoanAmount}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
            inputMode="decimal"
          />

          <TextNumberInput
            label="Annual interest rate"
            value={annualRate}
            onChange={setAnnualRate}
            onBlur={validateInputs}
            suffix="%"
            inputMode="decimal"
          />

          <TextNumberInput
            label="Loan term"
            value={loanYears}
            onChange={setLoanYears}
            onBlur={validateInputs}
            suffix="years"
            inputMode="decimal"
          />

          <TextNumberInput
            label="Extra monthly payment"
            value={extraMonthlyPayment}
            onChange={setExtraMonthlyPayment}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
            inputMode="decimal"
          />

          <label className="block sm:col-span-2">
            <span className="text-sm font-bold text-black">Currency</span>

            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value as Currency)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => applyScenario("25000", "7.5", "5", "0")}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Personal loan
          </button>

          <button
            type="button"
            onClick={() => applyScenario("35000", "6.9", "6", "0")}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Auto loan
          </button>

          <button
            type="button"
            onClick={() => applyScenario("15000", "12.5", "3", "100")}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Extra payment
          </button>

          <button
            type="button"
            onClick={resetExample}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Reset example
          </button>
        </div>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {result ? (
        <>
          <ToolResultBox title="Loan estimate">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="Monthly payment"
                value={formatCurrency(result.monthlyPayment, currency)}
                highlight
              />

              <ResultCard
                label="Base payment"
                value={formatCurrency(result.baseMonthlyPayment, currency)}
              />

              <ResultCard
                label="Total interest"
                value={formatCurrency(result.totalInterest, currency)}
              />

              <ResultCard
                label="Total paid"
                value={formatCurrency(result.totalPaid, currency)}
              />

              <ResultCard
                label="Payoff time"
                value={formatMonths(result.payoffMonths)}
              />

              <ResultCard
                label="Interest saved"
                value={formatCurrency(result.interestSaved, currency)}
              />

              <ResultCard
                label="Time saved"
                value={formatMonths(result.monthsSaved)}
              />

              <ResultCard
                label="Scheduled term"
                value={formatMonths(result.scheduledMonths)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              Estimated monthly payment:{" "}
              <strong className="text-black">
                {formatCurrency(result.monthlyPayment, currency)}
              </strong>
              . Total estimated interest:{" "}
              <strong className="text-black">
                {formatCurrency(result.totalInterest, currency)}
              </strong>
              . Total estimated repayment:{" "}
              <strong className="text-black">
                {formatCurrency(result.totalPaid, currency)}
              </strong>
              .
            </div>
          </ToolResultBox>

          <ToolResultBox title="Payment breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownBar
                label="Principal"
                value={numericValues.loanAmount}
                total={result.totalPaid}
                formattedValue={formatCurrency(
                  numericValues.loanAmount,
                  currency
                )}
              />

              <BreakdownBar
                label="Interest"
                value={result.totalInterest}
                total={result.totalPaid}
                formattedValue={formatCurrency(result.totalInterest, currency)}
              />
            </div>
          </ToolResultBox>

          <div className="grid gap-4">
            <TogglePanel
              title="First 12 months"
              description="Show the first monthly payments with principal, interest and remaining balance."
              open={showFirstMonths}
              onToggle={() => setShowFirstMonths((current) => !current)}
            >
              <div className="grid gap-3 sm:hidden">
                {previewRows.map((row) => (
                  <div
                    key={row.month}
                    className="rounded-2xl border border-black/10 bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-black text-black">
                          Month {row.month}
                        </div>

                        <div className="mt-1 text-xs text-black/50">
                          Payment {formatCurrency(row.payment, currency)}
                        </div>
                      </div>

                      <div className="text-right text-sm font-black text-black">
                        {formatCurrency(row.balance, currency)}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-[#fff8df] p-3">
                        <div className="font-bold text-black/45">Principal</div>
                        <div className="mt-1 font-black text-black">
                          {formatCurrency(row.principal, currency)}
                        </div>
                      </div>

                      <div className="rounded-xl bg-[#fff8df] p-3">
                        <div className="font-bold text-black/45">Interest</div>
                        <div className="mt-1 font-black text-black">
                          {formatCurrency(row.interest, currency)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto rounded-2xl border border-black/10 bg-white sm:block">
                <div className="min-w-[720px]">
                  <div className="grid grid-cols-5 gap-3 border-b border-black/10 bg-[#fff8df] px-4 py-3 text-xs font-black uppercase tracking-wide text-black/50">
                    <div>Month</div>
                    <div>Payment</div>
                    <div>Principal</div>
                    <div>Interest</div>
                    <div>Balance</div>
                  </div>

                  {previewRows.map((row) => (
                    <div
                      key={row.month}
                      className="grid grid-cols-5 gap-3 border-b border-black/5 px-4 py-3 text-xs text-black/65 last:border-b-0"
                    >
                      <div className="font-bold text-black">{row.month}</div>
                      <div>{formatCurrency(row.payment, currency)}</div>
                      <div>{formatCurrency(row.principal, currency)}</div>
                      <div>{formatCurrency(row.interest, currency)}</div>
                      <div>{formatCurrency(row.balance, currency)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-black/50">
                This preview shows the first 12 monthly payments. The full payoff
                estimate is calculated internally using the complete loan term.
              </p>
            </TogglePanel>

            <TogglePanel
              title="Yearly balance summary"
              description="Show the estimated remaining loan balance by year."
              open={showYearlySummary}
              onToggle={() => setShowYearlySummary((current) => !current)}
            >
              <div className="grid gap-3">
                {yearlyRows.map((row) => (
                  <div
                    key={row.month}
                    className="rounded-2xl border border-black/10 bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-black text-black">
                          Month {row.month}
                        </div>

                        <div className="mt-1 text-xs text-black/50">
                          Remaining balance
                        </div>
                      </div>

                      <div className="text-right text-sm font-black text-black">
                        {formatCurrency(row.balance, currency)}
                      </div>
                    </div>

                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/10">
                      <div
                        className="h-full rounded-full bg-black"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(
                              100,
                              (row.balance / numericValues.loanAmount) * 100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TogglePanel>
          </div>
        </>
      ) : (
        <ToolInfoBox>
          Enter valid loan details. If the payment is too low to cover monthly
          interest, the loan cannot be paid off.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This loan calculator provides estimates only. Actual payments may vary
        based on lender fees, taxes, insurance, variable rates, payment timing
        and loan terms.
      </ToolInfoBox>
    </div>
  );
}

function TextNumberInput({
  label,
  value,
  onChange,
  onBlur,
  prefix,
  suffix,
  inputMode = "decimal",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  prefix?: string;
  suffix?: string;
  inputMode?: "decimal" | "numeric";
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <div className="mt-3 flex overflow-hidden rounded-2xl border border-black/10 bg-white transition focus-within:border-black">
        {prefix && (
          <div className="flex items-center border-r border-black/10 px-4 text-sm font-bold text-black/50">
            {prefix}
          </div>
        )}

        <input
          type="text"
          inputMode={inputMode}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          className="min-w-0 flex-1 px-4 py-4 text-sm outline-none"
        />

        {suffix && (
          <div className="flex items-center border-l border-black/10 px-4 text-sm font-bold text-black/50">
            {suffix}
          </div>
        )}
      </div>
    </label>
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

function BreakdownBar({
  label,
  value,
  total,
  formattedValue,
}: {
  label: string;
  value: number;
  total: number;
  formattedValue: string;
}) {
  const percentage =
    total > 0 ? Math.max(0, Math.min(100, (value / total) * 100)) : 0;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-black text-black">{label}</div>

          <div className="mt-1 text-xs text-black/50">
            {percentage.toFixed(1)}% of total repayment
          </div>
        </div>

        <div className="text-right text-sm font-black text-black">
          {formattedValue}
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-black"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function TogglePanel({
  title,
  description,
  open,
  onToggle,
  children,
}: {
  title: string;
  description: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-black">{title}</h3>

          <p className="mt-1 text-sm leading-6 text-black/60">{description}</p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-black/5"
        >
          {open ? "Hide details" : "Show details"}
        </button>
      </div>

      {open && <div className="mt-5">{children}</div>}
    </div>
  );
}