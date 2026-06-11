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

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

alphabet.forEach((letter) => {
  babyNamePages.push(
    {
      slug: `girl-names-starting-with-${letter}`,
      title: `Girl Names Starting With ${letter.toUpperCase()}`,
      description: `Browse girl names starting with the letter ${letter.toUpperCase()} including meanings, origins and popularity.`,
      seoTitle: `Girl Names Starting With ${letter.toUpperCase()} | Toollane`,
      seoDescription: `Discover girl names beginning with ${letter.toUpperCase()} including classic, modern and unique baby name ideas.`,
      filter: (name) =>
        name.gender === "girl" &&
        name.name.toLowerCase().startsWith(letter),
    },
    {
      slug: `boy-names-starting-with-${letter}`,
      title: `Boy Names Starting With ${letter.toUpperCase()}`,
      description: `Browse boy names starting with the letter ${letter.toUpperCase()} including meanings, origins and popularity.`,
      seoTitle: `Boy Names Starting With ${letter.toUpperCase()} | Toollane`,
      seoDescription: `Discover boy names beginning with ${letter.toUpperCase()} including classic, modern and unique baby name ideas.`,
      filter: (name) =>
        name.gender === "boy" &&
        name.name.toLowerCase().startsWith(letter),
    },
    {
      slug: `unisex-names-starting-with-${letter}`,
      title: `Unisex Names Starting With ${letter.toUpperCase()}`,
      description: `Browse unisex names starting with the letter ${letter.toUpperCase()} including meanings, origins and popularity.`,
      seoTitle: `Unisex Names Starting With ${letter.toUpperCase()} | Toollane`,
      seoDescription: `Discover gender-neutral names beginning with ${letter.toUpperCase()} including modern and unique name ideas.`,
      filter: (name) =>
        name.gender === "unisex" &&
        name.name.toLowerCase().startsWith(letter),
    }
  );
});

const originPages = [
  "Arabic",
  "Celtic",
  "Chinese",
  "Danish",
  "Dutch",
  "English",
  "French",
  "German",
  "Greek",
  "Hawaiian",
  "Hebrew",
  "Indian",
  "Irish",
  "Italian",
  "Japanese",
  "Korean",
  "Latin",
  "Native American",
  "Nordic",
  "Persian",
  "Polish",
  "Portuguese",
  "Russian",
  "Sanskrit",
  "Scandinavian",
  "Scottish",
  "Slavic",
  "Spanish",
  "Turkish",
  "Welsh",
];

function createSlug(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

originPages.forEach((origin) => {
  const slug = createSlug(origin);

  babyNamePages.push({
    slug: `${slug}-baby-names`,
    title: `${origin} Baby Names`,
    description: `Browse ${origin} baby names including meanings, origins, styles and popularity.`,
    seoTitle: `${origin} Baby Names | Toollane`,
    seoDescription: `Discover ${origin} baby names for boys, girls and unisex name ideas. Explore meanings, origins, styles and popularity.`,
    filter: (name) => name.origins.includes(origin),
  });
});

const stylePages = [
  "Adventurous",
  "Ancient",
  "Biblical",
  "Bright",
  "Celtic",
  "Celestial",
  "Classic",
  "Color",
  "Elegant",
  "French",
  "Friendly",
  "Gemstone",
  "German",
  "International",
  "Irish",
  "Italian",
  "Modern",
  "Musical",
  "Mythological",
  "Nature",
  "Nordic",
  "Old Fashioned",
  "Old Money",
  "Peaceful",
  "Place",
  "Popular",
  "Rare",
  "Romantic",
  "Royal",
  "Scottish",
  "Seasonal",
  "Short",
  "Soft",
  "Spanish",
  "Strong",
  "Surname",
  "Unisex",
  "Vintage",
  "Virtue",
  "Welsh",
];

stylePages.forEach((style) => {
  const slug = createSlug(style);

  babyNamePages.push({
    slug: `${slug}-baby-name-ideas`,
    title: `${style} Baby Names`,
    description: `Browse ${style.toLowerCase()} baby names including meanings, origins, styles and popularity.`,
    seoTitle: `${style} Baby Names | Toollane`,
    seoDescription: `Discover ${style.toLowerCase()} baby names for boys, girls and unisex name ideas. Explore meanings, origins, styles and popularity.`,
    filter: (name) => name.styles.includes(style),
  });
});

const seoCollectionPages = [
  {
    slug: "popular-baby-names",
    title: "Popular Baby Names",
    description:
      "Browse popular baby names for girls, boys and unisex name ideas including meanings, origins and styles.",
    seoTitle: "Popular Baby Names | Toollane",
    seoDescription:
      "Discover popular baby names for girls, boys and unisex name ideas. Explore meanings, origins, styles and name inspiration.",
    filter: (name: BabyName) => name.popularity >= 75,
  },
  {
    slug: "rare-baby-names",
    title: "Rare Baby Names",
    description:
      "Browse rare and uncommon baby names with meanings, origins, styles and unique name ideas.",
    seoTitle: "Rare Baby Names | Toollane",
    seoDescription:
      "Find rare baby names for girls, boys and unisex name ideas. Explore uncommon names with meanings, origins and styles.",
    filter: (name: BabyName) => name.popularity < 50,
  },
  {
    slug: "short-baby-names",
    title: "Short Baby Names",
    description:
      "Browse short baby names that are simple, memorable and easy to pronounce.",
    seoTitle: "Short Baby Names | Toollane",
    seoDescription:
      "Discover short baby names for girls, boys and unisex name ideas. Find simple, modern and classic short names.",
    filter: (name: BabyName) => name.name.length <= 5,
  },
  {
    slug: "vintage-baby-names",
    title: "Vintage Baby Names",
    description:
      "Browse vintage baby names with timeless charm, classic style and meaningful origins.",
    seoTitle: "Vintage Baby Names | Toollane",
    seoDescription:
      "Find vintage baby names for girls, boys and unisex name ideas. Explore classic names with meanings and origins.",
    filter: (name: BabyName) =>
      name.styles.includes("Vintage") || name.tags.includes("vintage"),
  },
  {
    slug: "elegant-baby-names",
    title: "Elegant Baby Names",
    description:
      "Browse elegant baby names with refined style, beautiful meanings and international appeal.",
    seoTitle: "Elegant Baby Names | Toollane",
    seoDescription:
      "Discover elegant baby names for girls, boys and unisex name ideas. Explore refined names with meanings and origins.",
    filter: (name: BabyName) =>
      name.styles.includes("Elegant") || name.tags.includes("elegant"),
  },
  {
    slug: "biblical-baby-names",
    title: "Biblical Baby Names",
    description:
      "Browse biblical baby names with meaningful origins, traditional roots and timeless appeal.",
    seoTitle: "Biblical Baby Names | Toollane",
    seoDescription:
      "Find biblical baby names for boys, girls and unisex name ideas. Explore meanings, origins and classic name inspiration.",
    filter: (name: BabyName) =>
      name.styles.includes("Biblical") || name.tags.includes("biblical"),
  },
  {
    slug: "nature-baby-names",
    title: "Nature Baby Names",
    description:
      "Browse nature-inspired baby names connected to flowers, trees, seasons, water, earth and the sky.",
    seoTitle: "Nature Baby Names | Toollane",
    seoDescription:
      "Discover nature baby names for girls, boys and unisex name ideas. Explore flower names, tree names and nature-inspired meanings.",
    filter: (name: BabyName) =>
      name.styles.includes("Nature") || name.tags.includes("nature"),
  },
  {
    slug: "strong-baby-names",
    title: "Strong Baby Names",
    description:
      "Browse strong baby names with powerful meanings, confident sound and timeless character.",
    seoTitle: "Strong Baby Names | Toollane",
    seoDescription:
      "Find strong baby names for girls, boys and unisex name ideas. Explore powerful names with meanings, origins and styles.",
    filter: (name: BabyName) =>
      name.styles.includes("Strong") || name.tags.includes("strong"),
  },
  {
    slug: "royal-baby-names",
    title: "Royal Baby Names",
    description:
      "Browse royal baby names with classic elegance, noble style and historic charm.",
    seoTitle: "Royal Baby Names | Toollane",
    seoDescription:
      "Discover royal baby names for girls, boys and unisex name ideas. Explore noble, elegant and classic name inspiration.",
    filter: (name: BabyName) =>
      name.styles.includes("Royal") || name.tags.includes("royal"),
  },
  {
    slug: "old-money-baby-names",
    title: "Old Money Baby Names",
    description:
      "Browse old money baby names with classic, refined and timeless style.",
    seoTitle: "Old Money Baby Names | Toollane",
    seoDescription:
      "Find old money baby names for girls, boys and unisex name ideas. Explore refined, classic and elegant names.",
    filter: (name: BabyName) =>
      name.styles.includes("Old Money") || name.tags.includes("old money"),
  },
];

babyNamePages.push(...seoCollectionPages);

export function getBabyNamePage(slug: string) {
  return babyNamePages.find((page) => page.slug === slug);
}