import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-20">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-600">
        
        <p>
          © 2026 Toollane. All rights reserved.
        </p>

        <div className="flex gap-6">
          
          <Link
            href="/imprint"
            className="hover:underline"
          >
            Imprint
          </Link>

          <Link
            href="/privacy-policy"
            className="hover:underline"
          >
            Privacy Policy
          </Link>

        </div>
      </div>
    </footer>
  );
}