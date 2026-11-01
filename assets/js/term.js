/*
 * Kleine Termbäume: exakter Wert und TeX aus derselben Struktur.
 * So können Aufgabe, Lösung und Ergebnis nicht auseinanderlaufen.
 *
 * Knoten:
 *   zahl    { art:'zahl', wert:Bruch, stil, plus }   plus = "+3" ausdrücklich schreiben
 *   op      { art:'op', op:'+'|'-'|'*'|':', l, r }
 *   klammer { art:'klammer', inhalt }
 *   betrag  { art:'betrag', inhalt }
 *   neg     { art:'neg', inhalt }                    −(…) bzw. −|…|
 * Klammern um Rechenausdrücke werden NICHT automatisch gesetzt (immer mit K()),
 * Klammern um Zahlen mit Vorzeichen schon.
 */
(function (global) {
  'use strict';
  const UM = (global.UM = global.UM || {});
  const { Bruch } = UM;

  const Z = (w, stil = 'auto', plus = false) => {
    const wert = typeof w === 'string' ? Bruch.dez(w) : Bruch.von(w);
    if (stil === 'auto') stil = typeof w === 'string' ? 'dezimal' : 'bruch';
    return { art: 'zahl', wert, stil, plus };
  };
  const op = (o) => (l, r) => ({ art: 'op', op: o, l, r });
  const T = { Z, plus: op('+'), minus: op('-'), mal: op('*'), durch: op(':') };
  T.K = (inhalt) => ({ art: 'klammer', inhalt });
  T.B = (inhalt) => ({ art: 'betrag', inhalt });
  T.N = (inhalt) => ({ art: 'neg', inhalt });
  /** Kette: T.kette(a, '+', b, '-', c) → ((a+b)-c) */
  T.kette = (...teile) => {
    let k = teile[0];
    for (let i = 1; i < teile.length; i += 2) k = op(teile[i])(k, teile[i + 1]);
    return k;
  };

  function wert(k) {
    switch (k.art) {
      case 'zahl': return k.wert;
      case 'klammer': return wert(k.inhalt);
      case 'betrag': return wert(k.inhalt).abs();
      case 'neg': return wert(k.inhalt).neg();
      case 'op': {
        const a = wert(k.l);
        const b = wert(k.r);
        return k.op === '+' ? a.plus(b) : k.op === '-' ? a.minus(b) : k.op === '*' ? a.mal(b) : a.durch(b);
      }
      default: throw new Error('Unbekannter Knoten ' + k.art);
    }
  }

  function zahlTex(k) {
    const t = k.wert.tex(k.stil);
    return k.plus && k.wert.z > 0 ? '+' + t : t;
  }
  const istBruchartig = (k) => k.art === 'zahl' && !k.wert.istGanz() && k.stil !== 'dezimal';
  const klammer = (inner, gross) => (gross ? `\\left(${inner}\\right)` : `(${inner})`);

  /** vorne = steht am Anfang des Terms bzw. direkt nach einer öffnenden Klammer */
  function tex(k, vorne = true) {
    switch (k.art) {
      case 'zahl': {
        const t = zahlTex(k);
        const mitVz = k.wert.z < 0 || (k.plus && k.wert.z > 0);
        return !vorne && mitVz ? klammer(t, istBruchartig(k)) : t;
      }
      case 'klammer': return klammer(tex(k.inhalt, true), enthaeltBruch(k.inhalt));
      case 'betrag': return `\\left|${tex(k.inhalt, true)}\\right|`;
      case 'neg': {
        const t = `-${tex(k.inhalt, false)}`;
        return vorne ? t : klammer(t, enthaeltBruch(k.inhalt));
      }
      case 'op': {
        const punkt = (o) => o === '*' || o === ':';
        if (k.r.art === 'op' && !(!punkt(k.op) && punkt(k.r.op))) throw new Error('Klammer fehlt (rechts)');
        if (k.l.art === 'op' && punkt(k.op) && !punkt(k.l.op)) throw new Error('Klammer fehlt (links)');
        const zeichen = { '+': '+', '-': '-', '*': '\\cdot ', ':': ':' }[k.op];
        return `${tex(k.l, vorne)}${zeichen}${tex(k.r, false)}`;
      }
      default: throw new Error('Unbekannter Knoten ' + k.art);
    }
  }
  function enthaeltBruch(k) {
    if (istBruchartig(k)) return true;
    if (k.inhalt) return enthaeltBruch(k.inhalt);
    if (k.l) return enthaeltBruch(k.l) || enthaeltBruch(k.r);
    return false;
  }

  /**
   * Klammerfreie Schreibweise einer Summe aus Zahlen mit Vorzeichen:
   * summanden = [Bruch …], stil wie bei tex. Beispiel [-3, 5, -2] → "-3+5-2"
   */
  function summeTex(summanden, stil = 'bruch') {
    return summanden
      .map((b, i) => {
        const t = Bruch.von(b).abs().tex(stil);
        if (i === 0) return Bruch.von(b).z < 0 ? '-' + t : t;
        return (Bruch.von(b).z < 0 ? '-' : '+') + t;
      })
      .join('');
  }

  UM.T = T;
  UM.term = { wert, tex, summeTex };
})(typeof window !== 'undefined' ? window : globalThis);
