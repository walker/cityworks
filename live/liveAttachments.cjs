'use strict';
require('dotenv').config({quiet: true, debug: false});
const assert = require('chai').assert;
const fs = require('fs');
const os = require('os');
const path = require('path');
const cw = require('../dist/index.js');

const targets = [
  ['request', () => cw.request],
  ['workorder', () => cw.workorder],
  ['inspection', () => cw.inspection],
  ['case', () => cw.briefcase]
];

function findAttachment(value, id, field) {
  if(!value || typeof value !== 'object') return undefined;
  if(value[field] === id) return value;
  for(const child of Object.values(value)) {
    const found = findAttachment(child, id, field);
    if(found) return found;
  }
}

function findByFilename(value, filename) {
  if(!value || typeof value !== 'object') return undefined;
  if(value.Name === filename || (typeof value.Attachment === 'string' && value.Attachment.split(/[\\/]/).pop() === filename)) return value;
  for(const child of Object.values(value)) {
    const found = findByFilename(child, filename);
    if(found) return found;
  }
}

describe('[Live attachments] multipart uploads', function() {
  this.timeout(60000);
  let designated;
  let directory;
  const verifyOnly = process.env.CW_LIVE_ATTACHMENT_FILENAME !== undefined;
  const filename = process.env.CW_LIVE_ATTACHMENT_FILENAME || 'cityworks-wrapper-upload-' + Date.now() + '.txt';
  const contents = 'Cityworks wrapper multipart upload verification\n' + filename + '\n';

  before(async function() {
    const missing = ['cwdomain', 'cwlogin', 'cwpassword'].filter(k => !process.env[k]);
    if(missing.length || (!verifyOnly && process.env.CW_LIVE_ATTACHMENT_WRITE !== '1')) {
      console.log('\n  Skipped: configure credentials and set CW_LIVE_ATTACHMENT_WRITE=1');
      this.skip();
    }
    assert.match(filename, /^cityworks-wrapper-upload-\d+\.txt$/, 'Filename must identify a wrapper test upload');
    designated = JSON.parse(process.env.CW_LIVE_ATTACHMENTS || '{}');
    assert.isObject(designated, 'CW_LIVE_ATTACHMENTS must be an object of record IDs');
    assert.isTrue(targets.some(([key]) => designated[key] !== undefined), 'Designate at least one record');
    for(const [key] of targets) {
      if(designated[key] !== undefined) {
        assert.isTrue(Number.isSafeInteger(designated[key]) && designated[key] > 0, key + ' must be a positive integer');
      }
    }
    cw.Cityworks.configure(process.env.cwdomain, {
      path: process.env.cwpath || 'cityworks',
      version: process.env.cwversion ? Number(process.env.cwversion) : 23
    });
    try {
      await cw.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword);
    } catch(e) {
      throw new Error('Authentication failed: ' + (e.message || e.Message));
    }
    if(!verifyOnly) {
      directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cityworks-upload-'));
      fs.writeFileSync(path.join(directory, filename), contents);
    }
  });

  after(function() {
    if(directory) {
      fs.unlinkSync(path.join(directory, filename));
      fs.rmdirSync(directory);
    }
  });

  for(const [key, owner] of targets) {
    it(key + (verifyOnly ? ' verifies an existing test upload' : ' uploads, lists, and downloads identical file contents') + ' (attachment retained)', async function() {
      if(designated[key] === undefined) this.skip();
      const id = designated[key];
      try {
        assert.isObject(await owner().getById(id), 'Designated record must exist');
        const attachment = owner().attachments;
        const result = verifyOnly
          ? findByFilename(await attachment.getByNodesId(id), filename)
          : await attachment.add(id, path.join(directory, filename), filename, 'attachment', undefined,
            'Cityworks wrapper live multipart verification');
        if(!verifyOnly && key === 'case') assert.lengthOf(result, 1, 'One uploaded file must return one related document');
        const added = Array.isArray(result) ? result[0] : result;
        assert.isObject(added, 'Upload must return an attachment record');
        const field = key === 'case' ? 'ReldocsId' : 'Id';
        const attachmentId = added[field];
        assert.isTrue(Number.isSafeInteger(attachmentId) && attachmentId > 0, 'Upload must return ' + field);
        console.log('\n  Retained ' + key + ' attachment ' + attachmentId + ' on record ' + id + ': ' + filename);
        const listed = await attachment.getByNodesId(id);
        assert.isDefined(findAttachment(listed, attachmentId, field), 'Uploaded attachment must be listed');
        if(key !== 'case') {
          const fetched = await attachment.getById(attachmentId);
          assert.strictEqual(fetched[field], attachmentId);
        }
        assert.strictEqual(await attachment.download(attachmentId), contents, 'Downloaded contents must match the uploaded file');
      } catch(e) {
        throw new Error(key + ' attachment verification failed: ' + (e.message || e.Message));
      }
    });
  }
});
