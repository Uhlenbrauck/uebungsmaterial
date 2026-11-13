/*
 * Baut eine Themenseite aus UM.thema (siehe mathematik/…/thema.js):
 * Checkliste zur Selbsteinschätzung, Übungen je Kompetenz, Abschlusstest.
 * thema.einschaetzung === false: Übungen zum laufenden Unterricht – statt der Checkliste eine Liste
 * „Was übe ich hier?“ ohne Selbsteinschätzung (die Zeilen können später in eine Checkliste übernommen werden).
 * thema.arbeit: Wort für die Prüfung in den Texten (Standard „Klassenarbeit“, z. B. „Klausur“).
 * Der Fortschritt bleibt nur in diesem Browser (localStorage), es werden keine Daten verschickt.
 */
(function (global) {
  'use strict';
  const UM = (global.UM = global.UM || {});
  const { el, mathe } = UM;

  // ---------- Speicher (nur lokal, Fehler werden ignoriert) ----------
  function speicher(id) {
    const schluessel = 'uebungsmaterial:' + id;
    const leer = () => ({ selbst: {}, geloest: {}, tests: [] });
    let daten = leer();
    try {
      daten = Object.assign(daten, JSON.parse(global.localStorage.getItem(schluessel)) || {});
    } catch (e) { /* kein Speicher verfügbar */ }
    // ältere Fassung: selbst[id] war eine Zahl (= Einschätzung vorher)
    for (const [k, v] of Object.entries(daten.selbst)) if (typeof v === 'number') daten.selbst[k] = { vorher: v };
    const hoerer = [];
    return {
      daten,
      sichern() {
        try { global.localStorage.setItem(schluessel, JSON.stringify(daten)); } catch (e) { /* egal */ }
        hoerer.forEach((f) => f());
      },
      beiAenderung(f) { hoerer.push(f); },
      loeschen() {
        Object.assign(daten, leer());
        try { global.localStorage.removeItem(schluessel); } catch (e) { /* egal */ }
        hoerer.forEach((f) => f());
      },
    };
  }

  const heute = () => new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const ZEITPUNKTE = [['vorher', 'vorher', 'vor dem Üben'], ['nachher', 'nachher', 'nach dem Üben']];
  const SMILEYS = [['😰', 'Das kann ich noch gar nicht'], ['🙁', 'Das kann ich nur teilweise'], ['🙂', 'Das kann ich meistens'], ['😄', 'Das kann ich sicher']];
  /** Ampelsystem: grün = leicht, gelb = mittel, rot = schwierig */
  const STUFEN = [[1, 'gruen', 'leicht'], [2, 'gelb', 'mittel'], [3, 'rot', 'schwierig']];
  const uebungId = (u) => 'uebung-' + u.gen;
  const ampel = (n) => el('span', { class: 'ampel ' + STUFEN[n - 1][1], 'aria-hidden': 'true' });

  /** Hinweis zum Datenschutz, an mehreren Stellen der Seite */
  const datenschutz = (text) => el('p', { class: 'datenschutz' }, el('span', { class: 'schloss', 'aria-hidden': 'true' }, '🔒'), el('span', {}, ...text));
  const DS_KURZ = ['Deine Eingaben bleiben nur in diesem Browser auf diesem Gerät. ', el('b', {}, 'Es wird nichts übertragen – auch dein Lehrer sieht deine Ergebnisse und Einschätzungen nicht.')];

  function starte(thema) {
    const s = speicher(thema.id);
    const mitEinschaetzung = thema.einschaetzung !== false;
    const arbeit = thema.arbeit || 'Klassenarbeit';
    const LISTE = mitEinschaetzung ? 'Das muss ich können' : 'Darum geht es';
    const mitInfo = mitEinschaetzung || thema.kompetenzen.some((k) => k.notizbuch || k.buch);
    const haupt = document.getElementById('inhalt');
    document.title = `${thema.titel} – Übungsmaterial`;

    haupt.append(
      el('nav', { class: 'brotkrumen' }, el('a', { href: thema.startseite || '../../../index.html' }, 'Übersicht'), ` › ${thema.fach} › ${thema.stufe}`),
      el('header', { class: 'kopf' }, el('h1', {}, thema.titel), thema.untertitel ? el('p', { class: 'untertitel' }, thema.untertitel) : null),
      el('section', { class: 'kasten anleitung' },
        el('h2', {}, 'So übst du mit dieser Seite'),
        datenschutz(['Diese Seite ist nur für dich zum Üben. ', el('b', {}, 'Nichts von dem, was du hier eingibst, löst oder einschätzt, wird übertragen – weder an deinen Lehrer noch an jemand anderen.'), ' Es wird nichts benotet. Dein Fortschritt wird nur in diesem Browser auf diesem Gerät gemerkt.']),
        mitEinschaetzung
          ? el('ol', {},
              el('li', {}, el('b', {}, 'Vorher einschätzen: '), 'Gehe die Checkliste durch und schätze dich bei jeder Zeile ehrlich ein (Zeile „vorher“). Dort findest du auch, wo du im Notizbuch und im Buch nachlesen kannst.'),
              el('li', {}, el('b', {}, 'Üben: '), 'Übe vor allem die Punkte, bei denen du unsicher bist – mit den Übungen auf dieser Seite und den Übungen auf Realmath. Die Aufgaben auf dieser Seite werden jedes Mal neu erzeugt, du kannst also beliebig oft üben.'),
              el('li', {}, el('b', {}, 'Testen: '), 'Mache den Abschlusstest. Er zeigt dir, was du noch einmal üben solltest.'),
              el('li', {}, el('b', {}, 'Nachher einschätzen und sichern: '), 'Schätze dich in der Checkliste noch einmal ein (Zeile „nachher“). Unter „Mein Lernstand“ siehst du dann alles auf einen Blick und kannst es als PDF in deinem Notizbuch ablegen.'))
          : el('ol', {},
              el('li', {}, el('b', {}, 'Überblick: '), 'Die Liste „Was übe ich hier?“ zeigt dir, worum es in den Übungen geht. Von dort springst du direkt zur passenden Übung.'),
              el('li', {}, el('b', {}, 'Üben: '), 'Übe passend zum Unterricht. Die Aufgaben werden jedes Mal neu erzeugt, du kannst also beliebig oft üben.'),
              el('li', {}, el('b', {}, 'Testen: '), 'Mit dem Abschlusstest siehst du, was du schon sicher kannst und was du noch einmal üben solltest.'),
              el('li', {}, el('b', {}, 'Sichern: '), 'Unter „Mein Lernstand“ siehst du, was du gelöst hast, und kannst es als PDF in deinem Notizbuch ablegen.')),
        el('p', { class: 'ampel-legende' }, 'Jede Übung gibt es in drei Schwierigkeitsstufen: ',
          ...STUFEN.flatMap(([n, , t], i) => [ampel(n), ` ${t}${i < 2 ? ',  ' : '.'}`]),
          ' Fang mit Grün an und steigere dich.'),
        el('p', {}, `✏️ Bei vielen Aufgaben helfen Notizen und Nebenrechnungen: Schreib Zwischenschritte ins Heft oder auf dem iPad mit, skizziere z. B. eine Tabelle, ein Diagramm oder einen Graphen. Nimm dir dafür ruhig Zeit – so machst du es in der ${arbeit} auch.`)),
      checkliste(),
      ...thema.kompetenzen.map(kompetenzAbschnitt),
      testAbschnitt(),
      lernstand(),
      el('footer', { class: 'fuss' }, '🔒 ', ...DS_KURZ, ' Diese Seite lädt nichts von fremden Servern. Für Realmath und OneNote, die du über Links öffnest, gelten deren eigene Regeln.'),
    );
    mathe(haupt);

    // ---------- Checkliste (Spalten wie auf dem Kompetenzbogen) ----------
    function notizbuchLinks(liste) {
      return (liste || []).map((n) => el('div', { class: 'nb-link' },
        el('a', { href: n.onenote, title: 'In der OneNote-App öffnen' }, '📓 ' + n.titel),
        n.web ? el('span', {}, ' (', el('a', { href: n.web, target: '_blank', rel: 'noopener' }, 'Webansicht'), ')') : null));
    }
    function realmathListe(k, kurz) {
      return (k.realmath || []).map((g) => el('div', { class: 'rm-gruppe' },
        g.gruppe ? el('div', { class: 'rm-titel' }, g.gruppe) : null,
        el('ul', {}, ...g.links.map((l) => el('li', {}, el('a', { href: l.url, target: '_blank', rel: 'noopener' }, (kurz ? '' : '↗ ') + l.titel))))));
    }
    function smileyZeile(id, zp, label, lang) {
      const aktuell = () => (s.daten.selbst[id] || {})[zp];
      const gruppe = el('div', { class: 'smileys', role: 'radiogroup', 'aria-label': `Selbsteinschätzung ${lang}` });
      const knoepfe = SMILEYS.map(([sym, t], i) => {
        const b = el('button', { type: 'button', class: 'smiley' + (aktuell() === i ? ' aktiv' : ''), title: `${t} (${lang})`, 'aria-label': `${t} (${lang})`, 'aria-pressed': String(aktuell() === i) }, sym);
        b.addEventListener('click', () => {
          const e = (s.daten.selbst[id] = s.daten.selbst[id] || {});
          e[zp] = i;
          e[zp + 'Datum'] = heute();
          s.sichern();
        });
        return b;
      });
      s.beiAenderung(() => knoepfe.forEach((b, i) => { b.classList.toggle('aktiv', aktuell() === i); b.setAttribute('aria-pressed', String(aktuell() === i)); }));
      gruppe.append(...knoepfe);
      return el('div', { class: 'smiley-zeile ' + zp }, el('span', { class: 'zp' }, label), gruppe);
    }
    function checkliste() {
      const tabelle = el('table', { class: 'ck-tabelle' },
        el('thead', {}, el('tr', {},
          el('th', {}, LISTE), mitEinschaetzung ? el('th', {}, 'So schätze ich mich ein') : null,
          mitInfo ? el('th', {}, 'Hier finde ich Informationen') : null, el('th', {}, 'Hier kann ich üben'))));
      for (const k of thema.kompetenzen) {
        const gruppe = el('tbody', { class: 'ck-gruppe' + (k.zusatz ? ' zusatz' : '') });
        k.zeilen.forEach((zeile, z) => {
          const id = `${k.id}#${z}`;
          const tr = el('tr', { style: `--zeile:${z}` }, el('td', { class: 'ck-text', html: zeile }));
          if (mitEinschaetzung) {
            tr.append(el('td', { class: 'ck-smileys' }, el('div', { class: 'einschaetzung' }, ...ZEITPUNKTE.map(([zp, label, lang]) => smileyZeile(id, zp, label, lang)))));
          }
          if (z === 0) {
            const n = k.zeilen.length;
            if (mitInfo) tr.append(
              el('td', { class: 'ck-info', rowspan: n },
                ...notizbuchLinks(k.notizbuch),
                k.buch ? el('div', {}, '📘 Buch ' + k.buch) : null,
                !k.notizbuch && !k.buch ? el('span', { class: 'leise' }, '–') : null));
            tr.append(
              el('td', { class: 'ck-ueben', rowspan: n },
                el('div', { class: 'ueben-titel' }, 'Übungen auf dieser Seite:'),
                el('ul', {}, ...k.uebungen.map((u) => el('li', {}, el('a', { href: '#' + uebungId(u), 'data-oeffnen': uebungId(u) }, u.titel)))),
                (k.realmath || []).length ? el('div', { class: 'ueben-titel' }, 'Übungen auf Realmath ↗:') : null,
                ...realmathListe(k, true),
                (k.notizbuchUeben || []).length ? el('div', { class: 'ueben-titel' }, 'Übungen im Notizbuch:') : null,
                ...notizbuchLinks(k.notizbuchUeben)));
          }
          gruppe.append(tr);
        });
        tabelle.append(gruppe);
      }
      tabelle.addEventListener('click', (ev) => {
        const a = ev.target.closest('a[data-oeffnen]');
        if (!a) return;
        const d = document.getElementById(a.dataset.oeffnen);
        if (d && !d.open) { d.open = true; d.dispatchEvent(new Event('toggle')); }
      });
      return el('section', { class: 'kasten', id: 'checkliste' },
        el('h2', {}, mitEinschaetzung ? 'Checkliste: Das muss ich können' : 'Was übe ich hier?'),
        mitEinschaetzung ? datenschutz(['Deine Einschätzung ist nur für dich. ', el('b', {}, 'Sie wird nicht übertragen, dein Lehrer sieht sie nicht.'), ' Sei also ruhig ehrlich zu dir selbst.']) : null,
        el('div', { class: 'tabelle-scroll' }, tabelle),
        thema.kompetenzen.some((k) => k.zusatz) ? el('p', { class: 'leise klein' }, 'Grau hinterlegt: zusätzliche Übung, steht nicht auf dem Kompetenzbogen.') : null,
        thema.kurs ? el('p', { class: 'leise klein' }, `Die Notizbuch-Links führen in das Klassennotizbuch ${thema.kurs} und funktionieren nur, wenn du mit deinem Schulkonto angemeldet bist.`) : null);
    }
    // ---------- Übungen ----------
    function kompetenzAbschnitt(k, nr) {
      const realmath = (k.realmath || []).length
        ? el('details', { class: 'realmath' },
            el('summary', {}, el('span', { class: 'titel' }, 'Weitere Übungen auf Realmath'), el('span', { class: 'extern' }, 'externe Seite ↗')),
            el('div', { class: 'rm-inhalt' }, ...realmathListe(k, false)))
        : null;
      return el('section', { class: 'kompetenz', id: k.id },
        el('h2', {}, el('span', { class: 'nr' }, String(nr + 1)), el('span', {}, 'Übungen zu: ', el('span', { html: k.zeilen.join(' ').replace(/\s*…\s*…\s*/g, ' … ') }))),
        ...k.uebungen.map((u) => uebungKarte(k, u)),
        realmath);
    }

    function uebungKarte(k, u) {
      const schluessel = `${u.gen}`;
      const zaehler = el('span', { class: 'zaehler' });
      const flaeche = el('div', { class: 'flaeche' });
      let stufe = 1;
      const stufenKnoepfe = STUFEN.map(([n, farbe, t]) => {
        const b = el('button', { type: 'button', class: `stufe ${farbe}` + (n === 1 ? ' aktiv' : ''), 'aria-pressed': n === 1 ? 'true' : 'false' }, ampel(n), t);
        b.addEventListener('click', () => {
          stufe = n;
          stufenKnoepfe.forEach((x, i) => { x.classList.toggle('aktiv', i + 1 === n); x.setAttribute('aria-pressed', String(i + 1 === n)); });
          neu();
        });
        return b;
      });
      function zaehlerText() {
        const g = s.daten.geloest[schluessel] || {};
        const teile = [1, 2, 3].filter((n) => g[n]).map((n) => `${STUFEN[n - 1][2]}: ${g[n]}`);
        zaehler.textContent = teile.length ? '✔ gelöst – ' + teile.join(' · ') : '';
      }
      function neu() {
        const aufgabe = UM.generatoren[u.gen](stufe);
        UM.zeigeAufgabe(flaeche, aufgabe, {
          modus: 'uebung',
          neu,
          beiPruefung(richtig) {
            if (!richtig) return;
            const g = (s.daten.geloest[schluessel] = s.daten.geloest[schluessel] || {});
            g[stufe] = (g[stufe] || 0) + 1;
            s.sichern();
            zaehlerText();
          },
        });
      }
      zaehlerText();
      const karte = el('details', { class: 'uebung', id: uebungId(u) },
        el('summary', {}, el('span', { class: 'titel' }, el('span', { class: 'etikett' }, 'Übung'), u.titel), zaehler),
        el('div', { class: 'stufen', role: 'group', 'aria-label': 'Schwierigkeit' }, el('span', { class: 'stufen-label' }, 'Schwierigkeit:'), ...stufenKnoepfe),
        flaeche);
      karte.addEventListener('toggle', () => { if (karte.open && !flaeche.firstChild) neu(); });
      return karte;
    }

    // ---------- Abschlusstest ----------
    function testAbschnitt() {
      const flaeche = el('div', { class: 'test-flaeche' });
      const start = el('button', { type: 'button', class: 'knopf haupt' }, 'Test starten');
      start.addEventListener('click', baueTest);
      return el('section', { class: 'kasten test', id: 'abschlusstest' },
        el('h2', {}, 'Abschlusstest'),
        datenschutz(['Der Test wird nicht benotet. ', el('b', {}, 'Dein Ergebnis wird nicht übertragen, dein Lehrer sieht es nicht.'), ' Er zeigt nur dir, was du noch üben solltest.']),
        el('p', {}, `Zu jedem Punkt ${mitEinschaetzung ? 'der Checkliste' : 'der Liste'} bekommst du ${thema.test.anzahlProKompetenz === 1 ? 'eine Aufgabe' : thema.test.anzahlProKompetenz + ' Aufgaben'}. Die Aufgaben sind mittel (gelb) oder schwierig (rot). Bearbeite alle Aufgaben ohne Hilfe – Nebenrechnungen ins Heft oder auf das iPad – und klicke dann auf „Auswerten“. Danach siehst du, was du noch üben solltest. Jeder Test ist neu zusammengestellt.`),
        start, flaeche);

      function baueTest() {
        const eintraege = [];
        for (const k of thema.kompetenzen) {
          const pool = UM.zufall.mische(k.uebungen.filter((u) => u.imTest !== false));
          for (let i = 0; i < thema.test.anzahlProKompetenz && i < pool.length; i++) {
            const stufe = UM.zufall.wahl(thema.test.stufen || [2]);
            eintraege.push({ k, u: pool[i], aufgabe: UM.generatoren[pool[i].gen](stufe) });
          }
        }
        const liste = el('ol', { class: 'test-liste' });
        for (const e of eintraege) {
          const ziel = el('div');
          liste.append(el('li', {}, ziel));
          e.steuerung = UM.zeigeAufgabe(ziel, e.aufgabe, { modus: 'test' });
        }
        const ergebnis = el('div', { class: 'test-ergebnis', 'aria-live': 'polite' });
        const auswerten = el('button', { type: 'button', class: 'knopf haupt' }, 'Auswerten');
        auswerten.addEventListener('click', () => {
          const pro = new Map();
          let richtig = 0;
          for (const e of eintraege) {
            const r = e.steuerung.pruefen().richtig;
            e.steuerung.sperren();
            e.steuerung.zeigeLoesung();
            if (r) richtig++;
            const p = pro.get(e.k) || { r: 0, n: 0 };
            p.n++;
            if (r) p.r++;
            pro.set(e.k, p);
          }
          auswerten.disabled = true;
          s.daten.tests.push({
            datum: heute(), richtig, gesamt: eintraege.length,
            pro: Object.fromEntries([...pro].map(([k, p]) => [k.id, [p.r, p.n]])),
          });
          s.sichern();
          const noch = [...pro].filter(([, p]) => p.r < p.n);
          ergebnis.replaceChildren(
            el('h3', {}, `Ergebnis: ${richtig} von ${eintraege.length} Aufgaben richtig`),
            noch.length
              ? el('div', {}, el('p', {}, 'Diese Punkte solltest du noch einmal üben:'),
                  el('ul', {}, ...noch.map(([k]) => el('li', {}, el('a', { href: '#' + k.id, html: k.zeilen.join(' ').replace(/\s*…\s*…\s*/g, ' … ') })))))
              : el('p', {}, 'Super! Du hast alles richtig. Übe zur Sicherheit noch ein paar Aufgaben der Stufe 3.'),
            el('p', {}, 'Unter jeder Aufgabe findest du jetzt die Lösung. Das Ergebnis wurde in „Mein Lernstand“ eingetragen.'),
          );
          mathe(ergebnis);
          ergebnis.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        flaeche.replaceChildren(ergebnis, liste, auswerten);
        start.textContent = 'Neuen Test starten';
        mathe(flaeche);
      }
    }

    // ---------- Mein Lernstand: vorher/nachher, Übungen, Tests; druckbar ----------
    function lernstand() {
      const inhalt = el('div', { class: 'lernstand-inhalt' });
      const name = el('input', { type: 'text', class: 'eingabe breit', placeholder: 'Dein Name (wird nicht gespeichert)', 'aria-label': 'Name für den Ausdruck', autocomplete: 'off' });
      const drucken = el('button', { type: 'button', class: 'knopf haupt' }, '🖨️ Als PDF speichern / drucken');
      drucken.addEventListener('click', () => {
        document.body.classList.add('druck-lernstand');
        const weg = () => { document.body.classList.remove('druck-lernstand'); global.removeEventListener('afterprint', weg); };
        global.addEventListener('afterprint', weg);
        global.print();
        setTimeout(weg, 1000);
      });
      const loeschen = el('button', { type: 'button', class: 'knopf' }, 'Alles zurücksetzen');
      const sicher = el('span', { class: 'rueckfrage', hidden: true }, 'Wirklich alles löschen? ',
        el('button', { type: 'button', class: 'knopf klein', onclick: () => { s.loeschen(); sicher.hidden = true; } }, 'Ja, löschen'), ' ',
        el('button', { type: 'button', class: 'knopf klein', onclick: () => { sicher.hidden = true; } }, 'Abbrechen'));
      loeschen.addEventListener('click', () => { sicher.hidden = false; });

      function smiley(i) { return i == null ? el('span', { class: 'leise' }, '–') : el('span', { class: 'ls-smiley', title: SMILEYS[i][1] }, SMILEYS[i][0]); }
      function zeichne() {
        const tabelle = el('table', { class: 'ls-tabelle' },
          el('thead', {}, el('tr', {}, el('th', {}, LISTE), mitEinschaetzung ? el('th', {}, 'vorher') : null, mitEinschaetzung ? el('th', {}, 'nachher') : null,
            el('th', {}, 'Gelöste Übungen'), el('th', {}, 'Letzter Test'))));
        const letzter = s.daten.tests[s.daten.tests.length - 1];
        for (const k of thema.kompetenzen) {
          const tb = el('tbody', { class: 'ls-gruppe' });
          const geloest = [1, 2, 3].map((n) => k.uebungen.reduce((sum, u) => sum + ((s.daten.geloest[u.gen] || {})[n] || 0), 0));
          const test = letzter && letzter.pro[k.id];
          k.zeilen.forEach((zeile, z) => {
            const e = s.daten.selbst[`${k.id}#${z}`] || {};
            const tr = el('tr', {}, el('td', { html: zeile }));
            if (mitEinschaetzung) tr.append(el('td', { class: 'mitte' }, smiley(e.vorher)), el('td', { class: 'mitte' }, smiley(e.nachher)));
            if (z === 0) {
              tr.append(
                el('td', { rowspan: k.zeilen.length, class: 'ls-geloest' },
                  ...STUFEN.map(([n, , t]) => el('div', {}, ampel(n), ` ${t}: ${geloest[n - 1]}`))),
                el('td', { rowspan: k.zeilen.length, class: 'mitte' },
                  test ? el('span', { class: test[0] === test[1] ? 'ok-text' : 'falsch-text' }, `${test[0] === test[1] ? '✔' : '✘'} ${test[0]}/${test[1]}`) : el('span', { class: 'leise' }, '–')));
            }
            tb.append(tr);
          });
          tabelle.append(tb);
        }
        const daten = Object.values(s.daten.selbst);
        const datumV = daten.map((e) => e.vorherDatum).filter(Boolean)[0];
        const datumN = daten.map((e) => e.nachherDatum).filter(Boolean).pop();
        const tests = s.daten.tests;
        inhalt.replaceChildren(
          el('p', { class: 'nur-druck ls-kopf' }, `${thema.fach} · ${thema.stufe} · ${thema.titel}${thema.kurs ? ' · ' + thema.kurs : ''}`, el('br'),
            'Name: ', el('b', {}, name.value || '______________________'), ` · Stand: ${heute()}`),
          ...(mitEinschaetzung ? [el('p', { class: 'leise klein' }, `Einschätzung vorher: ${datumV || 'noch nicht'} · nachher: ${datumN || 'noch nicht'}`)] : []),
          el('div', { class: 'tabelle-scroll' }, tabelle),
          el('h3', {}, 'Abschlusstests'),
          tests.length
            ? el('ol', { class: 'ls-tests' }, ...tests.map((t) => el('li', {}, `${t.datum}: ${t.richtig} von ${t.gesamt} richtig`)))
            : el('p', { class: 'leise' }, 'Noch kein Abschlusstest gemacht.'),
        );
        mathe(inhalt);
      }
      s.beiAenderung(zeichne);
      name.addEventListener('input', zeichne);
      zeichne();
      return el('section', { class: 'kasten', id: 'lernstand' },
        el('h2', {}, 'Mein Lernstand'),
        datenschutz(['Dein Lernstand ist nur in diesem Browser gespeichert. ', el('b', {}, 'Dein Lehrer sieht ihn nur, wenn du das PDF selbst in dein Notizbuch legst'), ' – dort kann er es wie alle deine Notizbuchseiten sehen.']),
        el('p', { class: 'nicht-druck' }, mitEinschaetzung ? 'Hier siehst du deine Einschätzung vorher und nachher, wie viele Übungen du gelöst hast und deine Abschlusstests. ' : 'Hier siehst du, wie viele Übungen du gelöst hast, und deine Abschlusstests. ',
          el('b', {}, 'Sichere deinen Lernstand als PDF in deinem Notizbuch'), ' – im Browser gespeicherte Daten können verloren gehen (z. B. wenn du die Seite länger nicht besuchst oder ein anderes Gerät nutzt).'),
        el('details', { class: 'nicht-druck anleitung-pdf' }, el('summary', {}, 'So legst du das PDF in OneNote ab'),
          el('ol', {},
            el('li', {}, 'Tippe auf „Als PDF speichern / drucken“.'),
            el('li', {}, 'iPad: Im Druckfenster oben auf das Teilen-Symbol tippen → „In Dateien sichern“. Computer: als Drucker „Als PDF speichern“ wählen.'),
            el('li', {}, 'In OneNote auf deiner Seite im Klassennotizbuch: Einfügen → Datei → das PDF auswählen → „Als Ausdruck einfügen“.'))),
        el('div', { class: 'aktionen nicht-druck' }, name, drucken, loeschen, sicher),
        inhalt);
    }
  }

  UM.starteThema = starte;
})(typeof window !== 'undefined' ? window : globalThis);
