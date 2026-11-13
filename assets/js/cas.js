/*
 * CAS-Eingaben (TI-Nspire CAS) lesen und prüfen.
 *
 *   UM.pruefeCas(eingabe, soll) → { ok, meldung }
 *   soll = { art, … }
 *     { art:'definition', ausdruck }                 f(x):=ausdruck
 *     { art:'wert', arg }                            f(arg)
 *     { art:'solve', links, rechts, f? }             solve(links=rechts,x) – gleichwertige Gleichungen zählen
 *     { art:'completesquare', ausdruck, f? }         completeSquare(ausdruck,x)
 *     { art:'factor', ausdruck, f? }                 factor(ausdruck) oder factor(ausdruck,x)
 *     { art:'binompdf', n, p, k }                    binomPdf(n,p,k) – Angaben dürfen Terme sein (1/6); vertauschte Angaben werden erkannt
 *   Ausdrücke in CAS-Schreibweise (Dezimalpunkt, *, ^). f = Term von f(x), falls f(x) in der Eingabe vorkommt.
 *
 * Gleichwertigkeit wird numerisch an mehreren Stellen geprüft (Terme in x).
 * Groß-/Kleinschreibung und Leerzeichen sind egal, wie in der CAS-App.
 *
 *   UM.rechnerSeite([{ ein, aus }]) → HTML einer Rechner-Seite (Eingabe links, Ausgabe rechts)
 */
(function (global) {
  'use strict';
  const UM = (global.UM = global.UM || {});

  const BEFEHLE = { solve: 'solve', completesquare: 'completeSquare', factor: 'factor', binompdf: 'binomPdf', binomcdf: 'binomCdf' };

  /** Vereinheitlichen: klein, ohne Leerzeichen, Malzeichen als * */
  function normal(text) {
    return String(text || '')
      .replace(/[−–—]/g, '-')
      .replace(/[·×⋅]/g, '*')
      .replace(/≔/g, ':=')
      .replace(/\s+/g, '')
      .toLowerCase();
  }

  /** Klammern ausgeglichen? */
  function klammernOk(s) {
    let t = 0;
    for (const c of s) {
      if (c === '(') t++;
      if (c === ')') t--;
      if (t < 0) return false;
    }
    return t === 0;
  }

  /** Argumente auf oberster Ebene an Kommas trennen */
  function argumente(s) {
    const teile = [];
    let t = 0;
    let start = 0;
    for (let i = 0; i < s.length; i++) {
      if (s[i] === '(') t++;
      else if (s[i] === ')') t--;
      else if (s[i] === ',' && t === 0) { teile.push(s.slice(start, i)); start = i + 1; }
    }
    teile.push(s.slice(start));
    return teile;
  }

  // ---------- kleiner Term-Auswerter (Zahlen, x, + − * / ^, Klammern, f(…), sqrt(…)) ----------
  function tokens(s) {
    const t = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/[0-9.]/.test(c)) {
        let j = i;
        while (j < s.length && /[0-9.]/.test(s[j])) j++;
        const z = s.slice(i, j);
        if ((z.match(/\./g) || []).length > 1 || z === '.') return null;
        t.push({ typ: 'zahl', wert: Number(z) });
        i = j;
      } else if (/[a-z√]/.test(c)) {
        let j = i;
        if (c === '√') j++;
        else while (j < s.length && /[a-z0-9_]/.test(s[j])) j++;
        t.push({ typ: 'name', wert: c === '√' ? 'sqrt' : s.slice(i, j) });
        i = j;
      } else if ('+-*/^()'.includes(c)) { t.push({ typ: c }); i++; }
      else return null;
    }
    // implizite Multiplikation: 2x, 2(…), )(…), )x, x( nur bei Funktionen f/sqrt
    const aus = [];
    for (let k = 0; k < t.length; k++) {
      const a = aus[aus.length - 1];
      const b = t[k];
      const linksWert = a && (a.typ === 'zahl' || a.typ === ')' || (a.typ === 'name' && !['f', 'sqrt'].includes(a.wert)));
      const rechtsStart = b.typ === 'zahl' || b.typ === 'name' || b.typ === '(';
      if (linksWert && rechtsStart && !(a.typ === 'zahl' && b.typ === 'zahl')) aus.push({ typ: '*' });
      aus.push(b);
    }
    return aus;
  }

  /** Ausdruck → Funktion (umgebung) → Zahl; null bei Syntaxfehler */
  function uebersetze(s) {
    const t = tokens(s);
    if (!t || !t.length) return null;
    let p = 0;
    const sieh = () => t[p];
    const nimm = (typ) => (t[p] && t[p].typ === typ ? t[p++] : null);
    function summe() {
      let l = produkt();
      if (!l) return null;
      for (;;) {
        if (nimm('+')) { const r = produkt(); if (!r) return null; const a = l; l = (u) => a(u) + r(u); }
        else if (nimm('-')) { const r = produkt(); if (!r) return null; const a = l; l = (u) => a(u) - r(u); }
        else return l;
      }
    }
    function produkt() {
      let l = vorzeichen();
      if (!l) return null;
      for (;;) {
        if (nimm('*')) { const r = vorzeichen(); if (!r) return null; const a = l; l = (u) => a(u) * r(u); }
        else if (nimm('/')) { const r = vorzeichen(); if (!r) return null; const a = l; l = (u) => a(u) / r(u); }
        else return l;
      }
    }
    function vorzeichen() {
      if (nimm('-')) { const r = vorzeichen(); return r && ((u) => -r(u)); }
      if (nimm('+')) return vorzeichen();
      return potenz();
    }
    function potenz() {
      const b = atom();
      if (!b) return null;
      if (nimm('^')) { const e = vorzeichen(); if (!e) return null; return (u) => b(u) ** e(u); }
      return b;
    }
    function atom() {
      const a = sieh();
      if (!a) return null;
      if (a.typ === 'zahl') { p++; return () => a.wert; }
      if (a.typ === '(') { p++; const e = summe(); if (!e || !nimm(')')) return null; return e; }
      if (a.typ === 'name') {
        p++;
        if (a.wert === 'f' || a.wert === 'sqrt') {
          if (!nimm('(')) return null;
          const e = summe();
          if (!e || !nimm(')')) return null;
          return a.wert === 'sqrt' ? (u) => Math.sqrt(e(u)) : (u) => (u.f ? u.f(e(u)) : NaN);
        }
        if (a.wert === 'x') return (u) => u.x;
        return null; // unbekannter Name
      }
      return null;
    }
    const f = summe();
    return f && p === t.length ? f : null;
  }

  const STELLEN = [-3.7, -1.3, 0.6, 2.2, 4.9, 7.3];
  function funktion(ausdruck, fTerm) {
    const g = uebersetze(normal(ausdruck));
    if (!g) return null;
    const fDef = fTerm ? uebersetze(normal(fTerm)) : null;
    const fFn = fDef ? (x) => fDef({ x }) : null;
    return (x) => g({ x, f: fFn });
  }
  const nah = (a, b) => Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(a), Math.abs(b));
  /** gleiche Funktion von x? */
  function gleichwertig(a, b, fTerm) {
    const fa = funktion(a, fTerm);
    const fb = funktion(b, fTerm);
    if (!fa || !fb) return false;
    return STELLEN.every((x) => Number.isFinite(fa(x)) && nah(fa(x), fb(x)));
  }
  /** a = k·b mit einer Konstanten k ≠ 0 (gleichwertige Gleichungen a=0, b=0) */
  function vielfaches(a, b) {
    let k = null;
    for (const x of STELLEN) {
      const va = a(x);
      const vb = b(x);
      if (!Number.isFinite(va) || !Number.isFinite(vb)) return false;
      if (Math.abs(vb) < 1e-12) { if (Math.abs(va) > 1e-9) return false; continue; }
      const q = va / vb;
      if (k === null) k = q;
      else if (!nah(k, q)) return false;
    }
    return k !== null && Math.abs(k) > 1e-12;
  }

  const M = {
    leer: 'Hier fehlt noch die Eingabe.',
    klammern: 'Die Klammern passen nicht: Zu jeder „(“ gehört eine „)“.',
    komma: 'Die CAS-App verwendet einen Dezimalpunkt: 2.5 statt 2,5. Das Komma trennt die Teile eines Befehls.',
    definieren: 'Zum Definieren brauchst du := (Doppelpunkt und Gleichheitszeichen). Mit = allein vergleicht das CAS nur.',
    nichtDefinieren: 'Hier soll nichts definiert werden – f ist schon definiert. Lass das := weg.',
    befehl: (b) => `Hier passt ein anderer Befehl${b ? ` (${b} ist nicht der richtige)` : ''}.`,
    variable: 'Gib nach dem Komma an, nach welcher Variablen gelöst werden soll: …, x)',
    gleichung: 'In solve gehört eine Gleichung mit =, z. B. solve(f(x)=0,x).',
    zuViele: 'Der Befehl hat zu viele Teile. Prüfe Kommas (Dezimalpunkt statt Komma!) und Klammern.',
    inhalt: 'Der Befehl ist richtig, aber der Inhalt stimmt noch nicht.',
    unlesbar: 'Diese Eingabe kann die CAS-App so nicht lesen. Prüfe Schreibweise und Malzeichen.',
    binomAnzahl: 'binomPdf braucht genau drei Angaben: binomPdf(n,p,k).',
    binomReihenfolge: 'Die Zahlen stimmen, aber die Reihenfolge nicht: zuerst n, dann p, dann k – binomPdf(n,p,k).',
    binomP: 'Die zweite Angabe ist die Trefferwahrscheinlichkeit p – eine Zahl zwischen 0 und 1.',
  };

  /** Hat die Eingabe Dezimalkommas (Ziffer,Ziffer), die zu viele Argumente erzeugen? */
  const hatDezimalKomma = (s) => /\d,\d/.test(s);

  function pruefeCas(eingabe, soll) {
    const s = normal(eingabe);
    if (!s) return { ok: false, meldung: M.leer };
    if (!klammernOk(s)) return { ok: false, meldung: M.klammern };

    if (soll.art === 'definition') {
      if (/^f\(x\)=[^=]/.test(s)) return { ok: false, meldung: M.definieren };
      const m = /^f\(x\):=(.+)$/.exec(s);
      if (!m) return { ok: false, meldung: /:=/.test(s) ? M.unlesbar : M.definieren };
      if (hatDezimalKomma(m[1])) return { ok: false, meldung: M.komma };
      if (!uebersetze(m[1])) return { ok: false, meldung: M.unlesbar };
      return gleichwertig(m[1], soll.ausdruck) ? { ok: true } : { ok: false, meldung: M.inhalt };
    }
    if (/:=/.test(s)) return { ok: false, meldung: M.nichtDefinieren };

    if (soll.art === 'wert') {
      const m = /^f\((.+)\)$/.exec(s);
      if (!m) {
        const n = /^([a-z]+)\(/.exec(s);
        return { ok: false, meldung: n && BEFEHLE[n[1]] ? M.befehl(BEFEHLE[n[1]]) : 'Einen Funktionswert berechnest du mit f(…), z. B. f(3).' };
      }
      if (hatDezimalKomma(m[1])) return { ok: false, meldung: M.komma };
      const a = uebersetze(m[1]);
      if (!a) return { ok: false, meldung: M.unlesbar };
      return nah(a({ x: NaN }), soll.arg) ? { ok: true } : { ok: false, meldung: M.inhalt };
    }

    const m = /^([a-z]+)\((.*)\)$/.exec(s);
    if (!m) return { ok: false, meldung: M.unlesbar };
    const name = m[1];
    if (!BEFEHLE[name]) return { ok: false, meldung: name === 'f' ? M.befehl('f(…)') : M.unlesbar };
    if (name !== soll.art) return { ok: false, meldung: M.befehl(BEFEHLE[name]) };
    const args = argumente(m[2]);

    if (soll.art === 'binompdf') {
      if (args.length !== 3) return { ok: false, meldung: args.length > 3 && hatDezimalKomma(m[2]) ? M.komma : M.binomAnzahl };
      const w = args.map((a) => uebersetze(a));
      if (w.some((f) => !f)) return { ok: false, meldung: M.unlesbar };
      const [a, b, c] = w.map((f) => f({ x: NaN }));
      if (nah(a, soll.n) && nah(b, soll.p) && nah(c, soll.k)) return { ok: true };
      const soll3 = [soll.n, soll.p, soll.k].sort((x, y) => x - y);
      const ist3 = [a, b, c].sort((x, y) => x - y);
      if (soll3.every((x, i) => nah(x, ist3[i]))) return { ok: false, meldung: M.binomReihenfolge };
      if (!(b >= 0 && b <= 1)) return { ok: false, meldung: M.binomP };
      return { ok: false, meldung: M.inhalt };
    }

    if (soll.art === 'solve') {
      if (args.length === 1) return { ok: false, meldung: args[0].includes('=') ? M.variable : M.gleichung };
      if (args.length > 2) return { ok: false, meldung: hatDezimalKomma(m[2]) ? M.komma : M.zuViele };
      const [gl, v] = args;
      if (v !== 'x') return { ok: false, meldung: v.includes('=') ? M.gleichung : M.variable };
      const seiten = gl.split('=');
      if (seiten.length !== 2) return { ok: false, meldung: M.gleichung };
      const l = funktion(seiten[0], soll.f);
      const r = funktion(seiten[1], soll.f);
      if (!l || !r) return { ok: false, meldung: M.unlesbar };
      const ziel = funktion(`(${soll.links})-(${soll.rechts})`, soll.f);
      return vielfaches((x) => l(x) - r(x), ziel) ? { ok: true } : { ok: false, meldung: M.inhalt };
    }
    // completeSquare / factor
    const erlaubt = soll.art === 'factor' ? [1, 2] : [2];
    if (!erlaubt.includes(args.length)) {
      if (args.length > 2) return { ok: false, meldung: hatDezimalKomma(m[2]) ? M.komma : M.zuViele };
      return { ok: false, meldung: M.variable.replace('gelöst werden soll', 'umgeformt werden soll') };
    }
    if (args.length === 2 && args[1] !== 'x') return { ok: false, meldung: hatDezimalKomma(m[2]) ? M.komma : M.variable.replace('gelöst werden soll', 'umgeformt werden soll') };
    if (!funktion(args[0], soll.f)) return { ok: false, meldung: M.unlesbar };
    return gleichwertig(args[0], soll.ausdruck, soll.f) ? { ok: true } : { ok: false, meldung: M.inhalt };
  }

  // ---------- Zahlen wie in der CAS-App (6 gültige Stellen, Dezimalpunkt) ----------
  function casZahl(x, stellen = 6) {
    if (Math.abs(x) < 1e-12) return '0';
    let t = Number(x.toPrecision(stellen)).toString();
    if (/e/.test(t)) t = x.toFixed(6);
    return t;
  }

  // ---------- Rechner-Seite ----------
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  function rechnerSeite(zeilen) {
    return `<div class="rechner" role="img" aria-label="Rechner-Seite der CAS-App">${zeilen.map((z) => `<div class="rechner-zeile"><div class="rechner-ein">${esc(z.ein)}</div><div class="rechner-aus${z.fehler ? ' fehler' : ''}">${esc(z.aus)}</div></div>`).join('')}</div>`;
  }

  UM.cas = { normal, uebersetze, gleichwertig, casZahl, MELDUNGEN: M };
  UM.pruefeCas = pruefeCas;
  UM.rechnerSeite = rechnerSeite;
})(typeof window !== 'undefined' ? window : globalThis);
