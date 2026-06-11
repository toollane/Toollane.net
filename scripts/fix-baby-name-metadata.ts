import fs from "fs";
import path from "path";

import {
  babyNameStyles,
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

const allowedStyles = new Set<string>(babyNameStyles);
const allowedTags = new Set<string>(babyNameTags);

const master = JSON.parse(fs.readFileSync(masterPath, "utf8")) as BabyName[];

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function inferStyles(item: BabyName) {
  const styles = new Set<string>(
    item.styles.filter((style) => allowedStyles.has(style))
  );

  if (item.popularity >= 75) styles.add("Popular");
  if (item.popularity < 50) styles.add("Rare");
  if (item.name.length <= 5) styles.add("Short");

  if (item.origins.includes("Hebrew")) styles.add("Biblical");
  if (item.origins.includes("Greek")) styles.add("Classic");
  if (item.origins.includes("Latin")) styles.add("Classic");
  if (item.origins.includes("English")) styles.add("Modern");
  if (item.origins.includes("German")) styles.add("Classic");
  if (item.origins.includes("Spanish")) styles.add("Spanish");
  if (item.origins.includes("Portuguese")) styles.add("International");
  if (item.origins.includes("Arabic")) styles.add("International");
  if (item.origins.includes("Irish")) styles.add("Irish");
  if (item.origins.includes("Scottish")) styles.add("Scottish");
  if (item.origins.includes("Welsh")) styles.add("Welsh");
  if (item.origins.includes("Nordic")) styles.add("Nordic");
  if (item.origins.includes("French")) styles.add("French");
  if (item.origins.includes("Italian")) styles.add("Italian");

  const surnameLikeEndings = ["son", "ton", "er", "ley", "den", "ford"];
  if (surnameLikeEndings.some((ending) => item.name.toLowerCase().endsWith(ending))) {
    styles.add("Surname");
  }

  if (styles.size < 2) styles.add("Modern");
  if (styles.size < 2) styles.add("Classic");

  return [...styles].slice(0, 4);
}

function inferTags(item: BabyName, styles: string[]) {
  const tags = new Set<string>(
    item.tags.filter((tag) => allowedTags.has(tag))
  );

  for (const style of styles) {
    const tag = style.toLowerCase();

    if (allowedTags.has(tag)) {
      tags.add(tag);
    }
  }

  if (item.name.length <= 5) tags.add("short");
  if (item.popularity >= 75) tags.add("popular");
  if (item.popularity < 50) tags.add("rare");

  if (item.origins.includes("Hebrew")) tags.add("biblical");
  if (item.origins.includes("Irish")) tags.add("irish");
  if (item.origins.includes("Scottish")) tags.add("scottish");
  if (item.origins.includes("Welsh")) tags.add("welsh");
  if (item.origins.includes("Nordic")) tags.add("nordic");
  if (item.origins.includes("French")) tags.add("french");
  if (item.origins.includes("Italian")) tags.add("italian");
  if (item.origins.includes("Spanish")) tags.add("spanish");
  if (item.origins.includes("German")) tags.add("german");

  if (tags.size < 2) tags.add("modern");
  if (tags.size < 2) tags.add("classic");

  return [...tags].slice(0, 5);
}

const fixed = master.map((item) => {
  const styles = inferStyles(item);
  const tags = inferTags(item, styles);

  return {
    ...item,
    styles: unique(styles),
    tags: unique(tags),
  };
});

fs.writeFileSync(masterPath, `${JSON.stringify(fixed, null, 2)}\n`);

console.log(`Fixed styles and tags for ${fixed.length} baby names.`);