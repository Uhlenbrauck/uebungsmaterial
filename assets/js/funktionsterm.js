/*
 * Funktionsterme als Eingabe (z. B. eine Stammfunktion F(x) oder eine Ableitung f'(x)).
 *
 *   UM.pruefeTerm(eingabe, feld) → { ok, meldung }
 *   feld = { art:'term', label, loesung, soll, modus, variable, stellen, funktion, ableitung, bedingung }
 *     soll       richtiger Term in CAS-Schreibweise („1/4*x^4+2*x^3“)
 *     modus      'gleich' (gleicher Term) | 'stamm' (bis auf eine Konstante, d. h. jede Stammfunktion)
 *     variable   'x' (Standard) oder z. B. 't'
 *     stellen    Prüfstellen (Standard: einige Stellen > 0, damit auch Wurzeln und 1/x gehen)
 *     funktion   bei 'stamm': die Funktion f (für Rückmeldungen)
 *     ableitung  bei 'stamm': f' (erkennt „abgeleitet statt aufgeleitet“)
 *     bedingung  bei 'gleich': Text der Bedingung (z. B. „F(1) = 2“), erkennt „Konstante fehlt“
 *
 * Erlaubte Schreibweisen: 1/4x^4, 0,25x^4, x²; 3/x^2 oder 3x^(-2); √x, √(x+1), sqrt(x); „+ C“ am Ende.
 */
(function (global) {
  'use strict';
  const UM = (global.UM = global.UM || {});

  const HOCH = { '²': '^2', '³': '^3', '⁴': '^4', '⁵': '^5', '⁶': '^6' };

  /** Eingabe in die Schreibweise von UM.cas bringen; konstante = „+C“ wurde entfernt */
  function vorbereiten(text, variable = 'x') {
    let s = String(text || '').trim();
    // „F(x) =“, „f'(x)=“, „y =“ am Anfang weglassen
    s = s.replace(/^[A-Za-z][′'_\d]*\s*\(\s*[a-z]\s*\)\s*=/, '').replace(/^y\s*=/, '');
    s = s.replace(/[−–—]/g, '-').replace(/[·×⋅]/g, '*').replace(/[²³⁴⁵⁶]/g, (z) => HOCH[z]);
    s = s.replace(/(\d)\s*,\s*(\d)/g, '$1.$2');
    s = s.replace(/wurzel/gi, 'sqrt').replace(/√\s*([0-9.]+|[a-z])/gi, 'sqrt($1)').replace(/√\s*\(/g, 'sqrt(');
    let konstante = false;
    if (/[+-]\s*c\s*$/i.test(s)) { s = s.replace(/[+-]\s*c\s*$/i, ''); konstante = true; }
    s = s.replace(/\s+/g, '').toLowerCase().replace(/([a-z0-9.)])sqrt/g, '$1*sqrt');
    if (variable !== 'x') s = s.replace(/sqrt/g, '§').replace(new RegExp(variable, 'g'), 'x').replace(/§/g, 'sqrt');
    return { s, konstante };
  }

  const STANDARD = [0.35, 0.8, 1.3, 1.9, 2.6, 3.7];
  const nah = (a, b, tol = 1e-7) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));

  /** Text → Funktion x → Zahl (oder null) */
  function funktion(text, variable = 'x') {
    const { s } = vorbereiten(text, variable);
    const g = UM.cas.uebersetze(s);
    return g ? (x) => g({ x }) : null;
  }

  const werte = (fn, stellen) => stellen.map((x) => fn(x));
  const alleEndlich = (w) => w.every(Number.isFinite);
  /** numerische Ableitung */
  const ableiten = (fn) => (x) => {
    const h = 1e-5 * Math.max(1, Math.abs(x));
    return (fn(x + h) - fn(x - h)) / (2 * h);
  };

  function gleicheWerte(a, b, tol) { return a.length === b.length && a.every((v, i) => nah(v, b[i], tol)); }
  /** a − b konstant? */
  function konstanterAbstand(a, b) {
    const d = a.map((v, i) => v - b[i]);
    return d.every((x) => nah(x, d[0], 1e-7));
  }
  /** a = k·b mit konstantem k? → k oder null */
  function faktor(a, b) {
    let k = null;
    for (let i = 0; i < a.length; i++) {
      if (Math.abs(b[i]) < 1e-12) { if (Math.abs(a[i]) > 1e-6) return null; continue; }
      const q = a[i] / b[i];
      if (k === null) k = q;
      else if (!nah(k, q, 1e-5)) return null;
    }
    return k;
  }

  const M = {
    leer: 'Hier fehlt noch der Term.',
    unlesbar: 'Diesen Term verstehe ich nicht. Beispiele: 1/4x^4 + 2x^3 − 5x  ·  3/x^2  ·  2√x  ·  0,5x^2',
    klammern: 'Die Klammern passen nicht: Zu jeder „(“ gehört eine „)“.',
    falsch: 'Das stimmt noch nicht.',
    abgeleitet: 'Du hast abgeleitet statt aufgeleitet. Gesucht ist eine Funktion F mit F′(x) = f(x).',
    selbst: 'Das ist die Funktion f selbst. Gesucht ist eine Funktion F, deren Ableitung f ist.',
    faktor: 'Fast: Die Exponenten passen, aber ein Faktor nicht. Denk an den Faktor 1/(n+1) – und mach die Probe durch Ableiten.',
    probe: 'Das ist noch keine Stammfunktion. Mach die Probe: Leite deinen Term ab – es muss f(x) herauskommen.',
    konstante: (b) => `Das ist eine Stammfunktion, aber die Bedingung ${b} ist noch nicht erfüllt. Bestimme die Konstante C.`,
  };

  function pruefeTerm(eingabe, feld) {
    const variable = feld.variable || 'x';
    if (!String(eingabe || '').trim()) return { ok: false, meldung: M.leer };
    const { s } = vorbereiten(eingabe, variable);
    let t = 0;
    for (const c of s) { if (c === '(') t++; if (c === ')') t--; if (t < 0) break; }
    if (t !== 0) return { ok: false, meldung: M.klammern };
    const ein = UM.cas.uebersetze(s);
    if (!ein) return { ok: false, meldung: M.unlesbar };
    const fnEin = (x) => ein({ x });
    const fnSoll = funktion(feld.soll, 'x');
    const stellen = feld.stellen || STANDARD;
    const wEin = werte(fnEin, stellen);
    const wSoll = werte(fnSoll, stellen);
    if (!alleEndlich(wEin)) return { ok: false, meldung: M.falsch };

    if (feld.modus === 'stamm') {
      if (konstanterAbstand(wEin, wSoll)) return { ok: true };
    } else if (gleicheWerte(wEin, wSoll)) return { ok: true };

    // typische Fehler
    if (feld.modus !== 'stamm' && feld.bedingung && konstanterAbstand(wEin, wSoll)) return { ok: false, meldung: M.konstante(feld.bedingung) };
    if (feld.ableitung) {
      const a = funktion(feld.ableitung, 'x');
      if (a && gleicheWerte(wEin, werte(a, stellen))) return { ok: false, meldung: M.abgeleitet };
    }
    if (feld.funktion) {
      const f = funktion(feld.funktion, 'x');
      if (f) {
        const wf = werte(f, stellen);
        if (gleicheWerte(wEin, wf)) return { ok: false, meldung: M.selbst };
        const k = faktor(werte(ableiten(fnEin), stellen), wf);
        if (k !== null && !nah(k, 1, 1e-4)) return { ok: false, meldung: M.faktor };
        if (feld.modus === 'stamm') return { ok: false, meldung: M.probe };
      }
    }
    return { ok: false, meldung: M.falsch };
  }

  UM.funktionsterm = { vorbereiten, funktion, MELDUNGEN: M };
  UM.pruefeTerm = pruefeTerm;
})(typeof window !== 'undefined' ? window : globalThis);
