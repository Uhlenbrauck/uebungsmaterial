/*
 * Thema: Rationale Zahlen (Klasse 7) – Vorbereitung auf die Klassenarbeit Nr. 1
 *
 * Eine Kompetenz = eine Gruppe der Checkliste (Zeilen, die auf dem Kompetenzbogen
 * gemeinsame Felder „Informationen“ und „Üben“ haben).
 *   zeilen          Zeilen genau wie auf dem Kompetenzbogen, jede mit eigener Selbsteinschätzung
 *   buch            Seiten im Schulbuch
 *   notizbuch       Seiten im Klassennotizbuch (OneNote-App und Webansicht); nur mit Schul-Konto erreichbar.
 *                   Gehören zum Kurs Ma 7a 2026/27 und müssen für einen neuen Kurs ersetzt werden.
 *   uebungen        Übungen dieser Seite (gen = Generator aus assets/js/generatoren/rationale-zahlen.js)
 *   realmath        Übungen auf realmath.de, gruppiert wie auf dem Kompetenzbogen
 *   notizbuchUeben  Übungsseiten im Notizbuch
 *   zusatz          true = steht nicht auf dem Kompetenzbogen
 * Diese Datei wurde aus dem Kompetenzbogen „K_01 - Kompetenzen Klassenarbeit 1“ übernommen.
 */
(function (global) {
  'use strict';
  global.UM.thema = {
    id: 'mathematik-7-rationale-zahlen',
    fach: 'Mathematik',
    stufe: 'Klasse 7',
    titel: 'Rechnen mit rationalen Zahlen',
    untertitel: 'Vorbereitung auf die Klassenarbeit Nr. 1',
    kurs: 'Ma 7a 2026/27',
    test: { anzahlProKompetenz: 1, stufen: [2, 2, 3] },
    kompetenzen: [
      {
        "id": "zahlenmengen",
        "zeilen": [
          "Ich kenne die Symbole und die Namen der Zahlenmengen und …",
          "… ich kann entscheiden, zu welchen Zahlenmengen eine Zahl gehört."
        ],
        "notizbuch": [
          {
            "titel": "04.09. | Zahlenmengen Q, N, Z",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/SiteAssets/2026_27_7a_M_Uhl-Notizbuch/_Inhaltsbibliothek/7.1%20Rationale%20Zahlen.one",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/_layouts/Doc.aspx?sourcedoc=%7b7543C0CD-D124-434A-B56F-360EEF25627B%7d&wd=target%28_Inhaltsbibliothek%2F7.1%20Rationale%20Zahlen.one%7CBCE4631D-C09F-4CBE-BFDC-4EF4852EDEA0%2F04.09.%20%5C%7C%20Zahlenmengen%20Q%2C%20N%2C%20Z%7CAF481CC4-8836-2B4B-9375-7489143BE5AF%2F%29&wdpartid=%7bEE3400A5-2AD5-F908-1D9C-B26C3CF9EA91%7d%7b1%7d&wdsectionfileid=%7bE5099CE2-696A-438D-9244-3ADFE6610E7C%7d&end"
          }
        ],
        "uebungen": [
          {
            "gen": "rz-mengen",
            "titel": "Zahlen den Zahlenmengen ℕ, ℤ und ℚ zuordnen"
          },
          {
            "gen": "rz-kontext",
            "titel": "Welcher Zahlenbereich passt zur Situation?"
          }
        ]
      },
      {
        "id": "zahlenstrahl",
        "zeilen": [
          "Ich kann rationale Zahlen am Zahlenstrahl einzeichnen."
        ],
        "notizbuch": [
          {
            "titel": "Einführung rationale Zahlen",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/SiteAssets/2026_27_7a_M_Uhl-Notizbuch/_Inhaltsbibliothek/7.1%20Rationale%20Zahlen.one",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/_layouts/Doc.aspx?sourcedoc=%7b7543C0CD-D124-434A-B56F-360EEF25627B%7d&wd=target%28_Inhaltsbibliothek%2F7.1%20Rationale%20Zahlen.one%7CBCE4631D-C09F-4CBE-BFDC-4EF4852EDEA0%2F%5C%7C%20Einf%C3%BChrung%20rationale%20Zahlen%7C5C81DD5B-756C-F345-88B5-91F086C4D87D%2F%29&wdpartid=%7bB0FA15E9-7800-8F0E-0AFA-FD60A5EC26F4%7d%7b1%7d&wdsectionfileid=%7bE5099CE2-696A-438D-9244-3ADFE6610E7C%7d&end"
          }
        ],
        "uebungen": [
          {
            "gen": "rz-strahl-setzen",
            "titel": "Zahlen am Zahlenstrahl einzeichnen"
          },
          {
            "gen": "rz-strahl-ablesen",
            "titel": "Zahlen am Zahlenstrahl ablesen"
          },
          {
            "gen": "rz-mitte",
            "titel": "Die Zahl in der Mitte finden"
          },
          {
            "gen": "rz-vergleich",
            "titel": "Zahlen vergleichen: <, > oder ="
          }
        ],
        "realmath": [
          {
            "gruppe": "Zahlen ablesen",
            "links": [
              {
                "titel": "Profi",
                "url": "https://realmath.de/Neues/Klasse7/rationalezahlen/ratzahllesen.php"
              },
              {
                "titel": "TopProfi",
                "url": "https://realmath.de/Neues/Klasse7/rationalezahlen/rationalezahlen22.php"
              },
              {
                "titel": "TopProfi 2",
                "url": "https://realmath.de/Neues/Klasse7/rationalezahlen/rationalezahlen20.php"
              }
            ]
          },
          {
            "gruppe": "Zahlen anordnen",
            "links": [
              {
                "titel": "Profi",
                "url": "https://realmath.de/Neues/Klasse7/rationalezahlen/rationalezahlen-neu.php"
              },
              {
                "titel": "TopProfi",
                "url": "https://realmath.de/Neues/Klasse7/rationalezahlen/rationalezahlen11.php"
              }
            ]
          }
        ]
      },
      {
        "id": "gegenzahl-betrag",
        "zeilen": [
          "Ich weiß, wie man die Gegenzahl zu einer Zahl findet.",
          "Ich weiß, wie man den Betrag einer Zahl bestimmt."
        ],
        "buch": "S. 8 bis 15",
        "notizbuch": [
          {
            "titel": "10.09. | Gegenzahl einer Zahl",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/SiteAssets/2026_27_7a_M_Uhl-Notizbuch/_Inhaltsbibliothek/7.1%20Rationale%20Zahlen.one",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/_layouts/Doc.aspx?sourcedoc=%7b7543C0CD-D124-434A-B56F-360EEF25627B%7d&wd=target%28_Inhaltsbibliothek%2F7.1%20Rationale%20Zahlen.one%7CBCE4631D-C09F-4CBE-BFDC-4EF4852EDEA0%2F10.09.%20%5C%7C%20Gegenzahl%20einer%20Zahl%7C71746B8B-D544-4D87-B784-B6BCD6AE6455%2F%29&wdpartid=%7b7AC461CD-6B6F-4817-B389-676BF517799B%7d%7b1%7d&wdsectionfileid=%7bE5099CE2-696A-438D-9244-3ADFE6610E7C%7d&end"
          },
          {
            "titel": "10.09. | Betrag einer Zahl",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/SiteAssets/2026_27_7a_M_Uhl-Notizbuch/_Inhaltsbibliothek/7.1%20Rationale%20Zahlen.one",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/_layouts/Doc.aspx?sourcedoc=%7b7543C0CD-D124-434A-B56F-360EEF25627B%7d&wd=target%28_Inhaltsbibliothek%2F7.1%20Rationale%20Zahlen.one%7CBCE4631D-C09F-4CBE-BFDC-4EF4852EDEA0%2F10.09.%20%5C%7C%20Betrag%20einer%20Zahl%7C67A5C531-BB47-42E2-9D74-320557ED20A3%2F%29&wdpartid=%7bCE20B66A-EA5C-4B0C-A9CA-EE800CFC689B%7d%7b1%7d&wdsectionfileid=%7bE5099CE2-696A-438D-9244-3ADFE6610E7C%7d&end"
          }
        ],
        "uebungen": [
          {
            "gen": "rz-gegenzahl-betrag",
            "titel": "Gegenzahl und Betrag"
          }
        ],
        "realmath": [
          {
            "gruppe": null,
            "links": [
              {
                "titel": "Gegenzahl",
                "url": "https://realmath.de/Neues/Klasse6/gegenzahl/gegenzahl.php"
              },
              {
                "titel": "Betrag",
                "url": "https://realmath.de/Neues/Klasse6/gegenzahl/absoluterbetrag.php"
              }
            ]
          }
        ]
      },
      {
        "id": "addieren-subtrahieren",
        "zeilen": [
          "Ich kann ganze Zahlen addieren und subtrahieren und die Rechnungen mit Guthaben und Schulden erklären.",
          "Ich kann Additionen und Subtraktionen von rationalen Zahlen ohne Klammern schreiben und …",
          "… ich kann rationale Zahlen addieren und subtrahieren, indem ich eine Nebenrechnung nutze."
        ],
        "buch": "S. 16 bis 25",
        "notizbuch": [
          {
            "titel": "17.09. | AB 01 - Guthaben und Schulden",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/SiteAssets/2026_27_7a_M_Uhl-Notizbuch/_Inhaltsbibliothek/7.1%20Rationale%20Zahlen.one",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/_layouts/Doc.aspx?sourcedoc=%7b7543C0CD-D124-434A-B56F-360EEF25627B%7d&wd=target%28_Inhaltsbibliothek%2F7.1%20Rationale%20Zahlen.one%7CBCE4631D-C09F-4CBE-BFDC-4EF4852EDEA0%2F17.09.%20%5C%7C%20AB%2001%20-%20Guthaben%20und%20Schulden%7C87E912E5-3378-E749-927D-059A5F74BB9F%2F%29&wdpartid=%7b71F978B9-7728-060A-01E9-5070158B901A%7d%7b1%7d&wdsectionfileid=%7bE5099CE2-696A-438D-9244-3ADFE6610E7C%7d&end"
          },
          {
            "titel": "18.02. | AB 02 - Addieren und Subtrahieren in Z",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/SiteAssets/2026_27_7a_M_Uhl-Notizbuch/_Inhaltsbibliothek/7.1%20Rationale%20Zahlen.one",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/_layouts/Doc.aspx?sourcedoc=%7b7543C0CD-D124-434A-B56F-360EEF25627B%7d&wd=target%28_Inhaltsbibliothek%2F7.1%20Rationale%20Zahlen.one%7CBCE4631D-C09F-4CBE-BFDC-4EF4852EDEA0%2F18.02.%20%5C%7C%20AB%2002%20-%20Addieren%20und%20Subtrahieren%20in%7C786ED6BC-035B-F942-B0BA-85F4FEDE8378%2F%29&wdpartid=%7b7F8FB9FF-C1A2-530B-025F-ED39CD1ABC24%7d%7b1%7d&wdsectionfileid=%7bE5099CE2-696A-438D-9244-3ADFE6610E7C%7d&end"
          },
          {
            "titel": "Übung Pfeilbild und Nebenrechnung",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/SiteAssets/2026_27_7a_M_Uhl-Notizbuch/_Inhaltsbibliothek/7.1%20Rationale%20Zahlen.one",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/_layouts/Doc.aspx?sourcedoc=%7b7543C0CD-D124-434A-B56F-360EEF25627B%7d&wd=target%28_Inhaltsbibliothek%2F7.1%20Rationale%20Zahlen.one%7CBCE4631D-C09F-4CBE-BFDC-4EF4852EDEA0%2F%5C%7C%20%C3%9Cbung%20Pfeilbild%20und%20Nebenrechnung%7CB5FECFB0-DAAD-CE43-8DC6-2EBAE3648D13%2F%29&wdpartid=%7b500A3441-77B5-5A0C-36EA-9FD9AD040C53%7d%7b1%7d&wdsectionfileid=%7bE5099CE2-696A-438D-9244-3ADFE6610E7C%7d&end"
          }
        ],
        "uebungen": [
          {
            "gen": "rz-nebenrechnung",
            "titel": "Vorzeichen, Nebenrechnung, Ergebnis"
          },
          {
            "gen": "rz-sachaufgabe",
            "titel": "Temperaturen, Kontostände und Höhen"
          },
          {
            "gen": "rz-klammerfrei",
            "titel": "Ohne Klammern schreiben und berechnen"
          },
          {
            "gen": "rz-fehler",
            "titel": "Finde den Fehler!"
          }
        ],
        "realmath": [
          {
            "gruppe": "Tabellen vervollständigen",
            "links": [
              {
                "titel": "Tabelle Level 1",
                "url": "https://realmath.de/Neues/Klasse6/negativezahlen/ganzaddtab.php"
              },
              {
                "titel": "Tabelle Profi 1",
                "url": "https://realmath.de/Neues/Klasse6/negativezahlen/addivartab.php"
              },
              {
                "titel": "Tabelle Profi 2",
                "url": "https://realmath.de/Neues/Klasse6/negativezahlen/addivartab2.php"
              }
            ]
          },
          {
            "gruppe": "Tabellen vervollständigen",
            "links": [
              {
                "titel": "Tabelle Level 1",
                "url": "https://realmath.de/Neues/Klasse6/negativezahlen/ganzsubtab.php"
              }
            ]
          },
          {
            "gruppe": "Tabellen-Aufgaben",
            "links": [
              {
                "titel": "Tabellenwerte Level 1",
                "url": "https://realmath.de/Neues/Klasse6/ganzzahl/tabelleneu01.php"
              },
              {
                "titel": "Tabellenwerte Profi",
                "url": "https://realmath.de/Neues/Klasse6/ganzzahl/tabelleneu.php"
              }
            ]
          },
          {
            "gruppe": "Vereinfachte Schreibweise - anschaulich",
            "links": [
              {
                "titel": "mit drei Zahlen",
                "url": "https://realmath.de/Neues/Klasse6/addundsubganz/schreibweise.php"
              },
              {
                "titel": "mit vier Zahlen",
                "url": "https://realmath.de/Neues/Klasse6/addundsubganz/schreibweise2.php"
              }
            ]
          },
          {
            "gruppe": "Aufgaben mit Klammern",
            "links": [
              {
                "titel": "... mit einer Klammer",
                "url": "https://realmath.de/Neues/Klasse6/ganzzahl/berechneinz.php"
              },
              {
                "titel": "... mit zwei Klammern",
                "url": "https://realmath.de/Neues/Klasse6/ganzzahl/berechneinz2.php"
              }
            ]
          }
        ]
      },
      {
        "id": "multiplizieren-dividieren",
        "zeilen": [
          "Ich kann bei Multiplikation und Division von rationalen Zahlen entscheiden, welches Vorzeichen das Ergebnis hat und …",
          "… ich kann rationale Zahlen (also auch Dezimalzahlen und Brüche) multiplizieren und dividieren."
        ],
        "buch": "S. 26 bis 30",
        "notizbuch": [
          {
            "titel": "01.10. | AB 03 - Kontomodell Multiplikation rationaler Zahlen",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/SiteAssets/2026_27_7a_M_Uhl-Notizbuch/_Inhaltsbibliothek/7.1%20Rationale%20Zahlen.one",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/_layouts/Doc.aspx?sourcedoc=%7b7543C0CD-D124-434A-B56F-360EEF25627B%7d&wd=target%28_Inhaltsbibliothek%2F7.1%20Rationale%20Zahlen.one%7CBCE4631D-C09F-4CBE-BFDC-4EF4852EDEA0%2F01.10.%20%5C%7C%20AB%2003%20-%20Kontomodell%20Multiplikation%20rationaler%20Zahlen%7CCE36CD0D-7302-456D-A560-2AE44E8EE452%2F%29&wdpartid=%7b71F15562-4BE1-429E-A6F2-8FD15E05CC6E%7d%7b1%7d&wdsectionfileid=%7bE5099CE2-696A-438D-9244-3ADFE6610E7C%7d&end"
          },
          {
            "titel": "01.10. | AB 04 - Kontomodell Multiplikation rationaler Zahlen 2",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/SiteAssets/2026_27_7a_M_Uhl-Notizbuch/_Inhaltsbibliothek/7.1%20Rationale%20Zahlen.one",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/_layouts/Doc.aspx?sourcedoc=%7b7543C0CD-D124-434A-B56F-360EEF25627B%7d&wd=target%28_Inhaltsbibliothek%2F7.1%20Rationale%20Zahlen.one%7CBCE4631D-C09F-4CBE-BFDC-4EF4852EDEA0%2F01.10.%20%5C%7C%20AB%2004%20-%20Kontomodell%20Multiplikation%20rationaler%20Zahlen%7CEB4EE10D-1CFA-402F-8491-21633A80D546%2F%29&wdpartid=%7bC86DD104-9681-43C8-92CE-D545AE0DD19B%7d%7b1%7d&wdsectionfileid=%7bE5099CE2-696A-438D-9244-3ADFE6610E7C%7d&end"
          }
        ],
        "uebungen": [
          {
            "gen": "rz-vorzeichen",
            "titel": "Welches Vorzeichen hat das Ergebnis?"
          },
          {
            "gen": "rz-multdiv",
            "titel": "Multiplizieren und dividieren"
          },
          {
            "gen": "rz-kontomodell",
            "titel": "Kontomodell: Geld einzahlen und abheben"
          }
        ],
        "realmath": [
          {
            "gruppe": null,
            "links": [
              {
                "titel": "Zwei Zahlen multiplizieren 2",
                "url": "https://realmath.de/Neues/Klasse7/multganz/multganz.php"
              }
            ]
          },
          {
            "gruppe": "Zahlenmauern",
            "links": [
              {
                "titel": "Zahlenmauer Level 3",
                "url": "https://realmath.de/Neues/Klasse7/ganzzahl/zahlenmauermult3.php"
              },
              {
                "titel": "Zahlenmauer Level 4",
                "url": "https://realmath.de/Neues/Klasse7/ganzzahl/zahlenmauermult4.php"
              },
              {
                "titel": "Zahlenmauer Profi",
                "url": "https://realmath.de/Neues/Klasse7/ganzzahl/zahlenmauermult5.php"
              },
              {
                "titel": "Zwei Zahlen dividieren 1",
                "url": "https://realmath.de/Neues/Klasse7/divganz/divganzahl.php"
              },
              {
                "titel": "Zwei Zahlen dividieren 2",
                "url": "https://realmath.de/Neues/Klasse7/divganz/divganz.php"
              }
            ]
          }
        ],
        "notizbuchUeben": [
        {
          "titel": "Realmath Multiplizieren und Dividieren",
          "onenote": "onenote:https://fbgschwerte-my.sharepoint.com/personal/kai_uhlenbrauck_fbg_schwerte_de/Documents/OneNote%20Notizbücher/Mathematik%2007/_2026-27/07a/7.1%20Rationale%20Zahlen.one#|%20Realmath%20Multiplizieren%20und%20Dividieren&section-id={634FEB4B-5C10-45DE-9DD6-5CDC01FB3FC2}&page-id={F054C378-D4BD-8742-BDAC-3CD0D3DE04E9}&end",
          "web": "https://fbgschwerte-my.sharepoint.com/personal/kai_uhlenbrauck_fbg_schwerte_de/_layouts/Doc.aspx?sourcedoc={4CD9181F-4FBC-447F-A857-0D4FA29C5332}&wd=target%28_2026-27%2F07a%2F7.1%20Rationale%20Zahlen.one%7C634FEB4B-5C10-45DE-9DD6-5CDC01FB3FC2%2F%5C%7C%20Realmath%20Multiplizieren%20und%20Dividieren%7CF054C378-D4BD-8742-BDAC-3CD0D3DE04E9%2F%29&wdpartid={E55D0379-FA1E-C00D-0578-1801EF49C6D2}{1}&wdsectionfileid={AA399844-3520-4FF6-A98C-B9795DB86DE0}&end"
        }
      ]
      },
      {
        "id": "rechengesetze",
        "zeilen": [
          "Ich kenne die Minusklammerregel, Assoziativ-, Kommutativ- und Distributivgesetz und …",
          "… ich kann diese Regeln nutzen, um Rechenvorteile beim Berechnen von Termen zu haben.",
          "Insbesondere kann ich das Distributivgesetz benutzen, um auszuklammern oder auszumultiplizieren."
        ],
        "buch": "S. 31 bis 41",
        "notizbuch": [
          {
            "titel": "08.10. | Rechenvorteile - Rechengesetze nutzen",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/SiteAssets/2026_27_7a_M_Uhl-Notizbuch/_Inhaltsbibliothek/7.1%20Rationale%20Zahlen.one",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/_layouts/Doc.aspx?sourcedoc=%7b7543C0CD-D124-434A-B56F-360EEF25627B%7d&wd=target%28_Inhaltsbibliothek%2F7.1%20Rationale%20Zahlen.one%7CBCE4631D-C09F-4CBE-BFDC-4EF4852EDEA0%2F08.10.%20%20%5C%7C%20Rechenvorteile%20-%20Rechengesetze%20nutzen%7CC61B4351-F172-194D-8EF8-5F844E69FB23%2F%29&wdpartid=%7b8887BF04-C530-900D-300A-62C79CAB9E18%7d%7b1%7d&wdsectionfileid=%7bE5099CE2-696A-438D-9244-3ADFE6610E7C%7d&end"
          },
          {
            "titel": "Minusklammerregel",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/SiteAssets/2026_27_7a_M_Uhl-Notizbuch/_Inhaltsbibliothek/7.1%20Rationale%20Zahlen.one",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/_layouts/Doc.aspx?sourcedoc=%7b7543C0CD-D124-434A-B56F-360EEF25627B%7d&wd=target%28_Inhaltsbibliothek%2F7.1%20Rationale%20Zahlen.one%7CBCE4631D-C09F-4CBE-BFDC-4EF4852EDEA0%2F%5C%7C%20Minusklammerregel%7C3509E879-1642-BA4F-843A-09864B11F5C8%2F%29&wdpartid=%7b6D1658AF-1355-A608-1435-6D51421286C8%7d%7b1%7d&wdsectionfileid=%7bE5099CE2-696A-438D-9244-3ADFE6610E7C%7d&end"
          },
          {
            "titel": "Kommutativ- und Assoziativgesetz",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/SiteAssets/2026_27_7a_M_Uhl-Notizbuch/_Inhaltsbibliothek/7.1%20Rationale%20Zahlen.one",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/_layouts/Doc.aspx?sourcedoc=%7b7543C0CD-D124-434A-B56F-360EEF25627B%7d&wd=target%28_Inhaltsbibliothek%2F7.1%20Rationale%20Zahlen.one%7CBCE4631D-C09F-4CBE-BFDC-4EF4852EDEA0%2F%5C%7C%20Kommutativ-%20und%20Assoziativgesetz%7CC9D899BE-0DD1-FA49-8D32-734B0DBEF7DD%2F%29&wdpartid=%7bFDDFD1E3-6152-1504-1B1A-017F01DC2EB6%7d%7b1%7d&wdsectionfileid=%7bE5099CE2-696A-438D-9244-3ADFE6610E7C%7d&end"
          },
          {
            "titel": "Distributivgesetz",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/SiteAssets/2026_27_7a_M_Uhl-Notizbuch/_Inhaltsbibliothek/7.1%20Rationale%20Zahlen.one",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/_layouts/Doc.aspx?sourcedoc=%7b7543C0CD-D124-434A-B56F-360EEF25627B%7d&wd=target%28_Inhaltsbibliothek%2F7.1%20Rationale%20Zahlen.one%7CBCE4631D-C09F-4CBE-BFDC-4EF4852EDEA0%2F%5C%7C%20Distributivgesetz%7C2E0A9CE2-9278-FD48-ADF2-CC1A94E53D7D%2F%29&wdpartid=%7b4630A9BC-D2BB-6807-2F3C-79044646164D%7d%7b1%7d&wdsectionfileid=%7bE5099CE2-696A-438D-9244-3ADFE6610E7C%7d&end"
          }
        ],
        "uebungen": [
          {
            "gen": "rz-minusklammer",
            "titel": "Minusklammerregel"
          },
          {
            "gen": "rz-geschickt",
            "titel": "Geschickt rechnen mit Kommutativ- und Assoziativgesetz"
          },
          {
            "gen": "rz-distributiv",
            "titel": "Distributivgesetz: ausmultiplizieren, ausklammern, zerlegen"
          }
        ]
      },
      {
        "id": "gemischt",
        "zeilen": [
          "Ich kann auch Terme mit Brüchen und Dezimalzahlen gemischt berechnen."
        ],
        "notizbuch": [
          {
            "titel": "Übungen Taschenrechner",
            "onenote": "onenote:https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/SiteAssets/2026_27_7a_M_Uhl-Notizbuch/_Inhaltsbibliothek/7.1%20Rationale%20Zahlen.one",
            "web": "https://fbgschwerte.sharepoint.com/sites/2026_27_7a_M_Uhl/_layouts/Doc.aspx?sourcedoc=%7b7543C0CD-D124-434A-B56F-360EEF25627B%7d&wd=target%28_Inhaltsbibliothek%2F7.1%20Rationale%20Zahlen.one%7CBCE4631D-C09F-4CBE-BFDC-4EF4852EDEA0%2F%5C%7C%20%C3%9Cbungen%20Taschenrechner%7C530B1095-7009-F541-9A23-DFBFC016EEC8%2F%29&wdpartid=%7b8202A748-F282-160F-1621-827FFDBAD829%7d%7b1%7d&wdsectionfileid=%7bE5099CE2-696A-438D-9244-3ADFE6610E7C%7d&end"
          }
        ],
        "uebungen": [
          {
            "gen": "rz-gemischt",
            "titel": "Brüche und Dezimalzahlen gemischt"
          }
        ]
      },
      {
        "id": "begruenden",
        "zusatz": true,
        "zeilen": [
          "Ich kann Aussagen über rationale Zahlen beurteilen und begründen."
        ],
        "uebungen": [
          {
            "gen": "rz-aussagen",
            "titel": "Stimmt die Aussage?"
          }
        ]
      },
    ],
  };
})(typeof window !== 'undefined' ? window : globalThis);
