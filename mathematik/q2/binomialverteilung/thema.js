/*
 * Thema: Binomialverteilung (Q2 GK) – Vorbereitung auf die Klausur
 * Formel von Bernoulli, kumulierte Binomialverteilung, Erwartungswert und Standardabweichung, Parameter bestimmen.
 *
 * Aufbau wie mathematik/klasse-10/…/thema.js:
 *   zeilen          Zeilen der Checkliste, jede mit eigener Selbsteinschätzung ($…$ = Formel)
 *   notizbuch       Seiten im Klassennotizbuch (OneNote-App und Webansicht); nur mit Schul-Konto erreichbar.
 *                   Gehören zum Kurs Abi27_M_G3_Uhl (Inhaltsbibliothek, Abschnitt 5 Sto), siehe docs/notizbuch-links.md
 *   uebungen        Übungen dieser Seite (gen = Generator aus assets/js/generatoren/binomialverteilung.js)
 * Schreibweise P_p^n(X ≤ k) nur dort, wo die Parameter wichtig sind (Parameter bestimmen).
 * Keine σ-Regeln (GK). Kein seq: Parameter werden mit der Wertetabelle bestimmt.
 */
(function (global) {
  'use strict';
  global.UM.thema = {
    "id": "mathematik-q2-binomialverteilung",
    "fach": "Mathematik",
    "stufe": "Q2 (Grundkurs)",
    "titel": "Binomialverteilung",
    "untertitel": "Vorbereitung auf die Klausur: Formel von Bernoulli, Histogramme, kumulierte Binomialverteilung, Erwartungswert und Standardabweichung, Parameter bestimmen",
    "kurs": "M G3 (Abi 2027)",
    "arbeit": "Klausur",
    "test": {
      "anzahlProKompetenz": 1,
      "stufen": [2, 2, 3]
    },
    "kompetenzen": [
      {
        "id": "bernoulli-kette",
        "notizbuch": [
          {
            "titel": "06.11. | AB 36 - Binomialverteilung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#06.11.%20%7C%20AB%2036%20-%20Binomialverteilung&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=b003763f-ce86-4042-b72e-3705174d4a40&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F06.11.%20%5C%7C%20AB%2036%20-%20Binomialverteilung%7Cb003763f-ce86-4042-b72e-3705174d4a40%2F%29"
          },
          {
            "titel": "AB 37 - Übungen Binomialverteilung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#%7C%20AB%2037%20-%20%C3%9Cbungen%20Binomialverteilung&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=921e7713-b011-814a-bbc9-f292f3123c3c&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F%5C%7C%20AB%2037%20-%20%C3%9Cbungen%20Binomialverteilung%7C921e7713-b011-814a-bbc9-f292f3123c3c%2F%29"
          }
        ],
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
        "notizbuch": [
          {
            "titel": "06.11. | AB 36 - Binomialverteilung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#06.11.%20%7C%20AB%2036%20-%20Binomialverteilung&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=b003763f-ce86-4042-b72e-3705174d4a40&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F06.11.%20%5C%7C%20AB%2036%20-%20Binomialverteilung%7Cb003763f-ce86-4042-b72e-3705174d4a40%2F%29"
          },
          {
            "titel": "AB 37 - Übungen Binomialverteilung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#%7C%20AB%2037%20-%20%C3%9Cbungen%20Binomialverteilung&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=921e7713-b011-814a-bbc9-f292f3123c3c&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F%5C%7C%20AB%2037%20-%20%C3%9Cbungen%20Binomialverteilung%7C921e7713-b011-814a-bbc9-f292f3123c3c%2F%29"
          }
        ],
        "zeilen": [
          "Ich kann Ereignisse wie „genau 3 Treffer“, „kein Treffer“ oder „mindestens ein Treffer“ mit $P(X=k)$ aufschreiben und umgekehrt eine Schreibweise wie $P(X=3)$ im Sachzusammenhang deuten."
        ],
        "uebungen": [
          { "gen": "bv-schreibweise", "titel": "Die Schreibweise P(X = k)" }
        ]
      },
      {
        "id": "histogramme",
        "notizbuch": [
          {
            "titel": "13.11. | Histogramme",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#13.11.%20%7C%20Histogramme&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=f259bfc3-953e-8f4a-b967-17917cf91542&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F13.11.%20%5C%7C%20Histogramme%7Cf259bfc3-953e-8f4a-b967-17917cf91542%2F%29"
          }
        ],
        "zeilen": [
          "Ich kann Histogramme einer Binomialverteilung lesen und beschreiben, wie ihre Form von $n$ und $p$ abhängt."
        ],
        "uebungen": [
          { "gen": "bv-histogramm", "titel": "Histogramme lesen, zuordnen und prüfen" }
        ]
      },
      {
        "id": "formel",
        "notizbuch": [
          {
            "titel": "06.11. | AB 36 - Binomialverteilung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#06.11.%20%7C%20AB%2036%20-%20Binomialverteilung&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=b003763f-ce86-4042-b72e-3705174d4a40&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F06.11.%20%5C%7C%20AB%2036%20-%20Binomialverteilung%7Cb003763f-ce86-4042-b72e-3705174d4a40%2F%29"
          },
          {
            "titel": "AB 37 - Übungen Binomialverteilung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#%7C%20AB%2037%20-%20%C3%9Cbungen%20Binomialverteilung&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=921e7713-b011-814a-bbc9-f292f3123c3c&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F%5C%7C%20AB%2037%20-%20%C3%9Cbungen%20Binomialverteilung%7C921e7713-b011-814a-bbc9-f292f3123c3c%2F%29"
          }
        ],
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
        "notizbuch": [
          {
            "titel": "06.11. | AB 36 - Binomialverteilung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#06.11.%20%7C%20AB%2036%20-%20Binomialverteilung&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=b003763f-ce86-4042-b72e-3705174d4a40&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F06.11.%20%5C%7C%20AB%2036%20-%20Binomialverteilung%7Cb003763f-ce86-4042-b72e-3705174d4a40%2F%29"
          },
          {
            "titel": "AB 37 - Übungen Binomialverteilung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#%7C%20AB%2037%20-%20%C3%9Cbungen%20Binomialverteilung&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=921e7713-b011-814a-bbc9-f292f3123c3c&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F%5C%7C%20AB%2037%20-%20%C3%9Cbungen%20Binomialverteilung%7C921e7713-b011-814a-bbc9-f292f3123c3c%2F%29"
          }
        ],
        "zeilen": [
          "Ich kann $P(X=k)$ mit der CAS-App berechnen (binomPdf(n,p,k)) und das Ergebnis im Sachzusammenhang deuten."
        ],
        "uebungen": [
          { "gen": "bv-cas", "titel": "binomPdf in der CAS-App" }
        ]
      },
      {
        "id": "sachaufgaben",
        "notizbuch": [
          {
            "titel": "AB 37 - Übungen Binomialverteilung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#%7C%20AB%2037%20-%20%C3%9Cbungen%20Binomialverteilung&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=921e7713-b011-814a-bbc9-f292f3123c3c&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F%5C%7C%20AB%2037%20-%20%C3%9Cbungen%20Binomialverteilung%7C921e7713-b011-814a-bbc9-f292f3123c3c%2F%29"
          }
        ],
        "zeilen": [
          "Ich kann Sachaufgaben zur Binomialverteilung lösen, auch mit Ereignissen wie „keiner“, „alle“, „mindestens einer“ und „höchstens zwei“."
        ],
        "uebungen": [
          { "gen": "bv-kontext", "titel": "Sachaufgaben, vermischt" }
        ]
      },
      {
        "id": "grenzen",
        "notizbuch": [
          {
            "titel": "20.11. | AB 38 - Kumulierte Binomialverteilung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#20.11.%20%7C%20AB%2038%20-%20Kumulierte%20Binomialverteilung&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=0b6aa002-ff22-437a-8b05-bb4f3759726c&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F20.11.%20%5C%7C%20AB%2038%20-%20Kumulierte%20Binomialverteilung%7C0b6aa002-ff22-437a-8b05-bb4f3759726c%2F%29"
          }
        ],
        "zeilen": [
          "Ich kann Ereignisse wie „höchstens“, „mindestens“, „mehr als“, „weniger als“ und „zwischen“ als $P(a\\le X\\le b)$ schreiben und dabei die Grenzen richtig setzen – auch im Histogramm."
        ],
        "uebungen": [
          { "gen": "bv-grenzen", "titel": "Grenzen setzen: P(a ≤ X ≤ b)" }
        ]
      },
      {
        "id": "binomcdf",
        "notizbuch": [
          {
            "titel": "20.11. | AB 38 - Kumulierte Binomialverteilung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#20.11.%20%7C%20AB%2038%20-%20Kumulierte%20Binomialverteilung&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=0b6aa002-ff22-437a-8b05-bb4f3759726c&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F20.11.%20%5C%7C%20AB%2038%20-%20Kumulierte%20Binomialverteilung%7C0b6aa002-ff22-437a-8b05-bb4f3759726c%2F%29"
          }
        ],
        "zeilen": [
          "Ich kann kumulierte Wahrscheinlichkeiten mit der CAS-App berechnen: binomCdf(n,p,untere Grenze,obere Grenze)."
        ],
        "uebungen": [
          { "gen": "bv-cdf", "titel": "binomCdf in der CAS-App" }
        ]
      },
      {
        "id": "gegenereignis",
        "notizbuch": [
          {
            "titel": "20.11. | AB 38 - Kumulierte Binomialverteilung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#20.11.%20%7C%20AB%2038%20-%20Kumulierte%20Binomialverteilung&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=0b6aa002-ff22-437a-8b05-bb4f3759726c&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F20.11.%20%5C%7C%20AB%2038%20-%20Kumulierte%20Binomialverteilung%7C0b6aa002-ff22-437a-8b05-bb4f3759726c%2F%29"
          },
          {
            "titel": "AB 39 - Übungen Kumulierte Binomialverteilung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#%7C%20AB%2039%20-%20%C3%9Cbungen%20Kumulierte%20Binomialverteilung&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=93bfdca4-68fe-4d7b-84dd-80fcb224b87d&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F%5C%7C%20AB%2039%20-%20%C3%9Cbungen%20Kumulierte%20Binomialverteilung%7C93bfdca4-68fe-4d7b-84dd-80fcb224b87d%2F%29"
          }
        ],
        "zeilen": [
          "Ich kann zu einem Ereignis das Gegenereignis angeben und seine Wahrscheinlichkeit bestimmen."
        ],
        "uebungen": [
          { "gen": "bv-gegen", "titel": "Gegenereignisse" }
        ]
      },
      {
        "id": "kumuliert-sachaufgaben",
        "notizbuch": [
          {
            "titel": "AB 39 - Übungen Kumulierte Binomialverteilung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#%7C%20AB%2039%20-%20%C3%9Cbungen%20Kumulierte%20Binomialverteilung&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=93bfdca4-68fe-4d7b-84dd-80fcb224b87d&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F%5C%7C%20AB%2039%20-%20%C3%9Cbungen%20Kumulierte%20Binomialverteilung%7C93bfdca4-68fe-4d7b-84dd-80fcb224b87d%2F%29"
          }
        ],
        "zeilen": [
          "Ich kann Sachaufgaben zur kumulierten Binomialverteilung lösen."
        ],
        "uebungen": [
          { "gen": "bv-kum-kontext", "titel": "Sachaufgaben zur kumulierten Binomialverteilung" }
        ]
      },
      {
        "id": "kenngroessen",
        "notizbuch": [
          {
            "titel": "25.11. | AB 40 - Erwartungswert und Standardabweichung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#25.11.%20%7C%20AB%2040%20-%20Erwartungswert%20und%20&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=faec0b44-b36b-424a-8297-8d1dbaffa90e&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F25.11.%20%5C%7C%20AB%2040%20-%20Erwartungswert%20und%20%7Cfaec0b44-b36b-424a-8297-8d1dbaffa90e%2F%29"
          },
          {
            "titel": "AB 41 - Übungen Standardabweichung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#%7C%20AB%2041%20-%20%C3%9Cbungen%20Standardabweichung&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=2804ee28-576e-4da2-91ce-5f0a185bccb2&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F%5C%7C%20AB%2041%20-%20%C3%9Cbungen%20Standardabweichung%7C2804ee28-576e-4da2-91ce-5f0a185bccb2%2F%29"
          }
        ],
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
        "notizbuch": [
          {
            "titel": "25.11. | AB 40 - Erwartungswert und Standardabweichung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#25.11.%20%7C%20AB%2040%20-%20Erwartungswert%20und%20&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=faec0b44-b36b-424a-8297-8d1dbaffa90e&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F25.11.%20%5C%7C%20AB%2040%20-%20Erwartungswert%20und%20%7Cfaec0b44-b36b-424a-8297-8d1dbaffa90e%2F%29"
          }
        ],
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
        "notizbuch": [
          {
            "titel": "25.11. | AB 40 - Erwartungswert und Standardabweichung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#25.11.%20%7C%20AB%2040%20-%20Erwartungswert%20und%20&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=faec0b44-b36b-424a-8297-8d1dbaffa90e&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F25.11.%20%5C%7C%20AB%2040%20-%20Erwartungswert%20und%20%7Cfaec0b44-b36b-424a-8297-8d1dbaffa90e%2F%29"
          },
          {
            "titel": "AB 41 - Übungen Standardabweichung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#%7C%20AB%2041%20-%20%C3%9Cbungen%20Standardabweichung&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=2804ee28-576e-4da2-91ce-5f0a185bccb2&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F%5C%7C%20AB%2041%20-%20%C3%9Cbungen%20Standardabweichung%7C2804ee28-576e-4da2-91ce-5f0a185bccb2%2F%29"
          }
        ],
        "zeilen": [
          "Ich kann Histogramme mithilfe von $\\mu$ und $\\sigma$ zuordnen und beschreiben, wie sich $\\mu$ und $\\sigma$ ändern, wenn sich $n$ oder $p$ ändert."
        ],
        "uebungen": [
          { "gen": "bv-kenngroessen-hist", "titel": "μ und σ im Histogramm: Einfluss von n und p" }
        ]
      },
      {
        "id": "parameter-bestimmen",
        "notizbuch": [
          {
            "titel": "27.11. | Parameter bestimmen",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#27.11.%20%7C%20Parameter%20bestimmen&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=1493d01c-e187-4d65-920a-5a87d5dfe8ea&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F27.11.%20%5C%7C%20Parameter%20bestimmen%7C1493d01c-e187-4d65-920a-5a87d5dfe8ea%2F%29"
          },
          {
            "titel": "AB 42A - Parameter bestimmen (Gruppe A)",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#%7C%20AB%2042A%20-%20Parameter%20bestimmen%20%28Gruppe%20A%29&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=fc151dab-73e3-4e4b-b73e-0c3f3a62955e&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F%5C%7C%20AB%2042A%20-%20Parameter%20bestimmen%20%28Gruppe%20A%5C%29%7Cfc151dab-73e3-4e4b-b73e-0c3f3a62955e%2F%29"
          },
          {
            "titel": "AB 42B - Parameter bestimmen (Gruppe B)",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#%7C%20AB%2042B%20-%20Parameter%20bestimmen%20%28Gruppe%20B%29&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=cffb2134-eb94-44b2-8cd9-1974f0c72521&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F%5C%7C%20AB%2042B%20-%20Parameter%20bestimmen%20%28Gruppe%20B%5C%29%7Ccffb2134-eb94-44b2-8cd9-1974f0c72521%2F%29"
          },
          {
            "titel": "AB 42C - Parameter bestimmen (Gruppe C)",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#%7C%20AB%2042C%20-%20Parameter%20bestimmen%20%28Gruppe%20C%29&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=b727e801-e253-4dbd-8e52-6fb5a5c6227d&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F%5C%7C%20AB%2042C%20-%20Parameter%20bestimmen%20%28Gruppe%20C%5C%29%7Cb727e801-e253-4dbd-8e52-6fb5a5c6227d%2F%29"
          },
          {
            "titel": "AB 43 - Parameter bestimmen (Stammgruppe)",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch/_Inhaltsbibliothek/5%20Sto%20-%20Stochastik.one#%7C%20AB%2043%20-%20Parameter%20bestimmen%20%28Stammgruppe%29&section-id=dde00519-4181-467d-81e1-2eb3180d53f4&page-id=ac34615c-bb77-41eb-9f16-5a6fd97c27c7&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/Abi27_M_G3_Uhl/SiteAssets/Abi27_M_G3_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F5%20Sto%20-%20Stochastik.one%7Cdde00519-4181-467d-81e1-2eb3180d53f4%2F%5C%7C%20AB%2043%20-%20Parameter%20bestimmen%20%28Stammgruppe%5C%29%7Cac34615c-bb77-41eb-9f16-5a6fd97c27c7%2F%29"
          }
        ],
        "zeilen": [
          "Ich kann bei einer Sachaufgabe erkennen, ob eine Wahrscheinlichkeit oder einer der Parameter $n$, $p$ oder $k$ gesucht ist, und den Ansatz als Ungleichung in der Form $P_p^n(X\\le k)\\ge \\ldots$ aufstellen, …",
          "… ich kann den gesuchten Parameter mit einer Wertetabelle im CAS bestimmen und mit den beiden kritischen Werten dokumentieren."
        ],
        "uebungen": [
          { "gen": "bv-ansatz", "titel": "Was ist gesucht? Ansatz und Eingabe" },
          { "gen": "bv-parameter-tabelle", "titel": "Parameter mit der Wertetabelle bestimmen" }
        ]
      }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
