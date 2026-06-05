export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",

    name: "Toollane",

    url: "https://toollane.net",

    logo: "https://toollane.net/icon.png",

    sameAs: [],

    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "contact@toollane.net",
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