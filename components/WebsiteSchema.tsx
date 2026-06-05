export default function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Toollane",
    url: "https://toollane.net",
    description:
      "Fast, free and modern online tools for SEO, PDFs, images, development, productivity and business.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://toollane.net/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}