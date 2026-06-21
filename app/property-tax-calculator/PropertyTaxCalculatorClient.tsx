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
  propertyValue: string;
  taxRate: string;
  assessedValuePercent: string;
  annualTaxIncrease: string;
  projectionYears: string;
};

type ProjectionRow = {
  year: number;
  annualTax: number;
  monthlyTax: number;
  cumulativeTax: number;
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
    name: "Typical home",
    description: "Estimate taxes for a mid-priced home with a moderate rate.",
    propertyValue: "400000",
    taxRate: "1.1",
    assessedValuePercent: "100",
    annualTaxIncrease: "2",
    projectionYears: "10",
  },
  {
    name: "High-tax area",
    description: "Model a higher local property tax rate over several years.",
    propertyValue: "550000",
    taxRate: "2.25",
    assessedValuePercent: "100",
    annualTaxIncrease: "3",
    projectionYears: "10",
  },
  {
    name: "Partial assessment",
    description: "Use this when only part of market value is taxable.",
    propertyValue: "350000",
    taxRate: "1.5",
    assessedValuePercent: "80",
    annualTaxIncrease: "2",
    projectionYears: "10",
  },
  {
    name: "Long-term projection",
    description: "Estimate how property taxes may grow over 20 years.",
    propertyValue: "500000",
    taxRate: "1.25",
    assessedValuePercent: "100",
    annualTaxIncrease: "2.5",
    projectionYears: "20",
  },
];

function parseNumber(value: string) {
  const normalized = value.replace(",", ".").trim();

  if (!normalized) {
    return 0;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number, currency: CurrencyCode) {
  const symbol = currencySymbols[currency];

  if (!Number.isFinite(value)) {
    return `${symbol}0`;
  }

  if (currency === "JPY") {
    return `${symbol}${Math.round(value).toLocaleString("en-US")}`;
  }

  return `${symbol}${value.toLocaleString("en-US", {
    maximumFractionDigits: value >= 1000 ? 0 : 2,
    minimumFractionDigits: value >= 1000 ? 0 : 2,
  })}`;
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) {
    return "0.00%";
  }

  return `${value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}%`;
}

function clampProjectionYears(years: number) {
  if (!Number.isFinite(years) || years <= 0) {
    return 1;
  }

  return Math.min(Math.max(Math.round(years), 1), 50);
}

function getTaxLevelLabel(effectiveTaxRate: number) {
  if (effectiveTaxRate <= 0) {
    return {
      label: "No property tax estimated",
      description:
        "The current inputs produce no estimated property tax. Check the tax rate and assessed value percentage.",
    };
  }

  if (effectiveTaxRate < 0.75) {
    return {
      label: "Low estimated tax burden",
      description:
        "The estimated effective property tax rate is relatively low compared with many local markets.",
    };
  }

  if (effectiveTaxRate < 1.5) {
    return {
      label: "Moderate estimated tax burden",
      description:
        "The estimated effective property tax rate is in a moderate range for many residential properties.",
    };
  }

  if (effectiveTaxRate < 2.5) {
    return {
      label: "High estimated tax burden",
      description:
        "The estimated effective property tax rate is relatively high and may have a meaningful impact on monthly housing costs.",
    };
  }

  return {
    label: "Very high estimated tax burden",
    description:
      "The estimated effective property tax rate is very high. Review local rules, exemptions and assessment assumptions carefully.",
  };
}

export default function PropertyTaxCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  const [propertyValue, setPropertyValue] = useState("400000");
  const [taxRate, setTaxRate] = useState("1.1");
  const [assessedValuePercent, setAssessedValuePercent] = useState("100");
  const [annualTaxIncrease, setAnnualTaxIncrease] = useState("2");
  const [projectionYears, setProjectionYears] = useState("10");

  const [error, setError] = useState("");

  const result = useMemo(() => {
    const parsedPropertyValue = parseNumber(propertyValue);
    const parsedTaxRate = parseNumber(taxRate);
    const parsedAssessedValuePercent = parseNumber(assessedValuePercent);
    const parsedAnnualTaxIncrease = parseNumber(annualTaxIncrease);
    const parsedProjectionYears = clampProjectionYears(
      parseNumber(projectionYears)
    );

    const assessedValue =
      parsedPropertyValue * (parsedAssessedValuePercent / 100);

    const annualTax = assessedValue * (parsedTaxRate / 100);
    const monthlyTax = annualTax / 12;

    const effectiveTaxRate =
      parsedPropertyValue > 0 ? (annualTax / parsedPropertyValue) * 100 : 0;

    const projectionRows: ProjectionRow[] = [];
    let cumulativeTax = 0;

    for (let year = 1; year <= parsedProjectionYears; year += 1) {
      const projectedAnnualTax =
        annualTax * Math.pow(1 + parsedAnnualTaxIncrease / 100, year - 1);

      cumulativeTax += projectedAnnualTax;

      projectionRows.push({
        year,
        annualTax: projectedAnnualTax,
        monthlyTax: projectedAnnualTax / 12,
        cumulativeTax,
      });
    }

    const finalYearTax =
      projectionRows.length > 0
        ? projectionRows[projectionRows.length - 1].annualTax
        : annualTax;

    const totalIncrease =
      annualTax > 0 ? ((finalYearTax - annualTax) / annualTax) * 100 : 0;

    const averageAnnualTax =
      parsedProjectionYears > 0 ? cumulativeTax / parsedProjectionYears : 0;

    const averageMonthlyTax = averageAnnualTax / 12;

    const health = getTaxLevelLabel(effectiveTaxRate);

    return {
      propertyValue: parsedPropertyValue,
      taxRate: parsedTaxRate,
      assessedValuePercent: parsedAssessedValuePercent,
      annualTaxIncrease: parsedAnnualTaxIncrease,
      projectionYears: parsedProjectionYears,
      assessedValue,
      annualTax,
      monthlyTax,
      effectiveTaxRate,
      projectionRows,
      projectedTotalTax: cumulativeTax,
      finalYearTax,
      totalIncrease,
      averageAnnualTax,
      averageMonthlyTax,
      health,
    };
  }, [
    propertyValue,
    taxRate,
    assessedValuePercent,
    annualTaxIncrease,
    projectionYears,
  ]);

  function validateInputs() {
    if (result.propertyValue <= 0) {
      setError("Property value must be greater than zero.");
      return false;
    }

    if (result.taxRate < 0) {
      setError("Property tax rate cannot be negative.");
      return false;
    }

    if (
      result.assessedValuePercent <= 0 ||
      result.assessedValuePercent > 100
    ) {
      setError("Assessed value percentage must be greater than 0 and at most 100.");
      return false;
    }

    if (
      result.annualTaxIncrease < -100 ||
      result.annualTaxIncrease > 100
    ) {
      setError("Annual tax increase must be between -100% and 100%.");
      return false;
    }

    if (result.projectionYears <= 0 || result.projectionYears > 50) {
      setError("Projection years must be between 1 and 50.");
      return false;
    }

    setError("");
    return true;
  }

  function applyScenario(scenario: Scenario) {
    setPropertyValue(scenario.propertyValue);
    setTaxRate(scenario.taxRate);
    setAssessedValuePercent(scenario.assessedValuePercent);
    setAnnualTaxIncrease(scenario.annualTaxIncrease);
    setProjectionYears(scenario.projectionYears);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Estimate property tax costs
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate estimated annual property tax, monthly tax cost, effective
          tax rate and long-term tax projections based on property value, local
          tax rate and assessment assumptions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Annual property tax"
          value={formatCurrency(result.annualTax, currency)}
          highlight
        />

        <StatCard
          label="Monthly property tax"
          value={formatCurrency(result.monthlyTax, currency)}
        />

        <StatCard
          label="Effective tax rate"
          value={formatPercent(result.effectiveTaxRate)}
        />
      </div>

      <ToolResultBox title="Property inputs">
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
              label="Property value"
              value={propertyValue}
              onChange={setPropertyValue}
              currency={currency}
              helper="Current market value, purchase price or estimated home value."
            />

            <PercentInput
              label="Annual property tax rate"
              value={taxRate}
              onChange={setTaxRate}
              helper="Enter the local annual property tax rate. Example: 1.1 for 1.1%."
            />

            <PercentInput
              label="Assessed value percentage"
              value={assessedValuePercent}
              onChange={setAssessedValuePercent}
              helper="Use 100 if the full property value is taxable."
            />

            <PercentInput
              label="Annual tax increase"
              value={annualTaxIncrease}
              onChange={setAnnualTaxIncrease}
              helper="Optional yearly increase used for the projection."
            />

            <NumberInput
              label="Projection period"
              value={projectionYears}
              onChange={setProjectionYears}
              suffix="years"
              helper="Choose a projection period between 1 and 50 years."
            />

            <div className="rounded-2xl border border-black/10 bg-[#fff8df] p-4">
              <div className="text-sm font-black text-black">
                Estimated taxable value
              </div>

              <p className="mt-2 text-2xl font-black text-black">
                {formatCurrency(result.assessedValue, currency)}
              </p>

              <p className="mt-2 text-xs leading-5 text-black/60">
                Based on {formatPercent(result.assessedValuePercent)} of the
                entered property value.
              </p>
            </div>
          </div>
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
          Calculate property tax
        </button>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {!error && (
        <>
          <ToolResultBox title="Property tax result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Annual property tax"
                value={formatCurrency(result.annualTax, currency)}
                highlight
              />

              <StatCard
                label="Monthly property tax"
                value={formatCurrency(result.monthlyTax, currency)}
              />

              <StatCard
                label="Effective tax rate"
                value={formatPercent(result.effectiveTaxRate)}
              />

              <StatCard
                label="Projected total tax"
                value={formatCurrency(result.projectedTotalTax, currency)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5">
              <div className="text-sm font-black text-black">
                {result.health.label}
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                {result.health.description}
              </p>
            </div>
          </ToolResultBox>

          <ToolResultBox title="Tax breakdown">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Property value"
                value={formatCurrency(result.propertyValue, currency)}
              />

              <StatCard
                label="Assessed value"
                value={formatCurrency(result.assessedValue, currency)}
                highlight
              />

              <StatCard
                label="Tax rate"
                value={formatPercent(result.taxRate)}
              />

              <StatCard
                label="Assessment ratio"
                value={formatPercent(result.assessedValuePercent)}
              />
            </div>

            <div className="mt-5 grid gap-3">
              <BreakdownRow
                label="Calculation"
                value={`${formatCurrency(
                  result.assessedValue,
                  currency
                )} × ${formatPercent(result.taxRate)}`}
              />

              <BreakdownRow
                label="Estimated annual property tax"
                value={formatCurrency(result.annualTax, currency)}
              />

              <BreakdownRow
                label="Estimated monthly property tax"
                value={formatCurrency(result.monthlyTax, currency)}
              />

              <BreakdownRow
                label="Effective tax rate on full property value"
                value={formatPercent(result.effectiveTaxRate)}
              />
            </div>
          </ToolResultBox>

          <ToolResultBox title="Long-term projection">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Projection period"
                value={`${result.projectionYears} years`}
              />

              <StatCard
                label="Average annual tax"
                value={formatCurrency(result.averageAnnualTax, currency)}
              />

              <StatCard
                label="Average monthly tax"
                value={formatCurrency(result.averageMonthlyTax, currency)}
              />

              <StatCard
                label="Final year tax"
                value={formatCurrency(result.finalYearTax, currency)}
                highlight
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5">
              <div className="text-sm font-black text-black">
                Projected tax change
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                With a yearly tax increase of{" "}
                <strong>{formatPercent(result.annualTaxIncrease)}</strong>, the
                estimated annual property tax changes from{" "}
                <strong>{formatCurrency(result.annualTax, currency)}</strong>{" "}
                in year 1 to{" "}
                <strong>{formatCurrency(result.finalYearTax, currency)}</strong>{" "}
                in year {result.projectionYears}.
              </p>
            </div>
          </ToolResultBox>

          <TogglePanel
            title="Year-by-year property tax projection"
            description="Open the projection table to review estimated annual tax, monthly tax and cumulative tax over time."
          >
            <div className="overflow-hidden rounded-2xl border border-black/10">
              <div className="hidden grid-cols-4 bg-black px-4 py-3 text-xs font-bold uppercase tracking-wide text-white/70 sm:grid">
                <div>Year</div>
                <div>Annual tax</div>
                <div>Monthly tax</div>
                <div>Cumulative tax</div>
              </div>

              <div className="divide-y divide-black/10 bg-white">
                {result.projectionRows.map((row) => (
                  <div
                    key={row.year}
                    className="grid gap-3 px-4 py-4 text-sm sm:grid-cols-4 sm:items-center"
                  >
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Year
                      </div>
                      <div className="font-bold text-black">{row.year}</div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Annual tax
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.annualTax, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Monthly tax
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.monthlyTax, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Cumulative tax
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.cumulativeTax, currency)}
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
        This property tax calculator provides estimates for planning purposes
        only. Actual property taxes can vary based on local tax rules,
        reassessments, exemptions, special districts, caps, credits and changes
        in property value. It is not tax, legal or financial advice.
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

function NumberInput({
  label,
  value,
  onChange,
  suffix,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix: string;
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
          {suffix}
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

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-black/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm font-bold text-black/60">{label}</div>
      <div className="text-sm font-black text-black">{value}</div>
    </div>
  );
}