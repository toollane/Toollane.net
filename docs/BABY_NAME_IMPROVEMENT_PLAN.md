# Toollane – Baby Name Improvement Plan

Stand: Juni 2026
Zweck: Plan zur qualitativen Verbesserung des Baby-Name-Clusters.

---

# 1. Aktueller Status

Der Baby-Name-Cluster ist aktuell der größte SEO-Cluster auf Toollane.

Live-Struktur:

```txt id="rjr3fk"
/baby-names                    -> zentraler Hub
/baby-name-generator           -> Tool
/baby-names/[type]             -> Landingpages
/baby-name/[id]                -> Detailseiten
```

Aktueller Umfang:

```txt id="5etb6b"
Baby name detail pages -> 1243
Baby name landing pages -> 178
Baby name generator -> True
Baby names root hub -> True
Sitemap URLs gesamt -> 1609
```

Datenbasis:

```txt id="a6mogw"
boys.json -> 523
girls.json -> 509
unisex.json -> 211
master -> 1243
```

Die Summe ist konsistent:

```txt id="8rqg20"
523 + 509 + 211 = 1243
```

Aktueller technischer Status:

* `/baby-names` ist live
* `/baby-name-generator` ist live
* Hub-Linkbox auf dem Baby Name Generator ist live
* Baby Name Generator verlinkt zum Baby Names Hub
* Sitemap enthält den Baby Names Root Hub

---

# 2. Aktueller AdSense-Kontext

Toollane befindet sich aktuell im AdSense-Review-/Stabilisierungsmodus.

Deshalb gilt:

```txt id="g81lxp"
Keine großen sichtbaren Änderungen am Baby-Name-Cluster deployen, solange AdSense prüft.
```

Dieser Plan ist zunächst eine Vorbereitung.

Erlaubt während AdSense Review:

* Analyse
* Planung
* Dokumentation
* Priorisierung
* lokale Vorbereitung

Nicht empfohlen während AdSense Review:

* viele neue Landingpages
* viele neue Detailseiten
* große UI-Änderungen
* neue Datenbank-Strukturen live deployen
* Canonical-/Sitemap-Änderungen
* ungetestete Generator-Änderungen

---

# 3. Ziel des Baby-Name-Clusters

Der Baby-Name-Cluster soll langfristig:

* organischen SEO-Traffic bringen
* viele Longtail-Suchanfragen abdecken
* Nutzer im Cluster halten
* den Baby Name Generator stärken
* Vertrauen und Nutzwert für AdSense erhöhen
* später eventuell Affiliate-/Produktideen ermöglichen

Wichtig:

```txt id="g8oykq"
Nicht blind mehr Seiten erzeugen.
Erst Qualität, Struktur und interne Verlinkung verbessern.
```

---

# 4. Prioritätslogik

Verbesserungen werden bewertet nach:

```txt id="2oun0s"
SEO Impact
User Value
AdSense Quality Impact
Technical Risk
Effort
```

Beste Aufgaben:

* hoher Nutzerwert
* sichtbare Qualitätsverbesserung
* geringe technische Risiken
* keine großen Strukturumbrüche
* bessere interne Links

---

# 5. P0 – Während AdSense Review

## P0.1 Keine großen Live-Änderungen

Status:

```txt id="6dedet"
Aktiv
```

Regel:

```txt id="dq6719"
Der Baby-Name-Cluster bleibt während der AdSense-Prüfung stabil.
```

---

## P0.2 Live-Struktur beobachten

Regelmäßig prüfen:

```powershell id="ysj9go"
$sitemapLines = curl.exe -L -s "https://toollane.net/sitemap.xml?cachebust=$(Get-Random)"
$sitemapText = $sitemapLines -join "`n"

([regex]::Matches($sitemapText, "<loc>")).Count
$sitemapText.Contains("<loc>https://toollane.net/baby-names</loc>")
$sitemapText.Contains("baby-name-generator")
```

Erwartung:

```txt id="m02f7v"
1609
True
True
```

---

## P0.3 Hub-Linkbox prüfen

```powershell id="j7gw44"
$html = (Invoke-WebRequest -Uri "https://toollane.net/baby-name-generator?cachebust=$(Get-Random)" -UseBasicParsing).Content

$html.Contains("Explore all baby name collections")
$html.Contains("Related tool collection")
$html.Contains("Open collection")
$html.Contains("/baby-names")
```

Status:

```txt id="0x4yjr"
Alle Tests True
```

---

# 6. P1 – Baby Name Generator verbessern

Der Baby Name Generator ist der wichtigste Einstiegspunkt.

## Ziel

Der Generator soll sich nicht nur wie ein einfacher Filter anfühlen, sondern wie ein hochwertiges Namensfindungs-Tool.

## Mögliche Verbesserungen

### 6.1 Bessere Ergebnis-Karten

Aktuell prüfen:

* zeigen Karten genug Informationen?
* ist der Name gut lesbar?
* sind Gender, Origin, Style klar?
* ist der Link zur Detailseite sichtbar?
* gibt es einen klaren Copy-/Favorite-Button?

Verbesserungsideen:

* Name größer darstellen
* Meaning prominenter anzeigen
* Origin-/Style-Chips übersichtlicher
* klarer Link: “View name details”
* bessere Favorite-Darstellung
* bessere Mobile-Abstände

Priorität:

```txt id="4ml0rj"
Hoch
```

---

### 6.2 Besserer Einstieg / Guided Search

Idee:

Direkt im Generator oben kurze Auswahlpfade anbieten:

```txt id="3kp4kb"
I want a girl name
I want a boy name
I want a unisex name
I want a rare name
I want a short name
I want an elegant name
```

Vorteil:

* bessere UX
* schnellerer Einstieg
* Nutzer fühlen sich geführt
* weniger leere Filter-Erfahrung

Priorität:

```txt id="skz93g"
Hoch
```

---

### 6.3 Bessere interne Links vom Generator

Bereits vorhanden:

* Link zum Baby Names Hub über Hub-Linkbox

Weitere mögliche Links:

* Girl Names
* Boy Names
* Unisex Names
* Rare Baby Names
* Short Baby Names
* Vintage Baby Names
* Old Money Baby Names

Diese Links könnten als kleiner Bereich unter dem Tool erscheinen:

```txt id="em0xel"
Popular baby name collections
```

Priorität:

```txt id="i7i44h"
Mittel bis hoch
```

---

### 6.4 Favorites verbessern

Mögliche Verbesserungen:

* Favorites klarer anzeigen
* Favorites zählen
* Copy all favorites
* Clear favorites
* Hinweis: Favorites are saved only in your browser
* bessere Mobile-Darstellung

Priorität:

```txt id="dueojl"
Mittel
```

---

### 6.5 Surname Compatibility verbessern

Aktuell bereits vorhanden.

Mögliche Verbesserungen:

* klarer erklären, was geprüft wird
* Ergebnis verständlicher machen
* keine falsche Genauigkeit suggerieren
* Beispiele anzeigen

Priorität:

```txt id="2dw7bx"
Mittel
```

---

# 7. P2 – Baby Names Hub verbessern

Hub:

```txt id="3jtnn6"
/baby-names
```

Aktuell live.

## Ziel

Der Hub soll die zentrale Verteilerseite für den gesamten Baby-Name-Cluster sein.

## Verbesserungsmöglichkeiten

### 7.1 Visuelle Prüfung

Prüfen:

* sieht die Seite auf Mobile gut aus?
* ist der Generator prominent genug?
* sind Girl/Boy/Unisex sofort sichtbar?
* sind A-Z Links übersichtlich?
* ist die Seite nicht zu lang oder unübersichtlich?
* ist der CTA klar?

Priorität:

```txt id="a48gan"
Hoch
```

---

### 7.2 Bessere Top-Sektion

Mögliche Ergänzungen:

* “Start with the generator”
* “Browse by gender”
* “Browse by origin”
* “Browse by style”
* “Browse by first letter”

Priorität:

```txt id="k43mi4"
Mittel
```

---

### 7.3 Bessere interne Link-Hierarchie

Wichtigste Links oben:

* Baby Name Generator
* Girl Names
* Boy Names
* Unisex Names
* Popular Baby Names
* Rare Baby Names

Tiefe Links weiter unten:

* Origins
* Styles
* A-Z

Priorität:

```txt id="15862t"
Mittel
```

---

# 8. P3 – Landingpages verbessern

Landingpages:

```txt id="8z3j51"
/baby-names/[type]
```

Beispiele:

* `/baby-names/girl`
* `/baby-names/boy`
* `/baby-names/unisex`
* `/baby-names/german-baby-names`
* `/baby-names/rare-baby-names`
* `/baby-names/girl-names-starting-with-a`

## Ziel

Landingpages sollen nicht dünn wirken.

Sie sollen:

* klare H1 haben
* passenden Intro-Text haben
* relevante Namen zeigen
* interne Links zu verwandten Seiten bieten
* Generator-CTA enthalten
* Detailseiten verlinken

## Mögliche Verbesserungen

### 8.1 Related Collections

Jede Landingpage sollte verwandte Sammlungen anzeigen.

Beispiele:

Girl Names:

* Elegant Girl Names
* Vintage Girl Names
* Short Girl Names
* Rare Girl Names

German Baby Names:

* Nordic Baby Names
* French Baby Names
* Italian Baby Names
* Classic Baby Names

Priorität:

```txt id="1n4myr"
Hoch
```

---

### 8.2 Generator CTA

Jede Landingpage könnte einen CTA erhalten:

```txt id="6iylm3"
Want more ideas? Try the Baby Name Generator.
```

Priorität:

```txt id="g759n2"
Hoch
```

---

### 8.3 Leere oder sehr schwache Landingpages prüfen

Einige A-Z-Seiten könnten sehr wenige Namen haben.

Prüfen:

* Seiten mit 0 Namen
* Seiten mit 1–3 Namen
* Seiten mit sehr dünnem Content

Mögliche Entscheidungen:

* verbessern
* intern weniger prominent verlinken
* später noindex prüfen
* nicht sofort löschen

Priorität:

```txt id="j0l45y"
Hoch
```

---

# 9. P4 – Detailseiten verbessern

Detailseiten:

```txt id="wndicg"
/baby-name/[id]
```

## Ziel

Detailseiten sollen hilfreicher wirken und Nutzer weiterleiten.

## Mögliche Verbesserungen

### 9.1 Bessere Name Summary

Jede Detailseite sollte klar zeigen:

* Name
* gender
* meaning
* origins
* styles
* popularity
* variants
* similar names

Priorität:

```txt id="x2hid7"
Mittel
```

---

### 9.2 Stärkere interne Links

Mögliche Linkbereiche:

* Similar Names
* Names with same origin
* Names with same style
* Girl/Boy/Unisex hub
* Baby Name Generator

Priorität:

```txt id="bq1gm6"
Hoch
```

---

### 9.3 Mehr hilfreicher Kontext

Mögliche Ergänzungen:

* “What does this name mean?”
* “What origin is this name?”
* “What names are similar?”
* “Is this name classic, modern, rare?”
* “Try it with a surname”

Priorität:

```txt id="w5ytka"
Mittel
```

---

# 10. P5 – Datenqualität

## Ziel

Daten sollen vertrauenswürdig und konsistent sein.

Prüfen:

* doppelte IDs
* fehlende Meanings
* fehlende Origins
* fehlende Styles
* leere Tags
* uneinheitliche Schreibweise
* sehr generische Bedeutungen

Mögliche spätere Aufgabe:

```txt id="45bo3r"
data/baby-names/database/baby-names.master.json systematisch validieren
```

Priorität:

```txt id="6fcvrf"
Mittel
```

---

# 11. P6 – Keine Massen-Erweiterung vor Qualität

Nicht jetzt:

* 5000 neue Namen erzeugen
* 500 neue Landingpages erzeugen
* automatische Übersetzungen starten
* Baby Names in andere Sprachen kopieren
* neue Datenbank ohne Review deployen

Grund:

```txt id="rg9jiy"
Der Cluster ist bereits groß.
Jetzt geht es um Qualität, interne Links und Nutzerwert.
```

---

# 12. Erste konkrete Aufgabe nach AdSense Review

Sobald AdSense entschieden hat und wir wieder aktiv an sichtbaren Änderungen arbeiten:

## Aufgabe 1

Baby Name Generator auditieren.

Benötigte Datei:

```txt id="z4ejcf"
app/baby-name-generator/BabyNameGeneratorClient.tsx
```

Ziel:

* aktuellen Aufbau verstehen
* UI/UX verbessern
* keine Funktionen kaputt machen
* Ergebnis-Karten verbessern
* interne Links stärken
* Favorites verbessern
* Mobile UX verbessern

## Aufgabe 2

Landingpage-Template auditieren.

Benötigte Datei:

```txt id="2qtage"
app/baby-names/[type]/page.tsx
```

Ziel:

* Landingpages stärker machen
* Related Collections ergänzen
* Generator CTA ergänzen
* dünne Seiten erkennen

## Aufgabe 3

Detailseiten auditieren.

Benötigte Datei:

```txt id="h767d8"
app/baby-name/[id]/page.tsx
```

Ziel:

* Detailseiten hilfreicher machen
* interne Links stärken
* Nutzer länger im Cluster halten

---

# 13. Erfolgskriterien

Der Baby-Name-Cluster ist besser, wenn:

* Nutzer schneller passende Namen finden
* Generator mehr genutzt wird
* Detailseiten besser verlinkt sind
* Landingpages nicht dünn wirken
* interne Links logisch sind
* Search Console mehr Seiten crawlt
* mehr Baby-Name-Seiten indexiert werden
* AdSense die Seite hochwertiger bewertet
* langfristig organischer Traffic wächst

---

# 14. Zusammenfassung

Aktueller Zustand:

```txt id="58wv28"
Baby Names ist der größte SEO-Cluster auf Toollane.
Die technische Grundstruktur ist stark.
Der Root-Hub ist live.
Die Hub-Verlinkung funktioniert.
```

Nächster Fokus:

```txt id="jz5u7v"
Nicht mehr Seiten.
Mehr Qualität.
Bessere interne Links.
Bessere Generator-UX.
Stärkere Landingpages.
Hilfreichere Detailseiten.
```
