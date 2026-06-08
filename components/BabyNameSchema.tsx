type Props = {
  name: string;
  meaning: string;
  gender: string;
  origins: string[];
  styles: string[];
  url: string;
};

export default function BabyNameSchema({
  name,
  meaning,
  gender,
  origins,
  styles,
  url,
}: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name,
    description: `${name} is a ${gender} baby name meaning "${meaning}".`,
    termCode: name.toLowerCase(),
    inDefinedTermSet: "Baby Names",
    url,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Gender",
        value: gender,
      },
      {
        "@type": "PropertyValue",
        name: "Meaning",
        value: meaning,
      },
      {
        "@type": "PropertyValue",
        name: "Origins",
        value: origins.join(", "),
      },
      {
        "@type": "PropertyValue",
        name: "Styles",
        value: styles.join(", "),
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