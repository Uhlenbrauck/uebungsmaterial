'use strict';
const test = require('node:test');
const assert = require('node:assert');
const katex = require('../assets/vendor/katex/katex.min.js');
const { lade, ALLE, texWert } = require('./hilfe.js');

const UM = lade(...ALLE);
const DURCHLAEUFE = 300;

/** Terme der Klassenarbeit (so wie die Generatoren sie drucken würden) – dürfen nicht als Aufgabe erscheinen. */
const AUS_DER_ARBEIT = new Set([
  '-65-136', '-13+43', '2{,}8-10', '(-32)+(-52)', '6{,}3-(-7{,}8)', '0{,}96:(-3)', '0{,}7\\cdot (-0{,}6)',
  '-\\frac{3}{2}-\\left(+\\frac{2}{5}\\right)', '-\\frac{3}{5}\\cdot \\left(-\\frac{5}{9}\\right)', '4\\cdot (-5{,}3+1{,}3)',
]);

function formeln(text) {
  const out = [];
  String(text).replace(/\$([^$]+)\$/g, (_, f) => out.push(f));
  return out;
}

function pruefeKatex(f, wo) {
  try {
    katex.renderToString(f, { throwOnError: true });
  } catch (e) {
    assert.fail(`KaTeX-Fehler in ${wo}: ${f}\n${e.message}`);
  }
}

test('Bruch: Eingaben werden erkannt', () => {
  const { leseEingabe, Bruch } = UM;
  const fall = (t, z, n, form) => {
    const e = leseEingabe(t);
    assert.ok(e, t);
    assert.ok(e.wert.gleich(new Bruch(z, n)), `${t} → ${e.wert}`);
    if (form) assert.strictEqual(e.form, form);
  };
  fall('-3', -3, 1, 'ganz');
  fall('−3,5', -7, 2, 'dezimal');
  fall('+0.25', 1, 4, 'dezimal');
  fall('- 7 / 4', -7, 4, 'bruch');
  fall('-1 3/4', -7, 4, 'gemischt');
  fall('(−12)', -12, 1, 'ganz');
  fall(',5', 1, 2, 'dezimal');
  assert.strictEqual(leseEingabe('abc'), null);
  assert.strictEqual(leseEingabe('3/0'), null);
  assert.strictEqual(leseEingabe('1 5/4'), null);
  assert.strictEqual(leseEingabe('6/8').gekuerzt, false);
  assert.strictEqual(UM.pruefeZahl('6/8', new Bruch(3, 4), { gekuerzt: true }).grund, 'kuerzen');
  assert.ok(UM.pruefeZahl('0,75', new Bruch(3, 4), { gekuerzt: true }).ok);
});

test('Summe: klammerfreie Eingabe', () => {
  const B = (z, n = 1) => new UM.Bruch(z, n);
  assert.ok(UM.pruefeSumme('−3 + 5 − 2,5', [B(-3), B(5), B(-5, 2)]).ok);
  assert.ok(UM.pruefeSumme('5-2,5-3', [B(-3), B(5), B(-5, 2)]).ok);
  assert.strictEqual(UM.pruefeSumme('-3+(5)', [B(-3), B(5)]).grund, 'klammer');
  assert.strictEqual(UM.pruefeSumme('-3--5', [B(-3), B(5)]).grund, 'unlesbar');
  assert.strictEqual(UM.pruefeSumme('-3-5', [B(-3), B(5)]).grund, 'falsch');
  assert.ok(UM.pruefeSumme('-1 1/2+3/4', [B(-3, 2), B(3, 4)]).ok);
});

test('Bruch: Dezimal- und TeX-Ausgabe', () => {
  const { Bruch } = UM;
  assert.strictEqual(new Bruch(-7, 4).dezText(), '-1,75');
  assert.strictEqual(new Bruch(1, 20).dezText(), '0,05');
  assert.strictEqual(new Bruch(-7, 4).tex('gemischt'), '-1\\frac{3}{4}');
  assert.strictEqual(Bruch.dez('-0,09').tex('dezimal'), '-0{,}09');
  assert.ok(!new Bruch(1, 3).istEndlichDezimal());
});

test('Term: Klammern um negative Zahlen, Fehler bei fehlender Klammer', () => {
  const { T, term } = UM;
  const k = T.minus(T.Z(-3), T.Z(-2));
  assert.strictEqual(term.tex(k), '-3-(-2)');
  assert.strictEqual(term.wert(k).z, -1);
  assert.throws(() => term.tex(T.minus(T.Z(1), T.plus(T.Z(2), T.Z(3)))));
});

for (const [name, g] of Object.entries(UM.generatoren)) {
  test(`Generator ${name}`, () => {
    for (const stufe of [1, 2, 3]) {
      for (let i = 0; i < DURCHLAEUFE; i++) {
        const a = g(stufe);
        const wo = `${name} Stufe ${stufe}`;
        const alles = JSON.stringify(a, (k, v) => (typeof v === 'string' && v.startsWith('<svg') ? '' : v));
        assert.ok(!/undefined|NaN|:null|\[object/.test(alles), `${wo}: ${alles}`);
        assert.ok(a.frage && a.felder.length && a.loesung.length, wo);
        const texte = [a.frage, a.hinweis || '', ...a.loesung.filter((l) => typeof l === 'string'), ...a.felder.flatMap((f) => [...(f.optionen || []), f.label || ''])];
        for (const t of texte) for (const f of formeln(t)) pruefeKatex(f, wo);
        if (a.term) pruefeKatex(a.term, wo);
        if (a.term) assert.ok(!AUS_DER_ARBEIT.has(a.term), `${wo}: Aufgabe aus der Klassenarbeit: ${a.term}`);
        for (const f of a.felder) {
          if (f.art === 'zahl') {
            const w = f.antwort;
            assert.ok(w instanceof UM.Bruch || (w && typeof w.z === 'number'), wo);
            // Die eigene Darstellung der Lösung muss als richtige Eingabe erkannt werden.
            assert.ok(UM.pruefeZahl(w.text('bruch'), w, { gekuerzt: f.gekuerzt }).ok, `${wo}: ${w.text()}`);
            if (w.istEndlichDezimal()) assert.ok(UM.pruefeZahl(w.text('dezimal'), w, f).ok, wo);
            // Ergebnis passt zum gedruckten Term (unabhängige Auswertung)
            if (a.term && f.label === 'Ergebnis' && name !== 'rz-fehler') {
              assert.ok(Math.abs(texWert(a.term) - w.zahl()) < 1e-9, `${wo}: ${a.term} = ${texWert(a.term)} ≠ ${w.text()}`);
            }
          } else if (f.art === 'summe') {
            assert.ok(Array.isArray(f.antwort) && f.antwort.length >= 2, wo);
            assert.ok(UM.pruefeSumme(UM.summeText(f.antwort, 'bruch'), f.antwort).ok, `${wo}: ${UM.summeText(f.antwort)}`);
            assert.ok(UM.pruefeSumme(UM.summeText(f.antwort.slice().reverse(), 'bruch'), f.antwort).ok, `${wo}: Reihenfolge`);
            assert.ok(!UM.pruefeSumme(UM.summeText(f.antwort, 'bruch') + ' + 1', f.antwort).ok, wo);
            // Die Summe hat denselben Wert wie das Ergebnis
            const ergebnis = a.felder.filter((x) => x.art === 'zahl').pop();
            const summe = f.antwort.reduce((x, y) => x.plus(y), new UM.Bruch(0));
            assert.ok(summe.gleich(ergebnis.antwort), `${wo}: Summe ${summe} ≠ ${ergebnis.antwort}`);
          } else if (f.art === 'auswahl') {
            assert.ok(Number.isInteger(f.richtig) && f.richtig >= 0 && f.richtig < f.optionen.length, wo);
            assert.strictEqual(new Set(f.optionen).size, f.optionen.length, `${wo}: doppelte Optionen`);
          } else if (f.art === 'strahl') {
            const x = UM.zahlenstrahl.xVon(f.cfg, f.ziel);
            assert.ok(UM.zahlenstrahl.wertAusX(f.cfg, x).gleich(f.ziel), `${wo}: Ziel nicht im Raster`);
          } else if (f.art === 'mengen') {
            assert.strictEqual(f.zahlen.length, 4, wo);
            for (const z of f.zahlen) {
              pruefeKatex(z.tex, wo);
              assert.ok(z.Q && (!z.N || z.Z), wo);
              if (!z.tex.includes('overline')) assert.ok(Math.abs(texWert(z.tex) - z.w.zahl()) < 1e-9, `${wo}: ${z.tex}`);
            }
          } else assert.fail(`${wo}: unbekanntes Feld ${f.art}`);
        }
      }
    }
  });
}

test('Vergleich: richtiges Zeichen', () => {
  for (let i = 0; i < 500; i++) {
    const a = UM.generatoren['rz-vergleich'](1 + (i % 3));
    const [l, r] = a.term.split('\\;\\square\\;');
    const c = Math.sign(texWert(l) - texWert(r));
    assert.strictEqual(a.felder[0].richtig, c + 1, a.term);
  }
});

test('Vorzeichen: richtige Auswahl', () => {
  for (let i = 0; i < 500; i++) {
    const a = UM.generatoren['rz-vorzeichen'](1 + (i % 3));
    const v = texWert(a.term);
    assert.strictEqual(a.felder[0].richtig, v === 0 ? 2 : v > 0 ? 0 : 1, a.term);
  }
});

test('Fehler finden: Aufgabe ist wirklich falsch, Lösung richtig', () => {
  for (const f of UM.daten.FEHLER) {
    const [links, rechts] = f.tex.split('=');
    assert.ok(Math.abs(texWert(links) - texWert(rechts)) > 1e-9, f.tex);
    assert.ok(Math.abs(texWert(links) - f.w.zahl()) < 1e-9, f.tex);
  }
});

test('Thema: jede Kompetenz hat Checklisten-Zeilen und vorhandene Generatoren', () => {
  const UMt = lade(...ALLE, 'mathematik/klasse-7/rationale-zahlen/thema.js');
  for (const k of UMt.thema.kompetenzen) {
    assert.ok(Array.isArray(k.zeilen) && k.zeilen.length > 0, k.id);
    for (const u of k.uebungen) assert.ok(UMt.generatoren[u.gen], `${k.id}: ${u.gen} fehlt`);
    for (const n of [...(k.notizbuch || []), ...(k.notizbuchUeben || [])]) assert.ok(n.onenote.startsWith('onenote:') && (!n.web || n.web.startsWith('https://')), n.titel);
    for (const g of k.realmath || []) for (const l of g.links) assert.ok(l.url.startsWith('https://realmath.de/'), l.url);
  }
});
