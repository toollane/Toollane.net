import fs from "fs";
import path from "path";

type UnisexCandidate = {
  name: string;
  femaleCount: number;
  maleCount: number;
  totalCount: number;
  balance: number;
};

type BabyName = {
  id: string;
  name: string;
  gender: "girl" | "boy" | "unisex";
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

const masterPath = path.join(
  "data",
  "baby-names",
  "database",
  "baby-names.master.json"
);

const candidatesPath = path.join(
  "data",
  "baby-names",
  "incoming",
  "unisex-candidates.json"
);

function createId(name: string) {
  return `${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-unisex`;
}

function estimatePopularity(totalCount: number) {
  if (totalCount >= 3000) return 80;
  if (totalCount >= 1500) return 72;
  if (totalCount >= 800) return 65;
  if (totalCount >= 400) return 58;
  if (totalCount >= 150) return 50;
  return 42;
}

function estimateSyllables(name: string) {
  const clean = name.toLowerCase().replace(/e$/, "");
  const groups = clean.match(/[aeiouy]+/g);
  return Math.max(1, Math.min(groups?.length || 1, 5));
}

const originOverrides: Record<string, string[]> = {
  Emery: ["German", "English"],
  Scottie: ["Scottish", "English"],
  Remi: ["French", "Latin"],
  Bailey: ["English"],
  Palmer: ["English"],
  Aspen: ["English"],
  Ariel: ["Hebrew"],
  Emory: ["German", "English"],
  Harlow: ["English"],
  Murphy: ["Irish"],
  Leighton: ["English"],
  Kendall: ["English"],
  Marley: ["English"],
  Navy: ["English"],
  Reign: ["English"],
  Harley: ["English"],
  Denver: ["English"],
  Carmen: ["Hebrew", "Latin"],
  Journey: ["English"],
  Monroe: ["Scottish", "Irish"],
  Campbell: ["Scottish"],
  Payton: ["English"],
  Winter: ["English"],
  Dream: ["English"],
  Quincy: ["Latin", "French"],
};

const meaningOverrides: Record<string, string> = {
  Emery: "brave, powerful",
  Scottie: "from Scotland",
  Remi: "oarsman, remedy",
  Bailey: "bailiff, steward",
  Palmer: "pilgrim, palm bearer",
  Aspen: "aspen tree",
  Ariel: "lion of God",
  Emory: "brave, powerful",
  Harlow: "rock hill, army hill",
  Murphy: "sea warrior",
  Leighton: "meadow settlement",
  Kendall: "valley of the River Kent",
  Marley: "pleasant wood, boundary meadow",
  Navy: "dark blue color, naval fleet",
  Reign: "rule, sovereign power",
  Harley: "hare meadow",
  Sevyn: "modern form of seven",
  Denver: "green valley",
  Carmen: "garden, song",
  Journey: "a trip or passage",
  Monroe: "mouth of the river Roe",
  Campbell: "crooked mouth",
  Payton: "fighting man's estate",
  Winter: "the winter season",
  Dream: "vision, aspiration",
  Tru: "true, honest",
  Quincy: "estate of the fifth son",
};

function getOrigins(name: string) {
  return originOverrides[name] || ["English"];
}

function getMeaning(name: string) {
  return meaningOverrides[name] || "modern gender-neutral name";
}

function getCountries(origins: string[]) {
  const countries = new Set<string>(["US"]);

  for (const origin of origins) {
    if (origin === "English") countries.add("GB");
    if (origin === "French") countries.add("FR");
    if (origin === "German") countries.add("DE");
    if (origin === "Hebrew") countries.add("IL");
    if (origin === "Irish") countries.add("IE");
    if (origin === "Scottish") countries.add("GB");
    if (origin === "Latin") countries.add("IT");
  }

  return [...countries];
}

function getStyles(name: string, origins: string[], popularity: number) {
  const styles = new Set<string>(["Modern", "Unisex"]);

  if (popularity >= 65) styles.add("Popular");
  if (popularity < 50) styles.add("Rare");

  if (name.length <= 5) styles.add("Short");

  if (
    ["Aspen", "Winter", "Navy", "Dream", "Journey"].includes(name)
  ) {
    styles.add("Nature");
  }

  if (
    ["Bailey", "Palmer", "Harlow", "Murphy", "Leighton", "Kendall", "Marley", "Monroe", "Campbell", "Payton"].includes(name)
  ) {
    styles.add("Surname");
  }

  if (origins.includes("French")) styles.add("French");
  if (origins.includes("Irish")) styles.add("Irish");
  if (origins.includes("Scottish")) styles.add("Scottish");
  if (origins.includes("Hebrew")) styles.add("Biblical");

  return [...styles].slice(0, 4);
}

function getTags(name: string, styles: string[], origins: string[]) {
  const tags = new Set<string>();

  for (const style of styles) {
    const tag = style.toLowerCase();

    if (tag !== "unisex") {
      tags.add(tag);
    }
  }

  if (name.length <= 5) tags.add("short");

  if (["Aspen", "Winter"].includes(name)) tags.add("nature");
  if (["Navy"].includes(name)) tags.add("color");
  if (["Dream"].includes(name)) tags.add("virtue");
  if (["Journey"].includes(name)) tags.add("adventurous");

  if (origins.includes("French")) tags.add("french");
  if (origins.includes("Irish")) tags.add("irish");
  if (origins.includes("Scottish")) tags.add("scottish");
  if (origins.includes("Hebrew")) tags.add("biblical");
  if (origins.includes("German")) tags.add("german");

  if (tags.size < 2) tags.add("modern");
  if (tags.size < 2) tags.add("unique");

  return [...tags].slice(0, 5);
}

const master = JSON.parse(fs.readFileSync(masterPath, "utf8")) as BabyName[];
const candidates = JSON.parse(
  fs.readFileSync(candidatesPath, "utf8")
) as UnisexCandidate[];

const existingIds = new Set(master.map((item) => item.id));
const existingNames = new Set(
  master.map((item) => `${item.name.toLowerCase()}-${item.gender}`)
);

const selected = candidates.slice(0, 150);

const additions: BabyName[] = selected
  .map((candidate) => {
    const origins = getOrigins(candidate.name);
    const popularity = estimatePopularity(candidate.totalCount);
    const styles = getStyles(candidate.name, origins, popularity);

    return {
      id: createId(candidate.name),
      name: candidate.name,
      gender: "unisex" as const,
      origins,
      countries: getCountries(origins),
      styles,
      meaning: getMeaning(candidate.name),
      popularity,
      syllables: estimateSyllables(candidate.name),
      variants: [],
      similar: [],
      tags: getTags(candidate.name, styles, origins),
    };
  })
  .filter((item) => {
    return (
      !existingIds.has(item.id) &&
      !existingNames.has(`${item.name.toLowerCase()}-${item.gender}`)
    );
  });

const updated = [...master, ...additions].sort((a, b) =>
  a.name.localeCompare(b.name)
);

fs.writeFileSync(masterPath, `${JSON.stringify(updated, null, 2)}\n`);

console.log(`Added ${additions.length} unisex names to master database.`);