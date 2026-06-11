import fs from "fs";
import path from "path";

type SsaCandidate = {
  name: string;
  gender: "F" | "M";
  count: number;
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

const boyCandidatesPath = path.join(
  "data",
  "baby-names",
  "incoming",
  "boy-candidates.json"
);

function createId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function estimatePopularity(count: number) {
  if (count >= 8000) return 90;
  if (count >= 6000) return 85;
  if (count >= 4000) return 80;
  if (count >= 2500) return 75;
  if (count >= 1000) return 65;
  if (count >= 500) return 55;
  return 45;
}

function estimateSyllables(name: string) {
  const clean = name.toLowerCase().replace(/e$/, "");
  const groups = clean.match(/[aeiouy]+/g);
  return Math.max(1, Math.min(groups?.length || 1, 5));
}

const originOverrides: Record<string, string[]> = {
  Jack: ["English"],
  Hudson: ["English"],
  Michael: ["Hebrew"],
  John: ["Hebrew", "English"],
  Cooper: ["English"],
  Matthew: ["Hebrew"],
  Luke: ["Greek", "Latin"],
  Thomas: ["Greek", "Hebrew"],
  Bennett: ["Latin", "English"],
  Miles: ["Latin", "English"],
  Carter: ["English"],
  Anthony: ["Latin"],
  Charles: ["German", "English"],
  Maverick: ["English"],
  Thiago: ["Spanish", "Portuguese"],
  Grayson: ["English"],
  Wesley: ["English"],
  Josiah: ["Hebrew"],
  Weston: ["English"],
  Waylon: ["English"],
};

const meaningOverrides: Record<string, string> = {
  Jack: "God is gracious",
  Hudson: "son of Hugh",
  Michael: "who is like God?",
  John: "God is gracious",
  Cooper: "barrel maker",
  Matthew: "gift of God",
  Luke: "light-giving, man from Lucania",
  Thomas: "twin",
  Bennett: "blessed",
  Miles: "soldier, merciful",
  Carter: "cart driver",
  Anthony: "priceless, highly praiseworthy",
  Charles: "free man",
  Maverick: "independent, nonconformist",
  Thiago: "supplanter",
  Grayson: "son of the steward",
  Wesley: "western meadow",
  Josiah: "God supports, God heals",
  Weston: "western town",
  Waylon: "land beside the road",
};

function getOrigins(name: string) {
  return originOverrides[name] || ["English"];
}

function getMeaning(name: string) {
  return meaningOverrides[name] || "name with historic and modern usage";
}

function getCountries(origins: string[]) {
  const countries = new Set<string>();

  for (const origin of origins) {
    if (origin === "English") ["US", "GB"].forEach((item) => countries.add(item));
    if (origin === "Hebrew") ["US", "GB", "IL"].forEach((item) => countries.add(item));
    if (origin === "Greek") ["US", "GB", "GR"].forEach((item) => countries.add(item));
    if (origin === "Latin") ["US", "GB", "IT"].forEach((item) => countries.add(item));
    if (origin === "German") ["DE", "US", "GB"].forEach((item) => countries.add(item));
    if (origin === "Spanish") ["ES", "US", "MX"].forEach((item) => countries.add(item));
    if (origin === "Portuguese") ["PT", "BR", "US"].forEach((item) => countries.add(item));
  }

  return countries.size ? [...countries] : ["US"];
}

function getStyles(name: string, origins: string[], popularity: number) {
  const styles = new Set<string>(["Modern"]);

  if (popularity >= 75) styles.add("Popular");
  if (origins.includes("Hebrew")) styles.add("Biblical");
  if (["Michael", "John", "Matthew", "Luke", "Thomas", "Anthony", "Charles"].includes(name)) {
    styles.add("Classic");
  }
  if (["Maverick", "Cooper", "Carter", "Hudson", "Grayson", "Weston", "Waylon"].includes(name)) {
    styles.add("Surname");
  }
  if (["Jack", "Luke", "John", "Miles"].includes(name)) {
    styles.add("Short");
  }
  if (["Charles", "Michael", "Anthony", "Thomas"].includes(name)) {
    styles.add("Strong");
  }

  const result = [...styles];

if (result.length < 2) {
  result.push("Classic");
}

return result.slice(0, 4);
}

const allowedOriginTags = new Set([
  "french",
  "german",
  "irish",
  "italian",
  "nordic",
  "scottish",
  "spanish",
  "welsh",
]);

function getTags(styles: string[], origins: string[]) {
  const tags = new Set<string>();

  for (const style of styles) {
    tags.add(style.toLowerCase());
  }

  for (const origin of origins) {
    const originTag = origin.toLowerCase();

    if (allowedOriginTags.has(originTag)) {
      tags.add(originTag);
    }
  }

const result = [...tags];

if (result.length < 2) {
  result.push("classic");
}

return result.slice(0, 5);
}

const master = JSON.parse(fs.readFileSync(masterPath, "utf8")) as BabyName[];
const candidates = JSON.parse(
  fs.readFileSync(boyCandidatesPath, "utf8")
) as SsaCandidate[];

const existingIds = new Set(master.map((item) => item.id));
const existingNames = new Set(
  master.map((item) => `${item.name.toLowerCase()}-${item.gender}`)
);

const selected = candidates.slice(0, 400);

const additions: BabyName[] = selected
  .map((candidate) => {
    const origins = getOrigins(candidate.name);
    const popularity = estimatePopularity(candidate.count);
    const styles = getStyles(candidate.name, origins, popularity);

    return {
      id: createId(candidate.name),
      name: candidate.name,
      gender: "boy" as const,
      origins,
      countries: getCountries(origins),
      styles,
      meaning: getMeaning(candidate.name),
      popularity,
      syllables: estimateSyllables(candidate.name),
      variants: [],
      similar: [],
      tags: getTags(styles, origins),
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

console.log(`Added ${additions.length} boy names to master database.`);