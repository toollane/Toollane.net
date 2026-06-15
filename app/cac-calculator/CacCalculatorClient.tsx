"use client";

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
  marketingCost: string;
  salesCost: string;
  payrollCost: string;
  toolsCost: string;
  otherCost: string;
  newCustomers: string;
  arpa: string;
  grossMargin: string;
  churnRate: string;
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
    name: "Early SaaS",
    description: "Small paid campaigns with founder-led sales.",
    marketingCost: "5000",
    salesCost: "2500",
    payrollCost: "2000",
    toolsCost: "500",
    otherCost: "0",
    newCustomers: "35",
    arpa: "79",
    grossMargin: "85",
    churnRate: "4",
  },
  {
    name: "Paid Growth",
    description: "Performance marketing with higher volume.",
    marketingCost: "15000",
    salesCost: "5000",
    payrollCost: "3000",
    toolsCost: "1000",
    otherCost: "0",
    newCustomers: "80",
    arpa: "99",
    grossMargin: "85",
    churnRate: "3",
  },
  {
    name: "Sales-led B2B",
    description: "Higher CAC, higher ACV and lower churn.",
    marketingCost: "8000",
    salesCost: "18000",
    payrollCost: "12000",
    toolsCost: "1500",
    otherCost: "1000",
    newCustomers: "20",
    arpa: "499",
    grossMargin: "80",
    churnRate: "2",
  },
  {
    name: "Creator Product",
    description: "Lean acquisition for a low-price product.",
    marketingCost: "1200",
    salesCost: "0",
    payrollCost: "0",
    toolsCost: "100",
    otherCost: "0",
    newCustomers: "75",
    arpa: "19",
    grossMargin: "90",
    churnRate: "7",
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

function formatMonths(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "—";

  if (value >= 120) {
    return `${(value / 12).toFixed(1)} years`;
  }

  return `${value.toFixed(1)} months`;
}

function getCacHealth(ratio: number | null, paybackMonths: number | null) {
  if (ratio !== null) {
    if (ratio >= 5) {
      return {
        label: "Excellent CAC efficiency",
        description:
          "Your LTV:CAC ratio is very strong. Acquisition spend appears efficient based on these assumptions.",
      };
    }

    if (ratio >= 3) {
      return {
        label: "Healthy CAC",
        description:
          "Your LTV:CAC ratio is in a generally healthy range for many SaaS businesses.",
      };
    }

    if (ratio >= 1) {
      return {
        label: "Needs improvement",
        description:
          "Your CAC may be high relative to estimated lifetime value. Improving retention, pricing or conversion could help.",
      };
    }

    return {
      label: "Unprofitable acquisition",
      description:
        "CAC is higher than estimated lifetime value. This acquisition model likely needs major improvement.",
    };
  }

  if (paybackMonths !== null) {
    if (paybackMonths <= 6) {
      return {
        label: "Fast payback",
        description:
          "Your estimated CAC payback period is very short based on monthly gross profit.",
      };
    }

    if (paybackMonths <= 12) {
      return {
        label: "Reasonable payback",
        description:
          "Your payback period is within a range many SaaS teams would consider manageable.",
      };
    }

    return {
      label: "Slow payback",
      description:
        "Your payback period is long. CAC may be too high or monthly gross profit too low.",
    };
  }

  return {
    label: "Add revenue inputs",
    description:
      "Enter ARPA, gross margin and churn to calculate payback, LTV and LTV:CAC.",
  };
}

export default function CacCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [marketingCost, setMarketingCost] = useState("5000");
  const [salesCost, setSalesCost] = useState("2500");
  const [payrollCost, setPayrollCost] = useState("2000");
  const [toolsCost, setToolsCost] = useState("500");
  const [otherCost, setOtherCost] = useState("0");
  const [newCustomers, setNewCustomers] = useState("35");
  const [arpa, setArpa] = useState("79");
  const [grossMargin, setGrossMargin] = useState("85");
  const [churnRate, setChurnRate] = useState("4");
  const [error, setError] = useState("");

  const result = useMemo(() => {
    const marketing = parseNumber(marketingCost);
    const sales = parseNumber(salesCost);
    const payroll = parseNumber(payrollCost);
    const tools = parseNumber(toolsCost);
    const other = parseNumber(otherCost);
    const customers = parseNumber(newCustomers);
    const monthlyRevenue = parseNumber(arpa);
    const marginPercent = parseNumber(grossMargin);
    const churnPercent = parseNumber(churnRate);

    const totalAcquisitionCost = marketing + sales + payroll + tools + other;
    const cac = customers > 0 ? totalAcquisitionCost / customers : 0;

    const marginDecimal = marginPercent / 100;
    const churnDecimal = churnPercent / 100;
    const monthlyGrossProfit = monthlyRevenue * marginDecimal;

    const estimatedLtv =
      monthlyRevenue > 0 && marginDecimal > 0 && churnDecimal > 0
        ? monthlyGrossProfit / churnDecimal
        : null;

    const ltvToCac =
      estimatedLtv !== null && cac > 0 ? estimatedLtv / cac : null;

    const paybackMonths =
      cac > 0 && monthlyGrossProfit > 0 ? cac / monthlyGrossProfit : null;

    const costBreakdown = [
      { label: "Marketing", value: marketing },
      { label: "Sales", value: sales },
      { label: "Team / payroll", value: payroll },
      { label: "Tools / software", value: tools },
      { label: "Other", value: other },
    ];

    const largestCost = Math.max(
      1,
      ...costBreakdown.map((item) => item.value)
    );

    const customerScenarios = [
      { label: "Current", customers },
      { label: "+25% customers", customers: customers * 1.25 },
      { label: "+50% customers", customers: customers * 1.5 },
      { label: "+100% customers", customers: customers * 2 },
    ].map((scenario) => {
      const scenarioCac =
        scenario.customers > 0
          ? totalAcquisitionCost / scenario.customers
          : 0;

      return {
        ...scenario,
        cac: scenarioCac,
        payback:
          scenarioCac > 0 && monthlyGrossProfit > 0
            ? scenarioCac / monthlyGrossProfit
            : null,
      };
    });

    const targetCacThreeToOne =
      estimatedLtv !== null ? estimatedLtv / 3 : null;

    const targetCacFourToOne =
      estimatedLtv !== null ? estimatedLtv / 4 : null;

    const targetCacFiveToOne =
      estimatedLtv !== null ? estimatedLtv / 5 : null;

    return {
      marketing,
      sales,
      payroll,
      tools,
      other,
      customers,
      monthlyRevenue,
      marginPercent,
      churnPercent,
      totalAcquisitionCost,
      cac,
      monthlyGrossProfit,
      estimatedLtv,
      ltvToCac,
      paybackMonths,
      costBreakdown,
      largestCost,
      customerScenarios,
      targetCacThreeToOne,
      targetCacFourToOne,
      targetCacFiveToOne,
    };
  }, [
    marketingCost,
    salesCost,
    payrollCost,
    toolsCost,
    otherCost,
    newCustomers,
    arpa,
    grossMargin,
    churnRate,
  ]);

  const health = getCacHealth(result.ltvToCac, result.paybackMonths);

  function validateInputs() {
    const costValues = [
      result.marketing,
      result.sales,
      result.payroll,
      result.tools,
      result.other,
    ];

    if (result.totalAcquisitionCost <= 0) {
      setError("Total acquisition cost must be greater than zero.");
      return false;
    }

    if (result.customers <= 0) {
      setError("New customers acquired must be greater than zero.");
      return false;
    }

    if (costValues.some((value) => value < 0)) {
      setError("Acquisition costs cannot be negative.");
      return false;
    }

    if (result.monthlyRevenue < 0) {
      setError("ARPA cannot be negative.");
      return false;
    }

    if (result.marginPercent < 0 || result.marginPercent > 100) {
      setError("Gross margin must be between 0% and 100%.");
      return false;
    }

    if (result.churnPercent < 0 || result.churnPercent >= 100) {
      setError("Monthly churn rate must be lower than 100%.");
      return false;
    }

    setError("");
    return true;
  }

  function applyScenario(scenario: Scenario) {
    setMarketingCost(scenario.marketingCost);
    setSalesCost(scenario.salesCost);
    setPayrollCost(scenario.payrollCost);
    setToolsCost(scenario.toolsCost);
    setOtherCost(scenario.otherCost);
    setNewCustomers(scenario.newCustomers);
    setArpa(scenario.arpa);
    setGrossMargin(scenario.grossMargin);
    setChurnRate(scenario.churnRate);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate customer acquisition cost
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate CAC from marketing, sales, team and tool costs. Add revenue
          assumptions to calculate payback period and LTV:CAC ratio.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="CAC"
          value={formatCurrency(result.cac, currency)}
          highlight
        />

        <StatCard
          label="Total spend"
          value={formatCurrency(result.totalAcquisitionCost, currency)}
        />

        <StatCard
          label="Customers"
          value={formatNumber(result.customers)}
        />
      </div>

      <ToolResultBox title="Acquisition inputs">
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

          <div className="grid gap-4 sm:grid-cols-2">
            <MoneyInput
              label="Marketing cost"
              value={marketingCost}
              onChange={setMarketingCost}
              currency={currency}
              helper="Ad spend, content, sponsorships and campaigns."
            />

            <MoneyInput
              label="Sales cost"
              value={salesCost}
              onChange={setSalesCost}
              currency={currency}
              helper="Sales commissions, outbound tools and sales expenses."
            />

            <MoneyInput
              label="Team / payroll cost"
              value={payrollCost}
              onChange={setPayrollCost}
              currency={currency}
              helper="Team time or payroll allocated to acquisition."
            />

            <MoneyInput
              label="Tools / software cost"
              value={toolsCost}
              onChange={setToolsCost}
              currency={currency}
              helper="CRM, analytics, ad tools, enrichment and automation."
            />

            <MoneyInput
              label="Other acquisition cost"
              value={otherCost}
              onChange={setOtherCost}
              currency={currency}
              helper="Agencies, freelancers, events or additional spend."
            />

            <NumberInput
              label="New customers acquired"
              value={newCustomers}
              onChange={setNewCustomers}
              helper="Use new paying customers for the selected period."
            />
          </div>
        </div>
      </ToolResultBox>

      <ToolResultBox title="Revenue assumptions">
        <div className="grid gap-4 sm:grid-cols-3">
          <MoneyInput
            label="ARPA"
            value={arpa}
            onChange={setArpa}
            currency={currency}
            helper="Average monthly revenue per account."
          />

          <PercentInput
            label="Gross margin"
            value={grossMargin}
            onChange={setGrossMargin}
            helper="Revenue left after delivery costs."
          />

          <PercentInput
            label="Monthly churn"
            value={churnRate}
            onChange={setChurnRate}
            helper="Used to estimate LTV."
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
          Calculate CAC
        </button>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {!error && (
        <>
          <ToolResultBox title="CAC result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total acquisition cost"
                value={formatCurrency(result.totalAcquisitionCost, currency)}
              />

              <StatCard
                label="CAC per customer"
                value={formatCurrency(result.cac, currency)}
                highlight
              />

              <StatCard
                label="Monthly gross profit"
                value={formatCurrency(result.monthlyGrossProfit, currency)}
              />

              <StatCard
                label="Payback period"
                value={formatMonths(result.paybackMonths)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5">
              <div className="text-sm font-black text-black">
                {health.label}
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                {health.description}
              </p>
            </div>
          </ToolResultBox>

          <ToolResultBox title="LTV comparison">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Estimated LTV"
                value={
                  result.estimatedLtv !== null
                    ? formatCurrency(result.estimatedLtv, currency)
                    : "—"
                }
              />

              <StatCard
                label="LTV:CAC"
                value={
                  result.ltvToCac !== null
                    ? `${result.ltvToCac.toFixed(2)}:1`
                    : "—"
                }
                highlight={result.ltvToCac !== null}
              />

              <StatCard
                label="Current CAC"
                value={formatCurrency(result.cac, currency)}
              />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <StatCard
                label="3:1 target CAC"
                value={
                  result.targetCacThreeToOne !== null
                    ? formatCurrency(result.targetCacThreeToOne, currency)
                    : "—"
                }
              />

              <StatCard
                label="4:1 target CAC"
                value={
                  result.targetCacFourToOne !== null
                    ? formatCurrency(result.targetCacFourToOne, currency)
                    : "—"
                }
              />

              <StatCard
                label="5:1 target CAC"
                value={
                  result.targetCacFiveToOne !== null
                    ? formatCurrency(result.targetCacFiveToOne, currency)
                    : "—"
                }
              />
            </div>
          </ToolResultBox>

          <ToolResultBox title="Cost breakdown">
            <div className="grid gap-4">
              {result.costBreakdown.map((item) => {
                const width =
                  result.largestCost > 0
                    ? Math.max(3, (item.value / result.largestCost) * 100)
                    : 0;

                return (
                  <div key={item.label} className="grid gap-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-sm font-bold text-black">
                        {item.label}
                      </div>

                      <div className="text-sm font-black text-black">
                        {formatCurrency(item.value, currency)}
                      </div>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-black/10">
                      <div
                        className="h-full rounded-full bg-black"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </ToolResultBox>

          <ToolResultBox title="Customer volume scenarios">
            <div className="overflow-hidden rounded-2xl border border-black/10">
              <div className="hidden grid-cols-4 bg-black px-4 py-3 text-xs font-bold uppercase tracking-wide text-white/70 sm:grid">
                <div>Scenario</div>
                <div>Customers</div>
                <div>CAC</div>
                <div>Payback</div>
              </div>

              <div className="divide-y divide-black/10 bg-white">
                {result.customerScenarios.map((scenario) => (
                  <div
                    key={scenario.label}
                    className="grid gap-3 px-4 py-4 text-sm sm:grid-cols-4 sm:items-center"
                  >
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Scenario
                      </div>
                      <div className="font-bold text-black">
                        {scenario.label}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Customers
                      </div>
                      <div className="font-bold text-black">
                        {formatNumber(scenario.customers)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        CAC
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(scenario.cac, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Payback
                      </div>
                      <div className="font-bold text-black">
                        {formatMonths(scenario.payback)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ToolResultBox>
        </>
      )}

      <ToolInfoBox>
        CAC is calculated as total acquisition cost divided by new customers
        acquired. For cleaner analysis, use the same time period for costs and
        customers. This calculator provides estimates only.
      </ToolInfoBox>
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

function PercentInput({
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

      <div className="mt-3 flex overflow-hidden rounded-2xl border border-black/10 bg-white transition focus-within:border-black">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 px-4 py-4 text-sm outline-none"
        />

        <div className="flex items-center border-l border-black/10 px-4 text-sm font-bold text-black/50">
          %
        </div>
      </div>

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