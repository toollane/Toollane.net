"use client";

import { useMemo, useState } from "react";

import NumberInput from "@/components/NumberInput";

export default function StudyTimeCalculatorClient() {
  const [topics, setTopics] = useState("");
  const [minutesPerTopic, setMinutesPerTopic] = useState("");
  const [days, setDays] = useState("");

  const result = useMemo(() => {
    const topicCount = parseFloat(topics);
    const minutes = parseFloat(minutesPerTopic);
    const dayCount = parseFloat(days);

    if (
      isNaN(topicCount) ||
      isNaN(minutes) ||
      isNaN(dayCount) ||
      topicCount <= 0 ||
      minutes <= 0 ||
      dayCount <= 0
    ) {
      return {
        totalHours: "",
        dailyMinutes: "",
      };
    }

    const totalMinutes = topicCount * minutes;
    const totalHours = totalMinutes / 60;
    const dailyMinutes = totalMinutes / dayCount;

    return {
      totalHours: totalHours.toFixed(1),
      dailyMinutes: dailyMinutes.toFixed(0),
    };
  }, [topics, minutesPerTopic, days]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Plan Study Time
        </h2>

        <p className="text-black/60 leading-7">
          Estimate total study time and daily study minutes based on topics, time per topic and available days.
        </p>
      </div>

      <div className="grid gap-6">
        <NumberInput
          label="Number of Topics"
          value={topics}
          onChange={setTopics}
          placeholder="12"
        />

        <NumberInput
          label="Minutes per Topic"
          value={minutesPerTopic}
          onChange={setMinutesPerTopic}
          placeholder="45"
        />

        <NumberInput
          label="Days Available"
          value={days}
          onChange={setDays}
          placeholder="7"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Total Study Time
          </div>

          <div className="text-3xl font-bold">
            {result.totalHours || "0"} hours
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Daily Study Time
          </div>

          <div className="text-3xl font-bold">
            {result.dailyMinutes || "0"} min/day
          </div>
        </div>
      </div>
    </div>
  );
}