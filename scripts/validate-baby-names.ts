import girls from "../data/baby-names/girls.json";
import boys from "../data/baby-names/boys.json";
import unisex from "../data/baby-names/unisex.json";
import {
  babyNameOrigins,
  babyNameStyles,
  babyNameTags,
} from "../data/baby-names/taxonomy";

type Gender = "girl" | "boy" | "unisex";

type BabyName = {
  id: string;
  name: string;
  gender: Gender;
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

const allNames = [
  ...(girls as BabyName[]),
  ...(boys as BabyName[]),
  ...(unisex as BabyName[]),
];

const errors: string[] = [];
const allowedOrigins = new Set<string>(babyNameOrigins);
const allowedStyles = new Set<string>(babyNameStyles);
const allowedTags = new Set<string>(babyNameTags);
const ids = new Set<string>();
const nameGenderKeys = new Set<string>();
const namesByDisplayName = new Map<string, BabyName[]>();

function isNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateArray(
  item: BabyName,
  key: keyof BabyName,
  minLength: number
) {
  const value = item[key];

  if (!Array.isArray(value) || value.length < minLength) {
    errors.push(`${item.id}: ${String(key)} must contain at least ${minLength} item(s).`);
    return;
  }

  for (const entry of value) {
    if (!isNonEmptyString(entry)) {
      errors.push(`${item.id}: ${String(key)} contains an empty value.`);
    }
  }
}

for (const item of allNames) {
  if (!isNonEmptyString(item.id)) {
    errors.push(`Missing id for ${item.name}`);
    continue;
  }

  if (ids.has(item.id)) {
    errors.push(`Duplicate id: ${item.id}`);
  }

  ids.add(item.id);

  if (!isNonEmptyString(item.name)) {
    errors.push(`${item.id}: missing name`);
  }

  if (!["girl", "boy", "unisex"].includes(item.gender)) {
    errors.push(`${item.id}: invalid gender`);
  }

  const nameGenderKey = `${item.name.toLowerCase()}-${item.gender}`;

  if (nameGenderKeys.has(nameGenderKey)) {
    errors.push(`Duplicate name/gender: ${item.name} (${item.gender})`);
  }

  nameGenderKeys.add(nameGenderKey);

  const displayKey = item.name.toLowerCase();
  const existing = namesByDisplayName.get(displayKey) || [];
  namesByDisplayName.set(displayKey, [...existing, item]);

  if (!isNonEmptyString(item.meaning)) {
    errors.push(`${item.id}: missing meaning`);
  }

  validateArray(item, "origins", 1);
  validateArray(item, "countries", 1);
  validateArray(item, "styles", 2);
  validateArray(item, "tags", 2);

  for (const origin of item.origins) {
  if (!allowedOrigins.has(origin)) {
    errors.push(`${item.id}: unknown origin "${origin}"`);
  }
}

for (const style of item.styles) {
  if (!allowedStyles.has(style)) {
    errors.push(`${item.id}: unknown style "${style}"`);
  }
}

for (const tag of item.tags) {
  if (!allowedTags.has(tag)) {
    errors.push(`${item.id}: unknown tag "${tag}"`);
  }
}

  if (!Array.isArray(item.variants)) {
    errors.push(`${item.id}: variants must be an array`);
  }

  if (!Array.isArray(item.similar) || item.similar.length < 3) {
    errors.push(`${item.id}: similar must contain at least 3 names`);
  }

  if (!Number.isInteger(item.popularity) || item.popularity < 1 || item.popularity > 100) {
    errors.push(`${item.id}: popularity must be an integer between 1 and 100`);
  }

  if (!Number.isInteger(item.syllables) || item.syllables < 1 || item.syllables > 6) {
    errors.push(`${item.id}: syllables must be an integer between 1 and 6`);
  }

  if (item.id !== item.id.toLowerCase()) {
    errors.push(`${item.id}: id must be lowercase`);
  }

  if (item.id.includes(" ")) {
    errors.push(`${item.id}: id must not contain spaces`);
  }
}

for (const item of allNames) {
  for (const similarName of item.similar) {
    const exists = allNames.some(
      (entry) => entry.name.toLowerCase() === similarName.toLowerCase()
    );

    if (!exists) {
      errors.push(`${item.id}: similar name "${similarName}" does not exist`);
    }

    if (similarName.toLowerCase() === item.name.toLowerCase()) {
      errors.push(`${item.id}: similar must not include itself`);
    }
  }
}

const counts = {
  girl: allNames.filter((item) => item.gender === "girl").length,
  boy: allNames.filter((item) => item.gender === "boy").length,
  unisex: allNames.filter((item) => item.gender === "unisex").length,
};

console.log("Baby name counts:");
console.log(`Girls: ${counts.girl}`);
console.log(`Boys: ${counts.boy}`);
console.log(`Unisex: ${counts.unisex}`);
console.log(`Total: ${allNames.length}`);

if (errors.length > 0) {
  console.error("\nBaby name validation failed:");
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("\nBaby name validation passed.");