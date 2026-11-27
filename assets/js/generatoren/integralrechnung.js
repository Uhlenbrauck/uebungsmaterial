/*
 * Aufgaben-Generatoren: Integralrechnung (Q1 LK) – mit Wiederholung Umkehrfunktion und Potenzfunktionen ableiten
 *
 * Format der Aufgaben: siehe generatoren/rationale-zahlen.js. Zusätzlich:
 *   felder: { art:'term', label, loesung, soll, modus:'gleich'|'stamm', variable, stellen, funktion, ableitung, bedingung }
 *           (Funktionsterm eingeben, geprüft mit UM.pruefeTerm, siehe assets/js/funktionsterm.js)
 *   pruef:  [{ art:'integral', f, a, b, wert } | { art:'flaeche', f, g, a, b, wert }]
 *           nur für die Tests: unabhängige numerische Kontrolle der Ergebnisse
 *
 * Alle Werte werden exakt (UM.Bruch) aus derselben Struktur berechnet wie der gedruckte Term.
 * Die Aufgaben orientieren sich an Buch und Mitschrift, nicht an den Aufgaben der Klausur.
 * CAS-Hinweise beziehen sich auf die GeoGebra-CAS-App.
 */
(function (global) {
  'use strict';
  const UM = (global.UM = global.UM || {});
  const { Bruch } = UM;
  const R = UM.zufall;
  const gen = (UM.generatoren = UM.generatoren || {});

  const B = (z, n = 1) => new Bruch(z, n);
  const $ = (t) => `$${t}$`;
  const NULL = B(0);

  // ---------- Zahlen ----------
  /** Zahl als TeX: ganz, kurze Dezimalzahl oder Bruch */
  function zt(b) {
    b = Bruch.von(b);
    if (b.istGanz()) return String(b.z);
    if (b.istEndlichDezimal() && b.n <= 100) return b.tex('dezimal');
    return b.tex('bruch');
  }
  /** Ergebnis: exakt und ggf. gerundet */
  function erg(b) {
    b = Bruch.von(b);
    const t = zt(b);
    if (b.istGanz() || (b.istEndlichDezimal() && b.n <= 100)) return t;
    return `${t}\\approx ${UM.naeherungText(b.zahl(), 2).replace(',', '{,}').replace('−', '-')}`;
  }
  /** Zahl im Fließtext / SVG */
  const klar = (x) => {
    const r = Math.round(x * 1000) / 1000;
    return String(r).replace('.', ',').replace('-', '−');
  };
  /** Zahl in Klammern, wenn negativ (für Einsetzen) */
  const kl = (b) => (Bruch.von(b).vz() < 0 ? `\\left(${zt(b)}\\right)` : zt(b));

  const naeh = (label, b, extra = {}) => Object.assign({ art: 'naeherung', label, wert: Bruch.von(b).zahl(), exakt: Bruch.von(b), stellen: 2 }, extra);
  const zahl = (label, b, extra = {}) => Object.assign({ art: 'zahl', label, antwort: Bruch.von(b) }, extra);

  // ---------- Potenzterme: Summen von c·x^e (c, e Brüche) ----------
  const S = (c, e) => ({ c: Bruch.von(c), e: Bruch.von(e) });
  function ordne(terme) {
    const m = new Map();
    for (const t of terme) {
      const k = t.e.text();
      m.set(k, m.has(k) ? S(m.get(k).c.plus(t.c), t.e) : t);
    }
    return [...m.values()].filter((t) => t.c.z !== 0).sort((a, b) => b.e.vgl(a.e));
  }
  const stamm = (terme) => ordne(terme.map((t) => S(t.c.durch(t.e.plus(1)), t.e.plus(1))));
  const abl = (terme) => ordne(terme.map((t) => S(t.c.mal(t.e), t.e.minus(1))));
  const neg = (terme) => terme.map((t) => S(t.c.neg(), t.e));
  const summe = (...listen) => ordne(listen.flat());
  const wertZ = (terme, x) => terme.reduce((s, t) => s + t.c.zahl() * x ** t.e.zahl(), 0);

  function wurzelB(x, q) {
    if (q === 1) return x;
    if (x.z < 0) return null;
    const r = (n) => { const w = Math.round(n ** (1 / q)); return w ** q === n ? w : null; };
    const a = r(x.z);
    const b = r(x.n);
    return a === null || b === null ? null : B(a, b);
  }
  function potB(x, e) {
    x = Bruch.von(x);
    e = Bruch.von(e);
    let basis = x;
    if (e.n !== 1) {
      basis = wurzelB(x, e.n);
      if (!basis) throw new Error(`Keine exakte Wurzel: ${x.text()}^${e.text()}`);
    }
    let k = e.z;
    if (k < 0) { basis = B(1).durch(basis); k = -k; }
    let p = B(1);
    for (let i = 0; i < k; i++) p = p.mal(basis);
    return p;
  }
  const wertB = (terme, x) => terme.reduce((s, t) => s.plus(t.e.z === 0 ? t.c : t.c.mal(potB(x, t.e))), B(0));

  /** Term in CAS-Schreibweise (für die Prüfung) */
  const cas = (terme) => (terme.length ? terme.map((t) => `(${t.c.z}/${t.c.n})*x^(${t.e.z}/${t.e.n})`).join('+') : '0');
  /** Term so, wie man ihn eintippen würde (Musterlösung des Eingabefelds) */
  function eingabeText(terme, v = 'x') {
    if (!terme.length) return '0';
    return terme.map((t, i) => {
      const a = t.c.abs();
      const vz = t.c.vz() < 0 ? (i ? ' - ' : '-') : i ? ' + ' : '';
      const k = a.text('bruch');
      let rumpf;
      if (t.e.z === 0) rumpf = k;
      else {
        const pot = t.e.gleich(1) ? v : t.e.istGanz() && t.e.z > 0 ? `${v}^${t.e.z}` : `${v}^(${t.e.text('bruch')})`;
        rumpf = a.gleich(1) ? pot : `${k}${a.istGanz() ? '' : '*'}${pot}`;
      }
      return vz + rumpf;
    }).join('');
  }

  /** ein Summand als TeX (mit Vorzeichen +/−); stil: 'normal' | 'potenz' | 'dezimal' */
  function monoTex(t, v = 'x', stil = 'normal') {
    const negativ = t.c.vz() < 0;
    const a = t.c.abs();
    const e = t.e;
    const koeff = (mitEins) => (a.gleich(1) && !mitEins ? '' : stil === 'dezimal' && a.istEndlichDezimal() ? a.tex('dezimal') : a.tex('bruch'));
    let k;
    if (e.z === 0) k = koeff(true);
    else if (stil === 'potenz') k = koeff(false) + (e.gleich(1) ? v : `${v}^{${e.istGanz() ? e.z : e.tex('bruch')}}`);
    else if (e.gleich(1)) k = koeff(false) + v;
    else if (e.istGanz() && e.z > 0) k = `${koeff(false)}${v}^{${e.z}}`;
    else {
      // Wurzeln und negative Exponenten
      const p = Math.abs(e.z);
      const q = e.n;
      const pot = q === 1 ? (p === 1 ? v : `${v}^{${p}}`) : q === 2 ? (p === 1 ? `\\sqrt{${v}}` : `\\sqrt{${v}^{${p}}}`) : `\\sqrt[${q}]{${p === 1 ? v : `${v}^{${p}}`}}`;
      if (e.z > 0) k = koeff(false) + pot;
      else k = `\\frac{${a.z}}{${a.n === 1 ? '' : a.n}${pot}}`;
    }
    return (negativ ? '-' : '+') + k;
  }
  function termTex(terme, v = 'x', stil = 'normal') {
    if (!terme.length) return '0';
    const t = terme.map((x) => monoTex(x, v, stil)).join('');
    return t.startsWith('+') ? t.slice(1) : t;
  }
  /** Einsetzen: 1/4·3^4 + 2·3^3 … als TeX */
  function einsetzTex(terme, x) {
    if (!terme.length) return '0';
    const xb = Bruch.von(x);
    const xs = kl(xb);
    const teile = terme.map((t) => {
      const negativ = t.c.vz() < 0;
      const a = t.c.abs();
      let k;
      if (t.e.z === 0) k = a.tex('bruch');
      else {
        let pot;
        if (t.e.gleich(1)) pot = xs;
        else if (t.e.istGanz() && t.e.z > 0) pot = `${xs}^{${t.e.z}}`;
        else if (t.e.gleich(B(1, 2))) pot = `\\sqrt{${zt(xb)}}`;
        else pot = `${xs}^{${t.e.istGanz() ? t.e.z : t.e.tex('bruch')}}`;
        k = a.gleich(1) ? pot : `${a.tex('bruch')}\\cdot ${pot}`;
      }
      return (negativ ? '-' : '+') + k;
    });
    const s = teile.join('');
    return s.startsWith('+') ? s.slice(1) : s;
  }

  // ---------- Polynome aus Nullstellen ----------
  /** Koeffizienten [a0, a1, …] als Brüche */
  function polyMal(p, q) {
    const r = Array(p.length + q.length - 1).fill(null).map(() => B(0));
    p.forEach((a, i) => q.forEach((b, j) => { r[i + j] = r[i + j].plus(a.mal(b)); }));
    return r;
  }
  function polyAusNullstellen(k, nullstellen) {
    let p = [Bruch.von(k)];
    for (const n of nullstellen) p = polyMal(p, [Bruch.von(n).neg(), B(1)]);
    return p;
  }
  const polyTerme = (p) => ordne(p.map((c, i) => S(c, i)));
  /** k(x − a)(x − b) … als TeX */
  function faktorTex(k, nullstellen, v = 'x') {
    k = Bruch.von(k);
    const f = nullstellen.slice().sort((a, b) => Bruch.von(a).vgl(b)).map((n) => {
      n = Bruch.von(n);
      return n.z === 0 ? v : n.vz() > 0 ? `(${v}-${zt(n)})` : `(${v}+${zt(n.neg())})`;
    });
    // gleiche Faktoren zusammenfassen
    const z = [];
    for (const t of f) {
      const l = z[z.length - 1];
      if (l && l.t === t) l.n++;
      else z.push({ t, n: 1 });
    }
    const rumpf = z.map(({ t, n }) => (n === 1 ? t : `${t}^{${n}}`)).join('\\cdot ').replace(/\)\\cdot \(/g, ')(');
    const vor = k.gleich(1) ? '' : k.gleich(-1) ? '-' : `${zt(k)}\\cdot `;
    return vor + rumpf;
  }

  /** exaktes Integral von terme über [a; b] */
  const integral = (terme, a, b) => { const F = stamm(terme); return wertB(F, b).minus(wertB(F, a)); };

  // ---------- Koordinatensystem mit Graphen und Flächen (SVG) ----------
  let svgNr = 0;
  const schoen = (x) => x.toFixed(1);
  /**
   * o: xmin, xmax, ymin, ymax (ymin ≤ 0 ≤ ymax), breite, hoehe
   *    gx, gy (Gitterabstand), sx, sy (Beschriftungsabstand), xText(v), yText(v)
   *    funktionen [{ f, klasse, name, nameX }], flaechen [{ f, g, a, b, klasse, text, tx, ty }]
   *    punkte [{ x, y, text }], senkrechte [x], achsen { x, y }, klein, label
   */
  function graphSvg(o) {
    const nr = ++svgNr;
    const { xmin, xmax, ymin, ymax } = o;
    const breite = o.breite || 420;
    const ex = breite / (xmax - xmin);
    const ey = o.hoehe ? o.hoehe / (ymax - ymin) : ex;
    const rl = o.klein ? 8 : 34;
    const ro = o.klein ? 8 : 22;
    const ru = o.klein ? 8 : 22;
    const W = breite + rl + (o.klein ? 8 : 40);
    const H = (ymax - ymin) * ey + ro + ru;
    const X = (x) => rl + (x - xmin) * ex;
    const Y = (y) => ro + (ymax - y) * ey;
    const klasse = o.klein ? ' class="fg-klein"' : '';
    let s = `<svg viewBox="0 0 ${schoen(W)} ${schoen(H)}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${o.label || 'Funktionsgraph'}"${klasse}>`;
    s += `<defs><clipPath id="fg-clip-${nr}"><rect x="${X(xmin)}" y="${Y(ymax)}" width="${schoen(X(xmax) - X(xmin))}" height="${schoen(Y(ymin) - Y(ymax))}"/></clipPath></defs>`;
    const gx = o.gx || 1;
    const gy = o.gy || 1;
    for (let i = Math.ceil(xmin / gx); i * gx <= xmax + 1e-9; i++) s += `<line x1="${schoen(X(i * gx))}" y1="${Y(ymin)}" x2="${schoen(X(i * gx))}" y2="${Y(ymax)}" class="${o.kaestchen ? 'ks-kaestchen' : 'ks-gitter'}"/>`;
    for (let i = Math.ceil(ymin / gy); i * gy <= ymax + 1e-9; i++) s += `<line x1="${X(xmin)}" y1="${schoen(Y(i * gy))}" x2="${X(xmax)}" y2="${schoen(Y(i * gy))}" class="${o.kaestchen ? 'ks-kaestchen' : 'ks-gitter'}"/>`;
    // Flächen
    for (const fl of o.flaechen || []) {
      const g = fl.g || (() => 0);
      const n = 80;
      const oben = [];
      const unten = [];
      for (let i = 0; i <= n; i++) {
        const x = fl.a + ((fl.b - fl.a) * i) / n;
        oben.push(`${schoen(X(x))},${schoen(Y(Math.max(ymin, Math.min(ymax, fl.f(x)))))}`);
        unten.push(`${schoen(X(x))},${schoen(Y(Math.max(ymin, Math.min(ymax, g(x)))))}`);
      }
      s += `<polygon points="${oben.join(' ')} ${unten.reverse().join(' ')}" class="${fl.klasse || 'ks-flaeche'}"/>`;
    }
    // Achsen
    const y0 = Y(0);
    s += `<line x1="${X(xmin)}" y1="${y0}" x2="${X(xmax) + 8}" y2="${y0}" class="ks-achse"/><line x1="${X(0)}" y1="${Y(ymin)}" x2="${X(0)}" y2="${Y(ymax) - 8}" class="ks-achse"/>`;
    s += `<polygon points="${X(xmax) + 8},${y0} ${X(xmax) + 2},${y0 - 3} ${X(xmax) + 2},${y0 + 3}" fill="#1d2433"/><polygon points="${X(0)},${Y(ymax) - 8} ${X(0) - 3},${Y(ymax) - 2} ${X(0) + 3},${Y(ymax) - 2}" fill="#1d2433"/>`;
    if (!o.klein) {
      const ax = (o.achsen && o.achsen.x) || 'x';
      const ay = (o.achsen && o.achsen.y) || 'y';
      s += `<text x="${X(xmax) + 10}" y="${y0 - 6}" class="ks-text" text-anchor="end">${ax.length > 2 ? '' : ax}</text>`;
      if (ax.length > 2) s += `<text x="${X(xmax)}" y="${y0 - 6}" class="ks-zahl" text-anchor="end" style="text-anchor:end">${ax}</text>`;
      s += `<text x="${X(0) + 7}" y="${Y(ymax) - 2}" class="${ay.length > 2 ? 'ks-zahl' : 'ks-text'}" style="text-anchor:start">${ay}</text>`;
      const sx = o.sx || 1;
      const sy = o.sy || 1;
      const xText = o.xText || klar;
      const yText = o.yText || klar;
      for (let i = Math.ceil(xmin / sx); i * sx <= xmax + 1e-9; i++) {
        const v = i * sx;
        if (Math.abs(v) < 1e-9 || Math.abs(v - xmax) < 1e-9) continue;
        s += `<line x1="${schoen(X(v))}" y1="${y0 - 3}" x2="${schoen(X(v))}" y2="${y0 + 3}" class="ks-achse"/><text x="${schoen(X(v))}" y="${y0 + 15}" class="ks-zahl">${xText(v)}</text>`;
      }
      for (let i = Math.ceil(ymin / sy); i * sy <= ymax + 1e-9; i++) {
        const v = i * sy;
        if (Math.abs(v) < 1e-9 || Math.abs(v - ymax) < 1e-9) continue;
        s += `<line x1="${X(0) - 3}" y1="${schoen(Y(v))}" x2="${X(0) + 3}" y2="${schoen(Y(v))}" class="ks-achse"/><text x="${X(0) - 5}" y="${schoen(Y(v) + 4)}" class="ks-zahl ks-links">${yText(v)}</text>`;
      }
      s += `<text x="${X(0) - 5}" y="${y0 + 14}" class="ks-zahl ks-links">0</text>`;
    }
    for (const x of o.senkrechte || []) s += `<line x1="${schoen(X(x))}" y1="${Y(ymin)}" x2="${schoen(X(x))}" y2="${Y(ymax)}" class="ks-hilfe"/>`;
    // Graphen
    for (const g of o.funktionen || []) {
      const n = 300;
      const zuege = [[]];
      for (let i = 0; i <= n; i++) {
        const x = (g.von ?? xmin) + (((g.bis ?? xmax) - (g.von ?? xmin)) * i) / n;
        const y = g.f(x);
        if (Number.isFinite(y) && y >= ymin - 2 && y <= ymax + 2) zuege[zuege.length - 1].push(`${schoen(X(x))},${schoen(Y(y))}`);
        else if (zuege[zuege.length - 1].length) zuege.push([]);
      }
      for (const z of zuege) if (z.length > 1) s += `<polyline points="${z.join(' ')}" class="${g.klasse || 'ks-graph'}" clip-path="url(#fg-clip-${nr})"/>`;
      if (g.name && !o.klein) {
        const nx = g.nameX ?? xmax - (xmax - xmin) * 0.08;
        const ny = Math.max(ymin + 0.3 * (ymax - ymin) / 6, Math.min(ymax - 0.2, g.f(nx)));
        s += `<text x="${schoen(X(nx) + 6)}" y="${schoen(Y(ny) - 6)}" class="ks-gname${g.klasse === 'ks-graph2' ? ' g2' : ''}">${g.name}</text>`;
      }
    }
    for (const fl of o.flaechen || []) if (fl.text && !o.klein) s += `<text x="${schoen(X(fl.tx))}" y="${schoen(Y(fl.ty))}" class="ks-ftext" text-anchor="middle" style="text-anchor:middle">${fl.text}</text>`;
    for (const p of o.punkte || []) {
      s += `<circle cx="${schoen(X(p.x))}" cy="${schoen(Y(p.y))}" r="3.5" class="ks-punkt"/>`;
      if (p.text) s += `<text x="${schoen(X(p.x) + 6)}" y="${schoen(Y(p.y) - 6)}" class="ks-ptext">${p.text}</text>`;
    }
    return s + '</svg>';
  }

  /** passende Ausschnitte für einen Graphen */
  function bereich(fn, xmin, xmax, rand = 0.15) {
    let lo = 0;
    let hi = 0;
    for (let i = 0; i <= 200; i++) {
      const y = fn(xmin + ((xmax - xmin) * i) / 200);
      lo = Math.min(lo, y);
      hi = Math.max(hi, y);
    }
    const d = Math.max(hi - lo, 1);
    const schritt = d > 40 ? 10 : d > 16 ? 5 : d > 8 ? 2 : d > 3 ? 1 : 0.5;
    return {
      ymin: Math.floor((lo - rand * d) / schritt) * schritt,
      ymax: Math.ceil((hi + rand * d) / schritt) * schritt,
      gy: schritt,
      sy: schritt,
    };
  }
  /** Graph einer Funktion mit Flächen, Standardgröße */
  function bild(fn, xmin, xmax, extra = {}) {
    const b = bereich(fn, xmin, xmax);
    const hoehe = Math.min(320, Math.max(180, (b.ymax - b.ymin) * (420 / (xmax - xmin)) * (b.gy < 1 ? 1 : 1 / Math.max(1, b.gy / 2))));
    return graphSvg(Object.assign({ xmin, xmax, ymin: b.ymin, ymax: b.ymax, gx: 1, gy: b.gy, sx: 1, sy: b.sy, hoehe, breite: 420 }, extra));
  }

  /** zusammenhängende Teilflächen zwischen den Stellen (für die Färbung) */
  function teilflaechen(fn, stellen, gfn) {
    const fl = [];
    for (let i = 0; i + 1 < stellen.length; i++) {
      const a = stellen[i];
      const b = stellen[i + 1];
      const m = (a + b) / 2;
      const d = fn(m) - (gfn ? gfn(m) : 0);
      fl.push({ f: fn, g: gfn, a, b, klasse: d >= 0 ? 'ks-flaeche-pos' : 'ks-flaeche-neg' });
    }
    return fl;
  }

  const GG = (t) => `<b>GeoGebra-CAS:</b> <code>${t}</code>`;
  const ggTerm = (terme, v = 'x') => eingabeText(terme, v).replace(/ /g, '');
  const FRAGE_FE = 'Gib das Ergebnis exakt (Bruch) oder auf zwei Nachkommastellen gerundet an.';

  // =====================================================================
  // K1 Rekonstruktion eines Bestands aus der Änderungsrate (stückweise linear)
  // =====================================================================
  const REK = [
    {
      kurz: 'Durchflussrate', re: 'l/min', zeit: 'min', best: 'l', sx: [1, 2], sy: [1, 2, 5], b0: [20, 30, 50, 80],
      einleitung: 'Ein Wassertank wird über eine Leitung befüllt und entleert. Der Graph zeigt modellhaft die Durchflussrate (positiv: Zufluss, negativ: Abfluss).',
      start: (b) => `Zu Beginn sind ${b} l Wasser im Tank.`,
      bestand: 'Wassermenge im Tank', aenderung: 'Änderung der Wassermenge',
      richtig: (t, v) => `Zum Zeitpunkt ${t} min fließen pro Minute ${v} l Wasser in den Tank.`,
      falsch: [(t, v) => `Nach ${t} min sind ${v} l Wasser im Tank.`, (t, v) => `In den ersten ${t} min sind insgesamt ${v} l zugeflossen.`, (t, v) => `Nach ${t} min sind ${v} l mehr im Tank als zu Beginn.`],
    },
    {
      kurz: 'Geschwindigkeit', re: 'm/s', zeit: 's', best: 'm', sx: [5, 10], sy: [0.5, 1], b0: [10, 20, 40, 50],
      einleitung: 'Der Graph zeigt modellhaft die Vertikalgeschwindigkeit eines Heißluftballons (positiv: er steigt, negativ: er sinkt).',
      start: (b) => `Zu Beginn schwebt der Ballon ${b} m über dem Boden.`,
      bestand: 'Höhe des Ballons über dem Boden', aenderung: 'Höhenänderung',
      richtig: (t, v) => `Zum Zeitpunkt ${t} s steigt der Ballon mit einer Geschwindigkeit von ${v} m pro Sekunde.`,
      falsch: [(t, v) => `Nach ${t} s ist der Ballon ${v} m über dem Boden.`, (t, v) => `In den ersten ${t} s ist der Ballon insgesamt ${v} m gestiegen.`, (t, v) => `Nach ${t} s ist der Ballon ${v} m höher als zu Beginn.`],
    },
    {
      kurz: 'Durchflussrate', re: 'm³/h', zeit: 'h', best: 'm³', sx: [1, 2], sy: [0.5, 1], b0: [5, 8, 10, 12],
      einleitung: 'In einer Fabrik wird ein Tank mit einer Chemikalie befüllt und entleert. Der Graph zeigt modellhaft die Durchflussrate (positiv: Zufluss, negativ: Abfluss).',
      start: (b) => `Zu Beginn sind ${klar(b)} m³ im Tank.`,
      bestand: 'Volumen im Tank', aenderung: 'Volumenänderung',
      richtig: (t, v) => `Zum Zeitpunkt ${t} h fließen pro Stunde ${v} m³ in den Tank.`,
      falsch: [(t, v) => `Nach ${t} h sind ${v} m³ im Tank.`, (t, v) => `In den ersten ${t} h sind insgesamt ${v} m³ zugeflossen.`, (t, v) => `Nach ${t} h sind ${v} m³ mehr im Tank als zu Beginn.`],
    },
    {
      kurz: 'Besucherrate', re: 'Personen/min', zeit: 'min', best: 'Personen', sx: [10], sy: [5, 10], b0: [400, 600, 900],
      einleitung: 'Der Graph zeigt modellhaft, wie sich die Zahl der Personen in einer Ausstellung ändert (positiv: mehr kommen als gehen, negativ: mehr gehen als kommen).',
      start: (b) => `Zu Beginn sind ${b} Personen in der Ausstellung.`,
      bestand: 'Anzahl der Personen in der Ausstellung', aenderung: 'Änderung der Personenzahl',
      richtig: (t, v) => `Zum Zeitpunkt ${t} min nimmt die Zahl der Personen um ${v} Personen pro Minute zu.`,
      falsch: [(t, v) => `Nach ${t} min sind ${v} Personen in der Ausstellung.`, (t, v) => `In den ersten ${t} min sind insgesamt ${v} Personen hinzugekommen.`, (t, v) => `Nach ${t} min sind ${v} Personen mehr in der Ausstellung als zu Beginn.`],
    },
  ];

  /** stückweise lineare Rate auf Kästchen: Knoten [{x, y}] mit ganzen Zahlen, kein Vorzeichenwechsel ohne Nullstelle */
  function rateKnoten(stufe) {
    for (;;) {
      const n = R.int(9, 12);
      const k = [{ x: 0, y: R.int(0, 2) }];
      while (k[k.length - 1].x < n) {
        const l = k[k.length - 1];
        const x = Math.min(n, l.x + R.wahl([1, 1, 2, 2, 3]));
        let y = Math.max(-3, Math.min(4, l.y + R.int(-3, 3)));
        if ((l.y > 0 && y < 0) || (l.y < 0 && y > 0)) y = 0;
        if (l.y === 0 && y === 0) y = R.wahl([2, -2, 3]);
        k.push({ x, y });
      }
      const pos = k.some((p) => p.y > 0);
      const negativ = k.some((p) => p.y < 0);
      if (!pos || (stufe >= 2 && !negativ)) continue;
      // Vorzeichenfolge der Abschnitte
      const fl = [];
      for (let i = 0; i + 1 < k.length; i++) fl.push(B(k[i].y + k[i + 1].y, 2).mal(k[i + 1].x - k[i].x));
      return { k, fl };
    }
  }

  gen['ir-rekonstruktion'] = (stufe) => {
    const c = R.wahl(REK);
    for (;;) {
      const sx = R.wahl(c.sx);
      const sy = R.wahl(c.sy);
      const kaestchen = B(sx).mal(Bruch.dez(String(sy)));
      const { k, fl } = rateKnoten(stufe);
      const n = k[k.length - 1].x;
      const rate = (x) => {
        for (let i = 0; i + 1 < k.length; i++) if (x <= k[i + 1].x) return k[i].y + ((k[i + 1].y - k[i].y) * (x - k[i].x)) / (k[i + 1].x - k[i].x);
        return k[k.length - 1].y;
      };
      const zeitText = (x) => klar(x * sx);
      const rateText = (y) => klar(y * sy);
      const b0 = R.wahl(c.b0);
      const bestand = [B(b0)];
      for (let i = 0; i < fl.length; i++) bestand.push(bestand[i].plus(fl[i].mal(kaestchen)));
      if (bestand.some((b) => b.vz() < 0)) continue;

      const ymin = Math.min(-1, ...k.map((p) => p.y)) - 1;
      const ymax = Math.max(1, ...k.map((p) => p.y)) + 1;
      const svg = (mitFlaechen) => graphSvg({
        label: 'Änderungsrate', xmin: 0, xmax: n + 1, ymin, ymax, breite: (n + 1) * 34, hoehe: (ymax - ymin) * 34, kaestchen: true,
        gx: 1, gy: 1, sx: 1, sy: 1, xText: (v) => zeitText(v), yText: (v) => rateText(v),
        achsen: { x: `Zeit (in ${c.zeit})`, y: `${c.kurz} (in ${c.re})` },
        funktionen: [{ f: rate, von: 0, bis: n }],
        flaechen: mitFlaechen ? teilflaechen(rate, k.map((p) => p.x)) : [],
      });
      const ein = `${c.einleitung} ${$('t')} ist die Zeit in ${c.zeit}.`;
      const kText = `Ein Kästchen ist ${klar(sx)} ${c.zeit} breit und ${klar(sy)} ${c.re} hoch. Ein Kästchen entspricht also ${klar(sx)} ${c.zeit} · ${klar(sy)} ${c.re} = ${klar(kaestchen.zahl())} ${c.best}.`;
      const abschnittText = (i) => {
        const a = fl[i];
        const art = k[i].y === k[i + 1].y ? 'Rechteck' : k[i].y === 0 || k[i + 1].y === 0 ? 'Dreieck' : 'Trapez';
        return `${$(`[${zeitText(k[i].x).replace(',', '{,}')};\\,${zeitText(k[i + 1].x).replace(',', '{,}')}]`)}: ${art} mit ${klar(a.abs().zahl())} Kästchen ${a.vz() > 0 ? 'oberhalb' : a.vz() < 0 ? 'unterhalb' : 'auf'} der Zeitachse → ${a.vz() < 0 ? '−' : '+'}${klar(a.abs().mal(kaestchen).zahl())} ${c.best}`;
      };

      if (stufe === 1) {
        // Intervall mit Rate ≥ 0
        const kand = [];
        for (let i = 0; i < fl.length; i++) for (let j = i + 1; j <= Math.min(fl.length, i + 3); j++) {
          const teil = fl.slice(i, j);
          if (teil.every((a) => a.vz() >= 0) && teil.some((a) => a.vz() > 0) && k.slice(i, j + 1).every((p) => p.y >= 0)) kand.push([i, j]);
        }
        const knotenPos = k.filter((p) => p.y > 0 && p.x > 0);
        if (!kand.length || !knotenPos.length) continue;
        const [i, j] = R.wahl(kand);
        const aend = fl.slice(i, j).reduce((s, a) => s.plus(a), B(0)).mal(kaestchen);
        const p = R.wahl(knotenPos);
        const tP = zeitText(p.x);
        const vP = rateText(p.y);
        const opt = R.mische([c.richtig(tP, vP), ...c.falsch.map((f) => f(tP, vP))]);
        return {
          frage: `${ein}<br>a) Welchem Wert (in ${c.best}) entspricht ein Kästchen?<br>b) Der Graph hat zum Zeitpunkt ${$(`t=${tP.replace(',', '{,}')}`)} den Wert ${vP}. Was bedeutet das?<br>c) Bestimme die ${c.aenderung} zwischen ${$(`t=${zeitText(k[i].x).replace(',', '{,}')}`)} und ${$(`t=${zeitText(k[j].x).replace(',', '{,}')}`)}.`,
          bild: svg(false),
          notiz: true,
          felder: [
            zahl('a) 1 Kästchen entspricht', kaestchen, { einheit: c.best }),
            { art: 'auswahl', label: 'b)', optionen: opt, richtig: opt.indexOf(c.richtig(tP, vP)) },
            zahl(`c) ${c.aenderung}`, aend, { einheit: c.best }),
          ],
          hinweis: 'Der Graph zeigt die <b>Änderungsrate</b>, nicht den Bestand. Die Änderung erhältst du aus der Fläche zwischen Graph und Zeitachse: Kästchen zählen (Dreiecke = halbe Rechtecke) und mit dem Wert eines Kästchens multiplizieren.',
          loesung: [
            `a) ${kText}`,
            `b) Der Wert des Graphen ist eine <b>Rate</b> (${c.re}): ${c.richtig(tP, vP)} Über den Bestand selbst sagt ein einzelner Wert nichts aus.`,
            `c) Fläche zwischen Graph und Zeitachse von ${$(`t=${zeitText(k[i].x).replace(',', '{,}')}`)} bis ${$(`t=${zeitText(k[j].x).replace(',', '{,}')}`)}:`,
            ...fl.slice(i, j).map((_, m) => abschnittText(i + m)),
            `Zusammen: ${$(zt(aend))} ${c.best}.`,
            { svg: svg(true) },
          ],
        };
      }

      if (stufe === 2) {
        const ges = bestand[bestand.length - 1].minus(bestand[0]);
        const T = zeitText(n);
        return {
          frage: `${ein} ${c.start(b0)}<br>Bestimme die ${c.aenderung} in den ersten ${T} ${c.zeit} und die ${c.bestand} nach ${T} ${c.zeit}.`,
          bild: svg(false),
          notiz: true,
          felder: [zahl(`${c.aenderung} von 0 bis ${T} ${c.zeit}`, ges, { einheit: c.best }), zahl(`${c.bestand} nach ${T} ${c.zeit}`, bestand[bestand.length - 1], { einheit: c.best })],
          hinweis: 'Flächen oberhalb der Zeitachse zählen positiv (Zunahme), Flächen unterhalb negativ (Abnahme). Vergiss am Ende den Anfangsbestand nicht: Bestand = Anfangsbestand + Änderung.',
          loesung: [kText, ...fl.map((_, i) => abschnittText(i)),
            `${c.aenderung}: ${$(zt(ges))} ${c.best} (orientierter Flächeninhalt, Zunahmen minus Abnahmen).`,
            `${c.bestand} nach ${T} ${c.zeit}: Anfangsbestand + Änderung = ${$(`${zt(B(b0))}${ges.vz() < 0 ? '-' : '+'}${zt(ges.abs())}=${zt(bestand[bestand.length - 1])}`)} ${c.best}.`,
            { svg: svg(true) }],
        };
      }

      // Stufe 3: größter Bestand
      const werte = bestand.map((b) => b.zahl());
      const max = Math.max(...werte);
      const idx = werte.indexOf(max);
      if (werte.filter((w) => Math.abs(w - max) < 1e-9).length !== 1 || idx === 0) continue;
      const tMax = B(k[idx].x * sx);
      const groessteRate = k.reduce((a, p) => (p.y > a.y ? p : a));
      const lokal = k.map((p, i) => i).filter((i) => i > 0 && i < k.length - 1 && fl[i - 1].vz() > 0 && fl[i].vz() < 0);
      return {
        frage: `${ein} ${c.start(b0)}<br>Zu welchem Zeitpunkt ist die ${c.bestand} am größten? Wie groß ist sie dann?`,
        bild: svg(false),
        notiz: true,
        felder: [zahl('Zeitpunkt', tMax, { einheit: c.zeit }), zahl(`größte ${c.bestand}`, bestand[idx], { einheit: c.best })],
        hinweis: `Der Bestand ist <b>nicht</b> dort am größten, wo die Rate am größten ist – solange die Rate positiv ist, nimmt der Bestand weiter zu. Kandidaten sind die Stellen, an denen die Rate von + nach − wechselt, und die Ränder.`,
        loesung: [
          kText,
          `Solange der Graph oberhalb der Zeitachse liegt, nimmt die ${c.bestand} zu; liegt er unterhalb, nimmt sie ab. Ein Maximum kann also nur dort liegen, wo der Graph von oben nach unten durch die Zeitachse geht${lokal.length ? ` (hier bei ${lokal.map((i) => $(`t=${zeitText(k[i].x).replace(',', '{,}')}`)).join(' und ')})` : ''}, oder am Rand.`,
          `${c.bestand} an den Knickstellen (Anfangsbestand + Flächen bis dahin): ${k.map((p, i) => $(`${zeitText(p.x).replace(',', '{,}')}\\,\\text{${c.zeit}}:\\ ${zt(bestand[i])}`)).join(' · ')}`,
          `Am größten ist sie nach ${$(zt(tMax))} ${c.zeit} mit ${$(zt(bestand[idx]))} ${c.best}.`,
          `Achtung: Die Rate ist bei ${$(`t=${zeitText(groessteRate.x).replace(',', '{,}')}`)} am größten – dort nimmt der Bestand am schnellsten zu, ist aber nicht unbedingt am größten.`,
          { svg: svg(true) },
        ],
      };
    }
  };

  // =====================================================================
  // K2 Integral als orientierter Flächeninhalt, Integralschreibweise
  // =====================================================================
  gen['ir-orientiert'] = (stufe) => {
    if (stufe <= 2) {
      for (;;) {
        const m = R.wahl(stufe === 1 ? [B(0), B(1, 2), B(1), B(2), B(-1, 2), B(-1)] : [B(1, 2), B(1), B(2), B(-1, 2), B(-1), B(-2)]);
        const n = B(R.int(-3, 4));
        let a;
        let b;
        let null0 = null;
        if (stufe === 2) {
          if (m.z === 0) continue;
          null0 = n.neg().durch(m);
          if (!null0.istGanz() || Math.abs(null0.z) > 3) continue;
          a = null0.z - R.int(1, 3);
          b = null0.z + R.int(1, 3);
        } else {
          a = R.int(-3, 2);
          b = a + R.int(1, 4);
          const fa = m.mal(a).plus(n);
          const fb = m.mal(b).plus(n);
          if (fa.vz() * fb.vz() < 0 || (fa.z === 0 && fb.z === 0)) continue;
        }
        const terme = ordne([S(m, 1), S(n, 0)]);
        const fn = (x) => m.zahl() * x + n.zahl();
        const wert = integral(terme, a, b);
        const fTex = termTex(terme);
        const stellen = null0 ? [a, null0.zahl(), b] : [a, b];
        const svg = (mit) => bild(fn, Math.min(a, 0) - 1, Math.max(b, 0) + 1, { funktionen: [{ f: fn, name: 'f' }], flaechen: mit ? teilflaechen(fn, stellen) : [], senkrechte: [a, b] });
        const geo = (u, v) => {
          const fu = m.mal(u).plus(n);
          const fv = m.mal(v).plus(n);
          const inhalt = fu.plus(fv).abs().mal(v - u).durch(2);
          const art = fu.gleich(fv) ? 'Rechteck' : fu.z === 0 || fv.z === 0 ? 'Dreieck' : 'Trapez';
          const lage = fu.plus(fv).vz() >= 0 ? 'oberhalb' : 'unterhalb';
          return { inhalt, text: `${$(`[${u};\\,${v}]`)}: ${art} ${lage} der x-Achse mit Inhalt ${$(zt(inhalt))} (Höhen ${$(zt(fu.abs()))} und ${$(zt(fv.abs()))}, Breite ${$(String(v - u))}) → ${lage === 'oberhalb' ? 'positiv' : 'negativ'}`, vz: lage === 'oberhalb' ? 1 : -1 };
        };
        const teile = null0 ? [geo(a, null0.z), geo(null0.z, b)] : [geo(a, b)];
        const flaeche = teile.reduce((s, t) => s.plus(t.inhalt), B(0));
        const felder = [zahl(`$\\int_{${a}}^{${b}} f(x)\\,dx=$`, wert)];
        if (stufe === 2) felder.push(zahl('Inhalt der Fläche zwischen Graph und x-Achse', flaeche));
        return {
          frage: `Gegeben ist ${$(`f(x)=${fTex}`)}. Skizziere den Graphen und berechne das Integral mithilfe von Dreiecks- und Rechtecksflächen (ohne Stammfunktion).${stufe === 2 ? ' Bestimme außerdem den Inhalt der Fläche, die der Graph im Intervall mit der x-Achse einschließt.' : ''}`,
          term: `\\int_{${a}}^{${b}} \\left(${fTex}\\right)dx`,
          bild: svg(false),
          notiz: true,
          felder,
          hinweis: 'Zerlege die Fläche an der Nullstelle in Dreiecke/Rechtecke/Trapeze. Flächen oberhalb der x-Achse zählen beim Integral positiv, unterhalb negativ. Beim Flächeninhalt zählt alles positiv.',
          loesung: [
            ...teile.map((t) => t.text),
            `Integral (orientiert): ${$(`\\int_{${a}}^{${b}} f(x)\\,dx=${teile.map((t, i) => (t.vz < 0 ? '-' : i ? '+' : '') + zt(t.inhalt)).join('')}=${zt(wert)}`)}`,
            stufe === 2 ? `Flächeninhalt (alles positiv): ${$(`${teile.map((t) => zt(t.inhalt)).join('+')}=${zt(flaeche)}`)}. Integral und Flächeninhalt sind hier verschieden, weil ein Teil der Fläche unterhalb der x-Achse liegt.` : null,
            { svg: svg(true) },
            GG(`Integral(${ggTerm(terme)}, ${a}, ${b})`),
          ].filter(Boolean),
          pruef: [{ art: 'integral', f: cas(terme), a, b, wert: wert.zahl() }],
        };
      }
    }
    // Stufe 3: gegebene Teilflächen, Intervalladditivität, vertauschte Grenzen
    for (;;) {
      const r = R.mische([-3, -2, -1, 0, 1, 2, 3, 4]).slice(0, 3).sort((x, y) => x - y);
      if (r[2] - r[0] > 6) continue;
      const k = R.wahl([B(1, 2), B(-1, 2), B(1, 3), B(-1, 3), B(1), B(-1)]);
      const terme = polyTerme(polyAusNullstellen(k, r));
      const fn = (x) => wertZ(terme, x);
      const A = [integral(terme, r[0], r[1]), integral(terme, r[1], r[2])];
      if (A.some((a) => a.abs().zahl() < 0.6 || a.abs().zahl() > 12)) continue;
      const gerundet = A.map((a) => B(Math.round(a.abs().zahl() * 10), 10));
      if (gerundet[0].gleich(gerundet[1])) continue;
      const vz = A.map((a) => a.vz());
      const varianten = [[r[0], r[1]], [r[1], r[2]], [r[0], r[2]], [r[1], r[0]], [r[2], r[0]], [r[2], r[1]]];
      const [u, v] = R.wahl(varianten);
      const lo = Math.min(u, v);
      const hi = Math.max(u, v);
      let w = B(0);
      const teile = [];
      if (lo === r[0] && hi >= r[1]) { w = w.plus(gerundet[0].mal(vz[0])); teile.push(0); }
      if (lo <= r[1] && hi === r[2]) { w = w.plus(gerundet[1].mal(vz[1])); teile.push(1); }
      if (u > v) w = w.neg();
      const name = ['A_1', 'A_2'];
      const svg = bild(fn, r[0] - 1, r[2] + 1, {
        funktionen: [{ f: fn, name: 'f' }],
        flaechen: teilflaechen(fn, r).map((fl, i) => Object.assign(fl, { text: `A${i + 1} = ${klar(gerundet[i].zahl())}`, tx: (r[i] + r[i + 1]) / 2, ty: fn((r[i] + r[i + 1]) / 2) / 2 })),
      });
      const summeTex = teile.map((i, j) => `${vz[i] < 0 ? '-' : j ? '+' : ''}${name[i]}`).join('');
      return {
        frage: `Die Abbildung zeigt den Graphen von ${$('f')}. Die Inhalte der markierten Teilflächen sind angegeben (gerundet). Bestimme damit das Integral.`,
        term: `\\int_{${u}}^{${v}} f(x)\\,dx`,
        bild: svg,
        felder: [zahl('Wert des Integrals', w)],
        hinweis: 'Flächen unterhalb der x-Achse zählen negativ. Ist die obere Grenze kleiner als die untere, dreht sich das Vorzeichen um: ∫ von b bis a = −∫ von a bis b.',
        loesung: [
          u > v ? `Die Grenzen sind vertauscht: ${$(`\\int_{${u}}^{${v}} f(x)\\,dx=-\\int_{${v}}^{${u}} f(x)\\,dx`)}.` : null,
          `${$(`\\int_{${lo}}^{${hi}} f(x)\\,dx=${summeTex}=${teile.map((i, j) => `${vz[i] < 0 ? '-' : j ? '+' : ''}${zt(gerundet[i])}`).join('')}=${zt(u > v ? w.neg() : w)}`)} (${teile.map((i) => `${name[i].replace('_', '')} liegt ${vz[i] > 0 ? 'oberhalb' : 'unterhalb'} der x-Achse`).join(', ')}).`,
          u > v ? `Also ${$(`\\int_{${u}}^{${v}} f(x)\\,dx=${zt(w)}`)}.` : null,
        ].filter(Boolean),
      };
    }
  };

  // =====================================================================
  // K3 Stammfunktionen bilden
  // =====================================================================
  const KOEFF1 = [1, 2, 3, 4, 5, 6, -1, -2, -3, -4, 8, 10, 12];
  function zufallsPolynom(stufe) {
    if (stufe === 1) {
      const anzahl = R.wahl([1, 2, 2]);
      const ex = R.mische([0, 1, 2, 3, 4]).slice(0, anzahl);
      return ordne(ex.map((e) => S(R.wahl(KOEFF1), e)));
    }
    const ex = R.mische([0, 1, 2, 3, 4, 5]).slice(0, 3);
    return ordne(ex.map((e) => S(R.wahl([B(R.nz(-9, 9)), B(R.wahl([1, -1, 3, -3, 5]), R.wahl([2, 4, 5])), Bruch.dez(R.wahl(['0,5', '-0,5', '1,5', '0,2', '-0,4', '2,5']))]), e)));
  }
  /** Lösungsschritte: jeder Summand einzeln */
  function stammSchritte(terme, v = 'x') {
    return terme.map((t) => {
      const e1 = t.e.plus(1);
      const f = termTex([t], v, 'normal').replace(/^\+/, '');
      const F = termTex([S(t.c.durch(e1), e1)], v, 'normal');
      const eTex = e1.istGanz() ? String(e1.z) : e1.tex('bruch');
      const kehr = B(1).durch(e1);
      const zwischen = t.e.z === 0 ? `${zt(t.c)}${v}` : `${t.c.gleich(1) ? '' : t.c.gleich(-1) ? '-' : `${zt(t.c)}\\cdot `}${e1.istGanz() ? `\\frac{1}{${eTex}}` : kehr.vz() < 0 ? `\\left(${kehr.tex('bruch')}\\right)` : kehr.tex('bruch')}${v}^{${eTex}}`;
      const umschreiben = t.e.istGanz() && t.e.z >= 0 ? '' : `${termTex([t], v, 'potenz')}\\ \\to\\ `;
      return $(`${f}\\ \\to\\ ${umschreiben}${zwischen}=${F}`);
    });
  }
  const stammFeld = (terme, v = 'x', label) => ({
    art: 'term', label: label || `$${v === 'x' ? 'F(x)' : 'F(t)'}=$`, modus: 'stamm', variable: v,
    soll: cas(stamm(terme)), loesung: eingabeText(stamm(terme), v), funktion: cas(terme), ableitung: cas(abl(terme)),
  });

  gen['ir-stammfunktion'] = (stufe) => {
    const v = stufe >= 2 && R.int(0, 2) === 0 ? 't' : 'x';
    const fn = v === 'x' ? 'f(x)' : 'f(t)';
    if (stufe <= 2) {
      const terme = zufallsPolynom(stufe);
      if (terme.length === 0) return gen['ir-stammfunktion'](stufe);
      const F = stamm(terme);
      return {
        frage: `Bestimme eine Stammfunktion ${$(v === 'x' ? 'F' : 'F')} von ${$('f')}.`,
        term: `${fn}=${termTex(terme, v, stufe === 2 ? 'dezimal' : 'normal')}`,
        felder: [stammFeld(terme, v)],
        hinweis: `Potenzregel rückwärts: Exponent um 1 erhöhen und durch den neuen Exponenten teilen: ${$(`${v}^n\\to\\frac{1}{n+1}${v}^{n+1}`)}. Eine Zahl ${$('a')} wird zu ${$(`a\\cdot ${v}`)}. Faktoren und Summen bleiben erhalten.`,
        loesung: [
          'Jeden Summanden einzeln (Summen- und Faktorregel), Exponent +1, durch den neuen Exponenten teilen:',
          ...stammSchritte(terme, v),
          `${$(`F(${v})=${termTex(F, v)}`)} – und jede Funktion ${$(`F(${v})+C`)} ist ebenfalls eine Stammfunktion.`,
          `Probe: ${$(`F'(${v})=${termTex(abl(F), v)}=f(${v})`)} ✔`,
          GG(`Integral(${ggTerm(terme)})`),
        ],
      };
    }
    // Stufe 3: Wurzeln/negative Exponenten, Ausmultiplizieren oder Bedingung F(x0) = y0
    const art = R.wahl(['potenz', 'potenz', 'ausmult', 'bedingung']);
    if (art === 'potenz') {
      const kand = [
        () => [S(R.wahl([1, 2, 3, 4, 6, -2]), -2)],
        () => [S(R.wahl([2, 3, 6, -4]), -3), S(R.nz(-4, 4), 1)],
        () => [S(R.wahl([1, 3, 6, -3]), B(1, 2))],
        () => [S(R.wahl([1, 2, -1]), B(-1, 2)), S(R.nz(-5, 5), 0)],
        () => [S(R.wahl([2, 4, 8]), -2), S(R.wahl([1, 3]), 2)],
      ];
      const terme = ordne(R.wahl(kand)());
      const F = stamm(terme);
      return {
        frage: `Bestimme eine Stammfunktion ${$('F')} von ${$('f')} (für ${$('x>0')}).`,
        term: `f(x)=${termTex(terme)}`,
        felder: [stammFeld(terme)],
        hinweis: 'Schreibe Brüche und Wurzeln zuerst als Potenz: 1/x² = x^(−2), √x = x^(1/2). Dann gilt die Potenzregel genauso (Exponent +1, durch neuen Exponenten teilen).',
        loesung: [
          `Zuerst als Potenz schreiben: ${$(`f(x)=${termTex(terme, 'x', 'potenz')}`)}`,
          ...stammSchritte(terme),
          `${$(`F(x)=${termTex(F, 'x', 'potenz')}=${termTex(F)}`)}`,
          `Probe: ${$(`F'(x)=${termTex(abl(F), 'x', 'potenz')}=f(x)`)} ✔`,
          GG(`Integral(${ggTerm(terme)})`),
        ],
      };
    }
    if (art === 'ausmult') {
      const a = R.nz(-3, 3);
      const p = R.wahl([1, 2]);
      const varianten = [
        { tex: `x^{${p === 1 ? '' : p}}(x${a < 0 ? '+' : '-'}${Math.abs(a)})`.replace('x^{}', 'x'), terme: ordne([S(1, p + 1), S(-a, p)]) },
        { tex: `(x${a < 0 ? '-' : '+'}${Math.abs(a)})^2`, terme: ordne([S(1, 2), S(2 * a, 1), S(a * a, 0)]) },
        { tex: `(2x${a < 0 ? '-' : '+'}${Math.abs(a)})(x-1)`, terme: ordne([S(2, 2), S(a - 2, 1), S(-a, 0)]) },
      ];
      const w = R.wahl(varianten);
      const F = stamm(w.terme);
      return {
        frage: `Bestimme eine Stammfunktion ${$('F')} von ${$('f')}.`,
        term: `f(x)=${w.tex}`,
        felder: [stammFeld(w.terme)],
        hinweis: 'Für ein Produkt gibt es keine einfache Regel – multipliziere zuerst aus, dann jeden Summanden einzeln.',
        loesung: [
          `Ausmultiplizieren: ${$(`f(x)=${termTex(w.terme)}`)}`,
          ...stammSchritte(w.terme),
          `${$(`F(x)=${termTex(F)}`)}`,
          'Achtung: Das Produkt der Stammfunktionen der Faktoren ist keine Stammfunktion!',
          GG(`Integral(${w.tex.replace(/[{}]/g, '').replace(/\^/g, '^')})`),
        ],
      };
    }
    // Bedingung
    const terme = zufallsPolynom(1).filter((t) => t.e.z > 0);
    if (!terme.length) return gen['ir-stammfunktion'](3);
    const x0 = R.int(-2, 2);
    const y0 = R.int(-4, 5);
    const F0 = stamm(terme);
    const C = B(y0).minus(wertB(F0, x0));
    const F = ordne([...F0, S(C, 0)]);
    const bedingung = `F(${x0}) = ${y0}`.replace(/-/g, '−');
    return {
      frage: `Bestimme die Stammfunktion ${$('F')} von ${$('f')} mit ${$(`F(${x0})=${y0}`)}.`,
      term: `f(x)=${termTex(terme)}`,
      felder: [{ art: 'term', label: '$F(x)=$', modus: 'gleich', soll: cas(F), loesung: eingabeText(F), funktion: cas(terme), ableitung: cas(abl(terme)), bedingung }],
      hinweis: 'Bilde zuerst eine Stammfunktion mit „+ C“. Setze dann die Bedingung ein und löse nach C auf.',
      loesung: [
        ...stammSchritte(terme),
        `${$(`F(x)=${termTex(F0)}+C`)}`,
        `Bedingung: ${$(`F(${x0})=${einsetzTex(F0, x0)}+C=${zt(wertB(F0, x0))}+C=${y0}`)} ⇒ ${$(`C=${zt(C)}`)}`,
        `${$(`F(x)=${termTex(F)}`)}`,
      ],
    };
  };

  // =====================================================================
  // K4 Stammfunktion nachweisen
  // =====================================================================
  gen['ir-nachweis'] = (stufe) => {
    if (stufe === 3) {
      const n = R.int(1, 4);
      const c = R.nz(-6, 8);
      const d = R.int(-5, 5);
      const a = B(c, n + 1);
      const f = ordne([S(c, n), S(d, 0)]);
      return {
        frage: `Für welchen Wert von ${$('a')} ist ${$('F')} eine Stammfunktion von ${$('f')}?`,
        term: `f(x)=${termTex(f)};\\quad F(x)=a\\cdot x^{${n + 1}}${d === 0 ? '' : `${d < 0 ? '-' : '+'}${Math.abs(d) === 1 ? '' : Math.abs(d)}x`}${R.int(0, 1) ? `+${R.int(1, 9)}` : ''}`,
        felder: [zahl('$a=$', a)],
        hinweis: 'F ist Stammfunktion von f, wenn F′(x) = f(x) gilt. Leite F ab und vergleiche die Koeffizienten.',
        loesung: [
          `${$(`F'(x)=${n + 1}a\\cdot x^{${n}}${d === 0 ? '' : `${d < 0 ? '-' : '+'}${Math.abs(d)}`}`.replace('x^{1}', 'x'))}`,
          `Vergleich mit ${$(`f(x)=${termTex(f)}`)}: ${$(`${n + 1}a=${c}`)} ⇒ ${$(`a=${zt(a)}`)}`,
          'Die Konstante am Ende spielt keine Rolle – sie fällt beim Ableiten weg.',
        ],
      };
    }
    const f = stufe === 1 ? zufallsPolynom(1).filter((t) => t.e.z >= 0) : ordne(R.wahl([[S(R.wahl([2, 3, -4]), -2), S(R.nz(-3, 3), 1)], [S(R.wahl([1, 3]), B(1, 2)), S(R.nz(-4, 4), 2)], zufallsPolynom(2)]));
    if (!f.length) return gen['ir-nachweis'](stufe);
    const echt = stamm(f);
    const fehler = R.int(0, 2);
    let F;
    let wieFalsch = '';
    if (fehler === 0) F = ordne([...echt, S(R.int(-9, 9), 0)]);
    else {
      const i = R.int(0, echt.length - 1);
      const t = echt[i];
      const art = t.e.gleich(1) ? 'vorzeichen' : R.wahl(['faktor', 'vorzeichen']);
      const neu = art === 'faktor' ? S(t.c.mal(t.e), t.e) : S(t.c.neg(), t.e);
      wieFalsch = art === 'faktor' ? `Beim Summanden mit ${$(`x^{${zt(t.e)}}`)} fehlt der Faktor ${$(`\\frac{1}{${zt(t.e)}}`)}.` : 'Ein Vorzeichen ist falsch.';
      F = ordne([...echt.map((x, j) => (j === i ? neu : x)), S(R.int(0, 5), 0)]);
    }
    const Fs = abl(F);
    const ist = cas(Fs) === cas(f);
    const optionen = ['Ja, F ist eine Stammfunktion von f.', 'Nein, F ist keine Stammfunktion von f.'];
    return {
      frage: `Prüfe durch Ableiten, ob ${$('F')} eine Stammfunktion von ${$('f')} ist${stufe === 2 ? ` (für ${$('x>0')})` : ''}.`,
      term: `f(x)=${termTex(f)};\\qquad F(x)=${termTex(F)}`,
      felder: [{ art: 'term', label: "$F'(x)=$", modus: 'gleich', soll: cas(Fs), loesung: eingabeText(Fs) }, { art: 'auswahl', label: 'Ergebnis', optionen, richtig: ist ? 0 : 1 }],
      hinweis: 'F ist eine Stammfunktion von f, wenn F′(x) = f(x) für alle x gilt. Eine Konstante in F fällt beim Ableiten weg – sie stört also nicht.',
      loesung: [
        `${$(`F'(x)=${termTex(Fs)}`)}`,
        ist ? `Das ist genau ${$('f(x)')} ⇒ ${$('F')} ist eine Stammfunktion von ${$('f')}.` : `Das ist nicht ${$(`f(x)=${termTex(f)}`)} ⇒ ${$('F')} ist keine Stammfunktion. ${wieFalsch} Richtig wäre z. B. ${$(`F(x)=${termTex(echt)}`)}.`,
      ],
    };
  };

  // =====================================================================
  // K5 Hauptsatz anwenden und sauber notieren
  // =====================================================================
  function hdiAufgabe(stufe) {
    for (;;) {
      let terme;
      let a;
      let b;
      let v = 'x';
      if (stufe === 1) {
        terme = R.wahl([() => [S(R.wahl([1, 2, 3, 4, 6, -2, -3]), R.int(1, 3))], () => ordne([S(R.nz(-3, 4), 1), S(R.nz(-4, 5), 0)]), () => ordne([S(R.wahl([3, 6, -3]), 2), S(R.nz(-4, 4), 0)])])();
        a = R.int(0, 2);
        b = a + R.int(1, 3);
      } else if (stufe === 2) {
        terme = zufallsPolynom(2).filter((t) => t.e.z <= 3);
        if (terme.length < 2) continue;
        a = R.int(-3, 0);
        b = R.int(1, 3);
        if (R.int(0, 3) === 0) v = 't';
      } else {
        const w = R.int(0, 2);
        if (w === 0) { terme = ordne([S(R.wahl([2, 4, 6, -3]), -2), S(R.nz(-3, 3), 1)]); a = R.int(1, 2); b = a + R.int(1, 3); }
        else if (w === 1) { terme = ordne([S(R.wahl([3, 6, -3, 9]), B(1, 2)), S(R.nz(-2, 2), 0)]); a = R.wahl([0, 1, 4]); b = R.wahl([4, 9, 16].filter((x) => x > a)); }
        else { terme = zufallsPolynom(2); a = R.int(-2, 0); b = R.int(1, 2); }
      }
      if (!terme.length) continue;
      const F = stamm(terme);
      const Fb = wertB(F, b);
      const Fa = wertB(F, a);
      const w = Fb.minus(Fa);
      if (Fb.n > 400 || Fa.n > 400) continue;
      return { terme, F, a, b, v, Fa, Fb, w };
    }
  }

  gen['ir-hdi'] = (stufe) => {
    const { terme, F, a, b, v, Fa, Fb, w } = hdiAufgabe(stufe);
    const fTex = termTex(terme, v, stufe === 2 ? 'dezimal' : 'normal');
    const Ftex = termTex(F, v);
    return {
      frage: `Berechne das Integral mit dem Hauptsatz der Differenzial- und Integralrechnung. Notiere alle Schritte: Stammfunktion in eckigen Klammern mit den Grenzen, dann ${$('F(b)-F(a)')}. Verwende die Stammfunktion ohne Konstante. ${FRAGE_FE}`,
      term: `\\int_{${a}}^{${b}} \\left(${fTex}\\right)d${v}`,
      notiz: true,
      felder: [
        stammFeld(terme, v),
        naeh(`$F(${b})=$`, Fb),
        naeh(`$F(${a})=$`, Fa),
        naeh(`$\\int_{${a}}^{${b}}\\ldots\\,d${v}=$`, w),
      ],
      hinweis: `Schreibweise: ${$(`\\int_a^b f(${v})\\,d${v}=\\big[F(${v})\\big]_a^b=F(b)-F(a)`)}. Setze negative Zahlen in Klammern, z. B. ${$('(-2)^3=-8')}, und subtrahiere ${$('F(a)')} als Ganzes (Klammer!).`,
      loesung: [
        `Stammfunktion: ${$(`F(${v})=${Ftex}`)}`,
        `${$(`\\int_{${a}}^{${b}} \\left(${fTex}\\right)d${v}=\\left[${Ftex}\\right]_{${a}}^{${b}}`)}`,
        `${$(`=\\left(${einsetzTex(F, b)}\\right)-\\left(${einsetzTex(F, a)}\\right)`)}`,
        `${$(`=${zt(Fb)}-${kl(Fa)}=${erg(w)}`)}`,
        GG(`Integral(${ggTerm(terme, v).replace(new RegExp(v, 'g'), 'x')}, ${a}, ${b})`),
      ],
      pruef: [{ art: 'integral', f: cas(terme), a, b, wert: w.zahl() }],
    };
  };

  // =====================================================================
  // K6 Flächen zwischen Graph und x-Achse
  // =====================================================================
  function flaechenRechnung(dTerme, stellen, name = 'f') {
    const D = stamm(dTerme);
    const teile = [];
    for (let i = 0; i + 1 < stellen.length; i++) {
      const u = stellen[i];
      const v = stellen[i + 1];
      const w = wertB(D, v).minus(wertB(D, u));
      teile.push({ u, v, w });
    }
    const A = teile.reduce((s, t) => s.plus(t.w.abs()), B(0));
    const zeilen = teile.map((t) => $(`\\int_{${zt(t.u)}}^{${zt(t.v)}} ${name}\\,dx=\\left[${termTex(D)}\\right]_{${zt(t.u)}}^{${zt(t.v)}}=${zt(wertB(D, t.v))}-${kl(wertB(D, t.u))}=${zt(t.w)}`));
    const summeZ = `A=${teile.map((t) => (t.w.vz() < 0 ? `\\left|${zt(t.w)}\\right|` : zt(t.w))).join('+')}=${erg(A)}`;
    return { teile, A, zeilen, summeZ };
  }

  gen['ir-flaeche-x'] = (stufe) => {
    for (;;) {
      let k;
      let r;
      let a;
      let b;
      if (stufe === 1) {
        k = R.wahl([B(-1), B(1), B(-1, 2), B(1, 2), B(-2), B(2), B(-1, 3)]);
        const r1 = R.int(-3, 1);
        r = [r1, r1 + R.int(2, 4)];
        [a, b] = r;
      } else if (stufe === 2) {
        k = R.wahl([B(1), B(-1), B(1, 2), B(-1, 2)]);
        const r1 = R.int(-2, 1);
        r = [r1, r1 + R.int(2, 3)];
        a = r[0] - R.int(0, 1);
        b = r[1] + R.int(1, 2);
        if (a === r[0] && R.int(0, 1)) a = r[0] + 1;
      } else {
        k = R.wahl([B(1), B(-1), B(1, 2), B(-1, 2), B(1, 4), B(-1, 4)]);
        const typ = R.int(0, 2);
        if (typ === 0) r = R.mische([-3, -2, -1, 0, 1, 2, 3]).slice(0, 3).sort((x, y) => x - y);
        else r = [0, R.wahl([-3, -2, 2, 3])].sort((x, y) => x - y), r = typ === 1 ? [0, 0, r.find((x) => x !== 0)] : R.mische([-2, -1, 1, 2]).slice(0, 2).concat([0]).sort((x, y) => x - y);
        a = Math.min(...r);
        b = Math.max(...r);
      }
      const terme = polyTerme(polyAusNullstellen(k, r));
      if (terme.some((t) => t.c.n > 12 || Math.abs(t.c.zahl()) > 20)) continue;
      const fn = (x) => wertZ(terme, x);
      const innen = [...new Set(r.filter((x) => x > a && x < b))].sort((x, y) => x - y);
      const stellen = [a, ...innen, b];
      const nst = [...new Set(r.filter((x) => x >= a && x <= b))];
      const { teile, A, zeilen, summeZ } = flaechenRechnung(terme, stellen.map((x) => B(x)));
      if (teile.some((t) => t.w.z === 0) || A.zahl() > 60) continue;
      const ganz = integral(terme, a, b);
      const fTex = termTex(terme);
      const rand = stufe === 3 ? 0.6 : 1;
      const svg = (mit) => bild(fn, Math.min(...r, a) - rand, Math.max(...r, b) + rand, { funktionen: [{ f: fn, name: 'f' }], flaechen: mit ? teilflaechen(fn, stellen) : [], senkrechte: stufe === 2 ? [a, b] : [] });
      const fragetext = stufe === 2
        ? `Berechne den Inhalt der Fläche, die der Graph von ${$('f')}, die x-Achse und die Geraden ${$(`x=${a}`)} und ${$(`x=${b}`)} einschließen.`
        : `Der Graph von ${$('f')} schließt mit der x-Achse eine Fläche ein. Berechne ihren Inhalt.`;
      return {
        frage: `${fragetext} Gib dazu zuerst die Nullstellen ${stufe === 2 ? 'im Intervall ' : ''}an (getrennt durch Semikolon). ${FRAGE_FE}`,
        term: `f(x)=${fTex}`,
        bild: stufe === 3 ? '' : svg(false),
        notiz: true,
        felder: [{ art: 'menge', label: `Nullstellen${stufe === 2 ? ` in [${a}; ${b}]` : ''}`.replace(/-/g, '−'), antwort: nst.map((x) => B(x)) }, naeh('Flächeninhalt', A, { einheit: 'FE' })],
        hinweis: 'Nullstellen bestimmen (ausklammern, Nullprodukt, pq-Formel). Zwischen je zwei benachbarten Grenzen/Nullstellen einzeln integrieren und die Beträge addieren – nicht einfach über alles integrieren!',
        loesung: [
          `Nullstellen: ${$(`f(x)=${faktorTex(k, r)}=0`)} ⇒ ${$(`x\\in ${UM.mengeTex([...new Set(r)].map((x) => B(x)))}`)}${stufe === 2 ? `; im Intervall ${$(`[${a};\\,${b}]`)}: ${$(UM.mengeTex(nst.map((x) => B(x))))}` : ''}.`,
          `Teilintegrale (Stammfunktion ${$(`F(x)=${termTex(stamm(terme))}`)}):`,
          ...zeilen,
          `${$(summeZ)} FE`,
          teile.length > 1 ? `<span class="achtung">Achtung:</span> ${$(`\\int_{${a}}^{${b}} f(x)\\,dx=${zt(ganz)}`)} ist <b>nicht</b> der Flächeninhalt – Teile unterhalb der x-Achse würden abgezogen.` : `Da die Fläche ${teile[0].w.vz() < 0 ? 'unterhalb' : 'oberhalb'} der x-Achse liegt, ist der Flächeninhalt der Betrag des Integrals.`,
          { svg: svg(true) },
          GG(`Löse(${ggTerm(terme)} = 0)`) + ' · ' + `<code>Integral(abs(${ggTerm(terme)}), ${a}, ${b})</code>`,
        ],
        pruef: [{ art: 'flaeche', f: cas(terme), g: '0', a, b, wert: A.zahl() }],
      };
    }
  };

  // =====================================================================
  // K7 Fläche zwischen zwei Graphen
  // =====================================================================
  gen['ir-flaeche-zwei'] = (stufe) => {
    for (;;) {
      let gT;
      let d;
      let r;
      let k;
      if (stufe === 1) {
        k = R.wahl([B(1), B(-1), B(1, 2), B(-1, 2)]);
        const r1 = R.int(-2, 1);
        r = [r1, r1 + R.int(2, 4)];
        gT = ordne([S(R.wahl([B(1, 2), B(1), B(-1), B(2), B(0)]), 1), S(R.int(-2, 2), 0)]);
      } else if (stufe === 2) {
        k = R.wahl([B(1), B(-1), B(2), B(-2), B(3, 2)]);
        const r1 = R.int(-2, 0);
        r = [r1, r1 + R.int(2, 3)];
        gT = ordne([S(R.wahl([B(1), B(-1), B(1, 2), B(-1, 2)]), 2), S(R.int(-2, 2), 1), S(R.int(-2, 2), 0)]);
      } else {
        k = R.wahl([B(1), B(-1), B(1, 2), B(-1, 2)]);
        r = R.mische([-2, -1, 0, 1, 2]).slice(0, 3).sort((x, y) => x - y);
        gT = ordne([S(R.wahl([B(1), B(-1), B(1, 2)]), 2), S(R.int(-2, 2), 1)]);
      }
      d = polyTerme(polyAusNullstellen(k, r));
      const fT = summe(gT, d);
      if (fT.some((t) => t.c.n > 12 || Math.abs(t.c.zahl()) > 15)) continue;
      const fn = (x) => wertZ(fT, x);
      const gn = (x) => wertZ(gT, x);
      const stellen = r.map((x) => B(x));
      const { teile, A, summeZ } = flaechenRechnung(d, stellen, '(f-g)');
      if (A.zahl() > 40) continue;
      const D = stamm(d);
      const xmin = r[0] - 1;
      const xmax = r[r.length - 1] + 1;
      const both = (x) => [fn(x), gn(x)];
      const b1 = bereich((x) => Math.max(...both(x)), xmin, xmax);
      const b2 = bereich((x) => Math.min(...both(x)), xmin, xmax);
      const ymin = Math.min(b1.ymin, b2.ymin, -1);
      const ymax = Math.max(b1.ymax, b2.ymax, 1);
      if (ymax - ymin > 30) continue;
      const gy = ymax - ymin > 14 ? 2 : 1;
      const svg = (mit) => graphSvg({
        xmin, xmax, ymin, ymax, breite: 420, hoehe: Math.min(330, (ymax - ymin) * 420 / (xmax - xmin) / (gy === 2 ? 2 : 1)), gx: 1, gy, sx: 1, sy: gy,
        funktionen: [{ f: fn, name: 'f' }, { f: gn, name: 'g', klasse: 'ks-graph2', nameX: xmin + 0.3 }],
        flaechen: mit ? teilflaechen(fn, r, gn) : [],
      });
      return {
        frage: `Die Graphen von ${$('f')} und ${$('g')} schließen eine Fläche ein. Bestimme die Schnittstellen (getrennt durch Semikolon) und den Inhalt der Fläche. ${FRAGE_FE}`,
        term: `f(x)=${termTex(fT)};\\qquad g(x)=${termTex(gT)}`,
        bild: svg(false),
        notiz: true,
        felder: [{ art: 'menge', label: 'Schnittstellen', antwort: stellen }, naeh('Flächeninhalt', A, { einheit: 'FE' })],
        hinweis: 'Schnittstellen: f(x) = g(x) ⇔ f(x) − g(x) = 0. Integriere dann die Differenzfunktion f − g zwischen den Schnittstellen und addiere die Beträge.',
        loesung: [
          `Differenzfunktion: ${$(`d(x)=f(x)-g(x)=${termTex(d)}=${faktorTex(k, r)}`)}`,
          `Schnittstellen: ${$(`d(x)=0`)} ⇒ ${$(`x\\in ${UM.mengeTex(stellen)}`)}`,
          `Stammfunktion von ${$('d')}: ${$(`D(x)=${termTex(D)}`)}`,
          ...teile.map((t) => $(`\\int_{${zt(t.u)}}^{${zt(t.v)}} (f-g)\\,dx=D(${zt(t.v)})-D(${zt(t.u)})=${zt(wertB(D, t.v))}-${kl(wertB(D, t.u))}=${zt(t.w)}`)),
          `${$(summeZ)} FE`,
          teile.length > 1 ? 'Zwischen den Schnittstellen wechselt, welcher Graph oben liegt – deshalb einzeln integrieren und Beträge nehmen.' : 'Ist das Integral negativ, liegt g oben – der Flächeninhalt ist der Betrag.',
          { svg: svg(true) },
          GG(`Löse(${ggTerm(fT)} = ${ggTerm(gT)})`) + ' · ' + `<code>Integral(abs(${ggTerm(fT)} - (${ggTerm(gT)})), ${r[0]}, ${r[r.length - 1]})</code>`,
        ],
        pruef: [{ art: 'flaeche', f: cas(fT), g: cas(gT), a: r[0], b: r[r.length - 1], wert: A.zahl() }],
      };
    }
  };

  // =====================================================================
  // K8 Sachaufgaben: Änderungsrate gegeben, Bestand gesucht
  // =====================================================================
  const SACH = [
    { was: 'Wassertank', rate: 'die Änderungsrate der Wassermenge in einem Tank', rE: 'm³ pro Tag', t: 'Tagen', tE: 'Tag', best: 'Wassermenge im Tank', bE: 'm³', b0: [4, 6, 10, 15], plus: 'Zufluss', minus: 'Abfluss' },
    { was: 'Stausee', rate: 'die Änderungsrate des Wasservolumens eines Stausees', rE: 'Mio. m³ pro Woche', t: 'Wochen', tE: 'Woche', best: 'Wasservolumen', bE: 'Mio. m³', b0: [20, 30, 40], plus: 'Zufluss', minus: 'Abfluss' },
    { was: 'Silo', rate: 'die Änderungsrate der Getreidemenge in einem Silo', rE: 't pro Stunde', t: 'Stunden', tE: 'Stunde', best: 'Getreidemenge im Silo', bE: 't', b0: [10, 20, 25], plus: 'Befüllen', minus: 'Entnahme' },
  ];
  const WACHS = [
    { rate: 'die Wachstumsgeschwindigkeit einer Sonnenblume', rE: 'cm pro Tag', t: 'Tagen', tE: 'Tag', groesse: 'Höhe', bE: 'cm', b0: [5, 8, 10] },
    { rate: 'die Wachstumsgeschwindigkeit eines Baumes', rE: 'cm pro Jahr', t: 'Jahren', tE: 'Jahr', groesse: 'Höhe', bE: 'cm', b0: [50, 80, 100] },
  ];

  gen['ir-sach'] = (stufe) => {
    if (stufe === 1) {
      const c = R.wahl(WACHS);
      for (;;) {
        const terme = R.wahl([() => [S(R.wahl([B(1, 10), B(3, 10), B(1, 5), B(1, 2)]), 2)], () => ordne([S(R.wahl([B(1, 2), B(1), B(2), B(3, 2)]), 1), S(R.int(1, 4), 0)]), () => ordne([S(R.wahl([B(-1, 10), B(-1, 5)]), 2), S(R.int(2, 4), 1)])])();
        const T = R.wahl([4, 5, 6, 8, 10]);
        if ([0, T / 2, T].some((x) => wertZ(terme, x) < 0)) continue;
        const w = integral(terme, 0, T);
        if (w.zahl() > 400 || w.z === 0) continue;
        const b0 = R.wahl(c.b0);
        const richtig = `Die ${c.groesse} nimmt in den ersten ${T} ${c.t} um ${klar(w.zahl())} ${c.bE} zu.`;
        const opt = R.mische([richtig, `Die ${c.groesse} beträgt nach ${T} ${c.t} ${klar(w.zahl())} ${c.bE}.`, `Die Wachstumsgeschwindigkeit nach ${T} ${c.t} beträgt ${klar(w.zahl())} ${c.rE}.`, `Die ${c.groesse} nimmt pro ${c.tE} um ${klar(w.zahl())} ${c.bE} zu.`]);
        const fn = (x) => wertZ(terme, x);
        return {
          frage: `Die Funktion ${$('w')} mit ${$(`w(t)=${termTex(terme, 't')}`)} beschreibt modellhaft ${c.rate} (${$('t')} in ${c.t}, ${$('w(t)')} in ${c.rE}). Zu Beginn beträgt die ${c.groesse} ${b0} ${c.bE}.<br>a) Berechne ${$(`\\int_0^{${T}} w(t)\\,dt`)}. b) Was gibt dieser Wert im Sachzusammenhang an?`,
          bild: bild(fn, 0, T + 1, { funktionen: [{ f: fn, name: 'w', von: 0 }], achsen: { x: 't', y: 'w(t)' } }),
          notiz: true,
          felder: [naeh('a) Integral', w, { einheit: c.bE }), { art: 'auswahl', label: 'b)', optionen: opt, richtig: opt.indexOf(richtig) }],
          hinweis: 'Das Integral über eine Änderungsrate liefert die <b>Änderung</b> der Größe im Zeitraum – nicht die Größe selbst. Einheit: (cm pro Tag) · Tage = cm.',
          loesung: [
            `a) ${$(`\\int_0^{${T}} w(t)\\,dt=\\left[${termTex(stamm(terme), 't')}\\right]_0^{${T}}=${zt(wertB(stamm(terme), T))}-0=${erg(w)}`)}`,
            `b) ${richtig} Die ${c.groesse} selbst ist dann ${b0} + ${klar(w.zahl())} = ${klar(b0 + w.zahl())} ${c.bE} – dafür braucht man den Anfangswert.`,
            GG(`Integral(${ggTerm(terme)}, 0, ${T})`),
          ],
          pruef: [{ art: 'integral', f: cas(terme), a: 0, b: T, wert: w.zahl() }],
        };
      }
    }
    const c = R.wahl(SACH);
    for (;;) {
      const p = R.int(3, 7);
      const q = p + R.int(2, 5);
      const k = R.wahl([B(1, 20), B(1, 10), B(1, 40), B(1, 30)]);
      const terme = polyTerme(polyAusNullstellen(k, [0, p, q]));
      const T = stufe === 2 ? R.int(Math.max(p + 1, q - 2), q + 2) : R.int(q + 1, q + 3);
      const F = stamm(terme);
      const b0 = R.wahl(c.b0);
      const best = (t) => B(b0).plus(wertB(F, t));
      const fn = (x) => wertZ(terme, x);
      const minB = Math.min(best(0).zahl(), best(q).zahl(), best(T).zahl());
      if (minB < 1) continue;
      if (terme.some((t) => t.c.n > 120)) continue;
      const ges = wertB(F, T);
      const rTex = termTex(terme, 't');
      const svg = bild(fn, 0, T + 1, { funktionen: [{ f: fn, name: 'f', von: 0, bis: T }], achsen: { x: 't', y: 'f(t)' }, gx: 1 });
      const intro = `Die Funktion ${$('f')} mit ${$(`f(t)=${rTex}`)} beschreibt für ${$(`0\\le t\\le ${T}`)} ${c.rate} (${$('t')} in ${c.t}, ${$('f(t)')} in ${c.rE}; positiv: ${c.plus}, negativ: ${c.minus}). Zu Beginn beträgt die ${c.best} ${b0} ${c.bE}.`;
      if (stufe === 2) {
        return {
          frage: `${intro}<br>Berechne die Änderung der ${c.best} in den ${T} ${c.t} und die ${c.best} nach ${T} ${c.t}. ${FRAGE_FE}`,
          bild: svg,
          notiz: true,
          felder: [naeh('Änderung', ges, { einheit: c.bE }), naeh(`${c.best} nach ${T} ${c.t}`, best(T), { einheit: c.bE })],
          hinweis: 'Bestand am Ende = Anfangsbestand + Integral der Änderungsrate. Achtung: Plus, nicht mal!',
          loesung: [
            `Stammfunktion: ${$(`F(t)=${termTex(F, 't')}`)}`,
            `Änderung: ${$(`\\int_0^{${T}} f(t)\\,dt=F(${T})-F(0)=${erg(ges)}`)} ${c.bE}`,
            `${c.best} nach ${T} ${c.t}: ${$(`${b0}+\\int_0^{${T}} f(t)\\,dt=${b0}${ges.vz() < 0 ? '' : '+'}${zt(ges)}=${erg(best(T))}`)} ${c.bE}`,
            GG(`${b0} + Integral(${ggTerm(terme)}, 0, ${T})`),
          ],
          pruef: [{ art: 'integral', f: cas(terme), a: 0, b: T, wert: ges.zahl() }],
        };
      }
      // Stufe 3: größte Rate und größter Bestand
      const kand = [{ t: 0, b: best(0) }, { t: p, b: best(p) }, { t: T, b: best(T) }];
      const max = kand.reduce((m, x) => (x.b.vgl(m.b) > 0 ? x : m));
      if (kand.some((x) => x !== max && Math.abs(x.b.zahl() - max.b.zahl()) < 1)) continue;
      const s = p + q;
      const t1 = (s - Math.sqrt(s * s - 3 * p * q)) / 3;
      const rateMaxInnen = fn(t1) > fn(T) + 0.3;
      const felder = [];
      if (rateMaxInnen) felder.push({ art: 'naeherung', label: 'a) größte Rate zum Zeitpunkt', wert: t1, stellen: 2, einheit: c.t });
      felder.push(zahl(`${rateMaxInnen ? 'b' : 'a'}) ${c.best} am größten nach`, B(max.t), { einheit: c.t }), naeh(`${rateMaxInnen ? 'c' : 'b'}) größte ${c.best}`, max.b, { einheit: c.bE }));
      return {
        frage: `${intro}<br>${rateMaxInnen ? `a) Zu welchem Zeitpunkt ist die Zuflussrate am größten (auf zwei Nachkommastellen)? b) ` : 'a) '}Zu welchem Zeitpunkt ist die ${c.best} am größten? ${rateMaxInnen ? 'c)' : 'b)'} Wie groß ist sie dann?`,
        bild: svg,
        notiz: true,
        felder,
        hinweis: `Größte Rate: Extremstelle von ${$('f')} (${$("f'(t)=0")}). Größter Bestand: Dort, wo ${$('f')} von + nach − wechselt, oder am Rand – Werte vergleichen!`,
        loesung: [
          rateMaxInnen ? `a) ${$(`f'(t)=${termTex(abl(terme), 't')}=0`)} ⇒ ${$(`t\\approx ${klar(t1).replace(',', '{,}')}`)} (die andere Lösung liefert ein Minimum); Randwerte sind kleiner. Die Zuflussrate ist nach etwa ${klar(Math.round(t1 * 100) / 100)} ${c.t} am größten – <b>der Bestand ist dort aber noch nicht am größten</b>.` : null,
          `Nullstellen von ${$('f')}: ${$(`f(t)=${faktorTex(k, [0, p, q], 't')}`)} ⇒ ${$(`t=0;\\ t=${p};\\ t=${q}`)}. Bis ${$(`t=${p}`)} ist ${$('f>0')} (Bestand steigt), zwischen ${p} und ${q} ist ${$('f<0')} (Bestand sinkt), danach steigt er wieder.`,
          `Kandidaten: ${kand.map((x) => $(`B(${x.t})=${b0}+F(${x.t})=${erg(x.b)}`)).join(';  ')} (mit ${$(`F(t)=${termTex(F, 't')}`)}).`,
          `Die ${c.best} ist nach ${max.t} ${c.t} am größten: ${$(erg(max.b))} ${c.bE}.`,
          GG(`Löse(Ableitung(${ggTerm(terme)}) = 0)`),
        ].filter(Boolean),
      };
    }
  };

  // =====================================================================
  // K9 Graph einer Stammfunktion
  // =====================================================================
  gen['ir-graph-F'] = (stufe) => {
    for (;;) {
      const quad = stufe < 3;
      const k = quad ? R.wahl([B(1), B(-1), B(1, 2), B(-1, 2)]) : R.wahl([B(1, 2), B(-1, 2), B(1, 3), B(-1, 3)]);
      let r;
      if (quad) { const r1 = R.int(-3, 1); r = [r1, r1 + R.int(2, 4)]; }
      else r = R.mische([-3, -2, -1, 0, 1, 2, 3]).slice(0, 3).sort((x, y) => x - y);
      const terme = polyTerme(polyAusNullstellen(k, r));
      const fn = (x) => wertZ(terme, x);
      const xmin = r[0] - 1.5;
      const xmax = r[r.length - 1] + 1.5;
      if (xmax - xmin > 9) continue;
      const svgF = bild(fn, xmin, xmax, { funktionen: [{ f: fn, name: 'f' }] });
      // Vorzeichenwechsel
      const wechsel = r.map((x) => ({ x, vorher: Math.sign(fn(x - 0.01)), nachher: Math.sign(fn(x + 0.01)) }));
      const hoch = wechsel.filter((w) => w.vorher > 0 && w.nachher < 0).map((w) => w.x);
      const tief = wechsel.filter((w) => w.vorher < 0 && w.nachher > 0).map((w) => w.x);
      if (stufe === 1) {
        return {
          frage: `Die Abbildung zeigt den Graphen einer Funktion ${$('f')}. ${$('F')} ist eine Stammfunktion von ${$('f')}. An welchen Stellen hat ${$('F')} einen Hochpunkt bzw. einen Tiefpunkt?`,
          bild: svgF,
          felder: [zahl('Hochpunkt bei $x=$', B(hoch[0])), zahl('Tiefpunkt bei $x=$', B(tief[0]))],
          hinweis: `Es gilt ${$("F'(x)=f(x)")}. Wo ${$('f')} das Vorzeichen wechselt, hat ${$('F')} eine Extremstelle: von + nach − ⇒ Hochpunkt, von − nach + ⇒ Tiefpunkt.`,
          loesung: [
            `Da ${$("F'=f")}, ist ${$('F')} dort steigend, wo der Graph von ${$('f')} oberhalb der x-Achse liegt, und fallend, wo er unterhalb liegt.`,
            `Bei ${$(`x=${hoch[0]}`)} wechselt ${$('f')} von + nach − ⇒ Hochpunkt von ${$('F')}. Bei ${$(`x=${tief[0]}`)} wechselt ${$('f')} von − nach + ⇒ Tiefpunkt von ${$('F')}.`,
          ],
        };
      }
      const F = stamm(terme);
      const c0 = -wertZ(F, (r[0] + r[r.length - 1]) / 2);
      const Fn = (x) => wertZ(F, x) + c0;
      if (stufe === 2) {
        const kandidaten = [
          { f: Fn, ok: true },
          { f: (x) => -Fn(x), ok: false },
          { f: (x) => Fn(x - 1), ok: false },
          { f: (x) => Fn(x + 1), ok: false },
        ];
        const b = bereich((x) => Math.max(...kandidaten.map((q) => Math.abs(q.f(x)))), xmin, xmax);
        const ym = Math.max(b.ymax, 2);
        const svgs = R.mische(kandidaten).map((q) => ({ ok: q.ok, svg: graphSvg({ xmin, xmax, ymin: -ym, ymax: ym, breite: 200, hoehe: 140, klein: true, gx: 1, gy: b.gy, funktionen: [{ f: q.f, klasse: 'ks-graph2' }] }) }));
        const opt = svgs.map((q, i) => `<span class="leise">Graph ${'ABCD'[i]}</span>${q.svg}`);
        return {
          frage: `Die große Abbildung zeigt den Graphen von ${$('f')}. Welcher der Graphen A bis D gehört zu einer Stammfunktion ${$('F')} von ${$('f')}? (Die kleinen Bilder haben dieselbe x-Einteilung.)`,
          bild: svgF,
          felder: [{ art: 'auswahl', label: 'Graph von F', optionen: opt, richtig: svgs.findIndex((q) => q.ok) }],
          hinweis: `Prüfe: Wo ${$('f')} positiv ist, muss ${$('F')} steigen; wo ${$('f')} negativ ist, muss ${$('F')} fallen. Die Extremstellen von ${$('F')} liegen bei den Nullstellen von ${$('f')}.`,
          loesung: [
            `${$('f')} hat Nullstellen bei ${$(`x=${r[0]}`)} und ${$(`x=${r[1]}`)}. Also hat ${$('F')} genau dort Extremstellen: Hochpunkt bei ${$(`x=${hoch[0]}`)}, Tiefpunkt bei ${$(`x=${tief[0]}`)}.`,
            `Richtig ist Graph ${'ABCD'[svgs.findIndex((q) => q.ok)]}. Die anderen Graphen haben die Extremstellen an falschen Stellen oder Hoch- und Tiefpunkt vertauscht.`,
            `Der Scheitel von ${$('f')} bei ${$(`x=${zt(B(r[0] + r[1], 2))}`)} ist eine Wendestelle von ${$('F')} (dort ist die Steigung von ${$('F')} extremal).`,
          ],
        };
      }
      // Stufe 3: kubisches f – Hochstellen und Monotonie von F
      const lo = r[0];
      const hi = r[2];
      const intervalle = [`[${r[0]};\\,${r[1]}]`, `[${r[1]};\\,${r[2]}]`, `]-\\infty;\\,${r[0]}]`, `[${r[2]};\\,\\infty[`];
      const fallend = [];
      const tests = [(r[0] + r[1]) / 2, (r[1] + r[2]) / 2, r[0] - 1, r[2] + 1];
      tests.forEach((x, i) => { if (fn(x) < 0) fallend.push(i); });
      const frageFallend = R.wahl(fallend);
      const opt = intervalle.map((t) => $(t));
      const auswahlB = R.mische(opt.filter((_, j) => j === frageFallend || !fallend.includes(j)));
      return {
        frage: `Die Abbildung zeigt den Graphen von ${$('f')}. ${$('F')} ist eine Stammfunktion von ${$('f')}.<br>a) An welchen Stellen hat ${$('F')} Hochpunkte? (getrennt durch Semikolon)<br>b) In welchem der Intervalle ist ${$('F')} streng monoton fallend?`,
        bild: svgF,
        felder: [{ art: 'menge', label: 'a) Hochpunkte bei', antwort: hoch.map((x) => B(x)) }, { art: 'auswahl', label: 'b)', optionen: auswahlB, richtig: auswahlB.indexOf(opt[frageFallend]) }],
        hinweis: `${$("F'=f")}: ${$('F')} fällt, wo ${$('f')} negativ ist. Hochpunkte von ${$('F')}: Vorzeichenwechsel von ${$('f')} von + nach −.`,
        loesung: [
          `Nullstellen von ${$('f')}: ${$(`${r.join(';\\ ')}`)}. Vorzeichen von ${$('f')}: ${tests.map((x, i) => `${$(intervalle[i])}: ${fn(x) > 0 ? '+' : '−'}`).join(', ')}.`,
          `a) Hochpunkte von ${$('F')} bei ${$(hoch.join(';\\ ') || '–')} (Wechsel von + nach −)${tief.length ? `, Tiefpunkte bei ${$(tief.join(';\\ '))}` : ''}.`,
          `b) ${$('F')} ist streng monoton fallend auf ${fallend.map((i) => $(intervalle[i])).join(' und ')}.`,
          `Hier im Bereich ${$(`[${lo};\\,${hi}]`)} sind die Extremstellen von ${$('f')} Wendestellen von ${$('F')}.`,
        ],
      };
    }
  };

  // =====================================================================
  // K10 Fehler finden
  // =====================================================================
  const FEHLER = {
    abgeleitet: 'Statt einer Stammfunktion wurde die Ableitung gebildet.',
    faktor: 'Beim Aufleiten fehlt der Faktor 1/(n+1).',
    minus: 'F(a) wurde falsch abgezogen bzw. ein Vorzeichen beim Einsetzen ist falsch.',
    flaeche: 'Über eine Nullstelle hinweg integriert – Flächen unterhalb der x-Achse wurden abgezogen statt addiert.',
    bestand: 'Der Anfangsbestand wurde nicht addiert.',
    rate: 'Der Funktionswert der Änderungsrate wurde als Bestand gedeutet.',
    mal: 'Anfangsbestand und Integral wurden multipliziert statt addiert.',
    grenzen: 'Die Grenzen wurden vertauscht eingesetzt (F(a) − F(b) statt F(b) − F(a)).',
  };
  gen['ir-fehler'] = (stufe) => {
    const typ = R.wahl(stufe === 1 ? ['abgeleitet', 'faktor', 'grenzen'] : stufe === 2 ? ['minus', 'faktor', 'flaeche', 'grenzen'] : ['bestand', 'mal', 'rate', 'flaeche']);
    let zeilen;
    let richtig;
    let loes;
    let gezeigt;
    let frage = 'Hier hat jemand eine Aufgabe gelöst – aber es steckt ein Fehler darin. Finde den Fehler und gib das richtige Ergebnis an.';
    if (['abgeleitet', 'faktor', 'grenzen', 'minus'].includes(typ)) {
      let terme;
      let a;
      let b;
      for (;;) {
        if (typ === 'minus') { terme = ordne([S(R.wahl([1, 2, 3, -1]), 3), S(R.nz(-3, 3), 1)]); a = R.int(-3, -1); b = R.int(1, 2); }
        else { terme = [S(R.wahl([1, 2, 3, 4, 6]), R.int(2, 3))]; a = R.int(0, 1); b = a + R.int(1, 2); }
        const w = integral(terme, a, b);
        if (w.z !== 0) break;
      }
      const F = stamm(terme);
      richtig = integral(terme, a, b);
      const fTex = termTex(terme);
      let Ff = F;
      if (typ === 'abgeleitet') Ff = abl(terme);
      if (typ === 'faktor') Ff = terme.map((t) => S(t.c, t.e.plus(1)));
      const Fb = wertB(Ff, b);
      const Fa = wertB(Ff, a);
      let schluss;
      if (typ === 'grenzen') { gezeigt = Fa.minus(Fb); schluss = `=${zt(Fa)}-${kl(Fb)}=${zt(gezeigt)}`; }
      else if (typ === 'minus') { gezeigt = Fb.plus(Fa); schluss = `=\\left(${einsetzTex(F, b)}\\right)-\\left(${einsetzTex(F, a)}\\right)=${zt(Fb)}-${kl(Fa.neg())}=${zt(gezeigt)}`; }
      else { gezeigt = Fb.minus(Fa); schluss = `=${zt(Fb)}-${kl(Fa)}=${zt(gezeigt)}`; }
      zeilen = [`\\int_{${a}}^{${b}} ${fTex}\\,dx=\\left[${termTex(Ff)}\\right]_{${a}}^{${b}}`, schluss];
      if (gezeigt.gleich(richtig)) return gen['ir-fehler'](stufe);
      loes = [`Richtig: ${$(`\\int_{${a}}^{${b}} ${fTex}\\,dx=\\left[${termTex(F)}\\right]_{${a}}^{${b}}=${zt(wertB(F, b))}-${kl(wertB(F, a))}=${erg(richtig)}`)}`];
    } else if (typ === 'flaeche') {
      const r1 = R.int(-2, 0);
      const r = [r1, r1 + R.int(2, 3)];
      const k = R.wahl([B(1), B(-1)]);
      const terme = polyTerme(polyAusNullstellen(k, r));
      const a = r[0];
      const b = r[1] + R.int(1, 2);
      const falsch = integral(terme, a, b);
      const fl = flaechenRechnung(terme, [B(a), B(r[1]), B(b)]);
      richtig = fl.A;
      if (falsch.abs().gleich(richtig)) return gen['ir-fehler'](stufe);
      gezeigt = falsch.abs();
      frage = `Aufgabe: Berechne den Inhalt der Fläche zwischen dem Graphen von ${$(`f(x)=${termTex(terme)}`)} und der x-Achse über dem Intervall ${$(`[${a};\\,${b}]`)}. ${frage}`;
      zeilen = [`A=\\int_{${a}}^{${b}} \\left(${termTex(terme)}\\right)dx=\\left[${termTex(stamm(terme))}\\right]_{${a}}^{${b}}=${erg(falsch)}`, `A=${zt(falsch.abs())}\\ \\text{FE}`];
      loes = [`${$('f')} hat bei ${$(`x=${r[1]}`)} eine Nullstelle im Intervall. Richtig:`, ...fl.zeilen, `${$(fl.summeZ)} FE`];
    } else {
      // Sachaufgaben
      const T = R.int(4, 8);
      const k = R.wahl([B(1, 2), B(1), B(3, 2)]);
      const terme = ordne([S(k, 1), S(R.int(1, 3), 0)]);
      const b0 = R.wahl([10, 20, 25, 40]);
      const w = integral(terme, 0, T);
      const fTex = termTex(terme, 't');
      frage = `Aufgabe: Die Zuflussrate in einen Tank wird durch ${$(`f(t)=${fTex}`)} beschrieben (${$('t')} in min, ${$('f(t)')} in Litern pro Minute). Zu Beginn sind ${b0} l im Tank. Wie viel Wasser ist nach ${T} Minuten im Tank? ${frage}`;
      richtig = B(b0).plus(w);
      gezeigt = typ === 'bestand' ? w : typ === 'mal' ? w.mal(b0) : B(b0).plus(wertB(terme, T));
      if (gezeigt.gleich(richtig)) return gen['ir-fehler'](stufe);
      if (typ === 'bestand') zeilen = [`\\int_0^{${T}} f(t)\\,dt=\\left[${termTex(stamm(terme), 't')}\\right]_0^{${T}}=${zt(w)}`, `\\text{Nach ${T} min sind ${klar(w.zahl())} l im Tank.}`];
      else if (typ === 'mal') zeilen = [`B(${T})=${b0}\\cdot\\int_0^{${T}} f(t)\\,dt=${b0}\\cdot ${zt(w)}=${zt(w.mal(b0))}`, `\\text{Nach ${T} min sind ${klar(w.mal(b0).zahl())} l im Tank.}`];
      else zeilen = [`f(${T})=${einsetzTex(terme, T)}=${zt(wertB(terme, T))}`, `\\text{Nach ${T} min sind ${klar(B(b0).plus(wertB(terme, T)).zahl())} l im Tank.}`];
      loes = [`Richtig: ${$(`B(${T})=${b0}+\\int_0^{${T}} f(t)\\,dt=${b0}+\\left[${termTex(stamm(terme), 't')}\\right]_0^{${T}}=${b0}+${zt(w)}=${zt(richtig)}`)} l`];
    }
    const andere = R.mische(Object.keys(FEHLER).filter((x) => x !== typ)).slice(0, 3);
    const opt = R.mische([typ, ...andere]).map((x) => FEHLER[x]);
    return {
      frage,
      bild: `<div class="rechnung">${zeilen.map((z) => `<p>${$(z)}</p>`).join('')}</div>`,
      felder: [{ art: 'auswahl', label: 'Fehler', optionen: opt, richtig: opt.indexOf(FEHLER[typ]) }, naeh('richtiges Ergebnis', richtig)],
      hinweis: 'Gehe Zeile für Zeile vor: Stimmt die Stammfunktion (Probe durch Ableiten)? Werden die Grenzen richtig eingesetzt (oben minus unten)? Passt die Deutung im Sachzusammenhang?',
      loesung: [`Fehler: ${FEHLER[typ]}`, ...loes],
      pruef: [{ art: 'fehler', gezeigt: gezeigt.zahl(), richtig: richtig.zahl() }],
    };
  };

  // =====================================================================
  // Wiederholung: Umkehrfunktion (Wurzelfunktion)
  // =====================================================================
  gen['uf-umkehr'] = (stufe) => {
    const a = R.wahl(stufe === 1 ? [1, 2, 3] : [1, 2, 3, -1, -2]);
    const bb = R.int(-3, 3);
    const c = R.int(-3, 3);
    const fTex = `${a === 1 ? '' : a === -1 ? '-' : a}\\sqrt{x${bb === 0 ? '' : bb > 0 ? `-${bb}` : `+${-bb}`}}${c === 0 ? '' : c > 0 ? `+${c}` : c}`;
    const fn = (x) => a * Math.sqrt(x - bb) + c;
    const W = a > 0 ? `[${c};\\,\\infty[` : `]-\\infty;\\,${c}]`;
    const D = `[${bb};\\,\\infty[`;
    if (stufe === 1) {
      const q = R.int(1, 3);
      const x0 = bb + q * q;
      const y0 = a * q + c;
      return {
        frage: `Gegeben ist ${$(`f(x)=${fTex}`)} mit ${$(`D_f=${D}`)}. ${$('f')} ist umkehrbar. Berechne ${$(`f(${x0})`)} und gib den zugehörigen Punkt auf dem Graphen der Umkehrfunktion ${$('\\bar f')} an.`,
        felder: [zahl(`$f(${x0})=$`, B(y0)), zahl('Punkt auf $\\bar f$: $x=$', B(y0)), zahl('$y=$', B(x0))],
        hinweis: 'Der Graph der Umkehrfunktion entsteht durch Spiegeln an der Winkelhalbierenden y = x: Die Koordinaten werden vertauscht.',
        loesung: [`${$(`f(${x0})=${a === 1 ? '' : a === -1 ? '-' : `${a}\\cdot `}\\sqrt{${x0 - bb}}${c === 0 ? '' : c > 0 ? `+${c}` : c}=${y0}`)}, also liegt ${$(`P(${x0}\\,|\\,${y0})`)} auf dem Graphen von ${$('f')}.`, `Koordinaten tauschen: ${$(`\\bar P(${y0}\\,|\\,${x0})`)} liegt auf dem Graphen von ${$('\\bar f')}.`],
      };
    }
    const Dbar = W;
    const Wbar = D;
    if (stufe === 2) {
      const richtig = `$D_{\\bar f}=${Dbar},\\ W_{\\bar f}=${Wbar}$`;
      const falsch = [`$D_{\\bar f}=${D},\\ W_{\\bar f}=${W}$`, `$D_{\\bar f}=[${-c};\\,\\infty[,\\ W_{\\bar f}=[${-bb};\\,\\infty[$`, `$D_{\\bar f}=${a > 0 ? `]-\\infty;\\,${c}]` : `[${c};\\,\\infty[`},\\ W_{\\bar f}=${Wbar}$`];
      const opt = R.mische([...new Set([richtig, ...falsch])]);
      return {
        frage: `Gegeben ist ${$(`f(x)=${fTex}`)}. Beschreibe, wie der Graph aus dem von ${$('\\sqrt{x}')} entsteht, und gib Definitions- und Wertebereich von ${$('f')} und der Umkehrfunktion ${$('\\bar f')} an.`,
        bild: graphSvg({ xmin: Math.min(-1, bb - 1), xmax: bb + 9, ymin: Math.min(-1, c - (a < 0 ? 7 : 1)), ymax: Math.max(1, c + (a > 0 ? 7 : 1)), breite: 360, hoehe: 260, funktionen: [{ f: fn, name: 'f', von: bb }], sx: 2, sy: 2 }),
        felder: [{ art: 'auswahl', label: 'Umkehrfunktion', optionen: opt, richtig: opt.indexOf(richtig) }],
        hinweis: 'Für die Umkehrfunktion gilt: D von f̄ = W von f und W von f̄ = D von f.',
        loesung: [
          `Der Graph von ${$('\\sqrt{x}')} wird um ${Math.abs(bb)} nach ${bb >= 0 ? 'rechts' : 'links'} verschoben${Math.abs(a) !== 1 ? `, mit dem Faktor ${Math.abs(a)} in y-Richtung gestreckt` : ''}${a < 0 ? ', an der x-Achse gespiegelt' : ''} und um ${Math.abs(c)} nach ${c >= 0 ? 'oben' : 'unten'} verschoben.`,
          `${$(`D_f=${D}`)}, ${$(`W_f=${W}`)}.`,
          `Umkehrfunktion: Bereiche tauschen: ${$(`D_{\\bar f}=${Dbar}`)}, ${$(`W_{\\bar f}=${Wbar}`)}.`,
        ],
      };
    }
    // Stufe 3: Gleichung der Umkehrfunktion
    const sollTerme = `((x-(${c}))/(${a}))^2+(${bb})`;
    const ys = [0.4, 1.1, 1.7, 2.3, 3.6, 5.2].map((t) => c + Math.sign(a) * t);
    const loesTex = `${a === 1 ? `(x${c === 0 ? '' : c > 0 ? `-${c}` : `+${-c}`})^2` : `\\left(\\frac{x${c === 0 ? '' : c > 0 ? `-${c}` : `+${-c}`}}{${a}}\\right)^2`}${bb === 0 ? '' : bb > 0 ? `+${bb}` : bb}`;
    return {
      frage: `Gegeben ist ${$(`f(x)=${fTex}`)} mit ${$(`D_f=${D}`)}. Bestimme die Gleichung der Umkehrfunktion ${$('\\bar f')}.`,
      felder: [{ art: 'term', label: '$\\bar f(x)=$', modus: 'gleich', soll: sollTerme, loesung: `((x-(${c}))/(${a}))^2+(${bb})`.replace('-(0)', '').replace('+(0)', ''), stellen: ys }, { art: 'auswahl', label: 'Definitionsbereich der Umkehrfunktion', optionen: [...new Set([`$${Dbar}$`, `$${D}$`, '$\\mathbb{R}$', `$${a > 0 ? `]-\\infty;\\,${c}]` : `[${c};\\,\\infty[`}$`])], richtig: 0 }].map((f) => {
        if (f.art !== 'auswahl') return f;
        const o = R.mische(f.optionen);
        return Object.assign(f, { optionen: o, richtig: o.indexOf(`$${Dbar}$`) });
      }),
      hinweis: 'Setze y = f(x) und löse nach x auf. Vertausche dann x und y. Der Definitionsbereich von f̄ ist der Wertebereich von f.',
      loesung: [
        `${$(`y=${fTex}`)} ⇔ ${$(`y${c === 0 ? '' : c > 0 ? `-${c}` : `+${-c}`}=${a === 1 ? '' : a === -1 ? '-' : a}\\sqrt{x${bb === 0 ? '' : bb > 0 ? `-${bb}` : `+${-bb}`}}`)}${a !== 1 ? ` ⇔ ${$(`\\frac{y${c === 0 ? '' : c > 0 ? `-${c}` : `+${-c}`}}{${a}}=\\sqrt{x${bb === 0 ? '' : bb > 0 ? `-${bb}` : `+${-bb}`}}`)}` : ''}`,
        `Quadrieren und nach ${$('x')} auflösen: ${$(`x=${loesTex.replace(/x/g, 'y')}`)}`,
        `Variablen tauschen: ${$(`\\bar f(x)=${loesTex}`)} mit ${$(`D_{\\bar f}=W_f=${Dbar}`)}.`,
      ],
    };
  };

  // =====================================================================
  // Wiederholung: Potenzfunktionen ableiten
  // =====================================================================
  gen['pf-ableiten'] = (stufe) => {
    const STELLEN = [0.4, 0.9, 1.6, 2.3, 3.1, 4.4];
    let terme;
    if (stufe === 1) terme = R.wahl([() => [S(R.wahl([2, 3, 4, 5, -2, -4, 6]), -1), S(R.int(-5, 6), 0)], () => [S(R.wahl([1, 2, 3, -2, 4]), B(1, 2)), S(R.int(-5, 6), 0)], () => [S(R.wahl([2, 3, -1, 6]), -2), S(R.nz(-3, 3), 1)]])();
    else if (stufe === 2) terme = R.wahl([() => [S(R.wahl([2, 4, 8, -2]), -1), S(R.int(1, 6), 0)], () => [S(R.wahl([2, 4, -2]), B(1, 2)), S(R.int(-3, 5), 0)], () => [S(R.wahl([4, 8, -2]), -2)]])();
    else terme = R.wahl([() => [S(R.wahl([1, 3, 6]), B(2, 3))], () => [S(R.wahl([2, 3, 4, -2]), B(-1, 2))], () => [S(R.wahl([1, 2, 6]), B(3, 2))], () => [S(R.wahl([1, 4, 5]), B(3, 4)), S(R.int(-3, 3), 0)]])();
    terme = ordne(terme);
    const fs = abl(terme);
    const fTex = termTex(terme);
    if (stufe === 2) {
      const x0 = R.wahl([1, 4]);
      const m = wertB(fs, x0);
      const winkel = (Math.atan(m.zahl()) * 180) / Math.PI;
      return {
        frage: `Gegeben ist ${$(`f(x)=${fTex}`)} für ${$('x>0')}. Bestimme ${$("f'(x)")}, die Steigung des Graphen an der Stelle ${$(`x_0=${x0}`)} und die Größe des Steigungswinkels ${$('\\alpha')} der Tangente dort (in Grad, eine Nachkommastelle).`,
        felder: [{ art: 'term', label: "$f'(x)=$", modus: 'gleich', soll: cas(fs), loesung: eingabeText(fs), stellen: STELLEN }, naeh(`$f'(${x0})=$`, m), { art: 'naeherung', label: '$\\alpha\\approx$', wert: winkel, stellen: 1, einheit: '°' }],
        hinweis: `Potenzregel auch für negative und gebrochene Exponenten: ${$("(x^r)'=r\\cdot x^{r-1}")}. Schreibe dazu ${$('\\frac{1}{x}=x^{-1}')} bzw. ${$('\\sqrt{x}=x^{\\frac{1}{2}}')}. Winkel: ${$('\\tan\\alpha=m')}.`,
        loesung: [
          `${$(`f(x)=${termTex(terme, 'x', 'potenz')}`)} ⇒ ${$(`f'(x)=${termTex(fs, 'x', 'potenz')}=${termTex(fs)}`)}`,
          `${$(`f'(${x0})=${erg(m)}`)}`,
          `${$(`\\alpha=\\tan^{-1}(${zt(m)})\\approx ${klar(Math.round(winkel * 10) / 10).replace(',', '{,}')}^\\circ`)}`,
        ],
      };
    }
    return {
      frage: `Bestimme die Ableitung von ${$('f')} (für ${$('x>0')}). ${stufe === 3 ? 'Schreibe dazu zuerst als Potenz mit rationalem Exponenten.' : ''}`,
      term: `f(x)=${fTex}`,
      felder: [{ art: 'term', label: "$f'(x)=$", modus: 'gleich', soll: cas(fs), loesung: eingabeText(fs), stellen: STELLEN }],
      hinweis: `Potenzregel: ${$("(x^r)'=r\\cdot x^{r-1}")} – auch für negative und gebrochene ${$('r')}. ${$('\\frac{1}{x^n}=x^{-n}')}, ${$('\\sqrt[n]{x^m}=x^{\\frac{m}{n}}')}.`,
      loesung: [
        `${$(`f(x)=${termTex(terme, 'x', 'potenz')}`)}`,
        `${$(`f'(x)=${termTex(fs, 'x', 'potenz')}=${termTex(fs)}`)}`,
        GG(`Ableitung(${ggTerm(terme)})`),
      ],
    };
  };

  UM.integral = { S, ordne, stamm, abl, wertB, wertZ, cas, termTex, eingabeText, polyAusNullstellen, polyTerme, integral, graphSvg };
})(typeof window !== 'undefined' ? window : globalThis);
