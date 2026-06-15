"use client";

import { useMemo, useState, type ReactNode } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";
type PaymentMode = "fixed" | "minimum-plus-extra";

type PayoffMonthRow = {
  month: number;
  payment: number;
  balanceReduction: number;
  interest: number;
  newCharges: number;
  remainingBalance: number;
};

type PayoffResult = {
  payoffMonths: number;
  totalInterest: number;
  totalPaid: number;
  totalNewCharges: number;
  totalCost: number;
  averageMonthlyPayment: number;
  firstPayment: number;
  lastPayment: number;
  monthlyRows: PayoffMonthRow[];
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

function calculateCreditCardPayoff({
  balance,
  apr,
  paymentMode,
  fixedMonthlyPayment,
  minimumPaymentPercent,
  minimumPaymentFloor,
  extraPayment,
  newMonthlyCharges,
}: {
  balance: number;
  apr: number;
  paymentMode: PaymentMode;
  fixedMonthlyPayment: number;
  minimumPaymentPercent: number;
  minimumPaymentFloor: number;
  extraPayment: number;
  newMonthlyCharges: number;
}): PayoffResult | null {
  if (
    balance <= 0 ||
    apr < 0 ||
    apr > 100 ||
    fixedMonthlyPayment < 0 ||
    minimumPaymentPercent < 0 ||
    minimumPaymentPercent > 100 ||
    minimumPaymentFloor < 0 ||
    extraPayment < 0 ||
    newMonthlyCharges < 0
  ) {
    return null;
  }

  if (paymentMode === "fixed" && fixedMonthlyPayment <= 0) {
    return null;
  }

  if (
    paymentMode === "minimum-plus-extra" &&
    minimumPaymentPercent <= 0 &&
    minimumPaymentFloor + extraPayment <= 0
  ) {
    return null;
  }

  const monthlyRate = apr / 100 / 12;

  let remainingBalance = balance;
  let months = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  let totalNewCharges = 0;

  const monthlyRows: PayoffMonthRow[] = [];

  while (remainingBalance > 0.01 && months < 1200) {
    months += 1;

    const startingBalance = remainingBalance;

    remainingBalance += newMonthlyCharges;
    totalNewCharges += newMonthlyCharges;

    const interest = remainingBalance * monthlyRate;

    remainingBalance += interest;
    totalInterest += interest;

    const minimumPayment = Math.max(
      minimumPaymentFloor,
      remainingBalance * (minimumPaymentPercent / 100)
    );

    const plannedPayment =
      paymentMode === "fixed"
        ? fixedMonthlyPayment
        : minimumPayment + extraPayment;

    const payment = Math.min(plannedPayment, remainingBalance);

    if (payment <= 0) {
      return null;
    }

    remainingBalance = Math.max(0, remainingBalance - payment);
    totalPaid += payment;

    const balanceReduction = payment - interest - newMonthlyCharges;

    monthlyRows.push({
      month: months,
      payment,
      balanceReduction,
      interest,
      newCharges: newMonthlyCharges,
      remainingBalance,
    });

    if (
      remainingBalance > 0.01 &&
      remainingBalance >= startingBalance - 0.005
    ) {
      return null;
    }
  }

  if (months >= 1200) {
    return null;
  }

  const firstPayment = monthlyRows[0]?.payment ?? 0;
  const lastPayment = monthlyRows[monthlyRows.length - 1]?.payment ?? 0;

  return {
    payoffMonths: months,
    totalInterest,
    totalPaid,
    totalNewCharges,
    totalCost: totalPaid,
    averageMonthlyPayment: months > 0 ? totalPaid / months : 0,
    firstPayment,
    lastPayment,
    monthlyRows,
  };
}

export default function CreditCardPayoffCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [balance, setBalance] = useState("5000");
  const [apr, setApr] = useState("22.9");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("fixed");
  const [fixedMonthlyPayment, setFixedMonthlyPayment] = useState("250");
  const [minimumPaymentPercent, setMinimumPaymentPercent] = useState("2");
  const [minimumPaymentFloor, setMinimumPaymentFloor] = useState("35");
  const [extraPayment, setExtraPayment] = useState("100");
  const [newMonthlyCharges, setNewMonthlyCharges] = useState("0");
  const [showMonthlyTimeline, setShowMonthlyTimeline] = useState(false);
  const [showYearlySummary, setShowYearlySummary] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      balance: parseNumber(balance),
      apr: parseNumber(apr),
      fixedMonthlyPayment: parseNumber(fixedMonthlyPayment),
      minimumPaymentPercent: parseNumber(minimumPaymentPercent),
      minimumPaymentFloor: parseNumber(minimumPaymentFloor),
      extraPayment: parseNumber(extraPayment),
      newMonthlyCharges: parseNumber(newMonthlyCharges),
    }),
    [
      balance,
      apr,
      fixedMonthlyPayment,
      minimumPaymentPercent,
      minimumPaymentFloor,
      extraPayment,
      newMonthlyCharges,
    ]
  );

  const result = useMemo(() => {
    const selected = calculateCreditCardPayoff({
      balance: numericValues.balance,
      apr: numericValues.apr,
      paymentMode,
      fixedMonthlyPayment: numericValues.fixedMonthlyPayment,
      minimumPaymentPercent: numericValues.minimumPaymentPercent,
      minimumPaymentFloor: numericValues.minimumPaymentFloor,
      extraPayment: numericValues.extraPayment,
      newMonthlyCharges: numericValues.newMonthlyCharges,
    });

    const minimumOnly = calculateCreditCardPayoff({
      balance: numericValues.balance,
      apr: numericValues.apr,
      paymentMode: "minimum-plus-extra",
      fixedMonthlyPayment: numericValues.fixedMonthlyPayment,
      minimumPaymentPercent: numericValues.minimumPaymentPercent,
      minimumPaymentFloor: numericValues.minimumPaymentFloor,
      extraPayment: 0,
      newMonthlyCharges: numericValues.newMonthlyCharges,
    });

    if (!selected) return null;

    const interestDifference = minimumOnly
      ? minimumOnly.totalInterest - selected.totalInterest
      : 0;

    const monthsDifference = minimumOnly
      ? minimumOnly.payoffMonths - selected.payoffMonths
      : 0;

    return {
      selected,
      minimumOnly,
      interestDifference,
      monthsDifference,
    };
  }, [numericValues, paymentMode]);

  const monthlyTimelineRows = useMemo(() => {
    if (!result) return [];

    return result.selected.monthlyRows.slice(0, 36);
  }, [result]);

  const yearlyRows = useMemo(() => {
    if (!result) return [];

    return result.selected.monthlyRows.filter(
      (row) =>
        row.month % 12 === 0 || row.month === result.selected.payoffMonths
    );
  }, [result]);

  function validateInputs() {
    if (numericValues.balance <= 0) {
      setError("Balance must be greater than zero.");
      return false;
    }

    if (
      numericValues.apr < 0 ||
      numericValues.apr > 100 ||
      numericValues.minimumPaymentPercent < 0 ||
      numericValues.minimumPaymentPercent > 100
    ) {
      setError("APR and minimum payment percentage must be between 0 and 100.");
      return false;
    }

    if (
      numericValues.fixedMonthlyPayment < 0 ||
      numericValues.minimumPaymentFloor < 0 ||
      numericValues.extraPayment < 0 ||
      numericValues.newMonthlyCharges < 0
    ) {
      setError("Payment values and new charges cannot be negative.");
      return false;
    }

    if (
      paymentMode === "fixed" &&
      numericValues.fixedMonthlyPayment <= 0
    ) {
      setError("Fixed monthly payment must be greater than zero.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setBalance("5000");
    setApr("22.9");
    setPaymentMode("fixed");
    setFixedMonthlyPayment("250");
    setMinimumPaymentPercent("2");
    setMinimumPaymentFloor("35");
    setExtraPayment("100");
    setNewMonthlyCharges("0");
    setShowMonthlyTimeline(false);
    setShowYearlySummary(false);
    setError("");
  }

  function applyScenario({
    nextBalance,
    nextApr,
    nextMode,
    nextFixedPayment,
    nextMinimumPercent,
    nextMinimumFloor,
    nextExtraPayment,
    nextNewCharges,
  }: {
    nextBalance: string;
    nextApr: string;
    nextMode: PaymentMode;
    nextFixedPayment: string;
    nextMinimumPercent: string;
    nextMinimumFloor: string;
    nextExtraPayment: string;
    nextNewCharges: string;
  }) {
    setBalance(nextBalance);
    setApr(nextApr);
    setPaymentMode(nextMode);
    setFixedMonthlyPayment(nextFixedPayment);
    setMinimumPaymentPercent(nextMinimumPercent);
    setMinimumPaymentFloor(nextMinimumFloor);
    setExtraPayment(nextExtraPayment);
    setNewMonthlyCharges(nextNewCharges);
    setShowMonthlyTimeline(false);
    setShowYearlySummary(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate credit card payoff online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate how long it takes to pay off credit card debt, how much
          interest you may pay and how extra payments can reduce the payoff
          timeline.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Current balance"
          value={formatCurrency(numericValues.balance, currency)}
        />

        <StatCard label="APR" value={formatPercent(numericValues.apr)} />

        <StatCard
          label="Selected payment"
          value={
            result
              ? formatCurrency(result.selected.firstPayment, currency)
              : paymentMode === "fixed"
              ? formatCurrency(numericValues.fixedMonthlyPayment, currency)
              : formatCurrency(
                  Math.max(
                    numericValues.minimumPaymentFloor,
                    numericValues.balance *
                      (numericValues.minimumPaymentPercent / 100)
                  ) + numericValues.extraPayment,
                  currency
                )
          }
        />
      </div>

      <ToolResultBox title="Credit card details">
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
            label="Current balance"
            value={balance}
            onChange={setBalance}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="APR"
            value={apr}
            onChange={setApr}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="New monthly charges"
            value={newMonthlyCharges}
            onChange={setNewMonthlyCharges}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <label className="block">
            <span className="text-sm font-bold text-black">Payment method</span>

            <select
              value={paymentMode}
              onChange={(event) =>
                setPaymentMode(event.target.value as PaymentMode)
              }
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="fixed">Fixed monthly payment</option>
              <option value="minimum-plus-extra">
                Minimum payment plus extra
              </option>
            </select>
          </label>

          {paymentMode === "fixed" ? (
            <TextNumberInput
              label="Fixed monthly payment"
              value={fixedMonthlyPayment}
              onChange={setFixedMonthlyPayment}
              onBlur={validateInputs}
              prefix={currencySymbols[currency]}
            />
          ) : (
            <>
              <TextNumberInput
                label="Minimum payment"
                value={minimumPaymentPercent}
                onChange={setMinimumPaymentPercent}
                onBlur={validateInputs}
                suffix="%"
              />

              <TextNumberInput
                label="Minimum payment floor"
                value={minimumPaymentFloor}
                onChange={setMinimumPaymentFloor}
                onBlur={validateInputs}
                prefix={currencySymbols[currency]}
              />

              <TextNumberInput
                label="Extra monthly payment"
                value={extraPayment}
                onChange={setExtraPayment}
                onBlur={validateInputs}
                prefix={currencySymbols[currency]}
              />
            </>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextBalance: "5000",
                nextApr: "22.9",
                nextMode: "fixed",
                nextFixedPayment: "250",
                nextMinimumPercent: "2",
                nextMinimumFloor: "35",
                nextExtraPayment: "100",
                nextNewCharges: "0",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Fixed payoff
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextBalance: "7500",
                nextApr: "24.9",
                nextMode: "minimum-plus-extra",
                nextFixedPayment: "300",
                nextMinimumPercent: "2",
                nextMinimumFloor: "35",
                nextExtraPayment: "200",
                nextNewCharges: "0",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Minimum + extra
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextBalance: "3500",
                nextApr: "19.9",
                nextMode: "fixed",
                nextFixedPayment: "225",
                nextMinimumPercent: "2",
                nextMinimumFloor: "35",
                nextExtraPayment: "100",
                nextNewCharges: "75",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            With new charges
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
          <ToolResultBox title="Credit card payoff estimate">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="Payoff time"
                value={formatMonths(result.selected.payoffMonths)}
                highlight
              />

              <ResultCard
                label="Total interest"
                value={formatCurrency(result.selected.totalInterest, currency)}
              />

              <ResultCard
                label="Total paid"
                value={formatCurrency(result.selected.totalPaid, currency)}
              />

              <ResultCard
                label="Average payment"
                value={formatCurrency(
                  result.selected.averageMonthlyPayment,
                  currency
                )}
              />

              <ResultCard
                label="Interest vs minimum"
                value={
                  result.minimumOnly
                    ? formatCurrency(result.interestDifference, currency)
                    : "Not available"
                }
              />

              <ResultCard
                label="Time vs minimum"
                value={
                  result.minimumOnly
                    ? `${result.monthsDifference} months`
                    : "Not available"
                }
              />

              <ResultCard
                label="New charges"
                value={formatCurrency(result.selected.totalNewCharges, currency)}
              />

              <ResultCard
                label="Final payment"
                value={formatCurrency(result.selected.lastPayment, currency)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              At your selected payment plan, payoff takes about{" "}
              <strong className="text-black">
                {formatMonths(result.selected.payoffMonths)}
              </strong>
              , with estimated interest of{" "}
              <strong className="text-black">
                {formatCurrency(result.selected.totalInterest, currency)}
              </strong>
              .
            </div>
          </ToolResultBox>

          {result.minimumOnly && (
            <ToolResultBox title="Minimum-only comparison">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ResultCard
                  label="Minimum-only payoff"
                  value={formatMonths(result.minimumOnly.payoffMonths)}
                />

                <ResultCard
                  label="Minimum-only interest"
                  value={formatCurrency(
                    result.minimumOnly.totalInterest,
                    currency
                  )}
                />

                <ResultCard
                  label="Interest difference"
                  value={formatCurrency(result.interestDifference, currency)}
                  highlight={result.interestDifference > 0}
                />

                <ResultCard
                  label="Time difference"
                  value={`${result.monthsDifference} months`}
                />
              </div>
            </ToolResultBox>
          )}

          <ToolResultBox title="Cost breakdown">
            <div className="grid gap-4 sm:grid-cols-3">
              <BreakdownBar
                label="Original balance"
                value={numericValues.balance}
                total={result.selected.totalPaid}
                formattedValue={formatCurrency(numericValues.balance, currency)}
              />

              <BreakdownBar
                label="Interest"
                value={result.selected.totalInterest}
                total={result.selected.totalPaid}
                formattedValue={formatCurrency(
                  result.selected.totalInterest,
                  currency
                )}
              />

              <BreakdownBar
                label="New charges"
                value={result.selected.totalNewCharges}
                total={result.selected.totalPaid}
                formattedValue={formatCurrency(
                  result.selected.totalNewCharges,
                  currency
                )}
              />
            </div>
          </ToolResultBox>

          <div className="grid gap-4">
            <TogglePanel
              title="Monthly payoff timeline"
              description="Show the first 36 months of payments, interest, balance reduction and remaining balance."
              open={showMonthlyTimeline}
              onToggle={() => setShowMonthlyTimeline((current) => !current)}
            >
              <div className="grid gap-3 sm:hidden">
                {monthlyTimelineRows.map((row) => (
                  <TimelineCard key={row.month} row={row} currency={currency} />
                ))}
              </div>

              <div className="hidden overflow-x-auto rounded-2xl border border-black/10 bg-white sm:block">
                <div className="min-w-[820px]">
                  <div className="grid grid-cols-6 gap-3 border-b border-black/10 bg-[#fff8df] px-4 py-3 text-xs font-black uppercase tracking-wide text-black/50">
                    <div>Month</div>
                    <div>Payment</div>
                    <div>Reduction</div>
                    <div>Interest</div>
                    <div>Charges</div>
                    <div>Balance</div>
                  </div>

                  {monthlyTimelineRows.map((row) => (
                    <div
                      key={row.month}
                      className="grid grid-cols-6 gap-3 border-b border-black/5 px-4 py-3 text-xs text-black/65 last:border-b-0"
                    >
                      <div className="font-bold text-black">{row.month}</div>
                      <div>{formatCurrency(row.payment, currency)}</div>
                      <div>
                        {formatCurrency(row.balanceReduction, currency)}
                      </div>
                      <div>{formatCurrency(row.interest, currency)}</div>
                      <div>{formatCurrency(row.newCharges, currency)}</div>
                      <div>
                        {formatCurrency(row.remainingBalance, currency)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TogglePanel>

            <TogglePanel
              title="Yearly balance summary"
              description="Show the estimated remaining credit card balance by year and at final payoff."
              open={showYearlySummary}
              onToggle={() => setShowYearlySummary((current) => !current)}
            >
              <div className="grid gap-3">
                {yearlyRows.map((row) => {
                  const paidOffRate =
                    numericValues.balance > 0
                      ? ((numericValues.balance - row.remainingBalance) /
                          numericValues.balance) *
                        100
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
                            Remaining balance
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-black text-black">
                            {formatCurrency(row.remainingBalance, currency)}
                          </div>

                          <div className="mt-1 text-xs font-bold text-black/45">
                            {formatPercent(paidOffRate)} paid off
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/10">
                        <div
                          className="h-full rounded-full bg-black"
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(100, paidOffRate)
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
          Your payment may be too low to reduce the balance. Increase the
          monthly payment, reduce new monthly charges or lower the balance.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        Credit card interest is often calculated daily by issuers. This tool
        uses monthly estimates and is intended for planning only.
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
  value,
  total,
  formattedValue,
}: {
  label: string;
  value: number;
  total: number;
  formattedValue: string;
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-black text-black">{label}</div>

          <div className="mt-1 text-xs text-black/50">
            {formatPercent(percentage)} of total paid
          </div>
        </div>

        <div className="text-right text-sm font-black text-black">
          {formattedValue}
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-black"
          style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
        />
      </div>
    </div>
  );
}

function TimelineCard({
  row,
  currency,
}: {
  row: PayoffMonthRow;
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
          {formatCurrency(row.remainingBalance, currency)}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl bg-[#fff8df] p-3">
          <div className="font-bold text-black/45">Reduction</div>

          <div className="mt-1 font-black text-black">
            {formatCurrency(row.balanceReduction, currency)}
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