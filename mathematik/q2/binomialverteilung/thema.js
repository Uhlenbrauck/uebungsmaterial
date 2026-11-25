/*
 * Thema: Binomialverteilung, Formel von Bernoulli, kumulierte Binomialverteilung, Erwartungswert und Standardabweichung (Q2 GK) – Übungen zum laufenden Unterricht
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
    "titel": "Binomialverteilung",
    "untertitel": "Übungen zum Unterricht: Formel von Bernoulli, Histogramme, kumulierte Binomialverteilung, Erwartungswert und Standardabweichung",
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
      },
      {
        "id": "grenzen",
        "zeilen": [
          "Ich kann Ereignisse wie „höchstens“, „mindestens“, „mehr als“, „weniger als“ und „zwischen“ als $P(a\\le X\\le b)$ schreiben und dabei die Grenzen richtig setzen – auch im Histogramm."
        ],
        "uebungen": [
          { "gen": "bv-grenzen", "titel": "Grenzen setzen: P(a ≤ X ≤ b)" }
        ]
      },
      {
        "id": "binomcdf",
        "zeilen": [
          "Ich kann kumulierte Wahrscheinlichkeiten mit der CAS-App berechnen: binomCdf(n,p,untere Grenze,obere Grenze)."
        ],
        "uebungen": [
          { "gen": "bv-cdf", "titel": "binomCdf in der CAS-App" }
        ]
      },
      {
        "id": "gegenereignis",
        "zeilen": [
          "Ich kann zu einem Ereignis das Gegenereignis angeben und seine Wahrscheinlichkeit bestimmen."
        ],
        "uebungen": [
          { "gen": "bv-gegen", "titel": "Gegenereignisse" }
        ]
      },
      {
        "id": "kumuliert-sachaufgaben",
        "zeilen": [
          "Ich kann Sachaufgaben zur kumulierten Binomialverteilung lösen, auch wenn eine Anzahl gesucht ist, die mit einer vorgegebenen Wahrscheinlichkeit ausreicht."
        ],
        "uebungen": [
          { "gen": "bv-kum-kontext", "titel": "Sachaufgaben zur kumulierten Binomialverteilung" }
        ]
      },
      {
        "id": "kenngroessen",
        "zeilen": [
          "Ich kann den Erwartungswert $\\mu$ und die Standardabweichung $\\sigma$ einer binomialverteilten Zufallsgröße berechnen, …",
          "… ich kann beide Kenngrößen im Sachzusammenhang deuten, …",
          "… ich kann aus $\\mu$ und $\\sigma$ die Parameter $n$ und $p$ bestimmen."
        ],
        "uebungen": [
          { "gen": "bv-kenngroessen", "titel": "Erwartungswert und Standardabweichung berechnen und deuten" }
        ]
      },
      {
        "id": "sigma-umgebung",
        "zeilen": [
          "Ich kann die Werte angeben, die höchstens um $\\sigma$ vom Erwartungswert abweichen, und die Wahrscheinlichkeit dafür mit binomCdf berechnen, …",
          "… ich kann mit $\\sigma$ beschreiben, wie weit ein Ergebnis vom Erwartungswert entfernt ist."
        ],
        "uebungen": [
          { "gen": "bv-sigma-umgebung", "titel": "Werte in der Nähe des Erwartungswerts" }
        ]
      },
      {
        "id": "kenngroessen-histogramm",
        "zeilen": [
          "Ich kann Histogramme mithilfe von $\\mu$ und $\\sigma$ zuordnen und beschreiben, wie sich $\\mu$ und $\\sigma$ ändern, wenn sich $n$ oder $p$ ändert."
        ],
        "uebungen": [
          { "gen": "bv-kenngroessen-hist", "titel": "μ und σ im Histogramm: Einfluss von n und p" }
        ]
      }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
