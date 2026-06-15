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

function calculateAutoLoan({
  vehiclePrice,
  downPayment,
  tradeInValue,
  rebate,
  salesTaxRate,
  fees,
  interestRate,
  loanTermMonths,
  extraMonthlyPayment,
}: {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  rebate: number;
  salesTaxRate: number;
  fees: number;
  interestRate: number;
  loanTermMonths: number;
  extraMonthlyPayment: number;
}) {
  const scheduledMonths = Math.round(loanTermMonths);

  if (
    vehiclePrice <= 0 ||
    downPayment < 0 ||
    tradeInValue < 0 ||
    rebate < 0 ||
    salesTaxRate < 0 ||
    salesTaxRate > 100 ||
    fees < 0 ||
    interestRate < 0 ||
    interestRate > 100 ||
    scheduledMonths <= 0 ||
    extraMonthlyPayment < 0
  ) {
    return null;
  }

  const taxableAmount = Math.max(0, vehiclePrice - tradeInValue - rebate);
  const salesTax = taxableAmount * (salesTaxRate / 100);
  const taxAndFees = salesTax + fees;
  const totalVehicleCost = vehiclePrice + salesTax + fees;

  const loanAmount = Math.max(
    0,
    totalVehicleCost - downPayment - tradeInValue - rebate
  );

  if (loanAmount <= 0) {
    return null;
  }

  const monthlyRate = interestRate / 100 / 12;

  const baseMonthlyPayment =
    monthlyRate === 0
      ? loanAmount / scheduledMonths
      : (loanAmount *
          monthlyRate *
          Math.pow(1 + monthlyRate, scheduledMonths)) /
        (Math.pow(1 + monthlyRate, scheduledMonths) - 1);

  const monthlyPayment = baseMonthlyPayment + extraMonthlyPayment;

  let balance = loanAmount;
  let payoffMonths = 0;
  let totalPaid = 0;
  let totalInterest = 0;

  const amortization: AmortizationRow[] = [];

  while (balance > 0.005 && payoffMonths < 1200) {
    const interest = balance * monthlyRate;
    const principal = Math.min(monthlyPayment - interest, balance);

    if (principal <= 0) {
      return null;
    }

    const payment = principal + interest;

    balance = Math.max(0, balance - principal);
    totalPaid += payment;
    totalInterest += interest;
    payoffMonths += 1;

    amortization.push({
      month: payoffMonths,
      payment,
      principal,
      interest,
      balance,
    });
  }

  if (payoffMonths >= 1200) {
    return null;
  }

  const scheduledTotalPaid = baseMonthlyPayment * scheduledMonths;
  const scheduledTotalInterest = scheduledTotalPaid - loanAmount;
  const interestSaved = Math.max(0, scheduledTotalInterest - totalInterest);
  const monthsSaved = Math.max(0, scheduledMonths - payoffMonths);

  const totalOutOfPocketCash = downPayment + totalPaid;
  const totalCostIncludingTradeIn = downPayment + tradeInValue + totalPaid;
  const loanToValueRatio = (loanAmount / vehiclePrice) * 100;
  const effectiveDownPaymentRate = (downPayment / vehiclePrice) * 100;

  return {
    taxableAmount,
    salesTax,
    fees,
    taxAndFees,
    totalVehicleCost,
    loanAmount,
    baseMonthlyPayment,
    monthlyPayment,
    scheduledMonths,
    payoffMonths,
    totalInterest,
    scheduledTotalInterest,
    interestSaved,
    monthsSaved,
    totalPaid,
    scheduledTotalPaid,
    totalOutOfPocketCash,
    totalCostIncludingTradeIn,
    loanToValueRatio,
    effectiveDownPaymentRate,
    amortization,
  };
}

export default function AutoLoanCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [vehiclePrice, setVehiclePrice] = useState("32000");
  const [downPayment, setDownPayment] = useState("4000");
  const [tradeInValue, setTradeInValue] = useState("2500");
  const [rebate, setRebate] = useState("1000");
  const [salesTaxRate, setSalesTaxRate] = useState("7.5");
  const [fees, setFees] = useState("750");
  const [interestRate, setInterestRate] = useState("6.9");
  const [loanTermMonths, setLoanTermMonths] = useState("60");
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState("0");
  const [showPaymentSchedule, setShowPaymentSchedule] = useState(false);
  const [showYearlySummary, setShowYearlySummary] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      vehiclePrice: parseNumber(vehiclePrice),
      downPayment: parseNumber(downPayment),
      tradeInValue: parseNumber(tradeInValue),
      rebate: parseNumber(rebate),
      salesTaxRate: parseNumber(salesTaxRate),
      fees: parseNumber(fees),
      interestRate: parseNumber(interestRate),
      loanTermMonths: parseNumber(loanTermMonths),
      extraMonthlyPayment: parseNumber(extraMonthlyPayment),
    }),
    [
      vehiclePrice,
      downPayment,
      tradeInValue,
      rebate,
      salesTaxRate,
      fees,
      interestRate,
      loanTermMonths,
      extraMonthlyPayment,
    ]
  );

  const result = useMemo(
    () =>
      calculateAutoLoan({
        vehiclePrice: numericValues.vehiclePrice,
        downPayment: numericValues.downPayment,
        tradeInValue: numericValues.tradeInValue,
        rebate: numericValues.rebate,
        salesTaxRate: numericValues.salesTaxRate,
        fees: numericValues.fees,
        interestRate: numericValues.interestRate,
        loanTermMonths: numericValues.loanTermMonths,
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
      (row) => row.month % 12 === 0 || row.month === result.payoffMonths
    );
  }, [result]);

  function validateInputs() {
    if (numericValues.vehiclePrice <= 0) {
      setError("Vehicle price must be greater than zero.");
      return false;
    }

    if (
      numericValues.downPayment < 0 ||
      numericValues.tradeInValue < 0 ||
      numericValues.rebate < 0 ||
      numericValues.fees < 0 ||
      numericValues.extraMonthlyPayment < 0
    ) {
      setError("Payments, trade-in value, rebates, fees and extra payments cannot be negative.");
      return false;
    }

    if (
      numericValues.salesTaxRate < 0 ||
      numericValues.salesTaxRate > 100 ||
      numericValues.interestRate < 0 ||
      numericValues.interestRate > 100
    ) {
      setError("Tax and interest rates must be between 0 and 100.");
      return false;
    }

    if (numericValues.loanTermMonths <= 0) {
      setError("Loan term must be greater than zero.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setVehiclePrice("32000");
    setDownPayment("4000");
    setTradeInValue("2500");
    setRebate("1000");
    setSalesTaxRate("7.5");
    setFees("750");
    setInterestRate("6.9");
    setLoanTermMonths("60");
    setExtraMonthlyPayment("0");
    setShowPaymentSchedule(false);
    setShowYearlySummary(false);
    setError("");
  }

  function applyScenario({
    nextVehiclePrice,
    nextDownPayment,
    nextTradeIn,
    nextRebate,
    nextSalesTax,
    nextFees,
    nextInterest,
    nextTerm,
    nextExtra,
  }: {
    nextVehiclePrice: string;
    nextDownPayment: string;
    nextTradeIn: string;
    nextRebate: string;
    nextSalesTax: string;
    nextFees: string;
    nextInterest: string;
    nextTerm: string;
    nextExtra: string;
  }) {
    setVehiclePrice(nextVehiclePrice);
    setDownPayment(nextDownPayment);
    setTradeInValue(nextTradeIn);
    setRebate(nextRebate);
    setSalesTaxRate(nextSalesTax);
    setFees(nextFees);
    setInterestRate(nextInterest);
    setLoanTermMonths(nextTerm);
    setExtraMonthlyPayment(nextExtra);
    setShowPaymentSchedule(false);
    setShowYearlySummary(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate auto loan payments online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate your monthly car payment with vehicle price, down payment,
          trade-in value, rebates, sales tax, fees, interest rate and loan term.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Vehicle price"
          value={formatCurrency(numericValues.vehiclePrice, currency)}
        />

        <StatCard
          label="Interest rate"
          value={formatPercent(numericValues.interestRate)}
        />

        <StatCard
          label="Loan term"
          value={formatMonths(Math.round(numericValues.loanTermMonths))}
        />
      </div>

      <ToolResultBox title="Vehicle and loan details">
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
            label="Vehicle price"
            value={vehiclePrice}
            onChange={setVehiclePrice}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Down payment"
            value={downPayment}
            onChange={setDownPayment}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Trade-in value"
            value={tradeInValue}
            onChange={setTradeInValue}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Cash rebate"
            value={rebate}
            onChange={setRebate}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Sales tax"
            value={salesTaxRate}
            onChange={setSalesTaxRate}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Registration / dealer fees"
            value={fees}
            onChange={setFees}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Interest rate"
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
            label="Extra monthly payment"
            value={extraMonthlyPayment}
            onChange={setExtraMonthlyPayment}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextVehiclePrice: "32000",
                nextDownPayment: "4000",
                nextTradeIn: "2500",
                nextRebate: "1000",
                nextSalesTax: "7.5",
                nextFees: "750",
                nextInterest: "6.9",
                nextTerm: "60",
                nextExtra: "0",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Standard auto loan
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextVehiclePrice: "48000",
                nextDownPayment: "8000",
                nextTradeIn: "6000",
                nextRebate: "1500",
                nextSalesTax: "8.25",
                nextFees: "950",
                nextInterest: "5.9",
                nextTerm: "72",
                nextExtra: "100",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            New car
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextVehiclePrice: "18500",
                nextDownPayment: "2500",
                nextTradeIn: "0",
                nextRebate: "0",
                nextSalesTax: "6.5",
                nextFees: "500",
                nextInterest: "9.5",
                nextTerm: "48",
                nextExtra: "50",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Used car
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
          <ToolResultBox title="Auto loan estimate">
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
                label="Loan amount"
                value={formatCurrency(result.loanAmount, currency)}
              />

              <ResultCard
                label="Sales tax"
                value={formatCurrency(result.salesTax, currency)}
              />

              <ResultCard
                label="Total interest"
                value={formatCurrency(result.totalInterest, currency)}
              />

              <ResultCard
                label="Interest saved"
                value={formatCurrency(result.interestSaved, currency)}
              />

              <ResultCard
                label="Payoff time"
                value={formatMonths(result.payoffMonths)}
              />

              <ResultCard
                label="Loan-to-value"
                value={formatPercent(result.loanToValueRatio)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              Estimated monthly payment:{" "}
              <strong className="text-black">
                {formatCurrency(result.monthlyPayment, currency)}
              </strong>
              . Estimated financed amount:{" "}
              <strong className="text-black">
                {formatCurrency(result.loanAmount, currency)}
              </strong>
              . Estimated total interest:{" "}
              <strong className="text-black">
                {formatCurrency(result.totalInterest, currency)}
              </strong>
              .
            </div>
          </ToolResultBox>

          <ToolResultBox title="Purchase and financing breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownBar
                label="Vehicle price"
                percentage={
                  result.totalVehicleCost > 0
                    ? (numericValues.vehiclePrice / result.totalVehicleCost) *
                      100
                    : 0
                }
                formattedValue={formatCurrency(
                  numericValues.vehiclePrice,
                  currency
                )}
              />

              <BreakdownBar
                label="Sales tax and fees"
                percentage={
                  result.totalVehicleCost > 0
                    ? (result.taxAndFees / result.totalVehicleCost) * 100
                    : 0
                }
                formattedValue={formatCurrency(result.taxAndFees, currency)}
              />

              <BreakdownBar
                label="Down payment"
                percentage={
                  result.totalVehicleCost > 0
                    ? (numericValues.downPayment / result.totalVehicleCost) *
                      100
                    : 0
                }
                formattedValue={formatCurrency(
                  numericValues.downPayment,
                  currency
                )}
              />

              <BreakdownBar
                label="Amount financed"
                percentage={
                  result.totalVehicleCost > 0
                    ? (result.loanAmount / result.totalVehicleCost) * 100
                    : 0
                }
                formattedValue={formatCurrency(result.loanAmount, currency)}
              />

              <BreakdownBar
                label="Trade-in value"
                percentage={
                  result.totalVehicleCost > 0
                    ? (numericValues.tradeInValue / result.totalVehicleCost) *
                      100
                    : 0
                }
                formattedValue={formatCurrency(
                  numericValues.tradeInValue,
                  currency
                )}
              />

              <BreakdownBar
                label="Cash rebate"
                percentage={
                  result.totalVehicleCost > 0
                    ? (numericValues.rebate / result.totalVehicleCost) * 100
                    : 0
                }
                formattedValue={formatCurrency(numericValues.rebate, currency)}
              />
            </div>
          </ToolResultBox>

          <ToolResultBox title="Total cost summary">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="Total vehicle cost"
                value={formatCurrency(result.totalVehicleCost, currency)}
              />

              <ResultCard
                label="Total paid to lender"
                value={formatCurrency(result.totalPaid, currency)}
              />

              <ResultCard
                label="Cash out of pocket"
                value={formatCurrency(result.totalOutOfPocketCash, currency)}
              />

              <ResultCard
                label="Cost incl. trade-in"
                value={formatCurrency(
                  result.totalCostIncludingTradeIn,
                  currency
                )}
              />
            </div>
          </ToolResultBox>

          <div className="grid gap-4">
            <TogglePanel
              title="First 12 payments"
              description="Show the first monthly payments with principal, interest and remaining balance."
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
              title="Yearly balance summary"
              description="Show the estimated remaining auto loan balance by year."
              open={showYearlySummary}
              onToggle={() => setShowYearlySummary((current) => !current)}
            >
              <div className="grid gap-3">
                {yearlyRows.map((row) => {
                  const remainingRate =
                    result.loanAmount > 0
                      ? (row.balance / result.loanAmount) * 100
                      : 0;

                  return (
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
                            Remaining loan balance
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-black text-black">
                            {formatCurrency(row.balance, currency)}
                          </div>

                          <div className="mt-1 text-xs font-bold text-black/45">
                            {formatPercent(remainingRate)} remaining
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/10">
                        <div
                          className="h-full rounded-full bg-black"
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(100, remainingRate)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </TogglePanel>
          </div>
        </>
      ) : (
        <ToolInfoBox>
          Enter valid car purchase and financing details to calculate your auto
          loan estimate. If your down payment, trade-in and rebate cover the full
          cost, no loan amount is needed.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This calculator is an estimate. Actual payments can vary based on lender
        terms, credit score, taxes, fees, insurance, warranty products and local
        rules.
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