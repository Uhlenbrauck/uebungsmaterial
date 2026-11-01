/*
 * Darstellung und Prüfung einer Aufgabe (Format: siehe generatoren/*.js).
 *
 *   const a = UM.zeigeAufgabe(element, aufgabe, { modus: 'uebung' | 'test', beiPruefung })
 *   a.pruefen()       → { richtig: boolean }
 *   a.zeigeLoesung()
 */
(function (global) {
  'use strict';
  const UM = (global.UM = global.UM || {});
  const doc = global.document;

  // ---------- Hilfen ----------
  function el(tag, attr = {}, ...kinder) {
    const e = doc.createElement(tag);
    for (const [k, v] of Object.entries(attr)) {
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
    }
    for (const k of kinder.flat()) if (k != null) e.append(k.nodeType ? k : doc.createTextNode(k));
    return e;
  }
  UM.el = el;

  /** $…$ im Element mit KaTeX setzen */
  function mathe(e) {
    if (global.renderMathInElement) {
      global.renderMathInElement(e, { delimiters: [{ left: '$', right: '$', display: false }], throwOnError: false });
    }
    return e;
  }
  UM.mathe = mathe;

  function formel(tex, display = true) {
    const e = el('div', { class: display ? 'term' : 'formel' });
    if (global.katex) global.katex.render(tex, e, { displayMode: display, throwOnError: false });
    else e.textContent = tex;
    return e;
  }

  const MELDUNG = {
    unlesbar: 'Diese Eingabe verstehe ich nicht. Beispiele: −3,5 oder −7/4 oder −1 3/4',
    falsch: 'Das stimmt noch nicht.',
    kuerzen: 'Der Wert stimmt, aber der Bruch ist noch nicht vollständig gekürzt.',
    klammer: 'Schreibe die Rechnung ganz ohne Klammern, z. B. −3 + 5 − 2,5',
    summeUnlesbar: 'Schreibe nur Zahlen mit + und −, z. B. −3 + 5 − 2,5',
    leer: 'Hier fehlt noch etwas.',
  };

  // ---------- Felder ----------
  function zahlFeld(f, kontext, summe = false) {
    const input = el('input', {
      type: 'text', class: 'eingabe', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false',
      inputmode: 'text', 'aria-label': (f.label || 'Ergebnis').replace(/\$/g, ''),
    });
    if (summe) input.classList.add('breit');
    input.addEventListener('focus', () => { kontext.letztesFeld = input; });
    input.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') kontext.enter(); });
    const label = f.label ? mathe(el('span', { class: 'feld-label', html: /=\$$/.test(f.label) ? f.label : f.label + ':' })) : null;
    const zeile = el('label', { class: 'feld' }, label, input, f.einheit ? el('span', { class: 'einheit' }, f.einheit) : null);
    const meldung = el('div', { class: 'feld-meldung' });
    return {
      knoten: el('div', { class: 'feld-block' }, zeile, meldung),
      pruefen() {
        if (!input.value.trim()) return zeige(false, MELDUNG.leer);
        if (summe) {
          const r = UM.pruefeSumme(input.value, f.antwort);
          return zeige(r.ok, r.ok ? '' : MELDUNG[r.grund === 'unlesbar' ? 'summeUnlesbar' : r.grund]);
        }
        const r = UM.pruefeZahl(input.value, f.antwort, { gekuerzt: f.gekuerzt });
        return zeige(r.ok, r.ok ? '' : MELDUNG[r.grund]);
      },
      sperren() { input.readOnly = true; },
    };
    function zeige(ok, text) {
      zeile.classList.toggle('ok', ok);
      zeile.classList.toggle('falsch', !ok);
      meldung.textContent = text || '';
      return ok;
    }
  }

  let gruppenZaehler = 0;
  function auswahlFeld(f) {
    const name = 'auswahl-' + ++gruppenZaehler;
    const knoepfe = f.optionen.map((o, i) =>
      el('label', { class: 'option' }, el('input', { type: 'radio', name, value: String(i) }), mathe(el('span', { html: o }))),
    );
    const meldung = el('div', { class: 'feld-meldung' });
    const box = el('div', { class: 'auswahl', role: 'radiogroup' }, ...knoepfe);
    return {
      knoten: el('div', { class: 'feld-block' }, f.label ? el('div', { class: 'feld-label' }, f.label + ':') : null, box, meldung),
      pruefen() {
        const gewaehlt = knoepfe.findIndex((k) => k.querySelector('input').checked);
        knoepfe.forEach((k, i) => k.classList.remove('ok', 'falsch'));
        if (gewaehlt < 0) { meldung.textContent = 'Bitte wähle eine Antwort aus.'; return false; }
        const ok = gewaehlt === f.richtig;
        knoepfe[gewaehlt].classList.add(ok ? 'ok' : 'falsch');
        meldung.textContent = ok ? '' : MELDUNG.falsch;
        return ok;
      },
      sperren() { knoepfe.forEach((k) => (k.querySelector('input').disabled = true)); },
    };
  }

  function strahlFeld(f) {
    const box = el('div', { class: 'strahl-interaktiv', html: UM.zahlenstrahl.svg(f.cfg) });
    const svg = box.querySelector('svg');
    const meldung = el('div', { class: 'feld-meldung' });
    const NS = 'http://www.w3.org/2000/svg';
    const marke = doc.createElementNS(NS, 'g');
    marke.setAttribute('class', 'zs-marke');
    svg.append(marke);
    let wert = null;
    let gesperrt = false;
    svg.addEventListener('pointerdown', (ev) => {
      if (gesperrt) return;
      const pt = svg.createSVGPoint();
      pt.x = ev.clientX;
      pt.y = ev.clientY;
      const p = pt.matrixTransform(svg.getScreenCTM().inverse());
      wert = UM.zahlenstrahl.wertAusX(f.cfg, p.x);
      const x = UM.zahlenstrahl.xVon(f.cfg, wert);
      const y = 70;
      marke.innerHTML = `<line x1="${x}" y1="${y - 40}" x2="${x}" y2="${y - 10}"/><polygon points="${x},${y - 6} ${x - 6},${y - 16} ${x + 6},${y - 16}"/><text x="${x}" y="${y - 45}">${f.text || ''}</text>`;
      meldung.textContent = '';
      box.classList.remove('ok', 'falsch');
    });
    return {
      knoten: el('div', { class: 'feld-block' }, box, meldung),
      pruefen() {
        if (wert === null) { meldung.textContent = 'Setze zuerst den Pfeil.'; return false; }
        const ok = wert.gleich(f.ziel);
        box.classList.toggle('ok', ok);
        box.classList.toggle('falsch', !ok);
        meldung.textContent = ok ? '' : `Der Pfeil steht bei ${UM.zahlenstrahl.standardText(wert)}. ${MELDUNG.falsch}`;
        return ok;
      },
      sperren() { gesperrt = true; },
    };
  }

  function mengenFeld(f) {
    const mengen = [['N', 'ℕ'], ['Z', 'ℤ'], ['Q', 'ℚ']];
    const kaestchen = {};
    const kopf = el('tr', {}, el('th', {}, ''), ...f.zahlen.map((z) => el('th', {}, formel(z.tex, false))));
    const zeilen = mengen.map(([m, zeichen]) =>
      el('tr', {}, el('th', { scope: 'row' }, zeichen), ...f.zahlen.map((z, i) => {
        const cb = el('input', { type: 'checkbox', 'aria-label': `${zeichen} für Zahl ${i + 1}` });
        kaestchen[m + i] = cb;
        return el('td', {}, el('label', { class: 'kreuz' }, cb));
      })),
    );
    const tabelle = el('table', { class: 'mengen' }, el('thead', {}, kopf), el('tbody', {}, ...zeilen));
    const meldung = el('div', { class: 'feld-meldung' });
    return {
      knoten: el('div', { class: 'feld-block' }, el('div', { class: 'tabelle-scroll' }, tabelle), meldung),
      pruefen() {
        let alle = true;
        f.zahlen.forEach((z, i) => {
          for (const [m] of mengen) {
            const ok = kaestchen[m + i].checked === z[m];
            kaestchen[m + i].closest('td').classList.toggle('falsch', !ok);
            kaestchen[m + i].closest('td').classList.toggle('ok', ok);
            alle = alle && ok;
          }
        });
        meldung.textContent = alle ? '' : 'Mindestens ein Kästchen stimmt noch nicht (rot markiert).';
        return alle;
      },
      sperren() { Object.values(kaestchen).forEach((c) => (c.disabled = true)); },
    };
  }

  // ---------- Aufgabe ----------
  function zeigeAufgabe(ziel, aufgabe, optionen = {}) {
    const modus = optionen.modus || 'uebung';
    const kontext = { letztesFeld: null, enter: () => pruefen() };
    const felder = aufgabe.felder.map((f) =>
      f.art === 'zahl' ? zahlFeld(f, kontext) : f.art === 'summe' ? zahlFeld(f, kontext, true) : f.art === 'auswahl' ? auswahlFeld(f) : f.art === 'strahl' ? strahlFeld(f) : mengenFeld(f),
    );
    const hatZahl = aufgabe.felder.some((f) => f.art === 'zahl' || f.art === 'summe');
    const rueck = el('div', { class: 'rueckmeldung', 'aria-live': 'polite' });
    const loesung = el('div', { class: 'loesung', hidden: true });
    const tipp = el('div', { class: 'tipp', hidden: true }, aufgabe.hinweis ? mathe(el('p', { html: '💡 ' + aufgabe.hinweis })) : null);

    const tastatur = hatZahl
      ? el('div', { class: 'mini-tastatur', 'aria-label': 'Sonderzeichen' },
          ...[['−', '-'], ['/', '/'], [',', ','], ['Leer', ' ']].map(([t, z]) =>
            el('button', { type: 'button', class: 'taste', title: z === ' ' ? 'Leerzeichen (für gemischte Zahlen wie 1 3/4)' : '', onclick: (ev) => { ev.preventDefault(); einfuegen(z); } }, t)))
      : null;
    function einfuegen(z) {
      const i = kontext.letztesFeld || ziel.querySelector('input.eingabe');
      if (!i || i.readOnly) return;
      const a = i.selectionStart ?? i.value.length;
      const b = i.selectionEnd ?? i.value.length;
      i.value = i.value.slice(0, a) + z + i.value.slice(b);
      i.focus();
      i.setSelectionRange(a + z.length, a + z.length);
    }

    const knoepfe = modus === 'uebung'
      ? el('div', { class: 'aktionen' },
          el('button', { type: 'button', class: 'knopf haupt', onclick: () => pruefen() }, 'Prüfen'),
          aufgabe.hinweis ? el('button', { type: 'button', class: 'knopf', onclick: () => { tipp.hidden = !tipp.hidden; } }, 'Tipp') : null,
          el('button', { type: 'button', class: 'knopf', onclick: () => zeigeLoesung() }, 'Lösung zeigen'),
          optionen.neu ? el('button', { type: 'button', class: 'knopf', onclick: optionen.neu }, 'Neue Aufgabe') : null)
      : null;

    ziel.replaceChildren(
      el('div', { class: 'aufgabe' },
        mathe(el('p', { class: 'frage', html: aufgabe.frage })),
        aufgabe.term ? formel(aufgabe.term) : null,
        aufgabe.bild ? el('div', { class: 'bild', html: aufgabe.bild }) : null,
        aufgabe.notiz ? el('p', { class: 'notiz' }, '✏️ Schreibe deine Nebenrechnungen und Zwischenschritte auf – im Heft oder auf dem iPad. Gib dann hier das Ergebnis ein.') : null,
        el('div', { class: 'felder' }, ...felder.map((f) => f.knoten)),
        tastatur, knoepfe, tipp, rueck, loesung),
    );

    let gewertet = false;
    function pruefen() {
      const ergebnisse = felder.map((f) => f.pruefen());
      const richtig = ergebnisse.every(Boolean);
      rueck.className = 'rueckmeldung ' + (richtig ? 'ok' : 'falsch');
      rueck.textContent = richtig ? '✔ Richtig!' : modus === 'uebung' ? '✘ Noch nicht ganz. Versuche es noch einmal oder hol dir einen Tipp.' : '✘ Nicht richtig.';
      if (richtig && modus === 'uebung') felder.forEach((f) => f.sperren());
      if (optionen.beiPruefung && !gewertet) {
        if (richtig) gewertet = true;
        optionen.beiPruefung(richtig);
      }
      return { richtig };
    }
    function zeigeLoesung() {
      if (!loesung.hidden) return;
      loesung.replaceChildren(
        el('h4', {}, 'Lösung'),
        ...aufgabe.loesung.map((l) => (typeof l === 'string' ? mathe(el('p', { html: l })) : el('div', { class: 'bild', html: l.svg }))),
      );
      loesung.hidden = false;
      if (modus === 'uebung') gewertet = true; // nach dem Ansehen der Lösung zählt die Aufgabe nicht mehr
    }
    return { pruefen, zeigeLoesung, sperren: () => felder.forEach((f) => f.sperren()) };
  }

  UM.zeigeAufgabe = zeigeAufgabe;
})(typeof window !== 'undefined' ? window : globalThis);
