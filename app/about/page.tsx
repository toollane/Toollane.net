export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fff8df] text-[#171717]">
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-black/10 bg-white/80 p-8 shadow-sm backdrop-blur sm:p-12">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            About Toollane
          </h1>

          <div className="mt-8 space-y-6 text-black/70 leading-8">
            <p>
              Toollane is a growing collection of fast, modern and free online
              tools designed for productivity, SEO, PDFs, developers, business
              and everyday tasks.
            </p>

            <p>
              Our mission is to create useful browser-based tools with clean UX,
              strong performance and privacy-friendly functionality.
            </p>

            <p>
              Many tools work directly in your browser without uploading your
              files or personal data.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}