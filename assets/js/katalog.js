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
      ],
    },
  ];
})(typeof window !== 'undefined' ? window : globalThis);
