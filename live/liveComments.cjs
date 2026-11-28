'use strict';
// Live check that comments work through the wrapper for service requests, work orders and cases (and reports on inspections).
//
//   CW_LIVE_COMMENTS='{"request":123,"workorder":456,"case":789}' npm run test:live:comments
//
// Reads (comments for the record, predefined comments) are always safe. Writing is opt-in: with CW_LIVE_COMMENT_WRITE=1 a clearly labelled
// comment is ADDED to each designated record and then edited. Comments cannot be deleted through the wrapper, so only designate scratch records.
require('dotenv').config({quiet: true, debug: false});
const assert = require('chai').assert;
const cw = require('../dist/index.js');

const missingEnv = ['cwdomain', 'cwlogin', 'cwpassword'].filter(k => !process.env[k]);
let designated = {};
try {
  designated = JSON.parse(process.env.CW_LIVE_COMMENTS || '{}');
} catch(e) {
  designated = null;
}
const write = process.env.CW_LIVE_COMMENT_WRITE === '1';

// [key in CW_LIVE_COMMENTS, label, object]
const targets = [
  ['request', 'Service Request', () => cw.request],
  ['workorder', 'Work Order', () => cw.workorder],
  ['case', '(Brief)Case', () => cw.briefcase]
];

describe('[Live comments] comments against the live Cityworks API', function() {
  this.timeout(60000);

  before(function() {
    if(missingEnv.length > 0) {
      console.log('\n  Skipped: set ' + missingEnv.join(', ') + ' in .env');
      this.skip();
    }
    if(designated === null) {
      throw new Error('CW_LIVE_COMMENTS must be valid JSON like {"request":123,"workorder":456,"case":789}');
    }
    cw.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion ? Number(process.env.cwversion) : undefined});
    return cw.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword);
  });

  targets.forEach(([key, label, owner]) => {
    describe(label + ' comments', function() {
      before(function() {
        if(typeof designated[key] === 'undefined') {
          console.log('\n  ' + label + ': no record designated (add "' + key + '" to CW_LIVE_COMMENTS)');
          this.skip();
        }
      });

      const id = () => designated[key];

      it('get should return the comments for the record (an array, or undefined when it has none)', async () => {
        const r = await owner().comment.get([id()]);
        if(typeof r !== 'undefined') {
          assert.isArray(r, 'comments for a single record should be an array');
        }
      });

      it('get should return a dictionary keyed by record id for several records', async () => {
        const r = await owner().comment.get([id(), id() + 1]);
        assert.isObject(r);
      });

      it('getPredefined should return a collection of comment templates', async () => {
        const r = await owner().comment.getPredefined();
        assert.isArray(r);
      });

      it('add and update should work and be readable back' + (write ? '' : ' (skipped: set CW_LIVE_COMMENT_WRITE=1)'), async function() {
        if(!write) this.skip();
        const text = 'Cityworks wrapper live test ' + new Date().toISOString();
        const added = await owner().comment.add(id(), text);
        assert.isObject(added, 'add should return the comment record');
        assert.property(added, 'CommentId', 'comment record should have a CommentId');
        assert.equal(added.Comments, text);
        if(key === 'case') assert.isFalse(added.IsPublic, 'case comments should be private unless made public deliberately');

        const updatedText = text + ' (edited)';
        // for cases, naming the case keeps the comment's visibility as it is
        const updated = await owner().comment.update(added.CommentId, updatedText, key === 'case' ? {activitySid: id()} : undefined);
        assert.equal(updated.Comments, updatedText);
        assert.property(updated, 'IsPublic');
        assert.equal(updated.Comments, updatedText);

        if(key === 'case') {
          // a public comment stays public when edited without naming a visibility, and only a deliberate isPublic: false makes it private
          const pub = await owner().comment.add(id(), text + ' (public)', true);
          assert.isTrue(pub.IsPublic);
          const kept = await owner().comment.update(pub.CommentId, text + ' (public, edited)', {activitySid: id()});
          assert.isTrue(kept.IsPublic, 'editing a public case comment must leave it public');
          const privated = await owner().comment.update(pub.CommentId, text + ' (now private)', {isPublic: false});
          assert.isFalse(privated.IsPublic);
        }

        const all = await owner().comment.get([id()]);
        const found = (all || []).find(c => c.CommentId === added.CommentId);
        assert.isDefined(found, 'the added comment should be returned by get');
        assert.equal(found.Comments, updatedText);
      });
    });
  });

  describe('Inspection comments', function() {
    it('are not supported by the wrapper yet (no Inspection comment activity type is mapped)', function() {
      assert.isUndefined(cw.inspection.comment);
      this.skip();
    });
  });
});
