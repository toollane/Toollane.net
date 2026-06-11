import fs from "fs";
import path from "path";

import girls from "../data/baby-names/girls.json";
import boys from "../data/baby-names/boys.json";
import unisex from "../data/baby-names/unisex.json";

type BabyName = {
  name: string;
};

const ssaPath = path.join(
  "data",
  "baby-names",
  "sources",
  "ssa",
  "yob2025.txt"
);

const existing = new Set(
  [...girls, ...boys, ...unisex].map((item) =>
    (item as BabyName).name.toLowerCase()
  )
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

const grouped = new Map<
  string,
  {
    name: string;
    femaleCount: number;
    maleCount: number;
    totalCount: number;
  }
>();

for (const row of rows) {
  const key = row.name.toLowerCase();

  const current =
    grouped.get(key) || {
      name: row.name,
      femaleCount: 0,
      maleCount: 0,
      totalCount: 0,
    };

  if (row.gender === "F") {
    current.femaleCount += row.count;
  }

  if (row.gender === "M") {
    current.maleCount += row.count;
  }

  current.totalCount += row.count;

  grouped.set(key, current);
}

const candidates = [...grouped.values()]
  .filter((item) => item.femaleCount > 0 && item.maleCount > 0)
  .filter((item) => !existing.has(item.name.toLowerCase()))
  .filter((item) => item.totalCount >= 100)
  .map((item) => {
    const smaller = Math.min(item.femaleCount, item.maleCount);
    const larger = Math.max(item.femaleCount, item.maleCount);
    const balance = smaller / larger;

    return {
      ...item,
      balance,
    };
  })
  .filter((item) => item.balance >= 0.08)
  .sort((a, b) => b.totalCount - a.totalCount)
  .slice(0, 250);

fs.writeFileSync(
  "data/baby-names/incoming/unisex-candidates.json",
  `${JSON.stringify(candidates, null, 2)}\n`
);

console.log(`Exported ${candidates.length} unisex candidates.`);
console.log(candidates.slice(0, 30));