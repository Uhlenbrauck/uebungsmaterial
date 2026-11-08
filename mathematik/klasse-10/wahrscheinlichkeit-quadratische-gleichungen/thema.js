/*
 * Thema: Bedingte Wahrscheinlichkeit und quadratische Gleichungen (Klasse 10) – Vorbereitung auf die Klassenarbeit Nr. 1
 *
 * Aufbau wie mathematik/klasse-7/rationale-zahlen/thema.js:
 *   zeilen          Zeilen der Checkliste, jede mit eigener Selbsteinschätzung ($…$ = Formel)
 *   buch            Seiten im Schulbuch
 *   notizbuch       Seiten im Klassennotizbuch (OneNote-App und Webansicht); nur mit Schul-Konto erreichbar.
 *                   Gehören zum Kurs Ma 10c 2026/27 (Inhaltsbibliothek), siehe docs/notizbuch-links.md.
 *   uebungen        Übungen dieser Seite (gen = Generator aus assets/js/generatoren/…)
 *   realmath        Übungen auf realmath.de
 *   notizbuchUeben  Übungsseiten im Notizbuch
 * Nicht jeder Punkt kommt in der Klassenarbeit vor.
 */
(function (global) {
  'use strict';
  global.UM.thema = {
    "id": "mathematik-10-wahrscheinlichkeit-quadratische-gleichungen",
    "fach": "Mathematik",
    "stufe": "Klasse 10",
    "titel": "Bedingte Wahrscheinlichkeit und quadratische Gleichungen",
    "untertitel": "Vorbereitung auf die Klassenarbeit Nr. 1",
    "kurs": "Ma 10c 2026/27",
    "test": {
      "anzahlProKompetenz": 1,
      "stufen": [
        2,
        2,
        3
      ]
    },
    "kompetenzen": [
      {
        "id": "vft-baum",
        "zeilen": [
          "Ich kann Daten in einer Vierfeldertafel darstellen und …",
          "… ich kann Vierfeldertafel und Baumdiagramm (auch das umgekehrte Baumdiagramm) ineinander umwandeln."
        ],
        "buch": "Klasse 9: S. 187 bis 188",
        "notizbuch": [
          {
            "titel": "Kl. 9: 19.06. | Vierfeldertafel",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/9.7%20Daten%20und%20Wahrscheinlichkeit.one#19.06.%20%7C%20Vierfeldertafel&section-id=dc1c7ec9-5720-40f8-9ca1-21a9a57fc1db&page-id=3e606d97-ccb9-4d2c-809a-db47265bb115&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F9.7%20Daten%20und%20Wahrscheinlichkeit.one%7Cdc1c7ec9-5720-40f8-9ca1-21a9a57fc1db%2F19.06.%20%5C%7C%20Vierfeldertafel%7C3e606d97-ccb9-4d2c-809a-db47265bb115%2F%29"
          },
          {
            "titel": "Kl. 9: AB 33 - Vierfeldertafel",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/9.7%20Daten%20und%20Wahrscheinlichkeit.one#%7C%20AB%2033%20-%20Vierfeldertafel&section-id=dc1c7ec9-5720-40f8-9ca1-21a9a57fc1db&page-id=0f68b358-4a3d-475c-95f3-e7ad4d724d66&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F9.7%20Daten%20und%20Wahrscheinlichkeit.one%7Cdc1c7ec9-5720-40f8-9ca1-21a9a57fc1db%2F%5C%7C%20AB%2033%20-%20Vierfeldertafel%7C0f68b358-4a3d-475c-95f3-e7ad4d724d66%2F%29"
          }
        ],
        "uebungen": [
          {
            "gen": "wk-vft-bedeutung",
            "titel": "Was bedeuten die Felder der Vierfeldertafel?",
            "imTest": false
          },
          {
            "gen": "wk-vft-ergaenzen",
            "titel": "Vierfeldertafeln ergänzen"
          },
          {
            "gen": "wk-text-vft",
            "titel": "Vierfeldertafel aus einem Text aufstellen"
          },
          {
            "gen": "wk-baum-vft",
            "titel": "Baumdiagramm und Vierfeldertafel (auch umgekehrt)"
          }
        ],
        "realmath": [
          {
            "gruppe": "Baumdiagramme (Wiederholung Klasse 8)",
            "links": [
              {
                "titel": "Baumdiagramm ergänzen 1",
                "url": "https://realmath.de/Neues/Klasse8/wahrscheinlichkeit/baumdiagramm.php"
              },
              {
                "titel": "Baumdiagramm ergänzen 2",
                "url": "https://realmath.de/Neues/Klasse8/wahrscheinlichkeit/baumdiagramm-2.php"
              },
              {
                "titel": "Baumdiagramm ergänzen 3",
                "url": "https://realmath.de/Neues/Klasse8/wahrscheinlichkeit/baumdiagramm-3.php"
              }
            ]
          }
        ],
        "notizbuchUeben": [
          {
            "titel": "Kl. 9: AB 34 - Übungen Vierfeldertafel",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/9.7%20Daten%20und%20Wahrscheinlichkeit.one#%7C%20AB%2034%20-%20%C3%9Cbungen%20Vierfeldertafel&section-id=dc1c7ec9-5720-40f8-9ca1-21a9a57fc1db&page-id=ea3a416d-cfd9-42d2-bac8-b18a35d101ee&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F9.7%20Daten%20und%20Wahrscheinlichkeit.one%7Cdc1c7ec9-5720-40f8-9ca1-21a9a57fc1db%2F%5C%7C%20AB%2034%20-%20%C3%9Cbungen%20Vierfeldertafel%7Cea3a416d-cfd9-42d2-bac8-b18a35d101ee%2F%29"
          },
          {
            "titel": "08.09. | AB 01 - Übungen Bedingte Wahrscheinlichkeit",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.1%20Daten%20und%20Wahrscheinlichkeit.one#08.09.%20%7C%20AB%2001%20-%20%C3%9Cbungen%20Bedingte%20&section-id=f1cd6343-588e-4459-96f7-242a0c4be5e8&page-id=9845b9f6-d006-4fbe-9e06-a7f260de92f3&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.1%20Daten%20und%20Wahrscheinlichkeit.one%7Cf1cd6343-588e-4459-96f7-242a0c4be5e8%2F08.09.%20%5C%7C%20AB%2001%20-%20%C3%9Cbungen%20Bedingte%20%7C9845b9f6-d006-4fbe-9e06-a7f260de92f3%2F%29"
          }
        ]
      },
      {
        "id": "bedingt",
        "zeilen": [
          "Ich kann eine bedingte Wahrscheinlichkeit $P_A(B)$ in Worten beschreiben und …",
          "… ich kann sie aus einer Vierfeldertafel oder einem Baumdiagramm berechnen, auch mit der Formel $P_A(B)=\\frac{P(A\\cap B)}{P(A)}$."
        ],
        "notizbuch": [
          {
            "titel": "| Bedingte Wahrscheinlichkeit",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.1%20Daten%20und%20Wahrscheinlichkeit.one#%7C%20Bedingte%20Wahrscheinlichkeit&section-id=f1cd6343-588e-4459-96f7-242a0c4be5e8&page-id=0b24fb58-9c6b-405d-a42d-668c4d83d38e&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.1%20Daten%20und%20Wahrscheinlichkeit.one%7Cf1cd6343-588e-4459-96f7-242a0c4be5e8%2F%5C%7C%20Bedingte%20Wahrscheinlichkeit%7C0b24fb58-9c6b-405d-a42d-668c4d83d38e%2F%29"
          },
          {
            "titel": "| AB 36 - Bedingte Wahrscheinlichkeit",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.1%20Daten%20und%20Wahrscheinlichkeit.one#%7C%20AB%2036%20-%20Bedingte%20Wahrscheinlichkeit&section-id=f1cd6343-588e-4459-96f7-242a0c4be5e8&page-id=34427c11-7991-4b0a-b801-8a3b0b741fa2&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.1%20Daten%20und%20Wahrscheinlichkeit.one%7Cf1cd6343-588e-4459-96f7-242a0c4be5e8%2F%5C%7C%20AB%2036%20-%20Bedingte%20Wahrscheinlichkeit%7C34427c11-7991-4b0a-b801-8a3b0b741fa2%2F%29"
          },
          {
            "titel": "09.09 | AB 02 - Formel Bedingte Wahrscheinlichkeit",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.1%20Daten%20und%20Wahrscheinlichkeit.one#09.09%20%7C%20AB%2002%20-%20Formel%20Bedingte%20Wahrscheinlichkeit&section-id=f1cd6343-588e-4459-96f7-242a0c4be5e8&page-id=118a08f1-fe15-4dd8-afb5-8fdb02cddf33&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.1%20Daten%20und%20Wahrscheinlichkeit.one%7Cf1cd6343-588e-4459-96f7-242a0c4be5e8%2F09.09%20%5C%7C%20AB%2002%20-%20Formel%20Bedingte%20Wahrscheinlichkeit%7C118a08f1-fe15-4dd8-afb5-8fdb02cddf33%2F%29"
          }
        ],
        "uebungen": [
          {
            "gen": "wk-bedingt-schreibweise",
            "titel": "Schreibweise und Bedeutung"
          },
          {
            "gen": "wk-bedingt-berechnen",
            "titel": "Bedingte Wahrscheinlichkeiten berechnen"
          }
        ],
        "notizbuchUeben": [
          {
            "titel": "08.09. | AB 01 - Übungen Bedingte Wahrscheinlichkeit",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.1%20Daten%20und%20Wahrscheinlichkeit.one#08.09.%20%7C%20AB%2001%20-%20%C3%9Cbungen%20Bedingte%20&section-id=f1cd6343-588e-4459-96f7-242a0c4be5e8&page-id=9845b9f6-d006-4fbe-9e06-a7f260de92f3&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.1%20Daten%20und%20Wahrscheinlichkeit.one%7Cf1cd6343-588e-4459-96f7-242a0c4be5e8%2F08.09.%20%5C%7C%20AB%2001%20-%20%C3%9Cbungen%20Bedingte%20%7C9845b9f6-d006-4fbe-9e06-a7f260de92f3%2F%29"
          }
        ]
      },
      {
        "id": "tests",
        "zeilen": [
          "Ich kann mit bedingten Wahrscheinlichkeiten beurteilen, wie aussagekräftig ein Testergebnis ist (z. B. bei einem medizinischen Test)."
        ],
        "notizbuch": [
          {
            "titel": "Kl. 9: 10.07. | Zuverlässigkeit von Tests",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/9.7%20Daten%20und%20Wahrscheinlichkeit.one#10.07.%20%7C%20Zuverl%C3%A4ssigkeit%20von%20Tests&section-id=dc1c7ec9-5720-40f8-9ca1-21a9a57fc1db&page-id=0a7aa4b7-ae47-fb4a-9993-327d686017f6&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F9.7%20Daten%20und%20Wahrscheinlichkeit.one%7Cdc1c7ec9-5720-40f8-9ca1-21a9a57fc1db%2F10.07.%20%5C%7C%20Zuverl%C3%A4ssigkeit%20von%20Tests%7C0a7aa4b7-ae47-fb4a-9993-327d686017f6%2F%29"
          },
          {
            "titel": "08.09. | Wdh.: AB 35 - Zuverlässigkeit Test",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.1%20Daten%20und%20Wahrscheinlichkeit.one#08.09.%20%7C%20Wdh.%20AB%2035%20&section-id=f1cd6343-588e-4459-96f7-242a0c4be5e8&page-id=fc1e90d1-4955-4edc-9519-26b68470df0e&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.1%20Daten%20und%20Wahrscheinlichkeit.one%7Cf1cd6343-588e-4459-96f7-242a0c4be5e8%2F08.09.%20%5C%7C%20Wdh.%20AB%2035%20%7Cfc1e90d1-4955-4edc-9519-26b68470df0e%2F%29"
          }
        ],
        "uebungen": [
          {
            "gen": "wk-test",
            "titel": "Zuverlässigkeit von Tests"
          }
        ]
      },
      {
        "id": "unabhaengigkeit",
        "zeilen": [
          "Ich kann erklären, was es für die bedingte Wahrscheinlichkeit bedeutet, wenn zwei Ereignisse stochastisch unabhängig sind ($P_A(B)=P(B)$), und …",
          "… ich kann mit $P(A)\\cdot P(B)=P(A\\cap B)$ rechnerisch prüfen, ob zwei Ereignisse stochastisch unabhängig sind."
        ],
        "buch": "S. 24 bis 25",
        "notizbuch": [
          {
            "titel": "15.09. | Stochastische Unabhängigkeit",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.1%20Daten%20und%20Wahrscheinlichkeit.one#15.09.%20%7C%20Stochastische%20Unabh%C3%A4ngigkeit&section-id=f1cd6343-588e-4459-96f7-242a0c4be5e8&page-id=4ca24146-7a24-48c2-9f17-bbdc7a9c854c&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.1%20Daten%20und%20Wahrscheinlichkeit.one%7Cf1cd6343-588e-4459-96f7-242a0c4be5e8%2F15.09.%20%5C%7C%20Stochastische%20Unabh%C3%A4ngigkeit%7C4ca24146-7a24-48c2-9f17-bbdc7a9c854c%2F%29"
          },
          {
            "titel": "| Vorläufige Definition",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.1%20Daten%20und%20Wahrscheinlichkeit.one#%7C%20Vorl%C3%A4ufige%20Definition&section-id=f1cd6343-588e-4459-96f7-242a0c4be5e8&page-id=12def1e2-b48d-469f-963c-0375e90a1b0f&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.1%20Daten%20und%20Wahrscheinlichkeit.one%7Cf1cd6343-588e-4459-96f7-242a0c4be5e8%2F%5C%7C%20Vorl%C3%A4ufige%20Definition%7C12def1e2-b48d-469f-963c-0375e90a1b0f%2F%29"
          },
          {
            "titel": "| AB 03 - Stochastische Unabhängigkeit",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.1%20Daten%20und%20Wahrscheinlichkeit.one#%7C%20AB%2003%20-%20Stochastische%20Unabh%C3%A4ngigkeit&section-id=f1cd6343-588e-4459-96f7-242a0c4be5e8&page-id=d974250b-f901-4188-bdc6-e84f26769cdc&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.1%20Daten%20und%20Wahrscheinlichkeit.one%7Cf1cd6343-588e-4459-96f7-242a0c4be5e8%2F%5C%7C%20AB%2003%20-%20Stochastische%20Unabh%C3%A4ngigkeit%7Cd974250b-f901-4188-bdc6-e84f26769cdc%2F%29"
          }
        ],
        "uebungen": [
          {
            "gen": "wk-unabh-bedeutung",
            "titel": "Was bedeutet Unabhängigkeit?"
          },
          {
            "gen": "wk-unabh-pruefen",
            "titel": "Unabhängigkeit rechnerisch prüfen"
          }
        ]
      },
      {
        "id": "scheitelform",
        "zeilen": [
          "Ich kann beschreiben, wie der Streckfaktor $a$ die Form einer Parabel verändert.",
          "Ich kann aus der Scheitelform $f(x)=a\\cdot(x-d)^2+e$ den Scheitelpunkt ablesen und die Lage der Parabel beschreiben.",
          "Ich kann Graphen und Funktionsgleichungen einander zuordnen."
        ],
        "notizbuch": [
          {
            "titel": "22.09. | AB 04 - Wdh. quadratische Funktionen",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.2%20Quadratische%20Gleichungen.one#22.09.%20%7C%20AB%2004%20-%20Wdh.&section-id=cfcabd96-8dcc-44bc-8f8d-4486dbada660&page-id=9f6110e4-a1d7-444c-b0d6-8e11e1fee6cc&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.2%20Quadratische%20Gleichungen.one%7Ccfcabd96-8dcc-44bc-8f8d-4486dbada660%2F22.09.%20%5C%7C%20AB%2004%20-%20Wdh.%7C9f6110e4-a1d7-444c-b0d6-8e11e1fee6cc%2F%29"
          }
        ],
        "uebungen": [
          {
            "gen": "qf-streckfaktor",
            "titel": "Streckfaktor und Form der Parabel"
          },
          {
            "gen": "qf-scheitelpunkt",
            "titel": "Scheitelpunkt aus der Scheitelform ablesen"
          },
          {
            "gen": "qf-graph-zuordnen",
            "titel": "Graph und Gleichung zuordnen"
          }
        ],
        "realmath": [
          {
            "gruppe": null,
            "links": [
              {
                "titel": "Parameter a erkunden",
                "url": "https://realmath.de/Neues/Klasse9/Parabel/parabel.php"
              },
              {
                "titel": "Scheitelform",
                "url": "https://realmath.de/Neues/Klasse9/Parabel/scheitelform.php"
              },
              {
                "titel": "Scheitel ablesen (Profi)",
                "url": "https://realmath.de/Neues/Klasse9/parabueb/parabscheit3.php"
              },
              {
                "titel": "Gleichung auswählen 1",
                "url": "https://realmath.de/Neues/Klasse9/parabueb/parabelquiz.php"
              },
              {
                "titel": "Gleichung auswählen 2",
                "url": "https://realmath.de/Neues/Klasse9/parabueb/parabelquiz2.php"
              },
              {
                "titel": "Gleichung ablesen",
                "url": "https://realmath.de/Neues/Klasse9/parabueb/parabelablesen.php"
              }
            ]
          }
        ]
      },
      {
        "id": "punkte",
        "zeilen": [
          "Ich kenne die charakteristischen Punkte einer Parabel und …",
          "… ich kann für jeden Punkt einen Ansatz ohne CAS und einen Ansatz mit CAS angeben.",
          "Ich kann ohne CAS den Schnittpunkt mit der y-Achse und den y-Wert zu einem gegebenen x-Wert berechnen."
        ],
        "notizbuch": [
          {
            "titel": "30.09. | AB 06 - Ansatz Charakteristische Punkte",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.2%20Quadratische%20Gleichungen.one#30.09.%20%7C%20AB%2006%20-%20Ansatz%20Charakteristische%20&section-id=cfcabd96-8dcc-44bc-8f8d-4486dbada660&page-id=e798cf8e-1ca3-438f-9d46-1898d4df151c&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.2%20Quadratische%20Gleichungen.one%7Ccfcabd96-8dcc-44bc-8f8d-4486dbada660%2F30.09.%20%5C%7C%20AB%2006%20-%20Ansatz%20Charakteristische%20%7Ce798cf8e-1ca3-438f-9d46-1898d4df151c%2F%29"
          },
          {
            "titel": "13.10. | AB 07 - Nullstellen einfacher Funktionen",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.2%20Quadratische%20Gleichungen.one#13.10.%20%7C%20AB%2007%20-%20Nullstellen%20einfacher%20&section-id=cfcabd96-8dcc-44bc-8f8d-4486dbada660&page-id=1ff59b72-f7b2-4fcc-9ea3-02ed195c1365&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.2%20Quadratische%20Gleichungen.one%7Ccfcabd96-8dcc-44bc-8f8d-4486dbada660%2F13.10.%20%5C%7C%20AB%2007%20-%20Nullstellen%20einfacher%20%7C1ff59b72-f7b2-4fcc-9ea3-02ed195c1365%2F%29"
          }
        ],
        "uebungen": [
          {
            "gen": "qf-ansatz",
            "titel": "Welcher Ansatz, welcher Befehl?"
          },
          {
            "gen": "qf-funktionswert",
            "titel": "Funktionswerte ohne CAS berechnen"
          }
        ],
        "realmath": [
          {
            "gruppe": null,
            "links": [
              {
                "titel": "Liegt Q auf der Parabel?",
                "url": "https://realmath.de/Neues/Klasse9/parabueb/liegtqaufp.php"
              },
              {
                "titel": "Punktkoordinaten berechnen",
                "url": "https://realmath.de/Neues/Klasse9/parabueb/koordrechnen.php"
              }
            ]
          }
        ]
      },
      {
        "id": "cas",
        "zeilen": [
          "Ich kann mit $\\texttt{solve}$ und $\\texttt{completeSquare}$ charakteristische Punkte und Punkte einer Parabel bestimmen und damit Fragen in Anwendungsaufgaben beantworten (Höhe, Weite, Scheitelpunkt)."
        ],
        "notizbuch": [
          {
            "titel": "29.09. | AB 05 - Charakteristische Punkte von Parabeln",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.2%20Quadratische%20Gleichungen.one#29.09.%20%7C%20AB%2005%20-%20Charakteristische%20Punkte%20&section-id=cfcabd96-8dcc-44bc-8f8d-4486dbada660&page-id=3b59ac31-52c5-45ca-a945-80ab4e51c5f5&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.2%20Quadratische%20Gleichungen.one%7Ccfcabd96-8dcc-44bc-8f8d-4486dbada660%2F29.09.%20%5C%7C%20AB%2005%20-%20Charakteristische%20Punkte%20%7C3b59ac31-52c5-45ca-a945-80ab4e51c5f5%2F%29"
          }
        ],
        "uebungen": [
          {
            "gen": "qf-cas-anwendung",
            "titel": "Anwendungsaufgaben mit der CAS-App"
          }
        ],
        "realmath": [
          {
            "gruppe": null,
            "links": [
              {
                "titel": "Basketballwurf",
                "url": "https://realmath.de/Neues/Klasse9/parabueb/basketball.php"
              }
            ]
          }
        ]
      },
      {
        "id": "reinquadratisch",
        "zeilen": [
          "Ich kann Nullstellen von $f(x)=a\\cdot x^2+c$ über eine reinquadratische Gleichung berechnen und die Lösungsmenge angeben."
        ],
        "notizbuch": [
          {
            "titel": "13.10. | AB 07 - Nullstellen einfacher Funktionen",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.2%20Quadratische%20Gleichungen.one#13.10.%20%7C%20AB%2007%20-%20Nullstellen%20einfacher%20&section-id=cfcabd96-8dcc-44bc-8f8d-4486dbada660&page-id=1ff59b72-f7b2-4fcc-9ea3-02ed195c1365&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.2%20Quadratische%20Gleichungen.one%7Ccfcabd96-8dcc-44bc-8f8d-4486dbada660%2F13.10.%20%5C%7C%20AB%2007%20-%20Nullstellen%20einfacher%20%7C1ff59b72-f7b2-4fcc-9ea3-02ed195c1365%2F%29"
          },
          {
            "titel": "03.11. | Nullstellen quadratischer Funktionen",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.2%20Quadratische%20Gleichungen.one#03.11.%20%7C%20Nullstellen%20quadratischer%20Funktionen&section-id=cfcabd96-8dcc-44bc-8f8d-4486dbada660&page-id=b8366990-f12a-4c17-8696-acffc45f5535&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.2%20Quadratische%20Gleichungen.one%7Ccfcabd96-8dcc-44bc-8f8d-4486dbada660%2F03.11.%20%5C%7C%20Nullstellen%20quadratischer%20Funktionen%7Cb8366990-f12a-4c17-8696-acffc45f5535%2F%29"
          },
          {
            "titel": "Kl. 9: 23.03. | AB 26 - Reinquadratische Gleichungen lösen",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.2%20Quadratische%20Gleichungen.one#23.03.%20%7C%20AB%2026%20-%20Reinquadratische%20Gleichungen%20&section-id=cfcabd96-8dcc-44bc-8f8d-4486dbada660&page-id=e04a3af6-7240-d943-919b-d7bcd8fc6901&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.2%20Quadratische%20Gleichungen.one%7Ccfcabd96-8dcc-44bc-8f8d-4486dbada660%2F23.03.%20%5C%7C%20AB%2026%20-%20Reinquadratische%20Gleichungen%20%7Ce04a3af6-7240-d943-919b-d7bcd8fc6901%2F%29"
          }
        ],
        "uebungen": [
          {
            "gen": "qf-reinquadratisch",
            "titel": "Nullstellen von f(x) = a·x² + c"
          }
        ],
        "realmath": [
          {
            "gruppe": null,
            "links": [
              {
                "titel": "Reinquadratische Gleichungen",
                "url": "https://realmath.de/Neues/Klasse9/quadgleich/quagleich01.php"
              }
            ]
          }
        ]
      },
      {
        "id": "nullprodukt",
        "zeilen": [
          "Ich kenne den Satz vom Nullprodukt und …",
          "… ich kann Nullstellen von $f(x)=a\\cdot x^2+b\\cdot x$ durch Ausklammern berechnen."
        ],
        "notizbuch": [
          {
            "titel": "03.11. | Nullstellen quadratischer Funktionen",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.2%20Quadratische%20Gleichungen.one#03.11.%20%7C%20Nullstellen%20quadratischer%20Funktionen&section-id=cfcabd96-8dcc-44bc-8f8d-4486dbada660&page-id=b8366990-f12a-4c17-8696-acffc45f5535&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.2%20Quadratische%20Gleichungen.one%7Ccfcabd96-8dcc-44bc-8f8d-4486dbada660%2F03.11.%20%5C%7C%20Nullstellen%20quadratischer%20Funktionen%7Cb8366990-f12a-4c17-8696-acffc45f5535%2F%29"
          },
          {
            "titel": "| Satz vom Nullprodukt",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.2%20Quadratische%20Gleichungen.one#%7C%20Satz%20vom%20Nullprodukt&section-id=cfcabd96-8dcc-44bc-8f8d-4486dbada660&page-id=7efecdd0-2d58-432d-ae40-088645c18c8f&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.2%20Quadratische%20Gleichungen.one%7Ccfcabd96-8dcc-44bc-8f8d-4486dbada660%2F%5C%7C%20Satz%20vom%20Nullprodukt%7C7efecdd0-2d58-432d-ae40-088645c18c8f%2F%29"
          },
          {
            "titel": "| AB 08 - Satz vom Nullprodukt",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.2%20Quadratische%20Gleichungen.one#%7C%20AB%2008%20-%20Satz%20vom%20Nullprodukt&section-id=cfcabd96-8dcc-44bc-8f8d-4486dbada660&page-id=a693bb49-3a21-448e-830b-f6bc94549a07&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.2%20Quadratische%20Gleichungen.one%7Ccfcabd96-8dcc-44bc-8f8d-4486dbada660%2F%5C%7C%20AB%2008%20-%20Satz%20vom%20Nullprodukt%7Ca693bb49-3a21-448e-830b-f6bc94549a07%2F%29"
          },
          {
            "titel": "| AB 09 - Nullstellen Typ ax^2+bx",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch/_Inhaltsbibliothek/10.2%20Quadratische%20Gleichungen.one#%7C%20AB%2009%20-%20Nullstellen%20Typ%20ax%5E2%2B&section-id=cfcabd96-8dcc-44bc-8f8d-4486dbada660&page-id=5f8336e9-804d-e240-bd73-95eb7e55a514&end",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_10c_M_Uhl/SiteAssets/2026_27_10c_M_Uhl-Notizbuch?wd=target%28_Inhaltsbibliothek%2F10.2%20Quadratische%20Gleichungen.one%7Ccfcabd96-8dcc-44bc-8f8d-4486dbada660%2F%5C%7C%20AB%2009%20-%20Nullstellen%20Typ%20ax%5E2%2B%7C5f8336e9-804d-e240-bd73-95eb7e55a514%2F%29"
          }
        ],
        "uebungen": [
          {
            "gen": "qf-nullprodukt",
            "titel": "Satz vom Nullprodukt anwenden"
          },
          {
            "gen": "qf-ausklammern",
            "titel": "Nullstellen von f(x) = a·x² + b·x"
          },
          {
            "gen": "qf-nullstellen-gemischt",
            "titel": "Gemischt: Welches Verfahren passt?"
          }
        ]
      }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
