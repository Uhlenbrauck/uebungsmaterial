# Projektregeln für Claude

- **Zweck**: Übungsmaterial für Schülerinnen und Schüler zur Vorbereitung auf Klassenarbeiten (Sek I) und Klausuren (Sek II). Ein Repo für alle Fächer, Stufen und Kurse; Ordner `fach/stufe/thema/`.
- **Datenschutz**: Keine Schülerdaten, keine Namen echter Schüler, keine Klassenarbeiten oder Musterlösungen im Repo. Fortschritt nur in `localStorage`, nie übertragen.
- **Offline / keine Dritten**: Keine CDNs, Web-Fonts, Analytics oder sonstige externe Abrufe zur Laufzeit. Bibliotheken liegen in `assets/vendor/`. Ausnahme: Links auf externe Übungsseiten (z. B. Realmath), die Schüler selbst anklicken.
- **Kein Build-Schritt**: Klassische `<script>`-Dateien mit globalem `UM`, damit die Seiten auch per Doppelklick (file://) laufen.
- **Inhalte**: Aufgaben orientieren sich an Notizbuch und Kompetenz-Checkliste des Kurses, **nicht** an den Aufgaben der kommenden Klassenarbeit (keine identischen oder nur leicht veränderten Aufgaben). Keine „Probearbeit“; stattdessen Abschlusstest aus dem Aufgabenpool.
- **Korrektheit**: Aufgaben, Lösung und Ergebnis aus derselben Struktur erzeugen (`term.js`). Jeder Generator muss die Tests in `tests/` bestehen (`npm test`): KaTeX-gültig, Ergebnis passt zum gedruckten Term, eigene Lösung wird als richtige Eingabe erkannt.
- **Sprache**: Oberfläche und Texte auf Deutsch, Schüler werden geduzt. Dezimalkomma, Minuszeichen „−“ in Texten.
- **Arbeitsweise**: Änderungen als Pull Request zur Durchsicht, nicht direkt auf `main` (main wird über GitHub Pages veröffentlicht).
