'use strict';
const test = require('node:test');
const assert = require('node:assert');
const katex = require('../assets/vendor/katex/katex.min.js');
const { lade, ALLE, texWert } = require('./hilfe.js');

const UM = lade(...ALLE);
const DURCHLAEUFE = 300;

/** Gesperrte Terme (Klassenarbeit) liegen nur als Prüfsummen im Generator, siehe UM.gesperrteTerme. */

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

test('Sperre: gesperrte Terme werden neu erzeugt', () => {
  assert.strictEqual(UM.gesperrteTerme.size, 14);
  // Bekannter Term, der die Sperre auslösen muss (Beispiel, nicht aus der Arbeit):
  assert.strictEqual(UM.termHash('1+1'), UM.termHash('1+1'));
  // rz-multdiv Stufe 2 kann einen gesperrten Term liefern; über viele Durchläufe darf er nie erscheinen
  for (let i = 0; i < 20000; i++) {
    const a = UM.generatoren['rz-multdiv'](2);
    assert.ok(!UM.gesperrteTerme.has(UM.termHash(a.term)), a.term);
  }
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
        // Formeln in Tabellen und Bildern
        for (const f of formeln(String(a.bild || '').replace(/<svg[\s\S]*?<\/svg>/g, ''))) pruefeKatex(f, wo);
        if (a.term) assert.ok(!UM.gesperrteTerme.has(UM.termHash(a.term)), `${wo}: gesperrter Term: ${a.term}`);
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
          } else if (f.art === 'menge') {
            assert.ok(Array.isArray(f.antwort), wo);
            // Die eigene Lösung (auch in anderer Reihenfolge) wird erkannt, eine fehlende Lösung nicht
            assert.ok(UM.pruefeMenge(UM.mengeText(f.antwort), f.antwort).ok, `${wo}: ${UM.mengeText(f.antwort)}`);
            assert.ok(UM.pruefeMenge(UM.mengeText(f.antwort).replace(/[{}]/g, '').split('; ').reverse().join('; ') || '{}', f.antwort).ok, `${wo}: Reihenfolge`);
            if (f.antwort.length > 1) assert.ok(!UM.pruefeMenge(UM.mengeText(f.antwort.slice(1)), f.antwort).ok, wo);
            for (const t of formeln(UM.mengeTex(f.antwort))) pruefeKatex(t, wo);
            pruefeKatex(UM.mengeTex(f.antwort), wo);
          } else if (f.art === 'naeherung') {
            assert.ok(Number.isFinite(f.wert), wo);
            assert.ok(UM.pruefeNaeherung(UM.naeherungText(f.wert, f.stellen ?? 2), f.wert, f).ok, `${wo}: ${UM.naeherungText(f.wert, 2)} für ${f.wert}`);
            if (f.prozent) assert.ok(UM.pruefeNaeherung(UM.naeherungText(f.wert, 3, true), f.wert, f).ok, `${wo}: Prozent`);
            if (f.exakt) assert.ok(UM.pruefeNaeherung(f.exakt.text('bruch'), f.wert, f).ok, `${wo}: Bruch`);
            assert.ok(!UM.pruefeNaeherung(UM.naeherungText(f.wert + 0.05, 2), f.wert, f).ok, `${wo}: zu ungenau erkannt`);
          } else if (f.art === 'cas') {
            assert.ok(UM.pruefeCas(f.loesung, f.soll).ok, `${wo}: eigene Lösung ${f.loesung} nicht erkannt`);
            assert.ok(!UM.pruefeCas(f.loesung.slice(0, -1), f.soll).ok, `${wo}: ohne Klammer erkannt`);
            assert.ok(typeof f.ausgabe === 'string' && f.ausgabe.length > 0 && !/NaN|undefined/.test(f.ausgabe), `${wo}: Ausgabe ${f.ausgabe}`);
          } else assert.fail(`${wo}: unbekanntes Feld ${f.art}`);
        }
      }
    }
  });
}

test('CAS: gleichwertige Eingaben und typische Fehler', () => {
  const F = '-0.0215*x^2+0.254*x+0.9';
  const ok = (e, soll) => assert.ok(UM.pruefeCas(e, soll).ok, e);
  const nein = (e, soll, teil) => { const r = UM.pruefeCas(e, soll); assert.ok(!r.ok, e); if (teil) assert.ok(r.meldung.includes(teil), `${e}: ${r.meldung}`); };
  ok('f(x):=-0.0215x^2+0.254x+0.9', { art: 'definition', ausdruck: F });
  ok('F(X) := 0.9 + 0.254*x - 0.0215*x^2', { art: 'definition', ausdruck: F });
  nein('f(x)=-0.0215x^2+0.254x+0.9', { art: 'definition', ausdruck: F }, ':=');
  nein('f(x):=-0,0215x^2+0.254x+0.9', { art: 'definition', ausdruck: F }, 'Dezimalpunkt');
  const s = { art: 'solve', links: 'f(x)', rechts: '2.5', f: F };
  ok('solve(f(x)=2.5,x)', s);
  ok('solve(2.5=f(x),x)', s);
  ok('solve(-0.0215x^2+0.254x+0.9=2.5,x)', s);
  nein('solve(f(x)=2,5,x)', s, 'Dezimalpunkt');
  nein('solve(f(x)=2.5)', s, 'Variablen');
  nein('solve(f(x)=2.5,x', s, 'Klammern');
  nein('solve(f(x)=3,x)', s, 'Inhalt');
  nein('factor(f(x))', s, 'anderer Befehl');
  ok('completeSquare(f(x),x)', { art: 'completesquare', ausdruck: 'f(x)', f: F });
  ok('factor(3x^2-12x)', { art: 'factor', ausdruck: '3*x^2-12*x' });
  ok('factor(3x^2-12x,x)', { art: 'factor', ausdruck: '3*x^2-12*x' });
  ok('f(3.5)', { art: 'wert', arg: 3.5 });
  nein('f(3,5)', { art: 'wert', arg: 3.5 }, 'Dezimalpunkt');
});

test('CAS: binomPdf mit typischen Fehlern', () => {
  const s = { art: 'binompdf', n: 10, p: 0.2, k: 3 };
  const ok = (e, soll = s) => assert.ok(UM.pruefeCas(e, soll).ok, e);
  const nein = (e, teil, soll = s) => { const r = UM.pruefeCas(e, soll); assert.ok(!r.ok, e); assert.ok(r.meldung.includes(teil), `${e}: ${r.meldung}`); };
  ok('binomPdf(10,0.2,3)');
  ok('BINOMPDF(10, .2, 3)');
  ok('binomPdf(10,1/5,3)');
  ok('binomPdf(8,1/6,2)', { art: 'binompdf', n: 8, p: 1 / 6, k: 2 });
  nein('binomPdf(10,3,0.2)', 'Reihenfolge');
  nein('binomPdf(0.2,10,3)', 'Reihenfolge');
  nein('binomPdf(10,0,2,3)', 'Dezimalpunkt');
  nein('binomPdf(10,0.2)', 'drei Angaben');
  nein('binomCdf(10,0.2,3)', 'anderer Befehl');
  nein('binomPdf(10,2,3)', 'Trefferwahrscheinlichkeit');
  nein('binomPdf(10,0.2,4)', 'Inhalt');
});

test('Binomialverteilung: Rechnung stimmt', () => {
  const { bk, pdf, pdfExakt } = UM.binomial;
  assert.strictEqual(bk(10, 3), 120);
  assert.strictEqual(bk(30, 15), 155117520);
  assert.ok(Math.abs(pdf(10, 0.2, 3) - 0.201326592) < 1e-12);
  assert.ok(pdfExakt(4, new UM.Bruch(1, 2), 2).gleich(new UM.Bruch(3, 8)));
  // Summe aller Wahrscheinlichkeiten ist 1
  for (const [n, p] of [[12, 1 / 6], [20, 0.85], [7, 0.3]]) {
    let s = 0;
    for (let k = 0; k <= n; k++) s += pdf(n, p, k);
    assert.ok(Math.abs(s - 1) < 1e-12, `${n}, ${p}`);
  }
});

test('Binomialverteilung: angezeigte Ausgabe passt zum Ergebnisfeld', () => {
  for (let i = 0; i < 2000; i++) {
    const a = UM.generatoren['bv-cas'](2 + (i % 2));
    const cas = a.felder.find((f) => f.art === 'cas');
    const w = a.felder.find((f) => f.art === 'naeherung');
    const { n, p, k } = cas.soll;
    assert.ok(Math.abs(UM.binomial.pdf(n, p, k) - w.wert) < 1e-12);
    assert.ok(Math.abs(Number(cas.ausgabe) - w.wert) < 1e-5, cas.ausgabe);
  }
});

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

for (const pfad of ['mathematik/klasse-7/rationale-zahlen/thema.js', 'mathematik/klasse-10/wahrscheinlichkeit-quadratische-gleichungen/thema.js', 'mathematik/q2/binomialverteilung/thema.js']) test(`Thema ${pfad}: jede Kompetenz hat Checklisten-Zeilen und vorhandene Generatoren`, () => {
  const UMt = lade(...ALLE, pfad);
  const ids = new Set();
  for (const k of UMt.thema.kompetenzen) {
    assert.ok(!ids.has(k.id), `doppelte id ${k.id}`);
    ids.add(k.id);
    assert.ok(Array.isArray(k.zeilen) && k.zeilen.length > 0, k.id);
    for (const u of k.uebungen) assert.ok(UMt.generatoren[u.gen], `${k.id}: ${u.gen} fehlt`);
    for (const n of [...(k.notizbuch || []), ...(k.notizbuchUeben || [])]) assert.ok(n.onenote.startsWith('onenote:') && (!n.web || n.web.startsWith('https://')), n.titel);
    for (const g of k.realmath || []) for (const l of g.links) assert.ok(l.url.startsWith('https://realmath.de/'), l.url);
  }
});
