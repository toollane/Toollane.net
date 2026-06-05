import girls from "./girls.json";
import boys from "./boys.json";
import unisex from "./unisex.json";

export type BabyNameGender = "girl" | "boy" | "unisex";

export type BabyName = {
  id: string;
  name: string;
  gender: BabyNameGender;
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

export const babyNames = [...girls, ...boys, ...unisex] as BabyName[];

export function getBabyNamesByGender(gender: BabyNameGender) {
  return babyNames.filter((item) => item.gender === gender);
}

export function getBabyNameById(id: string) {
  return babyNames.find((item) => item.id === id);
}

export function getBabyNamesByOrigin(origin: string) {
  return babyNames.filter((item) =>
    item.origins.some(
      (value) => value.toLowerCase() === origin.toLowerCase()
    )
  );
}

export function getBabyNamesByStyle(style: string) {
  return babyNames.filter((item) =>
    item.styles.some(
      (value) => value.toLowerCase() === style.toLowerCase()
    )
  );
}

export function getPopularBabyNames(limit = 24) {
  return [...babyNames]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}