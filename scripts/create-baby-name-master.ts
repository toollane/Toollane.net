import fs from "fs";
import path from "path";

import girls from "../data/baby-names/girls.json";
import boys from "../data/baby-names/boys.json";
import unisex from "../data/baby-names/unisex.json";

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

const outputDir = path.join("data", "baby-names", "database");
const outputPath = path.join(outputDir, "baby-names.master.json");

fs.mkdirSync(outputDir, { recursive: true });

const master = [
  ...(girls as BabyName[]),
  ...(boys as BabyName[]),
  ...(unisex as BabyName[]),
].sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync(outputPath, `${JSON.stringify(master, null, 2)}\n`);

console.log(`Created master database with ${master.length} names.`);