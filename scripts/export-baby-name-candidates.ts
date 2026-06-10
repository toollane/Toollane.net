import fs from "fs";
import path from "path";

import girls from "../data/baby-names/girls.json";
import boys from "../data/baby-names/boys.json";
import unisex from "../data/baby-names/unisex.json";

type BabyName = { name: string };

const existing = new Set(
  [...girls, ...boys, ...unisex].map((item) =>
    (item as BabyName).name.toLowerCase()
  )
);

const ssaPath = path.join(
  "data",
  "baby-names",
  "sources",
  "ssa",
  "yob2025.txt"
);

const rows = fs
  .readFileSync(ssaPath, "utf8")
  .trim()
  .split("\n")
  .map((line) => {
    const [name, gender, count] = line.split(",");

    return {
      name,
      gender,
      count: Number(count),
    };
  });

const missingGirls = rows
  .filter((item) => item.gender === "F")
  .filter((item) => !existing.has(item.name.toLowerCase()))
  .sort((a, b) => b.count - a.count)
  .slice(0, 350);

const missingBoys = rows
  .filter((item) => item.gender === "M")
  .filter((item) => !existing.has(item.name.toLowerCase()))
  .sort((a, b) => b.count - a.count)
  .slice(0, 400);

fs.writeFileSync(
  "data/baby-names/incoming/girl-candidates.json",
  `${JSON.stringify(missingGirls, null, 2)}\n`
);

fs.writeFileSync(
  "data/baby-names/incoming/boy-candidates.json",
  `${JSON.stringify(missingBoys, null, 2)}\n`
);

console.log("Exported girl and boy candidate lists.");