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
  cashBalance: string;
  monthlyRevenue: string;
  payrollCost: string;
  marketingCost: string;
  toolsCost: string;
  otherCost: string;
  revenueGrowth: string;
  expenseGrowth: string;
};

type ProjectionRow = {
  month: number;
  revenue: number;
  expenses: number;
  netBurn: number;
  cashBalance: number;
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
    name: "Lean SaaS",
    description: "Small team with moderate revenue growth.",
    cashBalance: "120000",
    monthlyRevenue: "25000",
    payrollCost: "30000",
    marketingCost: "5000",
    toolsCost: "2000",
    otherCost: "3000",
    revenueGrowth: "4",
    expenseGrowth: "1",
  },
  {
    name: "Growth SaaS",
    description: "Larger team with aggressive growth spend.",
    cashBalance: "750000",
    monthlyRevenue: "120000",
    payrollCost: "180000",
    marketingCost: "45000",
    toolsCost: "15000",
    otherCost: "20000",
    revenueGrowth: "5",
    expenseGrowth: "2",
  },
  {
    name: "Pre-revenue Startup",
    description: "No revenue yet with a fixed monthly burn.",
    cashBalance: "250000",
    monthlyRevenue: "0",
    payrollCost: "35000",
    marketingCost: "8000",
    toolsCost: "2000",
    otherCost: "5000",
    revenueGrowth: "0",
    expenseGrowth: "1",
  },
  {
    name: "Cost-cut Plan",
    description: "Lean operating mode with controlled spend.",
    cashBalance: "90000",
    monthlyRevenue: "30000",
    payrollCost: "25000",
    marketingCost: "2000",
    toolsCost: "1000",
    otherCost: "2000",
    revenueGrowth: "2",
    expenseGrowth: "0",
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

function formatRunway(value: number | null, profitable: boolean) {
  if (profitable) return "Profitable";
  if (value === null) return "120+ months";

  if (value >= 120) return "120+ months";
  if (value >= 24) return `${(value / 12).toFixed(1)} years`;

  return `${value.toFixed(1)} months`;
}

function addMonthsToToday(months: number | null) {
  if (months === null) return "—";

  const date = new Date();
  date.setMonth(date.getMonth() + Math.ceil(months));

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function getRunwayHealth(runwayMonths: number | null, profitable: boolean) {
  if (profitable) {
    return {
      label: "Default alive",
      description:
        "Monthly revenue is greater than or equal to monthly expenses, so the business is not burning cash on these inputs.",
    };
  }

  if (runwayMonths === null || runwayMonths >= 24) {
    return {
      label: "Strong runway",
      description:
        "Your cash runway is long enough to give the business meaningful strategic flexibility.",
    };
  }

  if (runwayMonths >= 18) {
    return {
      label: "Healthy runway",
      description:
        "Your runway is solid, but you should still monitor burn rate and growth efficiency.",
    };
  }

  if (runwayMonths >= 12) {
    return {
      label: "Watch runway closely",
      description:
        "Your runway is workable, but fundraising, cost control or revenue growth should be planned early.",
    };
  }

  if (runwayMonths >= 6) {
    return {
      label: "Short runway",
      description:
        "Runway is getting tight. Consider reducing burn, increasing revenue or raising capital soon.",
    };
  }

  return {
    label: "Critical runway",
    description:
      "Runway is very short. Immediate action may be needed to extend cash life.",
  };
}

export default function RunwayCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [cashBalance, setCashBalance] = useState("120000");
  const [monthlyRevenue, setMonthlyRevenue] = useState("25000");
  const [payrollCost, setPayrollCost] = useState("30000");
  const [marketingCost, setMarketingCost] = useState("5000");
  const [toolsCost, setToolsCost] = useState("2000");
  const [otherCost, setOtherCost] = useState("3000");
  const [revenueGrowth, setRevenueGrowth] = useState("4");
  const [expenseGrowth, setExpenseGrowth] = useState("1");
  const [error, setError] = useState("");

  const result = useMemo(() => {
    const cash = parseNumber(cashBalance);
    const revenue = parseNumber(monthlyRevenue);
    const payroll = parseNumber(payrollCost);
    const marketing = parseNumber(marketingCost);
    const tools = parseNumber(toolsCost);
    const other = parseNumber(otherCost);
    const revenueGrowthRate = parseNumber(revenueGrowth);
    const expenseGrowthRate = parseNumber(expenseGrowth);

    const totalExpenses = payroll + marketing + tools + other;
    const netBurn = totalExpenses - revenue;
    const profitable = netBurn <= 0;

    const simpleRunwayMonths = netBurn > 0 ? cash / netBurn : null;
    const breakEvenGap = Math.max(0, totalExpenses - revenue);
    const expenseCoverageMonths = totalExpenses > 0 ? cash / totalExpenses : null;

    const costBreakdown = [
      { label: "Payroll", value: payroll },
      { label: "Marketing", value: marketing },
      { label: "Tools / software", value: tools },
      { label: "Other", value: other },
    ];

    const largestCost = Math.max(
      1,
      ...costBreakdown.map((item) => item.value)
    );

    const projection: ProjectionRow[] = [];
    const revenueGrowthDecimal = revenueGrowthRate / 100;
    const expenseGrowthDecimal = expenseGrowthRate / 100;

    let projectedCash = cash;
    let projectedRevenue = revenue;
    let projectedExpenses = totalExpenses;
    let cashOutMonth: number | null = null;

    for (let month = 1; month <= 120; month += 1) {
      const projectedNetBurn = projectedExpenses - projectedRevenue;

      projectedCash -= projectedNetBurn;

      if (month <= 24) {
        projection.push({
          month,
          revenue: projectedRevenue,
          expenses: projectedExpenses,
          netBurn: projectedNetBurn,
          cashBalance: projectedCash,
        });
      }

      if (projectedCash <= 0 && cashOutMonth === null && projectedNetBurn > 0) {
        cashOutMonth = month;
      }

      projectedRevenue *= 1 + revenueGrowthDecimal;
      projectedExpenses *= 1 + expenseGrowthDecimal;
    }

    const dynamicRunwayMonths = profitable ? null : cashOutMonth;

    const runwayForHealth =
      dynamicRunwayMonths !== null ? dynamicRunwayMonths : simpleRunwayMonths;

    const monthlyProfit = Math.max(0, revenue - totalExpenses);

    const burnReductionTargets = [
      { label: "Reduce burn by 10%", netBurn: netBurn * 0.9 },
      { label: "Reduce burn by 25%", netBurn: netBurn * 0.75 },
      { label: "Reduce burn by 50%", netBurn: netBurn * 0.5 },
    ].map((target) => ({
      ...target,
      runway: target.netBurn > 0 ? cash / target.netBurn : null,
    }));

    return {
      cash,
      revenue,
      payroll,
      marketing,
      tools,
      other,
      revenueGrowthRate,
      expenseGrowthRate,
      totalExpenses,
      netBurn,
      profitable,
      simpleRunwayMonths,
      dynamicRunwayMonths,
      runwayForHealth,
      breakEvenGap,
      expenseCoverageMonths,
      costBreakdown,
      largestCost,
      projection,
      monthlyProfit,
      burnReductionTargets,
    };
  }, [
    cashBalance,
    monthlyRevenue,
    payrollCost,
    marketingCost,
    toolsCost,
    otherCost,
    revenueGrowth,
    expenseGrowth,
  ]);

  const health = getRunwayHealth(result.runwayForHealth, result.profitable);

  function validateInputs() {
    const moneyValues = [
      result.cash,
      result.revenue,
      result.payroll,
      result.marketing,
      result.tools,
      result.other,
    ];

    if (result.cash < 0) {
      setError("Cash balance cannot be negative.");
      return false;
    }

    if (moneyValues.some((value) => value < 0)) {
      setError("Money inputs cannot be negative.");
      return false;
    }

    if (result.totalExpenses <= 0) {
      setError("Monthly expenses must be greater than zero.");
      return false;
    }

    if (result.revenueGrowthRate < -100 || result.revenueGrowthRate > 100) {
      setError("Monthly revenue growth must be between -100% and 100%.");
      return false;
    }

    if (result.expenseGrowthRate < -100 || result.expenseGrowthRate > 100) {
      setError("Monthly expense growth must be between -100% and 100%.");
      return false;
    }

    setError("");
    return true;
  }

  function applyScenario(scenario: Scenario) {
    setCashBalance(scenario.cashBalance);
    setMonthlyRevenue(scenario.monthlyRevenue);
    setPayrollCost(scenario.payrollCost);
    setMarketingCost(scenario.marketingCost);
    setToolsCost(scenario.toolsCost);
    setOtherCost(scenario.otherCost);
    setRevenueGrowth(scenario.revenueGrowth);
    setExpenseGrowth(scenario.expenseGrowth);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate startup runway
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate how long your cash will last based on current cash balance,
          monthly revenue, expenses, burn rate and growth assumptions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Runway"
          value={formatRunway(result.runwayForHealth, result.profitable)}
          highlight
        />

        <StatCard
          label="Net burn"
          value={
            result.profitable
              ? `${formatCurrency(result.monthlyProfit, currency)} profit`
              : formatCurrency(result.netBurn, currency)
          }
        />

        <StatCard
          label="Cash-out date"
          value={
            result.profitable
              ? "—"
              : addMonthsToToday(result.dynamicRunwayMonths)
          }
        />
      </div>

      <ToolResultBox title="Cash and revenue inputs">
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
              label="Cash balance"
              value={cashBalance}
              onChange={setCashBalance}
              currency={currency}
              helper="Current available cash in the business."
            />

            <MoneyInput
              label="Monthly revenue"
              value={monthlyRevenue}
              onChange={setMonthlyRevenue}
              currency={currency}
              helper="Current monthly recurring or predictable revenue."
            />
          </div>
        </div>
      </ToolResultBox>

      <ToolResultBox title="Monthly expense inputs">
        <div className="grid gap-4 sm:grid-cols-2">
          <MoneyInput
            label="Payroll"
            value={payrollCost}
            onChange={setPayrollCost}
            currency={currency}
            helper="Team salaries, contractors and founder compensation."
          />

          <MoneyInput
            label="Marketing"
            value={marketingCost}
            onChange={setMarketingCost}
            currency={currency}
            helper="Ads, content, sponsorships and growth spend."
          />

          <MoneyInput
            label="Tools / software"
            value={toolsCost}
            onChange={setToolsCost}
            currency={currency}
            helper="Software, hosting, APIs and operational tools."
          />

          <MoneyInput
            label="Other expenses"
            value={otherCost}
            onChange={setOtherCost}
            currency={currency}
            helper="Office, admin, legal, accounting and other costs."
          />
        </div>
      </ToolResultBox>

      <ToolResultBox title="Growth assumptions">
        <div className="grid gap-4 sm:grid-cols-2">
          <PercentInput
            label="Monthly revenue growth"
            value={revenueGrowth}
            onChange={setRevenueGrowth}
            helper="Expected month-over-month revenue growth."
          />

          <PercentInput
            label="Monthly expense growth"
            value={expenseGrowth}
            onChange={setExpenseGrowth}
            helper="Expected month-over-month expense growth."
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
          Calculate runway
        </button>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {!error && (
        <>
          <ToolResultBox title="Runway result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Cash balance"
                value={formatCurrency(result.cash, currency)}
              />

              <StatCard
                label="Monthly expenses"
                value={formatCurrency(result.totalExpenses, currency)}
              />

              <StatCard
                label="Net burn"
                value={
                  result.profitable
                    ? `${formatCurrency(result.monthlyProfit, currency)} profit`
                    : formatCurrency(result.netBurn, currency)
                }
                highlight
              />

              <StatCard
                label="Runway"
                value={formatRunway(result.runwayForHealth, result.profitable)}
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

          <ToolResultBox title="Break-even analysis">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Revenue needed to break even"
                value={formatCurrency(result.breakEvenGap, currency)}
                highlight={result.breakEvenGap > 0}
              />

              <StatCard
                label="Expense coverage"
                value={
                  result.expenseCoverageMonths !== null
                    ? `${result.expenseCoverageMonths.toFixed(1)} months`
                    : "—"
                }
              />

              <StatCard
                label="Cash-out date"
                value={
                  result.profitable
                    ? "—"
                    : addMonthsToToday(result.dynamicRunwayMonths)
                }
              />
            </div>
          </ToolResultBox>

          <ToolResultBox title="Expense breakdown">
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

          {!result.profitable && (
            <ToolResultBox title="Burn reduction scenarios">
              <div className="grid gap-4 sm:grid-cols-3">
                {result.burnReductionTargets.map((target) => (
                  <StatCard
                    key={target.label}
                    label={target.label}
                    value={formatRunway(target.runway, false)}
                  />
                ))}
              </div>
            </ToolResultBox>
          )}

          <TogglePanel
            title="24-month cash projection"
            description="Open the detailed projection to review monthly revenue, expenses, net burn and remaining cash."
          >
            <div className="overflow-hidden rounded-2xl border border-black/10">
              <div className="hidden grid-cols-5 bg-black px-4 py-3 text-xs font-bold uppercase tracking-wide text-white/70 sm:grid">
                <div>Month</div>
                <div>Revenue</div>
                <div>Expenses</div>
                <div>Net burn</div>
                <div>Cash balance</div>
              </div>

              <div className="divide-y divide-black/10 bg-white">
                {result.projection.map((row) => (
                  <div
                    key={row.month}
                    className="grid gap-3 px-4 py-4 text-sm sm:grid-cols-5 sm:items-center"
                  >
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Month
                      </div>
                      <div className="font-bold text-black">{row.month}</div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Revenue
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.revenue, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Expenses
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.expenses, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Net burn
                      </div>
                      <div
                        className={`font-bold ${
                          row.netBurn > 0 ? "text-black" : "text-black/50"
                        }`}
                      >
                        {row.netBurn > 0
                          ? formatCurrency(row.netBurn, currency)
                          : `${formatCurrency(Math.abs(row.netBurn), currency)} profit`}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Cash balance
                      </div>
                      <div
                        className={`font-bold ${
                          row.cashBalance >= 0 ? "text-black" : "text-red-600"
                        }`}
                      >
                        {formatCurrency(row.cashBalance, currency)}
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
        Runway is estimated from cash balance divided by monthly net burn. Net
        burn is monthly expenses minus monthly revenue. Growth assumptions are
        applied to the projection and are estimates only.
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