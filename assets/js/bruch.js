/*
 * Exakte Bruchrechnung, Eingabe-Erkennung und TeX-Ausgabe.
 * Klassisches Skript (kein Modul), damit die Seiten auch per Doppelklick
 * (file://) funktionieren. Alles hängt am globalen Objekt UM.
 */
(function (global) {
  'use strict';
  const UM = (global.UM = global.UM || {});

  function ggT(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) [a, b] = [b, a % b];
    return a || 1;
  }

  class Bruch {
    constructor(z, n = 1) {
      if (!Number.isInteger(z) || !Number.isInteger(n) || n === 0) {
        throw new Error(`Ungültiger Bruch ${z}/${n}`);
      }
      if (n < 0) {
        z = -z;
        n = -n;
      }
      const g = ggT(z, n);
      this.z = z / g;
      this.n = n / g;
      if (Object.is(this.z, -0)) this.z = 0;
    }
    static von(x) {
      if (x instanceof Bruch) return x;
      if (Number.isInteger(x)) return new Bruch(x, 1);
      if (typeof x === 'string') return Bruch.dez(x);
      throw new Error(`Kann ${x} nicht in einen Bruch umwandeln`);
    }
    /** Dezimalzahl als Text, z. B. "-3,25" oder "0.4" */
    static dez(text) {
      const m = /^([+-]?)(\d*)(?:[.,](\d+))?$/.exec(String(text).trim());
      if (!m || (m[2] === '' && !m[3])) throw new Error(`Keine Dezimalzahl: ${text}`);
      const nach = m[3] || '';
      const n = 10 ** nach.length;
      const z = Number(m[2] || '0') * n + Number(nach || '0');
      return new Bruch(m[1] === '-' ? -z : z, n);
    }
    plus(b) { b = Bruch.von(b); return new Bruch(this.z * b.n + b.z * this.n, this.n * b.n); }
    minus(b) { b = Bruch.von(b); return new Bruch(this.z * b.n - b.z * this.n, this.n * b.n); }
    mal(b) { b = Bruch.von(b); return new Bruch(this.z * b.z, this.n * b.n); }
    durch(b) {
      b = Bruch.von(b);
      if (b.z === 0) throw new Error('Division durch 0');
      return new Bruch(this.z * b.n, this.n * b.z);
    }
    neg() { return new Bruch(-this.z, this.n); }
    abs() { return new Bruch(Math.abs(this.z), this.n); }
    vz() { return Math.sign(this.z); }
    istGanz() { return this.n === 1; }
    gleich(b) { b = Bruch.von(b); return this.z === b.z && this.n === b.n; }
    vgl(b) { b = Bruch.von(b); return Math.sign(this.z * b.n - b.z * this.n); }
    zahl() { return this.z / this.n; }
    /** endliche Dezimalzahl? (Nenner nur mit Faktoren 2 und 5) */
    istEndlichDezimal() {
      let n = this.n;
      while (n % 2 === 0) n /= 2;
      while (n % 5 === 0) n /= 5;
      return n === 1;
    }
    /** Dezimaltext mit Komma, nur für endliche Dezimalzahlen */
    dezText() {
      if (!this.istEndlichDezimal()) throw new Error('Keine endliche Dezimalzahl');
      // Stellen: kleinste k mit n | 10^k
      let stellen = 0;
      while ((10 ** stellen) % this.n !== 0) stellen++;
      const faktor = 10 ** stellen / this.n;
      const ganz = Math.abs(this.z) * faktor;
      let s = String(ganz).padStart(stellen + 1, '0');
      if (stellen > 0) s = s.slice(0, -stellen) + ',' + s.slice(-stellen);
      return (this.z < 0 ? '-' : '') + s;
    }
    /**
     * TeX-Darstellung.
     * stil: 'auto' (ganz/Dezimal/Bruch je nach Herkunft), 'bruch', 'gemischt', 'dezimal'
     */
    tex(stil = 'bruch') {
      const minus = this.z < 0 ? '-' : '';
      const a = Math.abs(this.z);
      if (this.n === 1) return minus + a;
      if (stil === 'dezimal' && this.istEndlichDezimal()) return this.dezText().replace(',', '{,}');
      if (stil === 'gemischt' && a > this.n) {
        const g = Math.floor(a / this.n);
        return `${minus}${g}\\frac{${a - g * this.n}}{${this.n}}`;
      }
      return `${minus}\\frac{${a}}{${this.n}}`;
    }
    /** Klartext für Rückmeldungen (ohne TeX) */
    text(stil = 'bruch') {
      if (this.n === 1) return String(this.z).replace('-', '−');
      if (stil === 'dezimal' && this.istEndlichDezimal()) return this.dezText().replace('-', '−');
      return `${this.z < 0 ? '−' : ''}${Math.abs(this.z)}/${this.n}`;
    }
    toString() { return `${this.z}/${this.n}`; }
  }

  /**
   * Erkennt Schülereingaben: "-3", "−3,5", "+0.25", "-7/4", "- 7 / 4",
   * "-1 3/4" (gemischte Zahl), "(−3)".
   * Rückgabe: { wert: Bruch, form, gekuerzt } oder null.
   */
  function leseEingabe(text) {
    if (text == null) return null;
    let s = String(text)
      .replace(/[−–—]/g, '-')
      .replace(/ /g, ' ')
      .trim();
    if (/^\(.*\)$/.test(s)) s = s.slice(1, -1).trim();
    if (s === '') return null;
    let m;
    if ((m = /^([+-]?)\s*(\d+)$/.exec(s))) {
      const w = Number(m[2]);
      return { wert: new Bruch(m[1] === '-' ? -w : w), form: 'ganz', gekuerzt: true };
    }
    if ((m = /^([+-]?)\s*(\d*[.,]\d+)$/.exec(s))) {
      return { wert: Bruch.dez(m[1] + m[2]), form: 'dezimal', gekuerzt: true };
    }
    if ((m = /^([+-]?)\s*(\d+)\s*\/\s*(\d+)$/.exec(s))) {
      const z = Number(m[2]);
      const n = Number(m[3]);
      if (n === 0) return null;
      return { wert: new Bruch(m[1] === '-' ? -z : z, n), form: 'bruch', gekuerzt: ggT(z, n) === 1 };
    }
    if ((m = /^([+-]?)\s*(\d+)\s+(\d+)\s*\/\s*(\d+)$/.exec(s))) {
      const g = Number(m[2]);
      const z = Number(m[3]);
      const n = Number(m[4]);
      if (n === 0 || z >= n) return null;
      const w = new Bruch(g * n + z, n);
      return { wert: m[1] === '-' ? w.neg() : w, form: 'gemischt', gekuerzt: ggT(z, n) === 1 };
    }
    return null;
  }

  /**
   * Prüft eine Eingabe gegen die richtige Antwort.
   * optionen.gekuerzt: Bruch muss vollständig gekürzt sein.
   * Rückgabe: { ok, grund }
   */
  function pruefeZahl(eingabe, richtig, optionen = {}) {
    const e = leseEingabe(eingabe);
    if (!e) return { ok: false, grund: 'unlesbar' };
    if (!e.wert.gleich(richtig)) return { ok: false, grund: 'falsch' };
    if (optionen.gekuerzt && !e.gekuerzt) return { ok: false, grund: 'kuerzen' };
    return { ok: true };
  }

  /**
   * Liest eine klammerfreie Summe wie "−3 + 5 − 2,5" oder "-1/2+3/4-1 1/4".
   * Rückgabe: Liste der Summanden mit Vorzeichen (Bruch) oder null.
   */
  function leseSumme(text) {
    if (text == null) return null;
    const s = String(text).replace(/[−–—]/g, '-').replace(/\u00a0/g, ' ').trim();
    if (!s || /[()[\]]/.test(s)) return null;
    const teile = s.match(/[+-]?[^+-]+/g);
    if (!teile || teile.join('').replace(/\s/g, '') !== s.replace(/\s/g, '')) return null;
    const summanden = [];
    for (const t of teile) {
      const e = leseEingabe(t.replace(/^([+-])\s+/, '$1'));
      if (!e) return null;
      summanden.push(e.wert);
    }
    return summanden;
  }

  /** Gleiche Summanden (Reihenfolge egal – Kommutativgesetz)? */
  function pruefeSumme(eingabe, erwartet) {
    if (/[()]/.test(String(eingabe))) return { ok: false, grund: 'klammer' };
    const ist = leseSumme(eingabe);
    if (!ist) return { ok: false, grund: 'unlesbar' };
    const rest = erwartet.map(Bruch.von);
    if (ist.length !== rest.length) return { ok: false, grund: 'falsch' };
    for (const b of ist) {
      const i = rest.findIndex((r) => r.gleich(b));
      if (i < 0) return { ok: false, grund: 'falsch' };
      rest.splice(i, 1);
    }
    return { ok: true };
  }

  /** Klartext einer Summe, z. B. [-3, 5] → "−3 + 5" */
  function summeText(summanden, stil = 'bruch') {
    return summanden
      .map((b, i) => {
        const t = Bruch.von(b).abs().text(stil);
        return i === 0 ? (Bruch.von(b).z < 0 ? '−' : '') + t : (Bruch.von(b).z < 0 ? ' − ' : ' + ') + t;
      })
      .join('');
  }

  UM.Bruch = Bruch;
  UM.leseSumme = leseSumme;
  UM.pruefeSumme = pruefeSumme;
  UM.summeText = summeText;
  UM.ggT = ggT;
  UM.leseEingabe = leseEingabe;
  UM.pruefeZahl = pruefeZahl;
})(typeof window !== 'undefined' ? window : globalThis);
