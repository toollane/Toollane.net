# Toollane – Master Project State

Stand: Juni 2026
Zweck: Diese Datei ist das zentrale Projektbriefing für neue Chats und zukünftige Arbeit an Toollane.

---

# 1. Projektüberblick

Toollane ist eine SEO-getriebene Online-Tools-Plattform unter:

https://toollane.net

Ziel ist der Aufbau eines langfristigen digitalen Assets mit vielen kostenlosen Online-Tools, organischem Google-Traffic und späterer Monetarisierung.

Vergleichbare Vorbilder:

* TinyWow
* ILovePDF
* SmallSEOTools
* Calculator.net
* RapidTables
* Convertio

Toollane soll moderner, schneller, mobiler, nutzerfreundlicher und strukturierter sein.

Langfristige Ziele:

* 150+ hochwertige kostenlose Online-Tools
* langfristig 100.000+ monatliche Besucher
* später 500.000+ bis 1.000.000+ monatliche Besucher
* Monetarisierung über Google AdSense
* später ggf. Ezoic, Mediavine oder Raptive
* Affiliate-Marketing in passenden Clustern
* hohe Automatisierung
* möglichst wenig manuelle Pflege
* langfristig möglichst passives Einkommen

Die Website ist auf Englisch.
Der Betreiber sitzt in Deutschland.

Deshalb relevant:

* DSGVO
* Cookie Consent
* Impressum
* Datenschutzerklärung
* Affiliate-Kennzeichnung
* EU-Recht

---

# 2. Tech-Stack

Toollane nutzt:

* Next.js App Router
* TypeScript
* Tailwind CSS
* GitHub
* Vercel
* VS Code auf Windows
* PowerShell

Deployment:

* lokal in VS Code entwickeln
* `npm run build`
* Git commit
* Git push
* Vercel deployed automatisch

---

# 3. Grundprinzipien

## Mobile First

Toollane wird primär für mobile Nutzer optimiert.

Alle neuen Tools, Hubs und Komponenten müssen zuerst auf Smartphone-Nutzung ausgelegt sein.

## Geschwindigkeit

Jede Änderung muss Performance berücksichtigen.

Bevorzugt:

* Server Components
* Static Generation
* wenig JavaScript
* keine unnötigen Libraries
* lokale Verarbeitung im Browser

Vermeiden:

* unnötige Client Components
* unnötige API-Aufrufe
* große Datenmengen im Frontend
* unnötige Einzeloptimierungen

## SEO First

Jede Seite soll langfristig ranken können.

Wichtig:

* klare Suchintention
* saubere H1
* gute H2-Struktur
* Meta Title
* Meta Description
* Canonical
* interne Links
* Kategorie- oder Hub-Struktur
* FAQ-Bereiche
* Keyword-Fokus
* hilfreicher Inhalt statt generischem Fülltext

## UX

Prioritäten:

1. Geschwindigkeit
2. Bedienbarkeit
3. Übersichtlichkeit
4. Mobile UX
5. Vertrauen
6. klares Design
7. klare Ergebnisse

---

# 4. Wichtige Arbeitsregel

Nicht jede Datei einzeln mehrfach optimieren.

Der bisherige Fehler war:

* einzelne Clients mehrfach anfassen
* einzelne `page.tsx` mehrfach ersetzen
* dieselben Dateien immer wieder manuell korrigieren

Ab jetzt gilt:

## Fokus auf Systeme

Bevorzugt werden zentrale Lösungen:

* zentrale Metadata
* zentrale Layouts
* zentrale Sitemap
* zentrale SEO-Strukturen
* zentrale Datenquellen
* zentrale Hub-Verlinkung
* zentrale Tool-Architektur

Wenn eine Änderung viele Seiten betrifft, muss eine systematische Lösung bevorzugt werden.

Beispiel:

Nicht 11 Real-Estate-Tool-Seiten einzeln anfassen.
Stattdessen `ToolPageLayout` + `data/hubs.ts` zentral erweitern.

---

# 5. Aktuelle Projektstruktur

Wichtige Struktur:

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
    page.tsx
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
  ConsentManager.tsx
  GoogleAnalytics.tsx
  AdSenseScript.tsx

data/
  tools.ts
  hubs.ts

  baby-names/
    database/
      baby-names.master.json
    incoming/
    sources/
    boys.json
    girls.json
    unisex.json
    names.json
    index.ts
    pages.ts
    taxonomy.ts

  pet-names/
    index.ts
    database/
    incoming/
    sources/

docs/
  TOOLLANE_STATE.md
```

---

# 6. Zentrale Datenquellen

## `data/tools.ts`

Zentrale Quelle für normale Tools.

Neue Tools müssen in `data/tools.ts` eingetragen werden, damit sie erscheinen in:

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

## `data/hubs.ts`

Zentrale Quelle für kuratierte Hub-Seiten.

Aktuell enthalten:

* Real Estate Calculators
* Baby Names

Diese Hubs werden in der Sitemap automatisch über `hubPages` aufgenommen.

`data/hubs.ts` enthält außerdem `toolHrefs`. Dadurch weiß `ToolPageLayout`, welche Tools automatisch eine Hub-Linkbox anzeigen sollen.

Beispiele:

* Real-Estate-Tools verlinken automatisch auf `/real-estate-calculators`
* Baby Name Generator verlinkt automatisch auf `/baby-names`

## `data/baby-names/pages.ts`

Zentrale Quelle für Baby-Name-Landingpages unter:

```txt
/baby-names/[type]
```

Beispiele:

* `/baby-names/girl`
* `/baby-names/boy`
* `/baby-names/unisex`
* `/baby-names/german-baby-names`
* `/baby-names/rare-baby-names`
* `/baby-names/girl-names-starting-with-a`

## `data/baby-names/database/baby-names.master.json`

Master-Datenbank für Baby-Name-Detailseiten.

Aktueller Stand:

* boys: 523
* girls: 509
* unisex: 211
* master: 1243

Summe:

```txt
523 + 509 + 211 = 1243
```

---

# 7. Kategorien

Aktuelle Hauptkategorien:

* Calculators
* Generators
* Image & PDF
* Developer
* SEO
* Business
* Text Tools

Kategorie-Seiten laufen über:

```txt
/category/[slug]
```

Beispiele:

* `/category/calculators`
* `/category/generators`
* `/category/image-pdf-tools`
* `/category/developer-tools`
* `/category/seo-tools`
* `/category/business-tools`
* `/category/text-tools`

Die Navbar nutzt bewusst wenige Hauptkategorien, damit sie nicht überladen wirkt.

---

# 8. Unterschied zwischen Tools, Kategorien und Hubs

## Normales Tool

Beispiel:

* `/pet-name-generator`
* `/mortgage-calculator`
* `/image-compressor`

Ein Tool braucht:

```txt
app/[tool-slug]/page.tsx
app/[tool-slug]/[ToolName]Client.tsx
data/tools.ts Eintrag
```

Dann erscheint es automatisch in:

* `/tools`
* Kategorie-Seiten
* Related Tools
* Sitemap

## Kategorie-Seite

Beispiel:

* `/category/calculators`
* `/category/seo-tools`

Wird automatisch aus `categories` in `data/tools.ts` erzeugt.

## Kuratierter Hub

Beispiel:

* `/real-estate-calculators`
* `/baby-names`

Ein Hub braucht:

```txt
app/[hub-slug]/page.tsx
data/hubs.ts Eintrag
```

Dann wird er über `data/hubs.ts` in die Sitemap aufgenommen.

---

# 9. Aktueller Sitemap-Stand

Aktuelle bestätigte Sitemap:

```txt
1609 URLs
```

Enthalten:

* normale Tools
* Kategorien
* statische Seiten
* Hub-Seiten aus `data/hubs.ts`
* Baby-Name-Landingpages
* Baby-Name-Detailseiten

Bestätigt:

```txt
real-estate-calculators -> True
pet-name-generator -> True
baby-names root hub -> True
```

Wichtiger Sitemap-Test:

```powershell
$sitemapLines = curl.exe -L -s "https://toollane.net/sitemap.xml?cachebust=$(Get-Random)"
$sitemapText = $sitemapLines -join "`n"

([regex]::Matches($sitemapText, "<loc>")).Count
$sitemapText.Contains("real-estate-calculators")
$sitemapText.Contains("pet-name-generator")
$sitemapText.Contains("<loc>https://toollane.net/baby-names</loc>")
```

PowerShell-Hinweis:

`curl.exe` gibt oft ein Zeilenarray zurück. Für `.Contains()` immer vorher joinen:

```powershell
$sitemapText = $sitemapLines -join "`n"
```

---

# 10. SEO- und Search-Console-Stand

Search Console ist eingerichtet.

Sitemap wurde bereits eingereicht.

Bekannte Situation:

* Google erkennt viele URLs
* aber Indexierung ist noch niedrig
* zuletzt waren deutlich weniger Seiten indexiert als in der Sitemap vorhanden
* Domain ist jung
* viele URLs wurden auf einmal erzeugt
* Google muss Seiten erst crawlen, bewerten und indexieren

Wichtig:

```txt
Sitemap True = Google kann die URL finden
Indexiert = Google hat die Seite aufgenommen
Ranking = Google hält die Seite für relevant genug
Traffic = Nutzer klicken auf Suchergebnisse
Umsatz = Traffic wird monetarisiert
```

Sitemap `True` bedeutet nicht automatisch Indexierung oder Ranking.

---

# 11. Bereits behobene SEO-Probleme

## Globales Canonical-Problem

Früher gab es wahrscheinlich ein globales Canonical zur Homepage.

Das wurde korrigiert.

Jetzt:

* Root global canonical entfernt bzw. nicht mehr falsch
* Tool-Seiten haben eigene Canonicals
* wichtige Live-Tests waren positiv

## Sitemap-Probleme

Zwischenzeitlich erkannte Search Console nur ca. 30 URLs.

Später wurden 1595, 1602, 1608 und zuletzt 1609 URLs erkannt.

Ursachen waren u. a.:

* veraltete Search-Console-Sitemap
* neue Tools fehlten in `data/tools.ts`
* PowerShell-Test war zunächst falsch
* Sitemap wurde dynamisch erzwungen

Aktuell gelöst.

## WebsiteSchema SearchAction

Früher gab es in `components/WebsiteSchema.tsx` eine ungültige SearchAction:

```txt
https://toollane.net/?q={search_term_string}
```

Das wurde entfernt.

Live-Test ergab:

```txt
SearchAction -> False
search_term_string -> False
potentialAction -> False
```

---

# 12. AdSense-Status

AdSense hatte Toollane wegen „Low Value Content“ abgelehnt.

Bereits verbessert:

* `ads.txt` autorisiert
* leere Anzeigen-Platzhalter entfernt
* Homepage verbessert
* `/tools` verbessert
* About verbessert
* Contact verbessert
* Privacy Policy verbessert
* Terms verbessert
* Imprint verbessert
* ToolContentSection verbessert
* Sitemap korrigiert
* Canonicals korrigiert
* SearchAction entfernt
* Real-Estate-Cluster gestärkt
* Baby-Name-Hub ergänzt
* Pet Name Generator ergänzt

Wichtig:

Aktuell keine hektischen Legal-/Canonical-/Sitemap-Änderungen ohne klaren Fehler.

Vor erneutem AdSense-Review:

* technische Basis stabil lassen
* keine leeren Anzeigenplätze
* keine unfertigen Tools live
* mehr hochwertige Cluster
* bessere interne Verlinkung

Nach AdSense-Freigabe:

* echte AdSense-Slots einbauen
* nicht zu aggressiv
* EU-/Cookie-Consent sauber berücksichtigen
* Datenschutzseite ggf. final anpassen

---

# 13. Consent und rechtliche Seiten

Vorhanden:

* About
* Contact
* Privacy Policy
* Terms
* Imprint

Cookie-/Consent-System vorhanden:

* Analytics Opt-In
* Marketing Opt-In
* Google Consent Mode

Dateien:

* `ConsentManager.tsx`
* `GoogleAnalytics.tsx`
* `AdSenseScript.tsx`

Wichtig:

Vor AdSense-Genehmigung keine aggressiven Anzeigenplätze einbauen.

---

# 14. ToolPageLayout

`components/ToolPageLayout.tsx` ist zentral.

Vorhanden:

* Breadcrumbs
* Breadcrumb Schema
* Tool Schema
* FAQ Schema
* FAQ Section
* Related Tools
* Tool Content Section
* automatische Hub-Linkbox über `data/hubs.ts`

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

Wichtig:

Wenn ein Tool in `data/hubs.ts` unter `toolHrefs` steht, zeigt `ToolPageLayout` automatisch eine Hub-Linkbox.

---

# 15. ToolContentSection

`ToolContentSection` ist vorhanden.

Enthält u. a.:

* About Tool
* How To Use
* Benefits
* Who Is This Tool For
* Why Use Toollane

Mit kategoriebasierten Texten.

---

# 16. RelatedTools

`RelatedTools` ist implementiert.

Zeigt ähnliche Tools derselben Kategorie.

Wichtig:

Für thematisch stärkere Cluster werden zusätzlich Hub-Links über `data/hubs.ts` verwendet.

---

# 17. Baby Name Cluster

Der Baby-Name-Bereich ist das größte SEO-Projekt bisher.

Aktueller Stand:

* 1243 Baby-Name-Detailseiten
* 178 Baby-Name-Landingpages
* Baby Name Generator
* Root-Hub `/baby-names`

Struktur:

```txt
/baby-names                    -> zentraler Hub
/baby-name-generator           -> Tool
/baby-names/[type]             -> Landingpages
/baby-name/[id]                -> Detailseiten
```

Vorhandene Landingpage-Typen:

* Gender
* Origins
* Styles
* Popularity
* Starting Letter
* curated SEO collections

Beispiele:

* `/baby-names/girl`
* `/baby-names/boy`
* `/baby-names/unisex`
* `/baby-names/german-baby-names`
* `/baby-names/french-baby-names`
* `/baby-names/girl-names-starting-with-a`
* `/baby-names/rare-baby-names`
* `/baby-names/old-money-baby-names`

Generator-Features:

* Gender
* Origin / country style
* Style
* Popularity
* Starts with
* Ends with
* Surname compatibility
* Max length
* Favorites
* Copy results
* Copy favorites

Wichtig:

Nicht mehr einfach blind weitere Baby-Name-Seiten erzeugen.

Nächste sinnvolle Baby-Name-Arbeiten:

* interne Links weiter verbessern
* dünne Landingpages identifizieren
* stärkste Landingpages priorisieren
* Detailseiten qualitativ verbessern
* Pet Names langfristig ähnlich, aber kontrollierter aufbauen

---

# 18. Pet Name Generator

Pet Name Generator wurde gestartet.

Dateien:

```txt
app/pet-name-generator/page.tsx
app/pet-name-generator/PetNameGeneratorClient.tsx
data/pet-names/index.ts
```

Datenstruktur bewusst ähnlich wie Baby Names vorbereitet:

```txt
data/pet-names/
  index.ts
  database/
  incoming/
  sources/
```

Aktueller Status:

* Starter-Datensatz mit kuratierten Pet Names
* Tierart
* Gender
* Style
* Popularity
* Breed-/Personality-Presets
* Filter im Generator
* Favorites
* Copy results
* Copy favorites

Langfristig soll der Datensatz datenbasiert erweitert werden.

Mögliche offene Datenquellen:

* Seattle Pet Licenses
* NYC Dog Licensing Dataset
* Cambridge dog license data

Wichtig:

Pet Name Generator ist ein normales Tool und steht in `data/tools.ts`.

Aktueller Sitemap-Test:

```txt
pet-name-generator -> True
```

---

# 19. Real-Estate-/Mortgage-Cluster

Aktuelle Real-Estate-/Mortgage-Tools:

* Mortgage Calculator
* Rent vs Buy Calculator
* Home Affordability Calculator
* Mortgage Refinance Calculator
* Mortgage Payoff Calculator
* Closing Cost Calculator
* Down Payment Calculator
* Property Tax Calculator
* Rental Property Calculator
* Mortgage Comparison Calculator
* Amortization Calculator

Hub:

```txt
/real-estate-calculators
```

Der Hub verlinkt auf alle wichtigen Real-Estate-Tools.

`ToolPageLayout` zeigt auf Real-Estate-Tools automatisch eine Hub-Linkbox, weil diese Tools in `data/hubs.ts` unter `toolHrefs` gelistet sind.

Aktueller Sitemap-Test:

```txt
real-estate-calculators -> True
```

---

# 20. Pet / Baby / Real-Estate aktuelle URL-Zahlen

Aktuelle Sitemap:

```txt
1609 URLs
```

Baby Names:

```txt
Baby name detail pages -> 1243
Baby name landing pages -> 178
Baby name generator -> True
Baby names root hub -> True
```

Pet Names:

```txt
pet-name-generator -> True
```

Real Estate:

```txt
real-estate-calculators -> True
```

---

# 21. Design- und UX-Standard

Toollane-Design:

* clean
* modern
* rounded
* mobile-first
* schnell
* weiß/schwarz/gelblich
* Premium-Tool-Gefühl

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

Neue Premium-Tools sollen mindestens enthalten:

* klare Input Cards
* gute Ergebnisboxen
* Presets / Beispiele
* bessere Fehlermeldungen
* mobile-first Layout
* klare Call-to-Actions
* hilfreiche Hinweise
* ggf. Copy / Download / Favorites
* Browser-based Privacy Hinweis bei Datei-Tools
* FAQ
* Related Tools
* Hub-Verlinkung, wenn relevant

---

# 22. Code-Konventionen

## Client-Dateien

Client-Dateien verwenden:

```tsx
"use client";
```

## Numerische Inputs

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

Grund:

Bei `type="number"` und Number-State entstehen Bugs wie:

```txt
0 -> 10 eingeben -> 010
```

## ToolErrorBox

Richtig:

```tsx
<ToolErrorBox message={error} />
```

Falsch:

```tsx
<ToolErrorBox>{error}</ToolErrorBox>
```

---

# 23. Git-Workflow

Immer erst Build testen:

```powershell
npm run build
```

Dann Status:

```powershell
git status -sb
```

Dann gezielt adden.

Nicht blind `git add .`, wenn ungetrackte oder unfertige Dateien vorhanden sind.

Beispiel:

```powershell
git add app/baby-names/page.tsx
git add data/hubs.ts
git commit -m "Add baby names hub"
git push
```

Nach Push:

```txt
Vercel -> Deployments -> neuester Commit muss Ready sein
```

Dann Sitemap prüfen.

---

# 24. PowerShell-Tests

## Sitemap abrufen

```powershell
$sitemapLines = curl.exe -L -s "https://toollane.net/sitemap.xml?cachebust=$(Get-Random)"
$sitemapText = $sitemapLines -join "`n"

([regex]::Matches($sitemapText, "<loc>")).Count
```

## Slug prüfen

```powershell
$sitemapText.Contains("pet-name-generator")
$sitemapText.Contains("real-estate-calculators")
$sitemapText.Contains("<loc>https://toollane.net/baby-names</loc>")
```

## Statuscodes prüfen

```powershell
$pages = @(
  "https://toollane.net/",
  "https://toollane.net/tools",
  "https://toollane.net/baby-names",
  "https://toollane.net/baby-name-generator",
  "https://toollane.net/real-estate-calculators",
  "https://toollane.net/pet-name-generator"
)

foreach ($url in $pages) {
  $code = curl.exe -L -s -o NUL -w "%{http_code}" $url
  "$code -> $url"
}
```

## noindex prüfen

```powershell
$pages = @(
  "https://toollane.net/",
  "https://toollane.net/tools",
  "https://toollane.net/baby-names",
  "https://toollane.net/baby-name-generator",
  "https://toollane.net/real-estate-calculators",
  "https://toollane.net/pet-name-generator"
)

foreach ($url in $pages) {
  $html = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content
  "$url -> noindex: " + ($html -match "noindex")
}
```

## SearchAction prüfen

```powershell
$html = (Invoke-WebRequest -Uri "https://toollane.net?cachebust=$(Get-Random)" -UseBasicParsing).Content

$html.Contains("SearchAction")
$html.Contains("search_term_string")
$html.Contains("potentialAction")
```

Soll:

```txt
False
False
False
```

---

# 25. Alte Zahlen, die überholt sind

Diese alten Angaben aus früheren Briefings sind überholt:

* 156 Tools live
* 1596 statische Seiten
* 1602 Sitemap URLs
* 309 Baby Names
* Property Tax / Rental Property noch geplant
* Real-Estate-Hub noch geplant

Aktuell gilt:

* Sitemap: 1609 URLs
* Baby Names: 1243 Detailseiten
* Baby Name Landingpages: 178
* Real-Estate-Hub: live
* Pet Name Generator: live
* Baby Names Root Hub: live

---

# 26. Aktuelle Strategie

Nicht einfach mehr Seiten bauen.

Stattdessen:

1. Bestehende Cluster stärken
2. Hubs ausbauen
3. interne Links verbessern
4. Top-Tools premiumisieren
5. Search Console auswerten
6. AdSense-Freigabe vorbereiten
7. erst danach weitere große Cluster bauen

Wichtige Cluster:

* Baby Names
* Pet Names
* Real Estate / Mortgage
* PDF / Image
* Business / Finance
* Calculators

---

# 27. Aktuelle Prioritäten

## Kurzfristig

1. Dokumentation aktuell halten
2. Baby-Name-Hub live prüfen
3. Hub-Linkbox auf Baby Name Generator prüfen
4. Search Console beobachten
5. AdSense-Stabilität vorbereiten
6. keine hektischen SEO-Strukturänderungen ohne klaren Grund

## Danach

1. Baby-Name-Cluster qualitativ verbessern
2. Pet-Name-Datenbasis mit Open Data erweitern
3. Top-Tools premiumisieren
4. Real-Estate-Cluster weiter optimieren
5. PDF/Image Top-Tools verbessern

## Später

1. Pet-Name-Cluster ausbauen
2. weitere Hubs nur bei echter Notwendigkeit
3. Affiliate-Möglichkeiten prüfen
4. AdSense-Slots nach Genehmigung sauber integrieren
5. bessere Ad Networks bei ausreichend Traffic

---

# 28. Was aktuell nicht gemacht werden sollte

Aktuell nicht:

* keine zufälligen Massen-Seiten
* keine unfertigen Tools live lassen
* keine neuen Hubs ohne Datenquelle
* keine doppelten Hub-Systeme
* keine unüberlegten Sitemap-Umbauten
* keine AdSense-Platzhalter vor Genehmigung
* keine ständigen Legal-Seiten-Änderungen
* keine 100+ Seiten manuell anfassen, wenn zentrale Lösung möglich ist

---

# 29. Arbeitsweise für neue Chats

Neue Chats sollen immer zuerst diese Datei lesen.

Startprompt für neue Chats:

```txt
Bitte arbeite anhand von docs/TOOLLANE_STATE.md.
Lies zusätzlich den Live-Stand von https://toollane.net, falls nötig.
Antworte auf Deutsch.
Gib vollständige Dateien, keine kleinen Snippets.
Schreibe exakte PowerShell-Commands.
Keine Platzhalter wie git add ...
SEO, AdSense, interne Verlinkung, Sitemap und langfristige Monetarisierung immer mitdenken.
```

Wenn Code geliefert wird:

* komplette Datei liefern
* keine Fragmente
* keine unklaren Einfügeorte
* exakte Dateipfade nennen
* nach Möglichkeit zentrale Lösung bevorzugen

---

# 30. Nächster sinnvoller Schritt

Nach aktuellem Stand:

1. `docs/TOOLLANE_STATE.md` speichern
2. `npm run build`
3. Dokumentation committen
4. prüfen, ob `/baby-names` und Hub-Linkbox live korrekt sind
5. danach entscheiden:

Option A:

* Baby-Name-Cluster intern weiter verbessern

Option B:

* Pet-Name-Datenbasis mit Open Data vorbereiten

Option C:

* Top-Tools premiumisieren

Empfohlener nächster Arbeitsblock:

```txt
Baby-Name-Hub und Baby-Name-Generator-Verlinkung prüfen.
Danach Baby-Name-Cluster qualitative Verbesserungen planen.
```
