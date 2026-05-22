type Props = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  hint?: string;
};

export default function NumberInput({
  label,
  value,
  placeholder,
  onChange,
  hint = "Decimals can be entered with a dot or comma, for example 2.5 or 2,5.",
}: Props) {
  return (
    <div>
      <label className="block mb-2 font-medium">
        {label}
      </label>

      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) =>
          onChange(e.target.value.replace(",", "."))
        }
        placeholder={placeholder}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <p className="mt-2 text-sm text-black/45 leading-6">
        {hint}
      </p>
    </div>
  );
}