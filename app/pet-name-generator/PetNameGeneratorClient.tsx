"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

import {
  petBreedPresets,
  petNames,
  petSpeciesOptions,
  petStyleOptions,
} from "@/data/pet-names";

import type {
  PetBreedPreset,
  PetGender,
  PetName,
  PetPopularity,
  PetSpecies,
  PetStyle,
} from "@/data/pet-names";

type SpeciesFilter = "any" | PetSpecies;
type GenderFilter = "any" | PetGender;
type StyleFilter = "any" | PetStyle;
type PopularityFilter = "any" | PetPopularity;
type LengthFilter = "any" | "short" | "medium" | "long";

type Scenario = {
  name: string;
  description: string;
  species: SpeciesFilter;
  gender: GenderFilter;
  style: StyleFilter;
  popularity: PopularityFilter;
  length: LengthFilter;
  startsWith: string;
  breedPresetId: string;
};

const genderOptions: { value: GenderFilter; label: string }[] = [
  { value: "any", label: "Any gender" },
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "neutral", label: "Neutral" },
];

const popularityOptions: { value: PopularityFilter; label: string }[] = [
  { value: "any", label: "Any popularity" },
  { value: "popular", label: "Popular" },
  { value: "balanced", label: "Balanced" },
  { value: "rare", label: "Rare / uncommon" },
];

const lengthOptions: { value: LengthFilter; label: string }[] = [
  { value: "any", label: "Any length" },
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];

const scenarios: Scenario[] = [
  {
    name: "Cute dog names",
    description: "Friendly and cute names for dogs.",
    species: "dog",
    gender: "any",
    style: "cute",
    popularity: "any",
    length: "any",
    startsWith: "",
    breedPresetId: "any",
  },
  {
    name: "Elegant cat names",
    description: "Elegant and unique names for cats.",
    species: "cat",
    gender: "any",
    style: "elegant",
    popularity: "any",
    length: "any",
    startsWith: "",
    breedPresetId: "any",
  },
  {
    name: "Strong dog names",
    description: "Bold names for confident dogs.",
    species: "dog",
    gender: "any",
    style: "strong",
    popularity: "any",
    length: "any",
    startsWith: "",
    breedPresetId: "german-shepherd",
  },
  {
    name: "Funny small pet names",
    description: "Playful names for rabbits and hamsters.",
    species: "rabbit",
    gender: "neutral",
    style: "funny",
    popularity: "any",
    length: "any",
    startsWith: "",
    breedPresetId: "any",
  },
];

function getNameLength(name: string): Exclude<LengthFilter, "any"> {
  if (name.length <= 4) {
    return "short";
  }

  if (name.length <= 7) {
    return "medium";
  }

  return "long";
}

function getSeededScore(value: string, seed: number) {
  let hash = seed;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 1000003;
  }

  return hash;
}

function getStyleLabel(style: PetStyle) {
  return (
    petStyleOptions.find((option) => option.value === style)?.label || style
  );
}

function getSpeciesLabel(species: PetSpecies) {
  return (
    petSpeciesOptions.find((option) => option.value === species)?.label ||
    species
  );
}

function getBreedPresetLabel(preset: PetBreedPreset | null) {
  if (!preset) {
    return "Any breed or personality";
  }

  return preset.label;
}

export default function PetNameGeneratorClient() {
  const [species, setSpecies] = useState<SpeciesFilter>("dog");
  const [gender, setGender] = useState<GenderFilter>("any");
  const [style, setStyle] = useState<StyleFilter>("any");
  const [popularity, setPopularity] = useState<PopularityFilter>("any");
  const [length, setLength] = useState<LengthFilter>("any");
  const [startsWith, setStartsWith] = useState("");
  const [breedPresetId, setBreedPresetId] = useState("any");
  const [resultCount, setResultCount] = useState("12");

  const [favorites, setFavorites] = useState<string[]>([]);
  const [randomSeed, setRandomSeed] = useState(17);
  const [error, setError] = useState("");

  const selectedBreedPreset = useMemo(() => {
    if (breedPresetId === "any") {
      return null;
    }

    return (
      petBreedPresets.find((preset) => preset.id === breedPresetId) || null
    );
  }, [breedPresetId]);

  const availableBreedPresets = useMemo(() => {
    if (species === "any") {
      return petBreedPresets;
    }

    return petBreedPresets.filter((preset) => preset.species === species);
  }, [species]);

  const filteredNames = useMemo(() => {
    const normalizedStartsWith = startsWith.trim().toLowerCase().slice(0, 1);
    const parsedResultCount = Number(resultCount);
    const safeResultCount =
      Number.isFinite(parsedResultCount) && parsedResultCount > 0
        ? Math.min(Math.round(parsedResultCount), 50)
        : 12;

    const filtered = petNames.filter((petName) => {
      if (species !== "any" && !petName.species.includes(species)) {
        return false;
      }

      if (gender !== "any" && !petName.gender.includes(gender)) {
        return false;
      }

      if (style !== "any" && !petName.styles.includes(style)) {
        return false;
      }

      if (
        selectedBreedPreset &&
        !selectedBreedPreset.styles.some((presetStyle) =>
          petName.styles.includes(presetStyle)
        )
      ) {
        return false;
      }

      if (popularity !== "any" && petName.popularity !== popularity) {
        return false;
      }

      if (length !== "any" && getNameLength(petName.name) !== length) {
        return false;
      }

      if (
        normalizedStartsWith &&
        !petName.name.toLowerCase().startsWith(normalizedStartsWith)
      ) {
        return false;
      }

      return true;
    });

    return [...filtered]
      .sort(
        (firstName, secondName) =>
          getSeededScore(firstName.name, randomSeed) -
          getSeededScore(secondName.name, randomSeed)
      )
      .slice(0, safeResultCount);
  }, [
    species,
    gender,
    style,
    popularity,
    length,
    startsWith,
    resultCount,
    selectedBreedPreset,
    randomSeed,
  ]);

  const allMatchingNames = useMemo(() => {
    const normalizedStartsWith = startsWith.trim().toLowerCase().slice(0, 1);

    return petNames.filter((petName) => {
      if (species !== "any" && !petName.species.includes(species)) {
        return false;
      }

      if (gender !== "any" && !petName.gender.includes(gender)) {
        return false;
      }

      if (style !== "any" && !petName.styles.includes(style)) {
        return false;
      }

      if (
        selectedBreedPreset &&
        !selectedBreedPreset.styles.some((presetStyle) =>
          petName.styles.includes(presetStyle)
        )
      ) {
        return false;
      }

      if (popularity !== "any" && petName.popularity !== popularity) {
        return false;
      }

      if (length !== "any" && getNameLength(petName.name) !== length) {
        return false;
      }

      if (
        normalizedStartsWith &&
        !petName.name.toLowerCase().startsWith(normalizedStartsWith)
      ) {
        return false;
      }

      return true;
    });
  }, [
    species,
    gender,
    style,
    popularity,
    length,
    startsWith,
    selectedBreedPreset,
  ]);

  function validateAndGenerate() {
    if (allMatchingNames.length === 0) {
      setError(
        "No pet names match these filters yet. Try a broader style, remove the starting letter or choose any popularity."
      );
      return;
    }

    setError("");
    setRandomSeed((currentSeed) => currentSeed + 97);
  }

  function resetFilters() {
    setSpecies("dog");
    setGender("any");
    setStyle("any");
    setPopularity("any");
    setLength("any");
    setStartsWith("");
    setBreedPresetId("any");
    setResultCount("12");
    setError("");
    setRandomSeed((currentSeed) => currentSeed + 97);
  }

  function applyScenario(scenario: Scenario) {
    setSpecies(scenario.species);
    setGender(scenario.gender);
    setStyle(scenario.style);
    setPopularity(scenario.popularity);
    setLength(scenario.length);
    setStartsWith(scenario.startsWith);
    setBreedPresetId(scenario.breedPresetId);
    setError("");
    setRandomSeed((currentSeed) => currentSeed + 97);
  }

  function handleSpeciesChange(value: SpeciesFilter) {
    setSpecies(value);
    setBreedPresetId("any");
    setError("");
  }

  function toggleFavorite(name: string) {
    setFavorites((currentFavorites) =>
      currentFavorites.includes(name)
        ? currentFavorites.filter((favorite) => favorite !== name)
        : [...currentFavorites, name]
    );
  }

  async function copyNames(names: string[]) {
    if (names.length === 0) {
      setError("There are no names to copy yet.");
      return;
    }

    await navigator.clipboard.writeText(names.join(", "));
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate pet name ideas
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Find name ideas for dogs, cats, horses, rabbits, birds, hamsters,
          fish and other pets. Filter by pet type, style, gender, starting
          letter, popularity and personality.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Matching names"
          value={String(allMatchingNames.length)}
          highlight
        />

        <StatCard label="Shown results" value={String(filteredNames.length)} />

        <StatCard label="Favorites" value={String(favorites.length)} />
      </div>

      <ToolResultBox title="Pet name filters">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <span className="text-sm font-bold text-black">Pet type</span>

            <select
              value={species}
              onChange={(event) =>
                handleSpeciesChange(event.target.value as SpeciesFilter)
              }
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="any">Any pet type</option>
              {petSpeciesOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs leading-5 text-black/50">
              Choose the animal type for better name suggestions.
            </p>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">Gender</span>

            <select
              value={gender}
              onChange={(event) =>
                setGender(event.target.value as GenderFilter)
              }
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs leading-5 text-black/50">
              Use neutral if you want flexible pet names.
            </p>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">Name style</span>

            <select
              value={style}
              onChange={(event) => setStyle(event.target.value as StyleFilter)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="any">Any style</option>
              {petStyleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs leading-5 text-black/50">
              Choose cute, funny, classic, strong or unique styles.
            </p>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">
              Breed or personality
            </span>

            <select
              value={breedPresetId}
              onChange={(event) => setBreedPresetId(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="any">Any breed or personality</option>
              {availableBreedPresets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs leading-5 text-black/50">
              Optional preset that adjusts the style mix.
            </p>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">Popularity</span>

            <select
              value={popularity}
              onChange={(event) =>
                setPopularity(event.target.value as PopularityFilter)
              }
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              {popularityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs leading-5 text-black/50">
              Choose popular names or less common ideas.
            </p>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">Name length</span>

            <select
              value={length}
              onChange={(event) => setLength(event.target.value as LengthFilter)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              {lengthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs leading-5 text-black/50">
              Short names are often easier for pets to recognize.
            </p>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">
              Starts with
            </span>

            <input
              type="text"
              value={startsWith}
              onChange={(event) =>
                setStartsWith(event.target.value.slice(0, 1))
              }
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
              placeholder="A"
            />

            <p className="mt-2 text-xs leading-5 text-black/50">
              Optional first letter.
            </p>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">
              Number of results
            </span>

            <input
              type="text"
              inputMode="numeric"
              value={resultCount}
              onChange={(event) => setResultCount(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
              placeholder="12"
            />

            <p className="mt-2 text-xs leading-5 text-black/50">
              Shows up to 50 matching names.
            </p>
          </label>

          <div className="rounded-2xl border border-black/10 bg-[#fff8df] p-4">
            <div className="text-sm font-black text-black">
              Current preset
            </div>

            <p className="mt-2 text-sm leading-6 text-black/60">
              {getBreedPresetLabel(selectedBreedPreset)}
            </p>

            {selectedBreedPreset && (
              <p className="mt-2 text-xs leading-5 text-black/50">
                {selectedBreedPreset.description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={validateAndGenerate}
            className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
          >
            Generate pet names
          </button>

          <button
            type="button"
            onClick={resetFilters}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:border-black"
          >
            Reset filters
          </button>

          <button
            type="button"
            onClick={() => copyNames(filteredNames.map((item) => item.name))}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:border-black"
          >
            Copy results
          </button>
        </div>
      </ToolResultBox>

      <ToolResultBox title="Quick pet name ideas">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {scenarios.map((scenario) => (
            <button
              key={scenario.name}
              type="button"
              onClick={() => applyScenario(scenario)}
              className="rounded-2xl border border-black/10 bg-white p-4 text-left transition hover:border-black hover:bg-black/[0.02]"
            >
              <div className="text-sm font-black text-black">
                {scenario.name}
              </div>

              <div className="mt-2 text-xs leading-5 text-black/50">
                {scenario.description}
              </div>
            </button>
          ))}
        </div>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {!error && (
        <ToolResultBox title="Pet name results">
          {filteredNames.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredNames.map((petName) => (
                <PetNameCard
                  key={petName.name}
                  petName={petName}
                  favorite={favorites.includes(petName.name)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-black/10 bg-[#fff8df] p-5">
              <div className="text-sm font-black text-black">
                No matches yet
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                Try choosing any style, any popularity or removing the starting
                letter filter.
              </p>
            </div>
          )}
        </ToolResultBox>
      )}

      <ToolResultBox title="Favorites">
        {favorites.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2">
              {favorites.map((favorite) => (
                <button
                  key={favorite}
                  type="button"
                  onClick={() => toggleFavorite(favorite)}
                  className="rounded-full border border-black/10 bg-[#fff8df] px-4 py-2 text-sm font-bold text-black transition hover:border-black"
                >
                  {favorite} ×
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => copyNames(favorites)}
              className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              Copy favorites
            </button>
          </>
        ) : (
          <p className="text-sm leading-6 text-black/60">
            Tap the heart on a name to save it here.
          </p>
        )}
      </ToolResultBox>

      <ToolInfoBox>
        Pet name suggestions are for inspiration. This starter dataset is
        structured so it can later be expanded with open pet license datasets
        and additional curated name tags. Breed and personality presets are
        used as style guidance, not as official breed-specific naming rules.
      </ToolInfoBox>
    </div>
  );
}

function PetNameCard({
  petName,
  favorite,
  onToggleFavorite,
}: {
  petName: PetName;
  favorite: boolean;
  onToggleFavorite: (name: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-black tracking-tight text-black">
            {petName.name}
          </div>

          <div className="mt-2 text-xs font-bold uppercase tracking-wide text-black/40">
            {petName.popularity}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleFavorite(petName.name)}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          className={`rounded-full border px-3 py-2 text-sm font-black transition ${
            favorite
              ? "border-black bg-black text-white"
              : "border-black/10 bg-white text-black hover:border-black"
          }`}
        >
          ♥
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {petName.species.slice(0, 3).map((species) => (
          <span
            key={species}
            className="rounded-full border border-black/10 bg-[#fff8df] px-3 py-1 text-xs font-bold text-black/60"
          >
            {getSpeciesLabel(species)}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {petName.styles.slice(0, 3).map((style) => (
          <span
            key={style}
            className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-bold text-black/50"
          >
            {getStyleLabel(style)}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatCard({
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
      className={`rounded-2xl border p-5 shadow-sm ${
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