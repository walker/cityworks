'use strict';
// Records every request the wrappers make in the mocked tests, together with the (mocked) response each test expected.
// The result (live/contracts.json) is what live/liveContract.cjs replays against a real Cityworks instance.
// Enabled with CW_RECORD_CONTRACTS=1 (see `npm run contracts`).
const fs = require('fs');
const path = require('path');

const enabled = !!process.env.CW_RECORD_CONTRACTS;
const OUT = path.join(__dirname, '..', 'live', 'contracts.json');
const MAX_VARIANTS_PER_PATH = 3;
const entries = {};

function typeOf(v) {
  if(v === null) return 'null';
  if(Array.isArray(v)) return 'array';
  return typeof v;
}

function keysOf(v) {
  const sample = Array.isArray(v) ? v[0] : v;
  return sample && typeof sample === 'object' ? Object.keys(sample).sort() : [];
}

// A payload's "signature" is its sorted top-level keys; one sample per signature is kept
function record(servicePath, payload, response, testTitle) {
  if(!enabled) return;
  const sig = payload && typeof payload === 'object' ? Object.keys(payload).sort().join(',') : String(payload);
  const list = entries[servicePath] = entries[servicePath] || [];
  const existing = list.find(e => e.signature === sig);
  if(existing) {
    if(testTitle && existing.tests.length < 3 && existing.tests.indexOf(testTitle) === -1) existing.tests.push(testTitle);
    return;
  }
  if(list.length >= MAX_VARIANTS_PER_PATH) return;
  list.push({
    signature: sig,
    payload: payload === undefined ? null : JSON.parse(JSON.stringify(payload)),
    expected: {type: typeOf(response), keys: keysOf(response)},
    tests: testTitle ? [testTitle] : []
  });
}

if(enabled) {
  process.on('exit', () => {
    const out = {generated: new Date().toISOString(), endpoints: entries};
    fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
    console.log('\nRecorded ' + Object.keys(entries).length + ' endpoints to ' + path.relative(process.cwd(), OUT));
  });
}

module.exports = { record, typeOf, keysOf, enabled };
