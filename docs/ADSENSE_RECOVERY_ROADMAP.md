# Toollane – AdSense Recovery Roadmap

Stand: Juni 2026
Ziel: Innerhalb von 3 Tagen die wichtigsten Low-Value-/Thin-Content-Risiken reduzieren, Toollane qualitativ stärken und ca. 7 Tage später erneut bei AdSense einreichen.

---

# 1. Ausgangslage

Toollane wurde zum zweiten Mal von AdSense abgelehnt.

Ablehnungsgrund:

```txt
Minderwertige Inhalte / Low Value Content
Website erfüllt noch nicht die Nutzungskriterien im Google Publisher-Netzwerk.
```

Wichtige Erkenntnis:

```txt
Die technischen Grundlagen wirken größtenteils korrekt.
Das Hauptproblem ist sehr wahrscheinlich der Qualitäts-Footprint der Website.
```

Aktueller Zustand:

```txt
Sitemap URLs: 1609
Baby name detail pages: 1243
Baby name landing pages: 178
Baby Names Hub: live
Real Estate Hub: live
Pet Name Generator: live
```

Vermutetes AdSense-Problem:

```txt
Zu viele junge, sehr ähnliche, programmatisch erzeugte oder dünne Seiten im Verhältnis zur sichtbaren Content-Tiefe und Domain-Autorität.
```

---

# 2. Recovery-Ziel

Toollane soll für den nächsten AdSense-Review kleiner, kuratierter und hochwertiger wirken.

Ziel nach Recovery:

```txt
Nicht mehr 1609 indexierbare URLs präsentieren.
Stattdessen ca. 150–250 hochwertigere, klarere URLs.
```

Nicht löschen:

```txt
Baby-Name-Detailseiten und A-Z-Landingpages bleiben technisch vorhanden.
```

Aber vorübergehend:

```txt
aus Sitemap entfernen
auf noindex, follow setzen
weniger prominent intern verlinken
später erst wieder indexieren, wenn qualitativ ausgebaut
```

---

# 3. Grundprinzipien

## 3.1 Nicht mehr Seiten bauen

Während Recovery:

```txt
Keine neuen Tools
Keine neuen Cluster
Keine neuen Massen-Landingpages
Keine neue Mehrsprachigkeit
Keine neuen Ad-Platzhalter
```

## 3.2 Erst Qualität, dann Wachstum

Priorität:

```txt
1. Thin-Footprint reduzieren
2. bestehende Kernseiten stärken
3. generische Wiederholung reduzieren
4. wichtige Top-Seiten verbessern
5. stabil warten
6. erneut einreichen
```

## 3.3 Kein panisches Umbauen

Nicht anfassen ohne klaren Grund:

```txt
robots.txt
globale Canonicals
Legal-Seiten
Consent-System
AdSense-Script-Struktur
```

---

# 4. 3-Tage-Zeitplan

## Tag 1 – Indexierbaren Footprint reduzieren

Ziel:

```txt
Die größten Low-Value-Risiken sofort entschärfen.
```

### Aufgabe 1.1 Relevante Dateien sichern / prüfen

Benötigte Dateien:

```txt
app/sitemap.ts
app/baby-name/[id]/page.tsx
app/baby-names/[type]/page.tsx
app/baby-names/page.tsx
data/baby-names/pages.ts
components/ToolPageLayout.tsx
components/ToolContentSection.tsx
```

Vor Beginn:

```powershell
git status -sb
npm run build
```

---

### Aufgabe 1.2 Baby-Name-Detailseiten vorübergehend noindex setzen

Betroffene Route:

```txt
/baby-name/[id]
```

Maßnahme:

```txt
metadata robots auf noindex, follow setzen
```

Ziel:

```txt
1243 sehr ähnliche Detailseiten bleiben erreichbar, zählen aber vorerst nicht als indexierbarer Qualitäts-Footprint.
```

Nicht löschen.

Nicht redirecten.

Nicht 404.

---

### Aufgabe 1.3 Baby-Name-Detailseiten aus Sitemap entfernen

Betroffene Sitemap-Gruppe:

```txt
babyNameDetailPages
```

Maßnahme:

```txt
aus app/sitemap.ts entfernen oder vorübergehend nicht spreaden
```

Erwarteter Effekt:

```txt
Sitemap reduziert sich um ca. 1243 URLs.
```

---

### Aufgabe 1.4 A-Z-Baby-Name-Landingpages identifizieren

Betroffene Seiten:

```txt
/baby-names/girl-names-starting-with-a
/baby-names/boy-names-starting-with-a
/baby-names/unisex-names-starting-with-a
...
```

Muster:

```txt
starting-with
```

Maßnahme:

```txt
A-Z-Seiten vorübergehend aus Sitemap entfernen
A-Z-Seiten auf noindex, follow setzen
```

Erwarteter Effekt:

```txt
78 A-Z-Landingpages weniger im indexierbaren Footprint.
```

---

### Aufgabe 1.5 Baby Names Hub A-Z-Bereich entschärfen

Betroffene Seite:

```txt
/baby-names
```

Aktuell verlinkt der Hub prominent auf sehr viele A-Z-Seiten.

Maßnahme:

```txt
A-Z-Bereich vorübergehend entfernen oder stark einklappen/reduzieren.
Fokus auf starke Collections:
- Girl Names
- Boy Names
- Unisex Names
- Popular Baby Names
- Rare Baby Names
- Vintage Baby Names
- Elegant Baby Names
- Nature Baby Names
- Biblical Baby Names
- Royal Baby Names
- Old Money Baby Names
```

Ziel:

```txt
Der Hub wirkt kuratierter und weniger wie eine programmatische Link-Liste.
```

---

### Aufgabe 1.6 Build und Sitemap-Test

Nach Änderungen:

```powershell
npm run build
git status -sb
```

Live nach Push testen:

```powershell
$sitemapLines = curl.exe -L -s "https://toollane.net/sitemap.xml?cachebust=$(Get-Random)"
$sitemapText = $sitemapLines -join "`n"

"Total URLs -> " + ([regex]::Matches($sitemapText, "<loc>")).Count
"Baby detail URLs -> " + ([regex]::Matches($sitemapText, "/baby-name/")).Count
"Starting-with URLs -> " + ([regex]::Matches($sitemapText, "starting-with")).Count
"Baby names hub -> " + $sitemapText.Contains("<loc>https://toollane.net/baby-names</loc>")
"Baby name generator -> " + $sitemapText.Contains("baby-name-generator")
```

Erwartung:

```txt
Total URLs deutlich reduziert
Baby detail URLs -> 0
Starting-with URLs -> 0
Baby names hub -> True
Baby name generator -> True
```

---

## Tag 2 – Kernseiten hochwertiger machen

Ziel:

```txt
Nicht nur weniger dünne Seiten, sondern mehr eigenständiger sichtbarer Wert.
```

Priorisierte Seiten:

```txt
/
 /tools
 /baby-names
 /baby-name-generator
 /pet-name-generator
 /real-estate-calculators
```

---

### Aufgabe 2.1 Homepage stärken

Ziel:

```txt
Homepage soll Toollane klarer als kuratierte Plattform erklären.
```

Mögliche Verbesserungen:

```txt
- klarere Positionierung
- stärkere Popular Tools
- wichtigste Hubs sichtbar
- Lanes-Konzept leicht andeuten
- nicht alle Tools anzeigen
- weniger generischer SEO-Text
```

Mögliche Message:

```txt
Simple tools. Clear results.
```

Oder:

```txt
Choose your lane. Get it done.
```

Wichtig:

```txt
Keine große Design-Explosion.
Nur klarer, hilfreicher, kuratierter.
```

---

### Aufgabe 2.2 /tools stärken

Ziel:

```txt
/tools soll nicht nur Tool-Liste sein, sondern eine gute Startseite für Nutzer.
```

Mögliche Verbesserungen:

```txt
- Most Popular Tools
- Featured Tool Collections
- Browse by Lane / Category
- klarere Suche
- kurze Erklärung, wie Toollane organisiert ist
```

---

### Aufgabe 2.3 /baby-names stärken

Ziel:

```txt
Baby Names Hub als echter Entscheidungs-Hub, nicht als Linkverzeichnis.
```

Ergänzen:

```txt
- How to choose a baby name
- Start with gender
- Narrow by style
- Check meaning and origin
- Shortlist favorites
- Try the Baby Name Generator
```

Fokus:

```txt
kuratiert
hilfreich
eigener Content
weniger A-Z-Linkmasse
```

---

### Aufgabe 2.4 /baby-name-generator stärken

Ziel:

```txt
Generator als hochwertige Entscheidungshilfe darstellen.
```

Mögliche Inhalte:

```txt
- Generate
- Filter
- Shortlist
- Check surname fit
- Explore name details
- Browse related collections
```

Nicht direkt neue URL bauen.

Baby Name Compare bleibt nach AdSense.

---

### Aufgabe 2.5 /pet-name-generator stärken

Ziel:

```txt
Pet Name Generator soll als eigenständiges emotionales Tool wirken.
```

Mögliche Inhalte:

```txt
- dog/cat/pet personality guidance
- naming tips
- why pet type, personality and style matter
- future Pet Lane and checklist ideas nur dezent
```

---

### Aufgabe 2.6 /real-estate-calculators stärken

Ziel:

```txt
Real Estate Hub als Workflow darstellen.
```

Nutzerpfad:

```txt
Can I afford a home?
How much down payment do I need?
What will my mortgage cost?
Should I rent or buy?
What are closing costs?
What happens if I refinance or pay off early?
```

---

## Tag 3 – Wiederholungen reduzieren und final prüfen

Ziel:

```txt
Generischen Wiederholungstext reduzieren und Review-ready werden.
```

---

### Aufgabe 3.1 ToolPageLayout prüfen

Datei:

```txt
components/ToolPageLayout.tsx
```

Prüfen:

```txt
Gibt es doppelte How-to-Bereiche?
Gibt es generische Abschnitte, die auf jeder Tool-Seite gleich wirken?
Gibt es zu viel Fülltext?
```

Ziel:

```txt
Toolseiten sollen nützlich wirken, aber nicht durch lange gleiche Textblöcke künstlich aufgeblasen.
```

---

### Aufgabe 3.2 ToolContentSection prüfen

Datei:

```txt
components/ToolContentSection.tsx
```

Maßnahme:

```txt
Wiederholte lange Standardtexte kürzen.
Kategorie-Content behalten, aber weniger generisch.
```

Wichtig:

```txt
Nicht komplett entfernen.
Aber besser kompakter und hochwertiger machen.
```

---

### Aufgabe 3.3 Top-Tools auswählen

Für später individuelle Qualitätsverbesserung priorisieren:

```txt
Baby Name Generator
Pet Name Generator
Mortgage Calculator
Rent vs Buy Calculator
PDF Compressor
PDF Merger
PDF Splitter
JSON Formatter
Image Compressor
```

Nicht alle jetzt umbauen.

---

### Aufgabe 3.4 Build

```powershell
npm run build
```

Muss erfolgreich sein.

---

### Aufgabe 3.5 Live-Statuscodes prüfen

```powershell
$pages = @(
  "https://toollane.net/",
  "https://toollane.net/tools",
  "https://toollane.net/about",
  "https://toollane.net/contact",
  "https://toollane.net/privacy-policy",
  "https://toollane.net/terms",
  "https://toollane.net/imprint",
  "https://toollane.net/baby-names",
  "https://toollane.net/baby-name-generator",
  "https://toollane.net/pet-name-generator",
  "https://toollane.net/real-estate-calculators",
  "https://toollane.net/mortgage-calculator",
  "https://toollane.net/rent-vs-buy-calculator"
)

foreach ($url in $pages) {
  $code = curl.exe -L -s -o NUL -w "%{http_code}" $url
  "$code -> $url"
}
```

Erwartung:

```txt
200 bei allen wichtigen Seiten
```

---

### Aufgabe 3.6 noindex prüfen

```powershell
$pages = @(
  "https://toollane.net/",
  "https://toollane.net/tools",
  "https://toollane.net/baby-names",
  "https://toollane.net/baby-name-generator",
  "https://toollane.net/pet-name-generator",
  "https://toollane.net/real-estate-calculators",
  "https://toollane.net/baby-name/sophie",
  "https://toollane.net/baby-names/girl-names-starting-with-a"
)

foreach ($url in $pages) {
  $testUrl = "${url}?cachebust=$(Get-Random)"
  $html = (Invoke-WebRequest -Uri $testUrl -UseBasicParsing).Content
  "$url -> noindex: " + ($html -match "noindex")
}
```

Erwartung:

```txt
Homepage -> False
/tools -> False
/baby-names -> False
/baby-name-generator -> False
/pet-name-generator -> False
/real-estate-calculators -> False
/baby-name/sophie -> True
/baby-names/girl-names-starting-with-a -> True
```

---

### Aufgabe 3.7 Sitemap prüfen

```powershell
$sitemapLines = curl.exe -L -s "https://toollane.net/sitemap.xml?cachebust=$(Get-Random)"
$sitemapText = $sitemapLines -join "`n"

"Total URLs -> " + ([regex]::Matches($sitemapText, "<loc>")).Count
"Baby detail URLs -> " + ([regex]::Matches($sitemapText, "/baby-name/")).Count
"Starting-with URLs -> " + ([regex]::Matches($sitemapText, "starting-with")).Count
"Baby names hub -> " + $sitemapText.Contains("<loc>https://toollane.net/baby-names</loc>")
"Baby name generator -> " + $sitemapText.Contains("baby-name-generator")
"Pet name generator -> " + $sitemapText.Contains("pet-name-generator")
"Real estate hub -> " + $sitemapText.Contains("real-estate-calculators")
```

Erwartung:

```txt
Baby detail URLs -> 0
Starting-with URLs -> 0
Baby names hub -> True
Baby name generator -> True
Pet name generator -> True
Real estate hub -> True
```

---

# 5. Nach Tag 3 – Stabilitätsphase

Nach Umsetzung:

```txt
7 Tage stabil lassen.
Keine neuen großen Live-Änderungen.
Keine neuen Tools.
Keine neuen Massen-Seiten.
Keine Ad-Platzhalter.
```

Während dieser Woche:

```txt
Search Console beobachten
Sitemap erneut einreichen oder aktualisieren lassen
wichtige URLs per URL-Prüfung prüfen
keine 1500 URLs manuell einreichen
```

Manuell prüfen / ggf. Indexierung beantragen nur für:

```txt
https://toollane.net/
https://toollane.net/tools
https://toollane.net/baby-names
https://toollane.net/baby-name-generator
https://toollane.net/pet-name-generator
https://toollane.net/real-estate-calculators
https://toollane.net/mortgage-calculator
https://toollane.net/rent-vs-buy-calculator
```

---

# 6. Erneute AdSense-Einreichung

Zeitpunkt:

```txt
ca. 7 Tage nach Recovery-Deploy
```

Vorher prüfen:

```txt
Build erfolgreich
Vercel Ready
Sitemap reduziert
wichtige Seiten 200
wichtige Seiten kein noindex
dünne Detail-/A-Z-Seiten noindex
keine leeren Anzeigenplätze
Legal-Seiten erreichbar
Kontakt erreichbar
```

Dann:

```txt
AdSense -> Probleme behoben bestätigen -> Überprüfung beantragen
```

---

# 7. Was bewusst später kommt

Nicht Teil der 3-Tage-Recovery:

```txt
Baby Name Compare Tool
Pet Cost Calculator
Dog Name Generator by Breed
Dark Mode
Mehrsprachigkeit
Socials
PWA / Save to Home Screen
neue Hubs
neue große Produktlinien
```

Diese Ideen bleiben wertvoll, aber erst nach AdSense-Recovery.

---

# 8. Erfolgsdefinition

Recovery ist erfolgreich, wenn:

```txt
Sitemap deutlich kleiner ist
dünne Baby-Name-Detailseiten nicht mehr indexierbar sind
A-Z-Seiten nicht mehr indexierbar sind
Kernseiten stärker und eigenständiger wirken
generische Wiederholungen reduziert sind
Build erfolgreich ist
Live-Seite stabil ist
```

Erwartung:

```txt
AdSense-Genehmigung ist danach wahrscheinlicher, aber nicht garantiert.
```

---

# 9. Sofort nächster Schritt

Für die Umsetzung werden diese Dateien benötigt:

```txt
app/sitemap.ts
app/baby-name/[id]/page.tsx
app/baby-names/[type]/page.tsx
app/baby-names/page.tsx
components/ToolContentSection.tsx
components/ToolPageLayout.tsx
```

Erster technischer Schritt:

```txt
Baby-Name-Detailseiten und A-Z-Landingpages aus dem indexierbaren Footprint nehmen.
```
