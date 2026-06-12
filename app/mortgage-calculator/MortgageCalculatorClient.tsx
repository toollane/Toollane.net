"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD";

type AmortizationRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
};

function parseNumber(value: string) {
  const normalized = value.replace(",", ".").trim();

  if (!normalized) return 0;

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number, currency: Currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
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

function calculateMortgage({
  homePrice,
  downPayment,
  interestRate,
  loanYears,
  propertyTax,
  insurance,
  hoa,
  pmi,
}: {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanYears: number;
  propertyTax: number;
  insurance: number;
  hoa: number;
  pmi: number;
}) {
  const loanAmount = homePrice - downPayment;

  if (
    homePrice <= 0 ||
    downPayment < 0 ||
    loanAmount <= 0 ||
    interestRate < 0 ||
    loanYears <= 0 ||
    propertyTax < 0 ||
    insurance < 0 ||
    hoa < 0 ||
    pmi < 0
  ) {
    return null;
  }

  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = Math.round(loanYears * 12);
  const downPaymentPercent = (downPayment / homePrice) * 100;

  const principalAndInterest =
    monthlyRate === 0
      ? loanAmount / totalMonths
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const monthlyPayment =
    principalAndInterest + propertyTax + insurance + hoa + pmi;

  const totalPrincipalAndInterest = principalAndInterest * totalMonths;
  const totalInterest = totalPrincipalAndInterest - loanAmount;
  const totalTaxes = propertyTax * totalMonths;
  const totalInsurance = insurance * totalMonths;
  const totalHoa = hoa * totalMonths;
  const totalPmi = pmi * totalMonths;
  const totalPaid =
    totalPrincipalAndInterest +
    totalTaxes +
    totalInsurance +
    totalHoa +
    totalPmi;

  let balance = loanAmount;
  const amortization: AmortizationRow[] = [];

  for (let month = 1; month <= totalMonths; month++) {
    const interest = balance * monthlyRate;
    const principal = Math.min(principalAndInterest - interest, balance);

    balance = Math.max(0, balance - principal);

    amortization.push({
      month,
      payment: principal + interest,
      principal,
      interest,
      balance,
    });
  }

  return {
    loanAmount,
    downPaymentPercent,
    principalAndInterest,
    monthlyPayment,
    totalMonths,
    totalPaid,
    totalInterest,
    totalTaxes,
    totalInsurance,
    totalHoa,
    totalPmi,
    amortization,
  };
}

export default function MortgageCalculatorClient() {
  const [homePrice, setHomePrice] = useState("400000");
  const [downPayment, setDownPayment] = useState("80000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanYears, setLoanYears] = useState("30");
  const [propertyTax, setPropertyTax] = useState("300");
  const [insurance, setInsurance] = useState("120");
  const [hoa, setHoa] = useState("0");
  const [pmi, setPmi] = useState("0");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [showAmortizationPreview, setShowAmortizationPreview] = useState(false);
  const [showYearlySummary, setShowYearlySummary] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      homePrice: parseNumber(homePrice),
      downPayment: parseNumber(downPayment),
      interestRate: parseNumber(interestRate),
      loanYears: parseNumber(loanYears),
      propertyTax: parseNumber(propertyTax),
      insurance: parseNumber(insurance),
      hoa: parseNumber(hoa),
      pmi: parseNumber(pmi),
    }),
    [
      homePrice,
      downPayment,
      interestRate,
      loanYears,
      propertyTax,
      insurance,
      hoa,
      pmi,
    ]
  );

  const result = useMemo(
    () =>
      calculateMortgage({
        homePrice: numericValues.homePrice,
        downPayment: numericValues.downPayment,
        interestRate: numericValues.interestRate,
        loanYears: numericValues.loanYears,
        propertyTax: numericValues.propertyTax,
        insurance: numericValues.insurance,
        hoa: numericValues.hoa,
        pmi: numericValues.pmi,
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
      (row) => row.month % 12 === 0 || row.month === result.amortization.length
    );
  }, [result]);

  function validateInputs() {
    if (numericValues.homePrice <= 0) {
      setError("Home price must be greater than zero.");
      return false;
    }

    if (numericValues.downPayment < 0) {
      setError("Down payment cannot be negative.");
      return false;
    }

    if (numericValues.downPayment >= numericValues.homePrice) {
      setError("Down payment must be lower than the home price.");
      return false;
    }

    if (numericValues.interestRate < 0) {
      setError("Interest rate cannot be negative.");
      return false;
    }

    if (numericValues.loanYears <= 0) {
      setError("Loan term must be greater than zero.");
      return false;
    }

    if (
      numericValues.propertyTax < 0 ||
      numericValues.insurance < 0 ||
      numericValues.hoa < 0 ||
      numericValues.pmi < 0
    ) {
      setError("Monthly taxes, insurance, HOA and PMI cannot be negative.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setHomePrice("400000");
    setDownPayment("80000");
    setInterestRate("6.5");
    setLoanYears("30");
    setPropertyTax("300");
    setInsurance("120");
    setHoa("0");
    setPmi("0");
    setCurrency("USD");
    setShowAmortizationPreview(false);
    setShowYearlySummary(false);
    setError("");
  }

  function applyScenario(
    price: string,
    down: string,
    rate: string,
    years: string,
    tax: string,
    monthlyInsurance: string,
    monthlyHoa: string,
    monthlyPmi: string
  ) {
    setHomePrice(price);
    setDownPayment(down);
    setInterestRate(rate);
    setLoanYears(years);
    setPropertyTax(tax);
    setInsurance(monthlyInsurance);
    setHoa(monthlyHoa);
    setPmi(monthlyPmi);
    setShowAmortizationPreview(false);
    setShowYearlySummary(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate mortgage payments online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate your monthly mortgage payment including principal, interest,
          property tax, homeowners insurance, HOA fees and optional PMI.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Home price"
          value={formatCurrency(numericValues.homePrice, currency)}
        />
        <StatCard
          label="Loan amount"
          value={formatCurrency(result?.loanAmount || 0, currency)}
        />
        <StatCard
          label="Down payment"
          value={result ? formatPercent(result.downPaymentPercent) : "0%"}
        />
      </div>

      <ToolResultBox title="Mortgage details">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextNumberInput
            label="Home price"
            value={homePrice}
            onChange={setHomePrice}
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
            label="Interest rate"
            value={interestRate}
            onChange={setInterestRate}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Loan term"
            value={loanYears}
            onChange={setLoanYears}
            onBlur={validateInputs}
            suffix="years"
          />

          <TextNumberInput
            label="Monthly property tax"
            value={propertyTax}
            onChange={setPropertyTax}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Monthly insurance"
            value={insurance}
            onChange={setInsurance}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Monthly HOA fees"
            value={hoa}
            onChange={setHoa}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Monthly PMI"
            value={pmi}
            onChange={setPmi}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <label className="block sm:col-span-2">
            <span className="text-sm font-bold text-black">Currency</span>

            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value as Currency)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              applyScenario(
                "400000",
                "80000",
                "6.5",
                "30",
                "300",
                "120",
                "0",
                "0"
              )
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            30-year mortgage
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario(
                "400000",
                "80000",
                "6.1",
                "15",
                "300",
                "120",
                "0",
                "0"
              )
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            15-year mortgage
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario(
                "350000",
                "35000",
                "6.8",
                "30",
                "260",
                "110",
                "75",
                "130"
              )
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Low down payment
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
          <ToolResultBox title="Mortgage estimate">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="Monthly payment"
                value={formatCurrency(result.monthlyPayment, currency)}
                highlight
              />

              <ResultCard
                label="Principal & interest"
                value={formatCurrency(result.principalAndInterest, currency)}
              />

              <ResultCard
                label="Loan amount"
                value={formatCurrency(result.loanAmount, currency)}
              />

              <ResultCard
                label="Total interest"
                value={formatCurrency(result.totalInterest, currency)}
              />

              <ResultCard
                label="Total paid"
                value={formatCurrency(result.totalPaid, currency)}
              />

              <ResultCard
                label="Down payment"
                value={formatPercent(result.downPaymentPercent)}
              />

              <ResultCard
                label="Loan term"
                value={formatMonths(result.totalMonths)}
              />

              <ResultCard
                label="Monthly extras"
                value={formatCurrency(
                  numericValues.propertyTax +
                    numericValues.insurance +
                    numericValues.hoa +
                    numericValues.pmi,
                  currency
                )}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              Estimated monthly payment:{" "}
              <strong className="text-black">
                {formatCurrency(result.monthlyPayment, currency)}
              </strong>
              . Principal and interest:{" "}
              <strong className="text-black">
                {formatCurrency(result.principalAndInterest, currency)}
              </strong>
              . Estimated total interest:{" "}
              <strong className="text-black">
                {formatCurrency(result.totalInterest, currency)}
              </strong>
              .
            </div>
          </ToolResultBox>

          <ToolResultBox title="Monthly payment breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownBar
                label="Principal & interest"
                value={result.principalAndInterest}
                total={result.monthlyPayment}
                formattedValue={formatCurrency(
                  result.principalAndInterest,
                  currency
                )}
              />

              <BreakdownBar
                label="Property tax"
                value={numericValues.propertyTax}
                total={result.monthlyPayment}
                formattedValue={formatCurrency(numericValues.propertyTax, currency)}
              />

              <BreakdownBar
                label="Insurance"
                value={numericValues.insurance}
                total={result.monthlyPayment}
                formattedValue={formatCurrency(numericValues.insurance, currency)}
              />

              <BreakdownBar
                label="HOA fees"
                value={numericValues.hoa}
                total={result.monthlyPayment}
                formattedValue={formatCurrency(numericValues.hoa, currency)}
              />

              <BreakdownBar
                label="PMI"
                value={numericValues.pmi}
                total={result.monthlyPayment}
                formattedValue={formatCurrency(numericValues.pmi, currency)}
              />
            </div>
          </ToolResultBox>

          <ToolResultBox title="Total cost breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownBar
                label="Loan principal"
                value={result.loanAmount}
                total={result.totalPaid}
                formattedValue={formatCurrency(result.loanAmount, currency)}
              />

              <BreakdownBar
                label="Interest"
                value={result.totalInterest}
                total={result.totalPaid}
                formattedValue={formatCurrency(result.totalInterest, currency)}
              />

              <BreakdownBar
                label="Property taxes"
                value={result.totalTaxes}
                total={result.totalPaid}
                formattedValue={formatCurrency(result.totalTaxes, currency)}
              />

              <BreakdownBar
                label="Insurance"
                value={result.totalInsurance}
                total={result.totalPaid}
                formattedValue={formatCurrency(result.totalInsurance, currency)}
              />

              <BreakdownBar
                label="HOA"
                value={result.totalHoa}
                total={result.totalPaid}
                formattedValue={formatCurrency(result.totalHoa, currency)}
              />

              <BreakdownBar
                label="PMI"
                value={result.totalPmi}
                total={result.totalPaid}
                formattedValue={formatCurrency(result.totalPmi, currency)}
              />
            </div>
          </ToolResultBox>

          <div className="grid gap-4">
            <TogglePanel
              title="First 12 months"
              description="Show a detailed principal and interest preview for the first year."
              open={showAmortizationPreview}
              onToggle={() =>
                setShowAmortizationPreview((current) => !current)
              }
            >
              <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
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

              <p className="mt-4 text-xs leading-5 text-black/50">
                This preview shows principal and interest only. Taxes, insurance,
                HOA and PMI are added separately to the monthly estimate.
              </p>
            </TogglePanel>

            <TogglePanel
              title="Yearly balance summary"
              description="Show the estimated remaining mortgage balance by year."
              open={showYearlySummary}
              onToggle={() => setShowYearlySummary((current) => !current)}
            >
              <div className="grid gap-3">
                {yearlyRows.map((row) => (
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
                          Remaining mortgage balance
                        </div>
                      </div>

                      <div className="text-right text-sm font-black text-black">
                        {formatCurrency(row.balance, currency)}
                      </div>
                    </div>

                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/10">
                      <div
                        className="h-full rounded-full bg-black"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, (row.balance / result.loanAmount) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TogglePanel>
          </div>
        </>
      ) : (
        <ToolInfoBox>
          Enter valid mortgage details to calculate your estimated monthly
          payment.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This mortgage calculator provides estimates only. Actual mortgage
        payments may vary based on lender fees, taxes, insurance, PMI, escrow
        rules, local costs, loan type and closing terms.
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
  const percentage =
    total > 0 ? Math.max(0, Math.min(100, (value / total) * 100)) : 0;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-black text-black">{label}</div>

          <div className="mt-1 text-xs text-black/50">
            {percentage.toFixed(1)}% of total
          </div>
        </div>

        <div className="text-right text-sm font-black text-black">
          {formattedValue}
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-black"
          style={{ width: `${percentage}%` }}
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