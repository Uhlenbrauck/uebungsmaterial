/*
 * Aufgaben-Generatoren: CAS-Befehle sicher eingeben (TI-Nspire CAS, Klasse 10 und später)
 *
 * Befehle: f(x):=…, f(a), solve(…=…,x), completeSquare(…,x), factor(…)
 * Zusätzliche Feldart (siehe assets/js/cas.js):
 *   { art:'cas', soll, loesung, ausgabe, vorher }  soll: Prüfvorgabe, loesung: eine richtige Eingabe,
 *                                                ausgabe: Ausgabe der Rechner-Seite, vorher: Zeilen davor
 * Ausgaben der Rechner-Seite sind vereinfacht nachgebildet (6 gültige Stellen bei Dezimalzahlen).
 */
(function (global) {
  'use strict';
  const UM = (global.UM = global.UM || {});
  const R = UM.zufall;
  const gen = (UM.generatoren = UM.generatoren || {});
  const { casZahl } = UM.cas;

  const $ = (t) => `$${t}$`;
  const code = (c) => `<code class="cas">${String(c).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</code>`;
  const HINWEIS_AUSGABE = 'Die Ausgaben der Rechner-Seite sind hier vereinfacht dargestellt.';

  // ---------- Funktionen ----------
  /** Zahl im Term: Dezimalpunkt (CAS) bzw. Dezimalkomma (TeX) */
  const zp = (x) => casZahl(x, 8);
  const zk = (x) => zp(x).replace('.', '{,}');
  /** a·x²+b·x+c als CAS-Eingabe und als TeX */
  function terme(a, b, c) {
    const cas = [];
    const tex = [];
    const glied = (k, v, vTex) => {
      if (k === 0) return;
      const vz = k < 0 ? '-' : '+';
      const betrag = Math.abs(k);
      const kc = betrag === 1 && v ? '' : zp(betrag) + (v ? '*' : '');
      const kt = betrag === 1 && v ? '' : zk(betrag);
      cas.push(`${vz}${kc}${v}`);
      tex.push(`${vz}${kt}${vTex}`);
    };
    glied(a, 'x^2', 'x^2');
    glied(b, 'x', 'x');
    glied(c, '', '');
    const fertig = (l) => (l.join('').replace(/^\+/, '') || '0');
    return { cas: fertig(cas), tex: fertig(tex) };
  }

  /** Ganzzahlige Funktion mit ganzzahligen Nullstellen r1 < r2 und ganzzahligem Scheitel */
  function ganzF() {
    for (;;) {
      const a = R.wahl([1, 1, -1, 2, -2, 3]);
      const r1 = R.int(-6, 5);
      const r2 = r1 + 2 * R.int(1, 4);
      const b = -a * (r1 + r2);
      const c = a * r1 * r2;
      const d = (r1 + r2) / 2;
      const e = a * (d - r1) * (d - r2);
      return { a, b, c, r: [r1, r2], d, e, ganz: true, ...terme(a, b, c) };
    }
  }
  /** Sachfunktion mit Dezimalzahlen (Flugbahn), nicht glatte Ergebnisse */
  function dezF() {
    const xs = 3 + Math.random() * 6;
    const ys = 3 + Math.random() * 3;
    const c = Math.round((1 + Math.random() * 1.5) * 10) / 10;
    const a = Math.round(((c - ys) / (xs * xs)) * 10000) / 10000;
    const b = Math.round(-2 * a * xs * 1000) / 1000;
    const disk = b * b - 4 * a * c;
    const r = [(-b + Math.sqrt(disk)) / (2 * a), (-b - Math.sqrt(disk)) / (2 * a)].sort((p, q) => p - q);
    const d = -b / (2 * a);
    const e = c - (b * b) / (4 * a);
    return { a, b, c, r, d, e, ganz: false, ...terme(a, b, c) };
  }
  const wert = (F, x) => F.a * x * x + F.b * x + F.c;
  const loesungen = (F, h) => {
    const disk = F.b * F.b - 4 * F.a * (F.c - h);
    if (disk < -1e-12) return [];
    if (Math.abs(disk) < 1e-12) return [-F.b / (2 * F.a)];
    const w = Math.sqrt(disk);
    return [(-F.b + w) / (2 * F.a), (-F.b - w) / (2 * F.a)].sort((p, q) => p - q);
  };

  // ---------- Ausgaben wie auf der Rechner-Seite ----------
  const aus = {
    definition: () => 'Fertig',
    wert: (F, x) => casZahl(wert(F, x)),
    solve: (F, h) => {
      const l = loesungen(F, h);
      return l.length ? l.map((x) => `x=${casZahl(x)}`).join(' or ') : 'false';
    },
    completeSquare: (F) => {
      const k = F.d === 0 ? 'x' : F.d > 0 ? `(x-${casZahl(F.d)})` : `(x+${casZahl(-F.d)})`;
      const q = F.d === 0 ? 'x^2' : `${k}^2`;
      const vor = F.a === 1 ? q : F.a === -1 ? `-${q}` : `${casZahl(F.a)}*${q}`;
      const e = Math.abs(F.e) < 1e-12 ? '' : F.e > 0 ? `+${casZahl(F.e)}` : `${casZahl(F.e)}`;
      return vor + e;
    },
    factor: (F) => {
      const fak = F.r.map((r) => (r === 0 ? 'x' : r > 0 ? `(x-${r})` : `(x+${-r})`)).join('*');
      return F.a === 1 ? fak : F.a === -1 ? `-${fak}` : `${F.a}*${fak}`;
    },
  };
  const DEF = (F) => ({ ein: `f(x):=${F.cas}`, aus: 'Fertig' });

  // ---------- Befehle ----------
  const BEFEHLE = [
    { id: 'def', vorlage: 'f(x):=…', aufgabe: 'Die Funktion f in der App festlegen (definieren), damit man mit ihr rechnen kann.' },
    { id: 'wert', vorlage: 'f(…)', aufgabe: 'Den Funktionswert an einer bestimmten Stelle berechnen.' },
    { id: 'solve', vorlage: 'solve(…=…,x)', aufgabe: 'Die Stellen berechnen, an denen f einen bestimmten Wert hat (z. B. Nullstellen).' },
    { id: 'cs', vorlage: 'completeSquare(…,x)', aufgabe: 'Den Term in die Scheitelform umformen, um den Scheitelpunkt abzulesen.' },
    { id: 'factor', vorlage: 'factor(…)', aufgabe: 'Den Term in Faktoren zerlegen (z. B. um das Ausklammern zu kontrollieren).' },
  ];

  gen['cas-befehl-waehlen'] = (stufe) => {
    if (stufe === 1) {
      const ziel = R.wahl(BEFEHLE);
      const optionen = R.mische(BEFEHLE).slice(0, 4);
      if (!optionen.includes(ziel)) optionen[R.int(0, 3)] = ziel;
      return {
        frage: `Welcher Befehl der CAS-App passt? <b>${ziel.aufgabe}</b>`,
        felder: [{ art: 'auswahl', optionen: optionen.map((b) => code(b.vorlage)), richtig: optionen.indexOf(ziel) }],
        hinweis: 'solve löst Gleichungen, completeSquare liefert die Scheitelform, factor zerlegt in Faktoren, mit := wird definiert und f(…) berechnet einen Funktionswert.',
        loesung: [`${code(ziel.vorlage)} – ${ziel.aufgabe}`],
      };
    }
    // Stufe 2/3: Ausgabe gegeben – welche Eingabe hat sie erzeugt?
    const F = stufe === 2 ? ganzF() : dezF();
    const x0 = stufe === 2 ? R.int(-3, 4) : Math.round(Math.random() * 60) / 10;
    const h = stufe === 2 ? 0 : Math.round((F.c + 0.5) * 10) / 10;
    const kand = [
      { ein: `solve(f(x)=${casZahl(h)},x)`, aus: aus.solve(F, h) },
      { ein: 'completeSquare(f(x),x)', aus: aus.completeSquare(F) },
      { ein: `f(${casZahl(x0)})`, aus: aus.wert(F, x0) },
    ];
    if (F.ganz) kand.push({ ein: 'factor(f(x))', aus: aus.factor(F) });
    const ziel = R.wahl(kand);
    const optionen = R.mische(kand.map((k) => k.ein));
    return {
      frage: `Auf der Rechner-Seite wurde zuerst die Funktion f definiert. Welche Eingabe gehört zur letzten Ausgabe? <span class="leise klein">${HINWEIS_AUSGABE}</span>`,
      bild: UM.rechnerSeite([DEF(F), { ein: '?', aus: ziel.aus }]),
      felder: [{ art: 'auswahl', optionen: optionen.map(code), richtig: optionen.indexOf(ziel.ein) }],
      hinweis: '„x=… or x=…“ sind Lösungen einer Gleichung, ein Term mit (x−…)² ist die Scheitelform, ein Produkt aus Klammern ist eine Zerlegung in Faktoren, eine einzelne Zahl ist ein Funktionswert.',
      loesung: [`Die Eingabe war ${code(ziel.ein)}.`, { svg: UM.rechnerSeite([DEF(F), ziel]) }],
    };
  };

  // ---------- Fehler finden ----------
  const FEHLER = {
    komma: 'Dezimalkomma statt Dezimalpunkt',
    definition: 'Beim Definieren fehlt der Doppelpunkt (:= statt =)',
    variable: 'Die Variable x fehlt am Ende des Befehls',
    klammer: 'Eine Klammer fehlt',
    befehl: 'Für diese Frage ist es der falsche Befehl',
  };
  function fehlerFall(art, F) {
    const h = Math.round((F.c + 0.5) * 10) / 10 || 2.5;
    const hk = casZahl(h).includes('.') ? casZahl(h) : `${casZahl(h)}.5`;
    const hWert = Number(hk);
    switch (art) {
      case 'komma': return {
        frage: `Gesucht sind die Stellen, an denen f den Wert ${hk.replace('.', ',')} hat.`,
        zeilen: [DEF(F), { ein: `solve(f(x)=${hk.replace('.', ',')},x)`, aus: 'Fehler: Zu viele Argumente', fehler: true }],
        richtig: `solve(f(x)=${hk},x)`, soll: { art: 'solve', links: 'f(x)', rechts: hk, f: F.cas }, ausgabe: aus.solve(F, hWert),
        erklaerung: `Das Komma trennt in der App die Teile eines Befehls. ${code(hk.replace('.', ','))} wird als zwei Teile gelesen. Richtig ist ${code(hk)}.`,
      };
      case 'definition': {
        const x0 = R.int(-3, 4);
        return {
          frage: `Die Funktion soll definiert und dann ${$(`f(${x0})`)} berechnet werden.`,
          zeilen: [{ ein: `f(x)=${F.cas}`, aus: `f(x)=${F.cas}` }, { ein: `f(${x0})`, aus: `f(${x0})` }],
          richtig: `f(x):=${F.cas}`, soll: { art: 'definition', ausdruck: F.cas }, ausgabe: 'Fertig',
          erklaerung: `Mit ${code('=')} wird nur eine Gleichung aufgeschrieben, f ist danach nicht festgelegt – deshalb kommt bei ${code(`f(${x0})`)} keine Zahl heraus. Zum Definieren braucht man ${code(':=')}.`,
        };
      }
      case 'variable': return {
        frage: 'Gesucht sind die Nullstellen von f.',
        zeilen: [DEF(F), { ein: 'solve(f(x)=0)', aus: 'Fehler: Zu wenige Argumente', fehler: true }],
        richtig: 'solve(f(x)=0,x)', soll: { art: 'solve', links: 'f(x)', rechts: '0', f: F.cas }, ausgabe: aus.solve(F, 0),
        erklaerung: `solve braucht zwei Teile: die Gleichung und die Variable, nach der gelöst wird: ${code('solve(f(x)=0,x)')}.`,
      };
      case 'klammer': return {
        frage: 'Gesucht ist die Scheitelform von f.',
        zeilen: [DEF(F), { ein: 'completeSquare(f(x),x', aus: 'Fehler: Fehlende )', fehler: true }],
        richtig: 'completeSquare(f(x),x)', soll: { art: 'completesquare', ausdruck: 'f(x)', f: F.cas }, ausgabe: aus.completeSquare(F),
        erklaerung: `Zu jeder öffnenden Klammer gehört eine schließende: ${code('completeSquare(f(x),x)')}.`,
      };
      default: return {
        frage: 'Gesucht ist der Scheitelpunkt der Parabel.',
        zeilen: [DEF(F), { ein: 'factor(f(x))', aus: aus.factor(F) }],
        richtig: 'completeSquare(f(x),x)', soll: { art: 'completesquare', ausdruck: 'f(x)', f: F.cas }, ausgabe: aus.completeSquare(F),
        erklaerung: `factor zerlegt den Term in Faktoren – daran kann man die Nullstellen ablesen, aber nicht den Scheitelpunkt. Die Scheitelform liefert ${code('completeSquare(f(x),x)')}.`,
      };
    }
  }

  gen['cas-fehler-finden'] = (stufe) => {
    const arten = stufe === 1 ? ['komma', 'definition'] : stufe === 2 ? ['komma', 'definition', 'variable', 'klammer'] : ['komma', 'definition', 'variable', 'klammer', 'befehl'];
    const art = R.wahl(arten);
    const F = art === 'befehl' ? ganzF() : R.wahl([ganzF(), dezF()]);
    const fall = fehlerFall(art, F);
    const andere = R.mische(Object.keys(FEHLER).filter((k) => k !== art)).slice(0, 3);
    const optionen = R.mische([art, ...andere]);
    const felder = [{ art: 'auswahl', label: 'Was ist falsch', optionen: optionen.map((k) => FEHLER[k]), richtig: optionen.indexOf(art) }];
    if (stufe === 3) {
      felder.push({ art: 'cas', label: 'Richtige Eingabe:', soll: fall.soll, loesung: fall.richtig, ausgabe: fall.ausgabe, vorher: art === 'definition' ? [] : [DEF(F)], platzhalter: 'Befehl' });
    }
    return {
      frage: `${fall.frage} Die Eingabe auf der Rechner-Seite ist fehlerhaft. ${stufe === 3 ? 'Was ist falsch? Schreibe die Eingabe richtig.' : 'Was ist falsch?'} <span class="leise klein">${HINWEIS_AUSGABE}</span>`,
      bild: UM.rechnerSeite(fall.zeilen),
      felder,
      hinweis: 'Prüfe nacheinander: Dezimalpunkt statt Komma? := beim Definieren? Steht am Ende die Variable x? Passen die Klammern? Passt der Befehl zur Frage?',
      loesung: [fall.erklaerung, { svg: UM.rechnerSeite([...(art === 'definition' ? [] : [DEF(F)]), { ein: fall.richtig, aus: fall.ausgabe }]) }],
    };
  };

  // ---------- Befehl selbst schreiben ----------
  const SITUATION = [
    { was: 'Ein Ball wird geworfen', x: 'waagerechte Entfernung vom Abwurfpunkt', y: 'Höhe' },
    { was: 'Ein Wasserstrahl spritzt aus einer Düse', x: 'waagerechte Entfernung von der Düse', y: 'Höhe' },
    { was: 'Ein Stein wird über einen Teich geworfen', x: 'waagerechte Entfernung vom Abwurfpunkt', y: 'Höhe über dem Wasser' },
  ];

  gen['cas-befehl-schreiben'] = (stufe) => {
    if (stufe === 1) {
      const F = R.wahl([ganzF(), dezF()]);
      if (Math.random() < 0.5) {
        return {
          frage: `Definiere die Funktion ${$(`f(x)=${F.tex}`)} in der CAS-App. Was gibst du ein?`,
          felder: [{ art: 'cas', soll: { art: 'definition', ausdruck: F.cas }, loesung: `f(x):=${F.cas}`, ausgabe: 'Fertig', platzhalter: 'f(x):=…' }],
          hinweis: `Definieren mit ${code(':=')}. Dezimalzahlen mit Punkt, Malzeichen ${code('*')}, Hochzahl mit ${code('^')}.`,
          loesung: [`${code(`f(x):=${F.cas}`)}`, { svg: UM.rechnerSeite([DEF(F)]) }],
        };
      }
      const x0 = F.ganz ? R.int(-4, 5) : Math.round(Math.random() * 70) / 10 + 0.5;
      return {
        frage: `Die Funktion ${$(`f(x)=${F.tex}`)} ist in der CAS-App definiert. Berechne den Funktionswert an der Stelle ${$(`x=${zk(x0)}`)}. Was gibst du ein?`,
        felder: [{ art: 'cas', soll: { art: 'wert', arg: x0 }, loesung: `f(${casZahl(x0)})`, ausgabe: aus.wert(F, x0), vorher: [DEF(F)], platzhalter: 'z. B. f(2)' }],
        hinweis: `Einen Funktionswert berechnest du mit ${code('f(…)')}. Denk an den Dezimalpunkt.`,
        loesung: [code(`f(${casZahl(x0)})`), { svg: UM.rechnerSeite([DEF(F), { ein: `f(${casZahl(x0)})`, aus: aus.wert(F, x0) }]) }],
      };
    }
    if (stufe === 2) {
      const F = R.wahl([ganzF(), dezF()]);
      const typ = R.wahl(F.ganz ? ['null', 'wert', 'cs', 'factor'] : ['null', 'wert', 'cs']);
      const h = F.ganz ? R.int(-5, 5) : Math.round((F.c + 1 + Math.random()) * 10) / 10;
      const fall = {
        null: { auftrag: 'Berechne die Nullstellen von f.', richtig: 'solve(f(x)=0,x)', soll: { art: 'solve', links: 'f(x)', rechts: '0', f: F.cas }, ausgabe: aus.solve(F, 0) },
        wert: { auftrag: `Berechne, an welchen Stellen f den Wert ${$(zk(h))} hat.`, richtig: `solve(f(x)=${casZahl(h)},x)`, soll: { art: 'solve', links: 'f(x)', rechts: casZahl(h), f: F.cas }, ausgabe: aus.solve(F, h) },
        cs: { auftrag: 'Forme f in die Scheitelform um.', richtig: 'completeSquare(f(x),x)', soll: { art: 'completesquare', ausdruck: 'f(x)', f: F.cas }, ausgabe: aus.completeSquare(F) },
        factor: { auftrag: 'Zerlege den Funktionsterm in Faktoren.', richtig: 'factor(f(x))', soll: { art: 'factor', ausdruck: 'f(x)', f: F.cas }, ausgabe: aus.factor(F) },
      }[typ];
      return {
        frage: `Die Funktion ${$(`f(x)=${F.tex}`)} ist in der CAS-App definiert. ${fall.auftrag} Was gibst du ein?`,
        felder: [{ art: 'cas', soll: fall.soll, loesung: fall.richtig, ausgabe: fall.ausgabe, vorher: [DEF(F)], platzhalter: 'Befehl' }],
        hinweis: `Aufbau: ${code('solve(Gleichung,x)')}, ${code('completeSquare(Term,x)')}, ${code('factor(Term)')}. Statt des ganzen Terms kannst du ${code('f(x)')} schreiben.`,
        loesung: [`Zum Beispiel ${code(fall.richtig)}.`, { svg: UM.rechnerSeite([DEF(F), { ein: fall.richtig, aus: fall.ausgabe }]) }],
      };
    }
    // Stufe 3: Sachfrage → Befehl
    const F = dezF();
    const s = R.wahl(SITUATION);
    const x0 = Math.round(F.r[1] * (0.2 + Math.random() * 0.5) * 10) / 10;
    const h = Math.round((F.c + (F.e - F.c) * (0.3 + Math.random() * 0.4)) * 10) / 10;
    const fall = R.wahl([
      { frage: `In welcher Höhe ist er ${zk(x0).replace('{,}', ',')} m vom Startpunkt entfernt?`, richtig: `f(${casZahl(x0)})`, soll: { art: 'wert', arg: x0 }, ausgabe: aus.wert(F, x0) },
      { frage: `In welchen Entfernungen ist er ${zk(h).replace('{,}', ',')} m hoch?`, richtig: `solve(f(x)=${casZahl(h)},x)`, soll: { art: 'solve', links: 'f(x)', rechts: casZahl(h), f: F.cas }, ausgabe: aus.solve(F, h) },
      { frage: 'Wo trifft er auf, wenn nichts im Weg ist?', richtig: 'solve(f(x)=0,x)', soll: { art: 'solve', links: 'f(x)', rechts: '0', f: F.cas }, ausgabe: aus.solve(F, 0) },
      { frage: 'Wie hoch ist der höchste Punkt der Flugbahn?', richtig: 'completeSquare(f(x),x)', soll: { art: 'completesquare', ausdruck: 'f(x)', f: F.cas }, ausgabe: aus.completeSquare(F) },
    ]);
    return {
      frage: `${s.was}. Die Flugbahn wird durch ${$(`f(x)=${F.tex}`)} beschrieben (${$('x')}: ${s.x} in m, ${$('f(x)')}: ${s.y} in m); f ist in der CAS-App schon definiert. <b>${fall.frage}</b> Welchen Befehl gibst du ein?`,
      felder: [{ art: 'cas', soll: fall.soll, loesung: fall.richtig, ausgabe: fall.ausgabe, vorher: [DEF(F)], platzhalter: 'Befehl' }],
      hinweis: 'Überlege: Ist x gegeben (dann f(…)) oder die Höhe (dann solve)? Den höchsten Punkt liefert die Scheitelform.',
      loesung: [`Zum Beispiel ${code(fall.richtig)}.`, { svg: UM.rechnerSeite([DEF(F), { ein: fall.richtig, aus: fall.ausgabe }]) }],
    };
  };
})(typeof window !== 'undefined' ? window : globalThis);
