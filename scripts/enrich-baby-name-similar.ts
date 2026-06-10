import fs from "fs";
import path from "path";

const files = ["girls", "boys", "unisex"] as const;

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

function readJson(file: string): BabyName[] {
  return JSON.parse(fs.readFileSync(file, "utf8")) as BabyName[];
}

function writeJson(file: string, data: BabyName[]) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

const paths = files.map((file) =>
  path.join("data", "baby-names", `${file}.json`)
);

const allNames = paths.flatMap(readJson);

function overlap(a: string[], b: string[]) {
  return a.filter((item) => b.includes(item)).length;
}

function scoreName(base: BabyName, candidate: BabyName) {
  if (base.id === candidate.id) {
    return -999;
  }

  let score = 0;

  if (base.gender === candidate.gender) score += 5;

  score += overlap(base.origins, candidate.origins) * 4;
  score += overlap(base.styles, candidate.styles) * 3;
  score += overlap(base.tags, candidate.tags) * 2;
  score += overlap(base.countries, candidate.countries) * 1;

  score -= Math.abs(base.syllables - candidate.syllables);
  score -= Math.abs(base.popularity - candidate.popularity) / 25;

  return score;
}

function getSimilar(base: BabyName) {
  const usedDisplayNames = new Set<string>([base.name.toLowerCase()]);

  const result: string[] = [];

  const candidates = allNames
    .filter((candidate) => candidate.id !== base.id)
    .map((candidate) => ({
      candidate,
      score: scoreName(base, candidate),
    }))
    .sort((a, b) => b.score - a.score);

  for (const item of candidates) {
    const displayName = item.candidate.name.toLowerCase();

    if (usedDisplayNames.has(displayName)) {
      continue;
    }

    usedDisplayNames.add(displayName);
    result.push(item.candidate.name);

    if (result.length === 3) {
      break;
    }
  }

  return result;
}

for (const filePath of paths) {
  const names = readJson(filePath);

  const enriched = names.map((name) => ({
    ...name,
    similar: getSimilar(name),
  }));

  writeJson(filePath, enriched);

  console.log(`Updated similar names in ${filePath}`);
}