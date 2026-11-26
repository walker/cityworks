'use strict';
// Live contract check.
//
// Replays the requests recorded from the mocked tests (live/contracts.json) against a real Cityworks instance and reports where the
// live API behaves differently from what the mocks assume. See the "Live contract check" section of the README.
//
//   npm run contracts     re-record live/contracts.json from the mocked tests
//   npm run test:live     run this file against the instance configured in .env
//
// Only read-only endpoints are replayed. Anything that could change data (add/update/delete/move/...), and anything not recognised as
// read-only, is skipped and listed in the summary. Replayed payloads use the dummy ids from the mocked tests, so "not found" style API
// errors are expected and count as the endpoint being reachable.
require('dotenv').config({quiet: true, debug: false});
const fs = require('fs');
const path = require('path');
const assert = require('chai').assert;
const cw = require('../dist/index.js');

const REQUIRED_ENV = ['cwdomain', 'cwlogin', 'cwpassword'];
const missingEnv = REQUIRED_ENV.filter(k => !process.env[k]);
const contractsFile = path.join(__dirname, 'contracts.json');
const contracts = fs.existsSync(contractsFile) ? JSON.parse(fs.readFileSync(contractsFile, 'utf8')) : {endpoints: {}};

const MUTATING = /^(Add|Create|Update|Delete|Remove|Move|Cancel|Uncancel|Close|ReOpen|Reopen|Set|Attach|Detach|Sync|Revoke|Authenticate|Save|Change|Combine|Clone|Copy|Execute|Lock|Unlock|Make|Apply|Assign|Upload|Enable|Disable|Reset|Clear|FindReplace|Print|Download|Check|Release|Refund|Mark|Insert|Submit|Complete|Reassign|Purge|Import|Send|Post|Process|Rollback)|Viewed$/;
const READ_ONLY = /^(All|Get\w*|By\w*|\w*By[A-Z]\w*|Search\w*|\w*Search|List\w*|\w*List|\w*Types?|\w*Schema|\w*TypeInformation|SavedQueries|Definitions?|DefinitionNames|DisplayFields|\w*Saved|User|UserWatching|Holidays|Keywords|Problems\w*|Priorities|Templates?\w*|QA|CustomFields|AuditLog|Answers|\w*Questions|CallerQuestions\w*|CostCodes|JobCodes|Validate\w*|Query|RunById|Builder|Notifications?|\w*History|\w*Fields|WorkOrderEntity|RecentActivity|Details?)$/;
const extraReadOnly = (process.env.CW_LIVE_READONLY || '').split(',').map(s => s.trim()).filter(Boolean);

function classify(servicePath) {
  if(extraReadOnly.indexOf(servicePath) > -1) return 'read';
  if(/\/Authentication\//.test(servicePath) || /\/Token\//.test(servicePath)) return 'mutating';
  const segment = servicePath.split('/').pop();
  if(MUTATING.test(segment)) return 'mutating';
  if(READ_ONLY.test(segment)) return 'read';
  return 'unclassified';
}

function typeOf(v) {
  if(v === null) return 'null';
  if(Array.isArray(v)) return 'array';
  return typeof v;
}

function keysOf(v) {
  const sample = Array.isArray(v) ? v[0] : v;
  return sample && typeof sample === 'object' ? Object.keys(sample).sort() : [];
}

describe('[Live contract] mocked expectations vs the live Cityworks API', function() {
  this.timeout(60000);
  const summary = {checked: 0, ok: 0, reachableOnly: 0, differs: [], failed: [], keyWarnings: [], skippedMutating: [], unclassified: []};

  before(function() {
    if(missingEnv.length > 0) {
      console.log('\n  Live contract tests skipped: set ' + missingEnv.join(', ') + ' (and optionally cwpath, cwversion) in .env');
      this.skip();
    }
    if(Object.keys(contracts.endpoints).length === 0) {
      console.log('\n  No contracts recorded yet: run `npm run contracts` first');
      this.skip();
    }
    cw.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion ? Number(process.env.cwversion) : undefined});
    return cw.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword);
  });

  Object.keys(contracts.endpoints).sort().forEach(servicePath => {
    const kind = classify(servicePath);
    contracts.endpoints[servicePath].forEach(entry => {
      const title = servicePath + '  {' + entry.signature + '}';

      it(title, async function() {
        if(kind !== 'read') {
          (kind === 'mutating' ? summary.skippedMutating : summary.unclassified).push(servicePath);
          this.skip();
        }
        summary.checked++;
        let live;
        try {
          live = await cw.Cityworks.runRequest(servicePath, entry.payload);
        } catch(e) {
          const code = e && e.Code;
          const message = (e && (e.Message || e.message)) || String(e);
          if(code === 1) {
            // The API answered with an error status: the endpoint exists and parsed the request; dummy ids are usually why it said no
            summary.reachableOnly++;
            console.log('      reachable, API rejected the mocked payload: ' + message);
            return;
          }
          const reason = code === 2 ? 'unauthorized (check the account\'s permissions)' : code === 3 ? 'invalid credentials' : [5, 6, 7].indexOf(code) > -1 ? 'endpoint missing or did not return JSON' : 'request failed';
          summary.failed.push({path: servicePath, reason: reason + ': ' + message});
          assert.fail(servicePath + ' ' + reason + ': ' + message);
        }

        const liveValue = live === true ? true : live && live.Value;
        const liveType = liveValue === true && live === true ? 'boolean' : typeOf(liveValue);
        const expected = entry.expected;

        if(expected.type !== 'null' && liveType !== 'null' && liveType !== expected.type) {
          summary.differs.push({path: servicePath, mocked: expected.type, live: liveType});
          assert.fail(servicePath + ': mocked tests expect a ' + expected.type + ' but the live API returned a ' + liveType);
        }

        const liveKeys = keysOf(liveValue);
        const missing = liveKeys.length > 0 ? expected.keys.filter(k => liveKeys.indexOf(k) === -1) : [];
        if(missing.length > 0) {
          summary.keyWarnings.push({path: servicePath, missing: missing});
          console.log('      note: mocked response keys not in the live response: ' + missing.join(', '));
          if(process.env.CW_LIVE_STRICT_KEYS) {
            assert.fail(servicePath + ': live response is missing keys the mocks assume: ' + missing.join(', '));
          }
        }
        summary.ok++;
      });
    });
  });

  after(function() {
    if(missingEnv.length > 0 || summary.checked === 0) return;
    const uniq = (list) => Array.from(new Set(list)).sort();
    console.log('\n  ---- Live contract summary ----');
    console.log('  replayed (read-only): ' + summary.checked + ', matched: ' + summary.ok + ', reachable but API rejected dummy payload: ' + summary.reachableOnly);
    if(summary.differs.length) {
      console.log('\n  Differs from the mocked expectation (' + summary.differs.length + '):');
      summary.differs.forEach(d => console.log('    ' + d.path + ': mocked ' + d.mocked + ', live ' + d.live));
    }
    if(summary.failed.length) {
      console.log('\n  Failed (' + summary.failed.length + '):');
      summary.failed.forEach(f => console.log('    ' + f.path + ': ' + f.reason));
    }
    if(summary.keyWarnings.length) {
      console.log('\n  Mocked keys not present in live responses (' + summary.keyWarnings.length + ') - may just be invented mock data');
    }
    console.log('\n  Not replayed: ' + uniq(summary.skippedMutating).length + ' mutating endpoints, ' + uniq(summary.unclassified).length + ' unclassified');
    if(summary.unclassified.length) {
      console.log('  Unclassified (add safe ones to CW_LIVE_READONLY=path1,path2): ' + uniq(summary.unclassified).join(', '));
    }
    fs.writeFileSync(path.join(__dirname, 'report.json'), JSON.stringify({generated: new Date().toISOString(), summary: {
      checked: summary.checked, ok: summary.ok, reachableOnly: summary.reachableOnly, differs: summary.differs, failed: summary.failed,
      keyWarnings: summary.keyWarnings, skippedMutating: uniq(summary.skippedMutating), unclassified: uniq(summary.unclassified)
    }}, null, 2) + '\n');
  });
});
