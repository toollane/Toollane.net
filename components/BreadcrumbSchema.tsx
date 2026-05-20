type Props = {
  categoryName: string;
  categorySlug: string;
  toolName: string;
  toolHref: string;
};

export default function BreadcrumbSchema({
  categoryName,
  categorySlug,
  toolName,
  toolHref,
}: Props) {
  const baseUrl = "https://toollane.net";

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: `${baseUrl}/category/${categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: toolName,
        item: `${baseUrl}${toolHref}`,
      },
    ],
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