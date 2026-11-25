/*
 * Aufgaben-Generatoren: Binomialverteilung und Formel von Bernoulli (Q2 GK)
 *
 * Format der Aufgaben: siehe generatoren/rationale-zahlen.js.
 * Wahrscheinlichkeiten werden als Feld { art:'naeherung', stellen:4, prozent:true } abgefragt:
 * mindestens vier Nachkommastellen (oder zwei in Prozent); wo der Wert ein kurzer Bruch ist, zählt auch der Bruch.
 * CAS-Befehl: binomPdf(n,p,k) (TI-Nspire CAS), Prüfung in assets/js/cas.js.
 * Formel im Unterricht: P(X=k) = (n über k) · p^k · (1−p)^(n−k).
 * Kenngrößen (AB 40/41): μ = n·p, σ = √(n·p·(1−p)); σ-Regeln gehören nicht zum GK.
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


  // =====================================================================
  // Histogramme
  // =====================================================================
  function schritt(max, ziel) {
    const roh = max / ziel, mag = 10 ** Math.floor(Math.log10(roh));
    for (const m of [1, 2, 2.5, 5, 10]) if (m * mag >= roh - 1e-12) return m * mag;
    return 10 * mag;
  }
  const komma = (x, d) => x.toFixed(d).replace('.', ',');
  /**
   * Histogramm als SVG.
   * opt: kMax (Ende der k-Achse), von (Anfang der k-Achse, dann gilt kMax genau), yMax, markiert (Menge von k), werte (Balkenhöhen beschriften), klein, titel
   */
  function histSvg(werte, opt = {}) {
    const klein = !!opt.klein;
    const W = klein ? 300 : 560, H = klein ? 190 : 270;
    const m = klein ? { l: 38, r: 8, t: 14, b: 26 } : { l: 52, r: 14, t: opt.werte ? 26 : 16, b: 40 };
    const n = werte.length - 1;
    // opt.zuschneiden: nur den Bereich zeigen, in dem die Balken sichtbar sind (große n)
    let von = opt.von ?? 0;
    let kMax = opt.von !== undefined ? opt.kMax : Math.max(opt.kMax ?? n, n);
    if (opt.zuschneiden) {
      const sichtbar = werte.map((w, k) => (w >= 0.0005 || (opt.markiert && opt.markiert.has(k) && w >= 0.00005) ? k : -1)).filter((k) => k >= 0);
      von = Math.max(0, Math.min(...sichtbar) - 1);
      kMax = Math.min(n, Math.max(...sichtbar) + 1);
    }
    const datenMax = Math.max(...werte);
    const yS = schritt(opt.yMax ?? datenMax, klein ? 3 : 5);
    const yMax = opt.yMax ?? Math.ceil(datenMax / yS - 1e-9) * yS;
    const pw = W - m.l - m.r, ph = H - m.t - m.b;
    const slot = pw / (kMax - von + 1), bw = slot * (kMax - von > 25 ? 0.86 : 0.78);
    const X = (k) => m.l + slot * (k - von + 0.5), Y = (v) => m.t + ph * (1 - Math.min(v, yMax) / yMax);
    const yDez = (String(+yS.toPrecision(6)).split('.')[1] || '').length;
    let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Histogramm"${klein ? ' class="hist-klein"' : ''}>`;
    for (let i = 0; i * yS <= yMax + 1e-9; i++) {
      const y = Y(i * yS);
      if (i > 0) s += `<line x1="${m.l}" x2="${m.l + pw}" y1="${y}" y2="${y}" class="ks-gitter"/>`;
      s += `<text x="${m.l - 6}" y="${y + 4}" class="ks-zahl ks-links">${i === 0 ? '0' : komma(i * yS, yDez)}</text>`;
    }
    for (let k = von; k <= Math.min(n, kMax); k++) {
      const y = Y(werte[k]);
      s += `<rect x="${X(k) - bw / 2}" y="${y}" width="${bw}" height="${m.t + ph - y}" class="hg-balken${opt.markiert && opt.markiert.has(k) ? ' hg-markiert' : ''}"/>`;
      if (opt.werte) s += `<text x="${X(k)}" y="${y - 5}" class="ks-zahl">${komma(werte[k], 2)}</text>`;
    }
    s += `<line x1="${m.l}" x2="${m.l + pw}" y1="${m.t + ph}" y2="${m.t + ph}" class="ks-achse"/>`;
    s += `<line x1="${m.l}" x2="${m.l}" y1="${m.t + ph}" y2="${m.t - 6}" class="ks-achse"/>`;
    let ks = 1;
    for (const t of [1, 2, 5, 10]) { ks = t; if (slot * t >= (klein ? 18 : 24)) break; }
    for (let k = Math.ceil(von / ks) * ks; k <= kMax; k += ks) s += `<text x="${X(k)}" y="${m.t + ph + 15}" class="ks-zahl">${k}</text>`;
    if (!klein) s += `<text x="${m.l + pw}" y="${H - 4}" class="ks-text" text-anchor="end">k</text>`;
    if (opt.titel) s += `<text x="${m.l + 8}" y="${m.t + 14}" class="hg-titel">${opt.titel}</text>`;
    return s + '</svg>';
  }
  /** wahrscheinlichster Wert, falls eindeutig */
  function modus(werte) {
    const max = Math.max(...werte);
    const ks = werte.map((w, k) => (max - w < 1e-9 ? k : -1)).filter((k) => k >= 0);
    return ks.length === 1 ? ks[0] : null;
  }
  const npText = (n, pB) => `$n=${n}$, $p=${pTex(pB)}$`;

  gen['bv-histogramm'] = (stufe) => {
    if (stufe === 1) {
      const c = kontext({ nMin: 6, nMax: 14 });
      const { K, n, pB, p } = c;
      const werte = Array.from({ length: n + 1 }, (_, k) => pdf(n, p, k));
      const mo = modus(werte);
      if (mo === null) return gen['bv-histogramm'](stufe);
      // Ablesen: ein Balken, der nicht der höchste ist, mit gut ablesbarer Höhe
      const k2 = gutesK(n, p, { grenze: 0.06, ausser: [mo] });
      if (k2 === null) return gen['bv-histogramm'](stufe);
      const richtig = komma(werte[k2], 2);
      const falsch = [];
      for (const d of R.mische([-0.1, -0.05, 0.05, 0.1, 0.15])) {
        const v = Math.round((werte[k2] + d) * 100) / 100;
        const t = komma(v, 2);
        if (v > 0 && v < 1 && t !== richtig && !falsch.includes(t)) falsch.push(t);
        if (falsch.length === 3) break;
      }
      // Ereignis „höchstens m“ oder „mindestens m“
      // m so wählen, dass das Ereignis sichtbare Balken enthält und nicht fast sicher ist
      const hoechst = Math.random() < 0.5;
      const kandM = [];
      for (let m = 2; m <= n - 2; m++) {
        let pe = 0;
        for (let k = 0; k <= n; k++) if (hoechst ? k <= m : k >= m) pe += werte[k];
        if (pe >= 0.15 && pe <= 0.85) kandM.push(m);
      }
      if (!kandM.length) return gen['bv-histogramm'](stufe);
      const mm = R.wahl(kandM);
      const ereignis = `${hoechst ? 'höchstens' : 'mindestens'} ${K.anz(mm)}`;
      const bereich = (a, b) => (a === b ? `nur der Balken bei k = ${a}` : `die Balken bei k = ${a} bis k = ${b}`);
      const rE = hoechst ? bereich(0, mm) : bereich(mm, n);
      const fE = hoechst ? [bereich(0, mm - 1), bereich(mm, n), bereich(mm, mm)] : [bereich(mm + 1, n), bereich(0, mm), bereich(mm, mm)];
      const markiert = new Set(Array.from({ length: n + 1 }, (_, k) => k).filter((k) => (hoechst ? k <= mm : k >= mm)));
      return {
        frage: `${einleitung(c)} Das Histogramm zeigt die Wahrscheinlichkeitsverteilung von $X$.`,
        bild: histSvg(werte),
        felder: [
          { art: 'zahl', label: 'Wahrscheinlichster Wert von $k$', antwort: new Bruch(mo) },
          auswahl(`P(X = ${k2}) beträgt ungefähr`, richtig, falsch),
          auswahl(`Zum Ereignis „${ereignis}“ gehören`, rE, fE),
        ],
        hinweis: 'Jeder Balken gehört zu einem Wert $k$ auf der Rechtsachse. Seine Höhe ist die Wahrscheinlichkeit $P(X=k)$ – lies sie an der Hochachse ab.',
        loesung: [
          `Der höchste Balken steht bei $k=${mo}$. Der Balken bei $k=${k2}$ ist etwa ${richtig} hoch: $P(X=${k2})=${dzTex(werte[k2])}$.`,
          `„${ereignis}“ heißt $X${hoechst ? '\\le' : '\\ge'} ${mm}$: ${rE} (im Bild markiert).`,
          { svg: histSvg(werte, { markiert }) },
        ],
      };
    }
    if (stufe === 2) {
      // vier Verteilungen mit gleichen Achsen
      const n0 = R.wahl([10, 20]);
      const p0 = R.wahl(['0,2', '0,3', '0,7', '0,8'].map(Bruch.dez));
      const n1 = n0 + 10;
      const satz = [
        { n: n0, pB: p0 },
        { n: n0, pB: EINS.minus(p0) },
        { n: n0, pB: Bruch.dez('0,5') },
        { n: n1, pB: p0 },
      ];
      const kMax = n1;
      const alle = satz.map((d) => Array.from({ length: d.n + 1 }, (_, k) => pdf(d.n, d.pB.zahl(), k)));
      const yMax = schritt(Math.max(...alle.flat()), 4) * Math.ceil(Math.max(...alle.flat()) / schritt(Math.max(...alle.flat()), 4) - 1e-9);
      const ziel = R.int(0, 3);
      const t = satz[ziel];
      const erkl = [
        `Bei $p=${pTex(t.pB)}$ liegt der Gipfel ${t.pB.zahl() < 0.5 ? 'links' : 'rechts'}, ungefähr beim Anteil $${pTex(t.pB)}$ der $${t.n}$ Versuche, also bei $k\\approx ${Math.round(t.n * t.pB.zahl())}$.`,
        `Bei $p=${pTex(t.pB)}$ liegt der Gipfel ${t.pB.zahl() < 0.5 ? 'links' : 'rechts'}, ungefähr beim Anteil $${pTex(t.pB)}$ der $${t.n}$ Versuche, also bei $k\\approx ${Math.round(t.n * t.pB.zahl())}$.`,
        `Bei $p=0{,}5$ ist das Histogramm symmetrisch mit dem Gipfel in der Mitte bei $k=${t.n / 2}$.`,
        `Bei $n=${t.n}$ statt $${n0}$ liegt der Gipfel weiter rechts (bei $k\\approx ${Math.round(t.n * t.pB.zahl())}$), und das Histogramm ist breiter und flacher.`,
      ][ziel];
      if (Math.random() < 0.5) {
        // Parameter gegeben, Histogramm wählen
        const reihenfolge = R.mische([0, 1, 2, 3]);
        return {
          frage: `Welches Histogramm gehört zur Binomialverteilung mit ${npText(t.n, t.pB)}? Alle vier Histogramme haben dieselben Achsen.`,
          felder: [{ art: 'auswahl', label: 'Histogramm', optionen: reihenfolge.map((i) => histSvg(alle[i], { kMax, yMax, klein: true })), richtig: reihenfolge.indexOf(ziel) }],
          hinweis: 'Achte auf die Lage des Gipfels (Anteil $p$ der $n$ Versuche), auf die Symmetrie und auf Breite und Höhe.',
          loesung: [erkl, { svg: histSvg(alle[ziel], { kMax, yMax }) }],
        };
      }
      // Histogramm gegeben, Parameter wählen
      const opt = satz.map((d) => npText(d.n, d.pB));
      const reihenfolge = R.mische([0, 1, 2, 3]);
      return {
        frage: 'Zu welcher Binomialverteilung gehört das Histogramm?',
        bild: histSvg(alle[ziel], { kMax, yMax }),
        felder: [{ art: 'auswahl', label: 'Verteilung', optionen: reihenfolge.map((i) => opt[i]), richtig: reihenfolge.indexOf(ziel) }],
        hinweis: 'Wo liegt der Gipfel im Verhältnis zur Anzahl der Versuche? Ist das Histogramm symmetrisch? Wie weit reichen die Balken, die man noch sieht?',
        loesung: [`${opt[ziel]}. ${erkl}`],
      };
    }
    // Stufe 3: Kann das ein Histogramm von B(n; p) sein?
    const GRUENDE = [
      'Ja, es kann passen: Die Höhen ergeben zusammen 1, es gibt nur einen Gipfel, und seine Lage passt zu $p$.',
      'Nein, die Balkenhöhen ergeben zusammen nicht 1.',
      'Nein, das Diagramm hat zwei getrennte Gipfel.',
      'Nein, für $p=0{,}5$ müsste das Histogramm symmetrisch sein.',
      'Nein, der Gipfel liegt auf der falschen Seite.',
    ];
    const n = R.int(6, 10);
    const art = R.wahl([0, 0, 1, 2, 3, 4]);
    let pB, werte;
    const b = (q) => Array.from({ length: n + 1 }, (_, k) => pdf(n, q, k));
    if (art === 0) { pB = R.wahl(['0,2', '0,3', '0,4', '0,5', '0,6', '0,7', '0,8'].map(Bruch.dez)); werte = b(pB.zahl()); }
    else if (art === 1) { pB = R.wahl(['0,3', '0,4', '0,6', '0,7'].map(Bruch.dez)); const f = R.wahl([0.7, 1.3, 1.4]); werte = b(pB.zahl()).map((w) => w * f); }
    else if (art === 2) { pB = R.wahl(['0,4', '0,5', '0,6'].map(Bruch.dez)); const u = b(0.15), v = b(0.8); werte = u.map((w, k) => 0.5 * w + 0.5 * v[k]); }
    else if (art === 3) { pB = Bruch.dez('0,5'); werte = b(R.wahl([0.35, 0.65])); }
    else { pB = R.wahl(['0,2', '0,3', '0,7', '0,8'].map(Bruch.dez)); werte = b(1 - pB.zahl()); }
    const summe = werte.reduce((a, w) => a + w, 0);
    const begruendung = [
      'Die Höhen ergeben zusammen 1, es gibt einen Gipfel, und er liegt passend zu $p$.',
      `Die Balkenhöhen ergeben zusammen etwa $${dzTex(summe, 2)}$. Bei einer Wahrscheinlichkeitsverteilung muss die Summe 1 sein.`,
      'Ein Histogramm einer Binomialverteilung steigt bis zu einem Gipfel an und fällt danach ab. Hier gibt es zwei getrennte Gipfel.',
      `Bei $p=0{,}5$ sind Treffer und Niete gleich wahrscheinlich, das Histogramm müsste symmetrisch zu $k=${komma(n / 2, n % 2 ? 1 : 0)}$ sein.`,
      `Bei $p=${pTex(pB)}$ sind Treffer ${pB.zahl() < 0.5 ? 'seltener als Nieten, der Gipfel müsste links' : 'häufiger als Nieten, der Gipfel müsste rechts'} liegen.`,
    ][art];
    return {
      frage: `Das Diagramm soll die Binomialverteilung mit ${npText(n, pB)} zeigen. Die Zahlen über den Balken sind die Balkenhöhen. Kann das stimmen?`,
      bild: histSvg(werte, { werte: true }),
      felder: [{ art: 'auswahl', label: 'Entscheide und begründe', optionen: GRUENDE, richtig: art }],
      hinweis: 'Prüfe nacheinander: Summe der Höhen, Anzahl der Gipfel, Lage des Gipfels (kleines $p$: links, großes $p$: rechts), Symmetrie bei $p=0{,}5$.',
      loesung: [`${GRUENDE[art]} ${begruendung}`],
    };
  };


  // =====================================================================
  // Kumulierte Binomialverteilung (AB 38/39): Grenzen, binomCdf, Gegenereignis, Sachaufgaben
  // =====================================================================
  /** P(a ≤ X ≤ b) */
  function cdf(n, p, a, b) {
    let s = 0;
    for (let k = Math.max(0, a); k <= Math.min(n, b); k++) s += pdf(n, p, k);
    return s;
  }
  const pl = (k, s, p) => (k === 1 ? `1 ${s}` : `${k} ${p}`);
  /*
   * Sachzusammenhänge mit größerem n.
   * anz(k): Treffer, ohne(k): Nieten (für Ereignisse, die die Nieten zählen)
   */
  const KUM = [
    {
      id: 'haustier', p: ['0,4', '0,45', '0,35'].map(Bruch.dez), n: [50, 80, 100],
      satz: (n, pB) => `In etwa ${pProzent(pB)} der Haushalte lebt ein Haustier. Für eine Umfrage werden ${n} Haushalte zufällig ausgewählt.`,
      X: 'die Anzahl der ausgewählten Haushalte mit Haustier',
      anz: (k) => pl(k, 'Haushalt mit Haustier', 'Haushalte mit Haustier'), ohne: (k) => pl(k, 'Haushalt ohne Haustier', 'Haushalte ohne Haustier'),
    },
    {
      id: 'mc', p: [new Bruch(1, 4), new Bruch(1, 5)], n: [30, 40, 60],
      satz: (n, pB) => `Ein Multiple-Choice-Test besteht aus ${n} Aufgaben mit je ${pB.n} Antwortmöglichkeiten, von denen genau eine richtig ist. Tom rät bei allen Aufgaben.`,
      X: 'die Anzahl der richtigen Antworten',
      anz: (k) => pl(k, 'richtige Antwort', 'richtige Antworten'), ohne: (k) => pl(k, 'falsche Antwort', 'falsche Antworten'),
    },
    {
      id: 'samen', p: ['0,8', '0,85', '0,9'].map(Bruch.dez), n: [50, 80, 100],
      satz: (n, pB) => `Von einer Sorte Blumensamen keimen ${pProzent(pB)}. Es werden ${n} Samen ausgesät.`,
      X: 'die Anzahl der gekeimten Samen',
      anz: (k) => pl(k, 'gekeimter Samen', 'gekeimte Samen'), ohne: (k) => `${k} Samen, die nicht keimen`,
    },
    {
      id: 'schrauben', p: ['0,04', '0,05', '0,08'].map(Bruch.dez), n: [100, 150, 200],
      satz: (n, pB) => `Bei einer Maschine sind ${pProzent(pB)} der hergestellten Schrauben fehlerhaft. Es werden ${n} Schrauben zufällig entnommen.`,
      X: 'die Anzahl der fehlerhaften Schrauben',
      anz: (k) => pl(k, 'fehlerhafte Schraube', 'fehlerhafte Schrauben'), ohne: (k) => pl(k, 'fehlerfreie Schraube', 'fehlerfreie Schrauben'),
    },
    {
      id: 'freiwurf', p: ['0,7', '0,75', '0,8'].map(Bruch.dez), n: [20, 30, 40],
      satz: (n, pB) => `Eine Basketballspielerin trifft beim Freiwurf mit einer Wahrscheinlichkeit von ${pProzent(pB)}. Sie wirft ${n} Freiwürfe.`,
      X: 'die Anzahl der Treffer',
      anz: (k) => pl(k, 'Treffer', 'Treffer'), ohne: (k) => pl(k, 'Fehlwurf', 'Fehlwürfe'),
    },
    {
      id: 'zug', p: ['0,85', '0,9', '0,8'].map(Bruch.dez), n: [30, 40, 60],
      satz: (n, pB) => `Ein Pendlerzug ist erfahrungsgemäß mit einer Wahrscheinlichkeit von ${pProzent(pB)} pünktlich. Betrachtet werden ${n} Fahrten.`,
      X: 'die Anzahl der pünktlichen Fahrten',
      anz: (k) => pl(k, 'pünktliche Fahrt', 'pünktliche Fahrten'), ohne: (k) => pl(k, 'unpünktliche Fahrt', 'unpünktliche Fahrten'),
    },
  ];
  function kumKontext() {
    const K = R.wahl(KUM);
    const pB = R.wahl(K.p);
    return { K, n: R.wahl(K.n), pB, p: pB.zahl() };
  }
  const kumEinleitung = (c) => `${c.K.satz(c.n, c.pB)} Die Zufallsgröße $X$ gibt ${c.K.X} an.`;

  /** Zahl in der Nähe des Erwartungswerts: µ + d·σ */
  function nahe(n, p, d) {
    const mu = n * p, sd = Math.sqrt(n * p * (1 - p));
    return Math.min(n - 1, Math.max(1, Math.round(mu + d * sd)));
  }
  /*
   * Ereignis mit Grenzen [a, b] und Text.
   * arten: 'genau', 'hoechstens', 'mindestens', 'mehrAls', 'wenigerAls', 'zwischenOffen', 'zwischen'
   */
  function ereignis(art, n, p, anz) {
    for (let v = 0; v < 60; v++) {
      const m = nahe(n, p, R.wahl([-1.4, -1, -0.6, -0.3, 0.3, 0.6, 1, 1.4]));
      let a, b, text;
      if (art === 'genau') { a = b = m; text = `genau ${anz(m)}`; }
      else if (art === 'hoechstens') { a = 0; b = m; text = `höchstens ${anz(m)}`; }
      else if (art === 'mindestens') { a = m; b = n; text = `mindestens ${anz(m)}`; }
      else if (art === 'mehrAls') { a = m + 1; b = n; text = `mehr als ${anz(m)}`; }
      else if (art === 'wenigerAls') { a = 0; b = m - 1; text = `weniger als ${anz(m)}`; }
      else {
        const lo = nahe(n, p, R.wahl([-1.5, -1, -0.7])), hi = nahe(n, p, R.wahl([0.5, 1, 1.5]));
        if (hi - lo < 3) continue;
        if (art === 'zwischenOffen') { a = lo + 1; b = hi - 1; text = `mehr als ${lo}, aber weniger als ${anz(hi)}`; }
        else { a = lo; b = hi; text = `mindestens ${lo} und höchstens ${anz(hi)}`; }
      }
      if (a > b || a < 0 || b > n) continue;
      const w = cdf(n, p, a, b);
      if (w >= 0.01 && w <= 0.99) return { art, a, b, text, w, m };
    }
    return null;
  }
  /** P(a ≤ X ≤ b) als TeX, mit Kurzform für a = 0, b = n, a = b */
  function pTexAB(a, b, n) {
    if (a === b) return `P(X=${a})`;
    if (a === 0) return `P(X\\le ${b})`;
    if (b === n) return `P(X\\ge ${a})`;
    return `P(${a}\\le X\\le ${b})`;
  }
  const cdfCode = (n, pB, a, b) => `binomCdf(${n},${casP(pB)},${a},${b})`;
  const GRENZEN_TIPP = '„höchstens 5“: 0 bis 5. „mindestens 5“: 5 bis $n$. „mehr als 5“: ab 6. „weniger als 5“: bis 4.';

  // ---------- Grenzen setzen: P(a ≤ X ≤ b) ----------
  gen['bv-grenzen'] = (stufe) => {
    if (stufe === 2 && Math.random() < 0.5) {
      // markierte Balken im Histogramm
      const c = kontext({ nMin: 8, nMax: 15 });
      const { K, n, p } = c;
      const werte = Array.from({ length: n + 1 }, (_, k) => pdf(n, p, k));
      const typ = R.int(0, 2);
      const m = R.int(2, n - 2);
      let a, b, richtig, falsch;
      if (typ === 0) { a = 0; b = m; richtig = `höchstens ${K.anz(m)}`; falsch = [`weniger als ${K.anz(m)}`, `mindestens ${K.anz(m)}`, `mehr als ${K.anz(m)}`]; }
      else if (typ === 1) { a = m; b = n; richtig = `mindestens ${K.anz(m)}`; falsch = [`mehr als ${K.anz(m)}`, `höchstens ${K.anz(m)}`, `weniger als ${K.anz(m)}`]; }
      else {
        a = R.int(1, Math.max(1, n - 5)); b = Math.min(n - 1, a + R.int(2, 4));
        richtig = `mindestens ${a} und höchstens ${K.anz(b)}`;
        falsch = [`mehr als ${a} und weniger als ${K.anz(b)}`, `mehr als ${a} und höchstens ${K.anz(b)}`, `mindestens ${a} und weniger als ${K.anz(b)}`];
      }
      const markiert = new Set(Array.from({ length: b - a + 1 }, (_, i) => a + i));
      return {
        frage: `${einleitung(c)} Die markierten Balken gehören zu einem Ereignis.`,
        bild: histSvg(werte, { markiert }),
        felder: [
          { art: 'zahl', label: 'untere Grenze $a$', antwort: new Bruch(a) },
          { art: 'zahl', label: 'obere Grenze $b$', antwort: new Bruch(b) },
          auswahl('Das Ereignis heißt', richtig, falsch),
        ],
        term: 'P(\\boxed{a}\\le X\\le \\boxed{b})',
        hinweis: 'Lies ab, bei welchem $k$ die markierten Balken beginnen und enden. Beide Grenzen gehören dazu.',
        loesung: [`Markiert sind die Balken von $k=${a}$ bis $k=${b}$: $P(${a}\\le X\\le ${b})$, in Worten „${richtig}“.`],
      };
    }
    const c = kumKontext();
    const { K, n, p } = c;
    const art = stufe === 1 ? R.wahl(['hoechstens', 'mindestens'])
      : stufe === 2 ? R.wahl(['mehrAls', 'wenigerAls', 'mehrAls', 'wenigerAls', 'hoechstens', 'mindestens'])
        : R.wahl(['zwischenOffen', 'zwischen', 'ohne']);
    if (art === 'ohne') {
      // Ereignis über die Nieten – X zählt aber die Treffer
      const typ = R.wahl(['hoechstens', 'mindestens', 'mehrAls']);
      const e = ereignis(typ, n, 1 - p, K.ohne);
      if (!e) return gen['bv-grenzen'](stufe);
      const a = n - e.b, b = n - e.a;
      const markiert = new Set(Array.from({ length: b - a + 1 }, (_, i) => a + i));
      return {
        frage: `${kumEinleitung(c)} Schreibe die Wahrscheinlichkeit des Ereignisses „${e.text}“ in der Form $P(a\\le X\\le b)$.`,
        term: 'P(\\boxed{a}\\le X\\le \\boxed{b})',
        felder: [
          { art: 'zahl', label: 'untere Grenze $a$', antwort: new Bruch(a) },
          { art: 'zahl', label: 'obere Grenze $b$', antwort: new Bruch(b) },
        ],
        hinweis: `Achtung: $X$ zählt ${K.X.replace(/^die /, 'die ')}, das Ereignis spricht aber von den anderen. Bei ${n} insgesamt gilt: ${K.ohne(e.m)} bedeutet ${K.anz(n - e.m)}.`,
        loesung: [
          `„${e.text}“ zählt das Gegenteil von dem, was $X$ zählt: ${e.a} bis ${e.b}. Weil es insgesamt ${n} sind, nimmt $X$ dann die Werte ${n}−${e.b}=${a} bis ${n}−${e.a}=${b} an.`,
          `$P(${a}\\le X\\le ${b})=${pTexAB(a, b, n)}$`,
          { svg: histSvg(Array.from({ length: n + 1 }, (_, k) => pdf(n, p, k)), { markiert, zuschneiden: true }) },
        ],
      };
    }
    const e = ereignis(art, n, p, K.anz);
    if (!e) return gen['bv-grenzen'](stufe);
    const markiert = new Set(Array.from({ length: e.b - e.a + 1 }, (_, i) => e.a + i));
    return {
      frage: `${kumEinleitung(c)} Schreibe die Wahrscheinlichkeit des Ereignisses „${e.text}“ in der Form $P(a\\le X\\le b)$.`,
      term: 'P(\\boxed{a}\\le X\\le \\boxed{b})',
      felder: [
        { art: 'zahl', label: 'untere Grenze $a$', antwort: new Bruch(e.a) },
        { art: 'zahl', label: 'obere Grenze $b$', antwort: new Bruch(e.b) },
      ],
      hinweis: `Überlege, welche Werte von $X$ dazugehören. ${GRENZEN_TIPP}`,
      loesung: [
        `„${e.text}“: $X$ nimmt einen der Werte ${e.a}, ${e.a + 1}, …, ${e.b} an, also $P(${e.a}\\le X\\le ${e.b})${a0bn(e.a, e.b, n)}$.`,
        { svg: histSvg(Array.from({ length: n + 1 }, (_, k) => pdf(n, p, k)), { markiert, zuschneiden: true }) },
      ],
    };
  };
  const a0bn = (a, b, n) => (a === 0 || b === n ? `=${pTexAB(a, b, n)}` : '');

  // ---------- binomCdf in der CAS-App ----------
  gen['bv-cdf'] = (stufe) => {
    const c = kumKontext();
    const { K, n, pB, p } = c;
    const art = stufe === 1 ? R.wahl(['mehrAls', 'wenigerAls', 'mindestens', 'hoechstens'])
      : stufe === 2 ? R.wahl(['mehrAls', 'wenigerAls', 'mindestens', 'hoechstens', 'zwischen'])
        : R.wahl(['zwischenOffen', 'zwischen', 'ohne', 'ohne']);
    let e, a, b;
    if (art === 'ohne') {
      e = ereignis(R.wahl(['hoechstens', 'mehrAls', 'mindestens']), n, 1 - p, K.ohne);
      if (!e) return gen['bv-cdf'](stufe);
      a = n - e.b; b = n - e.a;
    } else {
      e = ereignis(art, n, p, K.anz);
      if (!e) return gen['bv-cdf'](stufe);
      ({ a, b } = e);
    }
    const w = cdf(n, p, a, b);
    const ein = cdfCode(n, pB, a, b);
    if (stufe === 1) {
      const falsch = [];
      const kand = [cdfCode(n, pB, a === 0 ? a : a - 1, b), cdfCode(n, pB, a, b === n ? b : b + 1), cdfCode(n, pB, a + 1 <= b ? a + 1 : a, b), `binomPdf(${n},${casP(pB)},${e.m})`, cdfCode(n, pB, b, a)];
      for (const k of kand) if (k !== ein && !falsch.includes(k) && falsch.length < 3) falsch.push(k);
      return {
        frage: `${kumEinleitung(c)} Mit welcher Eingabe berechnest du die Wahrscheinlichkeit des Ereignisses „${e.text}“?`,
        felder: [auswahl('Eingabe', code(ein), falsch.map(code))],
        hinweis: `${code('binomCdf(n,p,untere Grenze,obere Grenze)')} berechnet $P(a\\le X\\le b)$ – beide Grenzen gehören dazu. ${GRENZEN_TIPP}`,
        loesung: [`„${e.text}“ heißt $${pTexAB(a, b, n)}$: ${code(ein)} $\\approx ${dzTex(w)}$.`],
      };
    }
    const casFeld = { art: 'cas', label: 'Eingabe', soll: { art: 'binomcdf', n, p, a, b }, loesung: ein, ausgabe: casZahl(w), platzhalter: 'binomCdf(…)' };
    return {
      frage: `${kumEinleitung(c)} Berechne die Wahrscheinlichkeit des Ereignisses „${e.text}“ mit der CAS-App. ${RUNDEN}`,
      felder: [casFeld, wFeld(`$${pTexAB(a, b, n)}$`.replace(/^\$P/, '$P'), w)].map((f, i) => (i === 1 ? { ...f, label: 'Wahrscheinlichkeit' } : f)),
      hinweis: `Bestimme zuerst die Grenzen: Welche Werte von $X$ gehören dazu? Dann ${code('binomCdf(n,p,untere Grenze,obere Grenze)')}.${art === 'ohne' ? ' Achtung: $X$ zählt die anderen – rechne die Anzahl um.' : ''}`,
      loesung: [
        ...(art === 'ohne' ? [`„${e.text}“ bedeutet für $X$: von ${n}−${e.b}=${a} bis ${n}−${e.a}=${b}.`] : []),
        `$${pTexAB(a, b, n)}$: ${code(ein)} ergibt ${casZahl(w)}, also etwa $${dzTex(w)}$.`,
      ],
    };
  };

  // ---------- Gegenereignis ----------
  const WUERFEL = [
    { text: 'Augenzahl 2', p: new Bruch(1, 6) },
    { text: 'Augenzahl 5 oder 6', p: new Bruch(1, 3) },
    { text: 'eine Augenzahl kleiner als 5', p: new Bruch(2, 3) },
    { text: 'eine Augenzahl größer als 1', p: new Bruch(5, 6) },
    { text: 'Augenzahl 2 oder 3', p: new Bruch(1, 3) },
    { text: 'keine Sechs', p: new Bruch(5, 6) },
    { text: 'eine gerade Augenzahl', p: new Bruch(1, 2) },
    { text: 'eine Eins', p: new Bruch(1, 6) },
  ];
  gen['bv-gegen'] = (stufe) => {
    let einl, n, pB, anzW;
    if (stufe === 2 || Math.random() < 0.6) {
      const ev = R.wahl(WUERFEL);
      n = R.wahl([15, 20, 25, 30]); pB = ev.p;
      anzW = (k) => `${k}-mal ${ev.text}`;
      einl = `Ein Würfel wird ${n}-mal geworfen. Die Zufallsgröße $X$ gibt an, wie oft dabei ${ev.text.replace(/^Augenzahl/, 'die Augenzahl')} fällt.`;
      if (ev.text === 'keine Sechs') einl = `Ein Würfel wird ${n}-mal geworfen. Die Zufallsgröße $X$ gibt an, bei wie vielen Würfen keine Sechs fällt.`;
    } else {
      const c = kumKontext();
      n = c.n; pB = c.pB; anzW = c.K.anz; einl = kumEinleitung(c);
    }
    const p = pB.zahl();
    let e, gegen, falsch, ga, gb, ga2, gb2;
    if (stufe < 3) {
      const art = R.wahl(['mehrAls', 'mindestens', 'hoechstens', 'wenigerAls']);
      e = ereignis(art, n, p, anzW);
      if (!e) return gen['bv-gegen'](stufe);
      const m = e.m;
      const T = { mehrAls: `mehr als ${anzW(m)}`, mindestens: `mindestens ${anzW(m)}`, hoechstens: `höchstens ${anzW(m)}`, wenigerAls: `weniger als ${anzW(m)}` };
      const G = { mehrAls: 'hoechstens', mindestens: 'wenigerAls', hoechstens: 'mehrAls', wenigerAls: 'mindestens' };
      gegen = T[G[art]];
      falsch = Object.keys(T).filter((k) => k !== G[art] && k !== art).map((k) => T[k]);
      falsch.push(T[art].replace(String(m), String(art === 'mehrAls' || art === 'hoechstens' ? m - 1 : m + 1)).replace(/^(mehr als|mindestens|höchstens|weniger als)/, (x) => ({ 'mehr als': 'höchstens', mindestens: 'weniger als', 'höchstens': 'mehr als', 'weniger als': 'mindestens' })[x]));
      // Gegenereignis als Intervall
      [ga, gb] = e.a === 0 ? [e.b + 1, n] : [0, e.a - 1];
    } else {
      const art = R.wahl(['zwischenOffen', 'zwischen']);
      e = ereignis(art, n, p, anzW);
      if (!e) return gen['bv-gegen'](stufe);
      const lo = art === 'zwischenOffen' ? e.a - 1 : e.a, hi = art === 'zwischenOffen' ? e.b + 1 : e.b;
      if (art === 'zwischenOffen') {
        gegen = `höchstens ${lo} oder mindestens ${anzW(hi)}`;
        falsch = [`weniger als ${lo} oder mehr als ${anzW(hi)}`, `mindestens ${lo} und höchstens ${anzW(hi)}`, `höchstens ${lo} und mindestens ${anzW(hi)}`];
      } else {
        gegen = `weniger als ${lo} oder mehr als ${anzW(hi)}`;
        falsch = [`höchstens ${lo} oder mindestens ${anzW(hi)}`, `mehr als ${lo} und weniger als ${anzW(hi)}`, `weniger als ${lo} und mehr als ${anzW(hi)}`];
      }
      [ga, gb, ga2, gb2] = [0, e.a - 1, e.b + 1, n];
    }
    const wE = e.w, wG = 1 - wE;
    const gTex = ga2 === undefined ? pTexAB(ga, gb, n) : `${pTexAB(ga, gb, n)}+${pTexAB(ga2, gb2, n)}`;
    return {
      frage: `${einl} Gib das Gegenereignis zu „${e.text}“ an und bestimme seine Wahrscheinlichkeit. ${RUNDEN}`,
      felder: [auswahl('Gegenereignis', gegen, falsch.slice(0, 3)), wFeld('Wahrscheinlichkeit des Gegenereignisses', wG)],
      notiz: true,
      hinweis: 'Das Gegenereignis enthält genau die Werte von $X$, die nicht zum Ereignis gehören. Seine Wahrscheinlichkeit ist $1-P(\\text{Ereignis})$.',
      loesung: [
        `„${e.text}“ sind die Werte ${e.a} bis ${e.b}. Gegenereignis: „${gegen}“.`,
        `$${gTex}=1-${pTexAB(e.a, e.b, n)}\\approx 1-${dzTex(wE)}=${dzTex(wG)}$`,
        `Mit der CAS-App z. B. ${code(`1-${cdfCode(n, pB, e.a, e.b)}`)}.`,
      ],
    };
  };

  // ---------- Sachaufgaben, kumuliert ----------
  const PLATZ = [
    {
      satz: (n, pB) => `Von den ${n} Beschäftigten einer Firma kommen an einem Arbeitstag durchschnittlich ${pProzent(pB)} mit dem Auto.`,
      X: 'die Anzahl der Beschäftigten, die mit dem Auto kommen', ding: 'Parkplätze', reicht: (c) => `ein Parkplatz mit ${c} Plätzen ausreicht`,
      frageMin: (q) => `Wie viele Parkplätze müssen mindestens vorhanden sein, damit sie mit einer Wahrscheinlichkeit von mindestens ${q} % ausreichen?`,
      annahme: 'Die Beschäftigten entscheiden unabhängig voneinander, ob sie mit dem Auto kommen.',
      n: [80, 100, 120, 150], p: ['0,3', '0,35', '0,45'].map(Bruch.dez),
    },
    {
      satz: (n, pB) => `An einer Schule mit ${n} Schülerinnen und Schülern isst jede bzw. jeder an einem Tag mit einer Wahrscheinlichkeit von ${pProzent(pB)} in der Mensa.`,
      X: 'die Anzahl der Mensa-Essen an einem Tag', ding: 'Essen', reicht: (c) => `${c} vorbereitete Essen ausreichen`,
      frageMin: (q) => `Wie viele Essen müssen mindestens vorbereitet werden, damit sie mit einer Wahrscheinlichkeit von mindestens ${q} % ausreichen?`,
      annahme: 'Alle entscheiden unabhängig voneinander und mit derselben Wahrscheinlichkeit, ob sie in der Mensa essen.',
      n: [200, 300, 400], p: ['0,2', '0,25', '0,3'].map(Bruch.dez),
    },
    {
      satz: (n, pB) => `Ein Fitnessstudio hat ${n} Mitglieder. Zur Hauptzeit am Abend ist jedes Mitglied mit einer Wahrscheinlichkeit von ${pProzent(pB)} im Studio.`,
      X: 'die Anzahl der Mitglieder im Studio', ding: 'Spinde', reicht: (c) => `${c} Spinde ausreichen`,
      frageMin: (q) => `Wie viele Spinde müssen mindestens vorhanden sein, damit sie mit einer Wahrscheinlichkeit von mindestens ${q} % ausreichen?`,
      annahme: 'Die Mitglieder entscheiden unabhängig voneinander, ob sie zur Hauptzeit kommen.',
      n: [250, 400, 500], p: ['0,1', '0,12', '0,15'].map(Bruch.dez),
    },
  ];
  gen['bv-kum-kontext'] = (stufe) => {
    if (stufe === 3) {
      const P = R.wahl(PLATZ);
      const n = R.wahl(P.n), pB = R.wahl(P.p), p = pB.zahl();
      const q = R.wahl([90, 95, 99]);
      let c = 0;
      while (cdf(n, p, 0, c) < q / 100) c++;
      const c0 = Math.round(n * p) + R.wahl([-2, 1, 3]);
      const w0 = cdf(n, p, 0, c0);
      return {
        frage: `${P.satz(n, pB)} Die Zufallsgröße $X$ gibt ${P.X} an.<br>a) Berechne die Wahrscheinlichkeit, dass ${P.reicht(c0)}. ${RUNDEN}<br>b) ${P.frageMin(q)}<br>c) Welche Annahme braucht man, damit man mit der Binomialverteilung rechnen darf?`,
        felder: [
          wFeld('a) Wahrscheinlichkeit', w0),
          { art: 'zahl', label: `b) Anzahl der ${P.ding}`, antwort: new Bruch(c) },
          auswahl('c) Annahme', P.annahme, ['Die Anzahl steht vorher fest.', 'Die Hälfte aller Fälle sind Treffer.', `Es werden genau ${Math.round(n * p)} gezählt.`]),
        ],
        notiz: true,
        hinweis: `a) „reicht aus“ heißt $X\\le ${c0}$. b) Probiere verschiedene Anzahlen $c$ mit ${code(`binomCdf(${n},${casP(pB)},0,c)`)} aus – gesucht ist das kleinste $c$ mit $P(X\\le c)\\ge ${dzTex(q / 100, 2)}$.`,
        loesung: [
          `$n=${n}$, $p=${pTex(pB)}$. a) $P(X\\le ${c0})\\approx ${dzTex(w0)}$`,
          `b) $P(X\\le ${c - 1})\\approx ${dzTex(cdf(n, p, 0, c - 1))}<${dzTex(q / 100, 2)}$, aber $P(X\\le ${c})\\approx ${dzTex(cdf(n, p, 0, c))}\\ge ${dzTex(q / 100, 2)}$. Es müssen mindestens ${c} ${P.ding} vorhanden sein.`,
          `c) ${P.annahme} Außerdem: für jede Person dieselbe Wahrscheinlichkeit.`,
        ],
      };
    }
    const c = kumKontext();
    const { K, n, pB, p } = c;
    const arten = stufe === 1 ? R.mische(['hoechstens', 'mindestens']) : R.mische(['mehrAls', 'wenigerAls', 'zwischenOffen', 'genau']).slice(0, 3);
    const ev = [];
    for (const art of arten) {
      const e = ereignis(art, n, p, K.anz);
      if (e && !ev.some((x) => x.text === e.text)) ev.push(e);
    }
    if (ev.length < 2) return gen['bv-kum-kontext'](stufe);
    const B = 'abcd';
    return {
      frage: `${kumEinleitung(c)} Berechne die Wahrscheinlichkeiten der folgenden Ereignisse mit der CAS-App. ${RUNDEN}`,
      felder: ev.map((e, i) => wFeld(`${B[i]}) „${e.text}“`, e.w)),
      notiz: true,
      hinweis: `Übersetze jedes Ereignis zuerst in Grenzen: ${GRENZEN_TIPP} Für „genau“ reicht ${code('binomPdf')}.`,
      loesung: [`$n=${n}$, $p=${pTex(pB)}$.`, ...ev.map((e, i) => `${B[i]}) $${pTexAB(e.a, e.b, n)}$: ${code(e.a === e.b ? `binomPdf(${n},${casP(pB)},${e.a})` : cdfCode(n, pB, e.a, e.b))} $\\approx ${dzTex(e.w)}$`)],
    };
  };


  // =====================================================================
  // Erwartungswert und Standardabweichung (AB 40/41)
  // μ = n·p, σ = √(n·p·(1−p)); keine σ-Regeln (GK), nur „Werte, die höchstens σ von μ abweichen“
  // =====================================================================
  const MS = [
    ...KUM,
    {
      id: 'wuerfel', p: [new Bruch(1, 6)], n: [60, 90, 120, 150],
      satz: (n) => `Ein fairer Würfel wird ${n}-mal geworfen.`,
      X: 'die Anzahl der Sechsen',
      anz: (k) => pl(k, 'Sechs', 'Sechsen'), ohne: (k) => `${k} Würfe ohne Sechs`,
    },
  ];
  function msKontext(filter) {
    for (;;) {
      const K = R.wahl(MS);
      const pB = R.wahl(K.p);
      const n = R.wahl(K.n);
      const c = { K, n, pB, p: pB.zahl() };
      if (!filter || filter(c)) return c;
    }
  }
  const muB = (n, pB) => new Bruch(n).mal(pB);
  const sigma = (n, p) => Math.sqrt(n * p * (1 - p));
  /** μ als TeX: exakt, wenn endliche Dezimalzahl, sonst gerundet */
  const muTex = (n, pB) => (muB(n, pB).istEndlichDezimal() ? `=${muB(n, pB).tex('dezimal')}` : `\\approx ${dzTex(muB(n, pB).zahl(), 2)}`);
  const muRechnung = (n, pB) => `\\mu=n\\cdot p=${n}\\cdot ${pTex(pB)}${muTex(n, pB)}`;
  const sigmaRechnung = (n, pB) => `\\sigma=\\sqrt{n\\cdot p\\cdot(1-p)}=\\sqrt{${n}\\cdot ${pTex(pB)}\\cdot ${pTex(EINS.minus(pB))}}\\approx ${dzTex(sigma(n, pB.zahl()), 2)}`;
  /** Feld für μ: exakt (zahl) oder gerundet */
  const muFeld = (label, n, pB) => (muB(n, pB).istEndlichDezimal()
    ? { art: 'zahl', label, antwort: muB(n, pB) }
    : { art: 'naeherung', label, wert: muB(n, pB).zahl(), stellen: 2 });
  const sigmaFeld = (label, n, p) => ({ art: 'naeherung', label, wert: sigma(n, p), stellen: 2 });
  const STELLEN2 = 'Runde $\\sigma$ auf zwei Nachkommastellen.';
  const MS_TIPP = 'Bestimme zuerst $n$ und $p$. Die Formeln für $\\mu$ und $\\sigma$ stehen in deinen Unterlagen (AB 40).';
  /** Werte, die höchstens σ von μ abweichen: Grenzen nach innen gerundet */
  function sigmaGrenzen(n, p) {
    const mu = n * p, s = sigma(n, p);
    return { mu, s, a: Math.max(0, Math.ceil(mu - s - 1e-9)), b: Math.min(n, Math.floor(mu + s + 1e-9)) };
  }

  // ---------- μ und σ berechnen, deuten, rückwärts ----------
  const MU_DEUTUNG = (c, mu) => ({
    richtig: `Bei sehr vielen Wiederholungen (jeweils ${c.n} Versuche) beträgt ${c.K.X} im Mittel ${mu}.`,
    falsch: [
      `Bei jeder Wiederholung beträgt ${c.K.X} genau ${mu}.`,
      `${c.K.X[0].toUpperCase()}${c.K.X.slice(1)} beträgt mit einer Wahrscheinlichkeit von 50 % genau ${mu}.`,
      `${c.K.X[0].toUpperCase()}${c.K.X.slice(1)} kann nicht größer als ${mu} werden.`,
    ],
  });
  const SIGMA_DEUTUNG = (c) => ({
    richtig: `$\\sigma$ ist ein Maß dafür, wie stark ${c.K.X} typischerweise vom Erwartungswert abweicht.`,
    falsch: [
      `$\\sigma$ ist die Wahrscheinlichkeit dafür, dass ${c.K.X} vom Erwartungswert abweicht.`,
      `${c.K.X[0].toUpperCase()}${c.K.X.slice(1)} weicht immer um genau $\\sigma$ vom Erwartungswert ab.`,
      `${c.K.X[0].toUpperCase()}${c.K.X.slice(1)} liegt immer zwischen $\\mu-\\sigma$ und $\\mu+\\sigma$.`,
    ],
  });
  /** (n, p) mit „schönem“ μ und σ für Rückwärtsaufgaben */
  const RUECKWAERTS = (() => {
    const liste = [];
    for (const pt of ['0,1', '0,2', '0,25', '0,3', '0,4', '0,5', '0,6', '0,7', '0,75', '0,8', '0,9']) {
      const pB = Bruch.dez(pt);
      for (let n = 10; n <= 300; n++) {
        const mu = muB(n, pB), v = mu.mal(EINS.minus(pB));
        const s = Math.sqrt(v.zahl());
        if (!mu.mal(2).istGanz()) continue;
        if (Math.abs(Math.round(s * 10) - s * 10) > 1e-9 || s < 1.5) continue;
        liste.push({ n, pB, mu, s: Math.round(s * 10) / 10 });
      }
    }
    return liste;
  })();
  gen['bv-kenngroessen'] = (stufe) => {
    if (stufe === 1) {
      const c = msKontext();
      const { n, pB, p } = c;
      return {
        frage: `${kumEinleitung(c)} Berechne den Erwartungswert $\\mu$ und die Standardabweichung $\\sigma$ von $X$. ${STELLEN2}`,
        felder: [muFeld('$\\mu$', n, pB), sigmaFeld('$\\sigma$', n, p)],
        notiz: true,
        hinweis: MS_TIPP,
        loesung: [`$n=${n}$, $p=${pTex(pB)}$.`, `$${muRechnung(n, pB)}$`, `$${sigmaRechnung(n, pB)}$`],
      };
    }
    if (stufe === 2) {
      const c = msKontext((x) => muB(x.n, x.pB).istGanz());
      const { n, pB, p } = c;
      const mu = muB(n, pB).zahl();
      const wMu = pdf(n, p, mu);
      const dm = MU_DEUTUNG(c, mu), ds = SIGMA_DEUTUNG(c);
      return {
        frage: `${kumEinleitung(c)} Der Erwartungswert ist $\\mu=${mu}$.<br>a) Welche Aussage über den Erwartungswert ist richtig?<br>b) Berechne $P(X=${mu})$. ${RUNDEN}<br>c) Welche Aussage über die Standardabweichung $\\sigma$ ist richtig?`,
        felder: [auswahl('a) Erwartungswert', dm.richtig, dm.falsch), wFeld(`b) $P(X=${mu})$`, wMu), auswahl('c) Standardabweichung', ds.richtig, ds.falsch)],
        notiz: true,
        hinweis: 'Überlege, was „erwarten“ bei einem Zufallsexperiment bedeutet – und schau dir in b) an, wie wahrscheinlich der Erwartungswert selbst ist.',
        loesung: [
          `a) ${dm.richtig} Bei einer einzelnen Wiederholung kann ${c.K.X} auch kleiner oder größer sein.`,
          `b) ${code(`binomPdf(${n},${casP(pB)},${mu})`)}: $P(X=${mu})\\approx ${dzTex(wMu)}$. Nur in etwa ${prozentText(wMu, 0)} der Fälle tritt genau der Erwartungswert ein.`,
          `c) ${ds.richtig} Die Ergebnisse streuen um $\\mu$, manche weichen weniger, manche mehr als $\\sigma\\approx ${dzTex(sigma(n, p), 2)}$ ab.`,
        ],
      };
    }
    // Stufe 3: aus μ und σ auf n und p schließen
    const r = R.wahl(RUECKWAERTS);
    const muT = r.mu.tex('dezimal'), sT = dzTex(r.s, r.s % 1 ? 1 : 0), v = r.mu.mal(EINS.minus(r.pB));
    return {
      frage: `Eine binomialverteilte Zufallsgröße $X$ hat den Erwartungswert $\\mu=${muT}$ und die Standardabweichung $\\sigma=${sT}$. Bestimme $n$ und $p$.`,
      felder: [{ art: 'zahl', label: '$n$', antwort: new Bruch(r.n) }, { art: 'zahl', label: '$p$', antwort: r.pB }],
      notiz: true,
      hinweis: 'Schreibe beide Formeln mit den gegebenen Zahlen auf. Quadriere die Gleichung für $\\sigma$ und setze $n\\cdot p$ aus der ersten Gleichung ein.',
      loesung: [
        `$n\\cdot p=${muT}$ und $n\\cdot p\\cdot(1-p)=${sT}^2=${v.tex('dezimal')}$.`,
        `Einsetzen: $${muT}\\cdot(1-p)=${v.tex('dezimal')}$, also $1-p=${EINS.minus(r.pB).tex('dezimal')}$ und $p=${r.pB.tex('dezimal')}$.`,
        `$n=${muT}:${r.pB.tex('dezimal')}=${r.n}$.`,
        `Probe: $${r.n}\\cdot ${r.pB.tex('dezimal')}=${muT}$ und $\\sqrt{${r.n}\\cdot ${r.pB.tex('dezimal')}\\cdot ${EINS.minus(r.pB).tex('dezimal')}}=${sT}$. Mit dem CAS: ${code(`solve(n*p=${String(r.mu.zahl())} and n*p*(1-p)=${String(v.zahl())},{n,p})`)}.`,
      ],
    };
  };

  // ---------- Werte, die höchstens σ von μ abweichen ----------
  gen['bv-sigma-umgebung'] = (stufe) => {
    if (stufe < 3) {
      const c = msKontext();
      const { n, pB, p } = c;
      const { mu, s, a, b } = sigmaGrenzen(n, p);
      if (b - a < 2) return gen['bv-sigma-umgebung'](stufe);
      const w = cdf(n, p, a, b);
      const felder = [{ art: 'zahl', label: 'kleinster Wert', antwort: new Bruch(a) }, { art: 'zahl', label: 'größter Wert', antwort: new Bruch(b) }];
      const ein = cdfCode(n, pB, a, b);
      if (stufe === 2) {
        felder.push({ art: 'cas', label: 'Eingabe', soll: { art: 'binomcdf', n, p, a, b }, loesung: ein, ausgabe: casZahl(w), platzhalter: 'binomCdf(…)' });
        felder.push({ ...wFeld('Wahrscheinlichkeit', w) });
      }
      return {
        frage: `${kumEinleitung(c)} Gib den kleinsten und den größten Wert von $X$ an, der höchstens um $\\sigma$ vom Erwartungswert abweicht.${stufe === 2 ? ` Berechne dann mit der CAS-App die Wahrscheinlichkeit, dass $X$ einen dieser Werte annimmt. ${RUNDEN}` : ''}`,
        felder,
        notiz: true,
        hinweis: `Berechne $\\mu$ und $\\sigma$, dann $\\mu-\\sigma$ und $\\mu+\\sigma$. $X$ nimmt nur ganze Zahlen an: Runde „nach innen“, also die untere Grenze auf und die obere ab.${stufe === 2 ? ` Dann ${code('binomCdf(n,p,untere Grenze,obere Grenze)')}.` : ''}`,
        loesung: [
          `$n=${n}$, $p=${pTex(pB)}$: $${muRechnung(n, pB)}$, $${sigmaRechnung(n, pB)}$.`,
          `$\\mu-\\sigma\\approx ${dzTex(mu - s, 2)}$ und $\\mu+\\sigma\\approx ${dzTex(mu + s, 2)}$. Nach innen gerundet: die Werte von ${a} bis ${b}.`,
          ...(stufe === 2 ? [`$P(${a}\\le X\\le ${b})$: ${code(ein)} $\\approx ${dzTex(w)}$. Das passt zur Faustregel: etwa zwei Drittel der Ergebnisse weichen höchstens um $\\sigma$ vom Erwartungswert ab.`] : []),
        ],
      };
    }
    // Stufe 3: Wie weit ist ein Ergebnis vom Erwartungswert entfernt?
    const c = msKontext();
    const { K, n, pB, p } = c;
    const mu = n * p, s = sigma(n, p);
    const oben = Math.random() < 0.6;
    const d = R.wahl([2, 2.5, 3]);
    const x = oben ? Math.ceil(mu + d * s) : Math.floor(mu - d * s);
    if (x < 0 || x > n) return gen['bv-sigma-umgebung'](stufe);
    const [a, b] = oben ? [x, n] : [0, x];
    const w = cdf(n, p, a, b);
    if (w < 0.0005) return gen['bv-sigma-umgebung'](stufe);
    const abstand = Math.abs(x - mu) / s;
    // mit gerundetem σ gerechnet muss dasselbe herauskommen
    if (komma(Math.abs(x - mu) / Number(s.toFixed(2)), 1) !== komma(abstand, 1)) return gen['bv-sigma-umgebung'](stufe);
    const ereig = `${oben ? 'mindestens' : 'höchstens'} ${K.anz(x)}`;
    const AUSSAGEN = [
      `Ein Ergebnis wie „${ereig}“ kommt nur sehr selten vor, weil es weit vom Erwartungswert entfernt ist.`,
      `„${ereig}“ kommt etwa in jedem dritten Fall vor.`,
      `„${ereig}“ ist unmöglich, weil es mehr als $\\sigma$ vom Erwartungswert abweicht.`,
      `„${ereig}“ ist wahrscheinlicher als genau $${Math.round(mu)}$, weil es mehr Werte umfasst.`,
    ];
    return {
      frage: `${kumEinleitung(c)} Betrachtet wird das Ergebnis „${ereig}“.<br>a) Wie viele Standardabweichungen liegt ${x} vom Erwartungswert entfernt? Runde auf eine Nachkommastelle.<br>b) Berechne $P(X${oben ? '\\ge' : '\\le'} ${x})$. ${RUNDEN}<br>c) Welche Aussage passt?`,
      felder: [
        { art: 'naeherung', label: 'a) Anzahl der Standardabweichungen', wert: abstand, stellen: 1 },
        wFeld(`b) $P(X${oben ? '\\ge' : '\\le'} ${x})$`, w),
        auswahl('c) Aussage', AUSSAGEN[0], AUSSAGEN.slice(1)),
      ],
      notiz: true,
      hinweis: 'Berechne $\\mu$ und $\\sigma$. Der Abstand von ' + x + ' zu $\\mu$ geteilt durch $\\sigma$ gibt an, wie viele Standardabweichungen das sind.',
      loesung: [
        `$${muRechnung(n, pB)}$, $${sigmaRechnung(n, pB)}$.`,
        `a) $|${x}-${dzTex(mu, Math.abs(mu - Math.round(mu)) < 1e-9 ? 0 : 2)}|:${dzTex(s, 2)}\\approx ${dzTex(abstand, 1)}$ – ${x} liegt also etwa ${komma(abstand, 1)} Standardabweichungen vom Erwartungswert entfernt.`,
        `b) ${code(cdfCode(n, pB, a, b))} $\\approx ${dzTex(w)}$`,
        `c) ${AUSSAGEN[0]} Schon innerhalb von einer Standardabweichung um $\\mu$ liegen etwa zwei Drittel der Ergebnisse.`,
      ],
    };
  };

  // ---------- μ und σ im Histogramm, Einfluss von n und p ----------
  /** drei Verteilungen mit gleichem μ und deutlich verschiedenem σ */
  function gleichesMu() {
    for (;;) {
      const mu = R.wahl([8, 10, 12, 15, 16, 18, 20, 24]);
      const kand = [];
      for (const pt of ['0,2', '0,25', '0,3', '0,4', '0,5', '0,6', '0,75', '0,8']) {
        const pB = Bruch.dez(pt);
        const nB = new Bruch(mu).durch(pB);
        if (nB.istGanz() && nB.z <= 80) kand.push({ n: nB.z, pB, s: sigma(nB.z, pB.zahl()) });
      }
      const wahl = R.mische(kand).slice(0, 3).sort((u, v) => u.s - v.s);
      if (wahl.length === 3 && wahl[1].s - wahl[0].s >= 0.45 && wahl[2].s - wahl[1].s >= 0.45) return { mu, wahl };
    }
  }
  gen['bv-kenngroessen-hist'] = (stufe) => {
    if (stufe === 1) {
      const { mu, wahl } = gleichesMu();
      const alle = wahl.map((d) => Array.from({ length: d.n + 1 }, (_, k) => pdf(d.n, d.pB.zahl(), k)));
      const sMax = wahl[2].s;
      const von = Math.max(0, Math.floor(mu - 4 * sMax)), kMax = Math.ceil(mu + 4 * sMax);
      const yMax = schritt(Math.max(...alle.flat()), 4) * Math.ceil(Math.max(...alle.flat()) / schritt(Math.max(...alle.flat()), 4) - 1e-9);
      const ziel = R.int(0, 2);
      const t = wahl[ziel];
      const reihenfolge = R.mische([0, 1, 2]);
      const breite = ['am schmalsten', 'mittelbreit', 'am breitesten'][ziel];
      return {
        frage: `Die drei Histogramme gehören zu diesen Binomialverteilungen: ${wahl.map((d) => `$n=${d.n}$ und $p=${pTex(d.pB)}$`).join('; ')}. Alle Histogramme haben dieselben Achsen. Welches gehört zu ${npText(t.n, t.pB)}?`,
        felder: [{ art: 'auswahl', label: 'Histogramm', optionen: reihenfolge.map((i) => histSvg(alle[i], { von, kMax, yMax, klein: true })), richtig: reihenfolge.indexOf(ziel) }],
        notiz: true,
        hinweis: 'Berechne für alle drei Verteilungen $\\mu$ und $\\sigma$. Was haben die Histogramme gemeinsam, worin unterscheiden sie sich?',
        loesung: [
          `Alle drei haben $\\mu=${mu}$, der Gipfel liegt also bei allen bei $k\\approx ${mu}$.`,
          `$\\sigma$: ${wahl.map((d) => `$\\sqrt{${d.n}\\cdot ${pTex(d.pB)}\\cdot ${pTex(EINS.minus(d.pB))}}\\approx ${dzTex(d.s, 2)}$`).join(', ')}.`,
          `Zu ${npText(t.n, t.pB)} gehört $\\sigma\\approx ${dzTex(t.s, 2)}$, das Histogramm ist also ${breite}.`,
          { svg: histSvg(alle[ziel], { von, kMax, yMax }) },
        ],
      };
    }
    if (stufe === 2) {
      // Wie verändern sich μ und σ?
      const n = R.wahl([20, 25, 30, 40, 50]);
      const art = R.int(0, 3);
      let pB = R.wahl(['0,2', '0,3', '0,4', '0,6', '0,7', '0,8'].map(Bruch.dez)), n2 = n, p2B = pB, text;
      if (art === 0) { n2 = 2 * n; text = `Die Anzahl der Versuche wird auf $n=${n2}$ verdoppelt, $p$ bleibt gleich.`; }
      else if (art === 1) { n2 = 4 * n; text = `Die Anzahl der Versuche wird auf $n=${n2}$ vervierfacht, $p$ bleibt gleich.`; }
      else if (art === 2) { p2B = EINS.minus(pB); text = `Treffer und Niete werden vertauscht: $p=${pTex(p2B)}$ statt $${pTex(pB)}$, $n$ bleibt gleich.`; }
      else {
        pB = R.wahl(['0,4', '0,6'].map(Bruch.dez));
        p2B = Bruch.dez(pB.zahl() < 0.5 ? '0,2' : '0,8');
        text = `Die Trefferwahrscheinlichkeit ändert sich von $p=${pTex(pB)}$ auf $p=${pTex(p2B)}$, $n$ bleibt gleich.`;
      }
      const OPT = ['$\\sigma$ verdoppelt sich.', '$\\sigma$ wird um den Faktor $\\sqrt{2}\\approx 1{,}41$ größer.', '$\\sigma$ bleibt gleich.', '$\\sigma$ wird kleiner.'];
      const richtig = [1, 0, 2, 3][art];
      const s1 = sigma(n, pB.zahl()), s2 = sigma(n2, p2B.zahl());
      const ERKL = [
        `Unter der Wurzel steht $n$: Doppelt so viele Versuche ergeben nur das $\\sqrt{2}$-Fache von $\\sigma$.`,
        `Unter der Wurzel steht $n$: Viermal so viele Versuche ergeben das $\\sqrt{4}=2$-Fache von $\\sigma$.`,
        `$p\\cdot(1-p)$ ändert sich beim Vertauschen nicht. Das Histogramm wird gespiegelt, bleibt aber gleich breit.`,
        `$p$ liegt weiter von $0{,}5$ entfernt: $p\\cdot(1-p)$ wird kleiner, das Histogramm schmaler.`,
      ];
      return {
        frage: `Eine Zufallsgröße $X$ ist binomialverteilt mit ${npText(n, pB)}. ${text} Berechne $\\mu$ und $\\sigma$ vorher und nachher und gib an, wie sich $\\sigma$ verändert. ${STELLEN2}`,
        felder: [
          muFeld('$\\mu$ vorher', n, pB), sigmaFeld('$\\sigma$ vorher', n, pB.zahl()),
          muFeld('$\\mu$ nachher', n2, p2B), sigmaFeld('$\\sigma$ nachher', n2, p2B.zahl()),
          auswahl('Veränderung', OPT[richtig], OPT.filter((_, i) => i !== richtig)),
        ],
        notiz: true,
        hinweis: 'Rechne beide Fälle aus und vergleiche. Achte darauf, was unter der Wurzel steht.',
        loesung: [
          `Vorher: $${muRechnung(n, pB)}$, $${sigmaRechnung(n, pB)}$.`,
          `Nachher: $${muRechnung(n2, p2B)}$, $${sigmaRechnung(n2, p2B)}$.`,
          `${OPT[richtig]} ${ERKL[art]}${art < 2 ? ` Kontrolle: $${dzTex(s2, 2)}:${dzTex(s1, 2)}\\approx ${dzTex(s2 / s1, 2)}$.` : ''}`,
        ],
      };
    }
    // Stufe 3: absolute und relative Streuung
    const pB = R.wahl(['0,2', '0,25', '0,3', '0,4'].map(Bruch.dez));
    const n1 = R.wahl([25, 50, 100]), f = R.wahl([2, 4]), n2 = f * n1, p = pB.zahl();
    const s1 = sigma(n1, p), s2 = sigma(n2, p);
    for (const [sx, nx] of [[s1, n1], [s2, n2]]) if (komma((Number(sx.toFixed(2)) / nx) * 100, 1) !== komma((sx / nx) * 100, 1)) return gen['bv-kenngroessen-hist'](stufe);
    const AUSSAGEN = [
      `Die Aussage ist falsch: $\\sigma$ wächst nur mit $\\sqrt{n}$. Im Verhältnis zur Anzahl der Personen wird die Streuung bei der größeren Umfrage kleiner.`,
      'Die Aussage stimmt: Ein größeres $\\sigma$ bedeutet, dass der Anteil stärker vom Zufall abhängt.',
      `Die Aussage stimmt: $\\sigma$ wächst im selben Verhältnis wie $n$.`,
      'Die Aussage ist falsch: $\\sigma$ ist bei beiden Umfragen gleich groß.',
    ];
    return {
      frage: `Ein Anteil von ${pProzent(pB)} der Bevölkerung nutzt ein bestimmtes Angebot. In Umfrage A werden ${n1} Personen zufällig ausgewählt, in Umfrage B ${n2} Personen. $X$ ist jeweils die Anzahl der Befragten, die das Angebot nutzen.<br>Jemand behauptet: „Bei Umfrage B ist die Standardabweichung größer. Der Anteil der Nutzer in der Stichprobe hängt dort also stärker vom Zufall ab.“<br>Berechne $\\sigma$ für beide Umfragen und den Anteil $\\frac{\\sigma}{n}$ in Prozent. Beurteile dann die Aussage.`,
      felder: [
        sigmaFeld('$\\sigma$ bei A', n1, p), sigmaFeld('$\\sigma$ bei B', n2, p),
        { art: 'naeherung', label: '$\\frac{\\sigma}{n}$ bei A in %', wert: (s1 / n1) * 100, stellen: 1 },
        { art: 'naeherung', label: '$\\frac{\\sigma}{n}$ bei B in %', wert: (s2 / n2) * 100, stellen: 1 },
        auswahl('Beurteilung', AUSSAGEN[0], AUSSAGEN.slice(1)),
      ],
      notiz: true,
      hinweis: 'Vergleiche nicht nur $\\sigma$ selbst, sondern $\\sigma$ im Verhältnis zur Anzahl der Befragten. Runde die Anteile auf eine Nachkommastelle.',
      loesung: [
        `A: $${sigmaRechnung(n1, pB)}$, das sind $${dzTex(s1, 2)}:${n1}\\approx ${dzTex((s1 / n1) * 100, 1)}\\,\\%$ von $n$.`,
        `B: $${sigmaRechnung(n2, pB)}$, das sind $${dzTex(s2, 2)}:${n2}\\approx ${dzTex((s2 / n2) * 100, 1)}\\,\\%$ von $n$.`,
        `${AUSSAGEN[0]} Bei ${f}-mal so vielen Personen ist $\\sigma$ nur ${f === 4 ? 'doppelt' : 'etwa 1,41-mal'} so groß.`,
      ],
    };
  };

  UM.binomial = { bk, pdf, pdfExakt, cdf, KONTEXTE, KUM, histSvg, sigma, sigmaGrenzen };
})(typeof window !== 'undefined' ? window : globalThis);
