"use client";

import { useState } from "react";

import ConverterCard from "@/components/ConverterCard";

export default function KgToLbsClient() {
  const [kg, setKg] = useState("");
  const [lbs, setLbs] = useState("");

  function convertKgToLbs(value: string) {
    setKg(value);

    const number = parseFloat(value);

    if (isNaN(number)) {
      setLbs("");
      return;
    }

    const result = number * 2.20462;

    setLbs(result.toFixed(2));
  }

  return (
    <ConverterCard
      inputLabel="Kilograms"
      outputLabel="Pounds"
      inputValue={kg}
      outputValue={lbs}
      placeholder="Enter kilograms"
      onChange={convertKgToLbs}
    />
  );
}