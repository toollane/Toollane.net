import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      
      <section className="max-w-6xl mx-auto px-6 py-20">
        
        <div className="text-center mb-16">
          
          <h1 className="text-5xl font-bold mb-6">
            Fast Online Tools for Everyday Tasks
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple converters, calculators, generators and developer tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <Link
            href="/kg-to-lbs"
            className="border rounded-2xl p-6 hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold mb-2">
              KG to LBS Converter
            </h2>

            <p className="text-gray-600">
              Convert kilograms to pounds instantly.
            </p>
          </Link>

          <div className="border rounded-2xl p-6 opacity-60">
            <h2 className="text-2xl font-semibold mb-2">
              More Tools Coming Soon
            </h2>

            <p className="text-gray-600">
              Converters, calculators and developer utilities.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}