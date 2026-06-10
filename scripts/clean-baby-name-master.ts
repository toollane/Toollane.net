import fs from "fs";
import path from "path";

import {
  babyNameOrigins,
  babyNameTags,
} from "../data/baby-names/taxonomy";

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

const allowedOrigins = new Set<string>(babyNameOrigins);
const allowedTags = new Set<string>(babyNameTags);

const master = JSON.parse(fs.readFileSync(masterPath, "utf8")) as BabyName[];

const cleaned = master.map((item) => {
  const origins =
    item.id === "thomas"
      ? item.origins.filter((origin) => origin !== "Aramaic")
      : item.origins;

  return {
    ...item,
    origins: origins.filter((origin) => allowedOrigins.has(origin)),
    tags: item.tags.filter((tag) => allowedTags.has(tag)),
  };
});

fs.writeFileSync(masterPath, `${JSON.stringify(cleaned, null, 2)}\n`);

console.log(`Cleaned baby name master database: ${cleaned.length} names`);