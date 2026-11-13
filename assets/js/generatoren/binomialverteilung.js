/*
 * Aufgaben-Generatoren: Binomialverteilung und Formel von Bernoulli (Q2 GK)
 *
 * Format der Aufgaben: siehe generatoren/rationale-zahlen.js.
 * Wahrscheinlichkeiten werden als Feld { art:'naeherung', stellen:4, prozent:true } abgefragt:
 * mindestens vier Nachkommastellen (oder zwei in Prozent); wo der Wert ein kurzer Bruch ist, zählt auch der Bruch.
 * CAS-Befehl: binomPdf(n,p,k) (TI-Nspire CAS), Prüfung in assets/js/cas.js.
 * Formel im Unterricht: P(X=k) = (n über k) · p^k · (1−p)^(n−k).
 *
 * Die Aufgaben orientieren sich am Unterricht (Galtonbrett, Bernoulli-Kette, Formel, CAS),
 * nicht an den Aufgaben einer Klausur.
 */
(function (global) {
  'use strict';
  const UM = (global.UM = global.UM || {});
  const { Bruch } = UM;
  const R = UM.zufall;
  const gen = (UM.generatoren = UM.generatoren || {});
  const { casZahl } = UM.cas;

  // ---------- Rechnen ----------
  /** Binomialkoeffizient (n über k) als ganze Zahl */
  function bk(n, k) {
    let c = 1;
    for (let i = 1; i <= k; i++) c = (c * (n - k + i)) / i;
    return Math.round(c);
  }
  /** P(X = k) als Gleitkommazahl */
  const pdf = (n, p, k) => bk(n, k) * p ** k * (1 - p) ** (n - k);
  /** P(X = k) exakt (nur für kleine n und kurze p sinnvoll) */
  function pdfExakt(n, pB, k) {
    const q = new Bruch(1).minus(pB);
    let w = new Bruch(bk(n, k));
    for (let i = 0; i < k; i++) w = w.mal(pB);
    for (let i = 0; i < n - k; i++) w = w.mal(q);
    return w;
  }
  const EINS = new Bruch(1);
  /** b^e exakt */
  function potExakt(b, e) {
    let w = new Bruch(1);
    for (let i = 0; i < e; i++) w = w.mal(b);
    return w;
  }

  // ---------- Darstellung ----------
  const $ = (t) => `$${t}$`;
  /** Dezimalzahl mit d Nachkommastellen, TeX bzw. Text */
  const dzTex = (x, d = 4) => x.toFixed(d).replace('.', '{,}');
  const dzText = (x, d = 4) => x.toFixed(d).replace('.', ',');
  const prozentText = (x, d = 1) => `${dzText(x * 100, d)} %`;
  /** p als TeX: Dezimalzahl oder Bruch */
  const pTex = (pB) => (pB.istEndlichDezimal() ? pB.tex('dezimal') : `\\frac{${pB.z}}{${pB.n}}`);
  /** p^e als TeX */
  const pot = (pB, e) => (pB.istEndlichDezimal() ? `${pB.tex('dezimal')}^{${e}}` : `\\left(\\frac{${pB.z}}{${pB.n}}\\right)^{${e}}`);
  /** p in der CAS-Schreibweise */
  const casP = (pB) => (pB.istEndlichDezimal() ? String(pB.zahl()) : `${pB.z}/${pB.n}`);
  /** p in Prozent (Text), z. B. „85 %“ */
  const pProzent = (pB) => `${String(Math.round(pB.zahl() * 1000) / 10).replace('.', ',')} %`;
  const code = (c) => `<code class="cas">${c}</code>`;
  /** Formel von Bernoulli mit Zahlen */
  const formel = (n, pB, k) => `\\binom{${n}}{${k}}\\cdot ${pot(pB, k)}\\cdot ${pot(EINS.minus(pB), n - k)}`;
  /** Ergebnis als TeX: exakt (falls kurz) und gerundet */
  function ergebnisTex(w, exakt) {
    if (exakt && exakt.istEndlichDezimal() && String(exakt.zahl()).length <= 8) {
      const t = exakt.tex('dezimal');
      return Math.abs(Number(w.toFixed(4)) - w) < 1e-12 ? `=${t}` : `=${t}\\approx ${dzTex(w)}`;
    }
    return `\\approx ${dzTex(w)}`;
  }
  /** Feld für eine Wahrscheinlichkeit */
  const wFeld = (label, wert, exakt) => {
    const f = { art: 'naeherung', label, wert, stellen: 4, prozent: true };
    if (exakt) f.exakt = exakt;
    return f;
  };
  const RUNDEN = 'Runde auf vier Nachkommastellen (oder gib das Ergebnis in Prozent mit zwei Nachkommastellen an).';
  const FORMEL = 'P(X=k)=\\binom{n}{k}\\cdot p^k\\cdot (1-p)^{n-k}';

  // ---------- Sachzusammenhänge ----------
  /*
   * p: mögliche Trefferwahrscheinlichkeiten (Bruch), n: [min, max]
   * satz(n, pB): Beschreibung, erfolg/misserfolg: ein einzelner Versuch
   * X: was X zählt; anz(k): „3 Sechsen“; keine/alle: Ereignisse X = 0 bzw. X = n
   * gegenX: X zählt stattdessen die Nieten (für „Treffer selbst festlegen“)
   */
  const plural = (k, s, p) => (k === 1 ? `1 ${s}` : `${k} ${p}`);
  const KONTEXTE = [
    {
      id: 'wuerfel', p: [new Bruch(1, 6)], n: [5, 12],
      satz: (n) => `Ein fairer Würfel wird ${n}-mal geworfen.`,
      erfolg: 'Es fällt eine Sechs.', misserfolg: 'Es fällt keine Sechs.',
      X: 'die Anzahl der Sechsen', anz: (k) => plural(k, 'Sechs', 'Sechsen'), keine: 'keine Sechs', alle: 'nur Sechsen',
      gegenX: 'die Anzahl der Würfe, bei denen keine Sechs fällt',
    },
    {
      id: 'muenze', p: [new Bruch(1, 2)], n: [4, 12],
      satz: (n) => `Eine Münze wird ${n}-mal geworfen.`,
      erfolg: 'Die Münze zeigt Wappen.', misserfolg: 'Die Münze zeigt Zahl.',
      X: 'die Anzahl der Würfe mit Wappen', anz: (k) => `${k}-mal Wappen`, keine: 'kein einziges Mal Wappen', alle: 'nur Wappen',
    },
    {
      id: 'mc', p: [new Bruch(1, 4), new Bruch(1, 3)], n: [5, 15],
      satz: (n, pB) => `Ein Multiple-Choice-Test hat ${n} Fragen mit je ${pB.n} Antworten, von denen genau eine richtig ist. Lea kreuzt bei jeder Frage zufällig eine Antwort an.`,
      erfolg: 'Die angekreuzte Antwort ist richtig.', misserfolg: 'Die angekreuzte Antwort ist falsch.',
      X: 'die Anzahl der richtigen Antworten', anz: (k) => plural(k, 'richtige Antwort', 'richtige Antworten'), keine: 'keine richtige Antwort', alle: 'nur richtige Antworten',
      gegenX: 'die Anzahl der falschen Antworten',
    },
    {
      id: 'samen', p: ['0,8', '0,85', '0,9'].map(Bruch.dez), n: [6, 20],
      satz: (n, pB) => `Ein Händler gibt an, dass ${pProzent(pB)} seiner Tomatensamen keimen. Es werden ${n} Samen ausgesät.`,
      erfolg: 'Der Samen keimt.', misserfolg: 'Der Samen keimt nicht.',
      X: 'die Anzahl der gekeimten Samen', anz: (k) => plural(k, 'gekeimter Samen', 'gekeimte Samen'), keine: 'kein Samen keimt', alle: 'alle Samen keimen',
      gegenX: 'die Anzahl der Samen, die nicht keimen',
    },
    {
      id: 'schrauben', p: ['0,02', '0,04', '0,05', '0,1'].map(Bruch.dez), n: [10, 30],
      satz: (n, pB) => `Eine Maschine stellt Schrauben her, ${pProzent(pB)} davon sind fehlerhaft. Aus der laufenden Produktion werden ${n} Schrauben zufällig entnommen.`,
      erfolg: 'Die Schraube ist fehlerhaft.', misserfolg: 'Die Schraube ist in Ordnung.',
      X: 'die Anzahl der fehlerhaften Schrauben', anz: (k) => plural(k, 'fehlerhafte Schraube', 'fehlerhafte Schrauben'), keine: 'keine fehlerhafte Schraube', alle: 'nur fehlerhafte Schrauben',
      gegenX: 'die Anzahl der fehlerfreien Schrauben',
    },
    {
      id: 'elfmeter', p: ['0,7', '0,75', '0,8'].map(Bruch.dez), n: [5, 12],
      satz: (n, pB) => `Eine Spielerin verwandelt Elfmeter erfahrungsgemäß mit einer Wahrscheinlichkeit von ${pProzent(pB)}. Im Training schießt sie ${n} Elfmeter.`,
      erfolg: 'Der Elfmeter ist ein Tor.', misserfolg: 'Der Elfmeter ist kein Tor.',
      X: 'die Anzahl der Tore', anz: (k) => plural(k, 'Tor', 'Tore'), keine: 'kein Tor', alle: 'nur Tore',
      gegenX: 'die Anzahl der verschossenen Elfmeter',
    },
    {
      id: 'gluecksrad', p: ['0,2', '0,25', '0,3', '0,4'].map(Bruch.dez), n: [5, 15],
      satz: (n, pB) => `Bei einem Glücksrad bleibt der Zeiger mit einer Wahrscheinlichkeit von ${pProzent(pB)} auf einem roten Feld stehen. Das Glücksrad wird ${n}-mal gedreht.`,
      erfolg: 'Der Zeiger bleibt auf Rot stehen.', misserfolg: 'Der Zeiger bleibt nicht auf Rot stehen.',
      X: 'die Anzahl der Drehungen mit Rot', anz: (k) => `${k}-mal Rot`, keine: 'kein einziges Mal Rot', alle: 'jedes Mal Rot',
      gegenX: 'die Anzahl der Drehungen, bei denen der Zeiger nicht auf Rot stehen bleibt',
    },
    {
      id: 'galton', p: ['0,5', '0,4', '0,6', '0,3'].map(Bruch.dez), n: [4, 10],
      satz: (n, pB) => `Bei einem Galtonbrett mit ${n} Nagelreihen wird eine Kugel an jedem Nagel mit einer Wahrscheinlichkeit von ${pB.dezText()} nach rechts abgelenkt.`,
      erfolg: 'Die Kugel wird an einem Nagel nach rechts abgelenkt.', misserfolg: 'Die Kugel wird an einem Nagel nach links abgelenkt.',
      X: 'die Anzahl der Ablenkungen nach rechts (also die Nummer des Fachs, in das die Kugel fällt)', anz: (k) => `${k}-mal nach rechts`, keine: 'nie nach rechts', alle: 'immer nach rechts',
      gegenX: 'die Anzahl der Ablenkungen nach links',
    },
    {
      id: 'freiwurf', p: ['0,6', '0,65', '0,7'].map(Bruch.dez), n: [5, 12],
      satz: (n, pB) => `Ein Basketballspieler trifft beim Freiwurf mit einer Wahrscheinlichkeit von ${pProzent(pB)}. Er wirft ${n} Freiwürfe.`,
      erfolg: 'Der Freiwurf ist ein Treffer.', misserfolg: 'Der Freiwurf geht daneben.',
      X: 'die Anzahl der Treffer', anz: (k) => plural(k, 'Treffer', 'Treffer'), keine: 'kein Treffer', alle: 'nur Treffer',
      gegenX: 'die Anzahl der Fehlwürfe',
    },
  ];

  /** Zufälliger Sachzusammenhang mit n und p; nMax begrenzt n (z. B. für Rechnungen ohne CAS) */
  function kontext({ nMin, nMax, nurDezimal, mitGegen, filter } = {}) {
    for (;;) {
      const K = R.wahl(KONTEXTE);
      if (mitGegen && !K.gegenX) continue;
      if (filter && !filter(K)) continue;
      const pB = R.wahl(K.p);
      if (nurDezimal && !pB.istEndlichDezimal()) continue;
      const lo = Math.max(K.n[0], nMin ?? 0);
      const hi = Math.min(K.n[1], nMax ?? 99);
      if (lo > hi) continue;
      const n = R.int(lo, hi);
      return { K, n, pB, p: pB.zahl() };
    }
  }
  /** Ein k, für das P(X = k) nicht zu klein ist (≥ grenze); ausser: Werte, die nicht in Frage kommen */
  function gutesK(n, p, { grenze = 0.01, min = 0, max = n, ausser = [] } = {}) {
    const kand = [];
    for (let k = min; k <= max; k++) if (!ausser.includes(k) && pdf(n, p, k) >= grenze) kand.push(k);
    return kand.length ? R.wahl(kand) : null;
  }
  const einleitung = (c, X = c.K.X) => `${c.K.satz(c.n, c.pB)} Die Zufallsgröße $X$ gibt ${X} an.`;

  /** Auswahlfeld aus [richtig, ...falsch]; Optionen gemischt */
  function auswahl(label, richtig, falsch) {
    const optionen = R.mische([richtig, ...falsch]);
    return { art: 'auswahl', label, optionen, richtig: optionen.indexOf(richtig) };
  }

  // =====================================================================
  // 1 Bernoulli-Kette erkennen: Treffer, n und p
  // =====================================================================
  const MODELL = [
    'Ja, $X$ ist binomialverteilt.',
    'Ja, näherungsweise: Die Grundgesamtheit ist so groß, dass sich die Trefferwahrscheinlichkeit kaum ändert.',
    'Nein, die Trefferwahrscheinlichkeit ändert sich von Versuch zu Versuch.',
    'Nein, die Anzahl der Versuche steht vorher nicht fest.',
    'Nein, $X$ zählt nicht die Treffer bei den einzelnen Versuchen.',
  ];
  const SZENARIEN = [
    () => {
      const r = R.int(2, 6), b = R.int(3, 8), n = R.int(4, 8);
      return { text: `In einer Urne liegen ${r} rote und ${b} blaue Kugeln. Es werden ${n} Kugeln nacheinander gezogen, jede Kugel wird nach dem Ziehen wieder zurückgelegt. $X$ ist die Anzahl der gezogenen roten Kugeln.`, r: 0, erkl: `Durch das Zurücklegen ist die Wahrscheinlichkeit für Rot bei jedem Zug gleich ($p=\\frac{${r}}{${r + b}}$), und es gibt genau $n=${n}$ Züge.` };
    },
    () => {
      const r = R.int(2, 5), b = R.int(3, 6), n = R.int(3, 5);
      return { text: `In einer Urne liegen ${r} rote und ${b} blaue Kugeln. Es werden ${n} Kugeln nacheinander gezogen, ohne sie zurückzulegen. $X$ ist die Anzahl der gezogenen roten Kugeln.`, r: 2, erkl: `Ohne Zurücklegen ändert sich der Anteil der roten Kugeln nach jedem Zug, z. B. von $\\frac{${r}}{${r + b}}$ auf $\\frac{${r - 1}}{${r + b - 1}}$, wenn zuerst Rot gezogen wurde.` };
    },
    () => ({ text: 'Ein Würfel wird so lange geworfen, bis zum ersten Mal eine Sechs fällt. $X$ ist die Anzahl der Würfe.', r: 3, erkl: 'Die Anzahl der Würfe hängt vom Zufall ab. Bei einer Bernoulli-Kette steht die Anzahl $n$ der Versuche vorher fest.' }),
    () => {
      const n = R.int(3, 10);
      return { text: `Ein Würfel wird ${n}-mal geworfen. $X$ ist die Summe der Augenzahlen.`, r: 4, erkl: 'Die Augensumme zählt keine Treffer: Jeder Wurf hat sechs mögliche Ergebnisse, die unterschiedlich zur Summe beitragen.' };
    },
    () => {
      const n = R.wahl([20, 25, 30, 50]), q = R.wahl([2, 3, 4, 5]), N = R.wahl([5000, 10000, 20000]);
      return { text: `Eine Lieferung besteht aus ${N.toLocaleString('de-DE')} Bauteilen, ${q} % davon sind defekt. Es werden ${n} Bauteile zufällig entnommen (ohne Zurücklegen). $X$ ist die Anzahl der defekten Bauteile.`, r: 1, erkl: `Genau genommen ändert sich der Anteil nach jedem Zug. Weil nur ${n} von ${N.toLocaleString('de-DE')} Bauteilen entnommen werden, bleibt er aber fast gleich: Man rechnet mit $p=${dzTex(q / 100, 2)}$.` };
    },
    () => {
      const n = R.int(5, 12);
      return { text: `Ein Glücksrad mit einem roten Feld (Mittelpunktswinkel 90°) wird ${n}-mal gedreht. $X$ ist die Anzahl der Drehungen, bei denen der Zeiger auf Rot stehen bleibt.`, r: 0, erkl: `Jede Drehung ist ein Versuch mit Treffer „Rot“, $p=\\frac{90°}{360°}=0{,}25$, und es gibt genau $n=${n}$ Drehungen, die sich nicht beeinflussen.` };
    },
    () => ({ text: 'Beim Lotto „6 aus 49“ wird ein Tipp mit sechs Zahlen abgegeben. $X$ ist die Anzahl der richtig getippten Zahlen.', r: 2, erkl: 'Die sechs Gewinnzahlen werden ohne Zurücklegen aus nur 49 Kugeln gezogen. Die Wahrscheinlichkeit, dass die nächste Kugel eine getippte Zahl ist, ändert sich deshalb deutlich.' }),
    () => ({ text: 'Eine Münze wird so lange geworfen, bis zweimal hintereinander Wappen fällt. $X$ ist die Anzahl der Würfe mit Wappen.', r: 3, erkl: 'Wie oft geworfen wird, steht vorher nicht fest.' }),
    () => {
      const n = R.int(3, 8);
      return { text: `Ein Würfel wird ${n}-mal geworfen. $X$ ist die größte geworfene Augenzahl.`, r: 4, erkl: '$X$ zählt keine Treffer, sondern gibt eine Augenzahl an.' };
    },
    () => {
      const n = R.wahl([500, 1000, 2000]), q = R.wahl([20, 30, 40]);
      return { text: `In Deutschland besitzen ${q} % der Erwachsenen ein bestimmtes Abo. Für eine Umfrage werden ${n.toLocaleString('de-DE')} Erwachsene zufällig ausgewählt. $X$ ist die Anzahl der Befragten mit Abo.`, r: 1, erkl: `Es wird ohne Zurücklegen ausgewählt, aber aus vielen Millionen Erwachsenen. Der Anteil ändert sich dadurch praktisch nicht, man rechnet mit $p=${dzTex(q / 100, 1)}$.` };
    },
  ];

  gen['bv-erkennen'] = (stufe) => {
    if (stufe === 2) {
      const s = R.wahl(SZENARIEN)();
      return {
        frage: `${s.text} Ist $X$ binomialverteilt?`,
        felder: [{ art: 'auswahl', label: 'Entscheide', optionen: MODELL, richtig: s.r }],
        hinweis: 'Prüfe drei Dinge: Steht die Anzahl $n$ der Versuche vorher fest? Hat jeder Versuch nur die Ausgänge Treffer und Niete, mit immer derselben Trefferwahrscheinlichkeit $p$? Zählt $X$ die Treffer?',
        loesung: [`${MODELL[s.r]} ${s.erkl}`],
      };
    }
    const gegen = stufe === 3;
    const c = kontext({ mitGegen: gegen });
    const { K, n, pB } = c;
    const pT = gegen ? EINS.minus(pB) : pB;
    const [treffer, niete] = gegen ? [K.misserfolg, K.erfolg] : [K.erfolg, K.misserfolg];
    return {
      frage: `${einleitung(c, gegen ? K.gegenX : K.X)} Fasse das Zufallsexperiment als Bernoulli-Kette auf.`,
      felder: [
        auswahl('Was ist bei einem einzelnen Versuch ein Treffer', treffer, [niete, `Alle ${n} Versuche sind Treffer.`]),
        { art: 'zahl', label: 'Anzahl der Versuche $n$', antwort: new Bruch(n) },
        { art: 'naeherung', label: 'Trefferwahrscheinlichkeit $p$', wert: pT.zahl(), exakt: pT, stellen: 2, prozent: true },
      ],
      hinweis: gegen
        ? 'Ein Treffer ist das, was $X$ zählt – das muss nicht das „Erfreuliche“ sein. Die Trefferwahrscheinlichkeit ist dann die Gegenwahrscheinlichkeit: $1-\\ldots$'
        : 'Ein Treffer ist das, was $X$ zählt. $p$ ist die Wahrscheinlichkeit für einen Treffer bei einem einzelnen Versuch.',
      loesung: [
        `Treffer: ${treffer} Anzahl der Versuche: $n=${n}$.`,
        gegen
          ? `$X$ zählt die Nieten des ursprünglichen Experiments. Deshalb ist $p=1-${pTex(pB)}=${pTex(pT)}$.`
          : `Trefferwahrscheinlichkeit: $p=${pTex(pT)}$${pT.istEndlichDezimal() ? '' : ` $\\approx ${dzTex(pT.zahl(), 4)}$`}.`,
      ],
    };
  };

  // =====================================================================
  // 2 Schreibweise P(X = k)
  // =====================================================================
  gen['bv-schreibweise'] = (stufe) => {
    if (stufe === 3) {
      const c = kontext();
      const { K, n } = c;
      const art = R.int(0, 2);
      const ereignis = [K.keine, K.alle, `mindestens ${K.anz(1)}`][art];
      const opt = [`$P(X=0)$`, `$P(X=${n})$`, `$1-P(X=0)$`, `$P(X=1)$`, `$1-P(X=${n})$`];
      return {
        frage: `${einleitung(c)} Mit welchem Term berechnest du die Wahrscheinlichkeit des Ereignisses „${ereignis}“?`,
        felder: [{ art: 'auswahl', label: 'Term', optionen: opt, richtig: art }],
        hinweis: 'Überlege, welchen Wert $X$ annimmt. Bei „mindestens …“ hilft das Gegenereignis.',
        loesung: [
          art === 0 ? `„${ereignis}“ bedeutet $X=0$, also $P(X=0)$.`
            : art === 1 ? `„${ereignis}“ bedeutet: alle $n=${n}$ Versuche sind Treffer, also $P(X=${n})$.`
              : `Das Gegenereignis von „${ereignis}“ ist „${K.keine}“, also $X=0$. Deshalb ist die Wahrscheinlichkeit $1-P(X=0)$.`,
        ],
      };
    }
    const c = kontext({ nMin: 5 });
    const { K, n } = c;
    let k;
    do k = R.int(1, n - 1); while (k === n - k);
    if (stufe === 1) {
      return {
        frage: `${einleitung(c)} Welche Schreibweise beschreibt die Wahrscheinlichkeit des Ereignisses „genau ${K.anz(k)}“?`,
        felder: auswahlFeld(`$P(X=${k})$`, [`$P(X)=${k}$`, `$P(X=${n - k})$`, `$P(${k})$`]),
        hinweis: 'In die Klammer gehört das Ereignis: Die Zufallsgröße $X$ nimmt einen bestimmten Wert an.',
        loesung: [`„genau ${K.anz(k)}“ bedeutet $X=${k}$. Die Wahrscheinlichkeit dafür schreibt man $P(X=${k})$.`, '$P(X)=\\ldots$ ist falsch: $X$ ist kein Ereignis, sondern eine Zufallsgröße. Erst „$X=k$“ ist ein Ereignis.'],
      };
    }
    return {
      frage: `${einleitung(c)} Was bedeutet $P(X=${k})$ in diesem Zusammenhang?`,
      felder: auswahlFeld(`Die Wahrscheinlichkeit für genau ${K.anz(k)}`, [`Die Wahrscheinlichkeit für genau ${K.anz(n - k)}`, `Die Wahrscheinlichkeit für mindestens ${K.anz(k)}`, `Die Wahrscheinlichkeit für höchstens ${K.anz(k)}`]),
      hinweis: '$X$ gibt an, was gezählt wird. $X=k$ heißt: Es wird genau $k$-mal gezählt.',
      loesung: [`$X$ gibt ${K.X} an. $P(X=${k})$ ist die Wahrscheinlichkeit für genau ${K.anz(k)}.`],
    };
  };
  const auswahlFeld = (richtig, falsch) => [auswahl('Wähle aus', richtig, falsch)];

  // =====================================================================
  // 3 Formel von Bernoulli (ohne CAS)
  // =====================================================================
  gen['bv-formel'] = (stufe) => {
    if (stufe === 1) {
      const c = kontext({ nMax: 12, nMin: 4 });
      const { K, n, pB } = c;
      const k = R.int(1, n - 1);
      const q = EINS.minus(pB);
      const term = `P(X=${k})=\\binom{\\boxed{a}}{\\boxed{b}}\\cdot ${pB.istEndlichDezimal() ? pB.tex('dezimal') : `\\left(\\frac{${pB.z}}{${pB.n}}\\right)`}^{\\boxed{c}}\\cdot \\boxed{d}^{\\,\\boxed{e}}`;
      return {
        frage: `${einleitung(c)} Ergänze die Formel von Bernoulli für die Wahrscheinlichkeit von „genau ${K.anz(k)}“.`,
        term,
        felder: [
          { art: 'zahl', label: '$a$', antwort: new Bruch(n) },
          { art: 'zahl', label: '$b$', antwort: new Bruch(k) },
          { art: 'zahl', label: '$c$', antwort: new Bruch(k) },
          { art: 'zahl', label: '$d$', antwort: q },
          { art: 'zahl', label: '$e$', antwort: new Bruch(n - k) },
        ],
        hinweis: `Formel von Bernoulli: $${FORMEL}$`,
        loesung: [`$n=${n}$, $p=${pTex(pB)}$, $k=${k}$:`, `$P(X=${k})=${formel(n, pB, k)}$`, `Also $a=${n}$, $b=${k}$, $c=${k}$, $d=1-${pTex(pB)}=${pTex(q)}$, $e=${n}-${k}=${n - k}$.`],
      };
    }
    if (stufe === 2) {
      // kleine n, kurze p: Rechnung ohne CAS
      const c = kontext({ nMin: 3, nMax: 5, nurDezimal: true, filter: (K) => ['muenze', 'galton', 'gluecksrad', 'elfmeter', 'freiwurf', 'samen'].includes(K.id) });
      const { K, n, pB, p } = c;
      if (String(pB.zahl()).length > 4) return gen['bv-formel'](stufe); // nur p mit höchstens zwei Stellen
      const k = gutesK(n, p, { grenze: 0.02, min: 1, max: n - 1 });
      if (k === null) return gen['bv-formel'](stufe);
      const exakt = pdfExakt(n, pB, k);
      const w = exakt.zahl();
      return {
        frage: `${einleitung(c)} Berechne die Wahrscheinlichkeit für „genau ${K.anz(k)}“ mit der Formel von Bernoulli, ohne CAS. ${RUNDEN}`,
        felder: [
          { art: 'zahl', label: `$\\binom{${n}}{${k}}=$`, antwort: new Bruch(bk(n, k)) },
          wFeld(`$P(X=${k})=$`, w, exakt),
        ],
        notiz: true,
        hinweis: `$${FORMEL}$. Der Binomialkoeffizient $\\binom{n}{k}$ ist die Anzahl der Pfade mit genau $k$ Treffern – wie die Anzahl der Wege beim Galtonbrett (Pascalsches Dreieck).`,
        loesung: [
          `$n=${n}$, $p=${pTex(pB)}$, $k=${k}$. Es gibt $\\binom{${n}}{${k}}=${bk(n, k)}$ Pfade mit genau ${k} Treffern.`,
          `$P(X=${k})=${formel(n, pB, k)}=${bk(n, k)}\\cdot ${potExakt(pB, k).tex('dezimal')}\\cdot ${potExakt(EINS.minus(pB), n - k).tex('dezimal')}${ergebnisTex(w, exakt)}$`,
        ],
      };
    }
    // Stufe 3: rückwärts lesen oder Fehler finden
    if (Math.random() < 0.5) {
      const pB = R.wahl(['0,15', '0,35', '0,45', '0,55', '0,65', '0,85', '0,12', '0,38'].map(Bruch.dez));
      const n = R.int(8, 16);
      let k;
      do k = R.int(2, n - 2); while (k === n - k);
      return {
        frage: `Der Term $${formel(n, pB, k)}$ hat die Form der Formel von Bernoulli $${FORMEL}$. Lies $n$, $k$ und $p$ ab.`,
        felder: [
          { art: 'zahl', label: '$n$', antwort: new Bruch(n) },
          { art: 'zahl', label: '$k$', antwort: new Bruch(k) },
          { art: 'naeherung', label: '$p$', wert: pB.zahl(), exakt: pB, stellen: 2 },
          auswahl(`Was gibt der Binomialkoeffizient (n über k) = ${bk(n, k)} an`, `die Anzahl der Pfade mit genau ${k} Treffern`, [`die Wahrscheinlichkeit eines einzelnen Pfades mit genau ${k} Treffern`, `die Anzahl aller Pfade bei ${n} Versuchen`, `die Wahrscheinlichkeit für genau ${k} Treffer`]),
        ],
        hinweis: 'Der Exponent von $p$ ist die Anzahl der Treffer $k$, der Exponent von $1-p$ die Anzahl der Nieten $n-k$.',
        loesung: [
          `$n=${n}$ (oben im Binomialkoeffizienten), $k=${k}$ (Exponent von $p$), $p=${pTex(pB)}$; zur Kontrolle: $1-p=${pTex(EINS.minus(pB))}$ mit Exponent $n-k=${n - k}$.`,
          `$\\binom{${n}}{${k}}=${bk(n, k)}$ ist die Anzahl der Pfade mit genau ${k} Treffern. Jeder dieser Pfade hat die Wahrscheinlichkeit $${pot(pB, k)}\\cdot ${pot(EINS.minus(pB), n - k)}$.`,
        ],
      };
    }
    const c = kontext({ nMin: 5, nurDezimal: true, filter: (K) => K.id !== 'muenze' });
    const { K, n, pB, p } = c;
    if (p === 0.5) return gen['bv-formel'](stufe);
    const k = gutesK(n, p, { grenze: 0.01, min: 1, max: n - 1, ausser: [n / 2] });
    if (k === null) return gen['bv-formel'](stufe);
    const q = EINS.minus(pB);
    const FEHLER = [
      { tex: `${pot(pB, k)}\\cdot ${pot(q, n - k)}`, text: 'Der Binomialkoeffizient fehlt.' },
      { tex: `\\binom{${n}}{${k}}\\cdot ${pot(pB, n - k)}\\cdot ${pot(q, k)}`, text: 'Die Exponenten von $p$ und $1-p$ sind vertauscht.' },
      { tex: `\\binom{${n}}{${k}}\\cdot ${pot(pB, k)}\\cdot ${pot(q, n)}`, text: 'Der Exponent von $1-p$ müsste $n-k$ sein.' },
      { tex: `\\binom{${n}}{${k}}\\cdot ${pot(pB, k)}\\cdot ${pot(pB, n - k)}`, text: 'Statt $1-p$ wurde noch einmal $p$ verwendet.' },
    ];
    const r = R.int(0, 3);
    const w = pdf(n, p, k);
    return {
      frage: `${einleitung(c)} Tim berechnet die Wahrscheinlichkeit für „genau ${K.anz(k)}“ so: $P(X=${k})=${FEHLER[r].tex}$. Finde den Fehler und berechne das richtige Ergebnis. ${RUNDEN}`,
      felder: [
        { art: 'auswahl', label: 'Fehler', optionen: FEHLER.map((f) => f.text), richtig: r },
        wFeld(`Richtig: $P(X=${k})$`, w),
      ],
      hinweis: `Vergleiche mit der Formel $${FORMEL}$ für $n=${n}$, $p=${pTex(pB)}$ und $k=${k}$.`,
      loesung: [`${FEHLER[r].text}`, `Richtig: $P(X=${k})=${formel(n, pB, k)}\\approx ${dzTex(w)}$`],
    };
  };

  // =====================================================================
  // 4 Mit der CAS-App: binomPdf(n,p,k)
  // =====================================================================
  gen['bv-cas'] = (stufe) => {
    const c = kontext({ nMin: 6 });
    const { K, n, pB, p } = c;
    const k = gutesK(n, p, { grenze: 0.01, ausser: [] });
    if (k === null || (stufe === 1 && (k === n - k || String(k) === casP(pB)))) return gen['bv-cas'](stufe);
    const w = pdf(n, p, k);
    const ein = `binomPdf(${n},${casP(pB)},${k})`;
    if (stufe === 1) {
      return {
        frage: `${einleitung(c)} Mit welcher Eingabe berechnest du $P(X=${k})$ in der CAS-App?`,
        felder: auswahlFeld(code(ein), [code(`binomPdf(${n},${k},${casP(pB)})`), code(`binomPdf(${casP(pB)},${n},${k})`), code(`binomCdf(${n},${casP(pB)},${k})`)]),
        hinweis: `Reihenfolge bei ${code('binomPdf')}: zuerst die Anzahl der Versuche $n$, dann die Trefferwahrscheinlichkeit $p$, dann die Anzahl der Treffer $k$.`,
        loesung: [`$n=${n}$, $p=${pTex(pB)}$, $k=${k}$: ${code(ein)} $\\approx ${dzTex(w)}$`, `${code('binomCdf')} berechnet etwas anderes (kumulierte Wahrscheinlichkeiten).`],
      };
    }
    const casFeld = { art: 'cas', label: 'Eingabe', soll: { art: 'binompdf', n, p, k }, loesung: ein, ausgabe: casZahl(w), platzhalter: 'binomPdf(…)' };
    const felder = [casFeld, wFeld(`$P(X=${k})$`, w)];
    if (stufe === 3) {
      const pr = prozentText(w);
      felder.push(auswahl('Was bedeutet das Ergebnis',
        `Wenn man die ${n} Versuche sehr oft wiederholt, gibt es in etwa ${pr} der Fälle genau ${K.anz(k)}.`,
        [`Etwa ${pr} der ${n} Versuche sind Treffer.`, `Mit einer Wahrscheinlichkeit von etwa ${pr} gibt es mindestens ${K.anz(k)}.`]));
    }
    return {
      frage: stufe === 2
        ? `${einleitung(c)} Berechne $P(X=${k})$ mit der CAS-App (Befehl ${code('binomPdf')}). ${RUNDEN}`
        : `${K.satz(n, pB)} Berechne die Wahrscheinlichkeit für „genau ${K.anz(k)}“ mit der CAS-App und deute das Ergebnis. ${RUNDEN}`,
      felder,
      hinweis: `${code('binomPdf(n,p,k)')}: $n$ Anzahl der Versuche, $p$ Trefferwahrscheinlichkeit (mit Dezimalpunkt), $k$ Anzahl der Treffer.${stufe === 3 ? ' Lege zuerst fest, was ein Treffer ist.' : ''}`,
      loesung: [
        `$n=${n}$, $p=${pTex(pB)}$, $k=${k}$: ${code(ein)} ergibt ${casZahl(w)}, also $P(X=${k})\\approx ${dzTex(w)}$.`,
        ...(stufe === 3 ? [`Bei sehr vielen Wiederholungen der ${n} Versuche erhält man in etwa ${prozentText(w)} der Fälle genau ${K.anz(k)}.`] : []),
      ],
    };
  };

  // =====================================================================
  // 5 Sachaufgaben, vermischt
  // =====================================================================
  const MODELLANNAHME = auswahlVorlage(
    'Die Trefferwahrscheinlichkeit ist bei jedem Versuch gleich, und die Versuche beeinflussen sich nicht gegenseitig.',
    ['Treffer und Niete sind gleich wahrscheinlich.', 'Nach einem Treffer folgt immer eine Niete.', 'Die Anzahl der Treffer steht vorher fest.'],
  );
  function auswahlVorlage(richtig, falsch) { return () => auswahl('Welche Annahme steckt im Modell der Binomialverteilung', richtig, falsch); }

  gen['bv-kontext'] = (stufe) => {
    const c = kontext({ nMin: 5 });
    const { K, n, pB, p } = c;
    const ok = (w) => w >= 0.005 && w <= 0.995;
    const fragen = [];
    const k1 = gutesK(n, p, { grenze: 0.05, min: 1, max: n - 1 });
    if (k1 === null) return gen['bv-kontext'](stufe);
    const genau = (k) => ({ ereignis: `genau ${K.anz(k)}`, w: pdf(n, p, k), loes: `$P(X=${k})=${formel(n, pB, k)}\\approx ${dzTex(pdf(n, p, k))}$` });
    const keine = { ereignis: K.keine, w: pdf(n, p, 0), loes: `$P(X=0)=${pot(EINS.minus(pB), n)}\\approx ${dzTex(pdf(n, p, 0))}$` };
    const alle = { ereignis: K.alle, w: pdf(n, p, n), loes: `$P(X=${n})=${pot(pB, n)}\\approx ${dzTex(pdf(n, p, n))}$` };
    const mind1 = { ereignis: `mindestens ${K.anz(1)}`, w: 1 - pdf(n, p, 0), loes: `$P(X\\ge 1)=1-P(X=0)=1-${pot(EINS.minus(pB), n)}\\approx ${dzTex(1 - pdf(n, p, 0))}$` };
    const h2w = pdf(n, p, 0) + pdf(n, p, 1) + pdf(n, p, 2);
    const hoechst2 = { ereignis: `höchstens ${K.anz(2)}`, w: h2w, loes: `$P(X\\le 2)=P(X=0)+P(X=1)+P(X=2)\\approx ${dzTex(pdf(n, p, 0))}+${dzTex(pdf(n, p, 1))}+${dzTex(pdf(n, p, 2))}\\approx ${dzTex(h2w)}$ (mit ungerundeten Werten gerechnet)` };
    fragen.push(genau(k1));
    const rand = R.mische([keine, alle]).filter((f) => ok(f.w));
    if (stufe === 1) {
      const k2 = gutesK(n, p, { grenze: 0.02, ausser: [k1, 0, n] });
      if (k2 !== null) fragen.push(genau(k2));
      if (rand.length) fragen.push(rand[0]);
    } else if (stufe === 2) {
      if (rand.length) fragen.push(rand[0]);
      if (ok(mind1.w)) fragen.push(mind1);
    } else {
      if (ok(hoechst2.w) && n >= 4) fragen.push(hoechst2);
      if (ok(mind1.w)) fragen.push(mind1);
    }
    if (fragen.length < 2) return gen['bv-kontext'](stufe);
    const B = 'abcd';
    const felder = fragen.map((f, i) => wFeld(`${B[i]}) „${f.ereignis}“`, f.w));
    if (stufe === 3) felder.push(MODELLANNAHME());
    return {
      frage: `${einleitung(c)} Berechne die Wahrscheinlichkeiten der folgenden Ereignisse – mit der Formel oder mit der CAS-App. ${RUNDEN}`,
      felder,
      notiz: true,
      hinweis: `Bestimme zuerst $n$ und $p$. Übersetze dann jedes Ereignis in die Schreibweise mit $X$.${stufe > 1 ? ' „mindestens …“ geht schnell über das Gegenereignis.' : ''}${stufe === 3 ? ' „höchstens 2“ heißt: 0, 1 oder 2.' : ''}`,
      loesung: [
        `$n=${n}$, $p=${pTex(pB)}$.`,
        ...fragen.map((f, i) => `${B[i]}) ${f.loes}`),
        ...(stufe === 3 ? ['Modellannahme: Die Trefferwahrscheinlichkeit ist bei jedem Versuch gleich, und die Versuche beeinflussen sich nicht gegenseitig (unabhängige Versuche).'] : []),
      ],
    };
  };

  UM.binomial = { bk, pdf, pdfExakt, KONTEXTE };
})(typeof window !== 'undefined' ? window : globalThis);
