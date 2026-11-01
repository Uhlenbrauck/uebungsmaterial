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
tests/                         node --test, prüft alle Generatoren
```

## Eine Themenseite

1. **Checkliste** – die Kompetenzen aus dem Kompetenzbogen, mit Selbsteinschätzung (😰 🙁 🙂 😄).
2. **Übungen** je Kompetenz in drei Stufen. Aufgaben werden bei jedem Klick neu erzeugt, sofort geprüft, mit Tipp und
   Lösungsweg. Bei Zahleingaben werden ganze Zahlen, Dezimalzahlen, Brüche und gemischte Zahlen exakt verglichen;
   wo verlangt, muss ein Bruch vollständig gekürzt sein.
3. **Abschlusstest** – je Kompetenz eine zufällige Aufgabe (Stufe 2 oder 3). Nach dem Auswerten werden die Lösungen
   angezeigt und die Kompetenzen verlinkt, die noch geübt werden sollten.

## Neues Thema anlegen

1. Ordner anlegen, z. B. `mathematik/klasse-8/terme/`, `index.html` aus einem vorhandenen Thema kopieren
   (Pfade `../../../assets/` passen bei gleicher Tiefe).
2. Generatoren in `assets/js/generatoren/<gebiet>.js` schreiben (Format steht oben in
   `generatoren/rationale-zahlen.js`) und in `tests/hilfe.js` bei `ALLE` eintragen.
3. `thema.js` mit den Kompetenzen der Checkliste anlegen.
4. Eintrag in `assets/js/katalog.js` ergänzen.
5. `npm test` ausführen (oder `node --test tests/*.test.js`).

## Veröffentlichen mit GitHub Pages

Einmalig im Repo auf GitHub: **Settings → Pages → Build and deployment → Source: „Deploy from a branch“,
Branch: `main`, Ordner: `/ (root)` → Save.** Nach etwa einer Minute ist die Seite unter
`https://uhlenbrauck.github.io/uebungsmaterial/` erreichbar. Jede Änderung auf `main` wird automatisch veröffentlicht.

Lokal ansehen: `index.html` per Doppelklick im Browser öffnen.

## Lizenzen

KaTeX: MIT-Lizenz, siehe `assets/vendor/katex/LICENSE`.
