export default function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Toollane",
    url: "https://toollane.net",
    description:
      "Fast, free and mobile-friendly online tools for SEO, PDFs, images, business, creators, developers and everyday work.",
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "Toollane",
      url: "https://toollane.net",
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