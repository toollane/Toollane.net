# Toollane – Roadmap

Stand: Juni 2026
Zweck: Diese Datei beschreibt die nächsten Schritte, Prioritäten und bewussten Nicht-Prioritäten für Toollane.

---

# 1. Aktueller Status

Toollane ist live unter:

https://toollane.net

Aktueller technischer Stand:

* Domain live
* GitHub Repository vorhanden
* Vercel Deployment aktiv
* Search Console eingerichtet
* Sitemap live
* Sitemap enthält aktuell 1609 URLs
* robots.txt vorhanden
* wichtige Legal-/Trust-Seiten vorhanden
* zentrale Tool-Architektur vorhanden
* zentrale Hub-Struktur über `data/hubs.ts` vorhanden

Aktuelle wichtige Cluster:

* Baby Names
* Pet Names
* Real Estate / Mortgage
* PDF / Image
* Calculators
* Business Tools
* SEO Tools
* Developer Tools
* Text Tools

---

# 2. AdSense-Status

AdSense hatte Toollane wegen „Low Value Content / Minderwertige Inhalte“ abgelehnt.

Seitdem wurden viele Verbesserungen umgesetzt:

* Trust-Seiten verbessert
* About-Seite verbessert
* Contact-Seite verbessert
* Privacy Policy verbessert
* Terms verbessert
* Imprint verbessert
* Sitemap korrigiert
* Canonicals korrigiert
* ungültige SearchAction entfernt
* leere AdSense-Platzhalter entfernt
* ToolContentSection verbessert
* Real-Estate-Cluster gestärkt
* Baby Names Root Hub ergänzt
* Pet Name Generator ergänzt
* interne Hub-Verlinkung über `ToolPageLayout` + `data/hubs.ts` verbessert

Aktueller Plan:

```txt id="pwyfkf"
AdSense Review erneut beantragen.
Während der Prüfung möglichst keine großen sichtbaren Änderungen an der Live-Seite deployen.
```

---

# 3. Verhalten während der AdSense-Prüfung

Während AdSense prüft, soll die Produktionsseite stabil bleiben.

## Erlaubt

Sinnvoll und risikoarm:

* Dokumentation ergänzen
* Roadmap pflegen
* Ideen sortieren
* Prioritäten festlegen
* lokale Konzepte vorbereiten
* Search Console beobachten
* kleinere Bugfixes nur bei echtem Fehler
* sehr kleine Text-/Trust-Verbesserungen nur falls nötig

## Nicht empfohlen

Während der Prüfung nicht deployen:

* Dark Mode
* Mehrsprachigkeit
* neue große Navigation
* große Sitemap-Umbauten
* Canonical-Umbauten
* viele neue Seiten
* unfertige Tools
* neue Ad-Platzhalter
* aggressive AdSense-Slots
* große Design-Experimente
* neue programmatische Datenbanken

Grund:

```txt id="emzjux"
AdSense soll eine stabile, klare, nutzerfreundliche Version prüfen.
Große Änderungen während der Prüfung erhöhen das Risiko neuer Fehler.
```

---

# 4. Entscheidung nach AdSense-Ergebnis

## Fall A: AdSense wird genehmigt

Dann nächster Plan:

1. AdSense-Genehmigung dokumentieren
2. Datenschutz / Consent final prüfen
3. AdSense-Slots vorsichtig einbauen
4. keine aggressive Anzeigenplatzierung
5. zuerst wenige hochwertige Slots
6. Performance prüfen
7. Mobile UX prüfen
8. Einnahmen und RPM beobachten

Mögliche erste Ad-Positionen:

* unter Tool-Ergebnisbereich
* zwischen Content-Abschnitten
* auf Hub-Seiten im unteren Bereich
* nicht direkt störend im Tool-Input-Bereich

Nicht tun:

* keine Ads neben kritischen Buttons
* keine Ads, die wie Navigation aussehen
* keine Ads, die Download-Buttons imitieren
* keine überladenen Seiten

## Fall B: AdSense wird erneut abgelehnt

Nicht panisch reagieren.

Dann prüfen:

1. genaue Ablehnungsbegründung lesen
2. Screenshot sichern
3. betroffene Hinweise dokumentieren
4. keine wilden Änderungen
5. systematisch Low-Value-Risiken reduzieren

Mögliche Maßnahmen bei erneuter Ablehnung:

* Top-Tools stärker ausbauen
* dünne Landingpages identifizieren
* Hubs mit mehr hilfreichem Content stärken
* `/tools` und Homepage nochmals prüfen
* zu generische ToolContentSection-Abschnitte verbessern
* interne Verlinkung weiter stärken
* eventuell sehr schwache Seiten später aus Sitemap entfernen oder noindex prüfen

Wichtig:

```txt id="2o95cw"
Eine erneute Ablehnung bedeutet nicht, dass das Projekt schlecht ist.
AdSense kann bei jungen, großen, programmatischen Seiten streng sein.
```

---

# 5. Kurzfristige Roadmap

## Phase 1: Stabilität und Review

Ziel:

```txt id="2pf0gf"
AdSense-Prüfung sauber durchlaufen lassen.
```

Aufgaben:

* AdSense Review beantragen
* Produktionsseite stabil halten
* Search Console beobachten
* keine großen Deployments
* Dokumentation aktuell halten

Status:

```txt id="g52tw4"
Aktiv
```

---

## Phase 2: Nach AdSense-Entscheidung

Entscheidung abhängig vom Ergebnis.

### Wenn genehmigt

Fokus:

* Ads sauber integrieren
* Consent prüfen
* Einnahmen beobachten
* UX nicht verschlechtern
* Top-Seiten monetarisieren

### Wenn erneut abgelehnt

Fokus:

* Qualität der wichtigsten Seiten weiter erhöhen
* Low-Value-Risiken reduzieren
* Top-Tools verbessern
* Hubs stärken
* nicht einfach mehr Seiten bauen

---

# 6. Mittelfristige Roadmap

## 6.1 Top-Tools premiumisieren

Ziel:

```txt id="c8gn84"
Nicht nur viele Tools haben, sondern die wichtigsten Tools wirklich hochwertig machen.
```

Top-Kandidaten:

* Baby Name Generator
* Pet Name Generator
* Mortgage Calculator
* Rent vs Buy Calculator
* Home Affordability Calculator
* PDF Merger
* PDF Compressor
* PDF Splitter
* Image Compressor
* Image Converter
* Loan Calculator
* VAT Calculator
* Discount Calculator
* Investment Calculator
* Salary Calculator
* Profit Calculator

Premiumisierung bedeutet:

* bessere Inputs
* bessere Ergebnisboxen
* Presets
* Beispiele
* bessere Fehlermeldungen
* Copy / Export / Download, falls sinnvoll
* mobile-first Layout
* klare Hinweise zu Genauigkeit
* stärkere interne Links
* besserer hilfreicher Content
* klarer Nutzen gegenüber Konkurrenz

---

## 6.2 Baby-Name-Cluster verbessern

Aktueller Stand:

* 1243 Baby-Name-Detailseiten
* 178 Baby-Name-Landingpages
* Baby Name Generator
* Root-Hub `/baby-names`

Nächste sinnvolle Verbesserungen:

* Hub-Seite live visuell prüfen
* Baby Name Generator auf Hub-Linkbox prüfen
* dünne Landingpages identifizieren
* stärkste Landingpages priorisieren
* interne Links verbessern
* Detailseiten qualitativ prüfen
* ggf. bessere „related names“-Logik
* ggf. bessere Origin-/Style-Verlinkung

Nicht tun:

* nicht blind weitere 5000 Namen erzeugen
* nicht neue Massen-Landingpages ohne Qualitätsprüfung erzeugen

---

## 6.3 Pet-Name-Cluster aufbauen

Aktueller Stand:

* Pet Name Generator live
* Starter-Datensatz vorhanden
* Struktur vorbereitet unter `data/pet-names/`

Nächste sinnvolle Schritte:

* Datenqualität prüfen
* Open-Data-Quellen vorbereiten
* Pet Names nach Tierart erweitern
* Dog Names / Cat Names später als Landingpages prüfen
* keine Massen-Seiten ohne Datenbasis erzeugen

Mögliche spätere Quellen:

* Seattle Pet Licenses
* NYC Dog Licensing Dataset
* Cambridge dog license data

Langfristiges Ziel:

```txt id="jikq0k"
Pet Names ähnlich stark wie Baby Names aufbauen, aber langsamer und datenbasierter.
```

---

## 6.4 Real-Estate-Cluster weiter stärken

Aktueller Stand:

* Real-Estate-Hub live
* wichtige Mortgage-/Real-Estate-Tools vorhanden
* Hub-Linkbox auf relevanten Tools aktiv

Aktuelle Tools:

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

Nächste mögliche Verbesserungen:

* Tool-Ergebnisse weiter verbessern
* Vergleichstabellen einbauen
* mehr Beispielwerte
* bessere Hinweise zu regionalen Unterschieden
* interne Pfade optimieren
* Real-Estate-Hub visuell prüfen

Spätere mögliche Tools:

* Mortgage APR Calculator
* House Payment Calculator
* Real Estate ROI Calculator
* Property Management Fee Calculator
* Rent Increase Calculator

---

## 6.5 PDF- und Image-Cluster premiumisieren

Frühere Priorität:

* PDF Merger
* PDF Compressor
* PDF Splitter
* PDF to JPG
* JPG to PDF
* PDF Rotate
* PDF Unlock
* PDF Protect
* PDF Extract Pages

Ziel:

```txt id="2cgz4f"
PDF/Image Tools sollen sich wie hochwertige Browser-Tools anfühlen.
```

Wichtige Standards:

* Drag & Drop
* Browser-Based Privacy Hinweis
* klare File-Stats
* Output-Dateiname
* Download Again
* bessere Fehlermeldungen
* mobile-first
* keine unnötigen Uploads
* wenn möglich lokale Verarbeitung

Nach AdSense kann dieser Cluster wieder stärker priorisiert werden.

---

# 7. Spätere Feature-Ideen

## 7.1 Dark Mode

Status:

```txt id="og85x6"
Später
```

Nicht vor AdSense.

Grund:

* UX-Verbesserung, aber kein Low-Value-Fix
* erhöht CSS-/QA-Aufwand
* kann Kontrastprobleme erzeugen
* sollte systematisch umgesetzt werden

Wenn später umgesetzt:

* Theme Toggle in Navbar
* System Theme erkennen
* Einstellung speichern
* alle Komponenten testen
* alle Tool-Ergebnisse testen
* Legal-/Content-Seiten testen
* Hubs testen
* Mobile zuerst testen

---

## 7.2 Mehrsprachigkeit

Status:

```txt id="pq2de3"
Deutlich später
```

Nicht vor AdSense.

Mehrsprachigkeit ist ein großes SEO-Architekturprojekt.

Nur sauber umsetzen mit:

* `/de`
* `/es`
* `/fr`
* ggf. weitere Sprachen
* hreflang
* übersetzte Metadaten
* übersetzte Tool-Daten
* übersetzte Navigation
* übersetzte Legal-Hinweise
* eigene Sitemaps oder saubere Sitemap-Integration
* Canonical-/hreflang-Logik
* keine automatischen dünnen Übersetzungen

Risiko bei zu früher Umsetzung:

* Duplicate Content
* dünne Sprachversionen
* falsche Canonicals
* falsche hreflang-Tags
* viel zusätzlicher Wartungsaufwand

---

## 7.3 Socials

Status:

```txt id="z5f66c"
Optional später
```

Socials können Trust und Branding helfen.

Mögliche Integration:

* Footer-Links
* About-Seite
* ggf. Contact-Seite
* keine externen Feed-Widgets
* keine unnötigen Scripts

Voraussetzung:

* Accounts existieren
* Accounts sehen nicht komplett leer aus
* Links sind sauber
* keine große Navbar-Änderung nötig

---

## 7.4 Save to Home Screen / PWA

Status:

```txt id="j4ijxd"
Später
```

Idee:

Auf wichtigen Tools Hinweis:

```txt id="s5a655"
Need this tool often? Save it to your phone.
```

Mit Anleitung für:

* iPhone
* Android

Langfristiges Ziel:

* Toollane fühlt sich app-ähnlicher an
* wiederkehrende Nutzer
* besseres Branding

Noch nicht umsetzen.

---

## 7.5 Premium Tool Idee: Family Budget Planner

Status:

```txt id="f395bt"
Später
```

Idee:

Dynamischer Haushaltsplaner:

```txt id="wvk1nq"
Kategorie | Person 1 | Person 2 | Person 3
```

Berechnungen:

* Income
* Expenses
* Net Income
* Savings
* Savings Rate
* individuelle Beiträge
* Haushaltsübersicht

Potenzial:

```txt id="std5ke"
8/10
```

Nicht jetzt bauen.

---

# 8. Feature-Priorisierung

## Jetzt

* AdSense Review
* Dokumentation
* Roadmap
* Stabilität
* Search Console beobachten

## Bald

* Top-Tools premiumisieren
* Baby Names verbessern
* Pet Names datenbasiert erweitern
* PDF/Image Tools verbessern
* AdSense-Slots nach Genehmigung

## Später

* Dark Mode
* Socials
* PWA / Save to Home Screen
* Mehrsprachigkeit
* große neue Cluster

## Viel später

* eigene API
* User Accounts
* gespeicherte Tools
* Toollane Pro
* große internationale Expansion
* vollständig mehrsprachige Plattform

---

# 9. Was bewusst nicht priorisiert wird

Aktuell nicht priorisiert:

* mehr Massen-Seiten
* unfertige Tools
* neue große Kategorien
* Dark Mode vor AdSense
* Mehrsprachigkeit vor stabiler Indexierung
* Social Widgets
* neue externe Skripte
* große UI-Experimente
* neue programmatische Datenbank ohne Qualitätsprüfung

---

# 10. Search Console Beobachtungsplan

Während und nach AdSense Review regelmäßig prüfen:

* indexierte Seiten
* gecrawlt, aber nicht indexiert
* gefunden, aber nicht indexiert
* alternative Seite mit richtigem Canonical
* 404s
* Seiten mit Weiterleitung
* Sitemap erkannte URLs
* Top-Suchanfragen
* Top-Seiten
* Crawl-Datum wichtiger Seiten

Nicht wegen einzelner alter Meldungen panisch werden.

Wichtig:

```txt id="ix8944"
Search Console Daten hängen oft mehrere Tage hinterher.
```

---

# 11. AdSense Beobachtungsplan

Nach Antrag:

* Datum notieren
* Screenshot speichern
* keine großen Deployments
* Antwort abwarten
* bei Antwort Screenshot sichern
* Ergebnis in `docs/TOOLLANE_STATE.md` und `docs/TOOLLANE_ROADMAP.md` ergänzen

Wenn Genehmigung:

* Ads geplant einbauen

Wenn Ablehnung:

* Grund genau analysieren
* keine hektische Reaktion
* Low-Value-Risiken systematisch reduzieren

---

# 12. Arbeitsweise

Der Nutzer arbeitet in:

* VS Code
* Windows
* PowerShell

Wichtige Regeln:

* Auf Deutsch antworten
* vollständige Dateien liefern
* keine kleinen Snippets
* exakte PowerShell-Commands
* keine Platzhalter wie `git add ...`
* SEO, AdSense und langfristige Monetarisierung mitdenken
* keine wilden Änderungen ohne Grund
* zentrale Lösungen bevorzugen

---

# 13. Git-Workflow

Vor Commit:

```powershell id="w60coz"
npm run build
git status -sb
```

Dann gezielt adden:

```powershell id="efpk8k"
git add docs/TOOLLANE_ROADMAP.md
```

Commit:

```powershell id="wwi5zt"
git commit -m "Add Toollane roadmap"
git push
```

Nach Push:

```txt id="b7jv6b"
Vercel -> Deployments -> neuester Commit muss Ready sein
```

---

# 14. Nächster konkreter Schritt

Direkt nach Erstellung dieser Datei:

1. Datei speichern
2. Build testen
3. Committen
4. AdSense Review beantragen oder bestätigen
5. während Review keine großen Live-Änderungen
6. danach je nach AdSense-Ergebnis weiterarbeiten

Empfohlener nächster Arbeitsblock nach dieser Datei:

```txt id="qmq9no"
AdSense Review abwarten und parallel einen Backlog für Top-Tool-Premiumisierung vorbereiten.
```
