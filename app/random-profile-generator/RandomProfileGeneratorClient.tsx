"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type Region = "global" | "us" | "eu";
type OutputFormat = "cards" | "json" | "csv";

const FIRST_NAMES = ["Alex", "Emma", "Liam", "Sophia", "Noah", "Mia", "Lucas", "Olivia", "Ethan", "Ava"];
const LAST_NAMES = ["Smith", "Johnson", "Brown", "Taylor", "Miller", "Wilson", "Moore", "Clark", "Lewis", "Walker"];
const JOBS = ["Marketing Manager", "Software Developer", "Product Designer", "Sales Consultant", "Data Analyst", "Founder", "Teacher", "Accountant"];
const COMPANIES = ["Nova Labs", "Bright Studio", "CloudWorks", "Peak Digital", "Urban Systems", "Rapid Media"];
const CITIES_BY_REGION: Record<Region, string[]> = {
  global: ["Berlin", "New York", "London", "Toronto", "Sydney", "Amsterdam", "Singapore"],
  us: ["New York", "Los Angeles", "Austin", "Chicago", "Seattle", "Miami"],
  eu: ["Berlin", "Paris", "Madrid", "Rome", "Amsterdam", "Vienna"],
};

type Profile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  city: string;
  job: string;
  company: string;
  username: string;
};

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function createProfile(region: Region): Profile {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  const name = `${first} ${last}`;
  const username = `${slug(first)}${slug(last)}${Math.floor(Math.random() * 900 + 100)}`;

  return {
    id: crypto.randomUUID(),
    name,
    email: `${username}@example.com`,
    phone: `+${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000000 + 1000000)}`,
    age: Math.floor(Math.random() * 48) + 18,
    city: pick(CITIES_BY_REGION[region]),
    job: pick(JOBS),
    company: pick(COMPANIES),
    username,
  };
}

function toCsv(profiles: Profile[]) {
  const headers = ["id", "name", "email", "phone", "age", "city", "job", "company", "username"];

  return [
    headers.join(","),
    ...profiles.map((profile) =>
      headers
        .map((header) => {
          const value = String(profile[header as keyof Profile]);

          return value.includes(",") ? `"${value.replace(/"/g, '""')}"` : value;
        })
        .join(",")
    ),
  ].join("\n");
}

export default function RandomProfileGeneratorClient() {
  const [count, setCount] = useState(5);
  const [region, setRegion] = useState<Region>("global");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("cards");
  const [refreshKey, setRefreshKey] = useState(0);

  const profiles = useMemo(() => {
    const safeCount = Math.min(Math.max(count, 1), 100);

    return Array.from({ length: safeCount }, () => createProfile(region));
  }, [count, region, refreshKey]);

  const output = useMemo(() => {
    if (outputFormat === "json") {
      return JSON.stringify(profiles, null, 2);
    }

    if (outputFormat === "csv") {
      return toCsv(profiles);
    }

    return "";
  }, [profiles, outputFormat]);

  function regenerate() {
    setRefreshKey((current) => current + 1);
  }

  async function copyOutput() {
    if (outputFormat === "cards") {
      await navigator.clipboard.writeText(
        profiles
          .map((profile) => `${profile.name} | ${profile.email} | ${profile.job} | ${profile.city}`)
          .join("\n")
      );

      return;
    }

    await navigator.clipboard.writeText(output);
  }

  function downloadOutput() {
    const content = outputFormat === "json" ? output : toCsv(profiles);
    const type = outputFormat === "json" ? "application/json" : "text/csv";
    const extension = outputFormat === "json" ? "json" : "csv";
    const blob = new Blob([content], { type: `${type};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `random-profiles.${extension}`;
    link.click();

    URL.revokeObjectURL(url);
  }

  function resetExample() {
    setCount(5);
    setRegion("global");
    setOutputFormat("cards");
    setRefreshKey((current) => current + 1);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate random profiles
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Generate random user profiles for testing, mockups, seed data, demos
          and placeholder content.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-bold text-black">Profiles</span>

          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-black">Region</span>

          <select
            value={region}
            onChange={(event) => setRegion(event.target.value as Region)}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="global">Global</option>
            <option value="us">United States style</option>
            <option value="eu">Europe style</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-black">Output</span>

          <select
            value={outputFormat}
            onChange={(event) => setOutputFormat(event.target.value as OutputFormat)}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="cards">Profile cards</option>
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
        </label>
      </div>

      <ToolResultBox title="Generated profiles">
        {outputFormat === "cards" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {profiles.map((profile) => (
              <div key={profile.id} className="rounded-[2rem] border border-black/10 bg-white p-5">
                <div className="text-lg font-black text-black">{profile.name}</div>
                <div className="mt-1 text-sm text-black/60">@{profile.username}</div>

                <div className="mt-5 grid gap-2 text-sm text-black">
                  <div><strong>Email:</strong> {profile.email}</div>
                  <div><strong>Phone:</strong> {profile.phone}</div>
                  <div><strong>Age:</strong> {profile.age}</div>
                  <div><strong>City:</strong> {profile.city}</div>
                  <div><strong>Job:</strong> {profile.job}</div>
                  <div><strong>Company:</strong> {profile.company}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <textarea
            readOnly
            value={output}
            className="min-h-[360px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none"
          />
        )}
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={regenerate} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
          Generate new profiles
        </button>

        <button type="button" onClick={copyOutput} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Copy output
        </button>

        <button type="button" onClick={downloadOutput} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Download
        </button>

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Reset example
        </button>
      </div>

      <ToolInfoBox>
        Generated profiles are fictional and should only be used for testing,
        demos, design mockups and sample data.
      </ToolInfoBox>
    </div>
  );
}