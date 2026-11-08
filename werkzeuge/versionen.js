#!/usr/bin/env node
/*
 * Versionsnummern für eingebundene Dateien (gegen veraltete Dateien im Browser-Zwischenspeicher).
 *
 * Hängt an jede lokale Datei in <script src> und <link href> der Seiten ein „?v=…“ an.
 * Die Nummer ist ein Kurz-Hash des Dateiinhalts: Ändert sich eine Datei, ändert sich ihre Nummer,
 * und Browser laden sie neu statt eine alte Fassung aus dem Zwischenspeicher zu nehmen.
 *
 *   npm run versionen          Nummern in allen Seiten aktualisieren
 *   (die Tests prüfen, dass alle Nummern aktuell sind)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const WURZEL = path.join(__dirname, '..');

function seiten() {
  const liste = [path.join(WURZEL, 'index.html')];
  const suche = (ordner) => {
    for (const e of fs.readdirSync(ordner, { withFileTypes: true })) {
      const p = path.join(ordner, e.name);
      if (e.isDirectory()) suche(p);
      else if (e.name.endsWith('.html')) liste.push(p);
    }
  };
  for (const fach of ['mathematik']) if (fs.existsSync(path.join(WURZEL, fach))) suche(path.join(WURZEL, fach));
  return liste;
}

const MUSTER = /(<(?:script|link)\b[^>]*?\s(?:src|href)=")([^"?#]+)(\?v=[0-9a-f]+)?(")/g;
const hash = (datei) => crypto.createHash('sha1').update(fs.readFileSync(datei)).digest('hex').slice(0, 8);

/** Seite mit aktuellen Nummern; null, wenn eine eingebundene Datei fehlt */
function mitVersionen(seite) {
  const html = fs.readFileSync(seite, 'utf8');
  const fehlend = [];
  const neu = html.replace(MUSTER, (ganz, vor, url, _alt, nach) => {
    if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) return ganz;
    const datei = path.join(path.dirname(seite), url);
    if (!fs.existsSync(datei)) { fehlend.push(url); return ganz; }
    return `${vor}${url}?v=${hash(datei)}${nach}`;
  });
  return { html, neu, fehlend };
}

module.exports = { seiten, mitVersionen };

if (require.main === module) {
  let geaendert = 0;
  for (const s of seiten()) {
    const { html, neu, fehlend } = mitVersionen(s);
    if (fehlend.length) console.warn(`${path.relative(WURZEL, s)}: Datei fehlt: ${fehlend.join(', ')}`);
    if (neu !== html) { fs.writeFileSync(s, neu); geaendert++; console.log(`aktualisiert: ${path.relative(WURZEL, s)}`); }
  }
  console.log(geaendert ? `${geaendert} Seite(n) aktualisiert.` : 'Alle Versionsnummern sind aktuell.');
}
