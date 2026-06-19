"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
  JPY: "¥",
};

const presets = [
  {
    name: "First-time buyer",
    description: "Balanced estimate for a typical financed purchase.",
    values: {
      homePrice: "425000",
      downPayment: "85000",
      lenderFeeRate: "1.0",
      appraisalFee: "600",
      inspectionFee: "450",
      titleInsuranceRate: "0.55",
      escrowFee: "800",
      recordingFee: "150",
      transferTaxRate: "0.5",
      annualPropertyTax: "5200",
      prepaidTaxMonths: "3",
      taxEscrowMonths: "3",
      annualInsurance: "1600",
      prepaidInsuranceMonths: "12",
      insuranceEscrowMonths: "2",
      otherCosts: "350",
    },
  },
  {
    name: "High-tax market",
    description: "Higher property taxes, transfer taxes and prepaid reserves.",
    values: {
      homePrice: "650000",
      downPayment: "130000",
      lenderFeeRate: "1.1",
      appraisalFee: "750",
      inspectionFee: "550",
      titleInsuranceRate: "0.65",
      escrowFee: "1100",
      recordingFee: "250",
      transferTaxRate: "1.2",
      annualPropertyTax: "12500",
      prepaidTaxMonths: "4",
      taxEscrowMonths: "4",
      annualInsurance: "2400",
      prepaidInsuranceMonths: "12",
      insuranceEscrowMonths: "3",
      otherCosts: "600",
    },
  },
  {
    name: "Low-cost market",
    description: "Lower transfer taxes and simpler closing assumptions.",
    values: {
      homePrice: "280000",
      downPayment: "56000",
      lenderFeeRate: "0.75",
      appraisalFee: "500",
      inspectionFee: "350",
      titleInsuranceRate: "0.4",
      escrowFee: "550",
      recordingFee: "100",
      transferTaxRate: "0.1",
      annualPropertyTax: "2800",
      prepaidTaxMonths: "2",
      taxEscrowMonths: "2",
      annualInsurance: "1100",
      prepaidInsuranceMonths: "12",
      insuranceEscrowMonths: "2",
      otherCosts: "200",
    },
  },
  {
    name: "Larger home",
    description: "Higher purchase price with larger loan and title costs.",
    values: {
      homePrice: "900000",
      downPayment: "180000",
      lenderFeeRate: "0.9",
      appraisalFee: "900",
      inspectionFee: "700",
      titleInsuranceRate: "0.5",
      escrowFee: "1400",
      recordingFee: "300",
      transferTaxRate: "0.8",
      annualPropertyTax: "11000",
      prepaidTaxMonths: "3",
      taxEscrowMonths: "3",
      annualInsurance: "3200",
      prepaidInsuranceMonths: "12",
      insuranceEscrowMonths: "2",
      otherCosts: "900",
    },
  },
];

function parseNumber(value: string) {
  const normalized = value.replace(",", ".").trim();
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number, currency: Currency) {
  const rounded = currency === "JPY" ? Math.round(value) : value;

  return `${currencySymbols[currency]}${rounded.toLocaleString(undefined, {
    maximumFractionDigits: currency === "JPY" ? 0 : 0,
  })}`;
}

function formatPercent(value: number) {
  return `${value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}%`;
}

export default function ClosingCostCalculatorClient() {
  const [currency, setCurrency] = useState<Currency>("USD");

  const [homePrice, setHomePrice] = useState("425000");
  const [downPayment, setDownPayment] = useState("85000");

  const [lenderFeeRate, setLenderFeeRate] = useState("1.0");
  const [appraisalFee, setAppraisalFee] = useState("600");
  const [inspectionFee, setInspectionFee] = useState("450");

  const [titleInsuranceRate, setTitleInsuranceRate] = useState("0.55");
  const [escrowFee, setEscrowFee] = useState("800");
  const [recordingFee, setRecordingFee] = useState("150");
  const [transferTaxRate, setTransferTaxRate] = useState("0.5");

  const [annualPropertyTax, setAnnualPropertyTax] = useState("5200");
  const [prepaidTaxMonths, setPrepaidTaxMonths] = useState("3");
  const [taxEscrowMonths, setTaxEscrowMonths] = useState("3");

  const [annualInsurance, setAnnualInsurance] = useState("1600");
  const [prepaidInsuranceMonths, setPrepaidInsuranceMonths] = useState("12");
  const [insuranceEscrowMonths, setInsuranceEscrowMonths] = useState("2");

  const [otherCosts, setOtherCosts] = useState("350");

  const result = useMemo(() => {
    const homePriceValue = Math.max(0, parseNumber(homePrice));
    const downPaymentValue = Math.max(0, parseNumber(downPayment));
    const loanAmount = Math.max(0, homePriceValue - downPaymentValue);

    const lenderFees = loanAmount * (Math.max(0, parseNumber(lenderFeeRate)) / 100);
    const appraisal = Math.max(0, parseNumber(appraisalFee));
    const inspection = Math.max(0, parseNumber(inspectionFee));

    const titleInsurance =
      homePriceValue * (Math.max(0, parseNumber(titleInsuranceRate)) / 100);
    const escrow = Math.max(0, parseNumber(escrowFee));
    const recording = Math.max(0, parseNumber(recordingFee));
    const transferTax =
      homePriceValue * (Math.max(0, parseNumber(transferTaxRate)) / 100);

    const propertyTaxMonthly = Math.max(0, parseNumber(annualPropertyTax)) / 12;
    const prepaidTaxes =
      propertyTaxMonthly * Math.max(0, parseNumber(prepaidTaxMonths));
    const taxEscrowReserve =
      propertyTaxMonthly * Math.max(0, parseNumber(taxEscrowMonths));

    const insuranceMonthly = Math.max(0, parseNumber(annualInsurance)) / 12;
    const prepaidInsurance =
      insuranceMonthly * Math.max(0, parseNumber(prepaidInsuranceMonths));
    const insuranceEscrowReserve =
      insuranceMonthly * Math.max(0, parseNumber(insuranceEscrowMonths));

    const other = Math.max(0, parseNumber(otherCosts));

    const lenderAndLoanCosts = lenderFees + appraisal + inspection;
    const titleAndGovernmentCosts =
      titleInsurance + escrow + recording + transferTax;
    const prepaidAndEscrowCosts =
      prepaidTaxes +
      taxEscrowReserve +
      prepaidInsurance +
      insuranceEscrowReserve;

    const totalClosingCosts =
      lenderAndLoanCosts + titleAndGovernmentCosts + prepaidAndEscrowCosts + other;

    const cashToClose = downPaymentValue + totalClosingCosts;

    const closingCostPercent =
      homePriceValue > 0 ? (totalClosingCosts / homePriceValue) * 100 : 0;

    const downPaymentPercent =
      homePriceValue > 0 ? (downPaymentValue / homePriceValue) * 100 : 0;

    const loanToValue =
      homePriceValue > 0 ? (loanAmount / homePriceValue) * 100 : 0;

    const breakdown = [
      {
        label: "Lender fees",
        value: lenderFees,
      },
      {
        label: "Appraisal",
        value: appraisal,
      },
      {
        label: "Inspection",
        value: inspection,
      },
      {
        label: "Title insurance",
        value: titleInsurance,
      },
      {
        label: "Escrow / settlement fee",
        value: escrow,
      },
      {
        label: "Recording fee",
        value: recording,
      },
      {
        label: "Transfer tax",
        value: transferTax,
      },
      {
        label: "Prepaid property taxes",
        value: prepaidTaxes,
      },
      {
        label: "Property tax escrow reserve",
        value: taxEscrowReserve,
      },
      {
        label: "Prepaid insurance",
        value: prepaidInsurance,
      },
      {
        label: "Insurance escrow reserve",
        value: insuranceEscrowReserve,
      },
      {
        label: "Other costs",
        value: other,
      },
    ].filter((item) => item.value > 0);

    const maxBreakdownValue = Math.max(
      ...breakdown.map((item) => item.value),
      1
    );

    return {
      homePriceValue,
      downPaymentValue,
      loanAmount,
      lenderAndLoanCosts,
      titleAndGovernmentCosts,
      prepaidAndEscrowCosts,
      totalClosingCosts,
      cashToClose,
      closingCostPercent,
      downPaymentPercent,
      loanToValue,
      breakdown,
      maxBreakdownValue,
    };
  }, [
    homePrice,
    downPayment,
    lenderFeeRate,
    appraisalFee,
    inspectionFee,
    titleInsuranceRate,
    escrowFee,
    recordingFee,
    transferTaxRate,
    annualPropertyTax,
    prepaidTaxMonths,
    taxEscrowMonths,
    annualInsurance,
    prepaidInsuranceMonths,
    insuranceEscrowMonths,
    otherCosts,
  ]);

  const error =
    result.homePriceValue <= 0
      ? "Enter a home price greater than zero."
      : result.downPaymentValue > result.homePriceValue
        ? "Down payment cannot be higher than the home price."
        : "";

  function applyPreset(preset: (typeof presets)[number]) {
    setHomePrice(preset.values.homePrice);
    setDownPayment(preset.values.downPayment);
    setLenderFeeRate(preset.values.lenderFeeRate);
    setAppraisalFee(preset.values.appraisalFee);
    setInspectionFee(preset.values.inspectionFee);
    setTitleInsuranceRate(preset.values.titleInsuranceRate);
    setEscrowFee(preset.values.escrowFee);
    setRecordingFee(preset.values.recordingFee);
    setTransferTaxRate(preset.values.transferTaxRate);
    setAnnualPropertyTax(preset.values.annualPropertyTax);
    setPrepaidTaxMonths(preset.values.prepaidTaxMonths);
    setTaxEscrowMonths(preset.values.taxEscrowMonths);
    setAnnualInsurance(preset.values.annualInsurance);
    setPrepaidInsuranceMonths(preset.values.prepaidInsuranceMonths);
    setInsuranceEscrowMonths(preset.values.insuranceEscrowMonths);
    setOtherCosts(preset.values.otherCosts);
  }

  return (
    <div className="grid gap-8">
      <ToolInfoBox>
        Estimate buyer closing costs for a home purchase. This calculator is for
        planning only. Actual costs vary by lender, location, property type,
        taxes, title company, insurance provider and contract terms.
      </ToolInfoBox>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Estimated closing costs"
          value={formatCurrency(result.totalClosingCosts, currency)}
          helper={`${formatPercent(result.closingCostPercent)} of home price`}
          isDark
        />

        <SummaryCard
          label="Cash needed to close"
          value={formatCurrency(result.cashToClose, currency)}
          helper="Down payment plus estimated closing costs"
        />

        <SummaryCard
          label="Estimated loan amount"
          value={formatCurrency(result.loanAmount, currency)}
          helper={`${formatPercent(result.loanToValue)} loan-to-value`}
        />
      </section>

      <ToolResultBox title="Closing cost inputs">
        <div className="grid gap-5">
          <div className="grid gap-4 lg:grid-cols-3">
            <CurrencySelect value={currency} onChange={setCurrency} />

            <InputField
              label="Home price"
              value={homePrice}
              onChange={setHomePrice}
              prefix={currencySymbols[currency]}
            />

            <InputField
              label="Down payment"
              value={downPayment}
              onChange={setDownPayment}
              prefix={currencySymbols[currency]}
              helper={`${formatPercent(result.downPaymentPercent)} of home price`}
            />
          </div>

          <div className="rounded-2xl border border-black/10 bg-[#fff8df] p-5">
            <div className="mb-4">
              <h3 className="text-lg font-black">Quick scenarios</h3>
              <p className="mt-1 text-sm leading-6 text-black/60">
                Use a preset as a starting point, then adjust the numbers to
                match your market and lender estimate.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="rounded-2xl border border-black/10 bg-white p-4 text-left transition hover:border-black hover:shadow-sm"
                >
                  <div className="font-black">{preset.name}</div>
                  <div className="mt-1 text-sm leading-6 text-black/55">
                    {preset.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <InputGroup title="Loan and lender costs">
              <InputField
                label="Lender fees"
                value={lenderFeeRate}
                onChange={setLenderFeeRate}
                suffix="% of loan"
              />

              <InputField
                label="Appraisal fee"
                value={appraisalFee}
                onChange={setAppraisalFee}
                prefix={currencySymbols[currency]}
              />

              <InputField
                label="Inspection fee"
                value={inspectionFee}
                onChange={setInspectionFee}
                prefix={currencySymbols[currency]}
              />
            </InputGroup>

            <InputGroup title="Title and government costs">
              <InputField
                label="Title insurance"
                value={titleInsuranceRate}
                onChange={setTitleInsuranceRate}
                suffix="% of price"
              />

              <InputField
                label="Escrow / settlement fee"
                value={escrowFee}
                onChange={setEscrowFee}
                prefix={currencySymbols[currency]}
              />

              <InputField
                label="Recording fee"
                value={recordingFee}
                onChange={setRecordingFee}
                prefix={currencySymbols[currency]}
              />

              <InputField
                label="Transfer tax"
                value={transferTaxRate}
                onChange={setTransferTaxRate}
                suffix="% of price"
              />
            </InputGroup>

            <InputGroup title="Property tax reserves">
              <InputField
                label="Annual property tax"
                value={annualPropertyTax}
                onChange={setAnnualPropertyTax}
                prefix={currencySymbols[currency]}
              />

              <InputField
                label="Prepaid tax months"
                value={prepaidTaxMonths}
                onChange={setPrepaidTaxMonths}
                suffix="months"
              />

              <InputField
                label="Tax escrow reserve"
                value={taxEscrowMonths}
                onChange={setTaxEscrowMonths}
                suffix="months"
              />
            </InputGroup>

            <InputGroup title="Insurance and other costs">
              <InputField
                label="Annual home insurance"
                value={annualInsurance}
                onChange={setAnnualInsurance}
                prefix={currencySymbols[currency]}
              />

              <InputField
                label="Prepaid insurance"
                value={prepaidInsuranceMonths}
                onChange={setPrepaidInsuranceMonths}
                suffix="months"
              />

              <InputField
                label="Insurance escrow reserve"
                value={insuranceEscrowMonths}
                onChange={setInsuranceEscrowMonths}
                suffix="months"
              />

              <InputField
                label="Other costs"
                value={otherCosts}
                onChange={setOtherCosts}
                prefix={currencySymbols[currency]}
              />
            </InputGroup>
          </div>
        </div>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {!error && (
        <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <ToolResultBox title="Estimated cash to close">
            <div className="grid gap-4">
              <ResultLine
                label="Down payment"
                value={formatCurrency(result.downPaymentValue, currency)}
              />

              <ResultLine
                label="Estimated closing costs"
                value={formatCurrency(result.totalClosingCosts, currency)}
              />

              <div className="rounded-2xl bg-black p-5 text-white">
                <div className="text-sm font-bold text-white/65">
                  Total estimated cash needed
                </div>
                <div className="mt-2 text-4xl font-black tracking-tight">
                  {formatCurrency(result.cashToClose, currency)}
                </div>
                <div className="mt-2 text-sm text-white/65">
                  Includes your down payment and estimated buyer closing costs.
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <MiniMetric
                  label="Loan amount"
                  value={formatCurrency(result.loanAmount, currency)}
                />

                <MiniMetric
                  label="Closing cost rate"
                  value={formatPercent(result.closingCostPercent)}
                />

                <MiniMetric
                  label="Down payment"
                  value={formatPercent(result.downPaymentPercent)}
                />
              </div>
            </div>
          </ToolResultBox>

          <ToolResultBox title="Cost breakdown">
            <div className="grid gap-4">
              <BreakdownBar
                label="Loan and lender costs"
                value={result.lenderAndLoanCosts}
                max={result.totalClosingCosts}
                currency={currency}
              />

              <BreakdownBar
                label="Title and government costs"
                value={result.titleAndGovernmentCosts}
                max={result.totalClosingCosts}
                currency={currency}
              />

              <BreakdownBar
                label="Prepaids and escrow reserves"
                value={result.prepaidAndEscrowCosts}
                max={result.totalClosingCosts}
                currency={currency}
              />

              <div className="mt-2 border-t border-black/10 pt-4">
                <div className="grid gap-3">
                  {result.breakdown.map((item) => (
                    <BreakdownBar
                      key={item.label}
                      label={item.label}
                      value={item.value}
                      max={result.maxBreakdownValue}
                      currency={currency}
                      isSmall
                    />
                  ))}
                </div>
              </div>
            </div>
          </ToolResultBox>
        </section>
      )}
    </div>
  );
}

function CurrencySelect({
  value,
  onChange,
}: {
  value: Currency;
  onChange: (value: Currency) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-black">Currency</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as Currency)}
        className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold outline-none transition focus:border-black"
      >
        {Object.keys(currencySymbols).map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </label>
  );
}

function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  helper?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-black">{label}</span>

      <div className="flex h-12 overflow-hidden rounded-2xl border border-black/10 bg-white transition-within:border-black">
        {prefix && (
          <div className="flex items-center border-r border-black/10 px-3 text-sm font-bold text-black/50">
            {prefix}
          </div>
        )}

        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-4 text-sm font-bold outline-none"
        />

        {suffix && (
          <div className="flex items-center border-l border-black/10 px-3 text-sm font-bold text-black/50">
            {suffix}
          </div>
        )}
      </div>

      {helper && <span className="text-xs font-medium text-black/50">{helper}</span>}
    </label>
  );
}

function InputGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-black">{title}</h3>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  helper,
  isDark,
}: {
  label: string;
  value: string;
  helper: string;
  isDark?: boolean;
}) {
  return (
    <div
      className={
        isDark
          ? "rounded-2xl border border-black bg-black p-5 text-white shadow-sm"
          : "rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
      }
    >
      <div
        className={
          isDark
            ? "text-sm font-bold text-white/65"
            : "text-sm font-bold text-black/50"
        }
      >
        {label}
      </div>
      <div className="mt-2 text-3xl font-black tracking-tight">{value}</div>
      <div
        className={
          isDark ? "mt-2 text-sm text-white/60" : "mt-2 text-sm text-black/55"
        }
      >
        {helper}
      </div>
    </div>
  );
}

function ResultLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-sm font-bold text-black/60">{label}</div>
      <div className="text-lg font-black">{value}</div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-xs font-black uppercase tracking-wide text-black/40">
        {label}
      </div>
      <div className="mt-2 text-lg font-black">{value}</div>
    </div>
  );
}

function BreakdownBar({
  label,
  value,
  max,
  currency,
  isSmall,
}: {
  label: string;
  value: number;
  max: number;
  currency: Currency;
  isSmall?: boolean;
}) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <div
          className={
            isSmall
              ? "text-sm font-bold text-black/60"
              : "text-sm font-black text-black"
          }
        >
          {label}
        </div>
        <div className={isSmall ? "text-sm font-black" : "text-base font-black"}>
          {formatCurrency(value, currency)}
        </div>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-black"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}