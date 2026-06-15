"use client";

import { useMemo, useState, type ReactNode } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";
type Strategy = "avalanche" | "snowball";

type DebtInput = {
  id: string;
  name: string;
  balance: string;
  annualRate: string;
  minimumPayment: string;
};

type DebtInputKey = "name" | "balance" | "annualRate" | "minimumPayment";

type ParsedDebt = {
  id: string;
  name: string;
  balance: number;
  annualRate: number;
  minimumPayment: number;
};

type WorkingDebt = ParsedDebt & {
  remainingBalance: number;
};

type PayoffEvent = {
  id: string;
  name: string;
  month: number;
};

type PayoffMonthRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
};

type StrategyResult = {
  strategy: Strategy;
  payoffMonths: number;
  totalInterest: number;
  totalPaid: number;
  startingDebt: number;
  monthlyBudget: number;
  averageMonthlyPayment: number;
  payoffOrder: PayoffEvent[];
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

const defaultDebts: DebtInput[] = [
  {
    id: "debt-1",
    name: "Credit Card",
    balance: "4200",
    annualRate: "21.9",
    minimumPayment: "120",
  },
  {
    id: "debt-2",
    name: "Car Loan",
    balance: "12000",
    annualRate: "7.5",
    minimumPayment: "280",
  },
  {
    id: "debt-3",
    name: "Personal Loan",
    balance: "6500",
    annualRate: "12.5",
    minimumPayment: "180",
  },
];

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

function sortDebts(debts: WorkingDebt[], strategy: Strategy) {
  return [...debts].sort((a, b) => {
    if (strategy === "avalanche") {
      if (b.annualRate !== a.annualRate) {
        return b.annualRate - a.annualRate;
      }

      return a.remainingBalance - b.remainingBalance;
    }

    if (a.remainingBalance !== b.remainingBalance) {
      return a.remainingBalance - b.remainingBalance;
    }

    return b.annualRate - a.annualRate;
  });
}

function simulateDebtPayoff({
  debts,
  extraPayment,
  strategy,
}: {
  debts: ParsedDebt[];
  extraPayment: number;
  strategy: Strategy;
}): StrategyResult | null {
  const activeDebts: WorkingDebt[] = debts
    .filter((debt) => debt.balance > 0)
    .map((debt) => ({
      ...debt,
      remainingBalance: debt.balance,
    }));

  if (!activeDebts.length) return null;

  const startingDebt = activeDebts.reduce(
    (sum, debt) => sum + debt.remainingBalance,
    0
  );

  const minimumPaymentTotal = activeDebts.reduce(
    (sum, debt) => sum + debt.minimumPayment,
    0
  );

  const monthlyBudget = minimumPaymentTotal + extraPayment;

  if (monthlyBudget <= 0) return null;

  let month = 0;
  let totalInterest = 0;
  let totalPaid = 0;

  const payoffOrder: PayoffEvent[] = [];
  const monthlyRows: PayoffMonthRow[] = [];

  function recordPayoff(debt: WorkingDebt) {
    if (!payoffOrder.some((event) => event.id === debt.id)) {
      payoffOrder.push({
        id: debt.id,
        name: debt.name,
        month,
      });
    }
  }

  while (
    activeDebts.some((debt) => debt.remainingBalance > 0.01) &&
    month < 1200
  ) {
    month += 1;

    let monthInterest = 0;
    let monthPayment = 0;

    for (const debt of activeDebts) {
      if (debt.remainingBalance <= 0.01) continue;

      const monthlyRate = debt.annualRate / 100 / 12;
      const interest = debt.remainingBalance * monthlyRate;

      debt.remainingBalance += interest;
      monthInterest += interest;
      totalInterest += interest;
    }

    let availablePayment = monthlyBudget;

    for (const debt of activeDebts) {
      if (debt.remainingBalance <= 0.01 || availablePayment <= 0.01) continue;

      const requiredPayment = Math.min(
        debt.minimumPayment,
        debt.remainingBalance
      );

      const payment = Math.min(requiredPayment, availablePayment);

      debt.remainingBalance = Math.max(0, debt.remainingBalance - payment);
      availablePayment -= payment;
      monthPayment += payment;
      totalPaid += payment;

      if (debt.remainingBalance <= 0.01) {
        debt.remainingBalance = 0;
        recordPayoff(debt);
      }
    }

    while (availablePayment > 0.01) {
      const targetDebt = sortDebts(
        activeDebts.filter((debt) => debt.remainingBalance > 0.01),
        strategy
      )[0];

      if (!targetDebt) break;

      const payment = Math.min(availablePayment, targetDebt.remainingBalance);

      targetDebt.remainingBalance = Math.max(
        0,
        targetDebt.remainingBalance - payment
      );
      availablePayment -= payment;
      monthPayment += payment;
      totalPaid += payment;

      if (targetDebt.remainingBalance <= 0.01) {
        targetDebt.remainingBalance = 0;
        recordPayoff(targetDebt);
      }
    }

    const remainingBalance = activeDebts.reduce(
      (sum, debt) => sum + Math.max(0, debt.remainingBalance),
      0
    );

    monthlyRows.push({
      month,
      payment: monthPayment,
      principal: monthPayment - monthInterest,
      interest: monthInterest,
      remainingBalance,
    });
  }

  if (month >= 1200) return null;

  return {
    strategy,
    payoffMonths: month,
    totalInterest,
    totalPaid,
    startingDebt,
    monthlyBudget,
    averageMonthlyPayment: month > 0 ? totalPaid / month : 0,
    payoffOrder,
    monthlyRows,
  };
}

export default function DebtPayoffCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [strategy, setStrategy] = useState<Strategy>("avalanche");
  const [extraPayment, setExtraPayment] = useState("250");
  const [debts, setDebts] = useState<DebtInput[]>(defaultDebts);
  const [showMonthlyTimeline, setShowMonthlyTimeline] = useState(false);
  const [showYearlySummary, setShowYearlySummary] = useState(false);
  const [error, setError] = useState("");

  const parsedDebts = useMemo(
    () =>
      debts.map((debt) => ({
        id: debt.id,
        name: debt.name,
        balance: parseNumber(debt.balance),
        annualRate: parseNumber(debt.annualRate),
        minimumPayment: parseNumber(debt.minimumPayment),
      })),
    [debts]
  );

  const numericExtraPayment = useMemo(
    () => parseNumber(extraPayment),
    [extraPayment]
  );

  const totalStartingDebt = useMemo(
    () => parsedDebts.reduce((sum, debt) => sum + Math.max(0, debt.balance), 0),
    [parsedDebts]
  );

  const totalMinimumPayment = useMemo(
    () =>
      parsedDebts.reduce(
        (sum, debt) => sum + Math.max(0, debt.minimumPayment),
        0
      ),
    [parsedDebts]
  );

  const result = useMemo(() => {
    if (
      numericExtraPayment < 0 ||
      parsedDebts.some(
        (debt) =>
          debt.balance < 0 ||
          debt.annualRate < 0 ||
          debt.minimumPayment < 0 ||
          debt.annualRate > 100 ||
          !debt.name.trim()
      )
    ) {
      return null;
    }

    const selected = simulateDebtPayoff({
      debts: parsedDebts,
      extraPayment: numericExtraPayment,
      strategy,
    });

    const avalanche = simulateDebtPayoff({
      debts: parsedDebts,
      extraPayment: numericExtraPayment,
      strategy: "avalanche",
    });

    const snowball = simulateDebtPayoff({
      debts: parsedDebts,
      extraPayment: numericExtraPayment,
      strategy: "snowball",
    });

    if (!selected) return null;

    const bestStrategy =
      avalanche && snowball
        ? avalanche.totalInterest <= snowball.totalInterest
          ? "avalanche"
          : "snowball"
        : strategy;

    const interestDifference =
      avalanche && snowball
        ? Math.abs(avalanche.totalInterest - snowball.totalInterest)
        : 0;

    return {
      selected,
      avalanche,
      snowball,
      bestStrategy,
      interestDifference,
    };
  }, [numericExtraPayment, parsedDebts, strategy]);

  const monthlyTimelineRows = useMemo(() => {
    if (!result) return [];

    return result.selected.monthlyRows.slice(0, 36);
  }, [result]);

  const yearlyRows = useMemo(() => {
    if (!result) return [];

    const highlightedMonths = new Set<number>();

    result.selected.monthlyRows.forEach((row) => {
      if (row.month % 12 === 0 || row.month === result.selected.payoffMonths) {
        highlightedMonths.add(row.month);
      }
    });

    return result.selected.monthlyRows.filter((row) =>
      highlightedMonths.has(row.month)
    );
  }, [result]);

  function updateDebt(id: string, key: DebtInputKey, value: string) {
    setDebts((current) =>
      current.map((debt) =>
        debt.id === id
          ? {
              ...debt,
              [key]: value,
            }
          : debt
      )
    );

    setError("");
  }

  function addDebt() {
    setDebts((current) => [
      ...current,
      {
        id: `debt-${Date.now()}`,
        name: "New Debt",
        balance: "1000",
        annualRate: "10",
        minimumPayment: "50",
      },
    ]);

    setShowMonthlyTimeline(false);
    setShowYearlySummary(false);
    setError("");
  }

  function removeDebt(id: string) {
    setDebts((current) => current.filter((debt) => debt.id !== id));
    setShowMonthlyTimeline(false);
    setShowYearlySummary(false);
    setError("");
  }

  function validateInputs() {
    if (numericExtraPayment < 0) {
      setError("Extra payment cannot be negative.");
      return false;
    }

    if (
      parsedDebts.some(
        (debt) =>
          debt.balance < 0 ||
          debt.annualRate < 0 ||
          debt.minimumPayment < 0
      )
    ) {
      setError("Debt balances, interest rates and payments cannot be negative.");
      return false;
    }

    if (parsedDebts.some((debt) => debt.annualRate > 100)) {
      setError("APR must be between 0 and 100.");
      return false;
    }

    if (parsedDebts.some((debt) => !debt.name.trim())) {
      setError("Each debt needs a name.");
      return false;
    }

    if (totalStartingDebt <= 0) {
      setError("Add at least one debt with a balance greater than zero.");
      return false;
    }

    if (totalMinimumPayment + numericExtraPayment <= 0) {
      setError("Total monthly payment must be greater than zero.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setStrategy("avalanche");
    setExtraPayment("250");
    setDebts(defaultDebts.map((debt) => ({ ...debt })));
    setShowMonthlyTimeline(false);
    setShowYearlySummary(false);
    setError("");
  }

  function applyScenario(nextDebts: DebtInput[], nextExtraPayment: string) {
    setDebts(nextDebts.map((debt) => ({ ...debt })));
    setExtraPayment(nextExtraPayment);
    setShowMonthlyTimeline(false);
    setShowYearlySummary(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Plan your debt payoff online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Compare debt avalanche and debt snowball payoff strategies using
          balances, APRs, minimum payments and extra monthly payments.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Starting debt"
          value={formatCurrency(totalStartingDebt, currency)}
        />

        <StatCard
          label="Minimum payments"
          value={formatCurrency(totalMinimumPayment, currency)}
        />

        <StatCard
          label="Extra payment"
          value={formatCurrency(numericExtraPayment, currency)}
        />
      </div>

      <ToolResultBox title="Debt payoff setup">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
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

          <label className="block">
            <span className="text-sm font-bold text-black">Strategy</span>

            <select
              value={strategy}
              onChange={(event) => setStrategy(event.target.value as Strategy)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="avalanche">
                Avalanche — highest interest first
              </option>
              <option value="snowball">
                Snowball — smallest balance first
              </option>
            </select>
          </label>

          <TextNumberInput
            label="Extra monthly payment"
            value={extraPayment}
            onChange={setExtraPayment}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              applyScenario(
                [
                  {
                    id: "debt-1",
                    name: "Credit Card",
                    balance: "4200",
                    annualRate: "21.9",
                    minimumPayment: "120",
                  },
                  {
                    id: "debt-2",
                    name: "Car Loan",
                    balance: "12000",
                    annualRate: "7.5",
                    minimumPayment: "280",
                  },
                  {
                    id: "debt-3",
                    name: "Personal Loan",
                    balance: "6500",
                    annualRate: "12.5",
                    minimumPayment: "180",
                  },
                ],
                "250"
              )
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Mixed debts
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario(
                [
                  {
                    id: "debt-1",
                    name: "Card 1",
                    balance: "3500",
                    annualRate: "24.9",
                    minimumPayment: "105",
                  },
                  {
                    id: "debt-2",
                    name: "Card 2",
                    balance: "2800",
                    annualRate: "19.9",
                    minimumPayment: "90",
                  },
                  {
                    id: "debt-3",
                    name: "Store Card",
                    balance: "1200",
                    annualRate: "27.5",
                    minimumPayment: "45",
                  },
                ],
                "300"
              )
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Credit cards
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario(
                [
                  {
                    id: "debt-1",
                    name: "Student Loan",
                    balance: "22000",
                    annualRate: "5.8",
                    minimumPayment: "240",
                  },
                  {
                    id: "debt-2",
                    name: "Personal Loan",
                    balance: "8000",
                    annualRate: "11.5",
                    minimumPayment: "210",
                  },
                ],
                "200"
              )
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Student + personal
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

      <div className="grid gap-4">
        {debts.map((debt, index) => (
          <div
            key={debt.id}
            className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="font-bold text-black">Debt #{index + 1}</div>

              {debts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDebt(debt.id)}
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-black/5"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="block">
                <span className="text-sm font-bold text-black">Name</span>

                <input
                  value={debt.name}
                  onChange={(event) =>
                    updateDebt(debt.id, "name", event.target.value)
                  }
                  onBlur={validateInputs}
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                />
              </label>

              <TextNumberInput
                label="Balance"
                value={debt.balance}
                onChange={(value) => updateDebt(debt.id, "balance", value)}
                onBlur={validateInputs}
                prefix={currencySymbols[currency]}
              />

              <TextNumberInput
                label="APR"
                value={debt.annualRate}
                onChange={(value) => updateDebt(debt.id, "annualRate", value)}
                onBlur={validateInputs}
                suffix="%"
              />

              <TextNumberInput
                label="Minimum payment"
                value={debt.minimumPayment}
                onChange={(value) =>
                  updateDebt(debt.id, "minimumPayment", value)
                }
                onBlur={validateInputs}
                prefix={currencySymbols[currency]}
              />
            </div>
          </div>
        ))}
      </div>

      {error && <ToolErrorBox message={error} />}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={addDebt}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Add debt
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset example
        </button>
      </div>

      {result ? (
        <>
          <ToolResultBox title="Debt payoff plan">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="Payoff time"
                value={formatMonths(result.selected.payoffMonths)}
                highlight
              />

              <ResultCard
                label="Monthly budget"
                value={formatCurrency(result.selected.monthlyBudget, currency)}
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
                label="Starting debt"
                value={formatCurrency(result.selected.startingDebt, currency)}
              />

              <ResultCard
                label="Average monthly payment"
                value={formatCurrency(
                  result.selected.averageMonthlyPayment,
                  currency
                )}
              />

              <ResultCard
                label="First debt paid"
                value={
                  result.selected.payoffOrder[0]
                    ? `${result.selected.payoffOrder[0].name} — Month ${result.selected.payoffOrder[0].month}`
                    : "Not reached"
                }
              />

              <ResultCard
                label="Best interest strategy"
                value={
                  result.bestStrategy === "avalanche"
                    ? "Avalanche"
                    : "Snowball"
                }
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              With the selected strategy, your estimated payoff time is{" "}
              <strong className="text-black">
                {formatMonths(result.selected.payoffMonths)}
              </strong>
              . Estimated total interest is{" "}
              <strong className="text-black">
                {formatCurrency(result.selected.totalInterest, currency)}
              </strong>
              . Your monthly payoff budget is{" "}
              <strong className="text-black">
                {formatCurrency(result.selected.monthlyBudget, currency)}
              </strong>
              .
            </div>

            {result.selected.payoffOrder.length > 0 && (
              <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5">
                <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                  Payoff order
                </div>

                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-black/70">
                  {result.selected.payoffOrder.map((event) => (
                    <li key={`${event.id}-${event.month}`}>
                      <strong className="text-black">{event.name}</strong> — paid
                      off in month {event.month}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </ToolResultBox>

          {result.avalanche && result.snowball && (
            <ToolResultBox title="Avalanche vs snowball comparison">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ResultCard
                  label="Avalanche payoff"
                  value={formatMonths(result.avalanche.payoffMonths)}
                  highlight={strategy === "avalanche"}
                />

                <ResultCard
                  label="Avalanche interest"
                  value={formatCurrency(result.avalanche.totalInterest, currency)}
                />

                <ResultCard
                  label="Snowball payoff"
                  value={formatMonths(result.snowball.payoffMonths)}
                  highlight={strategy === "snowball"}
                />

                <ResultCard
                  label="Snowball interest"
                  value={formatCurrency(result.snowball.totalInterest, currency)}
                />
              </div>

              <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
                Estimated interest difference between both strategies:{" "}
                <strong className="text-black">
                  {formatCurrency(result.interestDifference, currency)}
                </strong>
                .
              </div>
            </ToolResultBox>
          )}

          <ToolResultBox title="Debt balance breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              {parsedDebts
                .filter((debt) => debt.balance > 0)
                .map((debt) => (
                  <DebtBreakdownCard
                    key={debt.id}
                    debt={debt}
                    totalDebt={totalStartingDebt}
                    currency={currency}
                  />
                ))}
            </div>
          </ToolResultBox>

          <div className="grid gap-4">
            <TogglePanel
              title="Monthly payoff timeline"
              description="Show the first 36 months of payments, interest, principal and remaining debt."
              open={showMonthlyTimeline}
              onToggle={() => setShowMonthlyTimeline((current) => !current)}
            >
              <div className="grid gap-3 sm:hidden">
                {monthlyTimelineRows.map((row) => (
                  <TimelineCard key={row.month} row={row} currency={currency} />
                ))}
              </div>

              <div className="hidden overflow-x-auto rounded-2xl border border-black/10 bg-white sm:block">
                <div className="min-w-[760px]">
                  <div className="grid grid-cols-5 gap-3 border-b border-black/10 bg-[#fff8df] px-4 py-3 text-xs font-black uppercase tracking-wide text-black/50">
                    <div>Month</div>
                    <div>Payment</div>
                    <div>Principal</div>
                    <div>Interest</div>
                    <div>Balance</div>
                  </div>

                  {monthlyTimelineRows.map((row) => (
                    <div
                      key={row.month}
                      className="grid grid-cols-5 gap-3 border-b border-black/5 px-4 py-3 text-xs text-black/65 last:border-b-0"
                    >
                      <div className="font-bold text-black">{row.month}</div>
                      <div>{formatCurrency(row.payment, currency)}</div>
                      <div>{formatCurrency(row.principal, currency)}</div>
                      <div>{formatCurrency(row.interest, currency)}</div>
                      <div>{formatCurrency(row.remainingBalance, currency)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TogglePanel>

            <TogglePanel
              title="Yearly balance summary"
              description="Show the estimated remaining debt balance by year and at final payoff."
              open={showYearlySummary}
              onToggle={() => setShowYearlySummary((current) => !current)}
            >
              <div className="grid gap-3">
                {yearlyRows.map((row) => {
                  const paidOffRate =
                    totalStartingDebt > 0
                      ? ((totalStartingDebt - row.remainingBalance) /
                          totalStartingDebt) *
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
                            Remaining debt balance
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
          Enter valid debt balances, interest rates and payments to estimate a
          payoff plan.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        Avalanche usually minimizes interest by targeting the highest APR first.
        Snowball may feel more motivating by paying off smaller balances first.
        This calculator provides estimates only and does not replace financial
        advice.
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

function DebtBreakdownCard({
  debt,
  totalDebt,
  currency,
}: {
  debt: ParsedDebt;
  totalDebt: number;
  currency: CurrencyCode;
}) {
  const percentage = totalDebt > 0 ? (debt.balance / totalDebt) * 100 : 0;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-black text-black">{debt.name}</div>

          <div className="mt-1 text-xs text-black/50">
            APR {formatPercent(debt.annualRate)}
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-black text-black">
            {formatCurrency(debt.balance, currency)}
          </div>

          <div className="mt-1 text-xs font-bold text-black/45">
            {formatPercent(percentage)}
          </div>
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