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
  const STUFEN = [[1, 'Stufe 1', 'Grundlagen'], [2, 'Stufe 2', 'Standard'], [3, 'Stufe 3', 'Profi']];

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
          el('li', {}, el('b', {}, 'Einschätzen: '), 'Gehe die Checkliste durch und schätze dich ehrlich ein.'),
          el('li', {}, el('b', {}, 'Üben: '), 'Übe vor allem die Punkte, bei denen du unsicher bist. Beginne mit Stufe 1 und steigere dich. Jede Aufgabe ist neu – du kannst beliebig oft üben.'),
          el('li', {}, el('b', {}, 'Testen: '), 'Mache zum Schluss den Abschlusstest. Er zeigt dir, was du noch einmal üben solltest.'))),
      checkliste(),
      ...thema.kompetenzen.map(kompetenzAbschnitt),
      testAbschnitt(),
      el('footer', { class: 'fuss' }, 'Dein Fortschritt wird nur in diesem Browser gespeichert. Es werden keine Daten übertragen.'),
    );
    mathe(haupt);

    // ---------- Checkliste ----------
    function checkliste() {
      const liste = el('div', { class: 'checkliste' });
      for (const k of thema.kompetenzen) {
        const gruppe = el('div', { class: 'ck-gruppe' });
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
          gruppe.append(el('div', { class: 'ck-zeile' },
            el('div', { class: 'ck-text', html: zeile }),
            wahl,
            z === 0 ? el('a', { class: 'knopf klein', href: '#' + k.id }, 'Üben ↓') : el('span')));
        });
        liste.append(gruppe);
      }
      return el('section', { class: 'kasten', id: 'checkliste' }, el('h2', {}, 'Checkliste: Das muss ich können'), liste);
    }

    // ---------- Übungen ----------
    function kompetenzAbschnitt(k, nr) {
      const info = el('div', { class: 'info' },
        k.buch ? el('span', {}, '📘 Buch ' + k.buch) : null,
        ...(k.links || []).map((l) => el('a', { href: l.url, target: '_blank', rel: 'noopener' }, '↗ ' + l.titel)));
      return el('section', { class: 'kompetenz', id: k.id },
        el('h2', {}, el('span', { class: 'nr' }, String(nr + 1)), el('span', { html: k.zeilen[0] })),
        k.zeilen.length > 1 ? el('ul', { class: 'unterpunkte' }, ...k.zeilen.slice(1).map((u) => el('li', { html: u }))) : null,
        info.children.length ? info : null,
        ...k.uebungen.map((u) => uebungKarte(k, u)));
    }

    function uebungKarte(k, u) {
      const schluessel = `${u.gen}`;
      const zaehler = el('span', { class: 'zaehler' });
      const flaeche = el('div', { class: 'flaeche' });
      let stufe = 1;
      const stufenKnoepfe = STUFEN.map(([n, t, beschr]) => {
        const b = el('button', { type: 'button', class: 'stufe' + (n === 1 ? ' aktiv' : ''), title: beschr, 'aria-pressed': n === 1 ? 'true' : 'false' }, t);
        b.addEventListener('click', () => {
          stufe = n;
          stufenKnoepfe.forEach((x, i) => { x.classList.toggle('aktiv', i + 1 === n); x.setAttribute('aria-pressed', String(i + 1 === n)); });
          neu();
        });
        return b;
      });
      function zaehlerText() {
        const g = s.daten.geloest[schluessel] || {};
        const teile = [1, 2, 3].filter((n) => g[n]).map((n) => `Stufe ${n}: ${g[n]}`);
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
      const karte = el('details', { class: 'uebung' },
        el('summary', {}, el('span', { class: 'titel' }, u.titel), zaehler),
        el('div', { class: 'stufen', role: 'group', 'aria-label': 'Schwierigkeit' }, ...stufenKnoepfe),
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
        el('p', {}, `Zu jedem Punkt der Checkliste bekommst du ${thema.test.anzahlProKompetenz === 1 ? 'eine Aufgabe' : thema.test.anzahlProKompetenz + ' Aufgaben'}. Bearbeite alle Aufgaben ohne Hilfe und klicke dann auf „Auswerten“. Danach siehst du, was du noch üben solltest. Jeder Test ist neu zusammengestellt.`),
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
                  el('ul', {}, ...noch.map(([k]) => el('li', {}, el('a', { href: '#' + k.id, html: k.zeilen.join(' ') })))))
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
