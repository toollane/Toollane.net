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
  tags: string[];
};

const allNames = [
  ...(girls as BabyName[]),
  ...(boys as BabyName[]),
  ...(unisex as BabyName[]),
];

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function printTop(title: string, counts: Record<string, number>) {
  console.log(`\n${title}`);
  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
}

const genderCounts = countBy(allNames.map((item) => item.gender));
const originCounts = countBy(allNames.flatMap((item) => item.origins));
const styleCounts = countBy(allNames.flatMap((item) => item.styles));
const tagCounts = countBy(allNames.flatMap((item) => item.tags));
const letterCounts = countBy(
  allNames.map((item) => item.name[0]?.toUpperCase() || "?")
);

console.log("\nBaby Name Database Audit");
console.log("========================");

printTop("Gender counts", genderCounts);
printTop("Starting letters", letterCounts);
printTop("Origins", originCounts);
printTop("Styles", styleCounts);
printTop("Tags", tagCounts);

console.log("\nTotal names:", allNames.length);