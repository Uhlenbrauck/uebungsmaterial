/*
 * Inhaltsverzeichnis der Startseite. Neues Thema: Eintrag hier ergänzen.
 * status: 'neu' | 'verfuegbar' | 'geplant'
 */
(function (global) {
  'use strict';
  global.UM = global.UM || {};
  global.UM.katalog = [
    {
      fach: 'Mathematik',
      bereiche: [
        {
          titel: 'Klasse 7',
          themen: [
            {
              titel: 'Rechnen mit rationalen Zahlen',
              text: 'Zahlenmengen, Zahlenstrahl, Betrag, die vier Grundrechenarten mit rationalen Zahlen und Rechengesetze. Mit Checkliste und Abschlusstest.',
              pfad: 'mathematik/klasse-7/rationale-zahlen/index.html',
              status: 'neu',
            },
          ],
        },
        {
          titel: 'Klasse 10',
          themen: [
            {
              titel: 'Bedingte Wahrscheinlichkeit und quadratische Gleichungen',
              text: 'Vierfeldertafel und Baumdiagramm, bedingte Wahrscheinlichkeit, Zuverlässigkeit von Tests, stochastische Unabhängigkeit, Scheitelform, charakteristische Punkte, Anwendungen mit der CAS-App und Nullstellen ohne CAS. Mit Checkliste und Abschlusstest.',
              pfad: 'mathematik/klasse-10/wahrscheinlichkeit-quadratische-gleichungen/index.html',
              status: 'neu',
            },
          ],
        },
        {
          titel: 'Q2 (Grundkurs)',
          themen: [
            {
              titel: 'Binomialverteilung und Formel von Bernoulli',
              text: 'Übungen zum Unterricht: Bernoulli-Kette erkennen, Schreibweise P(X = k), Formel von Bernoulli ohne CAS, binomPdf in der CAS-App und Sachaufgaben.',
              pfad: 'mathematik/q2/binomialverteilung/index.html',
              status: 'neu',
            },
          ],
        },
      ],
    },
  ];
})(typeof window !== 'undefined' ? window : globalThis);
