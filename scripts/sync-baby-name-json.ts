import fs from "fs";
import path from "path";

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

const outputDir = path.join("data", "baby-names");

const master = JSON.parse(fs.readFileSync(masterPath, "utf8")) as BabyName[];

const groups = {
  girls: master.filter((item) => item.gender === "girl"),
  boys: master.filter((item) => item.gender === "boy"),
  unisex: master.filter((item) => item.gender === "unisex"),
};

for (const [fileName, data] of Object.entries(groups)) {
  const filePath = path.join(outputDir, `${fileName}.json`);

  fs.writeFileSync(
    filePath,
    `${JSON.stringify(
      data.sort((a, b) => a.name.localeCompare(b.name)),
      null,
      2
    )}\n`
  );

  console.log(`${fileName}.json synced: ${data.length} names`);
}