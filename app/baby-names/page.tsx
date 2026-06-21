import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Baby Names | Girl, Boy & Unisex Name Ideas",
  description:
    "Explore baby names by gender, origin, style, popularity and starting letter. Find girl names, boy names, unisex names and unique baby name ideas.",
  alternates: {
    canonical: "https://toollane.net/baby-names",
  },
};

type CollectionLink = {
  title: string;
  description?: string;
  href: string;
};

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

const mainCollections: CollectionLink[] = [
  {
    title: "Baby Name Generator",
    description:
      "Generate baby names by gender, origin, style, popularity, starting letter and surname compatibility.",
    href: "/baby-name-generator",
  },
  {
    title: "Girl Names",
    description:
      "Browse beautiful girl names with meanings, origins, styles and popularity.",
    href: "/baby-names/girl",
  },
  {
    title: "Boy Names",
    description:
      "Browse strong, classic, modern and international boy names.",
    href: "/baby-names/boy",
  },
  {
    title: "Unisex Names",
    description:
      "Explore gender-neutral baby names and modern unisex name ideas.",
    href: "/baby-names/unisex",
  },
];

const originCollections: CollectionLink[] = [
  { title: "Arabic Baby Names", href: "/baby-names/arabic-baby-names" },
  { title: "Celtic Baby Names", href: "/baby-names/celtic-baby-names" },
  { title: "Chinese Baby Names", href: "/baby-names/chinese-baby-names" },
  { title: "Danish Baby Names", href: "/baby-names/danish-baby-names" },
  { title: "Dutch Baby Names", href: "/baby-names/dutch-baby-names" },
  { title: "English Baby Names", href: "/baby-names/english-baby-names" },
  { title: "French Baby Names", href: "/baby-names/french-baby-names" },
  { title: "German Baby Names", href: "/baby-names/german-baby-names" },
  { title: "Greek Baby Names", href: "/baby-names/greek-baby-names" },
  { title: "Hawaiian Baby Names", href: "/baby-names/hawaiian-baby-names" },
  { title: "Hebrew Baby Names", href: "/baby-names/hebrew-baby-names" },
  { title: "Indian Baby Names", href: "/baby-names/indian-baby-names" },
  { title: "Irish Baby Names", href: "/baby-names/irish-baby-names" },
  { title: "Italian Baby Names", href: "/baby-names/italian-baby-names" },
  { title: "Japanese Baby Names", href: "/baby-names/japanese-baby-names" },
  { title: "Korean Baby Names", href: "/baby-names/korean-baby-names" },
  { title: "Latin Baby Names", href: "/baby-names/latin-baby-names" },
  {
    title: "Native American Baby Names",
    href: "/baby-names/native-american-baby-names",
  },
  { title: "Nordic Baby Names", href: "/baby-names/nordic-baby-names" },
  { title: "Persian Baby Names", href: "/baby-names/persian-baby-names" },
  { title: "Polish Baby Names", href: "/baby-names/polish-baby-names" },
  {
    title: "Portuguese Baby Names",
    href: "/baby-names/portuguese-baby-names",
  },
  { title: "Russian Baby Names", href: "/baby-names/russian-baby-names" },
  { title: "Sanskrit Baby Names", href: "/baby-names/sanskrit-baby-names" },
  {
    title: "Scandinavian Baby Names",
    href: "/baby-names/scandinavian-baby-names",
  },
  { title: "Scottish Baby Names", href: "/baby-names/scottish-baby-names" },
  { title: "Slavic Baby Names", href: "/baby-names/slavic-baby-names" },
  { title: "Spanish Baby Names", href: "/baby-names/spanish-baby-names" },
  { title: "Turkish Baby Names", href: "/baby-names/turkish-baby-names" },
  { title: "Welsh Baby Names", href: "/baby-names/welsh-baby-names" },
];

const styleCollections: CollectionLink[] = [
  {
    title: "Adventurous Baby Names",
    href: "/baby-names/adventurous-baby-name-ideas",
  },
  {
    title: "Ancient Baby Names",
    href: "/baby-names/ancient-baby-name-ideas",
  },
  {
    title: "Biblical Baby Names",
    href: "/baby-names/biblical-baby-name-ideas",
  },
  {
    title: "Bright Baby Names",
    href: "/baby-names/bright-baby-name-ideas",
  },
  {
    title: "Celestial Baby Names",
    href: "/baby-names/celestial-baby-name-ideas",
  },
  {
    title: "Classic Baby Names",
    href: "/baby-names/classic-baby-name-ideas",
  },
  {
    title: "Color Baby Names",
    href: "/baby-names/color-baby-name-ideas",
  },
  {
    title: "Elegant Baby Names",
    href: "/baby-names/elegant-baby-name-ideas",
  },
  {
    title: "Friendly Baby Names",
    href: "/baby-names/friendly-baby-name-ideas",
  },
  {
    title: "Gemstone Baby Names",
    href: "/baby-names/gemstone-baby-name-ideas",
  },
  {
    title: "International Baby Names",
    href: "/baby-names/international-baby-name-ideas",
  },
  {
    title: "Modern Baby Names",
    href: "/baby-names/modern-baby-name-ideas",
  },
  {
    title: "Musical Baby Names",
    href: "/baby-names/musical-baby-name-ideas",
  },
  {
    title: "Mythological Baby Names",
    href: "/baby-names/mythological-baby-name-ideas",
  },
  {
    title: "Nature Baby Names",
    href: "/baby-names/nature-baby-name-ideas",
  },
  {
    title: "Old Fashioned Baby Names",
    href: "/baby-names/old-fashioned-baby-name-ideas",
  },
  {
    title: "Old Money Baby Names",
    href: "/baby-names/old-money-baby-name-ideas",
  },
  {
    title: "Peaceful Baby Names",
    href: "/baby-names/peaceful-baby-name-ideas",
  },
  {
    title: "Place Baby Names",
    href: "/baby-names/place-baby-name-ideas",
  },
  {
    title: "Rare Baby Names",
    href: "/baby-names/rare-baby-name-ideas",
  },
  {
    title: "Romantic Baby Names",
    href: "/baby-names/romantic-baby-name-ideas",
  },
  {
    title: "Royal Baby Names",
    href: "/baby-names/royal-baby-name-ideas",
  },
  {
    title: "Seasonal Baby Names",
    href: "/baby-names/seasonal-baby-name-ideas",
  },
  {
    title: "Short Baby Names",
    href: "/baby-names/short-baby-name-ideas",
  },
  {
    title: "Soft Baby Names",
    href: "/baby-names/soft-baby-name-ideas",
  },
  {
    title: "Strong Baby Names",
    href: "/baby-names/strong-baby-name-ideas",
  },
  {
    title: "Surname Baby Names",
    href: "/baby-names/surname-baby-name-ideas",
  },
  {
    title: "Vintage Baby Names",
    href: "/baby-names/vintage-baby-name-ideas",
  },
  {
    title: "Virtue Baby Names",
    href: "/baby-names/virtue-baby-name-ideas",
  },
];

const popularCollections: CollectionLink[] = [
  {
    title: "Popular Baby Names",
    description: "Browse popular baby names for girls, boys and unisex ideas.",
    href: "/baby-names/popular-baby-names",
  },
  {
    title: "Rare Baby Names",
    description: "Find rare and uncommon baby names with meanings and origins.",
    href: "/baby-names/rare-baby-names",
  },
  {
    title: "Short Baby Names",
    description: "Explore short baby names that are simple and memorable.",
    href: "/baby-names/short-baby-names",
  },
  {
    title: "Vintage Baby Names",
    description: "Discover vintage baby names with timeless charm.",
    href: "/baby-names/vintage-baby-names",
  },
  {
    title: "Elegant Baby Names",
    description: "Browse refined and elegant baby names with classic appeal.",
    href: "/baby-names/elegant-baby-names",
  },
  {
    title: "Royal Baby Names",
    description: "Explore royal baby names with noble and classic style.",
    href: "/baby-names/royal-baby-names",
  },
  {
    title: "Nature Baby Names",
    description: "Find baby names inspired by nature, flowers and the outdoors.",
    href: "/baby-names/nature-baby-names",
  },
  {
    title: "Old Money Baby Names",
    description: "Browse old money baby names with polished, timeless style.",
    href: "/baby-names/old-money-baby-names",
  },
];

const faqs = [
  {
    question: "How can I find baby names on Toollane?",
    answer:
      "You can use the Baby Name Generator or browse baby names by gender, origin, style, popularity and starting letter.",
  },
  {
    question: "Can I browse girl, boy and unisex names?",
    answer:
      "Yes. Toollane includes dedicated pages for girl names, boy names and unisex baby names.",
  },
  {
    question: "Can I find names by origin?",
    answer:
      "Yes. You can browse baby names by origins such as German, French, Italian, Nordic, Hebrew, Greek, Arabic, Japanese, Spanish and more.",
  },
  {
    question: "Are baby name meanings always exact?",
    answer:
      "Baby name meanings can vary by language, culture and source. Use Toollane as a discovery tool and verify important meanings before making a final decision.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function BabyNamesPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <section className="overflow-hidden rounded-[2rem] border border-black/10 bg-[#fff8df] p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="max-w-4xl">
          <div className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-black/60">
            Baby name hub
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-black sm:text-5xl lg:text-6xl">
            Baby Names
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-black/65 sm:text-lg">
            Explore baby names by gender, origin, country style, meaning,
            popularity, style and starting letter. Use the Baby Name Generator
            or browse curated baby name collections.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <HeroStat label="Name pages" value="1,200+" />
            <HeroStat label="Collections" value="170+" />
            <HeroStat label="Cost" value="Free" />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/baby-name-generator"
              className="rounded-2xl bg-black px-6 py-4 text-center text-sm font-bold text-white transition hover:opacity-90"
            >
              Open Baby Name Generator
            </Link>

            <Link
              href="/baby-names/girl"
              className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-center text-sm font-bold text-black transition hover:border-black"
            >
              Browse girl names
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6">
        <SectionHeader
          title="Start with popular baby name collections"
          description="Choose a main path or open the generator to filter names by gender, origin, style, popularity and surname compatibility."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {mainCollections.map((collection) => (
            <FeatureCard key={collection.href} collection={collection} />
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          title="Browse baby names by starting letter"
          description="Find girl, boy and unisex baby names beginning with each letter of the alphabet."
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {alphabet.map((letter) => (
            <div
              key={letter}
              className="rounded-2xl border border-black/10 bg-[#fff8df] p-4"
            >
              <div className="text-lg font-black uppercase text-black">
                {letter}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <SmallLink
                  href={`/baby-names/girl-names-starting-with-${letter}`}
                  label="Girl"
                />
                <SmallLink
                  href={`/baby-names/boy-names-starting-with-${letter}`}
                  label="Boy"
                />
                <SmallLink
                  href={`/baby-names/unisex-names-starting-with-${letter}`}
                  label="Unisex"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <CollectionSection
          title="Browse baby names by origin"
          description="Explore baby name ideas by language, culture and country style."
          collections={originCollections}
        />

        <CollectionSection
          title="Browse baby names by style"
          description="Find baby names by style, mood and naming theme."
          collections={styleCollections}
        />
      </section>

      <section className="mt-10 rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          title="Popular baby name lists"
          description="Browse high-intent baby name collections for common search needs."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {popularCollections.map((collection) => (
            <FeatureCard key={collection.href} collection={collection} />
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-2xl font-black tracking-tight text-black">
            How to use Toollane baby names
          </h2>

          <div className="mt-5 grid gap-4">
            <StepCard
              number="1"
              title="Choose a starting point"
              description="Open the Baby Name Generator or start with girl names, boy names, unisex names, origins or styles."
            />
            <StepCard
              number="2"
              title="Narrow by meaning and style"
              description="Use origin, style, popularity, length and starting-letter pages to explore names that match your taste."
            />
            <StepCard
              number="3"
              title="Check name details"
              description="Open individual name pages to review meaning, origin, styles and related name ideas."
            />
            <StepCard
              number="4"
              title="Verify before deciding"
              description="Name meanings and cultural usage can vary, so verify important details before choosing a final name."
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-black p-5 text-white shadow-sm sm:p-6">
          <h2 className="text-2xl font-black tracking-tight">
            Best first steps
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/60">
            Start with these pages if you want fast baby name inspiration.
          </p>

          <div className="mt-6 grid gap-3">
            <DarkLink href="/baby-name-generator" label="Baby Name Generator" />
            <DarkLink href="/baby-names/girl" label="Girl Names" />
            <DarkLink href="/baby-names/boy" label="Boy Names" />
            <DarkLink href="/baby-names/unisex" label="Unisex Names" />
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-2xl font-black tracking-tight text-black">
          Frequently asked questions
        </h2>

        <div className="mt-6 grid gap-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-black/10 bg-white p-5"
            >
              <h3 className="text-base font-black text-black">
                {faq.question}
              </h3>

              <p className="mt-2 text-sm leading-7 text-black/60">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-2xl font-black text-black">{value}</div>
    </div>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight text-black">{title}</h2>

      <p className="mt-3 max-w-3xl text-sm leading-7 text-black/60 sm:text-base">
        {description}
      </p>
    </div>
  );
}

function FeatureCard({ collection }: { collection: CollectionLink }) {
  return (
    <Link
      href={collection.href}
      className="group rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-black hover:shadow-md"
    >
      <h3 className="text-lg font-black tracking-tight text-black">
        {collection.title}
      </h3>

      {collection.description && (
        <p className="mt-2 text-sm leading-6 text-black/60">
          {collection.description}
        </p>
      )}

      <div className="mt-4 text-sm font-bold text-black">
        Open collection{" "}
        <span className="inline-block transition group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}

function CollectionSection({
  title,
  description,
  collections,
}: {
  title: string;
  description: string;
  collections: CollectionLink[];
}) {
  return (
    <section className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeader title={title} description={description} />

      <div className="mt-6 flex flex-wrap gap-2">
        {collections.map((collection) => (
          <SmallLink
            key={collection.href}
            href={collection.href}
            label={collection.title}
          />
        ))}
      </div>
    </section>
  );
}

function SmallLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-black transition hover:border-black hover:bg-[#fff8df]"
    >
      {label}
    </Link>
  );
}

function DarkLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-black"
    >
      {label} →
    </Link>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-sm font-black text-white">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-black text-black">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-black/60">{description}</p>
      </div>
    </div>
  );
}