# Übungsmaterial

Übungsumgebung zur Vorbereitung auf Klassenarbeiten und Klausuren (Friedrich-Bährens-Gymnasium, M. Uhlenbrauck).
Statische Seiten ohne Build-Schritt, ohne Anmeldung und ohne externe Server: Alles, auch der Formelsatz (KaTeX),
liegt im Repo. Der Lernfortschritt bleibt nur im Browser der Schülerinnen und Schüler.

## Aufbau

```
index.html                     Startseite (liest assets/js/katalog.js)
assets/
  css/style.css                Aussehen aller Seiten
  js/bruch.js                  exakte Bruchrechnung, Erkennen von Eingaben (−3,5 · −7/4 · −1 3/4)
  js/loesungen.js              Lösungsmengen mit Wurzeln ({−√2; √2}), gerundete Werte und Prozentangaben
  js/zufall.js                 Zufallshilfen für alle Generatoren
  js/cas.js                    CAS-Eingaben (TI-Nspire) prüfen: gleichwertige Formen, typische Fehler, Rechner-Seite
  js/term.js                   Termbäume: Wert und Formel aus derselben Struktur
  js/zahlenstrahl.js           Zahlenstrahl als SVG (Bild, Pfeilbild, zum Anklicken)
  js/aufgaben.js               Darstellung und Prüfung einer Aufgabe
  js/thema-seite.js            Themenseite: Checkliste, Übungen, Abschlusstest
  js/katalog.js                Inhaltsverzeichnis der Startseite
  js/generatoren/*.js          Aufgaben-Generatoren je Themengebiet
  vendor/katex/                KaTeX 0.16 (MIT-Lizenz), nur woff2-Schriften
mathematik/klasse-7/rationale-zahlen/
  index.html                   Seite des Themas
  thema.js                     Kompetenzen (= Checkliste), Übungen, Realmath-Links, Test-Einstellungen
mathematik/klasse-10/wahrscheinlichkeit-quadratische-gleichungen/
                               Ma 10c 2026/27, Klassenarbeit Nr. 1
docs/notizbuch-links.md        Notizbuch-Links mit dem Graph Explorer holen
tests/                         node --test, prüft alle Generatoren
```

## Eine Themenseite

1. **Checkliste** – die Kompetenzen mit allen Spalten des Kompetenzbogens; Selbsteinschätzung (😰 🙁 🙂 😄)
   je Zeile **vorher** und **nachher**.
2. **Übungen** je Kompetenz in drei Stufen. Aufgaben werden bei jedem Klick neu erzeugt, sofort geprüft, mit Tipp und
   Lösungsweg. Bei Zahleingaben werden ganze Zahlen, Dezimalzahlen, Brüche und gemischte Zahlen exakt verglichen;
   wo verlangt, muss ein Bruch vollständig gekürzt sein.
3. **Abschlusstest** – je Kompetenz eine zufällige Aufgabe (Stufe 2 oder 3). Nach dem Auswerten werden die Lösungen
   angezeigt und die Kompetenzen verlinkt, die noch geübt werden sollten. Jeder Versuch wird gespeichert.
4. **Mein Lernstand** – vorher/nachher, gelöste Übungen je Ampelstufe, letzter Test und alle Testversuche;
   als PDF speicherbar (Druckansicht), damit die Schüler ihn im Klassennotizbuch ablegen. Der Name wird nur
   für den Ausdruck eingetragen und nicht gespeichert.

## Neues Thema anlegen

1. Ordner anlegen, z. B. `mathematik/klasse-8/terme/`, `index.html` aus einem vorhandenen Thema kopieren
   (Pfade `../../../assets/` passen bei gleicher Tiefe).
2. Generatoren in `assets/js/generatoren/<gebiet>.js` schreiben (Format steht oben in
   `generatoren/rationale-zahlen.js`) und in `tests/hilfe.js` bei `ALLE` eintragen.
3. `thema.js` mit den Kompetenzen der Checkliste anlegen.
4. Eintrag in `assets/js/katalog.js` ergänzen.
5. `npm test` ausführen (oder `node --test tests/*.test.js`).

## Veröffentlichen mit GitHub Pages

Einmalig im Repo auf GitHub: **Settings → Pages → Build and deployment → Source: „GitHub Actions“.**
Der Workflow `.github/workflows/pages.yml` prüft bei jeder Änderung auf `main` die Tests und veröffentlicht
dann die Seite unter `https://uhlenbrauck.github.io/uebungsmaterial/` (Tests rot → keine Veröffentlichung).
Von Hand neu veröffentlichen: Actions → „Seite veröffentlichen“ → „Run workflow“.

Lokal ansehen: `index.html` per Doppelklick im Browser öffnen.

## Versionsnummern

An eingebundene Dateien hängt `npm run versionen` ein `?v=…` (Kurz-Hash des Inhalts). Ändert sich eine Datei, laden Browser sie
sofort neu. Die Tests schlagen fehl, wenn eine Nummer veraltet ist. Die HTML-Seite selbst kann GitHub Pages bis zu 10 Minuten
im Zwischenspeicher halten.

## Notizbuch-Links

Wie man die Links auf das OneNote-Klassennotizbuch für die Checkliste holt, steht in
[`docs/notizbuch-links.md`](docs/notizbuch-links.md).

## Lizenzen

KaTeX: MIT-Lizenz, siehe `assets/vendor/katex/LICENSE`.
