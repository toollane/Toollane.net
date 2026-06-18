import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { babyNames, type BabyName } from "@/data/baby-names";
import { babyNamePages, getBabyNamePage } from "@/data/baby-names/pages";

const baseUrl = "https://toollane.net";

type Props = {
  params: Promise<{
    type: string;
  }>;
};

export function generateStaticParams() {
  return babyNamePages.map((page) => ({
    type: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const page = getBabyNamePage(type);

  if (!page) {
    return {
      title: "Baby Names Not Found",
    };
  }

  const url = `${baseUrl}/baby-names/${page.slug}`;
  const ogImage = `${baseUrl}/og-image.png`;

  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      siteName: "Toollane",
      title: page.seoTitle,
      description: page.seoDescription,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${page.title} - Toollane`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.seoTitle,
      description: page.seoDescription,
      images: [ogImage],
    },
  };
}

export default async function BabyNamesPage({ params }: Props) {
  const { type } = await params;
  const page = getBabyNamePage(type);

  if (!page) {
    notFound();
  }

  const names = babyNames
    .filter(page.filter)
    .sort((a, b) => b.popularity - a.popularity || a.name.localeCompare(b.name));

  if (!names.length) {
    notFound();
  }

  const popularNames = names.slice(0, 24);
  const secondaryNames = names.slice(24, 48);

  const origins = Array.from(
    new Set(names.flatMap((name) => name.origins))
  ).sort();

  const styles = Array.from(
    new Set(names.flatMap((name) => name.styles))
  ).sort();

  return (
    <main className="min-h-screen bg-[#fff8df] text-black">
      <section className="relative overflow-hidden border-b border-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ffe680,_transparent_35%),radial-gradient(circle_at_top_right,_#ffd6e7,_transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-5 inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur">
            Baby Names
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            {page.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/65">
            {page.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-black/60">
              {names.length} names
            </span>
            <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-black/60">
              Meanings included
            </span>
            <span className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-bold text-black/60">
              Origins included
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
              href="/category/generators"
              className="rounded-2xl border border-black/10 bg-white/80 px-6 py-4 text-sm font-bold text-black transition hover:border-black"
            >
              Browse Generators
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tight">
            Popular {page.title}
          </h2>

          <p className="mt-3 max-w-2xl text-black/60">
            Start with popular {page.title.toLowerCase()} from the Toollane baby
            name database.
          </p>
        </div>

        <NameGrid names={popularNames} />
      </section>

      {!!secondaryNames.length && (
        <section className="border-y border-black/10 bg-white/40">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight">
                More {page.title}
              </h2>

              <p className="mt-3 max-w-2xl text-black/60">
                Discover more {page.title.toLowerCase()} with different sounds,
                meanings and styles.
              </p>
            </div>

            <NameGrid names={secondaryNames} />
          </div>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="rounded-[2.5rem] border border-black/10 bg-white/75 p-8 shadow-sm backdrop-blur sm:p-12">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            How to choose {page.title.toLowerCase()}
          </h2>

          <div className="mt-8 space-y-6 leading-8 text-black/65">
            <p>
              Choosing a baby name is personal. A good name often combines sound,
              meaning, origin, family preference and long-term usability.
            </p>

            <p>
              Use this page to compare {page.title.toLowerCase()} by popularity,
              meaning and origin. You can also open the baby name generator to
              filter names by style, length, first letter and surname
              compatibility.
            </p>

            <p>
              Many parents start with a broad list, save favorites and then test
              how each name sounds with the family name. This helps narrow the
              list to names that feel natural, memorable and meaningful.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-black tracking-tight">
                Origins in this list
              </h2>

              <div className="mt-5 flex flex-wrap gap-2">
                {origins.map((origin) => (
                  <span
                    key={origin}
                    className="rounded-full border border-black/10 bg-[#fff8df] px-3 py-2 text-xs font-bold text-black/70"
                  >
                    {origin}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-black tracking-tight">
                Styles in this list
              </h2>

              <div className="mt-5 flex flex-wrap gap-2">
                {styles.map((style) => (
                  <span
                    key={style}
                    className="rounded-full border border-black/10 bg-[#fff8df] px-3 py-2 text-xs font-bold text-black/70"
                  >
                    {style}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="text-3xl font-black tracking-tight">
          Explore more baby names
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {babyNamePages.map((item) => (
            <Link
              key={item.slug}
              href={`/baby-names/${item.slug}`}
              className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-black/20 hover:shadow-md"
            >
              <h3 className="text-xl font-black">{item.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/60">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function NameGrid({ names }: { names: BabyName[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {names.map((name) => (
        <Link
          key={name.id}
          href={`/baby-name/${name.id}`}
          className="group rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-black/20 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black group-hover:underline">
                {name.name}
              </h3>

              <p className="mt-1 text-sm font-bold capitalize text-black/45">
                {name.gender}
              </p>
            </div>

            <div className="rounded-full bg-black px-3 py-2 text-xs font-black text-white">
              {name.popularity}/100
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-black/65">
            <strong className="text-black">Meaning:</strong> {name.meaning}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {name.origins.slice(0, 3).map((origin) => (
              <span
                key={origin}
                className="rounded-full bg-[#fff8df] px-3 py-2 text-xs font-bold text-black"
              >
                {origin}
              </span>
            ))}

            {name.styles.slice(0, 2).map((style) => (
              <span
                key={style}
                className="rounded-full border border-black/10 px-3 py-2 text-xs font-bold text-black"
              >
                {style}
              </span>
            ))}
          </div>

          {!!name.similar.length && (
            <p className="mt-4 text-xs leading-5 text-black/50">
              Similar: {name.similar.slice(0, 3).join(", ")}
            </p>
          )}

          <div className="mt-5 text-sm font-bold text-black">
            View name meaning →
          </div>
        </Link>
      ))}
    </div>
  );
}