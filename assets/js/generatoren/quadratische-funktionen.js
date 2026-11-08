/*
 * Aufgaben-Generatoren: Quadratische Funktionen und Nullstellen (Klasse 10)
 *
 * Format der Aufgaben: siehe generatoren/rationale-zahlen.js. Zusätzlich:
 *   { art:'menge', label, antwort:[Bruch|Wurzel], platzhalter }      Lösungsmenge (Reihenfolge egal)
 *   { art:'naeherung', label, wert:Zahl, stellen, einheit }           gerundetes CAS-Ergebnis
 * Parabeln werden als SVG im Koordinatensystem gezeichnet.
 *
 * Die Aufgaben orientieren sich an Notizbuch und Kompetenzcheckliste,
 * nicht an den Aufgaben der Klassenarbeit.
 */
(function (global) {
  'use strict';
  const UM = (global.UM = global.UM || {});
  const { Bruch, Wurzel } = UM;
  const R = UM.zufall;
  const gen = (UM.generatoren = UM.generatoren || {});

  const B = (z, n = 1) => new Bruch(z, n);
  const $ = (t) => `$${t}$`;
  const lab = (t) => `$${t}=$`;
  const L_LABEL = '$\\mathbb{L}=$';
  const L_PLATZ = 'z. B. −3; 3';
  const mengeFeld = (antwort) => ({ art: 'menge', label: L_LABEL, antwort, platzhalter: L_PLATZ });

  // ---------- Darstellung von Zahlen und Termen ----------
  /** Zahl: endliche Dezimalzahl mit Komma, sonst Bruch */
  const zt = (b) => (b.istGanz() ? b.tex() : b.istEndlichDezimal() ? b.tex('dezimal') : b.tex());
  /** Koeffizient vor einer Variablen (1 → "", −1 → "-") */
  function koeff(b, variable) {
    if (b.gleich(1)) return variable;
    if (b.gleich(-1)) return '-' + variable;
    return zt(b) + variable;
  }
  /** Normalform a·x² + b·x + c */
  function polyTex(a, b, c, x = 'x') {
    const teile = [];
    if (a.z !== 0) teile.push(koeff(a, `${x}^2`));
    if (b.z !== 0) teile.push(koeff(b, x));
    if (c.z !== 0) teile.push(zt(c));
    if (!teile.length) return '0';
    return teile.map((t, i) => (i > 0 && !t.startsWith('-') ? '+' + t : t)).join('');
  }
  /** (x − d) */
  const klammerX = (d) => (d.z === 0 ? 'x' : d.vgl(0) > 0 ? `(x-${zt(d)})` : `(x+${zt(d.neg())})`);
  /** Scheitelform a·(x − d)² + e */
  function scheitelTex(a, d, e) {
    const k = klammerX(d);
    const quad = d.z === 0 ? 'x^2' : `${k}^2`;
    let t = a.gleich(1) ? quad : a.gleich(-1) ? '-' + quad : `${zt(a)}\\cdot ${quad}`;
    if (e.z !== 0) t += e.vgl(0) > 0 ? '+' + zt(e) : zt(e);
    return t;
  }
  const kurz = (b) => zt(b).replace('{,}', ',');

  // ---------- Koordinatensystem mit Parabel (SVG) ----------
  /**
   * parabelSvg(f, { xmin, xmax, ymin, ymax, punkte:[{x,y,text}], klein })
   * f: Funktion x → y (Gleitkomma)
   */
  let clipNr = 0;
  function parabelSvg(f, o = {}) {
    const clip = 'ks-clip-' + ++clipNr;
    const xmin = o.xmin ?? -6, xmax = o.xmax ?? 6, ymin = o.ymin ?? -6, ymax = o.ymax ?? 6;
    const e = o.klein ? 16 : 26;
    const rand = 14;
    const W = (xmax - xmin) * e + 2 * rand;
    const H = (ymax - ymin) * e + 2 * rand;
    const X = (x) => rand + (x - xmin) * e;
    const Y = (y) => rand + (ymax - y) * e;
    let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Graph einer Parabel"${o.klein ? ' class="klein"' : ''}>`;
    for (let x = xmin; x <= xmax; x++) s += `<line x1="${X(x)}" y1="${Y(ymin)}" x2="${X(x)}" y2="${Y(ymax)}" class="ks-gitter"/>`;
    for (let y = ymin; y <= ymax; y++) s += `<line x1="${X(xmin)}" y1="${Y(y)}" x2="${X(xmax)}" y2="${Y(y)}" class="ks-gitter"/>`;
    s += `<line x1="${X(xmin)}" y1="${Y(0)}" x2="${X(xmax) + 6}" y2="${Y(0)}" class="ks-achse"/><line x1="${X(0)}" y1="${Y(ymin)}" x2="${X(0)}" y2="${Y(ymax) - 6}" class="ks-achse"/>`;
    s += `<text x="${X(xmax) + 4}" y="${Y(0) - 6}" class="ks-text">x</text><text x="${X(0) + 6}" y="${Y(ymax) - 2}" class="ks-text">y</text>`;
    if (!o.klein) {
      for (let x = xmin + 1; x < xmax; x++) if (x !== 0 && x % 2 === 0) s += `<text x="${X(x)}" y="${Y(0) + 15}" class="ks-zahl">${String(x).replace('-', '−')}</text>`;
      for (let y = ymin + 1; y < ymax; y++) if (y !== 0 && y % 2 === 0) s += `<text x="${X(0) - 5}" y="${Y(y) + 4}" class="ks-zahl ks-links">${String(y).replace('-', '−')}</text>`;
    }
    const pkt = [];
    for (let i = 0; i <= 240; i++) {
      const x = xmin + ((xmax - xmin) * i) / 240;
      const y = f(x);
      if (y >= ymin - 1 && y <= ymax + 1) pkt.push(`${X(x).toFixed(1)},${Y(y).toFixed(1)}`);
      else if (pkt.length && pkt[pkt.length - 1] !== '|') pkt.push('|');
    }
    const zuege = pkt.join(' ').split('|').map((t) => t.trim()).filter((t) => t.includes(' '));
    s += `<defs><clipPath id="${clip}"><rect x="${X(xmin)}" y="${Y(ymax)}" width="${(xmax - xmin) * e}" height="${(ymax - ymin) * e}"/></clipPath></defs>`;
    for (const z of zuege) s += `<polyline points="${z}" class="ks-graph" clip-path="url(#${clip})"/>`;
    for (const p of o.punkte || []) {
      s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="4" class="ks-punkt"/>`;
      if (p.text) s += `<text x="${X(p.x) + 7}" y="${Y(p.y) - 7}" class="ks-ptext">${p.text}</text>`;
    }
    return s + '</svg>';
  }

  // =====================================================================
  // K5 Parameter und Scheitelform
  // =====================================================================

  const BESCHREIBUNG = {
    og: 'nach oben geöffnet und gestreckt',
    oc: 'nach oben geöffnet und gestaucht',
    ug: 'nach unten geöffnet und gestreckt',
    uc: 'nach unten geöffnet und gestaucht',
    n: 'Normalparabel',
    nu: 'an der x-Achse gespiegelte Normalparabel (nach unten geöffnet, Form wie die Normalparabel)',
  };
  function form(a) {
    if (a.gleich(1)) return 'n';
    if (a.gleich(-1)) return 'nu';
    const oben = a.vgl(0) > 0;
    const gestreckt = a.abs().vgl(1) > 0;
    return (oben ? 'o' : 'u') + (gestreckt ? 'g' : 'c');
  }

  gen['qf-streckfaktor'] = (stufe) => {
    if (stufe < 3) {
      const a = stufe === 1
        ? R.wahl([B(2), B(3), B(4), B(-2), B(-3), B(1), B(-1), B(1, 2), B(-1, 2)])
        : R.wahl([B(R.int(11, 40), 10), B(-R.int(11, 40), 10), B(R.int(1, 9), 10), B(-R.int(1, 9), 10), B(1, 3), B(-1, 4), B(5, 2), B(-3, 2), B(2, 3)]);
      const richtig = form(a);
      const schluessel = ['og', 'oc', 'ug', 'uc', 'n', 'nu'];
      const optionen = schluessel.map((k) => BESCHREIBUNG[k]);
      return {
        frage: `Beschreibe den Graphen von ${$(`f(x)=${koeff(a, 'x^2')}`)} im Vergleich zur Normalparabel.`,
        felder: [{ art: 'auswahl', optionen, richtig: schluessel.indexOf(richtig) }],
        hinweis: 'Das Vorzeichen von a entscheidet über die Öffnung. Ist der Betrag von a größer als 1, ist die Parabel gestreckt (schmaler), ist er zwischen 0 und 1, ist sie gestaucht (breiter).',
        loesung: [`${$(`a=${zt(a)}`)}: ${BESCHREIBUNG[richtig]}.`, { svg: parabelSvg((x) => a.zahl() * x * x, { punkte: [] }) }],
      };
    }
    // Stufe 3: Welche Parabel ist am schmalsten / breitesten?
    const werte = R.mische([B(3), B(-1, 2), B(5, 4), B(-2), B(1, 3), B(-7, 10), B(-5, 2), B(9, 10)]).slice(0, 4);
    const schmal = Math.random() < 0.5;
    const ziel = werte.reduce((m, w) => (schmal ? (w.abs().vgl(m.abs()) > 0 ? w : m) : (w.abs().vgl(m.abs()) < 0 ? w : m)));
    const optionen = werte.map((w) => $(`f(x)=${koeff(w, 'x^2')}`));
    return {
      frage: `Welche der Parabeln ist am ${schmal ? 'schmalsten (am stärksten gestreckt)' : 'breitesten (am stärksten gestaucht)'}?`,
      felder: [{ art: 'auswahl', optionen, richtig: werte.indexOf(ziel) }],
      hinweis: 'Nur der Betrag von a entscheidet über die Form – das Vorzeichen bestimmt nur, ob die Parabel nach oben oder unten geöffnet ist.',
      loesung: [`Vergleiche die Beträge: ${werte.map((w) => $(`|${zt(w)}|=${zt(w.abs())}`)).join(', ')}. Am ${schmal ? 'größten' : 'kleinsten'} ist er bei ${$(`a=${zt(ziel)}`)}.`],
    };
  };

  gen['qf-scheitelpunkt'] = (stufe) => {
    let a, d, e;
    if (stufe === 1) { a = B(1); d = B(R.int(-6, 6)); e = B(R.int(-6, 6)); }
    else if (stufe === 2) { a = R.wahl([B(2), B(-1), B(-3), B(1, 2), B(-1, 2), B(4)]); d = B(R.nz(-8, 8)); e = B(R.int(-9, 9)); }
    else {
      a = R.wahl([B(-2), B(3, 10), B(-5, 4), B(2, 3), B(-1)]);
      d = R.wahl([B(R.nz(-9, 9), 2), B(R.nz(-30, 30), 10)]);
      e = R.wahl([B(0), B(R.nz(-20, 20), 4), B(R.nz(-9, 9))]);
    }
    return {
      frage: `Gib den Scheitelpunkt der Parabel an.`,
      term: `f(x)=${scheitelTex(a, d, e)}`,
      felder: [{ art: 'zahl', label: '$x_S$', antwort: d }, { art: 'zahl', label: '$y_S$', antwort: e }],
      hinweis: `In der Scheitelform ${$('f(x)=a\\cdot(x-d)^2+e')} ist ${$('S(d|e)')}. Achtung: Aus ${$('(x+3)^2')} wird ${$('d=-3')}.`,
      loesung: [`${$(`S(${zt(d)}\\,|\\,${zt(e)})`)}${stufe > 1 && d.vgl(0) < 0 ? `, denn ${$(`${klammerX(d)}=(x-(${zt(d)}))`)}` : ''}.`],
    };
  };

  gen['qf-graph-zuordnen'] = (stufe) => {
    const aW = stufe === 1 ? [B(1), B(-1)] : [B(1), B(-1), B(2), B(-2), B(1, 2), B(-1, 2)];
    const a = R.wahl(aW);
    const d = B(R.int(-3, 3));
    const e = B(stufe === 1 ? R.int(-3, 3) : R.int(-4, 4));
    // Ablenker: Vorzeichenfehler bei d, e, a; anderer Streckfaktor
    const kand = [[a, d, e], [a, d.neg(), e], [a, d, e.neg()], [a.neg(), d, e], [a.mal(2), d, e], [a, e, d]];
    const eindeutig = [];
    for (const k of kand) if (!eindeutig.some((m) => m[0].gleich(k[0]) && m[1].gleich(k[1]) && m[2].gleich(k[2]))) eindeutig.push(k);
    const auswahl = [eindeutig[0], ...R.mische(eindeutig.slice(1)).slice(0, 3)];
    const reihenfolge = R.mische(auswahl.map((_, i) => i));
    const f = ([aa, dd, ee]) => (x) => aa.zahl() * (x - dd.zahl()) ** 2 + ee.zahl();
    if (stufe < 3) {
      return {
        frage: 'Welche Funktionsgleichung gehört zum Graphen?',
        bild: parabelSvg(f(auswahl[0]), { punkte: [{ x: d.zahl(), y: e.zahl() }] }),
        felder: [{ art: 'auswahl', optionen: reihenfolge.map((i) => $(`f(x)=${scheitelTex(...auswahl[i])}`)), richtig: reihenfolge.indexOf(0) }],
        hinweis: 'Lies zuerst den Scheitelpunkt ab. Prüfe dann, ob die Parabel nach oben oder unten geöffnet ist, und gehe vom Scheitel eine Einheit nach rechts: Um wie viel ändert sich y? Das ist a.',
        loesung: [`Scheitelpunkt ${$(`S(${zt(d)}\\,|\\,${zt(e)})`)}, Streckfaktor ${$(`a=${zt(a)}`)}: ${$(`f(x)=${scheitelTex(a, d, e)}`)}.`],
      };
    }
    return {
      frage: `Welcher Graph gehört zu ${$(`f(x)=${scheitelTex(a, d, e)}`)}?`,
      felder: [{ art: 'auswahl', optionen: reihenfolge.map((i) => parabelSvg(f(auswahl[i]), { klein: true, xmin: -5, xmax: 5, ymin: -5, ymax: 5 })), richtig: reihenfolge.indexOf(0) }],
      hinweis: 'Bestimme den Scheitelpunkt aus der Gleichung, dann Öffnung und Form.',
      loesung: [`Scheitelpunkt ${$(`S(${zt(d)}\\,|\\,${zt(e)})`)}, ${BESCHREIBUNG[form(a)]}.`],
    };
  };

  // =====================================================================
  // K6 Charakteristische Punkte
  // =====================================================================

  const PUNKTE = [
    { id: 'y', name: 'den Schnittpunkt mit der y-Achse', ohne: '$x=0$ einsetzen und $y$ ausrechnen', cas: 'f(0)' },
    { id: 'null', name: 'die Schnittpunkte mit der x-Achse (Nullstellen)', ohne: '$f(x)=0$ setzen und nach $x$ auflösen', cas: 'solve(f(x)=0,x)' },
    { id: 's', name: 'den Scheitelpunkt', ohne: '$f(x)$ in die Scheitelform umformen', cas: 'completeSquare(f(x),x)' },
    { id: 'pa', name: 'die y-Koordinate des Punktes $P(3\\,|\\,?)$', ohne: '$x=3$ einsetzen und $y$ ausrechnen', cas: 'f(3)' },
    { id: 'pb', name: 'die x-Koordinate(n) der Punkte $Q(?\\,|\\,2{,}5)$', ohne: '$2{,}5$ für $f(x)$ einsetzen und die Gleichung nach $x$ auflösen', cas: 'solve(f(x)=2.5,x)' },
  ];
  /** CAS-Eingabe als Code (nicht als Formel) */
  const cas = (c) => `<code class="cas">${c.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</code>`;

  gen['qf-ansatz'] = (stufe) => {
    const ziel = R.wahl(PUNKTE);
    const andere = R.mische(PUNKTE.filter((p) => p !== ziel)).slice(0, 3);
    const auswahl = R.mische([ziel, ...andere]);
    if (stufe === 1) {
      return {
        frage: `Gesucht ist ${ziel.name} einer Parabel. Welcher Ansatz passt <b>ohne</b> CAS?`,
        felder: [{ art: 'auswahl', optionen: auswahl.map((p) => p.ohne), richtig: auswahl.indexOf(ziel) }],
        hinweis: 'Überlege: Welche Koordinate ist bekannt? Auf der y-Achse ist x = 0, auf der x-Achse ist y = 0.',
        loesung: [`Ansatz: ${ziel.ohne}.`],
      };
    }
    if (stufe === 2) {
      return {
        frage: `Die Funktion ist in der CAS-App als ${cas('f(x):=…')} definiert. Gesucht ist ${ziel.name}. Welcher Befehl passt?`,
        felder: [{ art: 'auswahl', optionen: auswahl.map((p) => cas(p.cas)), richtig: auswahl.indexOf(ziel) }],
        hinweis: 'solve löst eine Gleichung, completeSquare formt in die Scheitelform um, f(…) berechnet einen Funktionswert.',
        loesung: [`Befehl: ${cas(ziel.cas)} (ohne CAS: ${ziel.ohne}).`],
      };
    }
    // Stufe 3: umgekehrt – Befehl/Ansatz gegeben, was wird berechnet?
    const mitCas = Math.random() < 0.5;
    return {
      frage: `Was wird mit ${mitCas ? `dem Befehl ${cas(ziel.cas)}` : `dem Ansatz „${ziel.ohne}“`} berechnet?`,
      felder: [{ art: 'auswahl', optionen: auswahl.map((p) => p.name.charAt(0).toUpperCase() + p.name.slice(1)), richtig: auswahl.indexOf(ziel) }],
      hinweis: 'Überlege, welche Koordinate bei dem Ansatz bekannt ist und welche gesucht wird.',
      loesung: [`Berechnet wird ${ziel.name}.`],
    };
  };

  /** zufällige Normalform mit „schönen“ Koeffizienten */
  function normalform(stufe) {
    if (stufe === 1) return [B(R.nz(-3, 3)), B(R.int(-6, 6)), B(R.int(-9, 9))];
    if (stufe === 2) return [B(R.nz(-9, 9), R.wahl([2, 10])), B(R.nz(-20, 20), R.wahl([1, 2])), B(R.int(-30, 30), 10)];
    return [B(R.nz(-5, 5), R.wahl([3, 4])), B(R.nz(-8, 8), R.wahl([1, 2, 3])), B(R.int(-12, 12), R.wahl([1, 4]))];
  }
  const fWert = (a, b, c, x) => a.mal(x).mal(x).plus(b.mal(x)).plus(c);
  /** Einsetzen sichtbar machen: a·(x₀)² + b·(x₀) + c */
  function einsetzTex(a, b, c, x0) {
    const xt = x0.vgl(0) < 0 || !x0.istGanz() ? `(${zt(x0)})` : zt(x0);
    const teile = [];
    if (a.z !== 0) teile.push(a.gleich(1) ? `${xt}^2` : a.gleich(-1) ? `-${xt}^2` : `${zt(a)}\\cdot ${xt}^2`);
    if (b.z !== 0) teile.push(`${zt(b)}\\cdot ${xt}`);
    if (c.z !== 0) teile.push(zt(c));
    return teile.map((t, i) => (i > 0 && !t.startsWith('-') ? '+' + t : t)).join('');
  }

  gen['qf-funktionswert'] = (stufe) => {
    const [a, b, c] = normalform(stufe);
    const x0 = stufe === 1 ? B(R.nz(-3, 3)) : stufe === 2 ? B(R.nz(-4, 4)) : R.wahl([B(R.nz(-3, 3)), B(R.nz(-5, 5), 2)]);
    const y0 = fWert(a, b, c, x0);
    if (stufe === 3 && Math.random() < 0.5) {
      // Liegt der Punkt auf dem Graphen?
      const liegt = Math.random() < 0.5;
      const yP = liegt ? y0 : y0.plus(B(R.nz(-3, 3), R.wahl([1, 2])));
      return {
        frage: `Prüfe ohne CAS, ob der Punkt ${$(`P(${zt(x0)}\\,|\\,${zt(yP)})`)} auf dem Graphen von ${$(`f(x)=${polyTex(a, b, c)}`)} liegt.`,
        felder: [{ art: 'zahl', label: lab(`f(${zt(x0)})`), antwort: y0 }, { art: 'auswahl', label: 'Also', optionen: ['$P$ liegt auf dem Graphen.', '$P$ liegt nicht auf dem Graphen.'], richtig: liegt ? 0 : 1 }],
        hinweis: 'Setze die x-Koordinate ein und vergleiche das Ergebnis mit der y-Koordinate.',
        notiz: true,
        loesung: [$(`f(${zt(x0)})=${einsetzTex(a, b, c, x0)}=${zt(y0)}`), liegt ? 'Das ist die y-Koordinate von P: P liegt auf dem Graphen.' : `${$(`${zt(y0)}\\neq ${zt(yP)}`)}: P liegt nicht auf dem Graphen.`],
      };
    }
    return {
      frage: `Gegeben ist ${$(`f(x)=${polyTex(a, b, c)}`)}. Berechne ohne CAS den Schnittpunkt mit der y-Achse ${$('C(0\\,|\\,?)')} und die fehlende Koordinate von ${$(`P(${zt(x0)}\\,|\\,?)`)}.`,
      felder: [{ art: 'zahl', label: lab('f(0)'), antwort: c }, { art: 'zahl', label: lab(`f(${zt(x0)})`), antwort: y0 }],
      hinweis: `Setze ${$('x=0')} bzw. ${$(`x=${zt(x0)}`)} ein. Negative Zahlen beim Einsetzen in Klammern schreiben – und erst quadrieren, dann mit a multiplizieren.`,
      notiz: stufe > 1,
      loesung: [
        `${$(`f(0)=${zt(c)}`)}, also ${$(`C(0\\,|\\,${zt(c)})`)} – das ist immer das absolute Glied c.`,
        `${$(`f(${zt(x0)})=${einsetzTex(a, b, c, x0)}=${zt(y0)}`)}, also ${$(`P(${zt(x0)}\\,|\\,${zt(y0)})`)}.`,
      ],
    };
  };

  // =====================================================================
  // K7 Anwendungen mit der CAS-App (Ergebnisse nicht glatt)
  // =====================================================================

  const SITUATIONEN = [
    { text: 'Ein Basketball wird geworfen. Seine Flugbahn lässt sich näherungsweise durch', x: 'waagerechte Entfernung vom Abwurfpunkt', y: 'Höhe', start: 'Abwurfhöhe', weit: 'Wie weit vom Abwurfpunkt entfernt würde der Ball auf dem Boden aufkommen?', xs: [3, 6], ys: [3.5, 5], c: [1.8, 2.3] },
    { text: 'Beim Kugelstoßen lässt sich die Flugbahn der Kugel näherungsweise durch', x: 'waagerechte Entfernung vom Abstoß', y: 'Höhe', start: 'Abstoßhöhe', weit: 'Wie weit vom Abstoß entfernt kommt die Kugel auf dem Boden auf?', xs: [6, 9], ys: [3.5, 5.5], c: [1.8, 2.2] },
    { text: 'Ein Wasserstrahl aus einem Gartenschlauch lässt sich näherungsweise durch', x: 'waagerechte Entfernung von der Düse', y: 'Höhe', start: 'Höhe der Düse', weit: 'Wie weit von der Düse entfernt trifft das Wasser auf den Boden?', xs: [2, 4], ys: [1.6, 2.8], c: [0.6, 1.2] },
    { text: 'Beim Disc Golf lässt sich die Flugbahn einer Scheibe näherungsweise durch', x: 'waagerechte Entfernung von der Abwurflinie', y: 'Höhe', start: 'Abwurfhöhe', weit: 'Wie weit von der Abwurflinie entfernt würde die Scheibe den Boden berühren?', xs: [40, 70], ys: [7, 12], c: [1, 1.5] },
  ];
  const rund = (x, n) => Math.round(x * 10 ** n) / 10 ** n;
  const dezTex = (x, n) => UM.naeherungText(x, n).replace('−', '-').replace(',', '{,}');
  /** Dezimalzahl ohne überflüssige Nullen (Gleitkomma, höchstens n Stellen) */
  const dezKurz = (x, n) => UM.naeherungText(x, n).replace(/(,\d*?)0+$/, '$1').replace(/,$/, '');
  /** a·x²+b·x+c als TeX mit Dezimalzahlen */
  function dezPoly(a, b, c, n) {
    const t = (v, k) => dezKurz(Math.abs(v), k).replace(',', '{,}');
    return `${a < 0 ? '-' : ''}${t(a, n)}x^2${b < 0 ? '-' : '+'}${t(b, 3)}x${c < 0 ? '-' : '+'}${t(c, 1)}`;
  }
  /** Zahl für die CAS-Eingabe: Dezimalpunkt */
  const casZahl = (x, n) => dezKurz(x, n).replace(',', '.').replace('−', '-');

  gen['qf-cas-anwendung'] = (stufe) => {
    const s = R.wahl(SITUATIONEN);
    const xs = s.xs[0] + Math.random() * (s.xs[1] - s.xs[0]);
    const ys = s.ys[0] + Math.random() * (s.ys[1] - s.ys[0]);
    const c = rund(s.c[0] + Math.random() * (s.c[1] - s.c[0]), 1);
    const aRoh = (c - ys) / (xs * xs);
    const na = xs > 20 ? 5 : 4;
    const a = rund(aRoh, na);
    const b = rund(-2 * aRoh * xs, 3);
    const f = (x) => a * x * x + b * x + c;
    const xS = -b / (2 * a);
    const yS = f(xS);
    const disk = (h) => b * b - 4 * a * (c - h);
    const loes = (h) => { const d = Math.sqrt(disk(h)); return [(-b + d) / (2 * a), (-b - d) / (2 * a)].sort((p, q) => p - q); };
    const weite = loes(0)[1];
    const fTex = `f(x)=${dezPoly(a, b, c, na)}`;
    const intro = `${s.text} ${$(fTex)} beschreiben (${$('x')}: ${s.x} in m, ${$('f(x)')}: ${s.y} in m). Nutze die CAS-App und runde auf zwei Nachkommastellen.`;
    const def = `Definiere zuerst ${cas(`f(x):=${casZahl(a, na)}*x^2+${casZahl(b, 3)}*x+${casZahl(c, 1)}`.replace(/\+-/g, '-'))}.`;
    const nf = (label, wert) => ({ art: 'naeherung', label, wert, stellen: 2, einheit: 'm' });
    if (stufe === 1) {
      const x1 = rund(xS * (0.4 + Math.random() * 1.2), xS > 20 ? 0 : 1);
      return {
        frage: `${intro} (1) Wie groß ist die ${s.start}? (2) Welche Höhe hat die Flugbahn bei ${$(`x=${dezTex(x1, xS > 20 ? 0 : 1)}`)} m?`,
        felder: [nf('(1)', c), nf('(2)', f(x1))],
        hinweis: `${def} Die ${s.start} ist ${$('f(0)')}. Für (2) berechnest du ${cas(`f(${casZahl(x1, 1)})`)}. In der CAS-App wird ein Dezimalpunkt statt eines Kommas verwendet.`,
        loesung: [`(1) ${$(`f(0)=${dezTex(c, 1)}`)} m`, `(2) ${cas(`f(${casZahl(x1, 1)})`)} ${$(`\\approx ${dezTex(f(x1), 2)}`)} m`],
      };
    }
    if (stufe === 2) {
      const h = rund(c + (yS - c) * (0.3 + Math.random() * 0.5), 1);
      const [x1, x2] = loes(h);
      return {
        frage: `${intro} (1) ${s.weit} (2) In welchen Entfernungen hat die Flugbahn eine Höhe von ${$(dezTex(h, 1))} m?`,
        felder: [nf('(1) Entfernung', weite), nf('(2) kleinere Entfernung', x1), nf('(2) größere Entfernung', x2)],
        hinweis: `${def} Für (1) löst du ${cas('solve(f(x)=0,x)')} und nimmst die positive Lösung. Für (2) löst du ${cas(`solve(f(x)=${casZahl(h, 1)},x)`)}.`,
        loesung: [
          `(1) ${cas('solve(f(x)=0,x)')}: ${$(`x\\approx ${dezTex(loes(0)[0], 2)}`)} oder ${$(`x\\approx ${dezTex(weite, 2)}`)}. Nur die positive Lösung passt: etwa ${dezTex(weite, 2).replace('{,}', ',')} m.`,
          `(2) ${cas(`solve(f(x)=${casZahl(h, 1)},x)`)}: ${$(`x\\approx ${dezTex(x1, 2)}`)} oder ${$(`x\\approx ${dezTex(x2, 2)}`)}.`,
        ],
      };
    }
    // Stufe 3: Scheitelpunkt (höchster Punkt) und Hindernis
    const xH = rund(xS * (1.1 + Math.random() * 0.5), xS > 20 ? 0 : 1);
    const hoeheH = f(xH);
    return {
      frage: `${intro} (1) Wie hoch ist der höchste Punkt der Flugbahn und in welcher Entfernung wird er erreicht? (2) In ${$(dezTex(xH, xS > 20 ? 0 : 1))} m Entfernung steht ein Hindernis. Wie hoch darf es höchstens sein, damit die Flugbahn darüber hinweggeht?`,
      felder: [nf('(1) Höhe', yS), nf('(1) Entfernung', xS), nf('(2) Höhe', hoeheH)],
      hinweis: `${def} Den höchsten Punkt (Scheitelpunkt) bekommst du mit ${cas('completeSquare(f(x),x)')}: Lies ${$('S(d|e)')} aus der Scheitelform ab. Für (2) berechnest du den Funktionswert an der Stelle des Hindernisses.`,
      loesung: [
        `(1) ${cas('completeSquare(f(x),x)')} liefert ${$(`${dezTex(a, na)}\\cdot(x-${dezTex(xS, 2)})^2+${dezTex(yS, 2)}`)} (gerundet), also ${$(`S(${dezTex(xS, 2)}\\,|\\,${dezTex(yS, 2)})`)}: höchster Punkt etwa ${dezTex(yS, 2).replace('{,}', ',')} m bei etwa ${dezTex(xS, 2).replace('{,}', ',')} m.`,
        `(2) ${$(`f(${dezTex(xH, 1)})\\approx ${dezTex(hoeheH, 2)}`)} – das Hindernis muss niedriger als etwa ${dezTex(hoeheH, 2).replace('{,}', ',')} m sein.`,
      ],
    };
  };

  // =====================================================================
  // K8 Nullstellen bei f(x) = a·x² + c (reinquadratisch)
  // =====================================================================

  gen['qf-reinquadratisch'] = (stufe) => {
    let a, c, loesung;
    if (stufe === 1) {
      a = B(1);
      const r = R.int(1, 12);
      c = B(-r * r);
      loesung = [B(r), B(-r)];
      if (Math.random() < 0.2) { c = B(r * r); loesung = []; }
    } else if (stufe === 2) {
      const fall = R.wahl(['zwei', 'zwei', 'zwei', 'bruch', 'keine', 'eine']);
      a = B(R.nz(-5, 5));
      if (fall === 'eine') { c = B(0); loesung = [B(0)]; }
      else if (fall === 'keine') { c = B(a.vz() * R.int(1, 20)); loesung = []; }
      else {
        const r = fall === 'bruch' ? B(R.int(1, 7), R.wahl([2, 3])) : B(R.int(1, 6));
        if (r.istGanz() === false && a.abs().gleich(1)) a = B(4 * a.vz());
        c = a.mal(r).mal(r).neg();
        if (!c.istGanz()) { a = a.mal(r.n * r.n); c = a.mal(r).mal(r).neg(); }
        loesung = [r, r.neg()];
      }
    } else {
      const fall = R.wahl(['wurzel', 'wurzel', 'dezimal', 'keine']);
      if (fall === 'wurzel') {
        const n = R.wahl([2, 3, 5, 6, 7, 8, 10, 12, 18, 20, 27, 50]);
        a = B(R.wahl([1, 2, 3, -1, -2, 5]));
        c = a.mal(n).neg();
        const w = new Wurzel(1, n);
        loesung = [w, w.neg()];
      } else if (fall === 'dezimal') {
        const r = B(R.int(2, 9), 10);
        a = R.wahl([B(1), B(4), B(-2)]);
        c = a.mal(r).mal(r).neg();
        if (!c.istEndlichDezimal()) c = c.neg();
        loesung = [r, r.neg()];
      } else {
        a = B(R.nz(-5, 5), R.wahl([1, 2]));
        c = B(a.vz() * R.int(1, 30), 10);
        loesung = [];
      }
    }
    const fTex = polyTex(a, B(0), c);
    const rhs = c.neg().durch(a);
    return {
      frage: `Berechne ohne CAS die Nullstellen von ${$(`f(x)=${fTex}`)} und gib die Lösungsmenge an.`,
      felder: [mengeFeld(loesung)],
      hinweis: `Setze ${$('f(x)=0')} und forme so um, dass ${$('x^2')} allein steht. Hat ${$('x^2=r')} mit ${$('r>0')} zwei Lösungen ${$('\\pm\\sqrt{r}')}? Was passiert bei ${$('r<0')} und ${$('r=0')}? Wurzeln gibst du so ein: √5 oder 2√3. Leere Menge: {}`,
      notiz: stufe > 1,
      loesung: [
        $(a.gleich(1) ? `${fTex}=0\\;\\Leftrightarrow\\; x^2=${zt(rhs)}` : `${fTex}=0\\;\\Leftrightarrow\\; ${koeff(a, 'x^2')}=${zt(c.neg())}\\;\\Leftrightarrow\\; x^2=${zt(rhs)}`),
        rhs.vgl(0) < 0
          ? `Ein Quadrat ist nie negativ: keine Lösung, ${$('\\mathbb{L}=\\{\\,\\}')}. Die Parabel hat keine Nullstelle.`
          : rhs.z === 0 ? `Nur ${$('x=0')}: ${$('\\mathbb{L}=\\{0\\}')} (eine Nullstelle, der Scheitel liegt auf der x-Achse).`
            : `${$(`x=\\sqrt{${zt(rhs)}}\\;\\vee\\; x=-\\sqrt{${zt(rhs)}}`)}, also ${$(`\\mathbb{L}=${UM.mengeTex(loesung)}`)}.`,
        loesung.length ? `Schnittpunkte mit der x-Achse: ${loesung.map((w) => $(`(${UM.Wurzel.von(w).tex()}\\,|\\,0)`)).join(' und ')}.` : '',
      ].filter(Boolean),
    };
  };

  // =====================================================================
  // K9 Satz vom Nullprodukt
  // =====================================================================

  /** Faktor (p·x − q) als TeX; p=1 → x − q */
  const linTex = (p, q) => (q.z === 0 ? koeff(p, 'x') : `${koeff(p, 'x')}${q.vgl(0) > 0 ? '-' + zt(q) : '+' + zt(q.neg())}`);

  gen['qf-nullprodukt'] = (stufe) => {
    // Produkt gegeben → SvN direkt anwenden
    let faktoren; // [[p, q]] mit Nullstelle q/p
    if (stufe === 1) faktoren = [[B(1), B(0)], [B(1), B(R.nz(-9, 9))]];
    else if (stufe === 2) faktoren = [[B(1), B(R.nz(-9, 9))], [B(1), B(R.nz(-9, 9))]];
    else faktoren = [[B(R.int(2, 5)), B(R.nz(-9, 9))], [B(R.wahl([1, 2, 3])), B(R.nz(-7, 7))]];
    if (faktoren[0][1].durch(faktoren[0][0]).gleich(faktoren[1][1].durch(faktoren[1][0]))) return gen['qf-nullprodukt'](stufe);
    if (stufe === 3 && Math.random() < 0.4) faktoren.unshift([B(R.wahl([2, 3, -4])), null]);
    const teile = faktoren.map(([p, q]) => (q === null ? zt(p) : faktoren.length > 1 ? `(${linTex(p, q)})` : linTex(p, q)));
    // ganze Zahl als Vorfaktor ohne Klammern; „x“ allein ohne Klammern
    const tex = teile.map((t, i) => (faktoren[i][1] !== null && faktoren[i][1].z === 0 && faktoren[i][0].gleich(1) ? 'x' : t)).join('\\cdot ');
    const loesung = faktoren.filter(([, q]) => q !== null).map(([p, q]) => q.durch(p));
    return {
      frage: 'Löse die Gleichung mit dem Satz vom Nullprodukt und gib die Lösungsmenge an.',
      term: `${tex}=0`,
      felder: [mengeFeld(loesung)],
      hinweis: 'Ein Produkt ist genau dann 0, wenn mindestens einer seiner Faktoren 0 ist. Setze jeden Faktor, der x enthält, gleich 0.',
      notiz: stufe > 1,
      loesung: [
        $(faktoren.filter(([, q]) => q !== null).map(([p, q]) => `${linTex(p, q)}=0`).join('\\;\\vee\\;')),
        $(`\\mathbb{L}=${UM.mengeTex(loesung)}`),
      ],
    };
  };

  gen['qf-ausklammern'] = (stufe) => {
    // Nullstellen von a·x² + b·x
    let a, b;
    if (stufe === 1) { a = B(R.wahl([1, -1])); b = B(R.nz(-12, 12)); }
    else if (stufe === 2) { a = B(R.nz(-6, 6)); b = B(R.nz(-15, 15)); if (a.abs().gleich(1)) a = a.mal(R.int(2, 5)); }
    else { a = R.wahl([B(R.nz(-4, 4), 2), B(R.nz(-3, 3), 4), B(R.nz(-9, 9), 10), B(R.nz(-5, 5), 3)]); b = R.wahl([B(R.nz(-9, 9)), B(0), B(R.nz(-9, 9), 2)]); }
    const x2 = b.neg().durch(a);
    const loesung = b.z === 0 ? [B(0)] : [B(0), x2];
    // Darstellung: in Stufe 3 manchmal „b·x + a·x²“
    const vertauscht = stufe === 3 && b.z !== 0 && Math.random() < 0.4;
    const fTex = vertauscht ? (`${koeff(b, 'x')}${a.vgl(0) > 0 ? '+' : ''}${koeff(a, 'x^2')}`) : polyTex(a, b, B(0));
    return {
      frage: `Berechne ohne CAS die Nullstellen von ${$(`f(x)=${fTex}`)} und gib die Lösungsmenge an.`,
      felder: [mengeFeld(loesung)],
      hinweis: `Setze ${$('f(x)=0')}, klammere ${$('x')} aus und wende den Satz vom Nullprodukt an.`,
      notiz: true,
      loesung: b.z === 0
        ? [$(`${fTex}=0\\;\\Leftrightarrow\\; x^2=0\\;\\Leftrightarrow\\; x=0`), $('\\mathbb{L}=\\{0\\}')]
        : [
          $(`${polyTex(a, b, B(0))}=0\\;\\Leftrightarrow\\; x\\cdot(${polyTex(B(0), a, b)})=0`),
          $(`\\Leftrightarrow\\; x=0\\;\\vee\\; ${polyTex(B(0), a, b)}=0\\;\\Leftrightarrow\\; x=0\\;\\vee\\; x=${zt(x2)}`),
          `${$(`\\mathbb{L}=${UM.mengeTex(loesung)}`)}, Schnittpunkte mit der x-Achse ${$('(0\\,|\\,0)')} und ${$(`(${zt(x2)}\\,|\\,0)`)}.`,
        ],
    };
  };

  gen['qf-nullstellen-gemischt'] = (stufe) => {
    // Welches Verfahren passt? Dann lösen.
    const typ = R.wahl(['rein', 'svn']);
    const a = gen[typ === 'rein' ? 'qf-reinquadratisch' : 'qf-ausklammern'](stufe);
    // f(x) = a·x² allein passt zu beiden Verfahren → neu würfeln
    if (a.felder[0].antwort.length === 1) return gen['qf-nullstellen-gemischt'](stufe);
    const optionen = ['$x^2$ allein stellen (reinquadratische Gleichung)', '$x$ ausklammern, dann Satz vom Nullprodukt'];
    return Object.assign(a, {
      frage: a.frage.replace('Berechne ohne CAS', 'Entscheide, welches Verfahren passt, und berechne ohne CAS'),
      felder: [{ art: 'auswahl', label: 'Verfahren', optionen, richtig: typ === 'rein' ? 0 : 1 }, ...a.felder],
      hinweis: `Fehlt das Glied mit ${$('x')} (Form ${$('ax^2+c')}), stellst du ${$('x^2')} allein. Fehlt die Zahl ohne ${$('x')} (Form ${$('ax^2+bx')}), klammerst du ${$('x')} aus.`,
    });
  };

  UM.parabelSvg = parabelSvg;
  UM.daten = Object.assign(UM.daten || {}, { polyTex, scheitelTex });
})(typeof window !== 'undefined' ? window : globalThis);
