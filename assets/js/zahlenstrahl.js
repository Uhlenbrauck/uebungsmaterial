/*
 * Zahlenstrahl als SVG-Text (für Aufgabenbilder, Lösungen und zum Anklicken).
 *
 * cfg = {
 *   min, max            Bereich (Zahlen oder Brüche)
 *   haupt               Abstand der beschrifteten Striche
 *   neben               Abstand der kleinen Striche (Raster zum Anklicken)
 *   beschriftung        optional: Funktion Bruch → Text
 *   pfeile              [{ wert, text, farbe }] rote Pfeile von oben
 *   boegen              [{ von, bis, text }] Pfeilbild (Rechenpfeil)
 *   markierung          { von, bis } farbiger Bereich
 * }
 */
(function (global) {
  'use strict';
  const UM = (global.UM = global.UM || {});
  const { Bruch } = UM;

  const BREITE = 640;
  const RAND = 28;
  const ACHSE_Y = 70;

  const B = (x) => (x instanceof Bruch ? x : typeof x === 'string' ? Bruch.dez(x) : Bruch.von(x));

  function standardText(w) {
    if (w.istGanz()) return String(w.z).replace('-', '−');
    if (w.istEndlichDezimal()) return w.dezText().replace('-', '−');
    return w.text();
  }

  function xVon(cfg, w) {
    const min = B(cfg.min).zahl();
    const max = B(cfg.max).zahl();
    return RAND + ((B(w).zahl() - min) / (max - min)) * (BREITE - 2 * RAND);
  }

  /** Klickposition (in SVG-Koordinaten) → nächster Wert im Nebenraster */
  function wertAusX(cfg, x) {
    const min = B(cfg.min);
    const neben = B(cfg.neben || cfg.haupt);
    const schritte = (B(cfg.max).minus(min).durch(neben)).zahl();
    const anteil = (x - RAND) / (BREITE - 2 * RAND);
    let k = Math.round(anteil * schritte);
    k = Math.max(0, Math.min(Math.round(schritte), k));
    return min.plus(neben.mal(k));
  }

  function striche(cfg, abstand) {
    const out = [];
    const min = B(cfg.min);
    const max = B(cfg.max);
    for (let w = min; w.vgl(max) <= 0; w = w.plus(abstand)) out.push(w);
    return out;
  }

  function svg(cfg) {
    const hoehe = cfg.boegen && cfg.boegen.length ? 120 : 100;
    const y = cfg.boegen && cfg.boegen.length ? ACHSE_Y + 20 : ACHSE_Y;
    const teile = [];
    teile.push(`<svg class="zahlenstrahl" viewBox="0 0 ${BREITE} ${hoehe}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Zahlenstrahl">`);
    if (cfg.markierung) {
      const x1 = xVon(cfg, cfg.markierung.von);
      const x2 = xVon(cfg, cfg.markierung.bis);
      teile.push(`<rect x="${x1}" y="${y - 7}" width="${x2 - x1}" height="14" class="zs-markierung"/>`);
    }
    teile.push(`<line x1="${RAND - 14}" y1="${y}" x2="${BREITE - RAND + 16}" y2="${y}" class="zs-achse"/>`);
    teile.push(`<polygon points="${BREITE - RAND + 20},${y} ${BREITE - RAND + 10},${y - 5} ${BREITE - RAND + 10},${y + 5}" class="zs-spitze"/>`);
    const neben = B(cfg.neben || cfg.haupt);
    const haupt = B(cfg.haupt);
    if (!neben.gleich(haupt)) {
      for (const w of striche(cfg, neben)) {
        const x = xVon(cfg, w);
        teile.push(`<line x1="${x}" y1="${y - 4}" x2="${x}" y2="${y + 4}" class="zs-neben"/>`);
      }
    }
    const text = cfg.beschriftung || standardText;
    for (const w of striche(cfg, haupt)) {
      const x = xVon(cfg, w);
      const null_ = w.z === 0;
      teile.push(`<line x1="${x}" y1="${y - 8}" x2="${x}" y2="${y + 8}" class="zs-haupt${null_ ? ' zs-null' : ''}"/>`);
      teile.push(`<text x="${x}" y="${y + 24}" class="zs-text">${text(w)}</text>`);
    }
    for (const b of cfg.boegen || []) {
      const x1 = xVon(cfg, b.von);
      const x2 = xVon(cfg, b.bis);
      const mitte = (x1 + x2) / 2;
      const hoch = Math.min(45, 18 + Math.abs(x2 - x1) / 6);
      teile.push(`<path d="M ${x1} ${y - 3} Q ${mitte} ${y - 3 - 2 * hoch} ${x2} ${y - 3}" class="zs-bogen"/>`);
      const r = x2 >= x1 ? -1 : 1;
      teile.push(`<polygon points="${x2},${y - 3} ${x2 + r * 9},${y - 10} ${x2 + r * 2},${y - 13}" class="zs-bogen-spitze"/>`);
      if (b.text) teile.push(`<text x="${mitte}" y="${y - hoch - 8}" class="zs-bogen-text">${b.text}</text>`);
    }
    for (const p of cfg.pfeile || []) {
      const x = xVon(cfg, p.wert);
      teile.push(`<line x1="${x}" y1="${y - 40}" x2="${x}" y2="${y - 10}" class="zs-pfeil ${p.farbe || ''}"/>`);
      teile.push(`<polygon points="${x},${y - 6} ${x - 5},${y - 15} ${x + 5},${y - 15}" class="zs-pfeil-spitze ${p.farbe || ''}"/>`);
      if (p.text) teile.push(`<text x="${x}" y="${y - 45}" class="zs-pfeil-text ${p.farbe || ''}">${p.text}</text>`);
    }
    teile.push('</svg>');
    return teile.join('');
  }

  UM.zahlenstrahl = { svg, wertAusX, xVon, BREITE, standardText };
})(typeof window !== 'undefined' ? window : globalThis);
