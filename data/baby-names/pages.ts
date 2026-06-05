import type { BabyName } from "@/data/baby-names";

export type BabyNamePage = {
  slug: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  filter: (name: BabyName) => boolean;
};

export const babyNamePages: BabyNamePage[] = [
  {
    slug: "girl",
    title: "Girl Names",
    description:
      "Explore beautiful girl names by origin, meaning, style and popularity.",
    seoTitle: "Girl Names - Beautiful Baby Girl Names | Toollane",
    seoDescription:
      "Explore beautiful baby girl names by origin, meaning, style and popularity. Find classic, modern, rare, vintage and elegant girl names.",
    filter: (name) => name.gender === "girl",
  },
  {
    slug: "boy",
    title: "Boy Names",
    description:
      "Explore strong boy names by origin, meaning, style and popularity.",
    seoTitle: "Boy Names - Strong Baby Boy Names | Toollane",
    seoDescription:
      "Explore baby boy names by origin, meaning, style and popularity. Find classic, modern, rare, strong and international boy names.",
    filter: (name) => name.gender === "boy",
  },
  {
    slug: "unisex",
    title: "Unisex Names",
    description:
      "Explore gender-neutral and unisex baby names by origin, meaning, style and popularity.",
    seoTitle: "Unisex Baby Names - Gender Neutral Names | Toollane",
    seoDescription:
      "Explore unisex baby names and gender-neutral names by origin, meaning, style and popularity. Find modern, rare and international name ideas.",
    filter: (name) => name.gender === "unisex",
  },
  {
    slug: "german",
    title: "German Baby Names",
    description:
      "Explore German baby names for boys, girls and unisex name ideas with meanings, origins and styles.",
    seoTitle: "German Baby Names - Boy, Girl & Unisex Names | Toollane",
    seoDescription:
      "Explore German baby names for boys, girls and unisex name ideas. Find classic, vintage, modern and meaningful German names.",
    filter: (name) => name.origins.includes("German"),
  },
  {
    slug: "french",
    title: "French Baby Names",
    description:
      "Explore French baby names for boys, girls and unisex name ideas with elegant sounds, meanings and origins.",
    seoTitle: "French Baby Names - Beautiful French Names | Toollane",
    seoDescription:
      "Explore French baby names for boys, girls and unisex name ideas. Find elegant, classic, rare and meaningful French names.",
    filter: (name) => name.origins.includes("French"),
  },
  {
    slug: "italian",
    title: "Italian Baby Names",
    description:
      "Explore Italian baby names with beautiful sounds, meanings, origins and timeless style.",
    seoTitle: "Italian Baby Names - Beautiful Italian Names | Toollane",
    seoDescription:
      "Explore Italian baby names for boys, girls and unisex name ideas. Find classic, elegant, rare and meaningful Italian names.",
    filter: (name) => name.origins.includes("Italian"),
  },
  {
    slug: "nordic",
    title: "Nordic Baby Names",
    description:
      "Explore Nordic baby names with Scandinavian roots, strong meanings and timeless style.",
    seoTitle: "Nordic Baby Names - Scandinavian Boy & Girl Names | Toollane",
    seoDescription:
      "Explore Nordic baby names and Scandinavian name ideas for boys, girls and unisex names with meanings, origins and styles.",
    filter: (name) =>
      name.origins.includes("Nordic") ||
      name.origins.includes("Norwegian") ||
      name.origins.includes("Swedish") ||
      name.origins.includes("Danish"),
  },
  {
    slug: "hebrew",
    title: "Hebrew Baby Names",
    description:
      "Explore Hebrew baby names with biblical roots, meaningful origins and timeless style.",
    seoTitle: "Hebrew Baby Names - Biblical Hebrew Names | Toollane",
    seoDescription:
      "Explore Hebrew baby names for boys, girls and unisex name ideas. Find biblical, classic and meaningful Hebrew names.",
    filter: (name) => name.origins.includes("Hebrew"),
  },
  {
    slug: "greek",
    title: "Greek Baby Names",
    description:
      "Explore Greek baby names with mythological roots, classic style and meaningful origins.",
    seoTitle: "Greek Baby Names - Classic Greek Names | Toollane",
    seoDescription:
      "Explore Greek baby names for boys, girls and unisex name ideas with meanings, origins and timeless style.",
    filter: (name) => name.origins.includes("Greek"),
  },
  {
    slug: "vintage",
    title: "Vintage Baby Names",
    description:
      "Explore vintage baby names with classic charm, timeless style and meaningful origins.",
    seoTitle: "Vintage Baby Names - Classic Old Fashioned Names | Toollane",
    seoDescription:
      "Explore vintage baby names with classic charm, old fashioned style, meanings and origins for boys, girls and unisex names.",
    filter: (name) =>
      name.styles.includes("Vintage") ||
      name.styles.includes("Old Fashioned") ||
      name.tags.includes("vintage"),
  },
  {
    slug: "rare",
    title: "Rare Baby Names",
    description:
      "Explore rare and uncommon baby names with distinctive meanings, origins and styles.",
    seoTitle: "Rare Baby Names - Unique & Uncommon Names | Toollane",
    seoDescription:
      "Explore rare baby names and uncommon name ideas for boys, girls and unisex names with meanings, origins and styles.",
    filter: (name) =>
      name.popularity < 50 ||
      name.styles.includes("Rare") ||
      name.tags.includes("rare"),
  },
  {
    slug: "elegant",
    title: "Elegant Baby Names",
    description:
      "Explore elegant baby names with beautiful sounds, timeless appeal and meaningful origins.",
    seoTitle: "Elegant Baby Names - Beautiful & Timeless Names | Toollane",
    seoDescription:
      "Explore elegant baby names for boys, girls and unisex names. Find beautiful, timeless and meaningful baby name ideas.",
    filter: (name) =>
      name.styles.includes("Elegant") || name.tags.includes("elegant"),
  },
  {
    slug: "short",
    title: "Short Baby Names",
    description:
      "Explore short baby names that are simple, memorable and easy to pronounce.",
    seoTitle: "Short Baby Names - Simple Boy & Girl Names | Toollane",
    seoDescription:
      "Explore short baby names for boys, girls and unisex names. Find simple, modern and memorable name ideas.",
    filter: (name) =>
      name.styles.includes("Short") ||
      name.tags.includes("short") ||
      name.name.length <= 4,
  },
  {
    slug: "strong",
    title: "Strong Baby Names",
    description:
      "Explore strong baby names with powerful meanings, bold sounds and timeless style.",
    seoTitle: "Strong Baby Names - Powerful Boy & Girl Names | Toollane",
    seoDescription:
      "Explore strong baby names for boys, girls and unisex names with powerful meanings, bold sounds and origins.",
    filter: (name) =>
      name.styles.includes("Strong") || name.tags.includes("strong"),
  },
  {
    slug: "classic",
    title: "Classic Baby Names",
    description:
      "Explore classic baby names with timeless appeal, familiar sounds and meaningful origins.",
    seoTitle: "Classic Baby Names - Timeless Boy & Girl Names | Toollane",
    seoDescription:
      "Explore classic baby names for boys, girls and unisex names. Find timeless, popular and meaningful name ideas.",
    filter: (name) =>
      name.styles.includes("Classic") || name.tags.includes("classic"),
  },
  {
    slug: "modern",
    title: "Modern Baby Names",
    description:
      "Explore modern baby names with fresh sounds, international style and meaningful origins.",
    seoTitle: "Modern Baby Names - Fresh Boy & Girl Names | Toollane",
    seoDescription:
      "Explore modern baby names for boys, girls and unisex names. Find fresh, stylish and meaningful name ideas.",
    filter: (name) =>
      name.styles.includes("Modern") || name.tags.includes("modern"),
  },
  {
    slug: "old-money",
    title: "Old Money Baby Names",
    description:
      "Explore old money baby names with elegant, classic and timeless character.",
    seoTitle: "Old Money Baby Names - Elegant Classic Names | Toollane",
    seoDescription:
      "Explore old money baby names for boys, girls and unisex names. Find elegant, classic and timeless name ideas.",
    filter: (name) =>
      name.styles.includes("Old Money") ||
      name.tags.includes("old money") ||
      name.tags.includes("royal"),
  },
  {
    slug: "nature",
    title: "Nature Baby Names",
    description:
      "Explore nature baby names inspired by the earth, sky, flowers, seasons and natural beauty.",
    seoTitle: "Nature Baby Names - Beautiful Nature-Inspired Names | Toollane",
    seoDescription:
      "Explore nature baby names for boys, girls and unisex names inspired by plants, seasons, sky, water and natural beauty.",
    filter: (name) =>
      name.styles.includes("Nature") || name.tags.includes("nature"),
  },
  {
    slug: "royal",
    title: "Royal Baby Names",
    description:
      "Explore royal baby names with elegant, classic and noble style.",
    seoTitle: "Royal Baby Names - Elegant Noble Names | Toollane",
    seoDescription:
      "Explore royal baby names for boys, girls and unisex names. Find elegant, noble and classic name ideas.",
    filter: (name) =>
      name.styles.includes("Royal") || name.tags.includes("royal"),
  },
  {
    slug: "biblical",
    title: "Biblical Baby Names",
    description:
      "Explore biblical baby names with spiritual meaning, timeless roots and classic style.",
    seoTitle: "Biblical Baby Names - Meaningful Biblical Names | Toollane",
    seoDescription:
      "Explore biblical baby names for boys, girls and unisex names with meaningful roots, origins and timeless style.",
    filter: (name) =>
      name.styles.includes("Biblical") || name.tags.includes("biblical"),
  },
];

export function getBabyNamePage(slug: string) {
  return babyNamePages.find((page) => page.slug === slug);
}