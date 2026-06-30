import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Baby Names | Curated Girl, Boy & Unisex Name Ideas",
  description:
    "Find baby names with Toollane's curated baby name hub. Browse girl, boy and unisex names by meaning, origin, style and popularity, or use the Baby Name Generator.",
  alternates: {
    canonical: "https://toollane.net/baby-names",
  },
};

type CollectionLink = {
  title: string;
  description?: string;
  href: string;
};

const mainCollections: CollectionLink[] = [
  {
    title: "Baby Name Generator",
    description:
      "Generate baby name ideas by gender, origin, style, popularity, length and surname compatibility.",
    href: "/baby-name-generator",
  },
  {
    title: "Girl Names",
    description:
      "Browse girl names with meanings, origins, styles and popularity signals.",
    href: "/baby-names/girl",
  },
  {
    title: "Boy Names",
    description:
      "Explore boy names across classic, modern, strong and international styles.",
    href: "/baby-names/boy",
  },
  {
    title: "Unisex Names",
    description:
      "Find gender-neutral baby names and modern unisex name ideas.",
    href: "/baby-names/unisex",
  },
];

const featuredCollections: CollectionLink[] = [
  {
    title: "Popular Baby Names",
    description:
      "Start with familiar baby names that many parents already recognize.",
    href: "/baby-names/popular-baby-names",
  },
  {
    title: "Rare Baby Names",
    description:
      "Explore less common names when you want something more distinctive.",
    href: "/baby-names/rare-baby-names",
  },
  {
    title: "Short Baby Names",
    description:
      "Find simple, memorable names that are easy to say and spell.",
    href: "/baby-names/short-baby-names",
  },
  {
    title: "Vintage Baby Names",
    description:
      "Discover older names with timeless, classic or nostalgic character.",
    href: "/baby-names/vintage-baby-names",
  },
  {
    title: "Elegant Baby Names",
    description:
      "Browse refined names with graceful, polished or classic appeal.",
    href: "/baby-names/elegant-baby-names",
  },
  {
    title: "Nature Baby Names",
    description:
      "Find names inspired by flowers, seasons, landscapes and the outdoors.",
    href: "/baby-names/nature-baby-names",
  },
  {
    title: "Royal Baby Names",
    description:
      "Explore names with noble, traditional or regal associations.",
    href: "/baby-names/royal-baby-names",
  },
  {
    title: "Old Money Baby Names",
    description:
      "Browse polished names with a traditional, established feel.",
    href: "/baby-names/old-money-baby-names",
  },
];

const originCollections: CollectionLink[] = [
  { title: "English Baby Names", href: "/baby-names/english-baby-names" },
  { title: "German Baby Names", href: "/baby-names/german-baby-names" },
  { title: "French Baby Names", href: "/baby-names/french-baby-names" },
  { title: "Italian Baby Names", href: "/baby-names/italian-baby-names" },
  { title: "Spanish Baby Names", href: "/baby-names/spanish-baby-names" },
  { title: "Greek Baby Names", href: "/baby-names/greek-baby-names" },
  { title: "Hebrew Baby Names", href: "/baby-names/hebrew-baby-names" },
  { title: "Arabic Baby Names", href: "/baby-names/arabic-baby-names" },
  { title: "Irish Baby Names", href: "/baby-names/irish-baby-names" },
  { title: "Nordic Baby Names", href: "/baby-names/nordic-baby-names" },
  { title: "Japanese Baby Names", href: "/baby-names/japanese-baby-names" },
  { title: "Indian Baby Names", href: "/baby-names/indian-baby-names" },
];

const styleCollections: CollectionLink[] = [
  {
    title: "Classic Baby Names",
    href: "/baby-names/classic-baby-name-ideas",
  },
  {
    title: "Modern Baby Names",
    href: "/baby-names/modern-baby-name-ideas",
  },
  {
    title: "Elegant Baby Names",
    href: "/baby-names/elegant-baby-name-ideas",
  },
  {
    title: "Rare Baby Names",
    href: "/baby-names/rare-baby-name-ideas",
  },
  {
    title: "Nature Baby Names",
    href: "/baby-names/nature-baby-name-ideas",
  },
  {
    title: "Vintage Baby Names",
    href: "/baby-names/vintage-baby-name-ideas",
  },
  {
    title: "Biblical Baby Names",
    href: "/baby-names/biblical-baby-name-ideas",
  },
  {
    title: "Royal Baby Names",
    href: "/baby-names/royal-baby-name-ideas",
  },
  {
    title: "Short Baby Names",
    href: "/baby-names/short-baby-name-ideas",
  },
  {
    title: "Strong Baby Names",
    href: "/baby-names/strong-baby-name-ideas",
  },
  {
    title: "Soft Baby Names",
    href: "/baby-names/soft-baby-name-ideas",
  },
  {
    title: "Old Money Baby Names",
    href: "/baby-names/old-money-baby-name-ideas",
  },
];

const faqs = [
  {
    question: "How should I start looking for baby names?",
    answer:
      "A good starting point is to choose a broad direction first: girl names, boy names, unisex names or the Baby Name Generator. Then narrow the list by meaning, origin, style, popularity and how the name sounds with the family name.",
  },
  {
    question: "Can I browse girl, boy and unisex names?",
    answer:
      "Yes. Toollane includes curated pages for girl names, boy names and unisex baby names, plus additional collections by origin, style and popularity.",
  },
  {
    question: "Can I find baby names by origin or style?",
    answer:
      "Yes. You can browse names by origins such as English, German, French, Italian, Greek, Hebrew, Arabic, Nordic, Japanese and Indian, or by styles such as classic, modern, elegant, rare, nature, vintage and royal.",
  },
  {
    question: "Are baby name meanings always exact?",
    answer:
      "Baby name meanings can vary by language, culture and source. Use Toollane as a discovery tool and verify important meanings, cultural context and spelling before making a final decision.",
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
            Find baby names with a clearer decision path. Start with gender,
            explore meaning and origin, compare styles, then use the Baby Name
            Generator to narrow your shortlist.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <HeroStat label="Start with" value="Gender" />
            <HeroStat label="Narrow by" value="Style" />
            <HeroStat label="Compare by" value="Meaning" />
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

            <Link
              href="/baby-names/boy"
              className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-center text-sm font-bold text-black transition hover:border-black"
            >
              Browse boy names
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6">
        <SectionHeader
          title="Choose your baby name starting point"
          description="Pick the path that best matches how you want to search: generate ideas, browse by gender or explore gender-neutral names."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {mainCollections.map((collection) => (
            <FeatureCard key={collection.href} collection={collection} />
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-2xl font-black tracking-tight text-black">
            A simple way to choose a baby name
          </h2>

          <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
            Baby name search can feel overwhelming when every list looks the
            same. Toollane is designed to help you move from a broad list to a
            smaller, more realistic shortlist.
          </p>

          <div className="mt-6 grid gap-4">
            <StepCard
              number="1"
              title="Start broad"
              description="Begin with girl names, boy names, unisex names or the generator if you are not sure what style you want yet."
            />
            <StepCard
              number="2"
              title="Choose a style direction"
              description="Decide whether you prefer classic, modern, rare, elegant, nature-inspired, short, strong or vintage names."
            />
            <StepCard
              number="3"
              title="Check meaning and origin"
              description="Review the meaning and background of each name, especially if cultural context or family heritage matters to you."
            />
            <StepCard
              number="4"
              title="Test the full name"
              description="Say the first name with the family name, check initials and think about possible nicknames before deciding."
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-black p-5 text-white shadow-sm sm:p-6">
          <h2 className="text-2xl font-black tracking-tight">
            When to use the generator
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/60">
            Use the Baby Name Generator when you want faster inspiration or a
            more personalized shortlist.
          </p>

          <div className="mt-6 grid gap-3">
            <DarkInfo label="You know the gender, but not the style." />
            <DarkInfo label="You like a certain origin or name length." />
            <DarkInfo label="You want names that fit a surname." />
            <DarkInfo label="You need fresh ideas beyond common lists." />
          </div>

          <Link
            href="/baby-name-generator"
            className="mt-6 block rounded-2xl bg-white px-5 py-4 text-center text-sm font-black text-black transition hover:opacity-90"
          >
            Generate baby names →
          </Link>
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          title="Curated baby name collections"
          description="Use these focused lists when you already know the kind of name you want."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredCollections.map((collection) => (
            <FeatureCard key={collection.href} collection={collection} />
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <CollectionSection
          title="Browse baby names by origin"
          description="Explore selected name origins when language, heritage or cultural background is part of your decision."
          collections={originCollections}
        />

        <CollectionSection
          title="Browse baby names by style"
          description="Find names by mood, sound and naming style instead of browsing one huge list."
          collections={styleCollections}
        />
      </section>

      <section className="mt-10 rounded-[2rem] border border-black/10 bg-[#fff8df] p-5 shadow-sm sm:p-6">
        <SectionHeader
          title="What to consider before choosing a name"
          description="A name can look good in a list but feel different in real life. Use these checks before you settle on a favorite."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <TipCard
            title="Sound with the surname"
            description="Say the full name out loud. Check whether the rhythm feels natural and whether the first and last name run together."
          />
          <TipCard
            title="Meaning and context"
            description="Name meanings can vary. Look at the language, origin and cultural context before relying on one meaning."
          />
          <TipCard
            title="Initials and nicknames"
            description="Check initials, common nicknames and shorter forms. A name may be used in different ways over time."
          />
          <TipCard
            title="Spelling and pronunciation"
            description="Think about whether the name is easy to spell, easy to pronounce and practical in the place where the child may grow up."
          />
          <TipCard
            title="Long-term usability"
            description="Consider how the name might feel for a baby, teenager and adult. Some names feel cute early but less flexible later."
          />
          <TipCard
            title="Family preference"
            description="A name often carries emotional meaning. Family traditions, sibling names and personal associations can all matter."
          />
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1fr]">
        <div className="rounded-[2rem] border border-black/10 bg-black p-5 text-white shadow-sm sm:p-6">
          <h2 className="text-2xl font-black tracking-tight">
            Best first steps
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/60">
            Start here if you want fast baby name inspiration without browsing
            every collection.
          </p>

          <div className="mt-6 grid gap-3">
            <DarkLink href="/baby-name-generator" label="Baby Name Generator" />
            <DarkLink href="/baby-names/girl" label="Girl Names" />
            <DarkLink href="/baby-names/boy" label="Boy Names" />
            <DarkLink href="/baby-names/unisex" label="Unisex Names" />
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-2xl font-black tracking-tight text-black">
            How Toollane organizes baby names
          </h2>

          <div className="mt-5 space-y-5 text-sm leading-7 text-black/65 sm:text-base">
            <p>
              Toollane groups baby names by practical decision signals: gender,
              origin, style, popularity and meaning. This makes it easier to
              compare names based on what parents actually consider.
            </p>

            <p>
              The goal is not to tell you which name is objectively best. A baby
              name is personal. Toollane helps you discover options, understand
              differences and build a shortlist that feels easier to review.
            </p>

            <p>
              After you find a few favorites, use the generator to explore
              related ideas and check whether a name still feels right with your
              preferred style, length and surname.
            </p>
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

function DarkInfo({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white">
      {label}
    </div>
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

function TipCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <h3 className="text-base font-black text-black">{title}</h3>

      <p className="mt-2 text-sm leading-7 text-black/60">{description}</p>
    </div>
  );
}