import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = getToolMetadata("/imprint");

export default function ImprintPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      
      <h1 className="text-4xl font-bold mb-8">
        Imprint
      </h1>

      <div className="space-y-6 text-gray-700">
        
        <div>
          <h2 className="font-semibold mb-2">
            Information according to § 5 TMG
          </h2>

          <p>
            Nicklas Wolf<br />
            Am Dorfe 3<br />
            37133 Friedland<br />
            Germany
          </p>
        </div>

        <div>
          <h2 className="font-semibold mb-2">
            toolfixio@gmail.com
          </h2>

          <p>
            Email: toolfixio@gmail.com
          </p>
        </div>

        <div>
          <h2 className="font-semibold mb-2">
            Responsible for content
          </h2>

          <p>
            Nicklas Wolf
          </p>
        </div>

      </div>
    </main>
  );
}