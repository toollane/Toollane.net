import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BabyNameSchema from "@/components/BabyNameSchema";

import { babyNames, getBabyNameById, type BabyName } from "@/data/baby-names";
import { babyNamePages } from "@/data/baby-names/pages";

const baseUrl = "https://toollane.net";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return babyNames.map((name) => ({
    id: name.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const name = getBabyNameById(id);

  if (!name) {
    return {
      title: "Baby Name Not Found",
    };
  }

  const title = `${name.name} Name Meaning, Origin & Popularity | Toollane`;
  const description = `Learn the meaning, origin, style and popularity of the baby name ${name.name}. Explore similar names, variants and baby name ideas on Toollane.`;
  const url = `${baseUrl}/baby-name/${name.id}`;
  const ogImage = `${baseUrl}/og-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      siteName: "Toollane",
      title,
      description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${name.name} name meaning - Toollane`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BabyNamePage({ params }: Props) {
  const { id } = await params;
  const name = getBabyNameById(id);

  if (!name) {
    notFound();
  }

  const relatedLandingPages = babyNamePages
    .filter((page) => page.filter(name))
    .slice(0, 8);

  const similarNames = babyNames
    .filter((item) => item.id !== name.id)
    .filter(
      (item) =>
        name.similar.includes(item.name) ||
        item.origins.some((origin) => name.origins.includes(origin)) ||
        item.styles.some((style) => name.styles.includes(style))
    )
    .sort(
      (a, b) =>
        Number(name.similar.includes(b.name)) -
          Number(name.similar.includes(a.name)) ||
        b.popularity - a.popularity ||
        a.name.localeCompare(b.name)
    )
    .slice(0, 9);

return (
  <>
    <BabyNameSchema
      name={name.name}
      meaning={name.meaning}
      gender={name.gender}
      origins={name.origins}
      styles={name.styles}
      url={`${baseUrl}/baby-name/${name.id}`}
    />

    <main className="min-h-screen bg-[#fff8df] text-black">
      <section className="relative overflow-hidden border-b border-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ffe680,_transparent_35%),radial-gradient(circle_at_top_right,_#ffd6e7,_transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-5 inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur">
            Baby Name Meaning
          </div>

          <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            {name.name}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/65 sm:text-xl">
            {name.name} is a {name.gender} baby name meaning &quot;
            {name.meaning}&quot;. Explore its origin, style, popularity,
            variants and similar names.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold capitalize text-black/60">
              {name.gender}
            </span>

            <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-black/60">
              Popularity {name.popularity}/100
            </span>

            <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-black/60">
              {name.syllables} syllables
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/baby-name-generator"
              className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              Open Baby Name Generator
            </Link>

            <Link
              href={`/baby-names/${name.gender}`}
              className="rounded-2xl border border-black/10 bg-white/80 px-6 py-4 text-sm font-bold capitalize text-black transition hover:border-black"
            >
              Browse {name.gender} names
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          <InfoCard title="Meaning" value={name.meaning} />
          <InfoCard title="Gender" value={name.gender} />
          <InfoCard title="Popularity" value={`${name.popularity}/100`} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <DetailBox title="Origins" items={name.origins} />
          <DetailBox title="Styles" items={name.styles} />
        </div>

        {!!name.variants.length && (
          <div className="mt-6">
            <DetailBox title="Variants" items={name.variants} />
          </div>
        )}
      </section>

      {!!relatedLandingPages.length && (
        <section className="border-y border-black/10 bg-white/40">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight">
                Name lists related to {name.name}
              </h2>

              <p className="mt-3 max-w-2xl text-black/60">
                Explore baby name lists that match the gender, origin and style
                of {name.name}.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedLandingPages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/baby-names/${page.slug}`}
                  className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-black/20 hover:shadow-md"
                >
                  <h3 className="text-xl font-black">{page.title}</h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/60">
                    {page.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="rounded-[2.5rem] border border-black/10 bg-white/75 p-8 shadow-sm backdrop-blur sm:p-12">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            About the name {name.name}
          </h2>

          <div className="mt-8 space-y-6 leading-8 text-black/65">
            <p>
              {name.name} is a {name.gender} name with origins connected to{" "}
              {name.origins.join(", ")}. Its meaning is commonly listed as{" "}
              <strong className="text-black">{name.meaning}</strong>.
            </p>

            <p>
              The name is often associated with styles such as{" "}
              {name.styles.join(", ")}. This makes it useful for parents who are
              looking for names with a specific sound, background or character.
            </p>

            <p>
              When choosing {name.name}, consider how it sounds with the family
              name, whether the meaning feels right and whether similar names or
              variants might also fit your preference.
            </p>
          </div>
        </div>
      </section>

      {!!similarNames.length && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight">
              Similar names to {name.name}
            </h2>

            <p className="mt-3 max-w-2xl text-black/60">
              Explore baby names with related origins, styles or sounds.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similarNames.map((item) => (
              <Link
                key={item.id}
                href={`/baby-name/${item.id}`}
                className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-black/20 hover:shadow-md"
              >
                <h3 className="text-2xl font-black">{item.name}</h3>

                <p className="mt-2 text-sm font-bold capitalize text-black/45">
                  {item.gender}
                </p>

                <p className="mt-4 text-sm leading-6 text-black/65">
                  <strong className="text-black">Meaning:</strong>{" "}
                  {item.meaning}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.origins.slice(0, 2).map((origin) => (
                    <span
                      key={origin}
                      className="rounded-full bg-[#fff8df] px-3 py-2 text-xs font-bold text-black"
                    >
                      {origin}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
</>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
      <div className="text-xs font-black uppercase tracking-wide text-black/40">
        {title}
      </div>
      <div className="mt-2 text-2xl font-black capitalize text-black">
        {value}
      </div>
    </div>
  );
}

function createBabyNameSlug(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

function DetailBox({
  title,
  items,
}: {
  title: "Origins" | "Styles" | "Variants";
  items: string[];
}) {
  return (
    <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm">
      <h2 className="text-2xl font-black tracking-tight">{title}</h2>

      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => {
          const targetSlug =
            title === "Origins"
              ? `${createBabyNameSlug(item)}-baby-names`
              : title === "Styles"
                ? `${createBabyNameSlug(item)}-baby-name-ideas`
                : "";

          const targetPage = targetSlug
            ? babyNamePages.find((page) => page.slug === targetSlug)
            : undefined;

          if (targetPage) {
            return (
              <Link
                key={item}
                href={`/baby-names/${targetPage.slug}`}
                className="rounded-full border border-black/10 bg-[#fff8df] px-3 py-2 text-xs font-bold text-black/70 transition hover:border-black hover:text-black"
              >
                {item}
              </Link>
            );
          }

          return (
            <span
              key={item}
              className="rounded-full border border-black/10 bg-[#fff8df] px-3 py-2 text-xs font-bold text-black/70"
            >
              {item}
            </span>
          );
        })}
      </div>
    </div>
  );
}