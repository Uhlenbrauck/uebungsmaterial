/*
 * Thema: Binomialverteilung und Formel von Bernoulli (Q2 GK) – Übungen zum laufenden Unterricht
 *
 * Aufbau wie mathematik/klasse-10/…/thema.js, aber ohne Selbsteinschätzung (einschaetzung: false):
 * Die Zeilen erscheinen als „Was übe ich hier?“ und können später in die Checkliste zur Klausur übernommen werden.
 * Notizbuch-Links folgen später (docs/notizbuch-links.md).
 */
(function (global) {
  'use strict';
  global.UM.thema = {
    "id": "mathematik-q2-binomialverteilung",
    "fach": "Mathematik",
    "stufe": "Q2 (Grundkurs)",
    "titel": "Binomialverteilung und Formel von Bernoulli",
    "untertitel": "Übungen zum Unterricht",
    "einschaetzung": false,
    "arbeit": "Klausur",
    "test": {
      "anzahlProKompetenz": 1,
      "stufen": [2, 2, 3]
    },
    "kompetenzen": [
      {
        "id": "bernoulli-kette",
        "zeilen": [
          "Ich kann ein Zufallsexperiment als Bernoulli-Kette auffassen: festlegen, was ein Treffer ist, und $n$ und $p$ angeben, …",
          "… ich kann entscheiden, ob eine Zufallsgröße binomialverteilt ist."
        ],
        "uebungen": [
          { "gen": "bv-erkennen", "titel": "Treffer, n und p – und ist X binomialverteilt?" }
        ]
      },
      {
        "id": "schreibweise",
        "zeilen": [
          "Ich kann Ereignisse wie „genau 3 Treffer“, „kein Treffer“ oder „mindestens ein Treffer“ mit $P(X=k)$ aufschreiben und umgekehrt eine Schreibweise wie $P(X=3)$ im Sachzusammenhang deuten."
        ],
        "uebungen": [
          { "gen": "bv-schreibweise", "titel": "Die Schreibweise P(X = k)" }
        ]
      },
      {
        "id": "histogramme",
        "zeilen": [
          "Ich kann Histogramme einer Binomialverteilung lesen und beschreiben, wie ihre Form von $n$ und $p$ abhängt."
        ],
        "uebungen": [
          { "gen": "bv-histogramm", "titel": "Histogramme lesen, zuordnen und prüfen" }
        ]
      },
      {
        "id": "formel",
        "zeilen": [
          "Ich kann die Formel von Bernoulli $P(X=k)=\\binom{n}{k}\\cdot p^k\\cdot (1-p)^{n-k}$ aufstellen und ihre Teile erklären, …",
          "… ich kann damit Wahrscheinlichkeiten ohne CAS berechnen."
        ],
        "uebungen": [
          { "gen": "bv-formel", "titel": "Die Formel von Bernoulli (ohne CAS)" }
        ]
      },
      {
        "id": "cas",
        "zeilen": [
          "Ich kann $P(X=k)$ mit der CAS-App berechnen (binomPdf(n,p,k)) und das Ergebnis im Sachzusammenhang deuten."
        ],
        "uebungen": [
          { "gen": "bv-cas", "titel": "binomPdf in der CAS-App" }
        ]
      },
      {
        "id": "sachaufgaben",
        "zeilen": [
          "Ich kann Sachaufgaben zur Binomialverteilung lösen, auch mit Ereignissen wie „keiner“, „alle“, „mindestens einer“ und „höchstens zwei“."
        ],
        "uebungen": [
          { "gen": "bv-kontext", "titel": "Sachaufgaben, vermischt" }
        ]
      }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
