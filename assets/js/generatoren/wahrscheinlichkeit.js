/*
 * Aufgaben-Generatoren: Bedingte Wahrscheinlichkeit und stochastische Unabhängigkeit (Klasse 10)
 *
 * Format der Aufgaben: siehe generatoren/rationale-zahlen.js. Zusätzlich:
 *   { art:'naeherung', label, wert:Zahl, stellen, prozent, exakt:Bruch }   gerundete Eingabe (auch in %)
 * Vierfeldertafeln werden als HTML-Tabelle, Baumdiagramme als SVG gezeichnet.
 *
 * Die Aufgaben orientieren sich an Notizbuch und Kompetenzcheckliste,
 * nicht an den Aufgaben der Klassenarbeit.
 */
(function (global) {
  'use strict';
  const UM = (global.UM = global.UM || {});
  const { Bruch } = UM;
  const R = UM.zufall;
  const gen = (UM.generatoren = UM.generatoren || {});

  const B = (z, n = 1) => new Bruch(z, n);
  const $ = (t) => `$${t}$`;
  const dz = (b) => b.tex('dezimal');
  const EINS = B(1);
  /** Feldbeschriftung „$…=$“ */
  const lab = (t) => `$${t}=$`;

  // ---------- Sachzusammenhänge ----------
  // ja/nein: Satzende nach „…, dass eine zufällig ausgewählte Person“ bzw. „…, die“
  const KONTEXTE = [
    { wo: 'In einer Umfrage unter Jugendlichen wurde erfasst, wer im Verein Sport treibt und wer ein Instrument spielt.',
      A: { s: 'S', ja: 'im Verein Sport treibt', nein: 'nicht im Verein Sport treibt', def: 'Die Person treibt im Verein Sport.' },
      B: { s: 'I', ja: 'ein Instrument spielt', nein: 'kein Instrument spielt', def: 'Die Person spielt ein Instrument.' } },
    { wo: 'An einer Schule wurde erfasst, wer mit dem Fahrrad zur Schule kommt und wer mittags in der Mensa isst.',
      A: { s: 'F', ja: 'mit dem Fahrrad zur Schule kommt', nein: 'nicht mit dem Fahrrad zur Schule kommt', def: 'Die Person kommt mit dem Fahrrad zur Schule.' },
      B: { s: 'M', ja: 'in der Mensa isst', nein: 'nicht in der Mensa isst', def: 'Die Person isst in der Mensa.' } },
    { wo: 'In einer Umfrage wurde erfasst, wer ein Haustier hat und wer auf dem Land wohnt.',
      A: { s: 'H', ja: 'ein Haustier hat', nein: 'kein Haustier hat', def: 'Die Person hat ein Haustier.' },
      B: { s: 'L', ja: 'auf dem Land wohnt', nein: 'in der Stadt wohnt', def: 'Die Person wohnt auf dem Land.' } },
    { wo: 'In einer Jahrgangsstufe wurde erfasst, wer eine Brille trägt und wer Mathe als Lieblingsfach hat.',
      A: { s: 'B', ja: 'eine Brille trägt', nein: 'keine Brille trägt', def: 'Die Person trägt eine Brille.' },
      B: { s: 'M', ja: 'Mathe als Lieblingsfach hat', nein: 'Mathe nicht als Lieblingsfach hat', def: 'Die Person hat Mathe als Lieblingsfach.' } },
    { wo: 'In einem Sportverein wurde erfasst, wer schon einmal verletzt war und wer regelmäßig ein Aufwärmprogramm macht.',
      A: { s: 'W', ja: 'regelmäßig ein Aufwärmprogramm macht', nein: 'kein Aufwärmprogramm macht', def: 'Die Person macht regelmäßig ein Aufwärmprogramm.' },
      B: { s: 'V', ja: 'schon einmal verletzt war', nein: 'noch nie verletzt war', def: 'Die Person war schon einmal verletzt.' } },
  ];

  /** Ereignis-Literal: { e: Ereignis aus Kontext, neg } */
  const lit = (e, neg = false) => ({ e, neg });
  const ltex = (l) => (l.neg ? `\\overline{${l.e.s}}` : l.e.s);
  const lsatz = (l) => (l.neg ? l.e.nein : l.e.ja);
  const legende = (k) => `${$(k.A.s)}: ${k.A.def} ${$(k.B.s)}: ${k.B.def}`;
  const P = (l) => `P(${ltex(l)})`;
  const PS = (x, y) => `P(${ltex(x)}\\cap ${ltex(y)})`;
  const PB = (bed, l) => `P_{${ltex(bed)}}(${ltex(l)})`;

  /** Satz zu P(…) */
  const satz = {
    einfach: (l) => `Wahrscheinlichkeit, dass eine zufällig ausgewählte Person ${lsatz(l)}`,
    schnitt: (x, y) => `Wahrscheinlichkeit, dass eine zufällig ausgewählte Person ${lsatz(x)} und ${lsatz(y)}`,
    bedingt: (bed, l) => `Wahrscheinlichkeit, dass eine zufällig ausgewählte Person, die ${lsatz(bed)}, ${lsatz(l)}`,
  };

  // ---------- Vierfeldertafel ----------
  // m[i][j]: i = 0 (A), 1 (nicht A), 2 (Summe); j = 0 (B), 1 (nicht B), 2 (Summe). Werte: Bruch
  function tafel(a11, a12, a21, a22) {
    const m = [[a11, a12], [a21, a22]];
    m[0][2] = a11.plus(a12);
    m[1][2] = a21.plus(a22);
    m[2] = [a11.plus(a21), a12.plus(a22), a11.plus(a12).plus(a21).plus(a22)];
    return m;
  }
  /** Literale zu Zeile/Spalte */
  const zeileLit = (k, i) => lit(k.A, i === 1);
  const spalteLit = (k, j) => lit(k.B, j === 1);

  /**
   * HTML-Tabelle. anzeige[i][j]: Bruch (zeigen) | string (z. B. "(a)") | null (leer)
   * stil 'anzahl' oder 'wkeit'
   */
  function tafelHtml(k, anzeige) {
    const zelle = (v) => (v == null ? '' : typeof v === 'string' ? `<b class="frage-zelle">${v}</b>` : $(dz(v)));
    const kopf = ['', $(k.B.s), $(`\\overline{${k.B.s}}`), 'Summe'];
    const zeilen = [$(k.A.s), $(`\\overline{${k.A.s}}`), 'Summe'];
    return `<div class="tabelle-scroll"><table class="vft"><thead><tr>${kopf.map((t) => `<th>${t}</th>`).join('')}</tr></thead><tbody>${
      zeilen.map((z, i) => `<tr><th>${z}</th>${[0, 1, 2].map((j) => `<td>${zelle(anzeige[i][j])}</td>`).join('')}</tr>`).join('')
    }</tbody></table></div>`;
  }
  const voll = (m) => m.map((r) => r.slice());

  /** Zufällige Anzahlen-Tafel: Gesamtzahl N, alle Felder ≥ 5 % von N */
  function anzahlTafel() {
    const N = R.wahl([200, 250, 400, 500, 800, 1000]);
    const schritt = N >= 500 ? 10 : 5;
    for (;;) {
      const t = [R.int(1, 12), R.int(1, 12), R.int(1, 12), R.int(1, 12)];
      const s = t.reduce((x, y) => x + y, 0);
      // auf N skalieren, in Schritten
      const roh = t.map((x) => Math.round((x / s) * (N / schritt)) * schritt);
      roh[3] = N - roh[0] - roh[1] - roh[2];
      if (roh.every((x) => x >= N * 0.05)) return tafel(...roh.map((x) => B(x)));
    }
  }
  /** Wahrscheinlichkeits-Tafel mit zwei Nachkommastellen */
  function wkeitTafel() {
    for (;;) {
      const t = [R.int(5, 45), R.int(5, 45), R.int(5, 45)];
      const r = 100 - t[0] - t[1] - t[2];
      if (r >= 5) return tafel(B(t[0], 100), B(t[1], 100), B(t[2], 100), B(r, 100));
    }
  }
  /** Unabhängige Wahrscheinlichkeits-Tafel: P(A), P(B) mit einer Nachkommastelle */
  function unabhTafel() {
    const a = B(R.int(2, 8), 10);
    const b = B(R.int(1, 9), 10);
    return tafel(a.mal(b), a.mal(EINS.minus(b)), EINS.minus(a).mal(b), EINS.minus(a).mal(EINS.minus(b)));
  }
  /** Abhängige Tafel mit gleichen Randwerten wie eine unabhängige (Innenfelder verschoben) */
  function abhTafel() {
    for (;;) {
      const u = unabhTafel();
      const d = B(R.nz(-8, 8), 100);
      const t = tafel(u[0][0].plus(d), u[0][1].minus(d), u[1][0].minus(d), u[1][1].plus(d));
      if ([t[0][0], t[0][1], t[1][0], t[1][1]].every((x) => x.vgl(0) > 0)) return t;
    }
  }

  /** Lassen sich die verdeckten Felder über Zeilen- und Spaltensummen eindeutig bestimmen? */
  function loesbar(versteckt) {
    const offen = new Set(versteckt.map(([i, j]) => i * 3 + j));
    let weiter = true;
    while (weiter && offen.size) {
      weiter = false;
      const gruppen = [];
      for (let i = 0; i < 3; i++) gruppen.push([i * 3, i * 3 + 1, i * 3 + 2]);
      for (let j = 0; j < 3; j++) gruppen.push([j, 3 + j, 6 + j]);
      for (const g of gruppen) {
        const unbekannt = g.filter((x) => offen.has(x));
        if (unbekannt.length === 1) { offen.delete(unbekannt[0]); weiter = true; }
      }
    }
    return offen.size === 0;
  }
  const ALLE_ZELLEN = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (!(i === 2 && j === 2)) ALLE_ZELLEN.push([i, j]);
  const BUCHST = ['(a)', '(b)', '(c)', '(d)', '(e)', '(f)'];

  /** Bezeichnung einer Tafelzelle für Lösungstexte */
  function zellName(k, i, j, wkeit) {
    const z = i < 2 ? ltex(zeileLit(k, i)) : null;
    const s = j < 2 ? ltex(spalteLit(k, j)) : null;
    const inner = z && s ? `${z}\\cap ${s}` : z || s;
    return wkeit ? `P(${inner})` : `\\text{Anzahl }${inner}`;
  }

  // ---------- Baumdiagramm (SVG) ----------
  /**
   * baum({ erst, zweit, w1, w2a, w2b, pfad }) – erst/zweit: Ereignisse (Kontext-Ereignis),
   * w1 = Wkeit erster Ast (erst), w2a = Wkeit zweit unter erst, w2b = Wkeit zweit unter nicht erst.
   * Einträge: Bruch → Dezimalzahl, string → so (z. B. "(a)"), null → leer
   * pfad: optional [4] Einträge für Pfadwahrscheinlichkeiten
   */
  function baum({ erst, zweit, w1, w2a, w2b, w1g, w2ag, w2bg, pfad }) {
    const txt = (v) => (v == null ? '' : typeof v === 'string' ? v : dz(v).replace('{,}', ',').replace('-', '−'));
    const knoten = (x, y, s, neg) => {
      const breite = 9 * s.length;
      return `<circle cx="${x}" cy="${y}" r="15" class="bd-knoten"/><text x="${x}" y="${y + 6}" class="bd-name">${s}</text>${neg ? `<line x1="${x - breite / 2 - 1}" y1="${y - 11}" x2="${x + breite / 2 + 1}" y2="${y - 11}" class="bd-strich"/>` : ''}`;
    };
    const ast = (x1, y1, x2, y2, v, oben) => {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2 + (oben ? -10 : 20);
      const frage = typeof v === 'string';
      return `<line x1="${x1 + 15}" y1="${y1}" x2="${x2 - 15}" y2="${y2}" class="bd-ast"/><text x="${mx}" y="${my}" class="bd-wert${frage ? ' bd-frage' : ''}">${txt(v)}</text>`;
    };
    const X0 = 30, X1 = 220, X2 = 420;
    const Y = [55, 205];
    const Y2 = [20, 90, 170, 240];
    let s = `<svg viewBox="0 0 560 262" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Baumdiagramm">`;
    s += `<circle cx="${X0}" cy="130" r="5" class="bd-wurzel"/>`;
    s += ast(X0 - 10, 130, X1, Y[0], w1, true) + ast(X0 - 10, 130, X1, Y[1], w1g, false);
    s += ast(X1, Y[0], X2, Y2[0], w2a, true) + ast(X1, Y[0], X2, Y2[1], w2ag, false);
    s += ast(X1, Y[1], X2, Y2[2], w2b, true) + ast(X1, Y[1], X2, Y2[3], w2bg, false);
    s += knoten(X1, Y[0], erst.s, false) + knoten(X1, Y[1], erst.s, true);
    s += [0, 1, 2, 3].map((i) => knoten(X2, Y2[i], zweit.s, i % 2 === 1)).join('');
    if (pfad) s += pfad.map((p, i) => `<text x="${X2 + 30}" y="${Y2[i] + 6}" class="bd-pfad${typeof p === 'string' ? ' bd-frage' : ''}">${txt(p)}</text>`).join('');
    return s + '</svg>';
  }

  // ---------- Hilfen für Felder ----------
  const HINWEIS_RUNDEN = 'Gib das Ergebnis als Bruch, als Dezimalzahl (mindestens zwei Nachkommastellen) oder in Prozent an.';
  /** Feld für eine Wahrscheinlichkeit, die nicht glatt sein muss */
  const wFeld = (label, bruch) => ({ art: 'naeherung', label, wert: bruch.zahl(), stellen: 2, prozent: true, exakt: bruch });
  /** exaktes Feld (endliche Dezimalzahl) */
  const zFeld = (label, bruch) => ({ art: 'zahl', label, antwort: bruch });
  /** Ergebnis als „≈ 0,67 = 67 %“ */
  function ergebnisTex(b) {
    if (b.istEndlichDezimal() && b.n <= 10000) {
      const p = b.mal(100);
      return `${dz(b)} = ${p.istEndlichDezimal() ? dz(p) : ''}\\,\\%`;
    }
    const t = UM.naeherungText(b.zahl(), 4).replace('−', '-').replace(',', '{,}');
    return `${b.tex()}\\approx ${t}\\approx ${UM.naeherungText(b.zahl(), 2, true).replace(',', '{,}').replace(' %', '\\,\\%')}`;
  }

  // =====================================================================
  // K1 Vierfeldertafel und Baumdiagramm
  // =====================================================================

  gen['wk-vft-ergaenzen'] = (stufe) => {
    const k = R.wahl(KONTEXTE);
    const wkeit = stufe === 2;
    const m = wkeit ? wkeitTafel() : anzahlTafel();
    const anzahlVersteckt = stufe === 1 ? 3 : stufe === 2 ? 4 : 5;
    let versteckt;
    for (;;) {
      versteckt = R.mische(ALLE_ZELLEN).slice(0, anzahlVersteckt);
      if (stufe === 3 && !versteckt.some(([i, j]) => i < 2 && j < 2)) continue;
      if (loesbar(versteckt)) break;
    }
    versteckt.sort((a, b) => a[0] * 3 + a[1] - (b[0] * 3 + b[1]));
    const anzeige = voll(m);
    versteckt.forEach(([i, j], n) => { anzeige[i][j] = BUCHST[n]; });
    const felder = versteckt.map(([i, j], n) => zFeld(BUCHST[n], m[i][j]));
    const frage = wkeit
      ? `${k.wo} ${legende(k)} Die Vierfeldertafel enthält die Wahrscheinlichkeiten. Ergänze die fehlenden Felder.`
      : `${k.wo} Insgesamt wurden ${m[2][2].z} Personen befragt. ${legende(k)} Ergänze die fehlenden Anzahlen in der Vierfeldertafel.`;
    return {
      frage,
      bild: tafelHtml(k, anzeige),
      felder,
      hinweis: 'In jeder Zeile und in jeder Spalte ergeben die beiden inneren Felder zusammen das Summenfeld. Suche ein Feld, in dessen Zeile oder Spalte nur noch eine Zahl fehlt.',
      notiz: stufe > 1,
      loesung: [
        'Die vollständige Vierfeldertafel:',
        { svg: tafelHtml(k, voll(m)) },
        ...versteckt.map(([i, j], n) => `${BUCHST[n]} ${$(zellName(k, i, j, wkeit) + '=' + dz(m[i][j]))}`),
      ],
    };
  };

  gen['wk-text-vft'] = (stufe) => {
    // Vierfeldertafel aus einem Text (Anzahlen bzw. Prozentangaben)
    const k = R.wahl(KONTEXTE);
    const m = anzahlTafel();
    const N = m[2][2].z;
    const nA = m[0][2].z;
    const nB = m[2][0].z;
    const nAB = m[0][0].z;
    let text;
    if (stufe === 1) {
      text = `Von ${N} Befragten trifft bei ${nA} Personen ${$(k.A.s)} zu, bei ${nB} Personen ${$(k.B.s)} und bei ${nAB} Personen beides.`;
    } else if (stufe === 2) {
      text = `Von ${N} Befragten trifft bei ${nA} Personen ${$(k.A.s)} zu. Bei ${nAB} von ihnen trifft auch ${$(k.B.s)} zu. Von den übrigen Personen trifft bei ${m[1][0].z} ${$(k.B.s)} zu.`;
    } else {
      // Anteile: P(A) und Anteil unter A als Prozentsatz – dafür passende Zahlen wählen
      for (;;) {
        const t = anzahlTafel();
        const pA = t[0][2].durch(t[2][2]);
        const qAB = t[0][0].durch(t[0][2]);
        if (pA.mal(100).istGanz() && qAB.mal(100).istGanz()) {
          m.splice(0, 3, ...t);
          break;
        }
      }
      const pA = m[0][2].durch(m[2][2]).mal(100).z;
      const qAB = m[0][0].durch(m[0][2]).mal(100).z;
      text = `Es wurden ${m[2][2].z} Personen befragt. Bei ${pA} % der Befragten trifft ${$(k.A.s)} zu. Von diesen trifft bei ${qAB} % auch ${$(k.B.s)} zu. Insgesamt trifft ${$(k.B.s)} bei ${m[2][0].z} Personen zu.`;
    }
    const anzeige = [[null, null, null], [null, null, null], [null, null, m[2][2]]];
    const gefragt = [[1, 1], [0, 1], [1, 0]];
    gefragt.forEach(([i, j], n) => { anzeige[i][j] = BUCHST[n]; });
    return {
      frage: `${k.wo} ${legende(k)} ${text} Lege eine Vierfeldertafel mit Anzahlen an und bestimme die Felder (a), (b) und (c).`,
      bild: tafelHtml(k, anzeige),
      felder: gefragt.map(([i, j], n) => zFeld(BUCHST[n], m[i][j])),
      hinweis: 'Trage zuerst alle Zahlen aus dem Text in die Tafel ein. Prozentangaben „von diesen“ beziehen sich auf die Zeilensumme. Den Rest bekommst du über die Summen.',
      notiz: true,
      loesung: ['Die vollständige Vierfeldertafel:', { svg: tafelHtml(k, voll(m)) }],
    };
  };

  gen['wk-baum-vft'] = (stufe) => {
    const k = R.wahl(KONTEXTE);
    const a = B(R.int(2, 8), 10);
    const p = B(R.int(1, 9), 10);
    let q = B(R.int(1, 9), 10);
    while (q.gleich(p)) q = B(R.int(1, 9), 10);
    const m = tafel(a.mal(p), a.mal(EINS.minus(p)), EINS.minus(a).mal(q), EINS.minus(a).mal(EINS.minus(q)));
    const A = lit(k.A), nA = lit(k.A, true), Bl = lit(k.B), nB = lit(k.B, true);
    if (stufe < 3) {
      const baumBild = baum({ erst: k.A, zweit: k.B, w1: a, w1g: stufe === 1 ? EINS.minus(a) : null, w2a: p, w2ag: stufe === 1 ? EINS.minus(p) : null, w2b: q, w2bg: stufe === 1 ? EINS.minus(q) : null });
      const anzeige = [[null, null, null], [null, null, null], [null, null, EINS]];
      const gefragt = stufe === 1 ? [[0, 0], [1, 1]] : [[0, 1], [1, 0], [2, 0]];
      gefragt.forEach(([i, j], n) => { anzeige[i][j] = BUCHST[n]; });
      return {
        frage: `${k.wo} ${legende(k)} Das Baumdiagramm zeigt die Wahrscheinlichkeiten.${stufe === 2 ? ' Ergänze zuerst die fehlenden Äste.' : ''} Übertrage die Werte in eine Vierfeldertafel und bestimme die Felder ${gefragt.map((_, n) => BUCHST[n]).join(', ')}.`,
        bild: baumBild + tafelHtml(k, anzeige),
        felder: gefragt.map(([i, j], n) => zFeld(BUCHST[n], m[i][j])),
        hinweis: 'Die inneren Felder der Vierfeldertafel sind die Pfadwahrscheinlichkeiten: Multipliziere entlang des Pfades (1. Pfadregel). Die Äste an einem Knoten ergeben zusammen 1.',
        notiz: stufe === 2,
        loesung: [
          `${$(`${PS(A, Bl)} = ${dz(a)}\\cdot ${dz(p)} = ${dz(m[0][0])}`)}, ${$(`${PS(A, nB)} = ${dz(a)}\\cdot ${dz(EINS.minus(p))} = ${dz(m[0][1])}`)}`,
          `${$(`${PS(nA, Bl)} = ${dz(EINS.minus(a))}\\cdot ${dz(q)} = ${dz(m[1][0])}`)}, ${$(`${PS(nA, nB)} = ${dz(EINS.minus(a))}\\cdot ${dz(EINS.minus(q))} = ${dz(m[1][1])}`)}`,
          { svg: tafelHtml(k, voll(m)) },
        ],
      };
    }
    // Stufe 3: umgekehrtes Baumdiagramm aus der Vierfeldertafel
    const pB = m[2][0];
    const pBA = m[0][0].durch(pB);
    const pnBA = m[0][1].durch(m[2][1]);
    return {
      frage: `${k.wo} ${legende(k)} Zeichne zur Vierfeldertafel das <b>umgekehrte</b> Baumdiagramm, das zuerst nach ${$(k.B.s)} verzweigt. Bestimme die Werte (a), (b) und (c).`,
      bild: tafelHtml(k, voll(m)) + baum({ erst: k.B, zweit: k.A, w1: '(a)', w1g: null, w2a: '(b)', w2ag: null, w2b: '(c)', w2bg: null }),
      felder: [zFeld('(a)', pB), wFeld('(b)', pBA), wFeld('(c)', pnBA)],
      hinweis: `Im umgekehrten Baum stehen auf der ersten Stufe ${$(P(Bl))} und ${$(P(nB))}, auf der zweiten Stufe bedingte Wahrscheinlichkeiten, z. B. ${$(PB(Bl, A) + '=\\frac{' + PS(Bl, A) + '}{' + P(Bl) + '}')}. ${HINWEIS_RUNDEN}`,
      notiz: true,
      loesung: [
        `(a) ${$(`${P(Bl)} = ${dz(pB)}`)} (Spaltensumme)`,
        `(b) ${$(`${PB(Bl, A)} = \\frac{${dz(m[0][0])}}{${dz(pB)}} = ${ergebnisTex(pBA)}`)}`,
        `(c) ${$(`${PB(nB, A)} = \\frac{${dz(m[0][1])}}{${dz(m[2][1])}} = ${ergebnisTex(pnBA)}`)}`,
        { svg: baum({ erst: k.B, zweit: k.A, w1: pB, w1g: EINS.minus(pB), w2a: UM.naeherungText(pBA.zahl(), 2), w2ag: UM.naeherungText(1 - pBA.zahl(), 2), w2b: UM.naeherungText(pnBA.zahl(), 2), w2bg: UM.naeherungText(1 - pnBA.zahl(), 2) }) },
      ],
    };
  };

  // =====================================================================
  // K2 Bedingte Wahrscheinlichkeit
  // =====================================================================

  gen['wk-bedingt-schreibweise'] = (stufe) => {
    const k = R.wahl(KONTEXTE);
    const negA = stufe === 3 && Math.random() < 0.5;
    const negB = stufe === 3 && Math.random() < 0.5;
    let x = lit(k.A, negA);
    let y = lit(k.B, negB);
    if (Math.random() < 0.5) [x, y] = [y, x];
    // Kandidaten: richtig = P_x(y)
    const kand = [
      { tex: PB(x, y), satz: satz.bedingt(x, y) },
      { tex: PB(y, x), satz: satz.bedingt(y, x) },
      { tex: PS(x, y), satz: satz.schnitt(x, y) },
      { tex: P(y), satz: satz.einfach(y) },
    ];
    if (stufe === 3) kand[3] = { tex: PB(lit(x.e, !x.neg), y), satz: satz.bedingt(lit(x.e, !x.neg), y) };
    const reihenfolge = R.mische([0, 1, 2, 3]);
    if (stufe === 2) {
      // Schreibweise gegeben → Satz wählen
      return {
        frage: `${k.wo} ${legende(k)} Welcher Satz beschreibt ${$(kand[0].tex)}?`,
        felder: [{ art: 'auswahl', optionen: reihenfolge.map((i) => `die ${kand[i].satz}`), richtig: reihenfolge.indexOf(0) }],
        hinweis: 'Bei der bedingten Wahrscheinlichkeit steht die Bedingung unten im Index. Sie beschreibt, auf welche Gruppe man sich beschränkt („von denen, die …“).',
        loesung: [`${$(kand[0].tex)} ist die ${kand[0].satz}.`, `Die Bedingung ${$(ltex(x))} steht im Index: Man betrachtet nur die Personen mit ${$(ltex(x))}.`],
      };
    }
    return {
      frage: `${k.wo} ${legende(k)} Gesucht ist die ${kand[0].satz}. Welche Schreibweise passt?`,
      felder: [{ art: 'auswahl', optionen: reihenfolge.map((i) => $(kand[i].tex)), richtig: reihenfolge.indexOf(0) }],
      hinweis: 'Achte auf „die …“: Das ist die Bedingung. Sie steht bei der Schreibweise unten im Index.',
      loesung: [`Die Bedingung ist „${lsatz(x)}“, also ${$(ltex(x))} im Index: ${$(kand[0].tex)}.`],
    };
  };

  gen['wk-bedingt-berechnen'] = (stufe) => {
    const k = R.wahl(KONTEXTE);
    if (stufe < 3) {
      const anzahl = stufe === 1;
      const m = anzahl ? anzahlTafel() : wkeitTafel();
      // Bedingung: Zeile (A) oder Spalte (B), ggf. negiert
      const zeilenBed = Math.random() < 0.5;
      const bi = R.int(0, 1);
      const li = R.int(0, 1);
      const bed = zeilenBed ? zeileLit(k, bi) : spalteLit(k, bi);
      const l = zeilenBed ? spalteLit(k, li) : zeileLit(k, li);
      const zaehler = zeilenBed ? m[bi][li] : m[li][bi];
      const nenner = zeilenBed ? m[bi][2] : m[2][bi];
      const w = zaehler.durch(nenner);
      return {
        frage: `${k.wo} ${legende(k)} Bestimme ${$(PB(bed, l))}, also die ${satz.bedingt(bed, l)}.`,
        bild: tafelHtml(k, voll(m)),
        felder: [wFeld(lab(PB(bed, l)), w)],
        hinweis: `${anzahl ? 'Teile die Anzahl im passenden inneren Feld durch die Anzahl aller Personen mit der Bedingung (Summenfeld).' : `Formel: ${$(PB(bed, l) + '=\\frac{' + PS(bed, l) + '}{' + P(bed) + '}')}.`} ${HINWEIS_RUNDEN}`,
        loesung: [
          `Man betrachtet nur die Personen mit ${$(ltex(bed))} (${anzahl ? 'Anzahl' : 'Wahrscheinlichkeit'} ${$(dz(nenner))}). Davon gilt bei ${$(dz(zaehler))} auch ${$(ltex(l))}.`,
          $(`${PB(bed, l)} = \\frac{${dz(zaehler)}}{${dz(nenner)}} = ${ergebnisTex(w)}`),
        ],
      };
    }
    // Stufe 3: aus dem Baumdiagramm (A zuerst) die „umgekehrte“ bedingte Wkeit P_B(A) bzw. mit Gegenereignis
    const a = B(R.int(1, 9), 10);
    const p = B(R.int(1, 9), 10);
    const q = B(R.int(1, 9), 10);
    const m = tafel(a.mal(p), a.mal(EINS.minus(p)), EINS.minus(a).mal(q), EINS.minus(a).mal(EINS.minus(q)));
    const j = R.int(0, 1);
    const i = R.int(0, 1);
    const bed = spalteLit(k, j);
    const l = zeileLit(k, i);
    const w = m[i][j].durch(m[2][j]);
    const pfade = [m[0][0], m[0][1], m[1][0], m[1][1]];
    return {
      frage: `${k.wo} ${legende(k)} Bestimme mit dem Baumdiagramm ${$(PB(bed, l))}, also die ${satz.bedingt(bed, l)}.`,
      bild: baum({ erst: k.A, zweit: k.B, w1: a, w1g: EINS.minus(a), w2a: p, w2ag: EINS.minus(p), w2b: q, w2bg: EINS.minus(q) }),
      felder: [wFeld(lab(PB(bed, l)), w)],
      hinweis: `Die Bedingung ${$(ltex(bed))} steht im Baum auf der zweiten Stufe. Berechne zuerst ${$(P(bed))} mit beiden Pfaden (2. Pfadregel) und dann ${$(PB(bed, l) + '=\\frac{' + PS(bed, l) + '}{' + P(bed) + '}')}. ${HINWEIS_RUNDEN}`,
      notiz: true,
      loesung: [
        `${$(`${P(bed)} = ${dz(pfade[j])} + ${dz(pfade[2 + j])} = ${dz(m[2][j])}`)} (Summe der Pfade, die auf ${$(ltex(bed))} enden)`,
        `${$(`${PS(bed, l)} = ${dz(m[i][j])}`)} (Pfad über ${$(ltex(l))} und ${$(ltex(bed))})`,
        $(`${PB(bed, l)} = \\frac{${dz(m[i][j])}}{${dz(m[2][j])}} = ${ergebnisTex(w)}`),
        { svg: tafelHtml(k, voll(m)) },
      ],
    };
  };

  // =====================================================================
  // K3 Zuverlässigkeit von Tests
  // =====================================================================

  const TESTS = [
    { name: 'Ein Schnelltest auf eine Infektionskrankheit', krank: 'infiziert', gesund: 'nicht infiziert', gruppe: 'Infizierten' },
    { name: 'Ein Test auf eine Allergie', krank: 'allergisch', gesund: 'nicht allergisch', gruppe: 'Allergiker' },
    { name: 'Ein Test auf eine seltene Stoffwechselerkrankung', krank: 'erkrankt', gesund: 'nicht erkrankt', gruppe: 'Erkrankten' },
  ];
  function testWerte() {
    for (;;) {
      const prae = R.wahl([B(5, 1000), B(1, 100), B(2, 100), B(5, 100), B(1, 10), B(2, 10)]);
      const sens = R.wahl([B(90, 100), B(95, 100), B(98, 100), B(99, 100)]);
      const spez = R.wahl([B(90, 100), B(95, 100), B(98, 100), B(99, 100)]);
      const kp = prae.mal(sens);
      const gp = EINS.minus(prae).mal(EINS.minus(spez));
      const ppv = kp.durch(kp.plus(gp));
      if (ppv.zahl() > 0.05 && ppv.zahl() < 0.95) return { prae, sens, spez, kp, gp, ppv };
    }
  }
  const pz = (b) => `${b.mal(100).istGanz() ? b.mal(100).z : dz(b.mal(100)).replace('{,}', ',')} %`;

  gen['wk-test'] = (stufe) => {
    const t = R.wahl(TESTS);
    const w = testWerte();
    const kLeg = `${$('K')}: Die Person ist ${t.krank}. ${$('T')}: Der Test ist positiv.`;
    const N = 100000;
    const tab = tafel(w.kp.mal(N), w.prae.minus(w.kp).mal(N), w.gp.mal(N), EINS.minus(w.prae).minus(w.gp).mal(N));
    const kt = { A: { s: 'K' }, B: { s: 'T' } };
    const aussage = `${t.name}: ${pz(w.prae)} der getesteten Personen sind ${t.krank}. Bei ${pz(w.sens)} der ${t.gruppe} ist der Test positiv. Bei ${pz(w.spez)} der Personen, die ${t.gesund} sind, ist der Test negativ.`;
    const loesTafel = { svg: tafelHtml(kt, voll(tab)) };
    const ppvTex = $(`P_T(K) = \\frac{${dz(tab[0][0])}}{${dz(tab[2][0])}} = ${ergebnisTex(w.ppv)}`);
    if (stufe === 1) {
      return {
        frage: `${t.name} wurde bei ${N.toLocaleString('de-DE')} Personen eingesetzt. ${kLeg} Wie groß ist die Wahrscheinlichkeit, dass eine Person mit positivem Test tatsächlich ${t.krank} ist?`,
        bild: tafelHtml(kt, voll(tab)),
        felder: [wFeld('$P_T(K)=$', w.ppv)],
        hinweis: `Betrachte nur die Personen mit positivem Test (Spalte ${$('T')}). ${HINWEIS_RUNDEN}`,
        loesung: [ppvTex, `Nur etwa ${UM.naeherungText(w.ppv.zahl(), 2, true)} der positiv Getesteten sind wirklich ${t.krank}.`],
      };
    }
    if (stufe === 2) {
      return {
        frage: `${aussage} ${kLeg} Ein Test ist positiv. Wie groß ist die Wahrscheinlichkeit, dass die Person wirklich ${t.krank} ist?`,
        felder: [wFeld('$P_T(K)=$', w.ppv)],
        hinweis: `Lege eine Vierfeldertafel für z. B. ${N.toLocaleString('de-DE')} Personen an (oder ein Baumdiagramm, das zuerst nach ${$('K')} verzweigt). Gesucht ist ${$('P_T(K)')}. ${HINWEIS_RUNDEN}`,
        notiz: true,
        loesung: [`Vierfeldertafel für ${N.toLocaleString('de-DE')} Personen:`, loesTafel, ppvTex],
      };
    }
    // Stufe 3: zweiter Test bei positiv Getesteten
    const kp2 = w.ppv.mal(w.sens);
    const gp2 = EINS.minus(w.ppv).mal(EINS.minus(w.spez));
    const ppv2 = kp2.durch(kp2.plus(gp2));
    return {
      frage: `${aussage} ${kLeg} Wer positiv getestet wird, wird ein zweites Mal mit demselben Test getestet (die Ergebnisse sind unabhängig voneinander). (1) Wie groß ist die Wahrscheinlichkeit, dass eine Person mit positivem ersten Test ${t.krank} ist? (2) Wie groß ist sie, wenn auch der zweite Test positiv ist?`,
      felder: [wFeld('(1)', w.ppv), wFeld('(2)', ppv2)],
      hinweis: `Für den zweiten Test ist die Gruppe neu: Nur die positiv Getesteten werden noch einmal getestet. Der Anteil der ${t.gruppe} in dieser Gruppe ist das Ergebnis aus (1). ${HINWEIS_RUNDEN}`,
      notiz: true,
      loesung: [
        '(1) Vierfeldertafel für 100.000 Personen:', loesTafel, ppvTex,
        `(2) Jetzt ist der Anteil der ${t.gruppe} ${$(`p\\approx ${UM.naeherungText(w.ppv.zahl(), 4).replace(',', '{,}')}`)}:`,
        $(`\\frac{p\\cdot ${dz(w.sens)}}{p\\cdot ${dz(w.sens)} + (1-p)\\cdot ${dz(EINS.minus(w.spez))}} = ${ergebnisTex(ppv2)}`),
      ],
    };
  };

  // =====================================================================
  // K4 Stochastische Unabhängigkeit
  // =====================================================================

  gen['wk-unabh-bedeutung'] = (stufe) => {
    const k = R.wahl(KONTEXTE);
    const A = lit(k.A), nA = lit(k.A, true), Bl = lit(k.B);
    if (stufe === 1) {
      const pB = B(R.int(2, 8), 10);
      const unabh = Math.random() < 0.5;
      const pAB = unabh ? pB : pB.plus(B(R.wahl([-2, -1, 1, 2]), 10));
      return {
        frage: `${k.wo} ${legende(k)} Es gilt ${$(`${P(Bl)} = ${dz(pB)}`)} und ${$(`${PB(A, Bl)} = ${dz(pAB)}`)}. Was folgt daraus?`,
        felder: [{
          art: 'auswahl',
          optionen: [
            `${$(k.A.s)} und ${$(k.B.s)} sind unabhängig: Ob jemand ${k.A.ja}, ändert nichts an der Wahrscheinlichkeit für ${$(k.B.s)}.`,
            `${$(k.A.s)} und ${$(k.B.s)} sind abhängig: Unter den Personen mit ${$(k.A.s)} ist die Wahrscheinlichkeit für ${$(k.B.s)} anders als insgesamt.`,
          ],
          richtig: unabh ? 0 : 1,
        }],
        hinweis: `Vergleiche ${$(PB(A, Bl))} mit ${$(P(Bl))}. Sind sie gleich, hat die Bedingung ${$(k.A.s)} keinen Einfluss.`,
        loesung: [unabh
          ? `${$(`${PB(A, Bl)} = ${P(Bl)}`)}: Die Bedingung ändert die Wahrscheinlichkeit nicht – die Ereignisse sind stochastisch unabhängig.`
          : `${$(`${PB(A, Bl)} \\neq ${P(Bl)}`)}: Die Bedingung ändert die Wahrscheinlichkeit – die Ereignisse sind stochastisch abhängig.`],
      };
    }
    if (stufe === 2) {
      const pA = B(R.int(2, 8), 10);
      const pB = B(R.int(5, 95), 100);
      return {
        frage: `${k.wo} ${legende(k)} Die Ereignisse ${$(k.A.s)} und ${$(k.B.s)} sind stochastisch unabhängig. Es gilt ${$(`${P(A)} = ${dz(pA)}`)} und ${$(`${P(Bl)} = ${dz(pB)}`)}. Bestimme ${$(PB(A, Bl))}, ${$(PB(nA, Bl))} und ${$(PS(A, Bl))}.`,
        felder: [zFeld(lab(PB(A, Bl)), pB), zFeld(lab(PB(nA, Bl)), pB), zFeld(lab(PS(A, Bl)), pA.mal(pB))],
        hinweis: `Unabhängig heißt: Die Bedingung ändert nichts, also ${$(`${PB(A, Bl)} = ${P(Bl)}`)}. Außerdem gilt dann ${$(`${PS(A, Bl)} = ${P(A)}\\cdot ${P(Bl)}`)}.`,
        loesung: [
          `${$(`${PB(A, Bl)} = ${PB(nA, Bl)} = ${P(Bl)} = ${dz(pB)}`)} – bei unabhängigen Ereignissen spielt die Bedingung keine Rolle.`,
          $(`${PS(A, Bl)} = ${P(A)}\\cdot ${P(Bl)} = ${dz(pA)}\\cdot ${dz(pB)} = ${dz(pA.mal(pB))}`),
        ],
      };
    }
    // Stufe 3: Aussagen beurteilen
    const richtig = R.wahl([
      `Wenn ${$(PB(A, Bl) + '=' + P(Bl))} gilt, dann gilt auch ${$(PS(A, Bl) + '=' + P(A) + '\\cdot ' + P(Bl))}.`,
      `Wenn ${$(k.A.s)} und ${$(k.B.s)} unabhängig sind, dann ist ${$(PB(A, Bl) + '=' + PB(nA, Bl))}.`,
    ]);
    const falsch = R.mische([
      `Wenn ${$(PB(A, Bl) + '=' + P(Bl))} gilt, dann ist ${$(PS(A, Bl) + '=' + P(A) + '+' + P(Bl))}.`,
      `Wenn ${$(k.A.s)} und ${$(k.B.s)} unabhängig sind, dann ist ${$(P(A) + '=' + P(Bl))}.`,
      `Unabhängig bedeutet, dass ${$(k.A.s)} und ${$(k.B.s)} nicht gleichzeitig eintreten können.`,
      `Wenn ${$(PB(A, Bl) + '=' + PB(Bl, A))} gilt, sind ${$(k.A.s)} und ${$(k.B.s)} immer unabhängig.`,
    ]).slice(0, 3);
    const optionen = R.mische([richtig, ...falsch]);
    return {
      frage: `${k.wo} ${legende(k)} Welche Aussage ist richtig?`,
      felder: [{ art: 'auswahl', optionen, richtig: optionen.indexOf(richtig) }],
      hinweis: `Unabhängig: ${$(PB(A, Bl) + '=' + P(Bl))}. Setzt man ${$(PB(A, Bl) + '=\\frac{' + PS(A, Bl) + '}{' + P(A) + '}')} ein, erhält man ${$(PS(A, Bl) + '=' + P(A) + '\\cdot ' + P(Bl))}.`,
      loesung: [`Richtig ist: ${richtig}`, '„Nicht gleichzeitig eintreten“ heißt unvereinbar – das ist etwas anderes als unabhängig. Ob Ereignisse unabhängig sind, sieht man oft nicht ohne Rechnung.'],
    };
  };

  gen['wk-unabh-pruefen'] = (stufe) => {
    const k = R.wahl(KONTEXTE);
    const A = lit(k.A), Bl = lit(k.B);
    const unabh = Math.random() < 0.5;
    const auswahl = (richtig) => ({ art: 'auswahl', label: 'Also sind die Ereignisse', optionen: ['stochastisch unabhängig', 'stochastisch abhängig'], richtig: richtig ? 0 : 1 });
    if (stufe < 3) {
      let m = unabh ? unabhTafel() : abhTafel();
      let bild;
      if (stufe === 2) {
        // als Anzahlen bei N Personen
        const N = R.wahl([100, 200, 500, 1000]);
        const ma = m.map((r) => r.map((x) => x.mal(N)));
        if (!ma.every((r) => r.every((x) => x.istGanz()))) return gen['wk-unabh-pruefen'](stufe);
        bild = tafelHtml(k, ma);
      } else bild = tafelHtml(k, voll(m));
      const prod = m[0][2].mal(m[2][0]);
      return {
        frage: `${k.wo} ${legende(k)} ${stufe === 2 ? 'Die Vierfeldertafel enthält Anzahlen. ' : ''}Prüfe rechnerisch, ob ${$(k.A.s)} und ${$(k.B.s)} stochastisch unabhängig sind.`,
        bild,
        felder: [zFeld(lab(`${P(A)}\\cdot ${P(Bl)}`), prod), zFeld(lab(PS(A, Bl)), m[0][0]), auswahl(unabh)],
        hinweis: `Bedingung für Unabhängigkeit: ${$(`${P(A)}\\cdot ${P(Bl)} = ${PS(A, Bl)}`)}. ${stufe === 2 ? 'Rechne die Anzahlen zuerst in Wahrscheinlichkeiten um (durch die Gesamtzahl teilen).' : ''}`,
        notiz: stufe === 2,
        loesung: [
          $(`${P(A)}\\cdot ${P(Bl)} = ${dz(m[0][2])}\\cdot ${dz(m[2][0])} = ${dz(prod)}`),
          $(`${PS(A, Bl)} = ${dz(m[0][0])}`),
          unabh ? 'Beide Werte sind gleich: Die Ereignisse sind stochastisch unabhängig.' : 'Die Werte sind verschieden: Die Ereignisse sind stochastisch abhängig.',
        ],
      };
    }
    // Stufe 3: Baumdiagramm – erst P(B) bestimmen
    const a = B(R.int(2, 8), 10);
    const p = B(R.int(1, 9), 10);
    const q = unabh ? p : B(p.mal(10).z === 9 ? 8 : p.mal(10).z + 1, 10);
    const pB = a.mal(p).plus(EINS.minus(a).mal(q));
    return {
      frage: `${k.wo} ${legende(k)} Bestimme mit dem Baumdiagramm ${$(P(Bl))} und prüfe, ob ${$(k.A.s)} und ${$(k.B.s)} stochastisch unabhängig sind.`,
      bild: baum({ erst: k.A, zweit: k.B, w1: a, w1g: EINS.minus(a), w2a: p, w2ag: EINS.minus(p), w2b: q, w2bg: EINS.minus(q) }),
      felder: [zFeld(lab(P(Bl)), pB), auswahl(unabh)],
      hinweis: `${$(P(Bl))} bekommst du mit der 2. Pfadregel. Vergleiche dann ${$(PB(A, Bl))} (im Baum ablesen) mit ${$(P(Bl))} oder prüfe ${$(`${P(A)}\\cdot ${P(Bl)} = ${PS(A, Bl)}`)}.`,
      notiz: true,
      loesung: [
        $(`${P(Bl)} = ${dz(a)}\\cdot ${dz(p)} + ${dz(EINS.minus(a))}\\cdot ${dz(q)} = ${dz(pB)}`),
        unabh
          ? `${$(`${PB(A, Bl)} = ${dz(p)} = ${P(Bl)}`)}: unabhängig. (Im Baum sieht man das auch daran, dass ${$(k.B.s)} unter ${$(k.A.s)} und unter ${$(`\\overline{${k.A.s}}`)} dieselbe Wahrscheinlichkeit hat.)`
          : `${$(`${PB(A, Bl)} = ${dz(p)} \\neq ${dz(pB)} = ${P(Bl)}`)}: abhängig.`,
      ],
    };
  };

  UM.daten = Object.assign(UM.daten || {}, { KONTEXTE });
})(typeof window !== 'undefined' ? window : globalThis);
