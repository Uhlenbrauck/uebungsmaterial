/*
 * Aufgaben-Generatoren: Daten und Diagramme · Addieren und Subtrahieren (Klasse 5)
 *
 * Format der Aufgaben: siehe generatoren/rationale-zahlen.js.
 * Urlisten und Häufigkeitstabellen werden als HTML, Diagramme als SVG gezeichnet.
 * Werte stehen nicht an den Säulen, weil das Ablesen geübt wird.
 *
 * Die Aufgaben orientieren sich an der Kompetenz-Checkliste,
 * nicht an den Aufgaben der Klassenarbeit.
 */
(function (global) {
  'use strict';
  const UM = (global.UM = global.UM || {});
  const { Bruch, T, term } = UM;
  const R = UM.zufall;
  const gen = (UM.generatoren = UM.generatoren || {});

  const B = (z) => new Bruch(z);
  const $ = (t) => `$${t}$`;
  const ERGEBNIS = 'Ergebnis';
  const GROSS = 'z. B. 72 500';

  /** Zahl mit Dreiergruppen: Text (schmales Leerzeichen) und TeX */
  const zt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const ztex = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
  /** Dreiergruppen in einem TeX-Term (alle Zahlen ab vier Stellen) */
  const gruppiert = (t) => t.replace(/\d{4,}/g, (d) => ztex(Number(d)));
  /** Term → TeX mit Minuszeichen und Gruppen */
  const tx = (k) => gruppiert(term.tex(k));
  const wert = (k) => term.wert(k).z;

  const zFeld = (label, n, extra = {}) => ({ art: 'zahl', label, antwort: B(n), ...extra });
  const auswahl = (label, richtigeOption, falsche) => {
    const optionen = R.mische([richtigeOption, ...falsche.filter((o, i, a) => o !== richtigeOption && a.indexOf(o) === i)]);
    return { art: 'auswahl', label, optionen, richtig: optionen.indexOf(richtigeOption) };
  };

  /** Häufigkeiten zählen */
  function zaehle(liste, kategorien) {
    return kategorien.map((k) => liste.filter((x) => x === k).length);
  }
  /** Urliste, in der jede Kategorie mindestens einmal vorkommt */
  function urliste(kategorien, n, gewichte) {
    for (;;) {
      const liste = [];
      const summe = gewichte.reduce((a, b) => a + b, 0);
      for (let i = 0; i < n; i++) {
        let r = Math.random() * summe;
        let j = 0;
        while (r >= gewichte[j]) { r -= gewichte[j]; j++; }
        liste.push(kategorien[j]);
      }
      if (zaehle(liste, kategorien).every((h) => h > 0)) return liste;
    }
  }
  const urlisteHtml = (titel, liste) =>
    `<div class="k5-urliste"><div class="k5-urliste-titel">${titel}</div><div class="k5-urliste-werte">${liste.map((x) => `<span>${x}</span>`).join(' ')}</div></div>`;
  function tabelleHtml(kopf, zeilen) {
    return `<div class="tabelle-scroll"><table class="k5-tabelle"><thead><tr><th>${kopf[0]}</th><th>${kopf[1]}</th></tr></thead><tbody>${
      zeilen.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody></table></div>`;
  }

  // ---------- Sachzusammenhänge für Urlisten ----------
  const ZAHL_KONTEXTE = [
    { frage: 'Wie viele Haustiere habt ihr zu Hause?', titel: 'Anzahl der Haustiere', kopf: 'Haustiere', kat: [0, 1, 2, 3, 4], gew: [8, 10, 6, 3, 2] },
    { frage: 'Wie viele Geschwister hast du?', titel: 'Anzahl der Geschwister', kopf: 'Geschwister', kat: [0, 1, 2, 3, 4], gew: [6, 12, 8, 4, 2] },
    { frage: 'Wie viele Bücher hast du in den Ferien gelesen?', titel: 'Anzahl der Bücher', kopf: 'Bücher', kat: [0, 1, 2, 3, 4, 5], gew: [3, 6, 8, 6, 3, 2] },
    { frage: 'Wie viele Fernsehgeräte habt ihr zu Hause?', titel: 'Anzahl der Fernsehgeräte', kopf: 'Fernsehgeräte', kat: [0, 1, 2, 3, 4], gew: [2, 12, 14, 6, 2] },
    { frage: 'Wie viele Personen leben in deinem Haushalt?', titel: 'Personen im Haushalt', kopf: 'Personen', kat: [2, 3, 4, 5, 6], gew: [4, 10, 14, 6, 3] },
  ];
  const WORT_KONTEXTE = [
    { frage: 'Was ist dein Lieblingsobst?', titel: 'Lieblingsobst', kopf: 'Obst', kat: ['A', 'B', 'E', 'K', 'M'], namen: { A: 'Apfel', B: 'Banane', E: 'Erdbeere', K: 'Kiwi', M: 'Mango' }, gew: [6, 5, 7, 3, 4] },
    { frage: 'Wie kommst du zur Schule?', titel: 'Schulweg', kopf: 'Verkehrsmittel', kat: ['B', 'F', 'R', 'A', 'Z'], namen: { B: 'Bus', F: 'Fahrrad', R: 'Roller', A: 'Auto', Z: 'zu Fuß' }, gew: [8, 7, 2, 4, 6] },
    { frage: 'Welche Jahreszeit magst du am liebsten?', titel: 'Lieblingsjahreszeit', kopf: 'Jahreszeit', kat: ['F', 'S', 'H', 'W'], namen: { F: 'Frühling', S: 'Sommer', H: 'Herbst', W: 'Winter' }, gew: [5, 9, 4, 4] },
  ];
  const kName = (k, x) => (k.namen ? k.namen[x] : `${k.kopf}: ${x}`);
  /** Kategorie in Tabellen: Wort oder nur die Zahl (Spaltenkopf nennt schon die Größe) */
  const kZelle = (k, x) => (k.namen ? k.namen[x] : String(x));
  const legende = (k) => (k.namen ? ' ' + Object.entries(k.namen).map(([b, n]) => `<b>${b}</b> = ${n}`).join(', ') + '.' : '');

  // =====================================================================
  // 1 Urliste → Häufigkeitstabelle
  // =====================================================================
  gen['k5-haeufigkeit'] = (stufe) => {
    const k = stufe === 3 ? R.wahl(WORT_KONTEXTE) : R.wahl(ZAHL_KONTEXTE);
    const kat = stufe === 1 ? k.kat.slice(0, 4) : k.kat;
    const n = stufe === 1 ? R.int(12, 16) : stufe === 2 ? R.int(20, 26) : R.int(24, 30);
    const liste = urliste(kat, n, k.gew.slice(0, kat.length));
    const h = zaehle(liste, kat);
    const felder = kat.map((x, i) => zFeld(kName(k, x), h[i]));
    if (stufe > 1) felder.push(zFeld('Probe: Summe aller Häufigkeiten', n));
    return {
      frage: `${n} Kinder wurden gefragt: „${k.frage}“ Hier ist die Urliste.${legende(k)} Bestimme die Häufigkeiten${stufe > 1 ? ' und mache die Probe' : ''}.`,
      bild: urlisteHtml(k.titel, liste),
      felder,
      hinweis: 'Gehe die Urliste der Reihe nach durch, mach für jeden Wert einen Strich in einer Strichliste und streiche den Wert durch. Am Ende müssen alle Häufigkeiten zusammen die Anzahl der Befragten ergeben.',
      notiz: true,
      loesung: [
        'Häufigkeitstabelle:',
        { svg: tabelleHtml([k.kopf, 'Häufigkeit'], kat.map((x, i) => [kZelle(k, x), h[i]])) },
        `Probe: ${h.join(' + ')} = ${n} ✔`,
      ],
    };
  };

  // Probe: Fehler in einer Häufigkeitstabelle finden
  gen['k5-probe'] = (stufe) => {
    const k = R.wahl(stufe === 3 ? WORT_KONTEXTE : ZAHL_KONTEXTE);
    const kat = k.kat;
    const n = stufe === 1 ? R.int(20, 30) : R.int(30, 40);
    const liste = urliste(kat, n, k.gew);
    const h = zaehle(liste, kat);
    const fehlerhaft = stufe > 1 || Math.random() < 0.6;
    const zeile = R.int(0, kat.length - 1);
    const anders = h.slice();
    if (fehlerhaft) {
      let d = R.wahl([-2, -1, 1, 2]);
      if (anders[zeile] + d < 0) d = -d;
      anders[zeile] += d;
    }
    const summe = anders.reduce((a, b) => a + b, 0);
    const bild = (stufe === 1 ? '' : urlisteHtml(k.titel, liste)) + tabelleHtml([k.kopf, 'Häufigkeit'], kat.map((x, i) => [kZelle(k, x), anders[i]]));
    const felder = [zFeld('Summe der Häufigkeiten', summe)];
    if (stufe === 1) felder.push(auswahl('Kann die Tabelle stimmen', fehlerhaft ? 'nein' : 'ja', ['ja', 'nein']));
    else {
      felder.push(auswahl('Diese Zeile ist falsch', kName(k, kat[zeile]), kat.map((x) => kName(k, x))));
      felder.push(zFeld('Richtige Häufigkeit in dieser Zeile', h[zeile]));
    }
    return {
      frage: stufe === 1
        ? `Für eine Umfrage wurden ${n} Kinder gefragt: „${k.frage}“ Jemand hat diese Häufigkeitstabelle aufgeschrieben. Mache die Probe.`
        : `Für eine Umfrage wurden ${n} Kinder gefragt: „${k.frage}“${legende(k)} In der Häufigkeitstabelle steckt ein Fehler. Mache die Probe und finde die falsche Zeile.`,
      bild,
      felder,
      hinweis: stufe === 1 ? 'Addiere alle Häufigkeiten und vergleiche mit der Anzahl der Befragten.' : 'Die Probe zeigt dir, ob zu viel oder zu wenig gezählt wurde. Zähle dann die Zeilen einzeln in der Urliste nach.',
      notiz: stufe > 1,
      loesung: [
        `Summe: ${anders.join(' + ')} = ${summe}. ${summe === n ? `Das sind genau ${n} – die Tabelle kann stimmen.` : `Befragt wurden aber ${n} Kinder – die Tabelle ist falsch.`}`,
        ...(fehlerhaft && stufe > 1 ? [`Falsch ist die Zeile „${kName(k, kat[zeile])}“: richtig sind ${h[zeile]}, nicht ${anders[zeile]}.`] : []),
      ],
    };
  };

  // =====================================================================
  // 2 Diagramme lesen und prüfen
  // =====================================================================
  const DIAGRAMM_KONTEXTE = [
    { titel: 'Lieblingsfach', achse: 'Fach', kat: ['Sport', 'Kunst', 'Mathe', 'Englisch', 'Musik'] },
    { titel: 'Lieblingstier', achse: 'Tier', kat: ['Hund', 'Katze', 'Pferd', 'Hamster', 'Kaninchen'] },
    { titel: 'Lieblings-Eissorte', achse: 'Eissorte', kat: ['Schoko', 'Vanille', 'Erdbeere', 'Zitrone', 'Nuss'] },
    { titel: 'Verkehrsmittel zur Schule', achse: 'Verkehrsmittel', kat: ['Bus', 'Fahrrad', 'zu Fuß', 'Auto', 'Bahn'] },
    { titel: 'Freizeitbeschäftigung', achse: 'Beschäftigung', kat: ['Sport', 'Lesen', 'Musik', 'Gaming', 'Malen'] },
  ];
  const GROSS_KONTEXTE = [
    { titel: 'Besucher im Freizeitpark', achse: 'Monat', kat: ['April', 'Mai', 'Juni', 'Juli', 'August'], einheit: 'Besucher' },
    { titel: 'Zuschauer bei Heimspielen', achse: 'Spiel', kat: ['1. Spiel', '2. Spiel', '3. Spiel', '4. Spiel', '5. Spiel'], einheit: 'Zuschauer' },
    { titel: 'Verkaufte Eintrittskarten', achse: 'Woche', kat: ['Woche 1', 'Woche 2', 'Woche 3', 'Woche 4'], einheit: 'Karten' },
  ];

  /**
   * Säulen- oder Balkendiagramm. schritt = Wert eines Gitterabstands,
   * beschriftung = jede wievielte Gitterlinie eine Zahl bekommt.
   */
  function diagrammSvg(kat, werte, { schritt, beschriftung = 1, liegend = false, titel = '', achse = '' }) {
    const maxW = Math.max(...werte);
    const linien = Math.ceil((maxW + schritt) / schritt / beschriftung) * beschriftung;
    const W = 560, H = liegend ? 60 + kat.length * 44 : 300;
    const m = liegend ? { l: 110, r: 24, t: 30, b: 40 } : { l: 64, r: 16, t: 34, b: 44 };
    const pw = W - m.l - m.r, ph = H - m.t - m.b;
    let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${liegend ? 'Balkendiagramm' : 'Säulendiagramm'}">`;
    if (titel) s += `<text x="${W / 2}" y="16" class="hg-titel" text-anchor="middle">${titel}</text>`;
    for (let i = 0; i <= linien; i++) {
      const lab = i % beschriftung === 0 ? zt(i * schritt) : '';
      if (liegend) {
        const x = m.l + (pw * i) / linien;
        if (i > 0) s += `<line x1="${x}" x2="${x}" y1="${m.t}" y2="${m.t + ph}" class="ks-gitter"/>`;
        if (lab) s += `<text x="${x}" y="${m.t + ph + 16}" class="ks-zahl">${lab}</text>`;
      } else {
        const y = m.t + ph - (ph * i) / linien;
        if (i > 0) s += `<line x1="${m.l}" x2="${m.l + pw}" y1="${y}" y2="${y}" class="ks-gitter"/>`;
        if (lab) s += `<text x="${m.l - 6}" y="${y + 4}" class="ks-zahl ks-links">${lab}</text>`;
      }
    }
    const slot = (liegend ? ph : pw) / kat.length;
    const dicke = slot * 0.55;
    kat.forEach((c, i) => {
      const len = ((liegend ? pw : ph) * werte[i]) / (linien * schritt);
      if (liegend) {
        const y = m.t + slot * i + (slot - dicke) / 2;
        s += `<rect x="${m.l}" y="${y}" width="${len}" height="${dicke}" class="hg-balken"/>`;
        s += `<text x="${m.l - 8}" y="${y + dicke / 2 + 4}" class="ks-zahl ks-links">${c}</text>`;
      } else {
        const x = m.l + slot * i + (slot - dicke) / 2;
        s += `<rect x="${x}" y="${m.t + ph - len}" width="${dicke}" height="${len}" class="hg-balken"/>`;
        s += `<text x="${x + dicke / 2}" y="${m.t + ph + 16}" class="ks-zahl">${c}</text>`;
      }
    });
    s += `<line x1="${m.l}" x2="${m.l + pw}" y1="${m.t + ph}" y2="${m.t + ph}" class="ks-achse"/>`;
    s += `<line x1="${m.l}" x2="${m.l}" y1="${m.t + ph}" y2="${m.t - 6}" class="ks-achse"/>`;
    if (liegend) s += `<text x="${m.l + pw}" y="${H - 4}" class="ks-text" text-anchor="end">Häufigkeit</text>`;
    else {
      s += `<text x="${m.l + 4}" y="${m.t - 10}" class="ks-text">Häufigkeit</text>`;
      if (achse) s += `<text x="${m.l + pw}" y="${H - 4}" class="ks-text" text-anchor="end">${achse}</text>`;
    }
    return s + '</svg>';
  }

  gen['k5-diagramm-lesen'] = (stufe) => {
    const gross = stufe === 3;
    const k = gross ? R.wahl(GROSS_KONTEXTE) : R.wahl(DIAGRAMM_KONTEXTE);
    const kat = gross ? k.kat : k.kat.slice(0, R.int(4, 5));
    const schritt = gross ? R.wahl([1000, 5000, 10000]) : stufe === 1 ? 1 : R.wahl([1, 2, 5]);
    const beschriftung = stufe === 1 ? 2 : R.wahl([2, 5].filter((b) => b * schritt <= (gross ? 50000 : 20)));
    const maxLinien = gross ? R.int(10, 16) : stufe === 1 ? R.int(8, 12) : R.int(10, 16);
    let werte;
    do werte = kat.map(() => schritt * R.int(1, maxLinien)); while (new Set(werte).size < kat.length);
    const liegend = stufe === 3 || (stufe === 2 && Math.random() < 0.5);
    const bild = diagrammSvg(kat, werte, { schritt, beschriftung, liegend, titel: k.titel, achse: k.achse });
    const [a, b] = R.mische(kat.map((_, i) => i)).slice(0, 2);
    const groesser = werte[a] > werte[b] ? a : b, kleiner = groesser === a ? b : a;
    const summe = werte.reduce((x, y) => x + y, 0);
    const extra = gross ? { platzhalter: GROSS } : {};
    let frage, felder, loesung;
    const linienText = `Eine Gitterlinie bedeutet ${zt(schritt)}${beschriftung > 1 ? `, beschriftet ist nur jede ${beschriftung === 2 ? 'zweite' : 'fünfte'} Linie` : ''}.`;
    if (stufe === 1) {
      frage = `Lies im Diagramm ab, wie oft „${kat[a]}“ genannt wurde. ${linienText}`;
      felder = [zFeld(kat[a], werte[a])];
      loesung = [`„${kat[a]}“: ${werte[a]}`];
    } else if (stufe === 2) {
      if (Math.random() < 0.5) {
        frage = `Wie viele haben „${kat[groesser]}“ mehr genannt als „${kat[kleiner]}“? ${linienText}`;
        felder = [zFeld(kat[groesser], werte[groesser]), zFeld(kat[kleiner], werte[kleiner]), zFeld('Unterschied', werte[groesser] - werte[kleiner])];
        loesung = [`${werte[groesser]} − ${werte[kleiner]} = ${werte[groesser] - werte[kleiner]}`];
      } else {
        frage = `Wie viele wurden insgesamt befragt? Jede Person hat genau eine Antwort gegeben. ${linienText}`;
        felder = [zFeld('Anzahl der Befragten', summe)];
        loesung = [`${werte.join(' + ')} = ${summe}`];
      }
    } else {
      frage = `Das Balkendiagramm zeigt: „${k.titel}“. ${linienText} Lies ab und berechne den Unterschied.`;
      felder = [zFeld(kat[groesser], werte[groesser], extra), zFeld(kat[kleiner], werte[kleiner], extra), zFeld('Unterschied', werte[groesser] - werte[kleiner], extra)];
      loesung = [`${kat[groesser]}: ${zt(werte[groesser])}, ${kat[kleiner]}: ${zt(werte[kleiner])}`, `Unterschied: ${zt(werte[groesser])} − ${zt(werte[kleiner])} = ${zt(werte[groesser] - werte[kleiner])}`];
    }
    return {
      frage,
      bild,
      felder,
      hinweis: 'Finde zuerst heraus, wie viel eine Gitterlinie bedeutet: Schau dir zwei beschriftete Linien an und zähle die Abstände dazwischen.',
      loesung,
    };
  };

  gen['k5-diagramm-pruefen'] = (stufe) => {
    const k = R.wahl(DIAGRAMM_KONTEXTE);
    const kat = k.kat.slice(0, stufe === 1 ? 4 : 5);
    const schritt = stufe === 3 ? 2 : 1;
    let werte;
    do werte = kat.map(() => schritt * R.int(2, stufe === 3 ? 9 : 12)); while (new Set(werte).size < kat.length);
    const falsch = R.int(0, kat.length - 1);
    const moeglich = [-2, -1, 1, 2].filter((d) => werte[falsch] + d * schritt > 0 && !werte.includes(werte[falsch] + d * schritt));
    if (!moeglich.length) return gen['k5-diagramm-pruefen'](stufe);
    const gezeichnet = werte.slice();
    gezeichnet[falsch] += schritt * R.wahl(moeglich);
    const bild = tabelleHtml([k.achse, 'Häufigkeit'], kat.map((c, i) => [c, werte[i]]))
      + diagrammSvg(kat, gezeichnet, { schritt, beschriftung: 2, liegend: stufe === 2, titel: k.titel, achse: k.achse });
    return {
      frage: `Die Tabelle wurde in ein Diagramm übertragen. Dabei ist ein Fehler passiert. ${stufe === 2 ? 'Welcher Balken' : 'Welche Säule'} ist falsch gezeichnet?`,
      bild,
      felder: [auswahl('Falsch gezeichnet', kat[falsch], kat), zFeld('Richtiger Wert laut Tabelle', werte[falsch])],
      hinweis: 'Prüfe jede Säule einzeln: Bis zu welcher Linie reicht sie? Vergleiche mit der Tabelle.',
      loesung: [`„${kat[falsch]}“ ist bis ${gezeichnet[falsch]} gezeichnet, in der Tabelle steht aber ${werte[falsch]}.`],
    };
  };

  // =====================================================================
  // 3 Histogramme
  // =====================================================================
  const KLASSEN_KONTEXTE = [
    { titel: 'Körpergröße (in cm)', einheit: 'cm', von: 128, bis: 166, breite: [5, 10] },
    { titel: 'Körpergewicht (in kg)', einheit: 'kg', von: 26, bis: 58, breite: [5] },
    { titel: 'Dauer des Schulwegs (in min)', einheit: 'min', von: 2, bis: 38, breite: [5, 10] },
    { titel: 'Weitsprung (in cm)', einheit: 'cm', von: 180, bis: 330, breite: [20, 25, 50] },
  ];
  const kl = (a, b, e) => `von ${zt(a)} ${e} bis unter ${zt(b)} ${e}`;

  gen['k5-klassen'] = (stufe) => {
    const k = R.wahl(KLASSEN_KONTEXTE);
    const w = R.wahl(k.breite);
    if (stufe === 1) {
      const start = Math.ceil(k.von / w) * w;
      const grenzen = [0, 1, 2, 3].map((i) => start + i * w);
      const i = R.int(0, 1);
      const v = R.wahl([grenzen[i + 1], grenzen[i + 1] - 1, grenzen[i] + 1, grenzen[i + 1], grenzen[i]]);
      const richtigeK = Math.floor((v - start) / w);
      const opts = [0, 1, 2].map((j) => kl(grenzen[j], grenzen[j + 1], k.einheit));
      return {
        frage: `${k.titel}: Zu welcher Klasse gehört der Wert ${zt(v)} ${k.einheit}?`,
        felder: [auswahl('Klasse', opts[richtigeK], opts)],
        hinweis: '„bis unter“ heißt: Der Grenzwert selbst gehört nicht mehr dazu, sondern schon zur nächsten Klasse.',
        loesung: [`${zt(v)} ${k.einheit} gehört zur Klasse ${opts[richtigeK]}.`],
      };
    }
    // Urliste mit Werten
    const n = stufe === 2 ? R.int(16, 20) : R.int(20, 26);
    const liste = Array.from({ length: n }, () => R.int(k.von, k.bis));
    const min = Math.min(...liste), max = Math.max(...liste);
    const erste = Math.floor(min / w) * w;
    const grenzen = [];
    for (let g = erste; g <= max; g += w) grenzen.push(g);
    const anzahl = (a) => liste.filter((x) => a <= x && x < a + w).length;
    // möglichst eine Klasse mit Grenzwert in der Liste
    const mitGrenze = grenzen.filter((g) => liste.includes(g) && anzahl(g) > 0);
    const a = mitGrenze.length ? R.wahl(mitGrenze) : R.wahl(grenzen.filter((g) => anzahl(g) > 0));
    const felder = [];
    if (stufe === 3) {
      const opts = [kl(erste, erste + w, k.einheit), kl(erste + w, erste + 2 * w, k.einheit)];
      if (erste - w >= 0) opts.push(kl(erste - w, erste, k.einheit));
      if (min % w !== 0) opts.push(kl(min, min + w, k.einheit));
      felder.push(zFeld('kleinster Wert', min), auswahl('Erste Klasse der Tabelle', opts[0], opts));
    }
    felder.push(zFeld(`Häufigkeit der Klasse ${kl(a, a + w, k.einheit)}`, anzahl(a)));
    return {
      frage: stufe === 3
        ? `${k.titel} von ${n} Kindern. Die Daten sollen in Klassen der Breite ${w} ${k.einheit} zusammengefasst werden; die Klassengrenzen sind Vielfache von ${w}.`
        : `${k.titel} von ${n} Kindern. Die Daten werden in Klassen der Breite ${w} ${k.einheit} zusammengefasst: ${kl(erste, erste + w, k.einheit)}, ${kl(erste + w, erste + 2 * w, k.einheit)} usw.`,
      bild: urlisteHtml(k.titel, liste),
      felder,
      hinweis: 'Achte auf Werte, die genau auf einer Grenze liegen: Sie gehören zur höheren Klasse.',
      notiz: true,
      loesung: [
        ...(stufe === 3 ? [`Der kleinste Wert ist ${zt(min)}, also beginnt die Tabelle mit „${kl(erste, erste + w, k.einheit)}“.`] : []),
        `In der Klasse ${kl(a, a + w, k.einheit)} liegen: ${liste.filter((x) => a <= x && x < a + w).sort((x, y) => x - y).map(zt).join(', ')} – das sind ${anzahl(a)}.`,
        'Vollständige Häufigkeitstabelle:',
        { svg: tabelleHtml([k.titel, 'Häufigkeit'], grenzen.map((g) => [kl(g, g + w, k.einheit), anzahl(g)])) },
      ],
    };
  };

  function histSvg(grenzen, werte, titel) {
    const maxW = Math.max(...werte);
    const linien = maxW + 2;
    const W = 560, H = 290, m = { l: 52, r: 30, t: 34, b: 44 };
    const pw = W - m.l - m.r, ph = H - m.t - m.b;
    const bw = pw / (werte.length + 0.6);
    let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Histogramm">`;
    s += `<text x="${W / 2}" y="16" class="hg-titel" text-anchor="middle">Histogramm</text>`;
    for (let i = 0; i <= linien; i++) {
      const y = m.t + ph - (ph * i) / linien;
      if (i > 0) s += `<line x1="${m.l}" x2="${m.l + pw}" y1="${y}" y2="${y}" class="ks-gitter"/>`;
      if (i % 2 === 0) s += `<text x="${m.l - 6}" y="${y + 4}" class="ks-zahl ks-links">${i}</text>`;
    }
    werte.forEach((v, i) => {
      const h = (ph * v) / linien;
      s += `<rect x="${m.l + i * bw}" y="${m.t + ph - h}" width="${bw}" height="${h}" class="hg-balken"/>`;
    });
    grenzen.forEach((g, i) => { s += `<text x="${m.l + i * bw}" y="${m.t + ph + 16}" class="ks-zahl">${zt(g)}</text>`; });
    s += `<line x1="${m.l}" x2="${m.l + pw}" y1="${m.t + ph}" y2="${m.t + ph}" class="ks-achse"/>`;
    s += `<line x1="${m.l}" x2="${m.l}" y1="${m.t + ph}" y2="${m.t - 6}" class="ks-achse"/>`;
    s += `<text x="${m.l + 4}" y="${m.t - 10}" class="ks-text">Häufigkeit</text>`;
    s += `<text x="${m.l + pw}" y="${H - 4}" class="ks-text" text-anchor="end">${titel}</text>`;
    return s + '</svg>';
  }

  gen['k5-histogramm-lesen'] = (stufe) => {
    const k = R.wahl(KLASSEN_KONTEXTE);
    const w = R.wahl(k.breite);
    const start = Math.ceil(k.von / w) * w;
    const anz = R.int(5, 6);
    const grenzen = Array.from({ length: anz + 1 }, (_, i) => start + i * w);
    const werte = Array.from({ length: anz }, () => R.int(1, 9));
    const summe = werte.reduce((a, b) => a + b, 0);
    const bild = histSvg(grenzen, werte, k.titel);
    const i = R.int(0, anz - 1);
    let frage, felder, loesung;
    if (stufe === 1) {
      frage = `Wie viele Werte liegen in der Klasse ${kl(grenzen[i], grenzen[i + 1], k.einheit)}?`;
      felder = [zFeld('Häufigkeit', werte[i])];
      loesung = [`Die Säule über ${zt(grenzen[i])} bis ${zt(grenzen[i + 1])} reicht bis ${werte[i]}.`];
    } else if (stufe === 2) {
      const g = R.int(2, anz - 1);
      const unter = werte.slice(0, g).reduce((a, b) => a + b, 0);
      if (Math.random() < 0.5) {
        frage = `Wie viele Werte sind kleiner als ${zt(grenzen[g])} ${k.einheit}?`;
        felder = [zFeld('Anzahl', unter)];
        loesung = [`Alle Säulen links von ${zt(grenzen[g])}: ${werte.slice(0, g).join(' + ')} = ${unter}`];
      } else {
        frage = `Wie viele Werte sind mindestens ${zt(grenzen[g])} ${k.einheit}?`;
        felder = [zFeld('Anzahl', summe - unter)];
        loesung = [`Alle Säulen ab ${zt(grenzen[g])}: ${werte.slice(g).join(' + ')} = ${summe - unter}`];
      }
    } else {
      const v = grenzen[i] + (Math.random() < 0.5 ? 0 : R.int(1, w - 1));
      const opts = grenzen.slice(0, anz).map((g) => kl(g, g + w, k.einheit));
      frage = `Wie viele Werte wurden insgesamt erfasst? Und in welcher Säule ist der Wert ${zt(v)} ${k.einheit} gezählt?`;
      felder = [zFeld('Anzahl insgesamt', summe), auswahl('Säule', opts[i], opts)];
      loesung = [`Insgesamt: ${werte.join(' + ')} = ${summe}`, `${zt(v)} ${k.einheit} gehört zur Klasse ${opts[i]}.`];
    }
    return {
      frage: `Das Histogramm zeigt Daten aus einer Klasse: ${k.titel}. ${frage}`,
      bild,
      felder,
      hinweis: 'Jede Säule steht für eine Klasse „von … bis unter …“. Ihre Höhe ist die Häufigkeit.',
      loesung,
    };
  };

  // =====================================================================
  // 4 Addieren und subtrahieren (Kopfrechnen, Fachbegriffe)
  // =====================================================================
  gen['k5-kopf'] = (stufe) => {
    if (stufe === 3) {
      const a = R.int(150, 900), b = R.int(30, a - 20);
      const typ = R.int(0, 3);
      const fall = [
        [`Der Minuend ist ${a}, die Differenz ${a - b}. Wie heißt der Subtrahend?`, 'Subtrahend', b, `${a} − ${a - b} = ${b}`],
        [`Der Subtrahend ist ${b}, die Differenz ${a - b}. Wie heißt der Minuend?`, 'Minuend', a, `${a - b} + ${b} = ${a}`],
        [`Die Summe zweier Zahlen ist ${a}, ein Summand ist ${b}. Wie heißt der andere Summand?`, 'Summand', a - b, `${a} − ${b} = ${a - b}`],
        [`Bilde die Differenz aus ${a} und ${b}.`, 'Differenz', a - b, `${a} − ${b} = ${a - b}`],
      ][typ];
      return {
        frage: fall[0],
        felder: [zFeld(fall[1], fall[2])],
        hinweis: 'Summand + Summand = Summe, Minuend − Subtrahend = Differenz. Schreibe die Aufgabe zuerst mit einem Platzhalter auf.',
        loesung: [fall[3]],
      };
    }
    let k;
    if (stufe === 1) {
      const a = R.int(23, 89), b = R.int(14, 69);
      k = Math.random() < 0.5 || b >= a ? T.plus(T.Z(a), T.Z(b)) : T.minus(T.Z(a), T.Z(b));
    } else {
      const fast = R.wahl([99, 98, 101, 102, 199, 198, 201, 299]);
      const a = R.int(120, 880);
      k = Math.random() < 0.5 || fast >= a ? T.plus(T.Z(a), T.Z(fast)) : T.minus(T.Z(a), T.Z(fast));
    }
    const e = wert(k);
    return {
      frage: stufe === 1 ? 'Rechne im Kopf.' : 'Rechne geschickt im Kopf.',
      term: tx(k),
      felder: [zFeld(ERGEBNIS, e)],
      hinweis: stufe === 1 ? 'Zerlege die zweite Zahl in Zehner und Einer.' : 'Die zweite Zahl liegt nah an einer glatten Hunderterzahl. Rechne mit der glatten Zahl und gleiche danach aus.',
      loesung: [$(`${tx(k)}=${ztex(e)}`)],
    };
  };

  // =====================================================================
  // 5 Klammern
  // =====================================================================
  function klammerTerm(stufe) {
    const Zr = (a, b) => T.Z(R.int(a, b));
    for (;;) {
      let k;
      if (stufe === 1) {
        const a = Zr(60, 99), b = Zr(10, 40), c = Zr(5, 30);
        k = R.wahl([
          () => T.minus(a, T.K(T.plus(b, c))),
          () => T.minus(a, T.K(T.minus(b, c))),
          () => T.plus(T.K(T.minus(a, b)), c),
          () => T.plus(a, T.K(T.minus(b, c))),
        ])();
      } else if (stufe === 2) {
        const a = Zr(40, 99), b = Zr(10, 40), c = Zr(30, 80), d = Zr(5, 30);
        k = R.wahl([
          () => T.plus(T.K(T.minus(a, b)), T.K(T.minus(c, d))),
          () => T.minus(T.minus(a, T.K(T.plus(b, d))), Zr(1, 20)),
          () => T.minus(T.K(T.plus(a, c)), T.K(T.minus(b, d))),
          () => T.plus(T.minus(a, T.K(T.minus(b, d))), c),
        ])();
      } else {
        const a = Zr(100, 250), b = Zr(30, 90), c = Zr(10, 40), d = Zr(5, 30);
        k = R.wahl([
          () => T.minus(a, T.K(T.minus(b, T.K(T.plus(c, d))))),
          () => T.minus(T.plus(T.K(T.minus(a, b)), c), T.K(T.minus(Zr(40, 80), d))),
          () => T.minus(a, T.K(T.plus(T.K(T.minus(b, c)), d))),
          () => T.plus(T.minus(a, T.K(T.plus(b, c))), T.K(T.minus(Zr(50, 90), d))),
        ])();
      }
      if (ohneNegativ(k) && wert(k) > 0) return k;
    }
  }
  /** Kein Zwischenergebnis darf negativ werden (Klasse 5: nur natürliche Zahlen) */
  function ohneNegativ(k) {
    if (k.art === 'zahl') return true;
    if (k.art === 'klammer') return ohneNegativ(k.inhalt);
    return ohneNegativ(k.l) && ohneNegativ(k.r) && wert(k) >= 0 && wert(k.l) >= 0;
  }
  /** Rechenweg: innerste Klammer zuerst, sonst von links nach rechts */
  function schritte(k) {
    const zeilen = [];
    let akt = k;
    for (let i = 0; i < 8 && akt.art !== 'zahl'; i++) {
      akt = einSchritt(akt);
      zeilen.push(tx(akt));
    }
    return zeilen;
  }
  function tiefsteKlammer(k) {
    if (k.art === 'klammer') return tiefsteKlammer(k.inhalt) || (k.inhalt.art === 'op' && k.inhalt.l.art === 'zahl' && k.inhalt.r.art === 'zahl' ? k : null);
    if (k.art === 'op') return tiefsteKlammer(k.l) || tiefsteKlammer(k.r);
    return null;
  }
  function ersetze(k, alt, neu) {
    if (k === alt) return neu;
    if (k.art === 'klammer') return { ...k, inhalt: ersetze(k.inhalt, alt, neu) };
    if (k.art === 'op') return { ...k, l: ersetze(k.l, alt, neu), r: ersetze(k.r, alt, neu) };
    return k;
  }
  function einSchritt(k) {
    const kl = tiefsteKlammer(k);
    if (kl) return ersetze(k, kl, T.Z(wert(kl)));
    // ohne Klammern: ganz links zuerst
    const links = (x) => (x.art === 'op' && x.l.art === 'op' ? links(x.l) : x);
    const ziel = links(k);
    return ersetze(k, ziel, T.Z(wert(ziel)));
  }

  gen['k5-klammern'] = (stufe) => {
    const k = klammerTerm(stufe);
    const e = wert(k);
    return {
      frage: 'Berechne. Achte auf die Klammern.',
      term: tx(k),
      felder: [zFeld(ERGEBNIS, e)],
      hinweis: 'Rechne zuerst, was in der Klammer steht – bei mehreren ineinander zuerst die innere. Ohne Klammern geht es von links nach rechts.',
      notiz: stufe > 1,
      loesung: [$(tx(k)), ...schritte(k).map((z) => $('=' + z))],
    };
  };

  gen['k5-klammer-setzen'] = (stufe) => {
    for (;;) {
      const n = stufe === 3 ? 4 : 3;
      const zahlen = [R.int(50, 120), ...Array.from({ length: n - 1 }, () => R.int(5, 40))];
      const ops = Array.from({ length: n - 1 }, (_, i) => (i === 0 || stufe === 1 ? '-' : R.wahl(['+', '-'])));
      if (stufe < 3) ops[1] = stufe === 1 ? R.wahl(['+', '-']) : ops[1];
      const Zs = zahlen.map((z) => T.Z(z));
      // Möglichkeiten: keine Klammer und je eine Klammer um zwei bzw. drei benachbarte Zahlen
      const varianten = [{ k: T.kette(...Zs.flatMap((z, i) => (i ? [ops[i - 1], z] : [z]))), name: 'keine Klammer' }];
      for (let von = 0; von < n - 1; von++) {
        for (let bis = von + 1; bis < n; bis++) {
          if (von === 0 && bis === n - 1) continue;
          const innen = T.K(T.kette(...Zs.slice(von, bis + 1).flatMap((z, i) => (i ? [ops[von + i - 1], z] : [z]))));
          const teile = [];
          for (let i = 0; i < n;) {
            if (i === von) { teile.push(innen); i = bis + 1; } else { teile.push(Zs[i]); i++; }
            if (i < n) teile.push(ops[i - 1]);
          }
          varianten.push({ k: T.kette(...teile), name: tx(T.kette(...teile)) });
        }
      }
      if (new Set(zahlen).size !== n) continue;
      const gueltig = varianten.filter((v) => ohneNegativ(v.k) && wert(v.k) >= 0);
      const ziel = R.wahl(gueltig.filter((v) => v.name !== 'keine Klammer' || stufe > 1));
      const gleiche = gueltig.filter((v) => wert(v.k) === wert(ziel.k));
      if (gleiche.length !== 1 || gueltig.length < 3 || wert(ziel.k) === zahlen[0]) continue;
      const ohne = tx(varianten[0].k);
      const opts = gueltig.map((v) => (v.name === 'keine Klammer' ? 'Es ist keine Klammer nötig.' : $(`${v.name}=${wert(ziel.k)}`)));
      const richtigOpt = ziel.name === 'keine Klammer' ? 'Es ist keine Klammer nötig.' : $(`${ziel.name}=${wert(ziel.k)}`);
      return {
        frage: `Wo muss eine Klammer stehen, damit das Ergebnis ${wert(ziel.k)} herauskommt?`,
        term: `${ohne}=${wert(ziel.k)}`,
        felder: [auswahl('So stimmt es', richtigOpt, opts)],
        hinweis: 'Rechne jede Möglichkeit aus. Ohne Klammer rechnest du von links nach rechts.',
        loesung: [ziel.name === 'keine Klammer' ? `Ohne Klammer, von links nach rechts: ${$(ohne + '=' + wert(ziel.k))}` : $(`${ziel.name}=${wert(ziel.k)}`)],
      };
    }
  };

  // =====================================================================
  // 6 Texte als Rechnung
  // =====================================================================
  gen['k5-text'] = (stufe) => {
    const a = R.int(stufe === 1 ? 40 : 80, stufe === 1 ? 99 : 250);
    const b = R.int(10, Math.floor(a / 2));
    const c = R.int(3, Math.max(3, Math.floor(b / 2)));
    const Za = T.Z(a), Zb = T.Z(b), Zc = T.Z(c);
    const vorlagen = {
      1: [
        [`Subtrahiere ${b} von ${a}.`, T.minus(Za, Zb), [T.minus(Zb, Za), T.plus(Za, Zb)]],
        [`Bilde die Differenz aus ${a} und ${b}.`, T.minus(Za, Zb), [T.minus(Zb, Za), T.plus(Za, Zb)]],
        [`Addiere ${b} und ${a}.`, T.plus(Zb, Za), [T.minus(Za, Zb), T.minus(Zb, Za)]],
        [`Um wie viel ist ${a} größer als ${b}?`, T.minus(Za, Zb), [T.plus(Za, Zb), T.minus(Zb, Za)]],
      ],
      2: [
        [`Subtrahiere von ${a} die Summe aus ${b} und ${c}.`, T.minus(Za, T.K(T.plus(Zb, Zc))), [T.plus(T.minus(Za, Zb), Zc), T.minus(T.K(T.plus(Zb, Zc)), Za)]],
        [`Addiere zur Zahl ${a} die Differenz aus ${b} und ${c}.`, T.plus(Za, T.K(T.minus(Zb, Zc))), [T.minus(Za, T.K(T.minus(Zb, Zc))), T.plus(Za, T.K(T.plus(Zb, Zc)))]],
        [`Die Summe aus ${a} und ${b} wird um ${c} vermindert.`, T.minus(T.K(T.plus(Za, Zb)), Zc), [T.minus(Za, T.K(T.plus(Zb, Zc))), T.plus(T.K(T.plus(Za, Zb)), Zc)]],
        [`Subtrahiere die Differenz aus ${b} und ${c} von ${a}.`, T.minus(Za, T.K(T.minus(Zb, Zc))), [T.minus(T.minus(Za, Zb), Zc), T.minus(T.K(T.minus(Zb, Zc)), Za)]],
      ],
      3: [
        [`Mia hat ${a} €. Sie kauft ein Buch für ${b} € und ein Spiel für ${c} €. Wie viel Geld bleibt ihr?`, T.minus(Za, T.K(T.plus(Zb, Zc))), [T.plus(T.minus(Za, Zb), Zc), T.plus(T.plus(Za, Zb), Zc)]],
        [`In einem Bus sitzen ${a} Fahrgäste. An der Haltestelle steigen ${b} aus und ${c} ein. Wie viele sitzen jetzt im Bus?`, T.plus(T.minus(Za, Zb), Zc), [T.minus(Za, T.K(T.plus(Zb, Zc))), T.minus(T.plus(Za, Zb), Zc)]],
        [`Ein Regal hat Platz für ${a} Bücher. ${b} Bücher stehen schon darin, ${c} kommen noch dazu. Wie viele Plätze sind dann noch frei?`, T.minus(Za, T.K(T.plus(Zb, Zc))), [T.plus(T.minus(Za, Zb), Zc), T.minus(T.plus(Zb, Zc), Za)]],
        [`Subtrahiere die Differenz aus ${b} und ${c} von der Summe aus ${a} und ${c}.`, T.minus(T.K(T.plus(Za, Zc)), T.K(T.minus(Zb, Zc))), [T.minus(T.minus(T.plus(Za, Zc), Zb), Zc), T.minus(T.K(T.minus(Zb, Zc)), T.K(T.plus(Za, Zc)))]],
      ],
    }[stufe];
    const [text, richtig, falsche] = R.wahl(vorlagen);
    const opts = [richtig, ...falsche].map((k) => $(tx(k)));
    return {
      frage: `Schreibe als Rechnung und rechne aus: ${text}`,
      felder: [auswahl('Rechnung', opts[0], opts), zFeld(ERGEBNIS, wert(richtig))],
      hinweis: 'Achte auf die Reihenfolge: „Subtrahiere 20 von 50“ heißt 50 − 20. Wird eine Summe oder Differenz abgezogen, brauchst du eine Klammer.',
      loesung: [$(`${tx(richtig)}=${wert(richtig)}`)],
    };
  };

  // =====================================================================
  // 7 Schriftlich addieren und subtrahieren
  // =====================================================================
  const ueberschlag = (z) => {
    const st = 10 ** (String(z).length - 1);
    return Math.round(z / st) * st;
  };
  gen['k5-schriftlich'] = (stufe) => {
    for (;;) {
      let k, zahlen, ops;
      if (stufe === 1) {
        const a = R.int(1200, 8999), b = R.int(300, 4999);
        ops = [Math.random() < 0.5 || b > a ? '+' : '-'];
        zahlen = [a, b];
      } else if (stufe === 2) {
        const a = R.int(10000, 899999), b = R.int(1000, Math.floor(a * 0.9));
        ops = [R.wahl(['+', '-'])];
        zahlen = [a, b];
      } else {
        const a = R.int(20000, 99999), b = R.int(1000, 30000), c = R.int(100, 9999);
        ops = R.wahl([['+', '+'], ['-', '-'], ['+', '-'], ['-', '+']]);
        zahlen = [a, b, c];
      }
      k = T.kette(...zahlen.flatMap((z, i) => (i ? [ops[i - 1], T.Z(z)] : [T.Z(z)])));
      if (!ohneNegativ(k)) continue;
      // Überträge sollen vorkommen
      const e = wert(k);
      const u = zahlen.map(ueberschlag);
      const ue = u.reduce((s, z, i) => (i ? (ops[i - 1] === '+' ? s + z : s - z) : z), 0);
      return {
        frage: 'Mache zuerst einen Überschlag. Rechne dann schriftlich.',
        term: tx(k),
        felder: [zFeld(ERGEBNIS, e, stufe > 1 ? { platzhalter: GROSS } : {})],
        hinweis: 'Schreibe die Zahlen stellengerecht untereinander: Einer unter Einer, Zehner unter Zehner … Vergleiche am Ende mit deinem Überschlag.',
        notiz: true,
        loesung: [
          `Überschlag: ${$(gruppiert(u.map((z, i) => (i ? (ops[i - 1] === '+' ? '+' : '-') : '') + z).join('')) + '=' + ztex(ue))}`,
          `Genau: ${$(`${tx(k)}=${ztex(e)}`)}`,
        ],
      };
    }
  };

  // =====================================================================
  // 8 Platzhalter und Umkehraufgaben
  // =====================================================================
  gen['k5-platzhalter'] = (stufe) => {
    if (stufe === 3 && Math.random() < 0.4) {
      const start = R.int(20, 150);
      const schritteL = [['+', R.int(10, 60)], ['-', R.int(5, 30)], ['+', R.int(10, 99)]];
      let z = start;
      for (const [o, w] of schritteL) z = o === '+' ? z + w : z - w;
      const text = schritteL.map(([o, w]) => (o === '+' ? `addiere ${w}` : `subtrahiere ${w}`)).join(', dann ');
      const rueck = schritteL.slice().reverse().map(([o, w]) => (o === '+' ? `-${w}` : `+${w}`)).join('');
      return {
        frage: `Ich denke mir eine Zahl. Ich ${text}. Am Ende erhalte ich ${z}. Welche Zahl habe ich mir gedacht?`,
        felder: [zFeld('Gedachte Zahl', start)],
        hinweis: 'Rechne rückwärts: Beginne mit dem Ergebnis und mache jeden Schritt mit der Umkehraufgabe rückgängig.',
        loesung: [`Rückwärts: ${$(`${z}${rueck}=${start}`)}`],
      };
    }
    const [lo, hi] = stufe === 1 ? [11, 99] : stufe === 2 ? [101, 999] : [1000, 99999];
    const x = R.int(lo, hi), y = R.int(lo, hi);
    const typ = R.int(0, 3);
    const S = '\\square';
    let t, antwort, umkehr;
    if (typ === 0) { t = `${S}+${ztex(y)}=${ztex(x + y)}`; antwort = x; umkehr = `${ztex(x + y)}-${ztex(y)}=${ztex(x)}`; }
    else if (typ === 1) { t = `${ztex(y)}+${S}=${ztex(x + y)}`; antwort = x; umkehr = `${ztex(x + y)}-${ztex(y)}=${ztex(x)}`; }
    else if (typ === 2) { t = `${S}-${ztex(y)}=${ztex(x)}`; antwort = x + y; umkehr = `${ztex(x)}+${ztex(y)}=${ztex(x + y)}`; }
    else { t = `${ztex(x + y)}-${S}=${ztex(x)}`; antwort = y; umkehr = `${ztex(x + y)}-${ztex(x)}=${ztex(y)}`; }
    const probe = t.replace(S, ztex(antwort));
    return {
      frage: 'Bestimme die fehlende Zahl mit einer Umkehraufgabe. Mache die Probe.',
      term: t,
      felder: [zFeld($(`${S}=`), antwort, stufe === 3 ? { platzhalter: GROSS } : {})],
      hinweis: 'Setze in Gedanken kleine Zahlen ein, z. B. □ − 3 = 5. Wie rechnest du dort? Genauso geht es mit den großen Zahlen.',
      loesung: [`Umkehraufgabe: ${$(umkehr)}`, `Probe: ${$(probe)} ✔`],
    };
  };

  // =====================================================================
  // 9 Rechengesetze
  // =====================================================================
  gen['k5-geschickt'] = (stufe) => {
    const ziel = stufe === 3 ? 1000 : 100;
    const paar = () => { const a = stufe === 3 ? R.int(101, 899) : R.int(11, 89); return [a, ziel - a]; };
    const [p, q] = paar();
    let zahlen, pr2 = null;
    if (stufe === 1) zahlen = [p, R.int(12, 88), q];
    else { pr2 = paar(); zahlen = [p, pr2[0], q, pr2[1]]; }
    // Reihenfolge so, dass Partner nicht nebeneinander stehen
    const k = T.kette(...zahlen.flatMap((z, i) => (i ? ['+', T.Z(z)] : [T.Z(z)])));
    const e = wert(k);
    const falsche = zahlen.slice(1).filter((z) => z !== q).map((z) => $(`${p}+${z}`));
    const geschicktT = stufe === 1 ? `(${p}+${q})+${zahlen[1]}` : `(${p}+${q})+(${pr2[0]}+${pr2[1]})`;
    return {
      frage: 'Rechne geschickt. Mit welcher Zahl fasst du die erste Zahl zuerst zusammen?',
      term: tx(k),
      felder: [auswahl('Zuerst rechne ich', $(`${p}+${q}`), [$(`${p}+${q}`), ...falsche]), zFeld(ERGEBNIS, e)],
      hinweis: `Suche Zahlen, die zusammen ${zt(ziel)} ergeben. Beim Addieren darfst du vertauschen und Klammern setzen.`,
      loesung: [$(`${tx(k)}=${gruppiert(geschicktT)}=${ztex(e)}`)],
    };
  };

  gen['k5-gesetze'] = (stufe) => {
    const a = R.int(12, 60), b = R.int(5, 30), c = R.int(2, 9);
    const fall = R.wahl([
      [`${a}+${b}=${b}+${a}`, true, 'Vertauschungsgesetz: Beim Addieren darf man vertauschen.'],
      [`${a}-${b}=${b}-${a}`, false, `Links steht ${a - b}, rechts kann man in den natürlichen Zahlen gar nicht rechnen. Beim Subtrahieren darf man nicht vertauschen.`],
      [`(${a}+${b})+${c}=${a}+(${b}+${c})`, true, 'Verbindungsgesetz: Beim Addieren darf man Klammern beliebig setzen.'],
      [`(${a}-${b})-${c}=${a}-(${b}-${c})`, false, `Links: ${a - b - c}, rechts: ${a - (b - c)}. Beim Subtrahieren ändern Klammern das Ergebnis.`],
      ...(stufe > 1 ? [
        [`${a}+${b}+${c}=${c}+${a}+${b}`, true, 'Beim Addieren darf man die Summanden beliebig vertauschen.'],
        [`${a}-${b}-${c}=${a}-(${b}+${c})`, true, `Beides ergibt ${a - b - c}: Wer nacheinander ${b} und ${c} abzieht, zieht insgesamt ${b + c} ab.`],
        [`${a}-${b}+${c}=${a}-(${b}+${c})`, false, `Links: ${a - b + c}, rechts: ${a - b - c}.`],
      ] : []),
    ]);
    return {
      frage: 'Stimmt die Gleichung? Rechne beide Seiten aus, wenn du unsicher bist.',
      term: fall[0],
      felder: [auswahl('Die Gleichung ist', fall[1] ? 'wahr' : 'falsch', ['wahr', 'falsch'])],
      hinweis: 'Vertauschungs- und Verbindungsgesetz gelten nur für die Addition.',
      loesung: [`${fall[1] ? 'Wahr' : 'Falsch'}. ${fall[2]}`],
    };
  };

  // =====================================================================
  // Zusatz: Runden rückwärts (kleinste und größte Ausgangszahl)
  // =====================================================================
  const STELLEN = [[10, 'Zehner'], [100, 'Hunderter'], [1000, 'Tausender'], [10000, 'Zehntausender'], [100000, 'Hunderttausender'], [1000000, 'Millionen']];
  gen['k5-runden-rueck'] = (stufe) => {
    const [st, name] = stufe === 1 ? R.wahl(STELLEN.slice(0, 2)) : stufe === 2 ? R.wahl(STELLEN.slice(1, 4)) : R.wahl(STELLEN.slice(3, 6));
    // Stufe 2 und 3: öfter Fälle, bei denen die kleinste Zahl eine Stelle „zurückspringt“ (z. B. 21 000 auf Hunderter)
    const faktor = stufe === 1 ? R.int(2, 99) : R.wahl([R.int(2, 99), 10 * R.int(1, 50), 100 * R.int(1, 9)]);
    const g = st * faktor;
    const halb = st / 2;
    const klein = g - halb, gross = g + halb - 1;
    return {
      frage: `Eine Zahl wurde auf ${name} gerundet. Das Ergebnis ist ${zt(g)}. Gib die kleinste und die größte Zahl an, die es vorher gewesen sein kann.`,
      felder: [zFeld('kleinste Zahl', klein, { platzhalter: GROSS }), zFeld('größte Zahl', gross, { platzhalter: GROSS })],
      hinweis: `Zeichne einen Zahlenstrahl mit ${zt(g - st)}, ${zt(g)} und ${zt(g + st)}. Wo liegen die Mitten? Welche Mitte wird schon aufgerundet?`,
      loesung: [`Halber Schritt: ${zt(halb)}. Kleinste Zahl: ${zt(g)} − ${zt(halb)} = ${zt(klein)}, größte Zahl: ${zt(g)} + ${zt(halb)} − 1 = ${zt(gross)}.`,
        `${zt(g + halb)} wird schon auf ${zt(g + st)} gerundet.`],
    };
  };

  UM.klasse5 = { zaehle, diagrammSvg, schritte, ohneNegativ };
})(typeof window !== 'undefined' ? window : globalThis);
