# Toollane – Project State

Stand: nach Real-Estate-Hub, Pet Name Generator und zentraler Hub-Verlinkung

## 1. Projektüberblick

Toollane ist eine SEO-getriebene Online-Tools-Plattform unter:

https://toollane.net

Ziel ist der Aufbau eines langfristigen digitalen Assets mit kostenlosen Online-Tools, organischem Google-Traffic und späterer Monetarisierung über Werbung, Affiliate-Partnerschaften und eventuell weitere digitale Modelle.

Toollane soll langfristig eine moderne, schnelle, mobile und nutzerfreundliche Alternative zu bekannten Online-Tool-Plattformen werden.

Vergleichbare Vorbilder:

* TinyWow
* ILovePDF
* SmallSEOTools
* Calculator.net
* RapidTables
* Convertio

Langfristige Ziele:

* viele hochwertige Tools
* starke SEO-Cluster
* organischer Google-Traffic
* AdSense-Freigabe
* später ggf. bessere Werbenetzwerke
* Affiliate-Monetarisierung in passenden Clustern
* langfristig möglichst passives Einkommen

Die Website ist auf Englisch. Der Betreiber sitzt in Deutschland.

---

## 2. Tech-Stack

Toollane ist ein Next.js-Projekt mit:

* App Router
* TypeScript
* Tailwind CSS
* GitHub
* Vercel
* VS Code auf Windows
* PowerShell als bevorzugte Kommandozeile

Deployment:

* lokal in VS Code entwickeln
* `npm run build`
* Git commit
* Git push
* Vercel deployed automatisch

Live-Domain:

https://toollane.net

---

## 3. Wichtige Projektstruktur

Aktuelle Grundstruktur:

```txt
app/
  page.tsx
  tools/
    page.tsx
  category/
    [slug]/
      page.tsx
  sitemap.ts

  baby-name/
    [id]/
      page.tsx

  baby-name-generator/
    page.tsx
    BabyNameGeneratorClient.tsx

  baby-names/
    [type]/
      page.tsx

  real-estate-calculators/
    page.tsx

  pet-name-generator/
    page.tsx
    PetNameGeneratorClient.tsx

components/
  ToolPageLayout.tsx
  ToolContentSection.tsx
  ToolInfoBox.tsx
  ToolResultBox.tsx
  ToolErrorBox.tsx
  RelatedTools.tsx
  FAQSection.tsx
  FAQSchema.tsx
  Breadcrumbs.tsx
  BreadcrumbSchema.tsx
  ToolSchema.tsx
  WebsiteSchema.tsx
  BabyNameSchema.tsx

data/
  tools.ts
  hubs.ts

  baby-names/
    database/
      baby-names.master.json
    incoming/
      boy-candidates.json
      boys.final.json
      girl-candidates.json
      girls.final.json
      unisex-candidates.json
      unisex.final.json
    sources/
      ssa/
        yob2025.txt
    boys.json
    girls.json
    index.ts
    names.json
    pages.ts
    taxonomy.ts
    unisex.json

  pet-names/
    index.ts
    database/
    incoming/
    sources/
```

---

## 4. Zentrale Datenquellen

### `data/tools.ts`

Diese Datei ist die zentrale Quelle für normale Tools.

Neue Tools müssen hier eingetragen werden, damit sie erscheinen in:

* `/tools`
* Kategorie-Seiten
* Related Tools
* Sitemap
* interner Navigation

Typischer Tool-Eintrag:

```ts
{
  category: "Calculators",
  categorySlug: "calculators",
  name: "Tool Name",
  shortName: "Short Name",
  description: "...",
  seoTitle: "...",
  seoDescription: "...",
  href: "/tool-slug",
  icon: "...",
  popular: false,
  keywords: [...],
  faqs: [
    {
      question: "...",
      answer: "...",
    },
  ],
}
```

### `data/hubs.ts`

Diese Datei ist die zentrale Quelle für kuratierte Hub-Seiten, die keine normalen Tools und keine normalen Kategorien sind.

Aktuell enthalten:

* Real Estate Calculators

Beispiel:

```ts
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
] as const;
```

Wichtig:

* Normale Tools gehören in `data/tools.ts`.
* Kuratierte Hub-Seiten gehören in `data/hubs.ts`.
* Kategorien kommen aus `categories` in `data/tools.ts`.
* Baby-Name-Landingpages kommen aus `data/baby-names/pages.ts`.

---

## 5. Sitemap-System

Datei:

```txt
app/sitemap.ts
```

Die Sitemap zieht aktuell dynamisch aus:

* statischen Seiten
* `data/hubs.ts`
* `categories` aus `data/tools.ts`
* `tools` aus `data/tools.ts`
* `babyNamePages`
* `babyNames`

Oben in `app/sitemap.ts` steht:

```ts
export const dynamic = "force-dynamic";
export const revalidate = 0;
```

Aktueller bestätigter Sitemap-Stand:

```txt
1608 URLs
```

Bestätigt enthalten:

```txt
real-estate-calculators -> True
pet-name-generator -> True
```

Wichtiger PowerShell-Test:

```powershell
$sitemapLines = curl.exe -L -s "https://toollane.net/sitemap.xml?cachebust=$(Get-Random)"
$sitemapText = $sitemapLines -join "`n"

$sitemapText.Contains("real-estate-calculators")
$sitemapText.Contains("pet-name-generator")
([regex]::Matches($sitemapText, "<loc>")).Count
```

---

## 6. Aktuelle Kategorien

Toollane hat aktuell folgende Hauptkategorien:

```txt
Calculators
Generators
Image & PDF
Developer
SEO
Business
Text Tools
```

Kategorie-Seiten werden automatisch über:

```txt
/category/[slug]
```

erzeugt.

Beispiele:

```txt
/category/calculators
/category/generators
/category/image-pdf-tools
/category/developer-tools
/category/seo-tools
/category/business-tools
/category/text-tools
```

Diese Kategorie-Seiten sind keine Sonder-Hubs, sondern generische Kategorie-Seiten.

---

## 7. Unterschied zwischen Kategorien, Tools und Hubs

Wichtig für neue Chats:

### Normales Tool

Beispiel:

```txt
/pet-name-generator
/mortgage-calculator
/image-compressor
```

Ein normales Tool braucht:

```txt
app/[tool-slug]/page.tsx
app/[tool-slug]/[ToolName]Client.tsx
data/tools.ts Eintrag
```

Dann erscheint es automatisch in:

```txt
/tools
/category/[slug]
Related Tools
Sitemap
```

### Kategorie-Seite

Beispiel:

```txt
/category/calculators
/category/seo-tools
```

Wird aus `categories` in `data/tools.ts` erzeugt.

### Kuratierter Hub

Beispiel:

```txt
/real-estate-calculators
```

Ein kuratierter Hub braucht:

```txt
app/[hub-slug]/page.tsx
data/hubs.ts Eintrag
```

Dann erscheint er automatisch in der Sitemap über `hubPages`.

---

## 8. Aktueller Real-Estate-/Mortgage-Cluster

Aktuelle relevante Tools:

```txt
Mortgage Calculator
Rent vs Buy Calculator
Home Affordability Calculator
Mortgage Refinance Calculator
Mortgage Payoff Calculator
Closing Cost Calculator
Down Payment Calculator
Property Tax Calculator
Rental Property Calculator
Mortgage Comparison Calculator
Amortization Calculator
```

Aktueller Hub:

```txt
/real-estate-calculators
```

Diese Hub-Seite verlinkt auf alle wichtigen Real-Estate-Tools.

Zusätzlich wurde `ToolPageLayout.tsx` so erweitert, dass Real-Estate-Tool-Seiten automatisch eine Hub-Linkbox anzeigen, wenn ihre `href` in `data/hubs.ts` unter `toolHrefs` enthalten ist.

Dadurch werden die Real-Estate-Tools zentral und einheitlich mit dem Hub verbunden.

---

## 9. Pet Name Generator

Der Pet Name Generator wurde als neues Tool gestartet.

Dateien:

```txt
app/pet-name-generator/page.tsx
app/pet-name-generator/PetNameGeneratorClient.tsx
data/pet-names/index.ts
```

Die Datenstruktur wurde bewusst ähnlich wie beim Baby-Name-Bereich vorbereitet:

```txt
data/pet-names/
  index.ts
  database/
  incoming/
  sources/
```

Aktuell ist `data/pet-names/index.ts` ein Starter-Datensatz mit kuratierten Pet Names, Tierarten, Styles, Gender, Popularity und Breed-/Personality-Presets.

Langfristig soll der Pet-Name-Datensatz mit offenen Datenquellen erweitert werden, z. B.:

* Seattle Pet Licenses
* NYC Dog Licensing Dataset
* Cambridge dog license data

Wichtig:

Der Pet Name Generator ist ein normales Tool und steht daher in `data/tools.ts`.

Aktueller Sitemap-Test:

```txt
pet-name-generator -> True
```

---

## 10. Baby Name Generator

Der Baby Name Generator ist kein kleines Einzeltool mehr, sondern bereits ein größerer Cluster.

Aktuelle Struktur:

```txt
app/baby-name/[id]/page.tsx
app/baby-name-generator/page.tsx
app/baby-name-generator/BabyNameGeneratorClient.tsx
app/baby-names/[type]/page.tsx

data/baby-names/
  database/
  incoming/
  sources/
  index.ts
  pages.ts
  taxonomy.ts
```

Es gibt rund 1500 Baby-Name-Seiten.

Der Baby-Name-Bereich enthält bereits:

* Boy Names
* Girl Names
* Unisex Names
* Old Names
* weitere Cluster/Landingpages
* Detailseiten
* Filter im Generator
* Favorites
* Copy-Funktion
* Surname Compatibility
* Origin/Country Style
* Style-Filter
* Popularity
* Starts With
* Ends With
* Max Length

Wichtig:

Vor neuen Baby-Name-Arbeiten muss der aktuelle Stand genauer analysiert werden. Nicht davon ausgehen, dass Boy/Girl/Old Names noch fehlen.

---

## 11. Aktueller SEO-/Indexierungsstand

Wichtige bestätigte technische Punkte:

```txt
robots.txt okay
Sitemap live okay
Statuscodes okay
kein noindex bekannt
Canonicals wurden korrigiert
SearchAction aus WebsiteSchema entfernt
Sitemap dynamisch erzwungen
```

Aktueller Sitemap-Stand:

```txt
1608 URLs
```

Search Console hatte zuletzt deutlich weniger indexierte Seiten als vorhandene Sitemap-URLs.

Einschätzung:

```txt
kein klarer aktiver großer technischer Fehler bekannt
Google verarbeitet die neue Struktur noch
Domain ist jung
viele URLs wurden auf einmal erzeugt
Indexierung braucht Zeit
Qualitätssignale müssen wachsen
```

Wichtig:

Sitemap `True` bedeutet nur, dass Google die URL finden kann. Es bedeutet nicht automatisch Indexierung oder Ranking.

---

## 12. AdSense-Status

AdSense hatte Toollane wegen „Low Value Content“ abgelehnt.

Bereits verbessert:

```txt
ads.txt autorisiert
AdSense-Platzhalter entfernt
Homepage verbessert
/tools-Seite verbessert
About-Seite verbessert
Contact-Seite verbessert
Privacy Policy verbessert
Terms verbessert
Imprint verbessert
ToolContentSection verbessert
Sitemap korrigiert
Canonicals korrigiert
SearchAction entfernt
Real-Estate-Cluster gestärkt
Pet Name Generator ergänzt
```

Wichtig:

Vor erneutem AdSense-Review nicht ständig Legal-/Canonical-/Sitemap-Struktur ändern, solange kein klarer Fehler vorliegt.

Ziel vor erneuter Einreichung:

```txt
mehr hochwertige Cluster
bessere interne Verlinkung
stabiler technischer Stand
keine leeren Anzeigenplätze
keine unfertigen Tools live
```

---

## 13. Wichtige Code-Konventionen

### Numerische Inputs

Numerische Inputs sollen als String-State gehalten werden.

Richtig:

```tsx
const [value, setValue] = useState("1000");

<input
  type="text"
  inputMode="decimal"
  value={value}
  onChange={(event) => setValue(event.target.value)}
/>
```

Nicht direkt Number-State verwenden.

### ToolErrorBox

`ToolErrorBox` erwartet:

```tsx
<ToolErrorBox message={error} />
```

Nicht:

```tsx
<ToolErrorBox>{error}</ToolErrorBox>
```

### ToolPageLayout

Neue Tools nutzen typischerweise:

```tsx
<ToolPageLayout
  title="Tool Name"
  description="..."
  href="/tool-slug"
>
  <ToolClient />
</ToolPageLayout>
```

`ToolPageLayout` erzeugt:

* Breadcrumbs
* ToolSchema
* FAQSchema
* ToolContentSection
* RelatedTools
* ggf. automatische Hub-Linkbox über `data/hubs.ts`

---

## 14. Design-Stil

Toollane-Design:

```txt
clean
modern
rounded
mobile-first
weiß/schwarz/gelblich
premium Tool-Gefühl
```

Typische Klassen:

```txt
rounded-2xl
rounded-[2rem]
border border-black/10
bg-white
bg-[#fff8df]
shadow-sm
text-black
```

Buttons oft:

```txt
bg-black text-white
rounded-2xl
font-bold
```

---

## 15. Git-/Build-Workflow

Immer erst Build testen:

```powershell
npm run build
```

Dann Status:

```powershell
git status -sb
```

Dann gezielt adden, keine unüberlegten `git add .` verwenden.

Beispiel:

```powershell
git add app/pet-name-generator/page.tsx
git add app/pet-name-generator/PetNameGeneratorClient.tsx
git add data/pet-names/index.ts
git add data/tools.ts
```

Dann:

```powershell
git status -sb
git commit -m "Commit message"
git push
```

Nach Push:

```txt
Vercel → Deployments → neuester Commit muss Ready sein
```

Dann Sitemap prüfen.

---

## 16. Wichtige PowerShell-Tests

### Sitemap abrufen

```powershell
$sitemapLines = curl.exe -L -s "https://toollane.net/sitemap.xml?cachebust=$(Get-Random)"
$sitemapText = $sitemapLines -join "`n"

([regex]::Matches($sitemapText, "<loc>")).Count
```

### Slug prüfen

```powershell
$sitemapText.Contains("pet-name-generator")
$sitemapText.Contains("real-estate-calculators")
```

### Datei lokal prüfen

```powershell
Test-Path ".\app\pet-name-generator\page.tsx"
Test-Path ".\app\pet-name-generator\PetNameGeneratorClient.tsx"
```

### Inhalt prüfen

```powershell
$toolsText = Get-Content ".\data\tools.ts" -Raw
$toolsText.Contains("pet-name-generator")
```

---

## 17. Aktuelle Roadmap

### Kurzfristig

```txt
1. Technischen Stand stabil halten
2. Real-Estate-Cluster mit Hub-Linkbox stärken
3. Pet Name Generator prüfen und später erweitern
4. docs/TOOLLANE_STATE.md aktuell halten
5. Search Console beobachten
```

### Danach

```txt
1. Baby-Name-Cluster analysieren
2. Pet-Name-Datensatz mit Open Data erweitern
3. Top-Tools premiumisieren
4. Weitere sinnvolle Hubs identifizieren
5. AdSense erneut vorbereiten
```

### Später

```txt
1. Pet-Name-Cluster ausbauen
2. weitere Landingpages nur bei echter Qualität
3. Real-Estate-Cluster weiter vertiefen
4. Business-/Finance-Tools monetarisierbarer machen
5. Affiliate-Möglichkeiten prüfen
```

---

## 18. Was aktuell nicht gemacht werden sollte

Aktuell nicht:

```txt
keine zufälligen Massen-Seiten
keine unfertigen Tools live lassen
keine neuen Hubs ohne Datenquelle
keine doppelten Hub-Systeme
keine unüberlegten Sitemap-Umbauten
keine AdSense-Platzhalter vor Genehmigung
keine ständigen Legal-Seiten-Änderungen
```

---

## 19. Arbeitsweise für neue Chats

In neuen Chats immer zuerst sagen:

```txt
Bitte arbeite anhand von docs/TOOLLANE_STATE.md.
Lies zusätzlich den Live-Stand von https://toollane.net, falls nötig.
Antworte auf Deutsch.
Gib vollständige Dateien, keine kleinen Snippets.
Schreibe exakte PowerShell-Commands.
Keine Platzhalter wie git add ...
```

Wenn möglich, zusätzlich relevante Datei einfügen, z. B.:

```txt
components/ToolPageLayout.tsx
app/sitemap.ts
data/tools.ts Ausschnitt
BabyNameGeneratorClient.tsx
```

---

## 20. Nächster sinnvoller Schritt

Nach aktuellem Stand ist der nächste sinnvolle Schritt:

```txt
Baby-Name-Cluster analysieren
```

Dafür nicht tausende Zeilen kopieren, sondern zunächst diese Dateien oder Ausschnitte bereitstellen:

```txt
data/baby-names/pages.ts
data/baby-names/taxonomy.ts
data/baby-names/index.ts
BabyNameGeneratorClient.tsx
```

Danach kann entschieden werden:

```txt
welche Baby-Name-Seiten verbessert werden
welche internen Links fehlen
welche Cluster stark sind
welche Cluster noch Potenzial haben
ob Pet Names ähnlich aufgebaut werden sollen
```
