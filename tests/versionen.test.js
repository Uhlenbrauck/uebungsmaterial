'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { seiten, mitVersionen } = require('../werkzeuge/versionen.js');

test('Versionsnummern der eingebundenen Dateien sind aktuell (sonst: npm run versionen)', () => {
  for (const s of seiten()) {
    const { html, neu, fehlend } = mitVersionen(s);
    const name = path.relative(path.join(__dirname, '..'), s);
    assert.deepEqual(fehlend, [], `${name}: eingebundene Datei fehlt`);
    assert.equal(html, neu, `${name}: Versionsnummern veraltet – bitte „npm run versionen“ ausführen`);
  }
});
