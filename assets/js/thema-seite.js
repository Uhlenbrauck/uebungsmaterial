/*
 * Baut eine Themenseite aus UM.thema (siehe mathematik/…/thema.js):
 * Checkliste zur Selbsteinschätzung, Übungen je Kompetenz, Abschlusstest.
 * Der Fortschritt bleibt nur in diesem Browser (localStorage), es werden keine Daten verschickt.
 */
(function (global) {
  'use strict';
  const UM = (global.UM = global.UM || {});
  const { el, mathe } = UM;

  // ---------- Speicher (nur lokal, Fehler werden ignoriert) ----------
  function speicher(id) {
    const schluessel = 'uebungsmaterial:' + id;
    let daten = { selbst: {}, geloest: {} };
    try {
      daten = Object.assign(daten, JSON.parse(global.localStorage.getItem(schluessel)) || {});
    } catch (e) { /* kein Speicher verfügbar */ }
    return {
      daten,
      sichern() {
        try { global.localStorage.setItem(schluessel, JSON.stringify(daten)); } catch (e) { /* egal */ }
      },
    };
  }

  const SMILEYS = [['😰', 'Das kann ich noch gar nicht'], ['🙁', 'Das kann ich nur teilweise'], ['🙂', 'Das kann ich meistens'], ['😄', 'Das kann ich sicher']];
  /** Ampelsystem: grün = leicht, gelb = mittel, rot = schwierig */
  const STUFEN = [[1, 'gruen', 'leicht'], [2, 'gelb', 'mittel'], [3, 'rot', 'schwierig']];
  const uebungId = (u) => 'uebung-' + u.gen;
  const ampel = (n) => el('span', { class: 'ampel ' + STUFEN[n - 1][1], 'aria-hidden': 'true' });

  function starte(thema) {
    const s = speicher(thema.id);
    const haupt = document.getElementById('inhalt');
    document.title = `${thema.titel} – Übungsmaterial`;

    haupt.append(
      el('nav', { class: 'brotkrumen' }, el('a', { href: thema.startseite || '../../../index.html' }, 'Übersicht'), ` › ${thema.fach} › ${thema.stufe}`),
      el('header', { class: 'kopf' }, el('h1', {}, thema.titel), thema.untertitel ? el('p', { class: 'untertitel' }, thema.untertitel) : null),
      el('section', { class: 'kasten anleitung' },
        el('h2', {}, 'So übst du mit dieser Seite'),
        el('ol', {},
          el('li', {}, el('b', {}, 'Einschätzen: '), 'Gehe die Checkliste durch und schätze dich bei jeder Zeile ehrlich ein. Dort findest du auch, wo du im Notizbuch und im Buch nachlesen kannst.'),
          el('li', {}, el('b', {}, 'Üben: '), 'Übe vor allem die Punkte, bei denen du unsicher bist – mit den Übungen auf dieser Seite und den Übungen auf Realmath. Die Aufgaben auf dieser Seite werden jedes Mal neu erzeugt, du kannst also beliebig oft üben.'),
          el('li', {}, el('b', {}, 'Testen: '), 'Mache zum Schluss den Abschlusstest. Er zeigt dir, was du noch einmal üben solltest.')),
        el('p', { class: 'ampel-legende' }, 'Jede Übung gibt es in drei Schwierigkeitsstufen: ',
          ...STUFEN.flatMap(([n, , t], i) => [ampel(n), ` ${t}${i < 2 ? ',  ' : '.'}`]),
          ' Fang mit Grün an und steigere dich.'),
        el('p', {}, '✏️ Schreib bei längeren Aufgaben deine Nebenrechnungen ins Heft oder auf dem iPad mit. Nimm dir dafür ruhig Zeit – so machst du es in der Klassenarbeit auch.')),
      checkliste(),
      ...thema.kompetenzen.map(kompetenzAbschnitt),
      testAbschnitt(),
      el('footer', { class: 'fuss' }, 'Dein Fortschritt wird nur in diesem Browser gespeichert. Es werden keine Daten übertragen.'),
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
    function checkliste() {
      const tabelle = el('table', { class: 'ck-tabelle' },
        el('thead', {}, el('tr', {},
          el('th', {}, 'Das muss ich können'), el('th', {}, 'So schätze ich mich ein'),
          el('th', {}, 'Hier finde ich Informationen'), el('th', {}, 'Hier kann ich üben'))));
      for (const k of thema.kompetenzen) {
        const gruppe = el('tbody', { class: 'ck-gruppe' + (k.zusatz ? ' zusatz' : '') });
        k.zeilen.forEach((zeile, z) => {
          const id = `${k.id}#${z}`;
          const wahl = el('div', { class: 'smileys', role: 'radiogroup', 'aria-label': 'Selbsteinschätzung' },
            ...SMILEYS.map(([sym, t], i) => {
              const aktiv = s.daten.selbst[id] === i;
              const b = el('button', { type: 'button', class: 'smiley' + (aktiv ? ' aktiv' : ''), title: t, 'aria-label': t, 'aria-pressed': String(aktiv) }, sym);
              b.addEventListener('click', () => {
                s.daten.selbst[id] = i;
                s.sichern();
                wahl.querySelectorAll('.smiley').forEach((x, j) => { x.classList.toggle('aktiv', i === j); x.setAttribute('aria-pressed', String(i === j)); });
              });
              return b;
            }));
          const tr = el('tr', { style: `--zeile:${z}` },
            el('td', { class: 'ck-text', html: zeile }),
            el('td', { class: 'ck-smileys' }, wahl));
          if (z === 0) {
            const n = k.zeilen.length;
            tr.append(
              el('td', { class: 'ck-info', rowspan: n },
                ...notizbuchLinks(k.notizbuch),
                k.buch ? el('div', {}, '📘 Buch ' + k.buch) : null,
                !k.notizbuch && !k.buch ? el('span', { class: 'leise' }, '–') : null),
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
        el('h2', {}, 'Checkliste: Das muss ich können'),
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
        el('p', {}, `Zu jedem Punkt der Checkliste bekommst du ${thema.test.anzahlProKompetenz === 1 ? 'eine Aufgabe' : thema.test.anzahlProKompetenz + ' Aufgaben'}. Die Aufgaben sind mittel (gelb) oder schwierig (rot). Bearbeite alle Aufgaben ohne Hilfe – Nebenrechnungen ins Heft oder auf das iPad – und klicke dann auf „Auswerten“. Danach siehst du, was du noch üben solltest. Jeder Test ist neu zusammengestellt.`),
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
          const noch = [...pro].filter(([, p]) => p.r < p.n);
          ergebnis.replaceChildren(
            el('h3', {}, `Ergebnis: ${richtig} von ${eintraege.length} Aufgaben richtig`),
            noch.length
              ? el('div', {}, el('p', {}, 'Diese Punkte solltest du noch einmal üben:'),
                  el('ul', {}, ...noch.map(([k]) => el('li', {}, el('a', { href: '#' + k.id, html: k.zeilen.join(' ').replace(/\s*…\s*…\s*/g, ' … ') })))))
              : el('p', {}, 'Super! Du hast alles richtig. Übe zur Sicherheit noch ein paar Aufgaben der Stufe 3.'),
            el('p', {}, 'Unter jeder Aufgabe findest du jetzt die Lösung.'),
          );
          mathe(ergebnis);
          ergebnis.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        flaeche.replaceChildren(ergebnis, liste, auswerten);
        start.textContent = 'Neuen Test starten';
        mathe(flaeche);
      }
    }
  }

  UM.starteThema = starte;
})(typeof window !== 'undefined' ? window : globalThis);
