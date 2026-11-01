/*
 * Thema: Rationale Zahlen (Klasse 7) – Vorbereitung auf die Klassenarbeit Nr. 1
 * Die Kompetenzen folgen der Checkliste, die die Klasse erhält.
 * gen = Name eines Generators aus assets/js/generatoren/rationale-zahlen.js
 */
(function (global) {
  'use strict';
  const RM = 'https://realmath.de/Neues/';
  const link = (titel, pfad) => ({ titel: 'Realmath: ' + titel, url: RM + pfad });

  global.UM.thema = {
    id: 'mathematik-7-rationale-zahlen',
    fach: 'Mathematik',
    stufe: 'Klasse 7',
    titel: 'Rechnen mit rationalen Zahlen',
    untertitel: 'Vorbereitung auf die Klassenarbeit Nr. 1',
    test: { anzahlProKompetenz: 1, stufen: [2, 2, 3] },
    kompetenzen: [
      {
        id: 'zahlenmengen',
        text: 'Ich kenne die Symbole und die Namen der Zahlenmengen und …',
        unterpunkte: ['ich kann entscheiden, zu welchen Zahlenmengen eine Zahl gehört.'],
        buch: 'S. 8 bis 15',
        uebungen: [
          { gen: 'rz-mengen', titel: 'Zahlen den Zahlenmengen ℕ, ℤ und ℚ zuordnen' },
          { gen: 'rz-kontext', titel: 'Welcher Zahlenbereich passt zur Situation?' },
        ],
      },
      {
        id: 'zahlenstrahl',
        text: 'Ich kann rationale Zahlen am Zahlenstrahl einzeichnen.',
        buch: 'S. 8 bis 15',
        uebungen: [
          { gen: 'rz-strahl-setzen', titel: 'Zahlen am Zahlenstrahl einzeichnen' },
          { gen: 'rz-strahl-ablesen', titel: 'Zahlen am Zahlenstrahl ablesen' },
          { gen: 'rz-mitte', titel: 'Die Zahl in der Mitte finden' },
          { gen: 'rz-vergleich', titel: 'Zahlen vergleichen: <, > oder =' },
        ],
        links: [
          link('Zahlen ablesen (Profi)', 'Klasse7/rationalezahlen/ratzahllesen.php'),
          link('Zahlen ablesen (TopProfi)', 'Klasse7/rationalezahlen/rationalezahlen22.php'),
          link('Zahlen ablesen (TopProfi 2)', 'Klasse7/rationalezahlen/rationalezahlen20.php'),
          link('Zahlen anordnen (Profi)', 'Klasse7/rationalezahlen/rationalezahlen-neu.php'),
          link('Zahlen anordnen (TopProfi)', 'Klasse7/rationalezahlen/rationalezahlen11.php'),
        ],
      },
      {
        id: 'gegenzahl-betrag',
        text: 'Ich weiß, wie man die Gegenzahl zu einer Zahl findet und wie man den Betrag einer Zahl bestimmt.',
        buch: 'S. 8 bis 15',
        uebungen: [{ gen: 'rz-gegenzahl-betrag', titel: 'Gegenzahl und Betrag' }],
        links: [link('Gegenzahl', 'Klasse6/gegenzahl/gegenzahl.php'), link('Betrag', 'Klasse6/gegenzahl/absoluterbetrag.php')],
      },
      {
        id: 'ganze-zahlen',
        text: 'Ich kann ganze Zahlen addieren und subtrahieren und die Rechnungen mit Guthaben und Schulden erklären.',
        buch: 'S. 16 bis 25',
        uebungen: [
          { gen: 'rz-nebenrechnung', titel: 'Vorzeichen, Nebenrechnung, Ergebnis' },
          { gen: 'rz-sachaufgabe', titel: 'Temperaturen, Kontostände und Höhen' },
        ],
        links: [
          link('Tabelle (Level 1)', 'Klasse6/negativezahlen/ganzaddtab.php'),
          link('Tabelle (Profi 1)', 'Klasse6/negativezahlen/addivartab.php'),
          link('Tabelle (Profi 2)', 'Klasse6/negativezahlen/addivartab2.php'),
          link('Subtraktionstabelle (Level 1)', 'Klasse6/negativezahlen/ganzsubtab.php'),
          link('Tabellenwerte (Level 1)', 'Klasse6/ganzzahl/tabelleneu01.php'),
          link('Tabellenwerte (Profi)', 'Klasse6/ganzzahl/tabelleneu.php'),
          link('Vereinfachte Schreibweise mit drei Zahlen', 'Klasse6/addundsubganz/schreibweise.php'),
          link('Vereinfachte Schreibweise mit vier Zahlen', 'Klasse6/addundsubganz/schreibweise2.php'),
          link('Aufgaben mit einer Klammer', 'Klasse6/ganzzahl/berechneinz.php'),
          link('Aufgaben mit zwei Klammern', 'Klasse6/ganzzahl/berechneinz2.php'),
        ],
      },
      {
        id: 'addieren-subtrahieren',
        text: 'Ich kann Additionen und Subtraktionen von rationalen Zahlen ohne Klammern schreiben und …',
        unterpunkte: ['ich kann rationale Zahlen addieren und subtrahieren, indem ich eine Nebenrechnung nutze.'],
        buch: 'S. 16 bis 25',
        uebungen: [
          { gen: 'rz-klammerfrei', titel: 'Ohne Klammern schreiben und berechnen' },
          { gen: 'rz-fehler', titel: 'Finde den Fehler!' },
        ],
      },
      {
        id: 'multiplizieren-dividieren',
        text: 'Ich kann bei Multiplikation und Division von rationalen Zahlen entscheiden, welches Vorzeichen das Ergebnis hat und …',
        unterpunkte: ['ich kann rationale Zahlen (also auch Dezimalzahlen und Brüche) multiplizieren und dividieren.'],
        buch: 'S. 26 bis 30',
        uebungen: [
          { gen: 'rz-vorzeichen', titel: 'Welches Vorzeichen hat das Ergebnis?' },
          { gen: 'rz-multdiv', titel: 'Multiplizieren und dividieren' },
          { gen: 'rz-kontomodell', titel: 'Kontomodell: Geld einzahlen und abheben' },
        ],
        links: [
          link('Zwei Zahlen multiplizieren', 'Klasse7/multganz/multganz.php'),
          link('Zahlenmauer (Level 3)', 'Klasse7/ganzzahl/zahlenmauermult3.php'),
          link('Zahlenmauer (Level 4)', 'Klasse7/ganzzahl/zahlenmauermult4.php'),
          link('Zahlenmauer (Profi)', 'Klasse7/ganzzahl/zahlenmauermult5.php'),
          link('Zwei Zahlen dividieren 1', 'Klasse7/divganz/divganzahl.php'),
          link('Zwei Zahlen dividieren 2', 'Klasse7/divganz/divganz.php'),
        ],
      },
      {
        id: 'rechengesetze',
        text: 'Ich kenne die Minusklammerregel, Assoziativ-, Kommutativ- und Distributivgesetz und …',
        unterpunkte: [
          'ich kann diese Regeln nutzen, um Rechenvorteile beim Berechnen von Termen zu haben.',
          'Insbesondere kann ich das Distributivgesetz benutzen, um auszuklammern oder auszumultiplizieren.',
        ],
        buch: 'S. 31 bis 41',
        uebungen: [
          { gen: 'rz-minusklammer', titel: 'Minusklammerregel' },
          { gen: 'rz-geschickt', titel: 'Geschickt rechnen mit Kommutativ- und Assoziativgesetz' },
          { gen: 'rz-distributiv', titel: 'Distributivgesetz: ausmultiplizieren, ausklammern, zerlegen' },
        ],
      },
      {
        id: 'gemischt',
        text: 'Ich kann auch Terme mit Brüchen und Dezimalzahlen gemischt berechnen.',
        uebungen: [{ gen: 'rz-gemischt', titel: 'Brüche und Dezimalzahlen gemischt' }],
      },
      {
        id: 'begruenden',
        text: 'Ich kann Aussagen über rationale Zahlen beurteilen und begründen.',
        uebungen: [{ gen: 'rz-aussagen', titel: 'Stimmt die Aussage?' }],
      },
    ],
  };
})(typeof window !== 'undefined' ? window : globalThis);
