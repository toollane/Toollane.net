import fs from "fs";
import path from "path";

type GirlCandidate = {
  name: string;
  gender: "F";
  count: number;
};

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

const candidatesPath = path.join(
  "data",
  "baby-names",
  "incoming",
  "girl-candidates.json"
);

function createId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function estimatePopularity(count: number) {
  if (count >= 8000) return 90;
  if (count >= 6000) return 85;
  if (count >= 4000) return 80;
  if (count >= 2500) return 75;
  if (count >= 1000) return 65;
  if (count >= 500) return 55;
  return 45;
}

function estimateSyllables(name: string) {
  const clean = name.toLowerCase().replace(/e$/, "");
  const groups = clean.match(/[aeiouy]+/g);
  return Math.max(1, Math.min(groups?.length || 1, 5));
}

const originOverrides: Record<string, string[]> = {
  Evelyn: ["English"],
  Eliana: ["Hebrew", "Latin"],
  Camila: ["Latin", "Spanish"],
  Ellie: ["Greek", "English"],
  Lucy: ["Latin", "English"],
  Isla: ["Scottish"],
  Lainey: ["English"],
  Gianna: ["Hebrew", "Italian"],
  Emily: ["Latin", "English"],
  Layla: ["Arabic"],
  Madison: ["English"],
  Eloise: ["French", "German"],
  Sadie: ["Hebrew", "English"],
  Delilah: ["Hebrew"],
  Lillian: ["Latin", "English"],
  Leah: ["Hebrew"],
  Adeline: ["German", "French"],
  Leilani: ["Hawaiian"],
  Claire: ["French", "Latin"],
  Zoey: ["Greek"],
  Madelyn: ["Hebrew", "English"],
  Vivian: ["Latin"],
  Millie: ["Latin", "English"],
  Emery: ["German", "English"],
  Maeve: ["Irish"],
  Ayla: ["Turkish", "Hebrew"],
  Liliana: ["Latin", "Italian"],
  Melody: ["Greek", "English"],
  Lyla: ["Arabic", "English"],
  Madeline: ["Hebrew", "French"],
  Josie: ["Hebrew", "English"],
  Addison: ["English"],
  Kennedy: ["Irish"],
  Audrey: ["English"],
  Maria: ["Hebrew", "Latin"],
  Natalie: ["Latin", "French"],
  Everly: ["English"],
  Lydia: ["Greek"],
  Caroline: ["German", "French"],
  Amara: ["Latin", "African"],
  Georgia: ["Greek", "English"],
  Juniper: ["Latin", "English"],
  Aaliyah: ["Arabic"],
  Allison: ["German", "English"],
  Hailey: ["English"],
  Gabriella: ["Hebrew", "Italian"],
  Anna: ["Hebrew", "Latin"],
  Catalina: ["Greek", "Spanish"],
  Margaret: ["Greek", "English"],
  Cora: ["Greek"],
  Eliza: ["Hebrew", "English"],
  Brooklyn: ["English"],
  Hallie: ["English"],
  Hadley: ["English"],
  Elsie: ["Hebrew", "Scottish"],
  Magnolia: ["Latin", "English"],
  Mary: ["Hebrew", "English"],
  Valerie: ["Latin", "French"],
  Serenity: ["English"],
  Alina: ["Slavic", "Greek"],
  Julia: ["Latin"],
  Amira: ["Arabic", "Hebrew"],
  Savannah: ["Spanish", "English"],
  Bella: ["Italian", "Latin"],
  Alana: ["Irish", "Hawaiian"],
  Sloane: ["Irish"],
  Melanie: ["Greek"],
  Natalia: ["Latin"],
  Aubrey: ["German", "French"],
  Evangeline: ["Greek"],
  June: ["Latin", "English"],
  Samantha: ["Hebrew", "English"],
  Ember: ["English"],
  Piper: ["English"],
  Arya: ["Sanskrit", "Persian"],
  Blair: ["Scottish"],
  Gemma: ["Latin", "Italian"],
  Rosalie: ["Latin", "French"],
  Vivienne: ["Latin", "French"],
  Ruth: ["Hebrew"],
  Ariella: ["Hebrew"],
  Isabel: ["Hebrew", "Spanish"],
  Lilah: ["Arabic", "English"],
  Amaya: ["Japanese", "Spanish"],
  Ximena: ["Spanish"],
  Katherine: ["Greek"],
  Celeste: ["Latin"],
  Haven: ["English"],
  Kaia: ["Hawaiian", "Greek"],
  Molly: ["Hebrew", "Irish"],
  Olive: ["Latin", "English"],
  Sara: ["Hebrew"],
  Lia: ["Hebrew", "Italian"],
  Mabel: ["Latin", "English"],
  Vera: ["Latin", "Slavic"],
  Jasmine: ["Persian", "English"],
  Zara: ["Arabic", "Hebrew"],
  Dahlia: ["Swedish", "Hebrew"],
  Selah: ["Hebrew"],
  Jane: ["Hebrew", "English"],
  Brianna: ["Irish"],
  Maisie: ["Scottish"],
  Arianna: ["Greek", "Italian"],
  Andrea: ["Greek"],
  Nyla: ["Arabic", "English"],
};

const meaningOverrides: Record<string, string> = {
  Evelyn: "desired, wished for",
  Eliana: "my God has answered",
  Camila: "young ceremonial attendant",
  Ellie: "bright shining one",
  Lucy: "light",
  Isla: "island",
  Lainey: "bright, shining light",
  Gianna: "God is gracious",
  Emily: "rival, eager",
  Layla: "night",
  Madison: "son of Matthew",
  Eloise: "healthy, wide",
  Sadie: "princess",
  Delilah: "delicate",
  Lillian: "lily flower",
  Leah: "weary, delicate",
  Adeline: "noble",
  Leilani: "heavenly flower",
  Claire: "clear, bright",
  Zoey: "life",
  Madelyn: "woman from Magdala",
  Vivian: "alive",
  Millie: "gentle strength",
  Emery: "brave, powerful",
  Maeve: "she who intoxicates",
  Ayla: "moonlight, oak tree",
  Liliana: "lily",
  Melody: "song, music",
  Lyla: "night",
  Madeline: "woman from Magdala",
  Josie: "God will add",
  Addison: "child of Adam",
  Kennedy: "helmeted chief",
  Audrey: "noble strength",
  Maria: "beloved, wished-for child",
  Natalie: "birth of the Lord",
  Everly: "wild boar in woodland clearing",
  Lydia: "woman from Lydia",
  Caroline: "free woman",
  Amara: "grace, eternal",
  Georgia: "farmer, earth worker",
  Juniper: "juniper tree",
  Aaliyah: "exalted, high",
  Allison: "noble",
  Hailey: "hay meadow",
  Gabriella: "God is my strength",
  Anna: "grace",
  Catalina: "pure",
  Margaret: "pearl",
  Cora: "maiden",
  Eliza: "pledged to God",
  Brooklyn: "broken land, stream",
  Hallie: "dweller at the hall meadow",
  Hadley: "heather field",
  Elsie: "pledged to God",
  Magnolia: "magnolia flower",
  Mary: "beloved, wished-for child",
  Valerie: "strong, healthy",
  Serenity: "peaceful calm",
  Alina: "bright, beautiful",
  Julia: "youthful",
  Amira: "princess, commander",
  Savannah: "open plain",
  Bella: "beautiful",
  Alana: "harmony, precious",
  Sloane: "raider, warrior",
  Melanie: "dark, black",
  Natalia: "birthday of the Lord",
  Aubrey: "elf ruler",
  Evangeline: "bearer of good news",
  June: "young, named for Juno",
  Samantha: "listener, God has heard",
  Ember: "glowing coal",
  Piper: "flute player",
  Arya: "noble, honorable",
  Blair: "plain, field",
  Gemma: "gem, precious stone",
  Rosalie: "rose",
  Vivienne: "alive",
  Ruth: "friend, companion",
  Ariella: "lion of God",
  Isabel: "pledged to God",
  Lilah: "night, beauty",
  Amaya: "night rain",
  Ximena: "listener",
  Katherine: "pure",
  Celeste: "heavenly",
  Haven: "safe place",
  Kaia: "sea, earth",
  Molly: "beloved",
  Olive: "olive tree",
  Sara: "princess",
  Lia: "bearer of good news",
  Mabel: "lovable",
  Vera: "faith, truth",
  Jasmine: "jasmine flower",
  Zara: "princess, blooming flower",
  Dahlia: "dahlia flower",
  Selah: "pause, reflection",
  Jane: "God is gracious",
  Brianna: "noble, strong",
  Maisie: "pearl",
  Arianna: "most holy",
  Andrea: "strong, brave",
  Nyla: "winner, successful",
};

function getOrigins(name: string) {
  return originOverrides[name] || ["English"];
}

function getMeaning(name: string) {
  return meaningOverrides[name] || "beautiful name with modern usage";
}

function getCountries(origins: string[]) {
  const countries = new Set<string>(["US"]);

  for (const origin of origins) {
    if (origin === "English") countries.add("GB");
    if (origin === "French") countries.add("FR");
    if (origin === "German") countries.add("DE");
    if (origin === "Hebrew") countries.add("IL");
    if (origin === "Irish") countries.add("IE");
    if (origin === "Italian") countries.add("IT");
    if (origin === "Spanish") countries.add("ES");
    if (origin === "Arabic") countries.add("AE");
    if (origin === "Greek") countries.add("GR");
    if (origin === "Latin") countries.add("IT");
    if (origin === "Scottish") countries.add("GB");
    if (origin === "Hawaiian") countries.add("US");
    if (origin === "Japanese") countries.add("JP");
    if (origin === "Slavic") countries.add("PL");
    if (origin === "Persian") countries.add("IR");
    if (origin === "Turkish") countries.add("TR");
  }

  return [...countries];
}

function getStyles(name: string, origins: string[], popularity: number) {
  const styles = new Set<string>(["Modern"]);

  if (popularity >= 75) styles.add("Popular");
  if (popularity < 50) styles.add("Rare");
  if (name.length <= 5) styles.add("Short");

  if (origins.includes("Hebrew")) styles.add("Biblical");
  if (origins.includes("French")) styles.add("French");
  if (origins.includes("Italian")) styles.add("Italian");
  if (origins.includes("Spanish")) styles.add("Spanish");
  if (origins.includes("Irish")) styles.add("Irish");
  if (origins.includes("Scottish")) styles.add("Scottish");

  if (
    [
      "Evelyn",
      "Emily",
      "Lucy",
      "Lillian",
      "Claire",
      "Vivian",
      "Audrey",
      "Maria",
      "Natalie",
      "Caroline",
      "Margaret",
      "Anna",
      "Julia",
      "Jane",
      "Katherine",
      "Sara",
    ].includes(name)
  ) {
    styles.add("Classic");
  }

  if (
    [
      "Juniper",
      "Magnolia",
      "Ember",
      "Olive",
      "Dahlia",
      "Jasmine",
      "Savannah",
      "Haven",
    ].includes(name)
  ) {
    styles.add("Nature");
  }

  if (["Melody", "Piper"].includes(name)) {
    styles.add("Musical");
  }

  if (["Gemma"].includes(name)) {
    styles.add("Gemstone");
  }

  if (["Celeste"].includes(name)) {
    styles.add("Celestial");
  }

  if (styles.size < 2) styles.add("Elegant");

  return [...styles].slice(0, 4);
}

function getTags(name: string, styles: string[], origins: string[]) {
  const tags = new Set<string>();

  for (const style of styles) {
    tags.add(style.toLowerCase());
  }

  if (name.length <= 5) tags.add("short");
  if (origins.includes("Hebrew")) tags.add("biblical");
  if (origins.includes("French")) tags.add("french");
  if (origins.includes("Italian")) tags.add("italian");
  if (origins.includes("Spanish")) tags.add("spanish");
  if (origins.includes("Irish")) tags.add("irish");
  if (origins.includes("Scottish")) tags.add("scottish");

  if (["Juniper", "Magnolia", "Olive", "Dahlia", "Jasmine"].includes(name)) {
    tags.add("flower");
    tags.add("nature");
  }

  if (["Ember"].includes(name)) tags.add("fire");
  if (["Gemma"].includes(name)) tags.add("gemstone");
  if (["Celeste"].includes(name)) tags.add("celestial");
  if (["Serenity", "Selah"].includes(name)) tags.add("peaceful");

  if (tags.size < 2) tags.add("elegant");
  if (tags.size < 2) tags.add("modern");

  return [...tags].slice(0, 5);
}

const master = JSON.parse(fs.readFileSync(masterPath, "utf8")) as BabyName[];
const candidates = JSON.parse(
  fs.readFileSync(candidatesPath, "utf8")
) as GirlCandidate[];

const existingIds = new Set(master.map((item) => item.id));
const existingNames = new Set(
  master.map((item) => `${item.name.toLowerCase()}-${item.gender}`)
);

const selected = candidates.slice(0, 300);

const additions: BabyName[] = selected
  .map((candidate) => {
    const origins = getOrigins(candidate.name);
    const popularity = estimatePopularity(candidate.count);
    const styles = getStyles(candidate.name, origins, popularity);

    return {
      id: createId(candidate.name),
      name: candidate.name,
      gender: "girl" as const,
      origins,
      countries: getCountries(origins),
      styles,
      meaning: getMeaning(candidate.name),
      popularity,
      syllables: estimateSyllables(candidate.name),
      variants: [],
      similar: [],
      tags: getTags(candidate.name, styles, origins),
    };
  })
  .filter((item) => {
    return (
      !existingIds.has(item.id) &&
      !existingNames.has(`${item.name.toLowerCase()}-${item.gender}`)
    );
  });

const updated = [...master, ...additions].sort((a, b) =>
  a.name.localeCompare(b.name)
);

fs.writeFileSync(masterPath, `${JSON.stringify(updated, null, 2)}\n`);

console.log(`Added ${additions.length} girl names to master database.`);