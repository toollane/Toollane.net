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

type Preset = {
  label: string;
  description: string;
  gender: Gender;
  style: string;
  popularity: Popularity;
  maxLength: number;
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

const PRESETS: Preset[] = [
  {
    label: "Classic girl names",
    description: "Timeless girl name ideas with familiar style.",
    gender: "girl",
    style: "Classic",
    popularity: "all",
    maxLength: 12,
  },
  {
    label: "Strong boy names",
    description: "Boy names with a strong, clear sound.",
    gender: "boy",
    style: "Strong",
    popularity: "all",
    maxLength: 12,
  },
  {
    label: "Rare unisex names",
    description: "Gender-neutral names that feel more distinctive.",
    gender: "unisex",
    style: "all",
    popularity: "rare",
    maxLength: 12,
  },
  {
    label: "Short modern names",
    description: "Simple names with a modern feel.",
    gender: "all",
    style: "Modern",
    popularity: "all",
    maxLength: 6,
  },
  {
    label: "Elegant names",
    description: "Refined baby names with graceful style.",
    gender: "all",
    style: "Elegant",
    popularity: "all",
    maxLength: 12,
  },
  {
    label: "Nature-inspired names",
    description: "Names connected to nature, seasons or the outdoors.",
    gender: "all",
    style: "Nature",
    popularity: "all",
    maxLength: 12,
  },
];

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

function getPopularityLabel(value: number) {
  if (value >= 75) return "Popular";
  if (value >= 45) return "Balanced";
  return "Rare";
}

function getSurnameFitLabel(score: number | null) {
  if (score === null) return "Add surname";
  if (score >= 90) return "Strong fit";
  if (score >= 80) return "Good fit";
  if (score >= 70) return "Possible fit";
  return "Check rhythm";
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

  const favoriteDetails = favorites
    .map((favorite) => BABY_NAMES.find((item) => item.name === favorite))
    .filter(Boolean) as BabyName[];

  const resultSummary = useMemo(() => {
    if (!hasActiveFilters) {
      return "Choose one or more filters to build a focused baby name shortlist.";
    }

    if (!results.length) {
      return "No names match all current filters. Try removing one filter or increasing the maximum length.";
    }

    const topOrigins = Array.from(
      new Set(results.slice(0, 20).flatMap((item) => item.origins))
    ).slice(0, 4);

    const topStyles = Array.from(
      new Set(results.slice(0, 20).flatMap((item) => item.styles))
    ).slice(0, 4);

    return `Your current filters found ${results.length} names. The strongest matches include origins like ${
      topOrigins.length ? topOrigins.join(", ") : "various origins"
    } and styles like ${topStyles.length ? topStyles.join(", ") : "mixed styles"}.`;
  }, [hasActiveFilters, results]);

  function applyPreset(preset: Preset) {
    setGender(preset.gender);
    setOrigin("all");
    setStyle(STYLES.includes(preset.style) ? preset.style : "all");
    setPopularity(preset.popularity);
    setStartsWith("");
    setEndsWith("");
    setMaxLength(preset.maxLength);
    setRandomNameId(null);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    setError("");
  }

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
            match ? ` — Surname fit: ${getSurnameFitLabel(match)}` : ""
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
          Generate baby names and build a shortlist
        </h2>

        <p className="mt-4 text-sm leading-7 text-black/60 sm:text-base">
          Use filters to discover baby names by gender, origin, style,
          popularity, length and surname fit. Save favorites, compare meanings
          and narrow a broad list into names that feel realistic.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
        <div className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-6">
          <h2 className="text-lg font-black text-black">
            A practical name search workflow
          </h2>

          <div className="mt-5 grid gap-3">
            <GuidanceItem
              number="1"
              title="Start with a direction"
              text="Choose gender, origin or style before adding narrow letter filters."
            />
            <GuidanceItem
              number="2"
              title="Review meaning and sound"
              text="Look at meaning, origins, syllables, length and how the name feels with a surname."
            />
            <GuidanceItem
              number="3"
              title="Save a shortlist"
              text="Use favorites to keep names you want to compare later."
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-black p-6 text-white">
          <h2 className="text-lg font-black">Good naming checks</h2>

          <ul className="mt-4 grid gap-3 text-sm leading-6 text-white/70">
            <li>• Say the full name out loud.</li>
            <li>• Check initials and common nicknames.</li>
            <li>• Verify meaning and cultural context.</li>
            <li>• Think about spelling and pronunciation.</li>
          </ul>

          <Link
            href="/baby-names"
            className="mt-6 inline-flex rounded-2xl bg-white px-5 py-4 text-sm font-black text-black transition hover:opacity-90"
          >
            Browse baby name hub →
          </Link>
        </div>
      </div>

      {error && <ToolErrorBox message={error} />}

      <ToolResultBox title="Quick starting points">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              className="rounded-2xl border border-black/10 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-black hover:shadow-md"
            >
              <div className="text-base font-black text-black">
                {preset.label}
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                {preset.description}
              </p>

              <div className="mt-4 text-sm font-bold text-black">
                Apply preset →
              </div>
            </button>
          ))}
        </div>
      </ToolResultBox>

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
            placeholder="L"
          />

          <Input
            label="Ends with"
            value={endsWith}
            onChange={setEndsWith}
            placeholder="a"
          />

          <Input
            label="Surname fit"
            value={surname}
            onChange={setSurname}
            placeholder="Miller"
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
            🎲 Pick a random name
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
          <NameHighlightCard
            name={randomName}
            surname={surname}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        </ToolResultBox>
      )}

      <ToolResultBox
        title={
          hasActiveFilters
            ? `Generated baby names (${results.length})`
            : "Generate baby names"
        }
      >
        <div className="mb-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5">
          <h3 className="text-base font-black text-black">Result guidance</h3>

          <p className="mt-2 text-sm leading-7 text-black/65">
            {resultSummary}
          </p>
        </div>

        {!hasActiveFilters && (
          <div className="rounded-[2rem] border border-dashed border-black/10 bg-white p-8 text-center">
            <div className="text-lg font-black text-black">
              Choose a filter, apply a preset or pick a random name.
            </div>

            <p className="mt-3 text-sm leading-6 text-black/60">
              Start broad, then narrow the list. A good first filter is usually
              gender, origin or style.
            </p>
          </div>
        )}

        {hasActiveFilters && !results.length && (
          <div className="rounded-[2rem] border border-dashed border-black/10 bg-white p-8 text-center text-sm text-black/60">
            No names found. Try removing one or two filters, choosing a broader
            style or increasing the maximum length.
          </div>
        )}

        {!!visibleResults.length && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleResults.map((item) => (
                <NameCard
                  key={item.id}
                  name={item}
                  surname={surname}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
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

      <ToolResultBox title="Favorites shortlist">
        {favoriteDetails.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {favoriteDetails.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-black/10 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/baby-name/${item.id}`}
                      className="text-xl font-black text-black hover:underline"
                    >
                      {item.name}
                    </Link>

                    <p className="mt-1 text-sm font-bold capitalize text-black/45">
                      {item.gender}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFavorite(item.name)}
                    className="rounded-full border border-black/10 px-3 py-2 text-xs font-black text-black transition hover:bg-black/5"
                  >
                    Remove
                  </button>
                </div>

                <p className="mt-4 text-sm leading-6 text-black/65">
                  <strong className="text-black">Meaning:</strong>{" "}
                  {item.meaning}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-black/10 bg-white p-8 text-center text-sm text-black/60">
            Tap the heart on any name to save favorites. Your shortlist stays in
            this browser session.
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

      <section className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black tracking-tight text-black">
          How to choose from generated names
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <DecisionTip
            title="Do not decide from popularity alone"
            text="A popular name can be practical and familiar, while a rare name can feel more distinctive. The better choice depends on your preference."
          />
          <DecisionTip
            title="Use meaning as one signal"
            text="Meanings can vary by language and source. Treat meaning as helpful context, not the only reason to choose a name."
          />
          <DecisionTip
            title="Check the full-name rhythm"
            text="A name that looks beautiful in a list may sound different with a surname. Say the full name out loud several times."
          />
          <DecisionTip
            title="Keep a realistic shortlist"
            text="Save a few favorites, then compare them later. A shortlist of 5 to 10 names is easier to review than a huge list."
          />
        </div>
      </section>

      <ToolInfoBox>
        Baby name preferences are personal and cultural. Use this generator as a
        discovery tool, then check pronunciation, spelling, meaning and local
        naming rules before making a final decision.
      </ToolInfoBox>
    </div>
  );
}

function NameHighlightCard({
  name,
  surname,
  favorites,
  onToggleFavorite,
}: {
  name: BabyName;
  surname: string;
  favorites: string[];
  onToggleFavorite: (name: string) => void;
}) {
  const match = scoreName(name, surname);

  return (
    <div className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-6">
      <div className="text-xs font-bold uppercase tracking-wide text-black/50">
        Suggested name
      </div>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href={`/baby-name/${name.id}`}
            className="text-4xl font-black text-black hover:underline"
          >
            {name.name}
          </Link>

          <div className="mt-2 text-sm font-bold capitalize text-black/50">
            {name.gender} · {getPopularityLabel(name.popularity)}
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/70">
            <strong>Meaning:</strong> {name.meaning}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {name.origins.slice(0, 3).map((originItem) => (
              <span
                key={originItem}
                className="rounded-full bg-white px-3 py-2 text-xs font-bold text-black"
              >
                {originItem}
              </span>
            ))}

            {name.styles.slice(0, 3).map((styleItem) => (
              <span
                key={styleItem}
                className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-bold text-black"
              >
                {styleItem}
              </span>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <ResultMini label="Length" value={`${name.name.length} letters`} />
            <ResultMini label="Syllables" value={`${name.syllables}`} />
            <ResultMini label="Surname fit" value={getSurnameFitLabel(match)} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleFavorite(name.name)}
          className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-black/5"
        >
          {favorites.includes(name.name) ? "♥ Saved" : "♡ Save name"}
        </button>
      </div>

      {!!name.similar.length && (
        <div className="mt-5">
          <div className="text-xs font-bold uppercase tracking-wide text-black/40">
            Similar names
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {name.similar.slice(0, 6).map((similarName) => (
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
  );
}

function NameCard({
  name,
  surname,
  favorites,
  onToggleFavorite,
}: {
  name: BabyName;
  surname: string;
  favorites: string[];
  onToggleFavorite: (name: string) => void;
}) {
  const match = scoreName(name, surname);

  return (
    <div className="rounded-[2rem] border border-black/10 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href={`/baby-name/${name.id}`}
            className="text-2xl font-black text-black hover:underline"
          >
            {name.name}
          </Link>

          <div className="mt-1 text-sm font-bold capitalize text-black/50">
            {name.gender} · {getPopularityLabel(name.popularity)}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleFavorite(name.name)}
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-black text-black transition hover:bg-black/5"
        >
          {favorites.includes(name.name) ? "♥" : "♡"}
        </button>
      </div>

      <div className="mt-4 text-sm leading-6 text-black/70">
        <strong>Meaning:</strong> {name.meaning}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {name.origins.slice(0, 3).map((originItem) => (
          <span
            key={originItem}
            className="rounded-full bg-[#fff8df] px-3 py-2 text-xs font-bold text-black"
          >
            {originItem}
          </span>
        ))}

        {name.styles.slice(0, 3).map((styleItem) => (
          <span
            key={styleItem}
            className="rounded-full border border-black/10 px-3 py-2 text-xs font-bold text-black"
          >
            {styleItem}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ResultMini label="Popularity" value={`${name.popularity}/100`} />
        <ResultMini label="Length" value={`${name.name.length} letters`} />
        <ResultMini label="Syllables" value={`${name.syllables}`} />
        <ResultMini label="Surname fit" value={getSurnameFitLabel(match)} />
      </div>

      {!!name.variants.length && (
        <div className="mt-4 text-xs leading-5 text-black/50">
          <strong>Variants:</strong> {name.variants.join(", ")}
        </div>
      )}

      {!!name.similar.length && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-wide text-black/40">
            Similar names
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {name.similar.slice(0, 5).map((similarName) => (
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

function GuidanceItem({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-black/10 bg-white/70 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-black text-white">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-black text-black">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-black/60">{text}</p>
      </div>
    </div>
  );
}

function DecisionTip({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[#fff8df] p-5">
      <h3 className="text-base font-black text-black">{title}</h3>

      <p className="mt-2 text-sm leading-7 text-black/60">{text}</p>
    </div>
  );
}