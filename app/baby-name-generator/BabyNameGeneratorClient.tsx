"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { babyNames } from "@/data/baby-names";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type Gender = "all" | "boy" | "girl" | "unisex";
type Popularity = "all" | "popular" | "balanced" | "rare";

type BabyName = {
  id: string;
  name: string;
  gender: "boy" | "girl" | "unisex";
  origins: string[];
  countries: string[];
  styles: string[];
  meaning: string;
  popularity: number;
  syllables: number;
  variants: string[];
  similar: string[];
  tags: string[];
};

const BABY_NAMES = babyNames as BabyName[];
const INITIAL_VISIBLE_COUNT = 20;
const LOAD_MORE_COUNT = 20;

const ORIGINS = Array.from(
  new Set(BABY_NAMES.flatMap((name) => name.origins))
).sort();

const STYLES = Array.from(
  new Set(BABY_NAMES.flatMap((name) => name.styles))
).sort();

function scoreName(name: BabyName, surname: string) {
  if (!surname.trim()) return null;

  const cleanSurname = surname.trim().toLowerCase();
  const cleanName = name.name.toLowerCase();

  let score = 70;

  if (cleanName.at(-1) !== cleanSurname.at(0)) score += 10;
  if (Math.abs(cleanName.length - cleanSurname.length) <= 3) score += 10;
  if (cleanName.length + cleanSurname.length <= 16) score += 5;
  if (!cleanSurname.includes(cleanName.slice(-2))) score += 5;

  return Math.min(score, 100);
}

function popularityMatches(value: number, filter: Popularity) {
  if (filter === "popular") return value >= 75;
  if (filter === "balanced") return value >= 45 && value < 75;
  if (filter === "rare") return value < 45;
  return true;
}

export default function BabyNameGeneratorClient() {
  const [gender, setGender] = useState<Gender>("all");
  const [origin, setOrigin] = useState("all");
  const [style, setStyle] = useState("all");
  const [popularity, setPopularity] = useState<Popularity>("all");
  const [startsWith, setStartsWith] = useState("");
  const [endsWith, setEndsWith] = useState("");
  const [maxLength, setMaxLength] = useState(12);
  const [surname, setSurname] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [randomNameId, setRandomNameId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const hasActiveFilters =
    gender !== "all" ||
    origin !== "all" ||
    style !== "all" ||
    popularity !== "all" ||
    startsWith.trim() !== "" ||
    endsWith.trim() !== "" ||
    maxLength !== 12;

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    setRandomNameId(null);
  }, [gender, origin, style, popularity, startsWith, endsWith, maxLength]);

  const results = useMemo(() => {
    if (!hasActiveFilters) return [];

    return BABY_NAMES.filter((item) => {
      if (gender !== "all" && item.gender !== gender) return false;
      if (origin !== "all" && !item.origins.includes(origin)) return false;
      if (style !== "all" && !item.styles.includes(style)) return false;
      if (!popularityMatches(item.popularity, popularity)) return false;

      if (
        startsWith.trim() &&
        !item.name.toLowerCase().startsWith(startsWith.trim().toLowerCase())
      ) {
        return false;
      }

      if (
        endsWith.trim() &&
        !item.name.toLowerCase().endsWith(endsWith.trim().toLowerCase())
      ) {
        return false;
      }

      if (item.name.length > maxLength) return false;

      return true;
    }).sort(
      (a, b) => b.popularity - a.popularity || a.name.localeCompare(b.name)
    );
  }, [
    gender,
    origin,
    style,
    popularity,
    startsWith,
    endsWith,
    maxLength,
    hasActiveFilters,
  ]);

  const randomPool = hasActiveFilters ? results : BABY_NAMES;
  const randomName = randomNameId
    ? BABY_NAMES.find((item) => item.id === randomNameId)
    : null;

  const visibleResults = results.slice(0, visibleCount);
  const hasMoreResults = results.length > visibleResults.length;

  function generateRandomName() {
    if (!randomPool.length) {
      setError("No names are available for the current filters.");
      return;
    }

    const randomIndex = Math.floor(Math.random() * randomPool.length);
    setRandomNameId(randomPool[randomIndex].id);
    setError("");
  }

  function toggleFavorite(name: string) {
    setFavorites((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  }

  async function copyResults() {
    if (!results.length) {
      setError("No names match your current filters.");
      return;
    }

    await navigator.clipboard.writeText(
      results
        .map((item) => {
          const match = scoreName(item, surname);

          return `${item.name} — ${item.meaning} — ${item.origins.join(", ")}${
            match ? ` — Match: ${match}%` : ""
          }`;
        })
        .join("\n")
    );

    setError("");
  }

  async function copyFavorites() {
    if (!favorites.length) {
      setError("Save at least one favorite name first.");
      return;
    }

    await navigator.clipboard.writeText(favorites.join("\n"));
    setError("");
  }

  function resetFilters() {
    setGender("all");
    setOrigin("all");
    setStyle("all");
    setPopularity("all");
    setStartsWith("");
    setEndsWith("");
    setMaxLength(12);
    setSurname("");
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    setRandomNameId(null);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
          Find baby names by gender, origin and style
        </h2>

        <p className="mt-4 text-sm leading-7 text-black/60 sm:text-base">
          Find beautiful baby names by gender, origin, country style,
          popularity, meaning, length and surname compatibility.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-6">
        <h2 className="text-lg font-black text-black">
          Find the perfect baby name
        </h2>

        <ul className="mt-4 grid gap-3 text-sm leading-6 text-black/70">
          <li>• Filter by boy, girl or unisex names</li>
          <li>• Discover international, vintage, rare and elegant names</li>
          <li>• Search by first letter, ending, origin, style and length</li>
          <li>• Save favorites and compare names with your surname</li>
        </ul>
      </div>

      {error && <ToolErrorBox message={error} />}

      <ToolResultBox title="Name filters">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="Gender"
            value={gender}
            onChange={(value) => setGender(value as Gender)}
          >
            <option value="all">All genders</option>
            <option value="girl">Girl</option>
            <option value="boy">Boy</option>
            <option value="unisex">Unisex / neutral</option>
          </Select>

          <Select
            label="Origin / country style"
            value={origin}
            onChange={setOrigin}
          >
            <option value="all">All origins</option>
            {ORIGINS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>

          <Select label="Name style" value={style} onChange={setStyle}>
            <option value="all">All styles</option>
            {STYLES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>

          <Select
            label="Popularity"
            value={popularity}
            onChange={(value) => setPopularity(value as Popularity)}
          >
            <option value="all">All popularity levels</option>
            <option value="popular">Popular</option>
            <option value="balanced">Balanced</option>
            <option value="rare">Rare / uncommon</option>
          </Select>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Starts with"
            value={startsWith}
            onChange={setStartsWith}
          />

          <Input
            label="Ends with"
            value={endsWith}
            onChange={setEndsWith}
            placeholder="a"
          />

          <Input
            label="Surname compatibility"
            value={surname}
            onChange={setSurname}
            placeholder="Müller"
          />

          <label className="block">
            <span className="text-sm font-bold text-black">
              Max length: {maxLength}
            </span>

            <input
              type="range"
              min="3"
              max="16"
              value={maxLength}
              onChange={(event) => setMaxLength(Number(event.target.value))}
              className="mt-5 w-full"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={generateRandomName}
            className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
          >
            🎲 Generate random name
          </button>

          <button
            type="button"
            onClick={resetFilters}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Reset filters
          </button>
        </div>
      </ToolResultBox>

      {randomName && (
        <ToolResultBox title="Random name pick">
          <div className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-6">
            <div className="text-xs font-bold uppercase tracking-wide text-black/50">
              Suggested name
            </div>

            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Link
                  href={`/baby-name/${randomName.id}`}
                  className="text-4xl font-black text-black hover:underline"
                >
                  {randomName.name}
                </Link>

                <div className="mt-2 text-sm font-bold capitalize text-black/50">
                  {randomName.gender}
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-black/70">
                  <strong>Meaning:</strong> {randomName.meaning}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleFavorite(randomName.name)}
                className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-black/5"
              >
                {favorites.includes(randomName.name)
                  ? "♥ Saved"
                  : "♡ Save name"}
              </button>
            </div>

            {!!randomName.similar.length && (
              <div className="mt-5">
                <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                  Similar names
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {randomName.similar.map((similarName) => (
                    <span
                      key={similarName}
                      className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-bold text-black/60"
                    >
                      {similarName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ToolResultBox>
      )}

      <ToolResultBox
        title={
          hasActiveFilters
            ? `Generated baby names (${results.length})`
            : "Generate baby names"
        }
      >
        {!hasActiveFilters && (
          <div className="rounded-[2rem] border border-dashed border-black/10 bg-white p-8 text-center">
            <div className="text-lg font-black text-black">
              Choose a filter or generate a random name.
            </div>

            <p className="mt-3 text-sm leading-6 text-black/60">
              Select a gender, origin, style, popularity level or letter filter
              to generate matching baby names. You can also use the random name
              button for instant inspiration.
            </p>
          </div>
        )}

        {hasActiveFilters && !results.length && (
          <div className="rounded-[2rem] border border-dashed border-black/10 bg-white p-8 text-center text-sm text-black/60">
            No names found. Try removing one or two filters.
          </div>
        )}

        {!!visibleResults.length && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleResults.map((item) => {
                const match = scoreName(item, surname);

                return (
                  <div
                    key={item.id}
                    className="rounded-[2rem] border border-black/10 bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/baby-name/${item.id}`}
                          className="text-2xl font-black text-black hover:underline"
                        >
                          {item.name}
                        </Link>

                        <div className="mt-1 text-sm font-bold capitalize text-black/50">
                          {item.gender}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleFavorite(item.name)}
                        className="rounded-full border border-black/10 px-4 py-2 text-sm font-black text-black transition hover:bg-black/5"
                      >
                        {favorites.includes(item.name) ? "♥" : "♡"}
                      </button>
                    </div>

                    <div className="mt-4 text-sm leading-6 text-black/70">
                      <strong>Meaning:</strong> {item.meaning}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.origins.map((originItem) => (
                        <span
                          key={originItem}
                          className="rounded-full bg-[#fff8df] px-3 py-2 text-xs font-bold text-black"
                        >
                          {originItem}
                        </span>
                      ))}

                      {item.styles.slice(0, 3).map((styleItem) => (
                        <span
                          key={styleItem}
                          className="rounded-full border border-black/10 px-3 py-2 text-xs font-bold text-black"
                        >
                          {styleItem}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <ResultMini
                        label="Popularity"
                        value={`${item.popularity}/100`}
                      />
                      <ResultMini
                        label="Length"
                        value={`${item.name.length} letters`}
                      />
                      <ResultMini
                        label="Syllables"
                        value={`${item.syllables}`}
                      />
                      {match !== null && (
                        <ResultMini label="Surname match" value={`${match}%`} />
                      )}
                    </div>

                    {!!item.variants.length && (
                      <div className="mt-4 text-xs leading-5 text-black/50">
                        <strong>Variants:</strong> {item.variants.join(", ")}
                      </div>
                    )}

                    {!!item.similar.length && (
                      <div className="mt-4">
                        <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                          Similar names
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.similar.map((similarName) => (
                            <span
                              key={similarName}
                              className="rounded-full border border-black/10 bg-[#fafafa] px-3 py-2 text-xs font-bold text-black/60"
                            >
                              {similarName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {hasMoreResults && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((current) => current + LOAD_MORE_COUNT)
                  }
                  className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
                >
                  Load more names
                </button>
              </div>
            )}
          </>
        )}
      </ToolResultBox>

      <ToolResultBox title="Favorites">
        {favorites.length ? (
          <div className="flex flex-wrap gap-3">
            {favorites.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => toggleFavorite(name)}
                className="rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-black text-black"
              >
                ♥ {name}
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-black/10 bg-white p-8 text-center text-sm text-black/60">
            Tap the heart on any name to save favorites.
          </div>
        )}
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copyResults}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Copy results
        </button>

        <button
          type="button"
          onClick={copyFavorites}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Copy favorites
        </button>
      </div>

      <ToolInfoBox>
        Baby name preferences are personal and cultural. Use this generator as a
        discovery tool, then check pronunciation, spelling, meaning and local
        naming rules before making a final decision.
      </ToolInfoBox>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      >
        {children}
      </select>
    </label>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />
    </label>
  );
}

function ResultMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[#fafafa] p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-1 text-sm font-black text-black">{value}</div>
    </div>
  );
}