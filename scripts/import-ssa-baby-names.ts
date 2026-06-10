import fs from "fs";
import path from "path";

import girls from "../data/baby-names/girls.json";
import boys from "../data/baby-names/boys.json";
import unisex from "../data/baby-names/unisex.json";

type SsaRow = {
  name: string;
  gender: "F" | "M";
  count: number;
};

type BabyName = {
  name: string;
};

function parseSsaFile(filePath: string): SsaRow[] {
  const content = fs.readFileSync(filePath, "utf8");

  return content
    .trim()
    .split("\n")
    .map((line) => {
      const [name, gender, count] = line.split(",");

      return {
        name,
        gender: gender as "F" | "M",
        count: Number(count),
      };
    });
}

const inputPath = path.join(
  "data",
  "baby-names",
  "sources",
  "ssa",
  "yob2025.txt"
);

if (!fs.existsSync(inputPath)) {
  console.error(`Missing SSA file: ${inputPath}`);
  process.exit(1);
}

const existingNames = new Set(
  [...(girls as BabyName[]), ...(boys as BabyName[]), ...(unisex as BabyName[])]
    .map((item) => item.name.toLowerCase())
);

const rows = parseSsaFile(inputPath);

const missingGirls = rows
  .filter((item) => item.gender === "F")
  .sort((a, b) => b.count - a.count)
  .filter((item) => !existingNames.has(item.name.toLowerCase()))
  .slice(0, 150);

const missingBoys = rows
  .filter((item) => item.gender === "M")
  .sort((a, b) => b.count - a.count)
  .filter((item) => !existingNames.has(item.name.toLowerCase()))
  .slice(0, 150);

console.log("\nMissing high-priority girl candidates:");
console.log(missingGirls.map((item) => item.name).join(", "));

console.log("\nMissing high-priority boy candidates:");
console.log(missingBoys.map((item) => item.name).join(", "));