/*
 * Aufgaben-Generatoren: Rationale Zahlen (Klasse 7)
 *
 * Jeder Generator ist eine Funktion (stufe) → Aufgabe, stufe ∈ {1, 2, 3}.
 * Aufbau einer Aufgabe (wird von assets/js/aufgaben.js dargestellt):
 *   frage    Text, Formeln in $…$
 *   term     optional: TeX, groß und zentriert
 *   bild     optional: SVG-Text
 *   felder   [{ art:'zahl', label, antwort:Bruch, gekuerzt, einheit }   label darf $…$ enthalten
 *             { art:'summe', label, antwort:[Bruch] }               klammerfreie Summe (Zwischenschritt)
 *             { art:'auswahl', label, optionen:[…], richtig:index }
 *             { art:'strahl', cfg, ziel:Bruch, text }        (Zahlenstrahl anklicken)
 *             { art:'mengen', zahlen:[{ tex, N, Z, Q }] }]   (Tabelle ℕ/ℤ/ℚ)
 *   hinweis  optional: Tipp
 *   notiz    optional: true → Aufforderung, Nebenrechnungen aufzuschreiben (Heft/iPad)
 *   loesung  [Text mit $…$ | { svg }]
 *
 * Die Aufgaben orientieren sich an Notizbuch und Kompetenzcheckliste,
 * nicht an den Aufgaben der Klassenarbeit.
 */
(function (global) {
  'use strict';
  const UM = (global.UM = global.UM || {});
  const { Bruch, T, term, zahlenstrahl } = UM;
  const { Z, K, B: Betrag, N: Neg } = T;
  const gen = (UM.generatoren = UM.generatoren || {});

  // ---------- Zufall ----------
  const R = {
    int: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
    wahl: (liste) => liste[Math.floor(Math.random() * liste.length)],
    vz: () => (Math.random() < 0.5 ? -1 : 1),
    nz: (a, b) => {
      let x = 0;
      while (x === 0) x = R.int(a, b);
      return x;
    },
    mische: (liste) => {
      const l = liste.slice();
      for (let i = l.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [l[i], l[j]] = [l[j], l[i]];
      }
      return l;
    },
    /** Zufällige Dezimalzahl mit `stellen` Nachkommastellen, |x| ≤ max, x ≠ 0, nicht ganz */
    dez: (max, stellen = 1) => {
      const f = 10 ** stellen;
      let z = 0;
      while (z === 0 || z % f === 0) z = R.int(-max * f, max * f);
      return new Bruch(z, f);
    },
    /** Zufälliger echter oder unechter Bruch, nicht ganz */
    bruch: (nenner, maxBetrag = 2) => {
      for (;;) {
        const n = R.wahl(nenner);
        const z = R.nz(-maxBetrag * n, maxBetrag * n);
        const b = new Bruch(z, n);
        if (!b.istGanz() && b.n === n) return b;
      }
    },
  };
  UM.zufall = R;

  const tex = (k, vorne = true) => term.tex(k, vorne);
  const wert = (k) => term.wert(k);
  const $ = (t) => `$${t}$`;
  const dzt = (b) => b.tex('dezimal');
  /** Ergebnisdarstellung: Dezimalzahl wenn endlich und gewünscht, sonst Bruch (ggf. gemischt) */
  const erg = (b, dezimalBevorzugt = false) => {
    if (b.istGanz()) return b.tex();
    if (dezimalBevorzugt && b.istEndlichDezimal()) return dzt(b);
    const t = b.tex('bruch');
    return Math.abs(b.z) > b.n ? `${t}=${b.tex('gemischt')}` : t;
  };
  const kgV = (a, b) => (a / UM.ggT(a, b)) * b;
  /** Zahlknoten passend zur Herkunft: endliche Dezimalzahl im Dezimalstil */
  const ZD = (b, plus = false) => ({ art: 'zahl', wert: b, stil: 'dezimal', plus });
  const ZB = (b, plus = false) => ({ art: 'zahl', wert: b, stil: 'bruch', plus });
  const ZG = (b, plus = false) => ({ art: 'zahl', wert: b, stil: 'gemischt', plus });

  /** Zahl als Klartext für SVG-Beschriftungen */
  const klartext = (w, stil) => {
    if (w.istGanz()) return String(w.z).replace('-', '−');
    if (stil === 'dezimal' && w.istEndlichDezimal()) return w.dezText().replace('-', '−');
    const a = Math.abs(w.z);
    const vz = w.z < 0 ? '−' : '';
    if (stil === 'gemischt' && a > w.n) return `${vz}${Math.floor(a / w.n)} ${a % w.n}/${w.n}`;
    return `${vz}${a}/${w.n}`;
  };

  const ERGEBNIS = 'Ergebnis';
  const FORM_HINWEIS = 'Gib das Ergebnis als ganze Zahl, Dezimalzahl oder vollständig gekürzten Bruch an.';

  // =====================================================================
  // K1 Zahlenmengen
  // =====================================================================

  gen['rz-mengen'] = (stufe) => {
    const kandidaten = {
      1: [
        () => { const w = R.int(2, 99); return { tex: String(w), w: new Bruch(w) }; },
        () => { const w = -R.int(1, 99); return { tex: String(w), w: new Bruch(w) }; },
        () => { const b = R.dez(20).abs(); return { tex: dzt(b), w: b }; },
        () => { const b = R.bruch([3, 4, 5, 7, 8], 1).abs(); return { tex: b.tex(), w: b }; },
      ],
      2: [
        () => { const b = R.dez(30); return { tex: dzt(b), w: b }; },
        () => { const b = R.bruch([3, 5, 6, 7, 9], 3); return { tex: b.tex(), w: b }; },
        () => { const n = R.wahl([2, 4, 5, 6, 8]); const g = R.int(2, 9); return { tex: `\\frac{${g * n}}{${n}}`, w: new Bruch(g) }; },
        () => { const n = R.wahl([2, 3, 5, 7]); const g = R.int(2, 9); return { tex: `-\\frac{${g * n}}{${n}}`, w: new Bruch(-g) }; },
        () => { const w = -R.int(100, 2000); return { tex: String(w), w: new Bruch(w) }; },
        () => { const b = R.bruch([3, 4, 5], 4).abs(); return { tex: b.tex('gemischt'), w: b }; },
      ],
      3: [
        () => { const [z, n, p] = R.wahl([[1, 3, '0{,}\\overline{3}'], [2, 3, '0{,}\\overline{6}'], [4, 3, '1{,}\\overline{3}'], [5, 3, '1{,}\\overline{6}'], [1, 9, '0{,}\\overline{1}'], [7, 3, '2{,}\\overline{3}']]); const v = R.vz(); return { tex: (v < 0 ? '-' : '') + p, w: new Bruch(v * z, n) }; },
        () => { const a = R.int(2, 15); return { tex: `\\left|-${a}\\right|`, w: new Bruch(a) }; },
        () => { const a = R.int(2, 15); return { tex: `-\\left|-${a}\\right|`, w: new Bruch(-a) }; },
        () => { const a = R.int(2, 15); return { tex: `-(-${a})`, w: new Bruch(a) }; },
        () => { const b = R.dez(5, 1).abs(); return { tex: `-(-${dzt(b)})`, w: b }; },
        () => { const n = R.wahl([4, 6, 8]); const g = R.int(2, 6); return { tex: `\\frac{${g * n}}{-${n}}`, w: new Bruch(-g) }; },
        () => { const b = R.dez(9, 2); return { tex: dzt(b), w: b }; },
      ],
    }[stufe];
    // vier verschiedene Typen, damit die Tabelle abwechslungsreich ist
    const typen = R.mische(kandidaten).slice(0, 4);
    while (typen.length < 4) typen.push(R.wahl(kandidaten));
    const zahlen = typen.map((f) => {
      const { tex: t, w } = f();
      return { tex: t, w, N: w.istGanz() && w.z > 0, Z: w.istGanz(), Q: true };
    });
    const begruendung = (z) => {
      const name = z.N ? 'natürliche Zahl, also auch ganz und rational' : z.Z ? 'ganze Zahl, aber negativ: ganz und rational' : 'keine ganze Zahl: nur rational';
      const umgeformt = z.w.istGanz() && z.tex !== String(z.w.z) ? ` (denn ${$(z.tex + '=' + z.w.tex())})` : '';
      return `${$(z.tex)}: ${name}${umgeformt}`;
    };
    return {
      frage: 'Kreuze bei jeder Zahl alle Zahlenmengen an, zu denen sie gehört.',
      felder: [{ art: 'mengen', zahlen }],
      hinweis: 'Jede natürliche Zahl ist auch ganz, jede ganze Zahl ist auch rational. Prüfe immer zuerst, welchen Wert die Zahl wirklich hat.',
      loesung: zahlen.map(begruendung),
    };
  };

  const KONTEXTE = {
    1: [
      ['die Anzahl der Kinder in einer Klasse', 0],
      ['der Kontostand in ganzen Euro (auch Schulden sind möglich)', 1],
      ['die Temperatur in °C, gemessen auf eine Nachkommastelle', 2],
      ['die Seitenzahlen in einem Buch', 0],
      ['die Stockwerke im Aufzug eines Hochhauses mit drei Tiefgaragen-Ebenen', 1],
    ],
    2: [
      ['die Tordifferenz einer Fußballmannschaft', 1],
      ['die Höhe eines Ortes über oder unter dem Meeresspiegel in ganzen Metern', 1],
      ['der Preis eines Produkts in Euro', 2],
      ['der Punktestand bei einem Quiz mit Minuspunkten für falsche Antworten', 1],
      ['die Körpergröße in Metern', 2],
      ['die Hausnummern in einer Straße', 0],
    ],
    3: [
      ['die Veränderung eines Aktienkurses in Euro an einem Tag', 2],
      ['Jahreszahlen, wenn Jahre vor Christus negativ geschrieben werden', 1],
      ['die Augensumme zweier Würfel minus 7', 1],
      ['die Temperatur in Kelvin (sie ist nie negativ, kann aber Kommastellen haben)', 2],
      ['die Anzahl der Einwohner einer Stadt', 0],
      ['der Unterschied zwischen geschätzter und tatsächlicher Länge in cm (auf mm genau)', 2],
    ],
  };
  const MENGEN_NAMEN = ['ℕ (natürliche Zahlen)', 'ℤ (ganze Zahlen)', 'ℚ (rationale Zahlen)'];
  const MENGEN_GRUND = [
    'Es kommen nur positive ganze Zahlen vor.',
    'Es kommen negative Zahlen vor, aber keine Kommazahlen oder Brüche.',
    'Es kommen Kommazahlen bzw. Brüche vor.',
  ];
  gen['rz-kontext'] = (stufe) => {
    const [text, richtig] = R.wahl(KONTEXTE[stufe]);
    return {
      frage: `Welcher Zahlenbereich passt am besten zu: <b>${text}</b>? Gesucht ist der kleinste Zahlenbereich, in dem alle möglichen Werte liegen.`,
      felder: [{ art: 'auswahl', optionen: MENGEN_NAMEN, richtig }],
      hinweis: 'Überlege dir drei typische Werte. Kommen negative Zahlen vor? Kommen Kommazahlen vor?',
      loesung: [`${MENGEN_NAMEN[richtig]}: ${MENGEN_GRUND[richtig]}`],
    };
  };

  // =====================================================================
  // K2 Zahlenstrahl
  // =====================================================================

  function strahlSkala(stufe) {
    if (stufe === 1) {
      return { cfg: { min: -10, max: 10, haupt: 1 }, ziel: () => new Bruch(R.nz(-10, 10)), stil: 'bruch' };
    }
    if (stufe === 2) {
      return R.wahl([
        { cfg: { min: -5, max: 5, haupt: 1, neben: new Bruch(1, 2) }, ziel: () => new Bruch(R.nz(-10, 10), 2), stil: 'dezimal' },
        { cfg: { min: -2, max: 2, haupt: 1, neben: new Bruch(1, 10) }, ziel: () => new Bruch(R.nz(-20, 20), 10), stil: 'dezimal' },
        { cfg: { min: -50, max: 50, haupt: 10, neben: 5 }, ziel: () => new Bruch(5 * R.nz(-10, 10)), stil: 'bruch' },
      ]);
    }
    return R.wahl([
      { cfg: { min: -3, max: 3, haupt: 1, neben: new Bruch(1, 4) }, ziel: () => new Bruch(R.nz(-12, 12), 4), stil: 'gemischt' },
      { cfg: { min: -3, max: 3, haupt: 1, neben: new Bruch(1, 5) }, ziel: () => new Bruch(R.nz(-15, 15), 5), stil: 'gemischt' },
      { cfg: { min: -2000, max: 2000, haupt: 500, neben: 100 }, ziel: () => new Bruch(100 * R.nz(-20, 20)), stil: 'bruch' },
      { cfg: { min: -1, max: 1, haupt: new Bruch(1, 2), neben: new Bruch(1, 10) }, ziel: () => new Bruch(R.nz(-10, 10), 10), stil: 'dezimal' },
    ]);
  }
  const zielTex = (w, stil) => (stil === 'dezimal' && !w.istGanz() ? dzt(w) : w.tex(stil));
  function strahlErklaerung(cfg) {
    const haupt = Bruch.von(cfg.haupt);
    const neben = Bruch.von(cfg.neben || cfg.haupt);
    if (haupt.gleich(neben)) return `Jeder Strich bedeutet einen Schritt von ${$(haupt.tex())}.`;
    const anzahl = haupt.durch(neben).zahl();
    return `Zwischen zwei beschrifteten Strichen liegen ${anzahl} kleine Abschnitte. Ein Abschnitt ist also ${$(neben.istEndlichDezimal() ? dzt(neben) : neben.tex())} lang.`;
  }

  /** Ziel ab Stufe 2 nicht auf einem beschrifteten Strich (sonst zu leicht) */
  function strahlZiel(s, stufe) {
    for (;;) {
      const z = s.ziel();
      if (stufe === 1 || !z.durch(Bruch.von(s.cfg.haupt)).istGanz()) return z;
    }
  }

  gen['rz-strahl-setzen'] = (stufe) => {
    const s = strahlSkala(stufe);
    const ziel = strahlZiel(s, stufe);
    return {
      frage: `Tippe auf den Zahlenstrahl, um den Pfeil an die Stelle der Zahl ${$(zielTex(ziel, s.stil))} zu setzen.`,
      felder: [{ art: 'strahl', cfg: s.cfg, ziel, text: 'A' }],
      hinweis: 'Bestimme zuerst, wie groß ein kleiner Abschnitt ist. Negative Zahlen liegen links von der Null.',
      loesung: [
        strahlErklaerung(s.cfg),
        { svg: zahlenstrahl.svg({ ...s.cfg, pfeile: [{ wert: ziel, text: klartext(ziel, s.stil), farbe: 'gruen' }] }) },
      ],
    };
  };

  gen['rz-strahl-ablesen'] = (stufe) => {
    const s = strahlSkala(stufe);
    const ziel = strahlZiel(s, stufe);
    return {
      frage: 'Welche Zahl markiert der rote Pfeil?',
      bild: zahlenstrahl.svg({ ...s.cfg, pfeile: [{ wert: ziel }] }),
      felder: [{ art: 'zahl', label: 'Zahl', antwort: ziel }],
      hinweis: 'Zähle die kleinen Abschnitte vom nächsten beschrifteten Strich aus.',
      loesung: [strahlErklaerung(s.cfg), `Der Pfeil zeigt auf ${$(erg(ziel, s.stil === 'dezimal'))}.`],
    };
  };

  gen['rz-mitte'] = (stufe) => {
    let a;
    let b;
    let stil = 'bruch';
    if (stufe === 1) {
      do { a = new Bruch(-R.int(1, 20)); b = new Bruch(R.int(-10, 20)); } while ((a.z + b.z) % 2 !== 0 || a.gleich(b));
    } else if (stufe === 2) {
      do { a = new Bruch(-R.int(1, 30)); b = new Bruch(R.int(-25, 30)); } while ((a.z + b.z) % 2 === 0);
      stil = 'dezimal';
    } else {
      a = R.wahl([R.dez(5, 1), R.bruch([2, 4, 5], 3)]);
      do { b = R.wahl([R.dez(5, 1), R.bruch([2, 4, 5], 3)]); } while (b.gleich(a));
      stil = 'dezimal';
      if (a.z > 0 && b.z > 0) a = a.neg();
    }
    if (a.vgl(b) > 0) [a, b] = [b, a];
    const mitte = a.plus(b).durch(2);
    const abstand = b.minus(a);
    const zt = (x) => (stil === 'dezimal' && x.istEndlichDezimal() ? dzt(x) : x.tex());
    return {
      frage: `Welche Zahl liegt auf der Zahlengeraden genau in der Mitte zwischen ${$(zt(a))} und ${$(zt(b))}?`,
      felder: [
        { art: 'zahl', label: 'Abstand der beiden Zahlen', antwort: abstand },
        { art: 'zahl', label: 'Mitte', antwort: mitte },
      ],
      hinweis: 'Bestimme den Abstand der beiden Zahlen und gehe von der kleineren Zahl aus den halben Abstand nach rechts.',
      loesung: [
        `Abstand: ${$(`${zt(b)}-${a.z < 0 ? `(${zt(a)})` : zt(a)}=${zt(abstand)}`)}`,
        `Halber Abstand: ${$(zt(abstand.durch(2)))}`,
        `Mitte: ${$(`${zt(a)}+${zt(abstand.durch(2))}=${zt(mitte)}`)}`,
      ],
    };
  };

  // =====================================================================
  // K3 Gegenzahl und Betrag
  // =====================================================================

  gen['rz-gegenzahl-betrag'] = (stufe) => {
    if (stufe <= 2) {
      const stil = stufe === 2 && R.int(0, 1) ? 'dezimal' : 'bruch';
      const x = stufe === 1 ? new Bruch(R.nz(-50, 50)) : stil === 'dezimal' ? R.dez(20, R.int(1, 2)) : R.bruch([3, 4, 5, 7], 3);
      const xt = stil === 'dezimal' ? dzt(x) : x.tex();
      const out = (b) => (stil === 'dezimal' ? dzt(b) : b.tex());
      return {
        frage: `Gib die Gegenzahl und den Betrag von ${$(xt)} an.`,
        felder: [
          { art: 'zahl', label: 'Gegenzahl', antwort: x.neg() },
          { art: 'zahl', label: 'Betrag', antwort: x.abs() },
        ],
        hinweis: 'Die Gegenzahl liegt auf der anderen Seite der Null, gleich weit entfernt. Der Betrag ist der Abstand zur Null und nie negativ.',
        loesung: [`Gegenzahl: ${$(out(x.neg()))} (gespiegelt an der Null)`, `Betrag: ${$(`\\left|${xt}\\right|=${out(x.abs())}`)} (Abstand zur Null)`],
      };
    }
    // Stufe 3: Ausdrücke mit Betrag und Gegenzahl
    const a = R.int(2, 20);
    const b = R.int(2, 20);
    const d = R.dez(9, 1).abs();
    const k = R.wahl([
      Neg(K(Z(-a))),
      Neg(Betrag(Z(-a))),
      Neg(K(Neg(K(Z(-a))))),
      T.minus(Betrag(Z(-a)), Betrag(Z(b))),
      T.plus(Betrag(Z(-a)), Neg(K(Z(b)))),
      T.minus(Neg(Betrag(ZD(d.neg()))), Z(a)),
      T.mal(Betrag(Z(-a)), Z(-1)),
    ]);
    const w = wert(k);
    return {
      frage: 'Berechne.',
      term: tex(k),
      felder: [{ art: 'zahl', label: ERGEBNIS, antwort: w }],
      hinweis: 'Arbeite von innen nach außen: Erst Beträge und innere Klammern, dann das Minus davor (Gegenzahl).',
      notiz: true,
      loesung: [`${$(`${tex(k)}=${erg(w, true)}`)}`, 'Ein Minus vor einer Zahl oder Klammer bedeutet: Gegenzahl bilden. Der Betrag macht jede Zahl nicht-negativ.'],
    };
  };

  gen['rz-vergleich'] = (stufe) => {
    let l;
    let r;
    if (stufe === 1) {
      const a = R.nz(-30, 30);
      let b;
      do { b = R.nz(-30, 30); } while (b === a || (a > 0 && b > 0));
      l = Z(a);
      r = Z(b);
    } else if (stufe === 2) {
      const paare = [
        () => { const x = R.dez(5, 1).abs().neg(); const y = R.dez(5, 2).abs().neg(); return [ZD(x), ZD(y)]; },
        () => { const x = R.bruch([2, 4, 5], 3).abs().neg(); return [ZB(x), ZD(x)]; },
        () => { const x = new Bruch(-1, 3); return [ZB(x), ZD(Bruch.dez(R.wahl(['-0,3', '-0,33', '-0,4'])))]; },
        () => { const x = R.bruch([3, 4, 5, 8], 2); const y = R.bruch([3, 4, 5, 8], 2); return [ZB(x), ZB(y)]; },
      ];
      [l, r] = R.wahl(paare)();
      if (R.int(0, 1)) [l, r] = [r, l];
    } else {
      const a = R.int(2, 12);
      const d = R.dez(6, 1).abs();
      [l, r] = R.wahl([
        [Betrag(Z(-a)), Neg(K(Z(-a + R.int(-2, 2))))],
        [Neg(Betrag(ZD(d.neg()))), ZD(d.neg().plus(new Bruch(R.int(-3, 3), 10)))],
        [Neg(K(Z(a))), Betrag(Z(-a))],
        [Betrag(ZD(d.neg())), Neg(K(ZD(d.neg())))],
      ]);
    }
    const c = wert(l).vgl(wert(r));
    const zeichen = ['<', '=', '>'];
    const richtig = c + 1;
    return {
      frage: 'Welches Zeichen gehört in die Lücke?',
      term: `${tex(l)}\\;\\square\\;${tex(r)}`,
      felder: [{ art: 'auswahl', optionen: zeichen.map((z) => $(z)), richtig }],
      hinweis: 'Je weiter rechts eine Zahl auf der Zahlengeraden liegt, desto größer ist sie. Bei negativen Zahlen gilt: größerer Betrag → kleinere Zahl.',
      loesung: [(() => {
        const roh = `${tex(l)}${zeichen[richtig]}${tex(r)}`;
        const zeige = (b) => (b.istEndlichDezimal() ? erg(b, true) : `${b.tex()}\\approx ${(Math.round(b.zahl() * 1000) / 1000).toFixed(3).replace('.', '{,}')}`);
        const werte = `${zeige(wert(l))}${zeichen[richtig]}${zeige(wert(r))}`;
        return $(roh) + (roh !== werte ? `, denn ${$(werte)}` : '');
      })()],
    };
  };

  // =====================================================================
  // K4 Ganze Zahlen addieren und subtrahieren (Pfeilbild und Nebenrechnung)
  // =====================================================================

  /** Nebenrechnung wie im Unterricht: in welche Richtung geht der Pfeil? */
  function nebenrechnung(start, schritt) {
    const a = Math.abs(start.zahl());
    const s = Math.abs(schritt.zahl());
    const weg = start.vz() * schritt.vz() > 0; // von der Null weg (negativ nach links / positiv nach rechts)
    if (weg) return { tex: `${start.abs().tex()}+${schritt.abs().tex()}`, regel: 'Der Pfeil führt weiter von der Null weg: Beträge addieren.' };
    const [g, k] = a >= s ? [start.abs(), schritt.abs()] : [schritt.abs(), start.abs()];
    return { tex: `${g.tex()}-${k.tex()}`, regel: 'Der Pfeil führt zur Null hin oder über sie hinweg: vom größeren Betrag den kleineren abziehen.' };
  }

  gen['rz-nebenrechnung'] = (stufe) => {
    let a;
    let b;
    let o;
    let k;
    let wErg;
    do {
      const max = { 1: 15, 2: 80, 3: 1200 }[stufe];
      a = R.nz(-max, max);
      b = stufe === 1 ? R.int(1, max) : R.nz(-max, max);
      o = R.wahl(['+', '-']);
      const rechts = stufe === 1 ? Z(b) : Z(b, 'bruch', stufe === 3 && b > 0 && R.int(0, 1) === 1);
      k = o === '+' ? T.plus(Z(a), rechts) : T.minus(Z(a), rechts);
      wErg = wert(k);
    } while (wErg.z === 0 || (stufe === 1 && a > 0 && o === '+'));
    const schritt = new Bruch(o === '+' ? b : -b);
    const nr = nebenrechnung(new Bruch(a), schritt);
    const klammerfrei = term.summeTex([a, schritt]);
    const loesung = [];
    if (stufe > 1) loesung.push(`Ohne Klammern: ${$(`${tex(k)}=${klammerfrei}`)}`);
    if (Math.max(Math.abs(a), Math.abs(wErg.z)) <= 25) {
      const lo = Math.floor((Math.min(a, wErg.z) - 2) / 5) * 5;
      const hi = Math.ceil((Math.max(a, wErg.z) + 2) / 5) * 5;
      loesung.push({ svg: zahlenstrahl.svg({ min: Math.min(lo, -5), max: Math.max(hi, 5), haupt: 5, neben: 1, boegen: [{ von: a, bis: wErg.z, text: (schritt.z < 0 ? '−' : '+') + Math.abs(schritt.z) }] }) });
    }
    loesung.push(`Vorzeichen: ${wErg.z > 0 ? 'positiv' : 'negativ'}. ${nr.regel}`);
    loesung.push(`Nebenrechnung: ${$(`${nr.tex}=${wErg.abs().tex()}`)}`);
    loesung.push(`Ergebnis: ${$(`${klammerfrei}=${wErg.tex()}`)}`);
    const mitKlammer = /\(/.test(tex(k));
    return {
      frage: mitKlammer ? 'Schreibe die Rechnung ohne Klammern und berechne sie mit Vorzeichen und Nebenrechnung.' : 'Berechne mit Vorzeichen und Nebenrechnung.',
      term: tex(k),
      felder: [
        ...(mitKlammer ? [{ art: 'summe', label: 'Ohne Klammern', antwort: [new Bruch(a), schritt] }] : []),
        { art: 'auswahl', label: 'Vorzeichen des Ergebnisses', optionen: ['+ (positiv)', '− (negativ)'], richtig: wErg.z > 0 ? 0 : 1 },
        { art: 'zahl', label: 'Nebenrechnung (Betrag)', antwort: wErg.abs() },
        { art: 'zahl', label: ERGEBNIS, antwort: wErg },
      ],
      hinweis: 'Schreibe die Rechnung zuerst ohne Klammern. Stell dir das Pfeilbild vor: Wo startest du, in welche Richtung geht der Pfeil?',
      loesung,
    };
  };

  const ORTE = [['Oslo', 'Rom'], ['Moskau', 'Madrid'], ['Helsinki', 'Athen'], ['Nuuk', 'Lissabon'], ['auf der Zugspitze', 'in Köln']];
  gen['rz-sachaufgabe'] = (stufe) => {
    if (stufe === 1) {
      const t0 = R.nz(-12, 8);
      const d = R.int(3, 15) * R.vz();
      const w = t0 + d;
      const zeit = R.wahl([['Am Morgen', 'Bis zum Mittag', 'mittags'], ['Um 18 Uhr', 'Bis Mitternacht', 'um Mitternacht'], ['Bei Sonnenaufgang', 'Bis 10 Uhr', 'um 10 Uhr']]);
      return {
        frage: `${zeit[0]} zeigt das Thermometer ${t0.toString().replace('-', '−')} °C. ${zeit[1]} ${d > 0 ? 'steigt' : 'fällt'} die Temperatur um ${Math.abs(d)} °C. Welche Temperatur ist es ${zeit[2]}?`,
        felder: [
          { art: 'summe', label: 'Rechnung (ohne Ergebnis)', antwort: [new Bruch(t0), new Bruch(d)] },
          { art: 'zahl', label: 'Temperatur', antwort: new Bruch(w), einheit: '°C' },
        ],
        hinweis: 'Steigen bedeutet Addieren, Fallen bedeutet Subtrahieren.',
        loesung: [$(`${t0}${d > 0 ? '+' : '-'}${Math.abs(d)}=${w}`) + ` Es sind ${$(String(w))} °C.`],
      };
    }
    if (stufe === 2) {
      const k0 = R.nz(-200, 150);
      const ein = R.int(2, 30) * 5;
      const ab = R.int(2, 40) * 5;
      const w = k0 + ein - ab;
      return {
        frage: `Ein Konto hat einen Kontostand von ${String(k0).replace('-', '−')} €. Zuerst werden ${ein} € eingezahlt, danach werden ${ab} € abgebucht. Wie hoch ist der Kontostand danach?`,
        felder: [
          { art: 'summe', label: 'Rechnung (ohne Ergebnis)', antwort: [new Bruch(k0), new Bruch(ein), new Bruch(-ab)] },
          { art: 'zahl', label: 'Kontostand', antwort: new Bruch(w), einheit: '€' },
        ],
        hinweis: 'Einzahlen erhöht den Kontostand (+), Abbuchen verringert ihn (−). Ein negativer Kontostand bedeutet Schulden.',
        loesung: [$(`${k0}+${ein}-${ab}=${w}`) + ` Der Kontostand beträgt ${$(String(w))} €${w < 0 ? ', das Konto ist also im Minus' : ''}.`],
      };
    }
    // Stufe 3: Unterschiede
    if (R.int(0, 1)) {
      const [kalt, warm] = R.wahl(ORTE);
      const tk = R.dez(15, 1).abs().neg();
      const tw = R.dez(20, 1).abs();
      const diff = tw.minus(tk);
      return {
        frage: `An einem Wintertag werden ${kalt} ${dzt(tk).replace('{,}', ',').replace('-', '−')} °C gemessen und ${warm} ${dzt(tw).replace('{,}', ',')} °C. Um wie viel Grad ist es ${warm} wärmer?`,
        felder: [{ art: 'zahl', label: 'Unterschied', antwort: diff, einheit: '°C' }],
        hinweis: 'Den Unterschied berechnest du mit „wärmere Temperatur minus kältere Temperatur“.',
        notiz: true,
        loesung: [$(`${dzt(tw)}-(${dzt(tk)})=${dzt(tw)}+${dzt(tk.abs())}=${dzt(diff)}`) + ` Es ist ${$(dzt(diff))} °C wärmer.`],
      };
    }
    const tief = -R.int(20, 450);
    const hoch = R.int(150, 2900);
    const diff = hoch - tief;
    const [unten, oben] = R.wahl([['Ein Taucher befindet sich', 'ein Flugzeug fliegt'], ['Ein U-Boot liegt', 'ein Bergsteiger steht'], ['Ein Bergwerksstollen liegt', 'eine Seilbahnstation liegt']]);
    return {
      frage: `${unten} ${Math.abs(tief)} m unter dem Meeresspiegel (also bei ${String(tief).replace('-', '−')} m), ${oben} ${hoch} m darüber. Wie groß ist der Höhenunterschied?`,
      felder: [{ art: 'zahl', label: 'Höhenunterschied', antwort: new Bruch(diff), einheit: 'm' }],
      hinweis: 'Höhenunterschied = obere Höhe minus untere Höhe.',
      notiz: true,
      loesung: [$(`${hoch}-(${tief})=${hoch}+${-tief}=${diff}`) + ` Der Höhenunterschied beträgt ${$(String(diff))} m.`],
    };
  };

  // =====================================================================
  // K5 Rationale Zahlen addieren und subtrahieren
  // =====================================================================

  function zufallsZahl(art) {
    if (art === 'dez') return ZD(R.dez(10, R.wahl([1, 1, 2])));
    if (art === 'bruch') return ZB(R.bruch([2, 3, 4, 5, 6, 8, 10, 12], 1));
    if (art === 'gemischt') return ZG(R.bruch([2, 3, 4, 5, 8], 3));
    return Z(R.nz(-9, 9));
  }

  gen['rz-klammerfrei'] = (stufe) => {
    const arten = { 1: ['dez', 'dez', 'dez'], 2: ['bruch', 'bruch', 'bruch'], 3: ['dez', 'bruch', 'gemischt'] }[stufe];
    const anzahl = stufe === 2 ? R.int(2, 3) : stufe === 1 ? R.int(2, 3) : 3;
    let k;
    const summanden = [];
    let w;
    let dezimal;
    do {
      summanden.length = 0;
      const zahlen = R.mische(arten).slice(0, anzahl).map(zufallsZahl);
      if (stufe === 3 && zahlen.every((z) => z.stil === 'dezimal')) continue;
      k = zahlen[0];
      summanden.push(zahlen[0].wert);
      for (let i = 1; i < zahlen.length; i++) {
        const o = R.wahl(['+', '-']);
        const zz = { ...zahlen[i], plus: zahlen[i].wert.z > 0 && R.int(0, 2) === 0 };
        k = o === '+' ? T.plus(k, zz) : T.minus(k, zz);
        summanden.push(o === '+' ? zz.wert : zz.wert.neg());
      }
      w = wert(k);
      dezimal = stufe === 1;
    } while (w.z === 0 || w.n > 120);
    const stil = dezimal ? 'dezimal' : 'bruch';
    const loesung = [`Ohne Klammern: ${$(`${tex(k)}=${term.summeTex(summanden, stil)}`)}`];
    if (!dezimal) {
      const hn = summanden.reduce((m, b) => kgV(m, b.n), 1);
      if (hn > 1) loesung.push(`Hauptnenner ${hn}: ${$(summanden.map((b, i) => `${b.z < 0 ? '-' : i ? '+' : ''}\\frac{${Math.abs(b.z) * (hn / b.n)}}{${hn}}`).join(''))}`);
    }
    loesung.push(`Ergebnis: ${$(erg(w, dezimal) + (!dezimal && !w.istGanz() && w.istEndlichDezimal() ? `=${dzt(w)}` : ''))}`);
    return {
      frage: `Schreibe den Term ohne Klammern und berechne ihn. ${stufe > 1 ? FORM_HINWEIS : ''}`,
      term: tex(k),
      felder: [
        { art: 'summe', label: 'Ohne Klammern', antwort: summanden.slice() },
        { art: 'zahl', label: ERGEBNIS, antwort: w, gekuerzt: true },
      ],
      notiz: stufe > 1,
      hinweis: 'Plus und Minus mit gleichem Zeichen in der Klammer ergeben +, verschiedene Zeichen ergeben −. Danach Schritt für Schritt mit Nebenrechnung rechnen.',
      loesung,
    };
  };

  const FEHLER_TEXTE = {
    betragAdd: 'Die Beträge hätten addiert werden müssen.',
    minusKlammer: 'Die Minusklammer wurde falsch aufgelöst.',
    zaehlerNenner: 'Zähler und Nenner wurden einzeln addiert.',
    vorzeichenGroesser: 'Das Vorzeichen ist falsch: Es bekommt das Vorzeichen der Zahl mit dem größeren Betrag.',
    vorzeichenMal: 'Vorzeichenfehler beim Multiplizieren/Dividieren.',
    komma: 'Das Komma wurde falsch gesetzt.',
    kehrbruch: 'Es wurde nicht mit dem Kehrbruch multipliziert.',
  };
  const FEHLER = [
    { s: 1, tex: '-4{,}5-(-2{,}5)=-7', f: 'minusKlammer', w: Bruch.dez('-2') },
    { s: 1, tex: '3{,}2-(+5{,}2)=8{,}4', f: 'minusKlammer', w: Bruch.dez('-2') },
    { s: 1, tex: '-1{,}6+2{,}4=-0{,}8', f: 'vorzeichenGroesser', w: Bruch.dez('0,8') },
    { s: 1, tex: '-12+(-7)=-5', f: 'betragAdd', w: new Bruch(-19) },
    { s: 2, tex: '-\\frac{2}{3}+\\left(-\\frac{2}{3}\\right)=0', f: 'betragAdd', w: new Bruch(-4, 3) },
    { s: 2, tex: '-\\frac{1}{4}-\\frac{1}{2}=-\\frac{2}{6}', f: 'zaehlerNenner', w: new Bruch(-3, 4) },
    { s: 2, tex: '(-0{,}5)\\cdot(-0{,}4)=-0{,}2', f: 'vorzeichenMal', w: Bruch.dez('0,2') },
    { s: 2, tex: '-0{,}3\\cdot 0{,}3=-0{,}9', f: 'komma', w: Bruch.dez('-0,09') },
    { s: 3, tex: '-7+\\left(-\\frac{1}{2}\\right)=-6\\frac{1}{2}', f: 'betragAdd', w: new Bruch(-15, 2) },
    { s: 3, tex: '\\frac{3}{4}:\\left(-\\frac{1}{2}\\right)=-\\frac{3}{8}', f: 'kehrbruch', w: new Bruch(-3, 2) },
    { s: 3, tex: '-2{,}4:(-0{,}6)=-4', f: 'vorzeichenMal', w: new Bruch(4) },
    { s: 3, tex: '\\frac{2}{5}-\\left(-\\frac{1}{3}\\right)=\\frac{1}{15}', f: 'minusKlammer', w: new Bruch(11, 15) },
  ];
  gen['rz-fehler'] = (stufe) => {
    const f = R.wahl(FEHLER.filter((x) => x.s === stufe));
    const andere = R.mische(Object.keys(FEHLER_TEXTE).filter((x) => x !== f.f)).slice(0, 2);
    const optionen = R.mische([f.f, ...andere]);
    return {
      frage: 'Finde den Fehler! Was wurde falsch gemacht? Berechne anschließend das richtige Ergebnis.',
      term: f.tex,
      felder: [
        { art: 'auswahl', label: 'Fehler', optionen: optionen.map((o) => FEHLER_TEXTE[o]), richtig: optionen.indexOf(f.f) },
        { art: 'zahl', label: 'Richtiges Ergebnis', antwort: f.w },
      ],
      hinweis: 'Rechne die Aufgabe selbst und vergleiche Schritt für Schritt.',
      notiz: true,
      loesung: [FEHLER_TEXTE[f.f], `Richtig ist ${$(erg(f.w, f.tex.includes('{,}')))}.`],
    };
  };

  // =====================================================================
  // K6 Multiplizieren und Dividieren
  // =====================================================================

  gen['rz-vorzeichen'] = (stufe) => {
    const anzahl = { 1: 2, 2: R.int(3, 4), 3: R.int(4, 6) }[stufe];
    const mitNull = stufe === 3 && R.int(0, 3) === 0;
    const nullStelle = mitNull ? R.int(0, anzahl - 2) : -1;
    let k = null;
    let negativ = 0;
    for (let i = 0; i < anzahl; i++) {
      let z;
      if (i === nullStelle) z = Z(0);
      else if (stufe === 1) z = Z(R.nz(-12, 12));
      else if (stufe === 2) z = R.wahl([Z(R.nz(-15, 15)), ZD(R.dez(5, 1))]);
      else z = R.wahl([Z(R.nz(-20, 20)), ZD(R.dez(5, 2)), ZB(R.bruch([3, 4, 7, 9], 2))]);
      if (z.wert.z < 0) negativ++;
      const o = i === 0 ? null : i === nullStelle ? '*' : stufe === 1 ? R.wahl(['*', ':']) : R.wahl(['*', '*', ':']);
      k = i === 0 ? z : o === '*' ? T.mal(k, z) : T.durch(k, z);
    }
    const w = wert(k);
    const optionen = stufe === 3 ? ['positiv', 'negativ', 'null'] : ['positiv', 'negativ'];
    const richtig = w.z === 0 ? 2 : w.z > 0 ? 0 : 1;
    return {
      frage: 'Ohne zu rechnen: Ist das Ergebnis positiv oder negativ?' + (stufe === 3 ? ' (Oder ist es null?)' : ''),
      term: tex(k),
      felder: [{ art: 'auswahl', optionen, richtig }],
      hinweis: 'Zähle die negativen Zahlen. Bei einer geraden Anzahl ist das Ergebnis positiv, bei einer ungeraden negativ.',
      loesung: [w.z === 0 ? 'Ein Faktor ist 0, also ist das ganze Produkt 0.' : `Es gibt ${negativ} negative Zahl${negativ === 1 ? '' : 'en'}, das ist eine ${negativ % 2 ? 'ungerade' : 'gerade'} Anzahl. Das Ergebnis ist ${optionen[richtig]}.`],
    };
  };

  gen['rz-multdiv'] = (stufe) => {
    let k;
    let w;
    if (stufe === 1) {
      const a = R.nz(-12, 12);
      const b = R.nz(-12, 12);
      k = R.int(0, 1) ? T.mal(Z(a), Z(b)) : T.durch(Z(a * b), Z(b));
    } else if (stufe === 2) {
      const typ = R.int(0, 2);
      if (typ === 0) k = T.mal(ZD(R.dez(1, 1)), ZD(R.dez(9, 1)));
      else if (typ === 1) {
        const q = new Bruch(R.nz(-9, 9));
        const d = R.dez(2, 1);
        k = T.durch(ZD(q.mal(d)), ZD(d));
      } else {
        const d = new Bruch(R.nz(-9, 9));
        const q = R.dez(3, 2);
        k = T.durch(ZD(q.mal(d)), Z(d.z));
      }
    } else {
      const typ = R.int(0, 2);
      const f = () => ZB(R.bruch([2, 3, 4, 5, 6, 8, 9, 10], 2));
      if (typ === 0) k = T.mal(f(), f());
      else if (typ === 1) k = T.durch(f(), f());
      else k = T.mal(T.mal(Z(R.wahl([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6])), f()), f());
    }
    w = wert(k);
    const dezimal = stufe === 2;
    let anzahlNeg = 0;
    (function zaehle(n) { if (n.art === 'zahl' && n.wert.z < 0) anzahlNeg++; if (n.l) { zaehle(n.l); zaehle(n.r); } })(k);
    return {
      frage: `Berechne. ${stufe === 3 ? FORM_HINWEIS : ''}`,
      term: tex(k),
      felder: [{ art: 'zahl', label: ERGEBNIS, antwort: w, gekuerzt: true }],
      notiz: stufe === 3,
      hinweis: 'Bestimme zuerst das Vorzeichen (Anzahl der negativen Zahlen), dann rechne mit den Beträgen.' + (stufe === 3 ? ' Durch einen Bruch teilt man, indem man mit dem Kehrbruch multipliziert.' : ''),
      loesung: [
        `Vorzeichen: ${anzahlNeg} negative Zahl${anzahlNeg === 1 ? '' : 'en'} → ${w.z === 0 ? 'Ergebnis 0' : w.z > 0 ? 'positiv' : 'negativ'}.`,
        `${$(`${tex(k)}=${erg(w, dezimal)}`)}`,
      ],
    };
  };

  gen['rz-kontomodell'] = (stufe) => {
    const betrag = stufe === 3 ? R.wahl([new Bruch(25, 2), new Bruch(15), new Bruch(35, 2), new Bruch(45, 2)]) : new Bruch(R.wahl([20, 25, 30, 40, 50, 60, 75, 80]));
    const ein = stufe === 1 ? true : R.int(0, 1) === 1;
    let zeit = stufe === 1 ? R.int(1, 6) : R.nz(-6, 6);
    let zeitText;
    if (stufe === 3 && R.int(0, 1)) {
      zeit = R.wahl([-2, -1, 1, 2]) * 12;
      zeitText = zeit < 0 ? `vor ${-zeit / 12} Jahr${zeit === -12 ? '' : 'en'}` : `in ${zeit / 12} Jahr${zeit === 12 ? '' : 'en'}`;
    } else {
      zeitText = zeit < 0 ? `vor ${-zeit} Monat${zeit === -1 ? '' : 'en'}` : `in ${zeit} Monat${zeit === 1 ? '' : 'en'}`;
    }
    const bew = ein ? betrag : betrag.neg();
    const w = bew.mal(zeit);
    const euro = (b) => (b.istGanz() ? String(b.z) : b.n === 2 || b.n === 10 ? b.dezText() + '0' : b.dezText());
    const euroTex = (b) => euro(b).replace(',', '{,}');
    const btxt = euro(betrag);
    return {
      frage: `Auf ein Konto werden schon lange an jedem Monatsersten ${btxt} € ${ein ? 'eingezahlt' : 'abgebucht'}, und das soll auch weiter so geschehen. Heute ist der Kontostand ausgeglichen, er beträgt 0 €. Wie hoch ist der Kontostand ${zeitText}?`,
      felder: [{ art: 'zahl', label: 'Kontostand', antwort: w, einheit: '€' }],
      notiz: true,
      hinweis: `Schreibe einen Produktterm: (Zeit) · (Kontobewegung). Die Zukunft ist positiv, die Vergangenheit negativ, Einzahlungen positiv, Abbuchungen negativ.`,
      loesung: [
        `Zeit: ${$(String(zeit))} Monat${Math.abs(zeit) === 1 ? '' : 'e'} (${zeit < 0 ? 'Vergangenheit' : 'Zukunft'}), Kontobewegung: ${$(euroTex(bew))} € (${ein ? 'Einzahlung' : 'Abbuchung'}).`,
        $(`${zeit}\\cdot ${bew.z < 0 ? `(${euroTex(bew)})` : euroTex(bew)}=${euroTex(w)}`) + ` Der Kontostand beträgt ${$(euroTex(w))} €.`,
      ],
    };
  };

  // =====================================================================
  // K7 Rechengesetze
  // =====================================================================

  gen['rz-minusklammer'] = (stufe) => {
    let k;
    let aufgeloest;
    if (stufe === 1) {
      const a = R.int(5, 60);
      const b = R.int(1, 60);
      const c = R.int(1, 60);
      const o = R.wahl(['+', '-']);
      const innen = o === '+' ? T.plus(Z(b), Z(c)) : T.minus(Z(b), Z(c));
      const mitMinus = R.int(0, 3) > 0;
      k = mitMinus ? T.minus(Z(a), K(innen)) : T.plus(Z(a), K(innen));
      aufgeloest = mitMinus ? [a, -b, o === '+' ? -c : c] : [a, b, o === '+' ? c : -c];
    } else if (stufe === 2) {
      const a = R.nz(-40, 40);
      const b = R.nz(-30, 30);
      const c = R.int(1, 60);
      const d = R.int(1, 30);
      const innen1 = T.plus(Z(b), Z(c));
      const innen2 = T.minus(Z(d), Z(R.int(1, 30)));
      const wahl = R.int(0, 2);
      if (wahl === 0) { k = T.minus(Z(a), K(innen1)); aufgeloest = [a, -b, -c]; }
      else if (wahl === 1) { k = Neg(K(T.minus(Z(a), Z(c)))); aufgeloest = [-a, c]; }
      else { const e = innen2.r.wert.z; k = T.plus(Neg(K(innen1)), K(innen2)); aufgeloest = [-b, -c, d, -e]; }
    } else {
      // −(x − y) − (y − z) : y hebt sich weg
      const x = R.dez(9, 1);
      const y = R.dez(9, 2);
      const z = R.dez(9, 1);
      k = T.minus(Neg(K(T.minus(ZD(x), ZD(y)))), K(T.minus(ZD(y), ZD(z))));
      aufgeloest = [x.neg(), y, y.neg(), z];
    }
    const w = wert(k);
    const stil = stufe === 3 ? 'dezimal' : 'bruch';
    return {
      frage: 'Löse die Klammern auf und berechne.',
      term: tex(k),
      felder: [
        { art: 'summe', label: 'Ohne Klammern', antwort: aufgeloest.map((x) => Bruch.von(x)) },
        { art: 'zahl', label: ERGEBNIS, antwort: w },
      ],
      hinweis: 'Steht ein Minus vor der Klammer, werden beim Weglassen der Klammer alle Plus- und Minuszeichen in der Klammer umgedreht. Bei einem Plus vor der Klammer bleibt alles, wie es ist.',
      loesung: [
        `Klammern auflösen: ${$(`${tex(k)}=${term.summeTex(aufgeloest, stil)}`)}`,
        stufe === 3 ? 'Geschickt: Die beiden Zahlen mit gleichem Betrag und verschiedenem Vorzeichen heben sich auf.' : 'Dann von links nach rechts rechnen.',
        `Ergebnis: ${$(erg(w, true))}`,
      ],
    };
  };

  gen['rz-geschickt'] = (stufe) => {
    let k;
    let geschickt;
    let zwischen;
    if (stufe === 1) {
      const rund = R.wahl([100, 100, 1000]);
      const a = R.int(rund / 20, rund - rund / 20);
      const c = rund - a;
      const b = R.int(11, 89);
      const v = R.vz();
      // v·a + b + v·c bzw. mit Minus
      k = v > 0 ? T.kette(Z(a), '+', Z(b), '+', Z(c)) : T.kette(Z(-a), '+', Z(b), '-', Z(c));
      geschickt = v > 0 ? `${a}+${c}+${b}=${rund}+${b}` : `-${a}-${c}+${b}=-${rund}+${b}`;
      zwischen = new Bruch(v * rund);
    } else if (stufe === 2) {
      const paar = R.wahl([[25, 4], [5, 2], [125, 8], [50, 2], [20, 5]]);
      const p = paar[0] * paar[1];
      const m = R.nz(-19, 19);
      const s1 = R.vz();
      const s2 = R.vz();
      k = T.kette(Z(s1 * paar[0]), '*', Z(m), '*', Z(s2 * paar[1]));
      zwischen = new Bruch(s1 * s2 * p);
      geschickt = `${tex(Z(s1 * paar[0]))}\\cdot ${tex(Z(s2 * paar[1]), false)}\\cdot ${tex(Z(m), false)}=${s1 * s2 * p}\\cdot ${tex(Z(m), false)}`;
    } else {
      if (R.int(0, 1)) {
        const [f1, f2] = R.wahl([['2,5', '4'], ['0,5', '8'], ['0,25', '12'], ['0,2', '15'], ['1,25', '8']]);
        const m = R.dez(9, 1);
        const v = R.vz();
        const zf1 = ZD(Bruch.dez(f1).mal(v));
        k = T.kette(zf1, '*', ZD(m), '*', ZD(Bruch.dez(f2)));
        zwischen = Bruch.dez(f1).mal(Bruch.dez(f2)).mal(v);
        geschickt = `${tex(zf1)}\\cdot ${dzt(Bruch.dez(f2))}\\cdot ${tex(ZD(m), false)}=${dzt(Bruch.dez(f1).mal(Bruch.dez(f2)).mal(v))}\\cdot ${tex(ZD(m), false)}`;
      } else {
        const ganz = R.int(1, 9);
        const a = R.dez(9, 2).abs();
        const c = new Bruch(ganz).minus(a);
        const b = R.dez(9, 1);
        const v = R.vz();
        k = T.kette(ZD(a.mal(v)), '+', ZD(b), '+', ZD(c.mal(v)));
        zwischen = new Bruch(ganz * v);
        geschickt = `${term.summeTex([a.mal(v), c.mal(v), b], 'dezimal')}=${term.summeTex([new Bruch(ganz * v), b], 'dezimal')}`;
      }
    }
    const w = wert(k);
    return {
      frage: 'Berechne möglichst geschickt. Nutze Kommutativ- und Assoziativgesetz. Fasse zuerst die beiden Zahlen zusammen, die eine „runde“ Zahl ergeben.',
      term: tex(k),
      felder: [
        { art: 'zahl', label: 'Zwischenergebnis (die „runde“ Zahl)', antwort: zwischen },
        { art: 'zahl', label: ERGEBNIS, antwort: w },
      ],
      hinweis: 'Suche zwei Zahlen, die zusammen eine „runde“ Zahl ergeben (Summe) bzw. deren Produkt rund ist. Du darfst die Reihenfolge vertauschen, wenn du die Vorzeichen mitnimmst.',
      loesung: [`Umstellen: ${$(`${tex(k)}=${geschickt}`)}`, `Ergebnis: ${$(erg(w, true))}`],
    };
  };

  gen['rz-distributiv'] = (stufe) => {
    let k;
    const schritte = [];
    let zwischen = [];
    let notiz = false;
    if (stufe === 1) {
      const a = R.wahl([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
      const b = R.nz(-15, 15);
      const c = R.int(1, 15);
      const o = R.wahl(['+', '-']);
      const innen = o === '+' ? T.plus(Z(b), Z(c)) : T.minus(Z(b), Z(c));
      k = T.mal(Z(a), K(innen));
      const ab = T.mal(Z(a), Z(b));
      const ac = T.mal(Z(a), Z(c));
      schritte.push(`Ausmultiplizieren: ${$(`${tex(k)}=${tex(ab)}${o}${tex(ac, false)}`)}`);
      zwischen = [
        { art: 'zahl', label: $(`${tex(ab)}=`), antwort: wert(ab) },
        { art: 'zahl', label: $(`${tex(ac)}=`), antwort: wert(ac) },
      ];
      schritte.push($(`=${wert(ab).tex()}${o}${tex(Z(a * c), false)}`));
      return finish('Wende das Distributivgesetz an (ausmultiplizieren) und berechne.');
    }
    if (stufe === 2) {
      const a = R.nz(-19, 19);
      const rund = R.wahl([10, 100, 100, -100]);
      const b = R.int(Math.abs(rund) / 10 + 1, Math.abs(rund) - 1) * Math.sign(rund);
      const c = rund - b;
      k = T.plus(T.mal(Z(a), Z(b)), T.mal(Z(a), Z(c)));
      if (R.int(0, 1)) k = T.plus(T.mal(Z(b), Z(a)), T.mal(Z(c), Z(a)));
      schritte.push(`Gemeinsamer Faktor ${$(tex(Z(a)))} ausklammern: ${$(`${tex(k)}=${tex(Z(a))}\\cdot(${tex(Z(b))}+${tex(Z(c), false)})`)}`);
      schritte.push($(`=${tex(Z(a))}\\cdot ${tex(Z(rund), false)}`));
      zwischen = [{ art: 'zahl', label: 'Wert der Klammer nach dem Ausklammern', antwort: new Bruch(rund) }];
      return finish('Klammere geschickt aus und berechne.');
    }
    if (R.int(0, 1)) {
      // Zerlegen wie im Unterricht: 98 · (−7) = (100 − 2) · (−7)
      const rund = R.wahl([100, 50, 200, 1000]);
      const d = R.nz(-4, 4);
      const n = rund + d;
      const m = R.nz(-9, 9);
      const v = R.vz();
      k = T.mal(Z(v * n), Z(m));
      const zer = `(${v * rund}${v * d > 0 ? '+' : '-'}${Math.abs(d)})`;
      notiz = true;
      schritte.push(`Zerlegen: ${$(`${tex(k)}=${zer}\\cdot ${tex(Z(m), false)}`)}`);
      schritte.push($(`=${tex(T.mal(Z(v * rund), Z(m)))}${v * d > 0 ? '+' : '-'}${Math.abs(d)}\\cdot ${tex(Z(m), false)}=${v * rund * m}${v * d * m >= 0 ? '+' : '-'}${Math.abs(v * d * m)}`));
      return finish('Berechne geschickt, indem du einen Faktor zerlegst (z. B. 98 = 100 − 2) und das Distributivgesetz nutzt.');
    }
    // Dezimalzahlen ausklammern
    const ganz = R.wahl([1, 2, 5, 10]);
    const x = R.dez(ganz, 1).abs();
    const y = new Bruch(ganz).minus(x);
    const f = ZD(R.dez(9, 1));
    k = T.plus(T.mal(ZD(x), f), T.mal(ZD(y), f));
    schritte.push(`Ausklammern: ${$(`${tex(k)}=(${dzt(x)}+${dzt(y)})\\cdot ${tex(f, false)}`)}`);
    schritte.push($(`=${ganz}\\cdot ${tex(f, false)}`));
    zwischen = [{ art: 'zahl', label: 'Wert der Klammer nach dem Ausklammern', antwort: new Bruch(ganz) }];
    return finish('Klammere geschickt aus und berechne.');

    function finish(frage) {
      const w = wert(k);
      schritte.push($(`=${erg(w, true)}`));
      return {
        frage,
        term: tex(k),
        felder: [...zwischen, { art: 'zahl', label: ERGEBNIS, antwort: w }],
        notiz,
        hinweis: 'Ausmultiplizieren: a·(b + c) = a·b + a·c. Ausklammern: a·b + a·c = a·(b + c). Achte auf die Vorzeichen!',
        loesung: schritte,
      };
    }
  };

  // =====================================================================
  // K8 Brüche und Dezimalzahlen gemischt
  // =====================================================================

  gen['rz-gemischt'] = (stufe) => {
    const dezEinfach = () => ZD(Bruch.dez(R.wahl(['0,5', '0,25', '0,75', '1,5', '0,2', '0,4', '1,2', '2,5'])).mal(R.vz()));
    const bruch = () => ZB(R.bruch([2, 3, 4, 5, 6, 8], 1));
    let k;
    for (;;) {
      if (stufe === 1) k = T[R.wahl(['plus', 'minus'])](dezEinfach(), bruch());
      else if (stufe === 2) k = T[R.wahl(['mal', 'durch'])](dezEinfach(), bruch());
      else {
        const p = T[R.wahl(['mal', 'durch'])](bruch(), dezEinfach());
        k = R.int(0, 1) ? T[R.wahl(['plus', 'minus'])](dezEinfach(), p) : T[R.wahl(['plus', 'minus'])](p, dezEinfach());
      }
      const w = wert(k);
      if (w.z !== 0 && w.n <= 60) break;
    }
    const w = wert(k);
    const umwandeln = [];
    (function sammle(n) {
      if (n.art === 'zahl' && n.stil === 'dezimal' && !n.wert.istGanz()) umwandeln.push(`${dzt(n.wert.abs())}=${n.wert.abs().tex()}`);
      if (n.l) { sammle(n.l); sammle(n.r); }
    })(k);
    return {
      frage: `Berechne. ${FORM_HINWEIS}`,
      term: tex(k),
      felder: [{ art: 'zahl', label: ERGEBNIS, antwort: w, gekuerzt: true }],
      notiz: true,
      hinweis: 'Wandle die Dezimalzahlen in Brüche um (z. B. 0,25 = 1/4). Punktrechnung vor Strichrechnung!',
      loesung: [`Umwandeln: ${$([...new Set(umwandeln)].join(',\\;'))}`, `${$(`${tex(k)}=${erg(w, true)}`)}`],
    };
  };

  // =====================================================================
  // Begründen: Aussagen beurteilen
  // =====================================================================

  const AUSSAGEN = [
    { s: 1, a: 'Jede natürliche Zahl ist auch eine ganze Zahl.', ok: true, b: 'ℕ ist ein Teil von ℤ: 1, 2, 3, … gehören auch zu den ganzen Zahlen.' },
    { s: 1, a: 'Der Betrag einer Zahl ist nie negativ.', ok: true, b: 'Der Betrag ist der Abstand zur Null, und ein Abstand ist nie negativ.' },
    { s: 1, a: '$-5$ ist größer als $-3$.', ok: false, b: '$-5$ liegt auf der Zahlengeraden links von $-3$, also gilt $-5<-3$.' },
    { s: 1, a: 'Addiert man zwei negative Zahlen, ist das Ergebnis immer negativ.', ok: true, b: 'Beide Pfeile zeigen nach links, man entfernt sich immer weiter von der Null ins Negative, z. B. $-3+(-4)=-7$.' },
    { s: 2, a: 'Subtrahiert man eine negative Zahl von einer negativen Zahl, ist das Ergebnis immer negativ.', ok: false, b: 'Gegenbeispiel: $-2-(-5)=-2+5=3$.' },
    { s: 2, a: 'Ein Produkt aus drei negativen Zahlen ist positiv.', ok: false, b: 'Drei ist eine ungerade Anzahl negativer Faktoren, z. B. $(-1)\\cdot(-2)\\cdot(-3)=-6$.' },
    { s: 2, a: 'Zwischen $-1$ und $0$ liegt keine rationale Zahl.', ok: false, b: 'Gegenbeispiel: $-0{,}5$ oder $-\\frac{1}{3}$ liegen dazwischen.' },
    { s: 2, a: 'Eine Zahl und ihre Gegenzahl haben denselben Betrag.', ok: true, b: 'Beide sind gleich weit von der Null entfernt, z. B. $|-4|=|4|=4$.' },
    { s: 2, a: 'Ist ein Quotient negativ, dann haben Dividend und Divisor verschiedene Vorzeichen.', ok: true, b: 'Bei gleichen Vorzeichen wäre der Quotient positiv, z. B. $(-8):(-2)=4$, aber $(-8):2=-4$.' },
    { s: 3, a: 'Ist ein Produkt aus vier Faktoren negativ, dann ist genau ein Faktor negativ.', ok: false, b: 'Gegenbeispiel mit drei negativen Faktoren: $(-1)\\cdot(-1)\\cdot(-1)\\cdot 2=-2$. Es muss nur eine ungerade Anzahl sein.' },
    { s: 3, a: 'Je größer der Betrag einer negativen Zahl ist, desto kleiner ist die Zahl.', ok: true, b: 'Ein größerer Betrag heißt: weiter links von der Null, z. B. $-10<-2$.' },
    { s: 3, a: 'Addiert man zu einer Zahl eine negative Zahl, ist das Ergebnis kleiner als die Zahl.', ok: true, b: 'Der Pfeil zeigt nach links, z. B. $3+(-1)=2<3$ oder $-3+(-1)=-4<-3$.' },
    { s: 3, a: 'Multipliziert man eine Zahl mit einer negativen Zahl, wird das Ergebnis immer kleiner als die Zahl.', ok: false, b: 'Gegenbeispiel: $(-3)\\cdot(-2)=6$, und $6$ ist größer als $-3$.' },
  ];
  gen['rz-aussagen'] = (stufe) => {
    const x = R.wahl(AUSSAGEN.filter((a) => a.s === stufe));
    return {
      frage: `Beurteile die Aussage: „${x.a}“`,
      felder: [{ art: 'auswahl', optionen: ['Die Aussage stimmt.', 'Die Aussage stimmt nicht.'], richtig: x.ok ? 0 : 1 }],
      hinweis: 'Probiere die Aussage an Beispielen aus, auch mit negativen Zahlen, Brüchen und der Null. Ein einziges Gegenbeispiel reicht, um eine Aussage zu widerlegen.',
      loesung: [`Die Aussage ${x.ok ? 'stimmt' : 'stimmt nicht'}. ${x.b}`, 'Überlege dir selbst eine Begründung in ganzen Sätzen, so wie sie in der Klassenarbeit verlangt wird.'],
    };
  };

  // ---------------------------------------------------------------------
  // Gesperrte Terme: Aufgaben der Klassenarbeit dürfen nicht zufällig entstehen.
  // Gespeichert sind nur Prüfsummen (FNV-1a), nicht die Terme selbst.
  // ---------------------------------------------------------------------
  const termHash = (t) => {
    let x = 0x811c9dc5;
    for (const c of t) { x ^= c.codePointAt(0); x = Math.imul(x, 0x01000193) >>> 0; }
    return x.toString(16).padStart(8, '0');
  };
  const GESPERRT = new Set(['9e8f4272', 'bac0212c', '4dbf99cf', '3c6ef886', 'f81d378d', '3a5c1334', '80b967dd', '549cec80', '85b63c1a', 'c3bc8dd1', '8f07597a', '693f49af', '79ae767e', '018aa829']);
  for (const [name, original] of Object.entries(gen)) {
    gen[name] = (stufe) => {
      let a = original(stufe);
      for (let i = 0; i < 100 && a.term && GESPERRT.has(termHash(a.term)); i++) a = original(stufe);
      return a;
    };
  }
  UM.termHash = termHash;
  UM.gesperrteTerme = GESPERRT;

  UM.daten = Object.assign(UM.daten || {}, { FEHLER, AUSSAGEN, KONTEXTE });
})(typeof window !== 'undefined' ? window : globalThis);
