/*
 * Thema: Daten und Diagramme · Addieren und Subtrahieren (Klasse 5)
 *
 * Aufbau wie mathematik/klasse-7/rationale-zahlen/thema.js.
 *   zeilen        Zeilen der Checkliste
 *   buch          Seiten im Schulbuch
 *   arbeitsheft   Seiten im Arbeitsheft („Weitere Aufgaben“ auf der Checkliste)
 *   uebungen      Generatoren aus assets/js/generatoren/klasse5-daten-rechnen.js
 *   realmath      Übungen auf realmath.de
 *   zusatz        true = steht nicht auf der Checkliste
 * Für Strichliste, Häufigkeitstabelle und Histogramm gibt es auf realmath.de keine Übungen.
 */
(function (global) {
  'use strict';
  global.UM.thema = {
    id: 'mathematik-5-daten-addieren-subtrahieren',
    fach: 'Mathematik',
    stufe: 'Klasse 5',
    titel: 'Daten und Diagramme · Addieren und Subtrahieren',
    untertitel: 'Vorbereitung auf die Klassenarbeit',
    test: { anzahlProKompetenz: 1, stufen: [2, 2, 3] },
    kompetenzen: [
      {
        id: 'urliste',
        zeilen: ['Ich kann in einer Urliste gesammelte Daten ordnen und in einer Häufigkeitstabelle darstellen.'],
        arbeitsheft: 'S. 9/10',
        uebungen: [
          { gen: 'k5-haeufigkeit', titel: 'Von der Urliste zur Häufigkeitstabelle' },
          { gen: 'k5-probe', titel: 'Die Probe: Stimmt die Häufigkeitstabelle?' },
        ],
      },
      {
        id: 'diagramme',
        zeilen: ['Ich kann die Daten einer Häufigkeitstabelle in einem Säulen- oder Balkendiagramm darstellen.'],
        arbeitsheft: 'S. 11 bis 14',
        uebungen: [
          { gen: 'k5-diagramm-lesen', titel: 'Säulen- und Balkendiagramme ablesen' },
          { gen: 'k5-diagramm-pruefen', titel: 'Fehler im Diagramm finden' },
        ],
        realmath: [
          { gruppe: 'Diagramme zeichnen', links: [
            { titel: 'Säulendiagramm, Level 1', url: 'https://realmath.de/Neues/Klasse5/diagramm/saeulendiagramm02a.php' },
            { titel: 'Balkendiagramm', url: 'https://realmath.de/Neues/Klasse5/diagramm/balkendiagramm.php' },
          ] },
          { gruppe: 'Diagramme lesen', links: [
            { titel: 'Diagramme auswerten, Level 1', url: 'https://realmath.de/Neues/Klasse5/diagramm/saeulendiagramm01a.php' },
            { titel: 'Falsches Diagramm erkennen', url: 'https://realmath.de/Neues/Klasse5/diagramm/saeulendiagramm03a.php' },
            { titel: 'Balkendiagramme lesen', url: 'https://realmath.de/Neues/Klasse5/diagramm/balkendiagramm2.php' },
          ] },
        ],
      },
      {
        id: 'histogramm',
        zeilen: ['Ich kann Histogramme zu einer gegebenen Datenmenge erstellen.'],
        buch: 'S. 31',
        uebungen: [
          { gen: 'k5-klassen', titel: 'Daten in Klassen einteilen und zählen' },
          { gen: 'k5-histogramm-lesen', titel: 'Histogramme lesen' },
        ],
      },
      {
        id: 'addieren-subtrahieren',
        zeilen: ['Ich kann natürliche Zahlen addieren und subtrahieren.'],
        buch: 'S. 35/36',
        arbeitsheft: 'S. 15/16',
        uebungen: [{ gen: 'k5-kopf', titel: 'Kopfrechnen und Fachbegriffe' }],
        realmath: [
          { gruppe: null, links: [
            { titel: 'Zweistellige Zahlen addieren und subtrahieren', url: 'https://realmath.de/Neues/Klasse5/addisubi/addsubimkopf.php' },
          ] },
        ],
      },
      {
        id: 'klammern',
        zeilen: ['Ich kann bei der Addition und Subtraktion die Klammerregeln beachten.'],
        buch: 'S. 49; S. 59, Aufg. 6 und 9',
        uebungen: [
          { gen: 'k5-klammern', titel: 'Rechnen mit Klammern' },
          { gen: 'k5-klammer-setzen', titel: 'Wo fehlt die Klammer?' },
        ],
        realmath: [
          { gruppe: null, links: [
            { titel: 'Aufgaben mit Klammern, Level 1', url: 'https://realmath.de/Neues/Klasse5/addieren/berechne.php' },
            { titel: 'Aufgaben mit Klammern, Level 2', url: 'https://realmath.de/Neues/Klasse5/addieren/berechne2.php' },
          ] },
        ],
      },
      {
        id: 'text',
        zeilen: ['Ich kann einen Text als Rechnung notieren.'],
        buch: 'S. 48',
        uebungen: [{ gen: 'k5-text', titel: 'Texte als Rechnung schreiben' }],
        realmath: [
          { gruppe: null, links: [
            { titel: 'Erste Textaufgaben', url: 'https://realmath.de/Neues/Klasse5/addieren/berechne3.php' },
            { titel: 'Textaufgaben 2', url: 'https://realmath.de/Neues/Klasse5/addieren/textaufgabe2.php' },
            { titel: 'Subtraktion mit Text', url: 'https://realmath.de/Neues/Klasse5/subtrahieren/subinatvartext01.php' },
          ] },
        ],
      },
      {
        id: 'schriftlich',
        zeilen: ['Ich kann natürliche Zahlen schriftlich addieren und subtrahieren.'],
        buch: 'S. 51 und 52',
        arbeitsheft: 'S. 19',
        uebungen: [{ gen: 'k5-schriftlich', titel: 'Überschlag und schriftliches Rechnen' }],
        realmath: [
          { gruppe: null, links: [
            { titel: 'Schriftlich addieren', url: 'https://realmath.de/Neues/Klasse5/grundrechenarten/zahlenaddieren03a.php' },
            { titel: 'Schriftlich subtrahieren', url: 'https://realmath.de/Neues/Klasse5/grundrechenarten/zahlensubtrahieren00.php' },
            { titel: 'Schriftlich subtrahieren, Profi', url: 'https://realmath.de/Neues/Klasse5/grundrechenarten/zahlensubtrahieren03.php' },
          ] },
        ],
      },
      {
        id: 'umkehraufgaben',
        zeilen: ['Ich kann bei Additions- und Subtraktionsaufgaben fehlende Zahlen mithilfe von Umkehraufgaben bestimmen.'],
        buch: 'S. 47, Aufg. 12 bis 13; S. 59, Aufg. 5',
        uebungen: [{ gen: 'k5-platzhalter', titel: 'Platzhalter und Umkehraufgaben' }],
        realmath: [
          { gruppe: null, links: [
            { titel: 'Summand oder Summe fehlt', url: 'https://realmath.de/Neues/Klasse5/addieren/addiermal.php' },
            { titel: 'Subtrahieren: eine Zahl fehlt', url: 'https://realmath.de/Neues/Klasse5/subtrahieren/subtrahiermal.php' },
            { titel: 'Subtrahieren: Was ist x?', url: 'https://realmath.de/Neues/Klasse5/subtrahieren/subinatvar.php' },
          ] },
        ],
      },
      {
        id: 'rechengesetze',
        zeilen: ['Ich kann das Vertauschungs- und Verbindungsgesetz zum geschickten Rechnen anwenden.'],
        buch: 'S. 50; S. 59, Aufg. 8',
        arbeitsheft: 'S. 17',
        uebungen: [
          { gen: 'k5-geschickt', titel: 'Geschickt addieren' },
          { gen: 'k5-gesetze', titel: 'Gilt das Rechengesetz?' },
        ],
        realmath: [
          { gruppe: null, links: [
            { titel: 'Drei Zahlen geschickt addieren', url: 'https://realmath.de/Neues/Klasse5/rechengesetze/anwenden01.php' },
            { titel: 'Vier Zahlen geschickt addieren', url: 'https://realmath.de/Neues/Klasse5/rechengesetze/anwenden.php' },
          ] },
        ],
      },
      {
        id: 'runden-rueckwaerts',
        zusatz: true,
        zeilen: ['Ich kann zu einer gerundeten Zahl die kleinste und die größte mögliche Ausgangszahl angeben.'],
        uebungen: [{ gen: 'k5-runden-rueck', titel: 'Rückwärts runden' }],
        realmath: [
          { gruppe: null, links: [
            { titel: 'Zahlen runden', url: 'https://realmath.de/Neues/Klasse5/zahlenausn/zahlenrunden.php' },
            { titel: 'Wurde richtig gerundet?', url: 'https://realmath.de/Neues/Klasse5/zahlenausn/richtigrunden.php' },
          ] },
        ],
      },
    ],
  };
})(typeof window !== 'undefined' ? window : globalThis);
