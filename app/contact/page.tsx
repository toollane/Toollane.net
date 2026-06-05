export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#fff8df] text-[#171717]">
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-black/10 bg-white/80 p-8 shadow-sm backdrop-blur sm:p-12">
          <h1 className="text-4xl font-black tracking-tight">
            Contact
          </h1>

          <p className="mt-6 text-black/70 leading-8">
            For support, feedback, partnerships or business inquiries, please
            contact:
          </p>

          <div className="mt-8 rounded-2xl border border-black/10 bg-[#fff8df] p-6">
            <p className="font-semibold">
              contact@toollane.net
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}