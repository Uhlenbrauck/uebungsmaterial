/*
 * Thema: Integralrechnung (Q1 Leistungskurs) – Vorbereitung auf eine Klausur
 * Wiederholung am Ende: Wurzelfunktion als Umkehrfunktion, Potenzfunktionen ableiten.
 *
 * Nicht in der Übersicht (katalog.js) verlinkt – die Seite ist nur über den direkten Link erreichbar.
 * Buchseiten: Lambacher Schweizer Q1 LK (Kapitel I.6–7 und II.1–5).
 *
 * AUSNAHME von der Regel „keine Erklärungen“: Für diese Seite ausdrücklich erwünscht (Absprache mit M. Uhlenbrauck).
 * Deshalb hat jede Kompetenz ein Feld „erklaerung“ (wird als aufklappbares „Kurz erklärt“ angezeigt).
 * Ober- und Untersummen kommen laut Absprache nicht dran und fehlen deshalb.
 */
(function (global) {
  'use strict';
  global.UM.thema = {
    "id": "mathematik-q1-lk-integralrechnung",
    "fach": "Mathematik",
    "stufe": "Q1 (Leistungskurs)",
    "titel": "Integralrechnung",
    "untertitel": "Klausurvorbereitung: Rekonstruktion, Integral, Hauptsatz, Stammfunktionen, Flächen – dazu Umkehrfunktion und Potenzfunktionen",
    "arbeit": "Klausur",
    "test": {
      "anzahlProKompetenz": 1,
      "stufen": [2, 2, 3]
    },
    "kompetenzen": [
      {
        "id": "rekonstruktion",
        "buch": "S. 52–55",
        "zeilen": [
          "Ich kann aus dem Graphen einer Änderungsrate (z. B. Durchflussrate, Geschwindigkeit) die Gesamtänderung der Größe bestimmen, indem ich orientierte Flächeninhalte berechne, …",
          "… ich kann angeben, welchem Wert ein Kästchen entspricht, und den Bestand mit dem Anfangsbestand berechnen."
        ],
        "erklaerung": "<p>Der Graph zeigt eine <b>Änderungsrate</b> (z. B. Liter pro Minute), <b>nicht</b> den Bestand. Ein einzelner Wert wie $f(6)=3$ heißt: <i>in diesem Moment</i> kommen 3 Liter pro Minute dazu.</p><p><b>Gesamtänderung</b> = orientierter Flächeninhalt zwischen Graph und Zeitachse: oberhalb positiv (Zunahme), unterhalb negativ (Abnahme).</p><p><b>Ein Kästchen</b> = Breite · Höhe, z. B. $2\\,\\text{min}\\cdot 5\\,\\tfrac{\\text{l}}{\\text{min}}=10\\,\\text{l}$. Dreiecke sind halbe Rechtecke.</p><p><b>Bestand</b> = Anfangsbestand <b>+</b> Gesamtänderung.</p><p class=\"achtung\">Typische Fehler: den Wert der Rate als Bestand lesen; den Anfangsbestand vergessen; Einheiten mischen (m³ und Liter).</p>",
        "uebungen": [
          { "gen": "ir-rekonstruktion", "titel": "Bestand aus dem Graphen der Änderungsrate" }
        ]
      },
      {
        "id": "orientiert",
        "buch": "S. 56–61",
        "zeilen": [
          "Ich kann das Integral $\\int_a^b f(x)\\,dx$ als orientierten Flächeninhalt deuten und für Geraden mit Dreiecks- und Rechtecksflächen berechnen, …",
          "… ich kann Integrale mithilfe gegebener Teilflächen bestimmen (auch bei vertauschten Grenzen) und Integral und Flächeninhalt unterscheiden."
        ],
        "erklaerung": "<p>$\\int_a^b f(x)\\,dx$ ist die Summe der <b>orientierten</b> Flächeninhalte zwischen Graph und x-Achse von $a$ bis $b$: Flächen oberhalb zählen positiv, unterhalb negativ.</p><p>Intervalladditivität: $\\int_a^b f\\,dx+\\int_b^c f\\,dx=\\int_a^c f\\,dx$. Vertauschte Grenzen: $\\int_b^a f\\,dx=-\\int_a^b f\\,dx$.</p><p>Der <b>Flächeninhalt</b> ist nie negativ – dafür werden alle Teilflächen positiv addiert.</p>",
        "uebungen": [
          { "gen": "ir-orientiert", "titel": "Integral als orientierte Fläche" }
        ]
      },
      {
        "id": "stammfunktion",
        "buch": "S. 68–72",
        "zeilen": [
          "Ich kann Stammfunktionen mit Potenz-, Faktor- und Summenregel bilden, …",
          "… auch bei Wurzeln und negativen Exponenten, bei Produkten (ausmultiplizieren) und mit einer Bedingung wie $F(1)=2$."
        ],
        "erklaerung": "<p>$F$ ist eine Stammfunktion von $f$, wenn $F'(x)=f(x)$.</p><p><b>Potenzregel rückwärts:</b> $x^n\\ \\to\\ \\frac{1}{n+1}x^{n+1}$ (für $n\\neq-1$) – Exponent +1, dann durch den <i>neuen</i> Exponenten teilen. Eine Zahl $a$ wird zu $a\\cdot x$. Faktoren bleiben stehen, Summen gliedweise.</p><p>Beispiel: $f(x)=6x^2-4x+3\\ \\Rightarrow\\ F(x)=2x^3-2x^2+3x\\,(+C)$.</p><p>Wurzeln und Brüche zuerst als Potenz schreiben: $\\sqrt{x}=x^{\\frac12}$, $\\frac{3}{x^2}=3x^{-2}$.</p><p>Mit Bedingung: $F(x)=\\ldots+C$ bilden, Bedingung einsetzen, nach $C$ auflösen.</p><p class=\"achtung\">Typische Fehler: abgeleitet statt aufgeleitet; Faktor $\\frac{1}{n+1}$ vergessen. Immer die Probe machen: $F'$ muss $f$ ergeben!</p>",
        "uebungen": [
          { "gen": "ir-stammfunktion", "titel": "Stammfunktionen bilden" }
        ]
      },
      {
        "id": "nachweis",
        "buch": "S. 62–65",
        "zeilen": [
          "Ich kann durch Ableiten prüfen, ob eine Funktion $F$ eine Stammfunktion von $f$ ist, und Parameter so bestimmen, dass $F$ eine Stammfunktion ist."
        ],
        "erklaerung": "<p>Nachweis: $F$ ableiten und mit $f$ vergleichen. Stimmt $F'(x)=f(x)$ für alle $x$, ist $F$ eine Stammfunktion.</p><p>Zwei Stammfunktionen unterscheiden sich nur durch eine Konstante: $G(x)=F(x)+C$. Die Konstante fällt beim Ableiten weg.</p>",
        "uebungen": [
          { "gen": "ir-nachweis", "titel": "Stammfunktion nachweisen" }
        ]
      },
      {
        "id": "hdi",
        "buch": "S. 62–66, 69",
        "zeilen": [
          "Ich kann Integrale mit dem Hauptsatz der Differenzial- und Integralrechnung berechnen und dabei sauber notieren: $\\int_a^b f(x)\\,dx=\\big[F(x)\\big]_a^b=F(b)-F(a)$."
        ],
        "erklaerung": "<p><b>Hauptsatz:</b> $\\int_a^b f(x)\\,dx=F(b)-F(a)$, wobei $F$ eine beliebige Stammfunktion von $f$ ist (die Konstante hebt sich weg, nimm also $C=0$).</p><p><b>So schreibst du es auf:</b></p><p>$\\int_1^3 (3x^2-2x)\\,dx=\\big[x^3-x^2\\big]_1^3=(3^3-3^2)-(1^3-1^2)=18-0=18$</p><p>1. Integral mit $dx$ hinschreiben. 2. Stammfunktion in eckige Klammern, Grenzen dazu. 3. Obere Grenze einsetzen, <b>minus</b> untere Grenze einsetzen – beides in Klammern. 4. Ausrechnen.</p><p class=\"achtung\">Typische Fehler: $dx$ oder Klammern vergessen; negative Zahlen ohne Klammer einsetzen ($(-2)^4=16$, aber $-2^4=-16$); $F(a)$ nicht als Ganzes abziehen.</p><p>Kontrolle mit GeoGebra-CAS: <code>Integral(3x^2-2x, 1, 3)</code></p>",
        "uebungen": [
          { "gen": "ir-hdi", "titel": "Hauptsatz anwenden und notieren" }
        ]
      },
      {
        "id": "flaeche-x",
        "buch": "S. 73–75",
        "zeilen": [
          "Ich kann den Inhalt der Fläche zwischen einem Graphen und der x-Achse berechnen, auch wenn Teile unterhalb der x-Achse liegen."
        ],
        "erklaerung": "<p>1. <b>Nullstellen</b> von $f$ bestimmen (ausklammern, Satz vom Nullprodukt, pq-Formel).</p><p>2. Zwischen benachbarten Nullstellen bzw. Intervallgrenzen <b>einzeln</b> integrieren.</p><p>3. <b>Beträge</b> der Teilintegrale addieren: $A=\\left|\\int_a^s f\\,dx\\right|+\\left|\\int_s^b f\\,dx\\right|$.</p><p class=\"achtung\">Wer einfach von $a$ bis $b$ integriert, zieht Flächen unterhalb der x-Achse ab – das ist dann nicht der Flächeninhalt.</p><p>GeoGebra-CAS: <code>Löse(f(x)=0)</code>, <code>Integral(abs(f(x)), a, b)</code></p>",
        "uebungen": [
          { "gen": "ir-flaeche-x", "titel": "Fläche zwischen Graph und x-Achse" }
        ]
      },
      {
        "id": "flaeche-zwei",
        "buch": "S. 74–77",
        "zeilen": [
          "Ich kann den Inhalt der Fläche zwischen zwei Funktionsgraphen berechnen."
        ],
        "erklaerung": "<p>1. <b>Schnittstellen:</b> $f(x)=g(x)\\Leftrightarrow f(x)-g(x)=0$.</p><p>2. <b>Differenzfunktion</b> $d(x)=f(x)-g(x)$ zwischen benachbarten Schnittstellen integrieren.</p><p>3. Beträge addieren. Liegt $f$ im ganzen Intervall oben, gilt einfach $A=\\int_a^b (f(x)-g(x))\\,dx$.</p><p>Welcher Graph oben liegt, musst du nicht vorher wissen – der Betrag regelt das. Es ist auch egal, ob die Fläche unterhalb der x-Achse liegt.</p>",
        "uebungen": [
          { "gen": "ir-flaeche-zwei", "titel": "Fläche zwischen zwei Graphen" }
        ]
      },
      {
        "id": "sachaufgaben",
        "buch": "S. 57, 60, 69–71",
        "zeilen": [
          "Ich kann Integrale im Sachzusammenhang deuten (mit Einheit), Bestände mit Anfangsbestand berechnen und den Zeitpunkt des größten Bestands bestimmen."
        ],
        "erklaerung": "<p>Ist $f(t)$ eine Änderungsrate, dann ist $\\int_0^T f(t)\\,dt$ die <b>Änderung</b> der Größe von $0$ bis $T$ – Einheit: Rate · Zeit, z. B. $\\tfrac{\\text{m}^3}{\\text{Tag}}\\cdot\\text{Tag}=\\text{m}^3$.</p><p><b>Bestand:</b> $B(T)=B(0)+\\int_0^T f(t)\\,dt$ – plus, nicht mal!</p><p><b>Größte Rate</b> (z. B. stärkster Zufluss): Extremstelle von $f$, also $f'(t)=0$.</p><p><b>Größter Bestand:</b> dort, wo $f$ von + nach − wechselt (Nullstelle von $f$), oder am Rand. Werte vergleichen!</p><p class=\"achtung\">Die Rate ist am größten, wo der Bestand am schnellsten wächst – nicht dort, wo der Bestand am größten ist.</p>",
        "uebungen": [
          { "gen": "ir-sach", "titel": "Sachaufgaben mit Änderungsraten" }
        ]
      },
      {
        "id": "graph-F",
        "buch": "S. 63, 65–66",
        "zeilen": [
          "Ich kann aus dem Graphen von $f$ Eigenschaften einer Stammfunktion $F$ ablesen (Monotonie, Extremstellen) und den Graphen von $F$ skizzieren bzw. zuordnen."
        ],
        "erklaerung": "<p>Weil $F'=f$ gilt, ist $f$ die Steigung von $F$:</p><ul><li>$f>0$ ⇒ $F$ steigt; $f<0$ ⇒ $F$ fällt.</li><li>Nullstelle von $f$ mit Vorzeichenwechsel + → − ⇒ <b>Hochpunkt</b> von $F$; − → + ⇒ <b>Tiefpunkt</b>.</li><li>Extremstelle von $f$ ⇒ <b>Wendestelle</b> von $F$.</li></ul><p>Skizzieren: Extrem- und Wendestellen markieren, dann steigend/fallend passend verbinden. $F$ ist nur bis auf eine Verschiebung in y-Richtung festgelegt.</p>",
        "uebungen": [
          { "gen": "ir-graph-F", "titel": "Graph einer Stammfunktion" }
        ]
      },
      {
        "id": "fehler",
        "zeilen": [
          "Ich erkenne typische Fehler bei Stammfunktionen, beim Hauptsatz, bei Flächen und in Sachaufgaben und kann sie korrigieren."
        ],
        "erklaerung": "<p>Prüfe eine Lösung immer so:</p><ul><li>Stammfunktion: Probe durch Ableiten.</li><li>Hauptsatz: obere Grenze <b>minus</b> untere Grenze, negative Zahlen in Klammern.</li><li>Fläche: Liegt eine Nullstelle im Intervall? Dann teilen und Beträge nehmen.</li><li>Sachaufgabe: Ist nach Änderung oder Bestand gefragt? Anfangsbestand <b>addiert</b>? Einheit?</li></ul>",
        "uebungen": [
          { "gen": "ir-fehler", "titel": "Finde den Fehler" }
        ]
      },
      {
        "id": "umkehrfunktion",
        "buch": "S. 29–32",
        "zeilen": [
          "Wiederholung: Ich kann zur Wurzelfunktion und ihren Verschiebungen/Streckungen Punkte, Definitions- und Wertebereich der Umkehrfunktion und ihre Gleichung angeben."
        ],
        "erklaerung": "<p>Eine Funktion ist <b>umkehrbar</b>, wenn zu jedem $y\\in W_f$ genau ein $x\\in D_f$ gehört (z. B. wenn $f$ streng monoton ist).</p><p>Graph von $\\bar f$: Spiegelung an $y=x$, also Koordinaten tauschen: $P(2\\,|\\,4)\\to\\bar P(4\\,|\\,2)$. Es gilt $D_{\\bar f}=W_f$ und $W_{\\bar f}=D_f$.</p><p>Gleichung: $y=f(x)$ nach $x$ auflösen, dann $x$ und $y$ tauschen. Beispiel: $y=2\\sqrt{x-1}+3\\Rightarrow x=\\left(\\frac{y-3}{2}\\right)^2+1\\Rightarrow\\bar f(x)=\\left(\\frac{x-3}{2}\\right)^2+1$ für $x\\ge 3$.</p>",
        "uebungen": [
          { "gen": "uf-umkehr", "titel": "Wurzelfunktion als Umkehrfunktion" }
        ]
      },
      {
        "id": "potenzfunktionen",
        "buch": "S. 33–37",
        "zeilen": [
          "Wiederholung: Ich kann Potenzfunktionen mit negativen und rationalen Exponenten ableiten und Steigungen bzw. Steigungswinkel berechnen."
        ],
        "erklaerung": "<p>Potenzregel für alle reellen Exponenten: $(x^r)'=r\\cdot x^{r-1}$.</p><p>Umschreiben: $\\frac{1}{x}=x^{-1}\\Rightarrow\\left(\\frac1x\\right)'=-\\frac{1}{x^2}$; $\\ \\sqrt{x}=x^{\\frac12}\\Rightarrow(\\sqrt x)'=\\frac{1}{2\\sqrt x}$; $\\ \\sqrt[3]{x^2}=x^{\\frac23}$.</p><p>Steigungswinkel: $\\tan\\alpha=m=f'(x_0)$, also $\\alpha=\\tan^{-1}(m)$.</p>",
        "uebungen": [
          { "gen": "pf-ableiten", "titel": "Potenzfunktionen ableiten" }
        ]
      }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
