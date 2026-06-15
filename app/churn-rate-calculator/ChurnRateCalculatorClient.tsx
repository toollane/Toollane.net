"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF ",
  JPY: "¥",
};

type CurrencyCode = keyof typeof currencySymbols;

type Scenario = {
  name: string;
  description: string;
  startingCustomers: string;
  lostCustomers: string;
  newCustomers: string;
  startingMrr: string;
  lostMrr: string;
  expansionMrr: string;
  newMrr: string;
};

const currencyOptions: { value: CurrencyCode; label: string }[] = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "CAD", label: "CAD — Canadian Dollar" },
  { value: "AUD", label: "AUD — Australian Dollar" },
  { value: "CHF", label: "CHF — Swiss Franc" },
  { value: "JPY", label: "JPY — Japanese Yen" },
];

const scenarios: Scenario[] = [
  {
    name: "Healthy B2B SaaS",
    description: "Low customer churn with strong expansion revenue.",
    startingCustomers: "1000",
    lostCustomers: "20",
    newCustomers: "60",
    startingMrr: "100000",
    lostMrr: "1500",
    expansionMrr: "4000",
    newMrr: "8000",
  },
  {
    name: "Early SaaS",
    description: "Moderate churn with active new customer growth.",
    startingCustomers: "250",
    lostCustomers: "12",
    newCustomers: "25",
    startingMrr: "15000",
    lostMrr: "900",
    expansionMrr: "500",
    newMrr: "1800",
  },
  {
    name: "Consumer App",
    description: "Lower ARPA product with higher monthly churn.",
    startingCustomers: "5000",
    lostCustomers: "400",
    newCustomers: "650",
    startingMrr: "60000",
    lostMrr: "4800",
    expansionMrr: "300",
    newMrr: "7800",
  },
  {
    name: "At-risk SaaS",
    description: "High churn and weak expansion revenue.",
    startingCustomers: "800",
    lostCustomers: "80",
    newCustomers: "45",
    startingMrr: "48000",
    lostMrr: "5200",
    expansionMrr: "400",
    newMrr: "2600",
  },
];

function parseNumber(value: string) {
  const normalized = value.replace(",", ".").trim();

  if (!normalized) return 0;

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number, currency: CurrencyCode) {
  const symbol = currencySymbols[currency];

  if (!Number.isFinite(value)) return `${symbol}0`;

  if (currency === "JPY") {
    return `${symbol}${Math.round(value).toLocaleString("en-US")}`;
  }

  return `${symbol}${value.toLocaleString("en-US", {
    maximumFractionDigits: value >= 1000 ? 0 : 2,
    minimumFractionDigits: value >= 1000 ? 0 : 2,
  })}`;
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "0";

  return value.toLocaleString("en-US", {
    maximumFractionDigits: value >= 100 ? 0 : 1,
  });
}

function formatPercent(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "—";

  return `${value.toFixed(Math.abs(value) >= 10 ? 1 : 2)}%`;
}

function getCustomerChurnHealth(churn: number) {
  if (churn < 2) {
    return {
      label: "Excellent customer retention",
      description:
        "Customer churn is very low. Retention appears strong based on this period.",
    };
  }

  if (churn < 5) {
    return {
      label: "Healthy customer churn",
      description:
        "Customer churn is in a generally healthy range for many B2B SaaS businesses.",
    };
  }

  if (churn < 10) {
    return {
      label: "High churn",
      description:
        "Customer churn is elevated. Review onboarding, product value and customer success workflows.",
    };
  }

  return {
    label: "Critical churn",
    description:
      "Customer churn is very high. Growth may become difficult unless retention improves.",
  };
}

function getRevenueChurnHealth(netRevenueChurn: number | null) {
  if (netRevenueChurn === null) {
    return {
      label: "Add revenue inputs",
      description:
        "Enter MRR data to calculate gross revenue churn, net revenue churn and NRR.",
    };
  }

  if (netRevenueChurn < 0) {
    return {
      label: "Expansion-led retention",
      description:
        "Expansion revenue is greater than lost MRR. Net revenue churn is negative, which is very strong.",
    };
  }

  if (netRevenueChurn <= 2) {
    return {
      label: "Healthy revenue churn",
      description:
        "Net revenue churn is low. Revenue retention appears healthy based on this period.",
    };
  }

  if (netRevenueChurn <= 5) {
    return {
      label: "Watch revenue churn",
      description:
        "Net revenue churn is noticeable. Expansion revenue may not fully offset lost MRR.",
    };
  }

  return {
    label: "High revenue churn",
    description:
      "Revenue churn is high. Review downgrades, cancellations, pricing and expansion opportunities.",
  };
}

export default function ChurnRateCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [startingCustomers, setStartingCustomers] = useState("1000");
  const [lostCustomers, setLostCustomers] = useState("20");
  const [newCustomers, setNewCustomers] = useState("60");
  const [startingMrr, setStartingMrr] = useState("100000");
  const [lostMrr, setLostMrr] = useState("1500");
  const [expansionMrr, setExpansionMrr] = useState("4000");
  const [newMrr, setNewMrr] = useState("8000");
  const [error, setError] = useState("");

  const result = useMemo(() => {
    const startCustomers = parseNumber(startingCustomers);
    const churnedCustomers = parseNumber(lostCustomers);
    const acquiredCustomers = parseNumber(newCustomers);

    const startRevenue = parseNumber(startingMrr);
    const churnedRevenue = parseNumber(lostMrr);
    const expandedRevenue = parseNumber(expansionMrr);
    const acquiredRevenue = parseNumber(newMrr);

    const endingCustomers =
      startCustomers - churnedCustomers + acquiredCustomers;

    const customerChurnRate =
      startCustomers > 0 ? (churnedCustomers / startCustomers) * 100 : 0;

    const customerRetentionRate = 100 - customerChurnRate;

    const netCustomerGrowthRate =
      startCustomers > 0
        ? ((endingCustomers - startCustomers) / startCustomers) * 100
        : 0;

    const endingMrr =
      startRevenue - churnedRevenue + expandedRevenue + acquiredRevenue;

    const grossRevenueChurn =
      startRevenue > 0 ? (churnedRevenue / startRevenue) * 100 : null;

    const netRevenueChurn =
      startRevenue > 0
        ? ((churnedRevenue - expandedRevenue) / startRevenue) * 100
        : null;

    const grossRevenueRetention =
      startRevenue > 0
        ? ((startRevenue - churnedRevenue) / startRevenue) * 100
        : null;

    const netRevenueRetention =
      startRevenue > 0
        ? ((startRevenue - churnedRevenue + expandedRevenue) /
            startRevenue) *
          100
        : null;

    const mrrGrowthRate =
      startRevenue > 0 ? ((endingMrr - startRevenue) / startRevenue) * 100 : null;

    const churnDecimal = customerChurnRate / 100;
    const netRevenueChurnDecimal =
      netRevenueChurn !== null ? netRevenueChurn / 100 : 0;

    const projection = [1, 3, 6, 12, 24].map((month) => {
      const retainedPercent = Math.pow(1 - churnDecimal, month) * 100;
      const customersRemaining = startCustomers * (retainedPercent / 100);

      const revenueMultiplier = Math.max(0, 1 - netRevenueChurnDecimal);
      const projectedRevenue = startRevenue * Math.pow(revenueMultiplier, month);

      return {
        month,
        retainedPercent,
        customersRemaining,
        projectedRevenue,
      };
    });

    return {
      startCustomers,
      churnedCustomers,
      acquiredCustomers,
      startRevenue,
      churnedRevenue,
      expandedRevenue,
      acquiredRevenue,
      endingCustomers,
      customerChurnRate,
      customerRetentionRate,
      netCustomerGrowthRate,
      endingMrr,
      grossRevenueChurn,
      netRevenueChurn,
      grossRevenueRetention,
      netRevenueRetention,
      mrrGrowthRate,
      projection,
    };
  }, [
    startingCustomers,
    lostCustomers,
    newCustomers,
    startingMrr,
    lostMrr,
    expansionMrr,
    newMrr,
  ]);

  const customerHealth = getCustomerChurnHealth(result.customerChurnRate);
  const revenueHealth = getRevenueChurnHealth(result.netRevenueChurn);

  function validateInputs() {
    const customerValues = [
      result.startCustomers,
      result.churnedCustomers,
      result.acquiredCustomers,
    ];

    const revenueValues = [
      result.startRevenue,
      result.churnedRevenue,
      result.expandedRevenue,
      result.acquiredRevenue,
    ];

    if (result.startCustomers <= 0) {
      setError("Starting customers must be greater than zero.");
      return false;
    }

    if (customerValues.some((value) => value < 0)) {
      setError("Customer inputs cannot be negative.");
      return false;
    }

    if (result.churnedCustomers > result.startCustomers) {
      setError("Lost customers cannot be greater than starting customers.");
      return false;
    }

    if (revenueValues.some((value) => value < 0)) {
      setError("MRR inputs cannot be negative.");
      return false;
    }

    if (result.churnedRevenue > result.startRevenue && result.startRevenue > 0) {
      setError("Lost MRR cannot be greater than starting MRR.");
      return false;
    }

    setError("");
    return true;
  }

  function applyScenario(scenario: Scenario) {
    setStartingCustomers(scenario.startingCustomers);
    setLostCustomers(scenario.lostCustomers);
    setNewCustomers(scenario.newCustomers);
    setStartingMrr(scenario.startingMrr);
    setLostMrr(scenario.lostMrr);
    setExpansionMrr(scenario.expansionMrr);
    setNewMrr(scenario.newMrr);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate churn rate
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate customer churn, revenue churn, retention, NRR and MRR growth
          from your customer and revenue movement.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Customer churn"
          value={formatPercent(result.customerChurnRate)}
          highlight
        />

        <StatCard
          label="Customer retention"
          value={formatPercent(result.customerRetentionRate)}
        />

        <StatCard
          label="Net revenue churn"
          value={formatPercent(result.netRevenueChurn)}
        />
      </div>

      <ToolResultBox title="Customer inputs">
        <div className="grid gap-5">
          <label className="block">
            <span className="text-sm font-bold text-black">Currency</span>

            <select
              value={currency}
              onChange={(event) =>
                setCurrency(event.target.value as CurrencyCode)
              }
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <NumberInput
              label="Starting customers"
              value={startingCustomers}
              onChange={setStartingCustomers}
              helper="Customers at the beginning of the period."
            />

            <NumberInput
              label="Lost customers"
              value={lostCustomers}
              onChange={setLostCustomers}
              helper="Customers who cancelled during the period."
            />

            <NumberInput
              label="New customers"
              value={newCustomers}
              onChange={setNewCustomers}
              helper="New paying customers acquired during the period."
            />
          </div>
        </div>
      </ToolResultBox>

      <ToolResultBox title="Revenue inputs">
        <div className="grid gap-4 sm:grid-cols-2">
          <MoneyInput
            label="Starting MRR"
            value={startingMrr}
            onChange={setStartingMrr}
            currency={currency}
            helper="Monthly recurring revenue at the start of the period."
          />

          <MoneyInput
            label="Lost MRR"
            value={lostMrr}
            onChange={setLostMrr}
            currency={currency}
            helper="MRR lost from cancellations or downgrades."
          />

          <MoneyInput
            label="Expansion MRR"
            value={expansionMrr}
            onChange={setExpansionMrr}
            currency={currency}
            helper="Expansion revenue from upgrades or add-ons."
          />

          <MoneyInput
            label="New MRR"
            value={newMrr}
            onChange={setNewMrr}
            currency={currency}
            helper="MRR from new customers during the period."
          />
        </div>
      </ToolResultBox>

      <ToolResultBox title="Quick scenarios">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {scenarios.map((scenario) => (
            <button
              key={scenario.name}
              type="button"
              onClick={() => applyScenario(scenario)}
              className="rounded-2xl border border-black/10 bg-white p-4 text-left transition hover:border-black hover:bg-black/[0.02]"
            >
              <div className="text-sm font-black text-black">
                {scenario.name}
              </div>

              <div className="mt-2 text-xs leading-5 text-black/50">
                {scenario.description}
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={validateInputs}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Calculate churn
        </button>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {!error && (
        <>
          <ToolResultBox title="Customer churn result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Customer churn"
                value={formatPercent(result.customerChurnRate)}
                highlight
              />

              <StatCard
                label="Customer retention"
                value={formatPercent(result.customerRetentionRate)}
              />

              <StatCard
                label="Ending customers"
                value={formatNumber(result.endingCustomers)}
              />

              <StatCard
                label="Net customer growth"
                value={formatPercent(result.netCustomerGrowthRate)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5">
              <div className="text-sm font-black text-black">
                {customerHealth.label}
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                {customerHealth.description}
              </p>
            </div>
          </ToolResultBox>

          <ToolResultBox title="Revenue churn result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Gross revenue churn"
                value={formatPercent(result.grossRevenueChurn)}
              />

              <StatCard
                label="Net revenue churn"
                value={formatPercent(result.netRevenueChurn)}
                highlight
              />

              <StatCard
                label="GRR"
                value={formatPercent(result.grossRevenueRetention)}
              />

              <StatCard
                label="NRR"
                value={formatPercent(result.netRevenueRetention)}
              />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <StatCard
                label="Ending MRR"
                value={formatCurrency(result.endingMrr, currency)}
              />

              <StatCard
                label="MRR growth"
                value={formatPercent(result.mrrGrowthRate)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5">
              <div className="text-sm font-black text-black">
                {revenueHealth.label}
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                {revenueHealth.description}
              </p>
            </div>
          </ToolResultBox>

          <TogglePanel
            title="Retention projection"
            description="Open the detailed table to review customer retention, customers remaining and projected MRR."
          >
            <div className="overflow-hidden rounded-2xl border border-black/10">
              <div className="hidden grid-cols-4 bg-black px-4 py-3 text-xs font-bold uppercase tracking-wide text-white/70 sm:grid">
                <div>Month</div>
                <div>Customers retained</div>
                <div>Customers remaining</div>
                <div>Projected MRR</div>
              </div>

              <div className="divide-y divide-black/10 bg-white">
                {result.projection.map((row) => (
                  <div
                    key={row.month}
                    className="grid gap-3 px-4 py-4 text-sm sm:grid-cols-4 sm:items-center"
                  >
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Month
                      </div>
                      <div className="font-bold text-black">{row.month}</div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Customers retained
                      </div>
                      <div className="font-bold text-black">
                        {formatPercent(row.retainedPercent)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Customers remaining
                      </div>
                      <div className="font-bold text-black">
                        {formatNumber(row.customersRemaining)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Projected MRR
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.projectedRevenue, currency)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TogglePanel>
        </>
      )}

      <ToolInfoBox>
        Customer churn is lost customers divided by starting customers. Gross
        revenue churn is lost MRR divided by starting MRR. Net revenue churn
        subtracts expansion MRR from lost MRR before dividing by starting MRR.
        This calculator provides estimates only.
      </ToolInfoBox>
    </div>
  );
}

function TogglePanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-5 text-left"
      >
        <div>
          <h3 className="text-lg font-black tracking-tight text-black">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-black/60">
            {description}
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-black/10 bg-black px-4 py-2 text-xs font-bold text-white">
          {open ? "Hide" : "Show"}
        </span>
      </button>

      {open && <div className="mt-5">{children}</div>}
    </div>
  );
}

function MoneyInput({
  label,
  value,
  onChange,
  currency,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  currency: CurrencyCode;
  helper: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <div className="mt-3 flex overflow-hidden rounded-2xl border border-black/10 bg-white transition focus-within:border-black">
        <div className="flex items-center border-r border-black/10 px-4 text-sm font-bold text-black/50">
          {currencySymbols[currency]}
        </div>

        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 px-4 py-4 text-sm outline-none"
        />
      </div>

      <p className="mt-2 text-xs leading-5 text-black/50">{helper}</p>
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />

      <p className="mt-2 text-xs leading-5 text-black/50">{helper}</p>
    </label>
  );
}

function StatCard({
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
      className={`rounded-2xl border p-5 shadow-sm ${
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