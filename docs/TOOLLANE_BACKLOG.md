# Toollane – Backlog

Stand: Juni 2026
Zweck: Diese Datei sammelt konkrete Aufgaben für Toollane nach Priorität.

---

# 1. Aktueller Modus

Aktuell befindet sich Toollane im AdSense-Review-/Stabilisierungsmodus.

Wichtig:

```txt id="qsvu8y"
Keine großen sichtbaren Änderungen an der Live-Seite deployen, solange AdSense prüft.
```

Erlaubt:

* Dokumentation
* Planung
* Backlog
* Analyse
* kleine Bugfixes bei echtem Fehler
* lokale Vorbereitung

Nicht empfohlen:

* große UI-Änderungen
* Dark Mode
* Mehrsprachigkeit
* neue große Cluster
* große Navbar-Änderungen
* neue programmatische Massen-Seiten
* sichtbare Ad-Platzhalter

---

# 2. Prioritätslogik

Aufgaben werden nach 4 Kriterien bewertet:

```txt id="tc0en6"
SEO Impact
AdSense / Trust Impact
User Value
Risk
```

Hohe Priorität haben Aufgaben mit:

* hohem SEO-Potenzial
* hohem Nutzerwert
* niedrigem Risiko
* positiver Wirkung auf Vertrauen und Qualität

Niedrige Priorität haben Aufgaben mit:

* hohem technischen Risiko
* wenig direktem Nutzen
* viel zusätzlicher Komplexität
* Gefahr für AdSense oder Indexierung

---

# 3. P0 – Während AdSense Review

Diese Aufgaben sind jetzt erlaubt und sinnvoll.

## P0.1 AdSense Review dokumentieren

Aufgabe:

* Datum der erneuten Einreichung notieren
* Screenshot sichern
* Status in `docs/TOOLLANE_STATE.md` ergänzen
* Status in `docs/TOOLLANE_ROADMAP.md` ergänzen

Status:

```txt id="xd4ykz"
Offen
```

---

## P0.2 Produktionsseite stabil halten

Aufgabe:

* keine großen Deployments
* keine Ad-Platzhalter
* keine Canonical-/Sitemap-Umbauten
* keine massenhaften neuen Seiten
* keine unfertigen Tools

Status:

```txt id="hbnub9"
Aktiv
```

---

## P0.3 Regelmäßige Checks

Einmal täglich oder alle paar Tage prüfen:

```powershell id="7g3qcw"
$sitemapLines = curl.exe -L -s "https://toollane.net/sitemap.xml?cachebust=$(Get-Random)"
$sitemapText = $sitemapLines -join "`n"

([regex]::Matches($sitemapText, "<loc>")).Count
$sitemapText.Contains("<loc>https://toollane.net/baby-names</loc>")
$sitemapText.Contains("real-estate-calculators")
$sitemapText.Contains("pet-name-generator")
```

Erwartung aktuell:

```txt id="229huw"
1609
True
True
True
```

Status:

```txt id="umq3v2"
Aktiv
```

---

# 4. P1 – Nach AdSense-Entscheidung

## P1.1 Wenn AdSense genehmigt wird

Nächste Aufgaben:

1. Genehmigung dokumentieren
2. Datenschutz / Consent prüfen
3. AdSense-Integration vorsichtig planen
4. erste Ad-Slots einbauen
5. Mobile UX prüfen
6. Performance prüfen
7. Einnahmen beobachten

Erste mögliche Ad-Positionen:

* unter Tool-Ergebnisbereich
* zwischen Content-Blöcken
* auf Hub-Seiten im unteren Bereich
* nicht direkt neben Download- oder Action-Buttons

Nicht tun:

* keine aggressiven Anzeigen
* keine Ads, die wie Navigation aussehen
* keine Ads direkt im Tool-Input-Bereich
* keine leeren Slots

Status:

```txt id="7gie17"
Wartet auf AdSense-Entscheidung
```

---

## P1.2 Wenn AdSense erneut ablehnt

Nächste Aufgaben:

1. Screenshot der Ablehnung sichern
2. genaue Begründung dokumentieren
3. keine hektischen Änderungen
4. Low-Value-Risiken systematisch prüfen
5. stärkste Seiten priorisieren
6. dünne Seiten identifizieren
7. wichtigste Tools qualitativ verbessern

Mögliche Reaktion:

* Homepage prüfen
* `/tools` prüfen
* `/baby-names` prüfen
* `/real-estate-calculators` prüfen
* Top-10-Tools prüfen
* generische Content-Bereiche verbessern
* eventuell schwache Seiten später aus Sitemap entfernen oder noindex prüfen

Status:

```txt id="lxg3qm"
Wartet auf AdSense-Entscheidung
```

---

# 5. P2 – Top-Tool-Premiumisierung

Ziel:

```txt id="wsenka"
Die wichtigsten Tools sollen sich hochwertig, nützlich und vertrauenswürdig anfühlen.
```

Nicht alle Tools gleichzeitig verbessern.

## Höchste Priorität

### Baby Name Generator

Warum:

* größter SEO-Cluster
* viele interne Seiten
* hoher Nutzerwert
* sehr wichtig für AdSense-Wahrnehmung

Mögliche Verbesserungen:

* bessere Ergebnisstruktur
* stärkere Verlinkung zum `/baby-names` Hub
* bessere Erklärung direkt im Tool
* bessere Beispiele
* bessere Favorites UX
* bessere Mobile UX
* bessere Detailseiten-Verlinkung

Status:

```txt id="02r78h"
Geplant
```

---

### Pet Name Generator

Warum:

* neuer Generator
* gutes SEO-Potenzial
* kann langfristig ähnlich wie Baby Names wachsen

Mögliche Verbesserungen:

* mehr hochwertige Namen
* Open-Data-Import vorbereiten
* bessere Tierart-Filter
* Dog Names / Cat Names später prüfen
* bessere Ergebnisqualität

Status:

```txt id="hgimnt"
Geplant
```

---

### Mortgage Calculator

Warum:

* hoher kommerzieller Wert
* Real-Estate-Cluster wichtig
* potenziell gute Affiliate-/Ad-Einnahmen

Mögliche Verbesserungen:

* bessere Ergebnisbox
* Amortization Preview
* monatlicher Breakdown
* Property Tax / Insurance / HOA stärker integrieren
* interne Links zu Refinance, Payoff, Down Payment, Closing Cost

Status:

```txt id="uot906"
Geplant
```

---

### Rent vs Buy Calculator

Warum:

* hoher Nutzerwert
* guter SEO-Intent
* starker Real-Estate-Cluster-Link

Mögliche Verbesserungen:

* bessere Szenario-Vergleiche
* Break-even Jahr
* kumulative Kosten
* Annahmen klarer erklären
* Ergebnis mit Handlungshinweis

Status:

```txt id="aunfn3"
Geplant
```

---

### Home Affordability Calculator

Warum:

* starker Real-Estate-Intent
* wichtig im Nutzerpfad vor Mortgage Calculator

Mögliche Verbesserungen:

* DTI-Erklärung
* Down Payment Integration
* Monthly Payment Breakdown
* konservative vs aggressive Schätzung
* bessere Hinweise zu lokalen Kosten

Status:

```txt id="aoc7gz"
Geplant
```

---

# 6. P3 – PDF/Image-Cluster

Dieser Cluster ist wichtig, aber während AdSense Review nicht sichtbar groß verändern.

## Priorisierte Tools

* PDF Merger
* PDF Compressor
* PDF Splitter
* PDF to JPG
* JPG to PDF
* PDF Rotate
* PDF Extract Pages
* Image Compressor
* Image Converter
* Image Resizer

Premium-Standards:

* Drag & Drop
* Browser-Based Privacy Hinweis
* Dateigröße anzeigen
* klare Fehlermeldungen
* Download Again
* Output-Dateiname
* Mobile First
* schnelle Verarbeitung
* keine unnötigen Uploads

Status:

```txt id="tb7sfe"
Später
```

---

# 7. P4 – Socials

Socials sind sinnvoll für Trust und Markenaufbau, aber nicht kritisch vor AdSense.

Mögliche spätere Aufgaben:

* Footer Links zu X und Instagram
* About-Seite mit Social Links ergänzen
* keine externen Feed-Widgets
* keine zusätzlichen Tracking-Scripts
* keine große Navbar-Änderung

Status:

```txt id="al62ex"
Später
```

---

# 8. P5 – Dark Mode

Dark Mode ist eine UX-Verbesserung, aber kein aktueller AdSense-Hebel.

Später umsetzen als eigenes Systemprojekt:

* Theme Toggle
* System Theme erkennen
* Speicherung in Local Storage
* alle Komponenten testen
* alle Tools testen
* alle Hubs testen
* mobile Kontraste prüfen
* keine halbe Umsetzung

Status:

```txt id="rxszdw"
Später
```

# 8.5 P5.5 – Save to Home Screen / App-like Experience

Status:

```txt id="mfl0wr"
Später
```

Idee:

Toollane-Tools sollen sich langfristig app-ähnlicher anfühlen.

Auf wichtigen Tool-Seiten könnte ein kleiner Hinweis erscheinen:

```txt id="hdn8b8"
Need this tool often? Save it to your phone.
```

Oder:

```txt id="v64m3b"
Use this tool like an app — add it to your home screen.
```

Mögliche Umsetzung:

* kleiner Button oder Hinweis unter dem Tool
* Anleitung für iPhone
* Anleitung für Android
* keine störende Pop-up-Lösung
* kein aggressives Banner
* nur auf wichtigen Tools
* mobile-first
* optional später mit PWA/Web Manifest kombinieren

Mögliche Anleitung für iPhone:

```txt id="lpexd9"
1. Tap the Share button in Safari.
2. Choose "Add to Home Screen".
3. Tap "Add".
```

Mögliche Anleitung für Android:

```txt id="mfwcvj"
1. Open the menu in Chrome.
2. Choose "Add to Home screen".
3. Confirm with "Add".
```

Warum sinnvoll:

* erhöht Wiederkehrer-Potenzial
* Tools fühlen sich nützlicher an
* stärkt die Marke Toollane
* besonders passend für häufig genutzte Rechner und Converter
* kann langfristig App-ähnliches Nutzungsverhalten erzeugen

Geeignete erste Tools:

* Mortgage Calculator
* Baby Name Generator
* Pet Name Generator
* PDF Compressor
* Image Compressor
* VAT Calculator
* Discount Calculator
* Loan Calculator

Nicht vor AdSense umsetzen.

Grund:

```txt id="hcuuhy"
Aktuell soll die Live-Seite stabil bleiben.
Die Idee ist gut, aber kein unmittelbarer AdSense-Fix.
```

Spätere Ausbaustufe:

* Web Manifest
* App Icon
* PWA-Grundstruktur
* Offline-/recent-tools-Konzept
* “Recently used tools”
* “Favorite tools”


---

# 9. P6 – Mehrsprachigkeit

Mehrsprachigkeit ist langfristig interessant, aber aktuell zu riskant.

Nur später sauber umsetzen mit:

* `/de`
* `/es`
* `/fr`
* hreflang
* übersetzten Metadaten
* übersetzten Tooldaten
* übersetzten Hubs
* übersetzter Sitemap-Logik
* Canonical-/hreflang-Konzept
* keine automatisch dünnen Übersetzungen

Status:

```txt id="allp4r"
Deutlich später
```

---

# 10. P7 – Weitere Cluster

Spätere mögliche Cluster:

* Pet Names Cluster
* Business Calculators
* Finance Calculators
* Real Estate Expansion
* Resume / Career Tools
* Education Tools
* Unit Converters
* Health/Fitness Calculators

Regel:

```txt id="150cjr"
Neue Cluster nur bauen, wenn Datenqualität, interne Verlinkung und Monetarisierungspotenzial klar sind.
```

Status:

```txt id="hg2x5q"
Später
```

---

# 11. Nicht machen

Aktuell bewusst nicht machen:

* weitere 500 Baby Names blind erzeugen
* weitere 50 Tools blind erzeugen
* neue Sprachversionen halb starten
* Dark Mode halb einbauen
* Social Feed Widgets
* große Navbar-Experimente
* neue Ad-Platzhalter
* Canonicals ohne Fehler anfassen
* Sitemap ohne Grund umbauen
* 100+ Seiten manuell bearbeiten

---

# 12. Nächste konkrete Aufgabe

Aktuell beste nächste Aufgabe:

```txt id="1d9od1"
AdSense Review abwarten und währenddessen den Baby Name Generator als nächsten Premium-Kandidaten vorbereiten.
```

Aber:

```txt id="vf0rvc"
Nicht sofort deployen, wenn AdSense gerade prüft.
Erst planen oder lokal vorbereiten.
```

Nächste mögliche Arbeitsdatei:

```txt id="6uc59z"
docs/BABY_NAME_IMPROVEMENT_PLAN.md
```

Ziel:

* Baby Name Generator analysieren
* Verbesserungen priorisieren
* keine Live-Änderung ohne Plan
* danach gezielt eine hochwertige Version bauen

---

# 13. Zusammenfassung

Aktueller Fokus:

```txt id="7irqub"
Stabilität vor neuen Features.
Qualität vor Quantität.
Systeme vor Einzeldateien.
AdSense zuerst, große Features später.
```
