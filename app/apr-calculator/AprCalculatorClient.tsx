"use client";

import { useMemo, useState, type ReactNode } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";

type AmortizationRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

const currencySymbols: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
  JPY: "¥",
};

function parseNumber(value: string) {
  const normalized = value.replace(",", ".").trim();

  if (!normalized) return 0;

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value)}%`;
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

function presentValueOfPayments({
  monthlyPayment,
  monthlyRate,
  months,
}: {
  monthlyPayment: number;
  monthlyRate: number;
  months: number;
}) {
  if (monthlyRate === 0) {
    return monthlyPayment * months;
  }

  return (
    monthlyPayment *
    ((1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate)
  );
}

function calculateApr({
  loanAmount,
  interestRate,
  loanTermMonths,
  originationFee,
  applicationFee,
  otherFees,
}: {
  loanAmount: number;
  interestRate: number;
  loanTermMonths: number;
  originationFee: number;
  applicationFee: number;
  otherFees: number;
}) {
  const months = Math.round(loanTermMonths);

  if (
    loanAmount <= 0 ||
    interestRate < 0 ||
    interestRate > 100 ||
    months <= 0 ||
    originationFee < 0 ||
    applicationFee < 0 ||
    otherFees < 0
  ) {
    return null;
  }

  const totalFees = originationFee + applicationFee + otherFees;
  const amountReceived = loanAmount - totalFees;

  if (amountReceived <= 0) {
    return null;
  }

  const statedMonthlyRate = interestRate / 100 / 12;

  const monthlyPayment =
    statedMonthlyRate === 0
      ? loanAmount / months
      : (loanAmount *
          statedMonthlyRate *
          Math.pow(1 + statedMonthlyRate, months)) /
        (Math.pow(1 + statedMonthlyRate, months) - 1);

  const totalPaid = monthlyPayment * months;
  const totalInterest = totalPaid - loanAmount;
  const financeCharge = totalInterest + totalFees;
  const totalBorrowingCost = amountReceived + financeCharge;
  const feeRate = (totalFees / loanAmount) * 100;

  let low = 0;
  let high = 1;

  while (
    presentValueOfPayments({
      monthlyPayment,
      monthlyRate: high,
      months,
    }) > amountReceived &&
    high < 100
  ) {
    high *= 2;
  }

  for (let index = 0; index < 120; index += 1) {
    const mid = (low + high) / 2;

    const presentValue = presentValueOfPayments({
      monthlyPayment,
      monthlyRate: mid,
      months,
    });

    if (presentValue > amountReceived) {
      low = mid;
    } else {
      high = mid;
    }
  }

  const aprMonthlyRate = (low + high) / 2;
  const apr = aprMonthlyRate * 12 * 100;
  const effectiveAnnualRate = (Math.pow(1 + aprMonthlyRate, 12) - 1) * 100;
  const aprIncrease = apr - interestRate;

  let balance = loanAmount;

  const amortization: AmortizationRow[] = [];

  for (let month = 1; month <= months; month += 1) {
    const interest = balance * statedMonthlyRate;
    const principal = Math.min(monthlyPayment - interest, balance);
    const payment = principal + interest;

    balance = Math.max(0, balance - principal);

    amortization.push({
      month,
      payment,
      principal,
      interest,
      balance,
    });
  }

  return {
    months,
    monthlyPayment,
    totalFees,
    amountReceived,
    totalInterest,
    financeCharge,
    totalPaid,
    totalBorrowingCost,
    feeRate,
    apr,
    effectiveAnnualRate,
    aprIncrease,
    amortization,
  };
}

export default function AprCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [loanAmount, setLoanAmount] = useState("10000");
  const [interestRate, setInterestRate] = useState("8");
  const [loanTermMonths, setLoanTermMonths] = useState("36");
  const [originationFee, setOriginationFee] = useState("300");
  const [applicationFee, setApplicationFee] = useState("50");
  const [otherFees, setOtherFees] = useState("100");
  const [showPaymentSchedule, setShowPaymentSchedule] = useState(false);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      loanAmount: parseNumber(loanAmount),
      interestRate: parseNumber(interestRate),
      loanTermMonths: parseNumber(loanTermMonths),
      originationFee: parseNumber(originationFee),
      applicationFee: parseNumber(applicationFee),
      otherFees: parseNumber(otherFees),
    }),
    [
      loanAmount,
      interestRate,
      loanTermMonths,
      originationFee,
      applicationFee,
      otherFees,
    ]
  );

  const result = useMemo(
    () =>
      calculateApr({
        loanAmount: numericValues.loanAmount,
        interestRate: numericValues.interestRate,
        loanTermMonths: numericValues.loanTermMonths,
        originationFee: numericValues.originationFee,
        applicationFee: numericValues.applicationFee,
        otherFees: numericValues.otherFees,
      }),
    [numericValues]
  );

  const previewRows = useMemo(() => {
    if (!result) return [];

    return result.amortization.slice(0, 12);
  }, [result]);

  function validateInputs() {
    const totalFees =
      numericValues.originationFee +
      numericValues.applicationFee +
      numericValues.otherFees;

    if (numericValues.loanAmount <= 0 || numericValues.loanTermMonths <= 0) {
      setError("Loan amount and loan term must be greater than zero.");
      return false;
    }

    if (numericValues.interestRate < 0 || numericValues.interestRate > 100) {
      setError("Interest rate must be between 0 and 100.");
      return false;
    }

    if (
      numericValues.originationFee < 0 ||
      numericValues.applicationFee < 0 ||
      numericValues.otherFees < 0
    ) {
      setError("Fees cannot be negative.");
      return false;
    }

    if (totalFees >= numericValues.loanAmount) {
      setError("Total fees must be lower than the loan amount.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setLoanAmount("10000");
    setInterestRate("8");
    setLoanTermMonths("36");
    setOriginationFee("300");
    setApplicationFee("50");
    setOtherFees("100");
    setShowPaymentSchedule(false);
    setShowFormulaDetails(false);
    setError("");
  }

  function applyScenario({
    nextLoanAmount,
    nextInterestRate,
    nextTerm,
    nextOriginationFee,
    nextApplicationFee,
    nextOtherFees,
  }: {
    nextLoanAmount: string;
    nextInterestRate: string;
    nextTerm: string;
    nextOriginationFee: string;
    nextApplicationFee: string;
    nextOtherFees: string;
  }) {
    setLoanAmount(nextLoanAmount);
    setInterestRate(nextInterestRate);
    setLoanTermMonths(nextTerm);
    setOriginationFee(nextOriginationFee);
    setApplicationFee(nextApplicationFee);
    setOtherFees(nextOtherFees);
    setShowPaymentSchedule(false);
    setShowFormulaDetails(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate APR online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate annual percentage rate from loan amount, stated interest
          rate, repayment term and upfront loan fees.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Loan amount"
          value={formatCurrency(numericValues.loanAmount, currency)}
        />

        <StatCard
          label="Stated rate"
          value={formatPercent(numericValues.interestRate)}
        />

        <StatCard
          label="Loan term"
          value={formatMonths(Math.round(numericValues.loanTermMonths))}
        />
      </div>

      <ToolResultBox title="Loan and fee details">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-bold text-black">Currency</span>

            <select
              value={currency}
              onChange={(event) =>
                setCurrency(event.target.value as CurrencyCode)
              }
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="CHF">CHF - Swiss Franc</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </label>

          <TextNumberInput
            label="Loan amount"
            value={loanAmount}
            onChange={setLoanAmount}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Stated interest rate"
            value={interestRate}
            onChange={setInterestRate}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Loan term"
            value={loanTermMonths}
            onChange={setLoanTermMonths}
            onBlur={validateInputs}
            suffix="months"
          />

          <TextNumberInput
            label="Origination fee"
            value={originationFee}
            onChange={setOriginationFee}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Application fee"
            value={applicationFee}
            onChange={setApplicationFee}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Other fees"
            value={otherFees}
            onChange={setOtherFees}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextLoanAmount: "10000",
                nextInterestRate: "8",
                nextTerm: "36",
                nextOriginationFee: "300",
                nextApplicationFee: "50",
                nextOtherFees: "100",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Personal loan
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextLoanAmount: "25000",
                nextInterestRate: "6.5",
                nextTerm: "60",
                nextOriginationFee: "500",
                nextApplicationFee: "0",
                nextOtherFees: "250",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Auto loan
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextLoanAmount: "50000",
                nextInterestRate: "10.5",
                nextTerm: "48",
                nextOriginationFee: "1500",
                nextApplicationFee: "250",
                nextOtherFees: "500",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Business loan
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
          <ToolResultBox title="APR estimate">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="APR"
                value={formatPercent(result.apr)}
                highlight
              />

              <ResultCard
                label="Stated rate"
                value={formatPercent(numericValues.interestRate)}
              />

              <ResultCard
                label="APR increase"
                value={formatPercent(result.aprIncrease)}
              />

              <ResultCard
                label="Effective annual rate"
                value={formatPercent(result.effectiveAnnualRate)}
              />

              <ResultCard
                label="Monthly payment"
                value={formatCurrency(result.monthlyPayment, currency)}
              />

              <ResultCard
                label="Amount received"
                value={formatCurrency(result.amountReceived, currency)}
              />

              <ResultCard
                label="Total fees"
                value={formatCurrency(result.totalFees, currency)}
              />

              <ResultCard
                label="Finance charge"
                value={formatCurrency(result.financeCharge, currency)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              Estimated APR:{" "}
              <strong className="text-black">
                {formatPercent(result.apr)}
              </strong>
              . You receive approximately{" "}
              <strong className="text-black">
                {formatCurrency(result.amountReceived, currency)}
              </strong>{" "}
              after fees and pay an estimated monthly payment of{" "}
              <strong className="text-black">
                {formatCurrency(result.monthlyPayment, currency)}
              </strong>
              .
            </div>
          </ToolResultBox>

          <ToolResultBox title="Loan cost breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownBar
                label="Amount received"
                percentage={
                  numericValues.loanAmount > 0
                    ? (result.amountReceived / numericValues.loanAmount) * 100
                    : 0
                }
                formattedValue={formatCurrency(result.amountReceived, currency)}
              />

              <BreakdownBar
                label="Fees"
                percentage={result.feeRate}
                formattedValue={formatCurrency(result.totalFees, currency)}
              />

              <BreakdownBar
                label="Interest"
                percentage={
                  result.totalPaid > 0
                    ? (result.totalInterest / result.totalPaid) * 100
                    : 0
                }
                formattedValue={formatCurrency(result.totalInterest, currency)}
              />

              <BreakdownBar
                label="Total paid"
                percentage={100}
                formattedValue={formatCurrency(result.totalPaid, currency)}
              />
            </div>
          </ToolResultBox>

          <div className="grid gap-4">
            <TogglePanel
              title="First 12 payments"
              description="Show the first monthly payments based on the stated interest rate."
              open={showPaymentSchedule}
              onToggle={() => setShowPaymentSchedule((current) => !current)}
            >
              <div className="grid gap-3 sm:hidden">
                {previewRows.map((row) => (
                  <PaymentCard key={row.month} row={row} currency={currency} />
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
            </TogglePanel>

            <TogglePanel
              title="APR formula details"
              description="Show how APR differs from the stated interest rate."
              open={showFormulaDetails}
              onToggle={() => setShowFormulaDetails((current) => !current)}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormulaCard
                  title="Stated interest rate"
                  text="The stated interest rate is used to calculate the regular loan payment on the full loan amount."
                />

                <FormulaCard
                  title="APR"
                  text="APR estimates the yearly cost of borrowing after including upfront fees and the amount actually received by the borrower."
                />

                <FormulaCard
                  title="Amount received"
                  text="Amount received = loan amount - origination fee - application fee - other upfront fees."
                />

                <FormulaCard
                  title="Finance charge"
                  text="Finance charge = total interest paid over the loan term + upfront loan fees."
                />
              </div>
            </TogglePanel>
          </div>
        </>
      ) : (
        <ToolInfoBox>
          Enter valid loan values to estimate APR. Total fees must be lower than
          the loan amount.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        APR calculations can vary by lender, country, regulation and fee
        treatment. This calculator provides an estimate for planning and
        comparison only.
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  prefix?: string;
  suffix?: string;
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
          inputMode="decimal"
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
  percentage,
  formattedValue,
}: {
  label: string;
  percentage: number;
  formattedValue: string;
}) {
  const safePercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-black text-black">{label}</div>

          <div className="mt-1 text-xs text-black/50">
            {formatPercent(percentage)}
          </div>
        </div>

        <div className="text-right text-sm font-black text-black">
          {formattedValue}
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-black"
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </div>
  );
}

function PaymentCard({
  row,
  currency,
}: {
  row: AmortizationRow;
  currency: CurrencyCode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
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
  );
}

function FormulaCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <h3 className="text-sm font-black text-black">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-black/60">{text}</p>
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