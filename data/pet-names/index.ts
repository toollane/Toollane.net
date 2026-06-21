export type PetSpecies =
  | "dog"
  | "cat"
  | "horse"
  | "rabbit"
  | "bird"
  | "hamster"
  | "fish"
  | "other";

export type PetGender = "male" | "female" | "neutral";

export type PetStyle =
  | "cute"
  | "funny"
  | "unique"
  | "classic"
  | "elegant"
  | "strong"
  | "nature"
  | "food"
  | "mythology"
  | "short";

export type PetPopularity = "popular" | "balanced" | "rare";

export type PetName = {
  name: string;
  species: PetSpecies[];
  gender: PetGender[];
  styles: PetStyle[];
  popularity: PetPopularity;
  source: "starter-curated" | "open-data";
};

export type PetBreedPreset = {
  id: string;
  label: string;
  species: PetSpecies;
  description: string;
  styles: PetStyle[];
};

export const petSpeciesOptions: { value: PetSpecies; label: string }[] = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "horse", label: "Horse" },
  { value: "rabbit", label: "Rabbit" },
  { value: "bird", label: "Bird" },
  { value: "hamster", label: "Hamster" },
  { value: "fish", label: "Fish" },
  { value: "other", label: "Other pet" },
];

export const petStyleOptions: { value: PetStyle; label: string }[] = [
  { value: "cute", label: "Cute" },
  { value: "funny", label: "Funny" },
  { value: "unique", label: "Unique" },
  { value: "classic", label: "Classic" },
  { value: "elegant", label: "Elegant" },
  { value: "strong", label: "Strong" },
  { value: "nature", label: "Nature-inspired" },
  { value: "food", label: "Food-inspired" },
  { value: "mythology", label: "Mythology-inspired" },
  { value: "short", label: "Short names" },
];

export const petBreedPresets: PetBreedPreset[] = [
  {
    id: "golden-retriever",
    label: "Golden Retriever",
    species: "dog",
    description: "Friendly, warm and classic dog name ideas.",
    styles: ["cute", "classic", "nature"],
  },
  {
    id: "german-shepherd",
    label: "German Shepherd",
    species: "dog",
    description: "Strong, loyal and confident dog name ideas.",
    styles: ["strong", "classic", "mythology"],
  },
  {
    id: "french-bulldog",
    label: "French Bulldog",
    species: "dog",
    description: "Cute, funny and modern dog name ideas.",
    styles: ["cute", "funny", "unique"],
  },
  {
    id: "border-collie",
    label: "Border Collie",
    species: "dog",
    description: "Bright, energetic and nature-inspired dog name ideas.",
    styles: ["nature", "short", "classic"],
  },
  {
    id: "black-cat",
    label: "Black Cat",
    species: "cat",
    description: "Mystical, elegant and unique cat name ideas.",
    styles: ["mythology", "elegant", "unique"],
  },
  {
    id: "orange-cat",
    label: "Orange Cat",
    species: "cat",
    description: "Warm, funny and food-inspired cat name ideas.",
    styles: ["food", "funny", "cute"],
  },
  {
    id: "siamese-cat",
    label: "Siamese Cat",
    species: "cat",
    description: "Elegant, royal and distinctive cat name ideas.",
    styles: ["elegant", "classic", "unique"],
  },
  {
    id: "white-horse",
    label: "White Horse",
    species: "horse",
    description: "Elegant, nature-inspired and classic horse name ideas.",
    styles: ["elegant", "nature", "classic"],
  },
  {
    id: "parrot",
    label: "Parrot",
    species: "bird",
    description: "Bright, funny and colorful bird name ideas.",
    styles: ["funny", "cute", "nature"],
  },
];

export const petNames: PetName[] = [
  {
    name: "Luna",
    species: ["dog", "cat", "rabbit"],
    gender: ["female"],
    styles: ["cute", "elegant", "mythology"],
    popularity: "popular",
    source: "starter-curated",
  },
  {
    name: "Bella",
    species: ["dog", "cat", "rabbit"],
    gender: ["female"],
    styles: ["cute", "classic", "elegant"],
    popularity: "popular",
    source: "starter-curated",
  },
  {
    name: "Max",
    species: ["dog", "cat"],
    gender: ["male"],
    styles: ["classic", "short", "strong"],
    popularity: "popular",
    source: "starter-curated",
  },
  {
    name: "Charlie",
    species: ["dog", "cat", "bird"],
    gender: ["male", "neutral"],
    styles: ["classic", "cute"],
    popularity: "popular",
    source: "starter-curated",
  },
  {
    name: "Milo",
    species: ["dog", "cat", "hamster"],
    gender: ["male"],
    styles: ["cute", "short", "classic"],
    popularity: "popular",
    source: "starter-curated",
  },
  {
    name: "Coco",
    species: ["dog", "cat", "bird", "rabbit"],
    gender: ["female", "neutral"],
    styles: ["cute", "food", "short"],
    popularity: "popular",
    source: "starter-curated",
  },
  {
    name: "Daisy",
    species: ["dog", "cat", "rabbit", "horse"],
    gender: ["female"],
    styles: ["cute", "nature", "classic"],
    popularity: "popular",
    source: "starter-curated",
  },
  {
    name: "Rocky",
    species: ["dog", "horse"],
    gender: ["male"],
    styles: ["strong", "classic"],
    popularity: "popular",
    source: "starter-curated",
  },
  {
    name: "Nala",
    species: ["dog", "cat"],
    gender: ["female"],
    styles: ["elegant", "cute", "unique"],
    popularity: "popular",
    source: "starter-curated",
  },
  {
    name: "Leo",
    species: ["dog", "cat"],
    gender: ["male"],
    styles: ["short", "strong", "classic"],
    popularity: "popular",
    source: "starter-curated",
  },
  {
    name: "Teddy",
    species: ["dog", "cat", "rabbit", "hamster"],
    gender: ["male", "neutral"],
    styles: ["cute", "classic"],
    popularity: "popular",
    source: "starter-curated",
  },
  {
    name: "Lola",
    species: ["dog", "cat"],
    gender: ["female"],
    styles: ["cute", "classic", "short"],
    popularity: "popular",
    source: "starter-curated",
  },
  {
    name: "Cooper",
    species: ["dog"],
    gender: ["male"],
    styles: ["classic", "strong"],
    popularity: "popular",
    source: "starter-curated",
  },
  {
    name: "Lucy",
    species: ["dog", "cat", "rabbit"],
    gender: ["female"],
    styles: ["cute", "classic"],
    popularity: "popular",
    source: "starter-curated",
  },
  {
    name: "Bailey",
    species: ["dog", "cat", "horse"],
    gender: ["neutral"],
    styles: ["classic", "cute"],
    popularity: "popular",
    source: "starter-curated",
  },
  {
    name: "Willow",
    species: ["dog", "cat", "horse", "rabbit"],
    gender: ["female", "neutral"],
    styles: ["nature", "elegant"],
    popularity: "popular",
    source: "starter-curated",
  },
  {
    name: "Finn",
    species: ["dog", "cat", "fish"],
    gender: ["male"],
    styles: ["short", "cute", "classic"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Poppy",
    species: ["dog", "cat", "rabbit", "hamster"],
    gender: ["female"],
    styles: ["cute", "nature", "food"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Scout",
    species: ["dog", "horse"],
    gender: ["neutral"],
    styles: ["nature", "strong", "classic"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Winston",
    species: ["dog", "cat"],
    gender: ["male"],
    styles: ["classic", "elegant"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Athena",
    species: ["dog", "cat", "horse"],
    gender: ["female"],
    styles: ["mythology", "elegant", "strong"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Apollo",
    species: ["dog", "cat", "horse"],
    gender: ["male"],
    styles: ["mythology", "strong", "elegant"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Zeus",
    species: ["dog", "cat", "horse"],
    gender: ["male"],
    styles: ["mythology", "strong", "short"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Nova",
    species: ["dog", "cat", "bird", "fish"],
    gender: ["female", "neutral"],
    styles: ["unique", "elegant", "short"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Echo",
    species: ["dog", "cat", "bird"],
    gender: ["neutral"],
    styles: ["unique", "mythology", "short"],
    popularity: "rare",
    source: "starter-curated",
  },
  {
    name: "Raven",
    species: ["dog", "cat", "horse", "bird"],
    gender: ["female", "neutral"],
    styles: ["nature", "unique", "elegant"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Storm",
    species: ["dog", "cat", "horse"],
    gender: ["neutral"],
    styles: ["nature", "strong", "short"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Blaze",
    species: ["dog", "horse", "cat"],
    gender: ["male", "neutral"],
    styles: ["strong", "nature", "unique"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Misty",
    species: ["cat", "horse", "rabbit"],
    gender: ["female"],
    styles: ["nature", "cute", "elegant"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Dakota",
    species: ["dog", "horse"],
    gender: ["neutral"],
    styles: ["nature", "strong"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Clover",
    species: ["rabbit", "cat", "dog", "hamster"],
    gender: ["female", "neutral"],
    styles: ["cute", "nature"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Mochi",
    species: ["cat", "dog", "rabbit", "hamster"],
    gender: ["neutral"],
    styles: ["cute", "food", "unique"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Peanut",
    species: ["dog", "cat", "hamster", "rabbit"],
    gender: ["neutral"],
    styles: ["cute", "food", "funny"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Biscuit",
    species: ["dog", "cat", "hamster", "rabbit"],
    gender: ["neutral"],
    styles: ["food", "cute", "funny"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Bean",
    species: ["dog", "cat", "hamster", "rabbit"],
    gender: ["neutral"],
    styles: ["food", "cute", "short"],
    popularity: "rare",
    source: "starter-curated",
  },
  {
    name: "Pip",
    species: ["bird", "hamster", "rabbit", "fish"],
    gender: ["neutral"],
    styles: ["short", "cute", "unique"],
    popularity: "rare",
    source: "starter-curated",
  },
  {
    name: "Nibbles",
    species: ["rabbit", "hamster"],
    gender: ["neutral"],
    styles: ["cute", "funny", "food"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Binky",
    species: ["rabbit", "hamster"],
    gender: ["neutral"],
    styles: ["cute", "funny"],
    popularity: "rare",
    source: "starter-curated",
  },
  {
    name: "Kiwi",
    species: ["bird", "fish", "cat", "hamster"],
    gender: ["neutral"],
    styles: ["food", "cute", "short"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Sunny",
    species: ["bird", "dog", "cat", "rabbit"],
    gender: ["neutral"],
    styles: ["nature", "cute", "classic"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Mango",
    species: ["bird", "fish", "cat"],
    gender: ["neutral"],
    styles: ["food", "cute", "unique"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Rio",
    species: ["bird", "dog", "cat"],
    gender: ["neutral", "male"],
    styles: ["short", "unique", "nature"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Skye",
    species: ["bird", "dog", "cat", "horse"],
    gender: ["female", "neutral"],
    styles: ["nature", "elegant", "short"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Bubbles",
    species: ["fish", "bird", "hamster"],
    gender: ["neutral"],
    styles: ["funny", "cute"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Coral",
    species: ["fish", "cat", "bird"],
    gender: ["female", "neutral"],
    styles: ["nature", "elegant"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Pearl",
    species: ["fish", "cat", "dog", "rabbit"],
    gender: ["female"],
    styles: ["elegant", "classic", "nature"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Aqua",
    species: ["fish", "bird", "cat"],
    gender: ["female", "neutral"],
    styles: ["nature", "unique", "short"],
    popularity: "rare",
    source: "starter-curated",
  },
  {
    name: "Blue",
    species: ["fish", "bird", "dog", "cat"],
    gender: ["neutral"],
    styles: ["nature", "short", "classic"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Waffles",
    species: ["dog", "cat", "rabbit", "hamster"],
    gender: ["neutral"],
    styles: ["food", "funny", "cute"],
    popularity: "rare",
    source: "starter-curated",
  },
  {
    name: "Pickles",
    species: ["dog", "cat", "hamster"],
    gender: ["neutral"],
    styles: ["food", "funny", "unique"],
    popularity: "rare",
    source: "starter-curated",
  },
  {
    name: "Pixel",
    species: ["cat", "dog", "bird", "hamster"],
    gender: ["neutral"],
    styles: ["unique", "short", "funny"],
    popularity: "rare",
    source: "starter-curated",
  },
  {
    name: "Ziggy",
    species: ["dog", "cat", "bird"],
    gender: ["male", "neutral"],
    styles: ["funny", "unique", "cute"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Juno",
    species: ["dog", "cat", "horse"],
    gender: ["female"],
    styles: ["mythology", "elegant", "short"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Atlas",
    species: ["dog", "cat", "horse"],
    gender: ["male"],
    styles: ["mythology", "strong", "unique"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Freya",
    species: ["dog", "cat", "horse"],
    gender: ["female"],
    styles: ["mythology", "elegant", "strong"],
    popularity: "balanced",
    source: "starter-curated",
  },
  {
    name: "Odin",
    species: ["dog", "cat", "horse"],
    gender: ["male"],
    styles: ["mythology", "strong", "short"],
    popularity: "balanced",
    source: "starter-curated",
  },
];