/*
 * Weitere Antwortformen (ergänzt bruch.js):
 *
 *   Wurzel        exakter Wert q·√r (q Bruch, r quadratfrei), z. B. −2√3 – für Lösungsmengen
 *   leseMenge     Lösungsmenge wie "{−3; 3}", "0; 4", "−√2; √2", "±3", "{}" (leere Menge)
 *   pruefeMenge   Vergleich ohne Reihenfolge
 *   pruefeNaeherung  gerundete Werte (CAS-Ergebnisse, Wahrscheinlichkeiten auch in %)
 */
(function (global) {
  'use strict';
  const UM = (global.UM = global.UM || {});
  const { Bruch, leseEingabe } = UM;

  /** n = s²·m mit m quadratfrei → [s, m] */
  function zerlege(n) {
    let s = 1;
    let m = n;
    for (let p = 2; p * p <= m; p++) {
      while (m % (p * p) === 0) { m /= p * p; s *= p; }
    }
    return [s, m];
  }

  class Wurzel {
    /** Wert p + q·√n (p, q Brüche, n ≥ 0 ganz); ohne p: q·√n */
    constructor(q, n = 1, p = 0) {
      q = Bruch.von(q);
      this.p = Bruch.von(p);
      if (!Number.isInteger(n) || n < 0) throw new Error('Ungültiger Radikand ' + n);
      if (n === 0 || q.z === 0) { this.q = new Bruch(0); this.r = 1; }
      else {
        const [s, m] = zerlege(n);
        this.q = q.mal(s);
        this.r = m;
      }
      // rationaler Wert ganz in p
      if (this.r === 1) { this.p = this.p.plus(this.q); this.q = new Bruch(0); }
    }
    static von(x) { return x instanceof Wurzel ? x : new Wurzel(0, 1, Bruch.von(x)); }
    gleich(w) { w = Wurzel.von(w); return this.r === w.r && this.q.gleich(w.q) && this.p.gleich(w.p); }
    istRational() { return this.q.z === 0; }
    neg() { return new Wurzel(this.q.neg(), this.r, this.p.neg()); }
    /** p − q·√r (konjugiert) */
    konj() { return new Wurzel(this.q.neg(), this.r, this.p); }
    zahl() { return this.p.zahl() + this.q.zahl() * Math.sqrt(this.r); }
    wurzelTex() {
      const w = `\\sqrt{${this.r}}`;
      const b = this.q.abs();
      const t = b.gleich(1) ? w : b.istGanz() ? b.tex() + w : `\\frac{${b.z}}{${b.n}}\\sqrt{${this.r}}`;
      return t;
    }
    tex() {
      if (this.istRational()) return this.p.tex();
      const vz = this.q.vgl(0) < 0 ? '-' : '+';
      if (this.p.z === 0) return (vz === '-' ? '-' : '') + this.wurzelTex();
      return `${this.p.tex()}${vz}${this.wurzelTex()}`;
    }
    text() {
      if (this.istRational()) return this.p.text();
      const b = this.q.abs();
      const w = (b.gleich(1) ? '' : b.istGanz() ? b.text() : '(' + b.text() + ')·') + '√' + this.r;
      const vz = this.q.vgl(0) < 0 ? '−' : '+';
      if (this.p.z === 0) return (vz === '−' ? '−' : '') + w;
      return `${this.p.text()}${vz}${w}`;
    }
  }

  /** Wurzelteil „k·√n“, „√n/2“, „(1/2)·√13“ lesen → Wurzel (ohne rationalen Teil) oder null */
  function leseWurzelteil(s) {
    const m = /^([+-]?)\s*(?:\(?\s*(\d+(?:[.,]\d+)?(?:\s*\/\s*\d+)?)\s*\)?)?\s*[·*⋅]?\s*√\s*(?:\(\s*(\d+)\s*\)|(\d+))(?:\s*\/\s*(\d+))?$/.exec(s);
    if (!m) return null;
    let k = new Bruch(1);
    if (m[2]) {
      const e = leseEingabe(m[2]);
      if (!e) return null;
      k = e.wert;
    }
    if (m[5]) { if (Number(m[5]) === 0) return null; k = k.durch(Number(m[5])); }
    if (m[1] === '-') k = k.neg();
    return new Wurzel(k, Number(m[3] || m[4]));
  }

  /** Ein Element einer Lösungsmenge lesen. Rückgabe: [Wurzel, …] (zwei Werte bei ±) oder null */
  function leseElement(text) {
    let s = String(text)
      .replace(/[−–—]/g, '-')
      .replace(/ /g, ' ')
      .replace(/sqrt|wurzel/gi, '√')
      .replace(/\+-|\+\/-/g, '±')
      .trim();
    if (s === '') return null;
    if (!s.includes('√')) {
      if (s.startsWith('±')) {
        const e = leseEingabe(s.slice(1).trim());
        if (!e || /^[+-]/.test(s.slice(1).trim())) return null;
        const w = new Wurzel(0, 1, e.wert);
        return [w, w.neg()];
      }
      const e = leseEingabe(s);
      return e ? [new Wurzel(0, 1, e.wert)] : null;
    }
    // rationaler Teil vor dem Wurzelteil? „−3 + √7“, „1/2 − √13/2“, „−3 ± 2√2“
    const m = /^([+-]?\s*\d+(?:[.,]\d+)?(?:\s*\/\s*\d+)?)\s*([+\-±])\s*(.+)$/.exec(s);
    if (m && m[3].includes('√') && !/^[+-]/.test(m[3])) {
      const e = leseEingabe(m[1].replace(/\s+/g, ''));
      const w = leseWurzelteil(m[3]);
      if (!e || !w) return null;
      const plus = new Wurzel(w.q, w.r, e.wert);
      if (m[2] === '±') return [plus, plus.konj()];
      return [m[2] === '-' ? plus.konj() : plus];
    }
    let pm = false;
    if (s.startsWith('±')) { pm = true; s = s.slice(1).trim(); if (/^[+-]/.test(s)) return null; }
    const w = leseWurzelteil(s);
    if (!w) return null;
    return pm ? [w, w.neg()] : [w];
  }

  /** "{−3; 3}" → [Wurzel, Wurzel]; leere Menge → []; unlesbar → null */
  function leseMenge(text) {
    if (text == null) return null;
    let s = String(text).replace(/ /g, ' ').trim();
    if (/^[{]?\s*[}]?$/.test(s) || /^(∅|leer|leere menge|\{\s*\})$/i.test(s)) return s === '' ? null : [];
    s = s.replace(/^[{]/, '').replace(/[}]$/, '').trim();
    if (s === '') return [];
    const teile = s.split(/[;|]/).map((t) => t.trim()).filter((t) => t !== '');
    const werte = [];
    for (const t of teile) {
      const e = leseElement(t);
      if (!e) return null;
      for (const w of e) if (!werte.some((x) => x.gleich(w))) werte.push(w);
    }
    return werte;
  }

  function pruefeMenge(eingabe, erwartet) {
    if (!String(eingabe || '').trim()) return { ok: false, grund: 'leer' };
    const ist = leseMenge(eingabe);
    if (!ist) return { ok: false, grund: 'unlesbar' };
    const soll = [];
    for (const w of erwartet.map(Wurzel.von)) if (!soll.some((x) => x.gleich(w))) soll.push(w);
    if (ist.length !== soll.length || !soll.every((w) => ist.some((x) => x.gleich(w)))) {
      if (soll.length > 1 && /\d,\d/.test(eingabe) && !/;/.test(eingabe)) return { ok: false, grund: 'semikolon' };
      return { ok: false, grund: 'falsch' };
    }
    return { ok: true };
  }

  const sortiert = (liste) => liste.map(Wurzel.von).sort((a, b) => a.zahl() - b.zahl());
  function mengeTex(liste) {
    if (!liste.length) return '\\{\\,\\}';
    return `\\{${sortiert(liste).map((w) => w.tex()).join(';\\,')}\\}`;
  }
  function mengeText(liste) {
    return `{${sortiert(liste).map((w) => w.text()).join('; ')}}`;
  }

  /**
   * Gerundete Eingabe prüfen.
   * optionen: stellen (Mindestzahl Nachkommastellen, Standard 2), prozent (auch „66,7 %“ erlaubt),
   *           exakt (Bruch: genau dieser Bruch ist auch richtig)
   */
  function pruefeNaeherung(eingabe, wert, optionen = {}) {
    const stellen = optionen.stellen ?? 2;
    let s = String(eingabe || '').replace(/[−–—]/g, '-').replace(/ /g, ' ').trim();
    if (!s) return { ok: false, grund: 'leer' };
    let prozent = false;
    if (/%$/.test(s)) {
      if (!optionen.prozent) return { ok: false, grund: 'unlesbar' };
      prozent = true;
      s = s.replace(/%$/, '').trim();
    }
    const e = leseEingabe(s);
    if (!e) return { ok: false, grund: 'unlesbar' };
    let v = e.wert.zahl();
    let d;
    if (e.form === 'dezimal') d = (/[.,](\d+)$/.exec(s) || ['', ''])[1].length;
    else if (e.form === 'ganz') d = 0;
    else {
      // Bruch: nur exakt richtig
      const ok = optionen.exakt ? e.wert.gleich(optionen.exakt) : Math.abs(v - wert) < 1e-9;
      return { ok, grund: ok ? undefined : 'falsch' };
    }
    if (prozent) { v /= 100; d += 2; }
    const abstand = Math.abs(v - wert);
    if (abstand < 1e-9) return { ok: true };
    if (abstand > 0.5 * 10 ** -d + 1e-9) return { ok: false, grund: 'falsch' };
    if (d < stellen) return { ok: false, grund: 'stellen' };
    return { ok: true };
  }

  /** Der richtige Wert, gerundet als Text („12,35“ bzw. „66,67 %“) */
  function naeherungText(wert, stellen = 2, prozent = false) {
    const x = prozent ? wert * 100 : wert;
    const d = prozent ? Math.max(stellen - 1, 0) : stellen;
    let t = (Math.round(x * 10 ** d) / 10 ** d).toFixed(d).replace('.', ',').replace('-', '−');
    if (/^−0(,0*)?$/.test(t)) t = t.slice(1);
    return prozent ? t + ' %' : t;
  }

  UM.Wurzel = Wurzel;
  UM.leseMenge = leseMenge;
  UM.pruefeMenge = pruefeMenge;
  UM.mengeTex = mengeTex;
  UM.mengeText = mengeText;
  UM.pruefeNaeherung = pruefeNaeherung;
  UM.naeherungText = naeherungText;
})(typeof window !== 'undefined' ? window : globalThis);
