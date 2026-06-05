export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#fff8df] text-[#171717]">
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-black/10 bg-white/80 p-8 shadow-sm backdrop-blur sm:p-12">
          <h1 className="text-4xl font-black tracking-tight">
            Terms of Service
          </h1>

          <div className="mt-8 space-y-8 text-black/70 leading-8">
            <p>
              Toollane provides free online tools for informational and utility
              purposes.
            </p>

            <p>
              We do not guarantee uninterrupted availability or error-free
              functionality.
            </p>

            <p>
              Users are responsible for how they use the tools and generated
              results.
            </p>

            <p>
              By using Toollane, you agree to these terms.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}