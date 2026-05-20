"use client";

type Props = {
  inputLabel: string;

  outputLabel: string;

  inputValue: string;

  outputValue: string;

  placeholder: string;

  onChange: (value: string) => void;
};

export default function ConverterCard({
  inputLabel,
  outputLabel,
  inputValue,
  outputValue,
  placeholder,
  onChange,
}: Props) {
  return (
    <div className="border rounded-2xl p-8 shadow-sm">

      <label className="block mb-2 font-medium">
        {inputLabel}
      </label>

      <input
        type="number"
        value={inputValue}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full border rounded-xl px-4 py-3 mb-6"
      />

      <label className="block mb-2 font-medium">
        {outputLabel}
      </label>

      <input
        type="text"
        value={outputValue}
        readOnly
        className="w-full border rounded-xl px-4 py-3 bg-gray-100"
      />

    </div>
  );
}