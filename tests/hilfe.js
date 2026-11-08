// Lädt die Browser-Skripte in einen eigenen Kontext und stellt Prüfhilfen bereit.
// Start: node --test tests/
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const WURZEL = path.join(__dirname, '..');

function lade(...dateien) {
  const ctx = { console, Math, Number, String, Object, Array, Error, JSON, Set, Map };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  for (const d of dateien) {
    vm.runInContext(fs.readFileSync(path.join(WURZEL, d), 'utf8'), ctx, { filename: d });
  }
  return ctx.UM;
}

const ALLE = [
  'assets/js/bruch.js',
  'assets/js/loesungen.js',
  'assets/js/term.js',
  'assets/js/zahlenstrahl.js',
  'assets/js/zufall.js',
  'assets/js/cas.js',
  'assets/js/generatoren/rationale-zahlen.js',
  'assets/js/generatoren/wahrscheinlichkeit.js',
  'assets/js/generatoren/quadratische-funktionen.js',
  'assets/js/generatoren/cas-befehle.js',
];

/**
 * Unabhängige Auswertung eines TeX-Terms mit Gleitkommazahlen:
 * prüft, ob das Gedruckte zum berechneten Ergebnis passt.
 */
function texWert(tex) {
  let s = tex
    .replace(/\\left|\\right/g, '')
    .replace(/\\frac\{(\d+)\}\{-(\d+)\}/g, '($1/-$2)')
    .replace(/(\d+)\\frac\{(\d+)\}\{(\d+)\}/g, '($1+$2/$3)')
    .replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '($1/$2)')
    .replace(/\{,\}/g, '.')
    .replace(/\\cdot\s*/g, '*')
    .replace(/:/g, '/')
    .replace(/\\,|\s/g, '');
  // Beträge |…| (nicht verschachtelt)
  s = s.replace(/\|([^|]*)\|/g, 'Math.abs($1)');
  if (/[^0-9+\-*/().Mathabs]/.test(s)) throw new Error('Unerwartetes Zeichen in ' + tex + ' → ' + s);
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${s});`)();
}

module.exports = { lade, ALLE, texWert };
