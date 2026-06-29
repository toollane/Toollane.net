# Toollane – Baby Name Compare Tool Spec

Stand: Juni 2026
Status: Spezifikation / Vorbereitung
Geplante Umsetzung: nach AdSense-Rückmeldung

---

# 1. Ziel des Tools

Das Baby Name Compare Tool soll Eltern helfen, mehrere Babynamen direkt miteinander zu vergleichen.

Die Idee:

```txt
Nutzer haben 2–4 Favoriten und wollen besser entscheiden, welcher Name am besten passt.
```

Das Tool soll nicht einfach nur Namen anzeigen, sondern eine Entscheidung erleichtern.

Es stärkt den bestehenden Baby-Name-Cluster:

```txt
/baby-names
/baby-name-generator
/baby-name/[id]
/baby-names/[type]
```

---

# 2. Warum dieses Tool strategisch stark ist

Das Baby Name Compare Tool ist der beste erste Kandidat aus der Baby Name Companion Suite.

Gründe:

* nutzt vorhandene Baby-Name-Daten
* stärkt den größten bestehenden SEO-Cluster
* hat emotionalen Nutzerwert
* ist relativ risikoarm
* erzeugt starke interne Links
* kann Nutzer länger auf Toollane halten
* unterscheidet Toollane von klassischen Tool-Sammlungen
* passt sehr gut zur Toollane-Marke

Strategischer Wert:

```txt
Toollane wird nicht nur ein Generator, sondern ein Entscheidungshelfer.
```

---

# 3. Geplante Route

Vorgeschlagene URL:

```txt
/baby-name-compare
```

Alternative URLs:

```txt
/baby-name-comparison
/compare-baby-names
```

Empfehlung:

```txt
/baby-name-compare
```

Warum:

* kurz
* klar
* verständlich
* gute Suchintention
* passt zu Toollane-Slug-Stil

---

# 4. Geplante Dateien

Das Tool soll als normales Tool gebaut werden.

Benötigte Dateien:

```txt
app/baby-name-compare/page.tsx
app/baby-name-compare/BabyNameCompareClient.tsx
```

Zusätzlich:

```txt
data/tools.ts
```

Optional später:

```txt
data/hubs.ts
```

Wenn das Tool zur Name Lane / Baby Names Hub-Linkbox gehören soll, kann es später in `data/hubs.ts` bei Baby Names unter `toolHrefs` ergänzt werden.

---

# 5. ToolPageLayout

Das Tool soll die bestehende zentrale Tool-Architektur nutzen.

`page.tsx` soll ungefähr so aufgebaut sein:

```tsx
import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import BabyNameCompareClient from "./BabyNameCompareClient";

export const metadata: Metadata = {
  title: "Baby Name Compare Tool | Toollane",
  description:
    "Compare baby names by meaning, origin, style, popularity, length and surname fit with Toollane's free baby name comparison tool.",
  alternates: {
    canonical: "https://toollane.net/baby-name-compare",
  },
};

export default function BabyNameComparePage() {
  return (
    <ToolPageLayout
      title="Baby Name Compare Tool"
      description="Compare baby names side by side by meaning, origin, style, popularity and fit."
      href="/baby-name-compare"
    >
      <BabyNameCompareClient />
    </ToolPageLayout>
  );
}
```

Wichtig:

* vollständige Datei liefern
* keine Snippets
* ToolPageLayout nutzen
* `href="/baby-name-compare"` setzen
* Canonical sauber setzen

---

# 6. Datenquelle

Das Tool soll vorhandene Baby-Name-Daten verwenden.

Wichtige Datenquelle:

```txt
data/baby-names/database/baby-names.master.json
```

oder über bestehende Exporte aus:

```txt
data/baby-names/index.ts
```

Vor Umsetzung prüfen:

```txt
Welche Exporte gibt es aktuell aus data/baby-names/index.ts?
Welche TypeScript-Typen existieren?
Wie ist BabyName aufgebaut?
```

Erwartete Felder ungefähr:

```txt
id
name
gender
meaning
origins
styles
tags
popularity
variants
```

Nicht neu duplizieren, sondern vorhandene Daten nutzen.

---

# 7. Kernfunktion

Nutzer sollen 2–4 Namen vergleichen können.

MVP:

```txt
Name 1
Name 2
optional Name 3
optional Name 4
optional surname
```

Nutzer gibt Namen ein oder wählt aus Vorschlägen.

Dann zeigt das Tool einen Vergleich.

---

# 8. Eingaben

## 8.1 Name-Felder

Felder:

```txt
First name
Second name
Third name optional
Fourth name optional
```

UX-Idee:

* Eingabefeld mit Vorschlägen aus vorhandener Datenbank
* Nutzer kann Namen eintippen
* wenn Name existiert, werden Daten geladen
* wenn Name nicht existiert, wird Name als Custom Name behandelt

MVP-Entscheidung:

```txt
Zunächst nur Namen aus der vorhandenen Datenbank vollständig auswerten.
Custom Names können angezeigt werden, aber ohne vollständige Daten.
```

---

## 8.2 Surname optional

Optionales Feld:

```txt
Last name / surname
```

Zweck:

* Länge prüfen
* Initialen anzeigen
* grober Flow-/Rhythmus-Hinweis
* keine falsche Genauigkeit behaupten

Hinweis:

```txt
Surname compatibility is only a simple guide. Name fit is personal and cultural.
```

---

## 8.3 Vergleichsmodus

Mögliche Modi:

```txt
Balanced
Classic
Modern
Rare
Elegant
Short
Strong
International
```

MVP:

```txt
Balanced
```

Später:

```txt
Style preference selector
```

---

# 9. Ergebnisse

## 9.1 Side-by-side Comparison

Hauptausgabe:

Tabelle oder Karten nebeneinander.

Vergleichsfelder:

```txt
Name
Gender
Meaning
Origins
Styles
Popularity
Length
Initials
Nickname potential
Surname fit
Related names
Detail page link
```

Mobile:

* keine breite Tabelle erzwingen
* besser gestapelte Karten
* oder horizontale Cards mit sauberem Wrapping

---

## 9.2 Name Score

Optionaler Score pro Name.

Beispiel:

```txt
Overall fit: 84/100
```

Wichtig:

Score darf nicht zu wissenschaftlich wirken.

Besser:

```txt
Strong match
Balanced choice
Distinctive choice
Short and simple
Classic feel
Modern feel
```

Empfehlung:

```txt
Keinen harten “best name” behaupten.
Lieber erklärende Labels verwenden.
```

---

## 9.3 Comparison Summary

Eine kurze Zusammenfassung:

Beispiel:

```txt
Sophie feels classic and elegant, while Luna feels shorter, softer and more modern. If you prefer a timeless name, Sophie may fit better. If you want something brief and celestial, Luna may be a stronger match.
```

MVP kann regelbasiert sein.

Keine AI-API nötig.

---

## 9.4 Best Fit Labels

Mögliche Labels:

```txt
Best classic feel
Best short name
Most distinctive
Most international
Softest sound
Strongest style match
Best surname rhythm
```

Diese Labels machen das Tool wertvoller als eine einfache Tabelle.

---

# 10. Interne Links

Das Tool soll stark intern verlinken.

## 10.1 Links zu Detailseiten

Jeder gefundene Name soll auf die Detailseite verlinken:

```txt
/baby-name/[id]
```

Beispiel:

```txt
View Sophie details →
```

---

## 10.2 Links zu Collections

Je nach Namen sollen passende Collections verlinkt werden:

```txt
Girl Names
Boy Names
Unisex Names
Elegant Baby Names
Rare Baby Names
Short Baby Names
Classic Baby Names
Modern Baby Names
Old Money Baby Names
Nature Baby Names
```

---

## 10.3 Links zum Generator und Hub

Immer verlinken:

```txt
/baby-names
/baby-name-generator
```

Mögliche CTA:

```txt
Need more ideas? Try the Baby Name Generator.
```

```txt
Browse all baby name collections.
```

---

# 11. UX-Struktur

Empfohlener Aufbau im Client:

## 11.1 Intro Card

Kurz erklären:

```txt
Compare your favorite baby names side by side.
```

Untertitel:

```txt
Check meaning, origin, style, popularity, length and surname fit in one simple view.
```

---

## 11.2 Input Card

Felder:

* Name 1
* Name 2
* Add another name
* Optional surname
* Compare button
* Reset button

---

## 11.3 Quick Presets

Beispiel-Presets:

```txt
Sophie vs Olivia
Luna vs Aurora
Theo vs Leo
Henry vs Arthur
Mila vs Ella
Avery vs Riley
```

Vorteil:

* Nutzer sehen sofort, wie das Tool funktioniert
* bessere UX
* weniger leere Startseite

---

## 11.4 Result Section

Nur anzeigen, wenn mindestens 2 Namen ausgewählt sind.

Inhalt:

* Vergleichskarten
* Summary
* Labels
* Detailseitenlinks
* Related collections
* Generator CTA

---

## 11.5 Empty State

Wenn noch keine Namen ausgewählt sind:

```txt
Choose at least two names to compare.
```

---

## 11.6 Missing Name State

Wenn ein Name nicht in der Datenbank gefunden wird:

```txt
We could not find full data for this name yet. You can still compare length and initials, but meaning, origin and style may be missing.
```

---

# 12. Design-Standard

Design soll zu Toollane passen:

```txt
rounded-2xl
rounded-[2rem]
border border-black/10
bg-white
bg-[#fff8df]
shadow-sm
text-black
```

Buttons:

```txt
bg-black text-white
rounded-2xl
font-bold
```

Mobile-first:

* Cards stapeln
* keine unlesbaren Tabellen
* klare Abstände
* große Touch-Ziele
* keine überladenen Dropdowns

---

# 13. SEO

## 13.1 Meta Title

Empfohlen:

```txt
Baby Name Compare Tool | Toollane
```

Alternative:

```txt
Compare Baby Names Side by Side | Toollane
```

---

## 13.2 Meta Description

Empfohlen:

```txt
Compare baby names by meaning, origin, style, popularity, length and surname fit with Toollane's free baby name comparison tool.
```

---

## 13.3 H1

```txt
Baby Name Compare Tool
```

---

## 13.4 Suchintention

Ziel-Suchintention:

```txt
compare baby names
baby name comparison
baby name compare tool
compare girl names
compare boy names
which baby name is better
```

---

## 13.5 FAQ-Ideen für data/tools.ts

FAQ 1:

```txt
What does the Baby Name Compare Tool do?
```

Antwort:

```txt
It helps you compare baby names side by side by meaning, origin, style, popularity, length and optional surname fit.
```

FAQ 2:

```txt
Can I compare more than two baby names?
```

Antwort:

```txt
Yes. The tool is designed to compare two or more favorite names so you can review the differences more clearly.
```

FAQ 3:

```txt
Does the tool choose the best baby name for me?
```

Antwort:

```txt
No. It gives helpful comparison signals, but choosing a name is personal. Use the results as guidance, not a final decision.
```

FAQ 4:

```txt
Can I check how a name fits with a surname?
```

Antwort:

```txt
Yes. You can enter an optional surname to review initials, length and a simple rhythm-style fit.
```

---

# 14. data/tools.ts Eintrag

Geplanter Eintrag:

```ts
{
  category: "Generators",
  categorySlug: "generators",
  name: "Baby Name Compare Tool",
  shortName: "Name Compare",
  description:
    "Compare baby names side by side by meaning, origin, style, popularity, length and optional surname fit.",
  seoTitle: "Baby Name Compare Tool | Toollane",
  seoDescription:
    "Compare baby names by meaning, origin, style, popularity, length and surname fit with Toollane's free baby name comparison tool.",
  href: "/baby-name-compare",
  icon: "👶",
  popular: false,
  keywords: [
    "baby name compare",
    "compare baby names",
    "baby name comparison",
    "compare girl names",
    "compare boy names",
    "baby name fit",
    "surname compatibility",
  ],
  faqs: [
    {
      question: "What does the Baby Name Compare Tool do?",
      answer:
        "It helps you compare baby names side by side by meaning, origin, style, popularity, length and optional surname fit.",
    },
    {
      question: "Can I compare more than two baby names?",
      answer:
        "Yes. The tool is designed to compare two or more favorite names so you can review the differences more clearly.",
    },
    {
      question: "Does the tool choose the best baby name for me?",
      answer:
        "No. It gives helpful comparison signals, but choosing a name is personal. Use the results as guidance, not a final decision.",
    },
    {
      question: "Can I check how a name fits with a surname?",
      answer:
        "Yes. You can enter an optional surname to review initials, length and a simple rhythm-style fit.",
    },
  ],
}
```

---

# 15. Hub-Verlinkung

Nach Umsetzung sollte `data/hubs.ts` ergänzt werden.

Im Baby Names Hub:

```txt
toolHrefs: [
  "/baby-name-generator",
  "/baby-name-compare"
]
```

Dadurch zeigt ToolPageLayout auf dem Baby Name Compare Tool automatisch die Baby-Names-Hubbox.

---

# 16. Mögliche spätere Erweiterungen

## 16.1 Shareable Result Card

Später:

```txt
Share this comparison
Copy result summary
Download as PDF
```

## 16.2 Saved Shortlist

Später lokal im Browser:

```txt
Save to shortlist
Compare saved names
```

## 16.3 Voting Tool

Später:

```txt
Share shortlist with family
Let others vote
```

Aber erst sehr viel später, weil es technische Komplexität erhöhen kann.

## 16.4 AI Summary

Nicht zuerst.

Falls später:

* optional
* vorsichtig
* keine hohen API-Kosten
* keine falsche Autorität

---

# 17. Risiken

## 17.1 Zu viel Subjektivität

Name-Vergleich ist persönlich.

Lösung:

```txt
Keine endgültigen Aussagen.
Nur Hinweise, Stil-Labels und Vergleichssignale.
```

---

## 17.2 Datenlücken

Nicht jeder Name ist in der Datenbank.

Lösung:

```txt
Graceful fallback für unbekannte Namen.
```

---

## 17.3 Zu wissenschaftlicher Score

Ein harter Score kann unseriös wirken.

Lösung:

```txt
Lieber Labels und erklärende Hinweise statt "Name A ist 92% besser".
```

---

## 17.4 Dünne neue Tool-Seite

Das Tool muss wirklich nützlich wirken.

Lösung:

* Presets
* Side-by-side Comparison
* Summary
* Detailseitenlinks
* Related Collections
* FAQ
* Hub-Linkbox

---

# 18. MVP-Definition

Das erste MVP sollte enthalten:

```txt
2–4 Namen vergleichen
optional surname
Name-Vorschläge aus Datenbank
Vergleichskarten
Meaning / Origin / Style / Popularity
Length / initials
Detailseitenlinks
Related collections
Generator CTA
Presets
Reset
Mobile-first UX
```

Nicht im MVP:

```txt
Voting
Accounts
Share links
PDF Export
AI Summary
User-generated saved lists online
```

---

# 19. Erfolgskriterien

Das Tool ist erfolgreich, wenn:

* Nutzer schnell Namen vergleichen können
* Ergebnis verständlich ist
* Detailseiten mehr interne Klicks bekommen
* Baby Name Generator stärker verlinkt wird
* Baby Names Hub gestärkt wird
* Toollane einzigartiger wirkt
* das Tool nicht wie ein generischer Generator aussieht
* Mobile UX gut ist

---

# 20. Umsetzungsreihenfolge nach AdSense

Wenn AdSense entschieden hat und wir wieder live bauen:

1. aktuelle `data/baby-names/index.ts` prüfen
2. aktuelle BabyName-Type prüfen
3. `app/baby-name-compare/page.tsx` bauen
4. `app/baby-name-compare/BabyNameCompareClient.tsx` bauen
5. `data/tools.ts` ergänzen
6. `data/hubs.ts` ergänzen
7. `npm run build`
8. lokal testen
9. committen
10. pushen
11. Sitemap prüfen
12. live testen

---

# 21. Erwarteter Sitemap-Effekt

Aktuell:

```txt
1609 URLs
```

Nach Umsetzung und `data/tools.ts`-Eintrag:

```txt
1610 URLs
```

Vorausgesetzt Sitemap zieht Tools automatisch aus `data/tools.ts`.

---

# 22. PowerShell-Tests nach Umsetzung

## Datei prüfen

```powershell
Test-Path ".\app\baby-name-compare\page.tsx"
Test-Path ".\app\baby-name-compare\BabyNameCompareClient.tsx"
```

## Build

```powershell
npm run build
```

## Sitemap

```powershell
$sitemapLines = curl.exe -L -s "https://toollane.net/sitemap.xml?cachebust=$(Get-Random)"
$sitemapText = $sitemapLines -join "`n"

([regex]::Matches($sitemapText, "<loc>")).Count
$sitemapText.Contains("baby-name-compare")
```

Erwartung:

```txt
1610
True
```

## Live-Status

```powershell
curl.exe -L -s -o NUL -w "%{http_code}" "https://toollane.net/baby-name-compare"
```

Erwartung:

```txt
200
```

---

# 23. Strategische Zusammenfassung

Das Baby Name Compare Tool ist aktuell der beste erste neue Produktkandidat nach AdSense.

Warum:

```txt
höchster Fit zum bestehenden Cluster
hoher Nutzerwert
emotional
relativ geringe technische Komplexität
markenbildend
SEO-fähig
stärkt interne Verlinkung
```

Es ist ein Schritt weg von:

```txt
Toollane = Tool-Liste
```

hin zu:

```txt
Toollane = klare Entscheidungshilfen für echte Alltagssituationen
```
