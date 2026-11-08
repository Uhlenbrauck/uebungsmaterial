/*
 * Zufallshilfen für alle Generatoren (UM.zufall). Wird vor den Generatoren geladen.
 * generatoren/rationale-zahlen.js ersetzt UM.zufall durch eine erweiterte Fassung mit denselben Funktionen.
 */
(function (global) {
  'use strict';
  const UM = (global.UM = global.UM || {});
  if (UM.zufall) return;
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
  };
  UM.zufall = R;
})(typeof window !== 'undefined' ? window : globalThis);
