"use client";

import { useState } from "react";

import ConverterCard from "@/components/ConverterCard";

export default function LbsToKgClient() {
  const [lbs, setLbs] = useState("");
  const [kg, setKg] = useState("");

  function convertLbsToKg(value: string) {
    setLbs(value);

    const number = parseFloat(value);

    if (isNaN(number)) {
      setKg("");
      return;
    }

    const result = number / 2.20462;

    setKg(result.toFixed(2));
  }

  return (
    <ConverterCard
      inputLabel="Pounds"
      outputLabel="Kilograms"
      inputValue={lbs}
      outputValue={kg}
      placeholder="Enter pounds"
      onChange={convertLbsToKg}
    />
  );
}