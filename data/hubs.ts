export const hubs = [
  {
    name: "Real Estate Calculators",
    href: "/real-estate-calculators",
    changeFrequency: "weekly",
    priority: 0.85,
    linkTitle: "Explore all real estate calculators",
    linkDescription:
      "Compare mortgage, home buying, refinancing, property tax, rent vs buy and rental property calculators in one place.",
    toolHrefs: [
      "/mortgage-calculator",
      "/rent-vs-buy-calculator",
      "/home-affordability-calculator",
      "/property-tax-calculator",
      "/rental-property-calculator",
      "/mortgage-comparison-calculator",
      "/amortization-calculator",
      "/mortgage-refinance-calculator",
      "/mortgage-payoff-calculator",
      "/closing-cost-calculator",
      "/down-payment-calculator",
    ],
  },
  {
    name: "Baby Names",
    href: "/baby-names",
    changeFrequency: "weekly",
    priority: 0.9,
    linkTitle: "Explore all baby name collections",
    linkDescription:
      "Browse baby names by gender, origin, style, popularity and starting letter, or use the Baby Name Generator for personalized ideas.",
    toolHrefs: ["/baby-name-generator"],
  },
] as const;