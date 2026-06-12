"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";

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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(value);
}

function calculateSalary({
  annualSalary,
  hoursPerWeek,
  workWeeksPerYear,
  paidVacationDays,
  paidHolidays,
  bonus,
  taxRate,
}: {
  annualSalary: number;
  hoursPerWeek: number;
  workWeeksPerYear: number;
  paidVacationDays: number;
  paidHolidays: number;
  bonus: number;
  taxRate: number;
}) {
  if (
    annualSalary < 0 ||
    hoursPerWeek <= 0 ||
    workWeeksPerYear <= 0 ||
    paidVacationDays < 0 ||
    paidHolidays < 0 ||
    bonus < 0 ||
    taxRate < 0 ||
    taxRate > 100
  ) {
    return null;
  }

  const grossAnnual = annualSalary + bonus;
  const estimatedTax = grossAnnual * (taxRate / 100);
  const netAnnual = grossAnnual - estimatedTax;

  const paidDaysOff = paidVacationDays + paidHolidays;
  const paidWeeksOff = paidDaysOff / 5;
  const effectiveWorkWeeks = Math.max(1, workWeeksPerYear - paidWeeksOff);

  const annualHours = hoursPerWeek * workWeeksPerYear;
  const effectiveWorkHours = hoursPerWeek * effectiveWorkWeeks;

  const grossMonthly = grossAnnual / 12;
  const grossSemiMonthly = grossAnnual / 24;
  const grossBiweekly = grossAnnual / 26;
  const grossWeekly = grossAnnual / 52;
  const grossDaily = grossAnnual / (workWeeksPerYear * 5);
  const grossHourly = grossAnnual / annualHours;

  const netMonthly = netAnnual / 12;
  const netSemiMonthly = netAnnual / 24;
  const netBiweekly = netAnnual / 26;
  const netWeekly = netAnnual / 52;
  const netDaily = netAnnual / (workWeeksPerYear * 5);
  const netHourly = netAnnual / annualHours;

  const effectiveHourly = grossAnnual / effectiveWorkHours;
  const netEffectiveHourly = netAnnual / effectiveWorkHours;

  const taxShare = grossAnnual > 0 ? (estimatedTax / grossAnnual) * 100 : 0;
  const netShare = grossAnnual > 0 ? (netAnnual / grossAnnual) * 100 : 0;
  const bonusShare = grossAnnual > 0 ? (bonus / grossAnnual) * 100 : 0;

  return {
    grossAnnual,
    netAnnual,
    estimatedTax,
    grossMonthly,
    grossSemiMonthly,
    grossBiweekly,
    grossWeekly,
    grossDaily,
    grossHourly,
    netMonthly,
    netSemiMonthly,
    netBiweekly,
    netWeekly,
    netDaily,
    netHourly,
    effectiveHourly,
    netEffectiveHourly,
    annualHours,
    effectiveWorkHours,
    paidDaysOff,
    paidWeeksOff,
    effectiveWorkWeeks,
    taxShare,
    netShare,
    bonusShare,
  };
}

export default function SalaryCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [annualSalary, setAnnualSalary] = useState("72000");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [workWeeksPerYear, setWorkWeeksPerYear] = useState("52");
  const [paidVacationDays, setPaidVacationDays] = useState("15");
  const [paidHolidays, setPaidHolidays] = useState("10");
  const [bonus, setBonus] = useState("3000");
  const [taxRate, setTaxRate] = useState("24");
  const [showDetailedPay, setShowDetailedPay] = useState(false);
  const [showWorkTime, setShowWorkTime] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      annualSalary: parseNumber(annualSalary),
      hoursPerWeek: parseNumber(hoursPerWeek),
      workWeeksPerYear: parseNumber(workWeeksPerYear),
      paidVacationDays: parseNumber(paidVacationDays),
      paidHolidays: parseNumber(paidHolidays),
      bonus: parseNumber(bonus),
      taxRate: parseNumber(taxRate),
    }),
    [
      annualSalary,
      hoursPerWeek,
      workWeeksPerYear,
      paidVacationDays,
      paidHolidays,
      bonus,
      taxRate,
    ]
  );

  const result = useMemo(
    () =>
      calculateSalary({
        annualSalary: numericValues.annualSalary,
        hoursPerWeek: numericValues.hoursPerWeek,
        workWeeksPerYear: numericValues.workWeeksPerYear,
        paidVacationDays: numericValues.paidVacationDays,
        paidHolidays: numericValues.paidHolidays,
        bonus: numericValues.bonus,
        taxRate: numericValues.taxRate,
      }),
    [numericValues]
  );

  function validateInputs() {
    if (numericValues.annualSalary < 0 || numericValues.bonus < 0) {
      setError("Salary and bonus cannot be negative.");
      return false;
    }

    if (
      numericValues.hoursPerWeek <= 0 ||
      numericValues.workWeeksPerYear <= 0
    ) {
      setError("Working hours and work weeks must be greater than zero.");
      return false;
    }

    if (
      numericValues.paidVacationDays < 0 ||
      numericValues.paidHolidays < 0
    ) {
      setError("Paid vacation days and holidays cannot be negative.");
      return false;
    }

    if (numericValues.taxRate < 0 || numericValues.taxRate > 100) {
      setError("Tax rate must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setAnnualSalary("72000");
    setHoursPerWeek("40");
    setWorkWeeksPerYear("52");
    setPaidVacationDays("15");
    setPaidHolidays("10");
    setBonus("3000");
    setTaxRate("24");
    setShowDetailedPay(false);
    setShowWorkTime(false);
    setError("");
  }

  function applyScenario({
    salary,
    hours,
    weeks,
    vacation,
    holidays,
    yearlyBonus,
    taxes,
  }: {
    salary: string;
    hours: string;
    weeks: string;
    vacation: string;
    holidays: string;
    yearlyBonus: string;
    taxes: string;
  }) {
    setAnnualSalary(salary);
    setHoursPerWeek(hours);
    setWorkWeeksPerYear(weeks);
    setPaidVacationDays(vacation);
    setPaidHolidays(holidays);
    setBonus(yearlyBonus);
    setTaxRate(taxes);
    setShowDetailedPay(false);
    setShowWorkTime(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate salary breakdown online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Convert annual salary into monthly, biweekly, weekly, daily and hourly
          pay with bonus, paid time off, work hours and estimated taxes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Gross annual"
          value={result ? formatCurrency(result.grossAnnual, currency) : "—"}
        />
        <StatCard
          label="Estimated net"
          value={result ? formatCurrency(result.netAnnual, currency) : "—"}
        />
        <StatCard
          label="Gross hourly"
          value={result ? formatCurrency(result.grossHourly, currency) : "—"}
        />
      </div>

      <ToolResultBox title="Salary details">
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
            label="Annual salary"
            value={annualSalary}
            onChange={setAnnualSalary}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Annual bonus"
            value={bonus}
            onChange={setBonus}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Hours per week"
            value={hoursPerWeek}
            onChange={setHoursPerWeek}
            onBlur={validateInputs}
            suffix="hours"
          />

          <TextNumberInput
            label="Work weeks per year"
            value={workWeeksPerYear}
            onChange={setWorkWeeksPerYear}
            onBlur={validateInputs}
            suffix="weeks"
          />

          <TextNumberInput
            label="Paid vacation days"
            value={paidVacationDays}
            onChange={setPaidVacationDays}
            onBlur={validateInputs}
            suffix="days"
          />

          <TextNumberInput
            label="Paid holidays"
            value={paidHolidays}
            onChange={setPaidHolidays}
            onBlur={validateInputs}
            suffix="days"
          />

          <TextNumberInput
            label="Estimated tax rate"
            value={taxRate}
            onChange={setTaxRate}
            onBlur={validateInputs}
            suffix="%"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              applyScenario({
                salary: "72000",
                hours: "40",
                weeks: "52",
                vacation: "15",
                holidays: "10",
                yearlyBonus: "3000",
                taxes: "24",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Standard salary
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                salary: "95000",
                hours: "40",
                weeks: "52",
                vacation: "20",
                holidays: "10",
                yearlyBonus: "8000",
                taxes: "28",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Senior role
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                salary: "52000",
                hours: "35",
                weeks: "52",
                vacation: "25",
                holidays: "10",
                yearlyBonus: "1000",
                taxes: "22",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            35-hour week
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
          <ToolResultBox title="Salary breakdown">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="Gross annual"
                value={formatCurrency(result.grossAnnual, currency)}
                highlight
              />

              <ResultCard
                label="Estimated net annual"
                value={formatCurrency(result.netAnnual, currency)}
              />

              <ResultCard
                label="Gross monthly"
                value={formatCurrency(result.grossMonthly, currency)}
              />

              <ResultCard
                label="Net monthly"
                value={formatCurrency(result.netMonthly, currency)}
              />

              <ResultCard
                label="Gross weekly"
                value={formatCurrency(result.grossWeekly, currency)}
              />

              <ResultCard
                label="Net weekly"
                value={formatCurrency(result.netWeekly, currency)}
              />

              <ResultCard
                label="Gross hourly"
                value={formatCurrency(result.grossHourly, currency)}
              />

              <ResultCard
                label="Effective hourly"
                value={formatCurrency(result.effectiveHourly, currency)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              Your estimated gross monthly pay is{" "}
              <strong className="text-black">
                {formatCurrency(result.grossMonthly, currency)}
              </strong>
              . After estimated taxes, monthly pay is about{" "}
              <strong className="text-black">
                {formatCurrency(result.netMonthly, currency)}
              </strong>
              . Gross hourly pay is about{" "}
              <strong className="text-black">
                {formatCurrency(result.grossHourly, currency)}
              </strong>
              .
            </div>
          </ToolResultBox>

          <ToolResultBox title="Gross vs net breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownBar
                label="Estimated net pay"
                percentage={result.netShare}
                formattedValue={formatCurrency(result.netAnnual, currency)}
              />

              <BreakdownBar
                label="Estimated taxes"
                percentage={result.taxShare}
                formattedValue={formatCurrency(result.estimatedTax, currency)}
              />

              <BreakdownBar
                label="Bonus share"
                percentage={result.bonusShare}
                formattedValue={formatCurrency(numericValues.bonus, currency)}
              />
            </div>
          </ToolResultBox>

          <div className="grid gap-4">
            <TogglePanel
              title="Detailed pay frequencies"
              description="Show semi-monthly, biweekly, daily and hourly gross and net pay."
              open={showDetailedPay}
              onToggle={() => setShowDetailedPay((current) => !current)}
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <ResultCard
                  label="Gross semi-monthly"
                  value={formatCurrency(result.grossSemiMonthly, currency)}
                />
                <ResultCard
                  label="Net semi-monthly"
                  value={formatCurrency(result.netSemiMonthly, currency)}
                />
                <ResultCard
                  label="Gross biweekly"
                  value={formatCurrency(result.grossBiweekly, currency)}
                />
                <ResultCard
                  label="Net biweekly"
                  value={formatCurrency(result.netBiweekly, currency)}
                />
                <ResultCard
                  label="Gross daily"
                  value={formatCurrency(result.grossDaily, currency)}
                />
                <ResultCard
                  label="Net daily"
                  value={formatCurrency(result.netDaily, currency)}
                />
                <ResultCard
                  label="Net hourly"
                  value={formatCurrency(result.netHourly, currency)}
                />
                <ResultCard
                  label="Net effective hourly"
                  value={formatCurrency(result.netEffectiveHourly, currency)}
                />
              </div>
            </TogglePanel>

            <TogglePanel
              title="Work time details"
              description="Show annual hours, effective hours and paid time off assumptions."
              open={showWorkTime}
              onToggle={() => setShowWorkTime((current) => !current)}
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <ResultCard
                  label="Annual paid hours"
                  value={`${formatNumber(result.annualHours)} hours`}
                />
                <ResultCard
                  label="Effective work hours"
                  value={`${formatNumber(result.effectiveWorkHours)} hours`}
                />
                <ResultCard
                  label="Paid days off"
                  value={`${formatNumber(result.paidDaysOff)} days`}
                />
                <ResultCard
                  label="Paid weeks off"
                  value={`${formatNumber(result.paidWeeksOff)} weeks`}
                />
                <ResultCard
                  label="Effective work weeks"
                  value={`${formatNumber(result.effectiveWorkWeeks)} weeks`}
                />
              </div>
            </TogglePanel>
          </div>
        </>
      ) : (
        <ToolInfoBox>
          Enter valid salary details to calculate a full pay breakdown.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This salary calculator provides estimates only. Actual take-home pay can
        vary by country, state, benefits, deductions, payroll rules, retirement
        contributions and tax situation.
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
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-black text-black">{label}</div>

          <div className="mt-1 text-xs text-black/50">
            {percentage.toFixed(1)}% of gross annual pay
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
  children: React.ReactNode;
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