import fs from "fs";
import path from "path";

const groups = ["girls", "boys", "unisex"] as const;

type Group = (typeof groups)[number];

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

function readJson(filePath: string): BabyName[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8")) as BabyName[];
}

function writeJson(filePath: string, data: BabyName[]) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

for (const group of groups) {
  const currentPath = path.join("data", "baby-names", `${group}.json`);
  const incomingPath = path.join(
    "data",
    "baby-names",
    "incoming",
    `${group}.final.json`
  );

  const current = readJson(currentPath);
  const incoming = readJson(incomingPath);

  const byId = new Map<string, BabyName>();

  for (const item of [...current, ...incoming]) {
    byId.set(item.id, item);
  }

  const merged = [...byId.values()].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  writeJson(currentPath, merged);

  console.log(`${group}: ${current.length} + ${incoming.length} → ${merged.length}`);
}