"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";
type Strategy = "avalanche" | "snowball";

type Debt = {
  id: string;
  name: string;
  balance: number;
  annualRate: number;
  minimumPayment: number;
};

type WorkingDebt = Debt & {
  remainingBalance: number;
};

function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

function sortDebts(debts: WorkingDebt[], strategy: Strategy) {
  return [...debts].sort((a, b) => {
    if (strategy === "avalanche") {
      return b.annualRate - a.annualRate;
    }

    return a.remainingBalance - b.remainingBalance;
  });
}

export default function DebtPayoffCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [strategy, setStrategy] = useState<Strategy>("avalanche");
  const [extraPayment, setExtraPayment] = useState(250);
  const [error, setError] = useState("");

  const [debts, setDebts] = useState<Debt[]>([
    {
      id: crypto.randomUUID(),
      name: "Credit Card",
      balance: 4200,
      annualRate: 21.9,
      minimumPayment: 120,
    },
    {
      id: crypto.randomUUID(),
      name: "Car Loan",
      balance: 12000,
      annualRate: 7.5,
      minimumPayment: 280,
    },
    {
      id: crypto.randomUUID(),
      name: "Personal Loan",
      balance: 6500,
      annualRate: 12.5,
      minimumPayment: 180,
    },
  ]);

  const result = useMemo(() => {
    if (
      extraPayment < 0 ||
      debts.some(
        (debt) =>
          debt.balance < 0 ||
          debt.annualRate < 0 ||
          debt.minimumPayment < 0 ||
          !debt.name.trim()
      )
    ) {
      return null;
    }

    const activeDebts: WorkingDebt[] = debts
      .filter((debt) => debt.balance > 0)
      .map((debt) => ({
        ...debt,
        remainingBalance: debt.balance,
      }));

    if (!activeDebts.length) {
      return null;
    }

    let month = 0;
    let totalInterest = 0;
    let totalPaid = 0;
    const payoffOrder: string[] = [];

    while (
      activeDebts.some((debt) => debt.remainingBalance > 0.01) &&
      month < 1200
    ) {
      month += 1;

      for (const debt of activeDebts) {
        if (debt.remainingBalance <= 0.01) continue;

        const monthlyRate = debt.annualRate / 100 / 12;
        const interest = debt.remainingBalance * monthlyRate;

        debt.remainingBalance += interest;
        totalInterest += interest;
      }

      for (const debt of activeDebts) {
        if (debt.remainingBalance <= 0.01) continue;

        const minimumPayment = Math.min(
          debt.minimumPayment,
          debt.remainingBalance
        );

        debt.remainingBalance -= minimumPayment;
        totalPaid += minimumPayment;

        if (
          debt.remainingBalance <= 0.01 &&
          !payoffOrder.includes(debt.name)
        ) {
          payoffOrder.push(debt.name);
        }
      }

      let remainingExtra = extraPayment;

      while (remainingExtra > 0) {
        const targetDebt = sortDebts(
          activeDebts.filter((debt) => debt.remainingBalance > 0.01),
          strategy
        )[0];

        if (!targetDebt) break;

        const extra = Math.min(remainingExtra, targetDebt.remainingBalance);

        targetDebt.remainingBalance -= extra;
        totalPaid += extra;
        remainingExtra -= extra;

        if (
          targetDebt.remainingBalance <= 0.01 &&
          !payoffOrder.includes(targetDebt.name)
        ) {
          payoffOrder.push(targetDebt.name);
        }
      }

      const activeMinimumPayment = activeDebts
        .filter((debt) => debt.remainingBalance > 0.01)
        .reduce((sum, debt) => sum + debt.minimumPayment, 0);

      if (activeMinimumPayment + extraPayment <= 0) {
        return null;
      }
    }

    if (month >= 1200) {
      return null;
    }

    return {
      payoffMonths: month,
      totalInterest,
      totalPaid,
      payoffOrder,
      startingDebt: debts.reduce((sum, debt) => sum + debt.balance, 0),
      monthlyPayment:
        debts.reduce((sum, debt) => sum + debt.minimumPayment, 0) +
        extraPayment,
    };
  }, [debts, extraPayment, strategy]);

  function updateDebt(
    id: string,
    key: keyof Debt,
    value: string | number
  ) {
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
        id: crypto.randomUUID(),
        name: "New Debt",
        balance: 1000,
        annualRate: 10,
        minimumPayment: 50,
      },
    ]);
  }

  function removeDebt(id: string) {
    setDebts((current) => current.filter((debt) => debt.id !== id));
  }

  function validateInputs() {
    if (extraPayment < 0) {
      setError("Extra payment cannot be negative.");
      return false;
    }

    if (
      debts.some(
        (debt) =>
          debt.balance < 0 || debt.annualRate < 0 || debt.minimumPayment < 0
      )
    ) {
      setError("Debt balances, interest rates and payments cannot be negative.");
      return false;
    }

    if (debts.some((debt) => !debt.name.trim())) {
      setError("Each debt needs a name.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setStrategy("avalanche");
    setExtraPayment(250);
    setDebts([
      {
        id: crypto.randomUUID(),
        name: "Credit Card",
        balance: 4200,
        annualRate: 21.9,
        minimumPayment: 120,
      },
      {
        id: crypto.randomUUID(),
        name: "Car Loan",
        balance: 12000,
        annualRate: 7.5,
        minimumPayment: 280,
      },
      {
        id: crypto.randomUUID(),
        name: "Personal Loan",
        balance: 6500,
        annualRate: 12.5,
        minimumPayment: 180,
      },
    ]);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Plan your debt payoff
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Compare debt payoff using avalanche or snowball strategy with multiple
          debts, interest rates, minimum payments and extra monthly payments.
        </p>
      </div>

      <div className="grid gap-5">
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
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
              <option value="CHF">CHF</option>
              <option value="JPY">JPY</option>
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

          <NumberInput
            label="Extra monthly payment"
            value={extraPayment}
            onChange={setExtraPayment}
            onBlur={validateInputs}
          />
        </div>

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

              <div className="grid gap-4 sm:grid-cols-4">
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

                <NumberInput
                  label="Balance"
                  value={debt.balance}
                  onChange={(value) => updateDebt(debt.id, "balance", value)}
                  onBlur={validateInputs}
                />

                <NumberInput
                  label="APR %"
                  value={debt.annualRate}
                  onChange={(value) =>
                    updateDebt(debt.id, "annualRate", value)
                  }
                  onBlur={validateInputs}
                />

                <NumberInput
                  label="Minimum payment"
                  value={debt.minimumPayment}
                  onChange={(value) =>
                    updateDebt(debt.id, "minimumPayment", value)
                  }
                  onBlur={validateInputs}
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
      </div>

      {result ? (
        <ToolResultBox title="Debt payoff plan">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              label="Starting debt"
              value={formatCurrency(result.startingDebt, currency)}
            />

            <ResultCard
              label="Monthly payment"
              value={formatCurrency(result.monthlyPayment, currency)}
              highlight
            />

            <ResultCard
              label="Payoff time"
              value={`${result.payoffMonths} months`}
            />

            <ResultCard
              label="Total interest"
              value={formatCurrency(result.totalInterest, currency)}
            />

            <ResultCard
              label="Total paid"
              value={formatCurrency(result.totalPaid, currency)}
            />
          </div>

          {result.payoffOrder.length > 0 && (
            <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                Payoff order
              </div>

              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-black/70">
                {result.payoffOrder.map((name, index) => (
                  <li key={`${name}-${index}`}>{name}</li>
                ))}
              </ol>
            </div>
          )}
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid debt balances, interest rates and payments to estimate a
          payoff plan.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        Avalanche usually minimizes interest by targeting the highest APR first.
        Snowball may feel more motivating by paying off smaller balances first.
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