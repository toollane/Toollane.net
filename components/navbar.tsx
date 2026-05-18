import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link
          href="/"
          className="text-2xl font-bold"
        >
          Toollane
        </Link>

        <nav className="flex gap-6">
          <Link href="/" className="hover:underline">
            Home
          </Link>

          <Link
            href="/kg-to-lbs"
            className="hover:underline"
          >
            Converter
          </Link>
        </nav>
      </div>
    </header>
  );
}