'use strict';
require('dotenv').config({quiet: true, debug: false});
const assert = require('chai').assert;
const fs = require('fs');
const os = require('os');
const path = require('path');
const cw = require('../dist/index.js');

describe('[Live requests] scratch request write verification', function() {
  this.timeout(60000);
  let marker = 'Cityworks wrapper request write test ' + Date.now();
  const caller = {FirstName: 'Wrapper', LastName: 'LiveTest', Email: 'wrapper-' + Date.now() + '@example.invalid', HomePhone: '2025550142'};
  let source;
  let id;
  let callId;
  let otherId;
  let directory;
  let originalRunRequest;
  const observed = new Map();
  const point = {x: -80.6, y: 28.3, projection: {WKID: '4326'}};
  const read = () => cw.request.getById(id);
  const calls = requestId => cw.request.customerCall.getByRequestId(requestId);
  const create = () => cw.request.create({ProblemSid: source.ProblemSid, DomainId: source.DomainId, Details: marker, Text1: marker});

  before(async function() {
    if(process.env.CW_LIVE_REQUEST_WRITE !== '1') {
      console.log('\n  Skipped: set CW_LIVE_REQUEST_WRITE=1 with CW_LIVE_REQUEST_SOURCE_ID');
      this.skip();
    }
    const missing = ['cwdomain', 'cwlogin', 'cwpassword'].filter(k => !process.env[k]);
    if(missing.length) throw new Error('Missing live settings: ' + missing.join(', '));
    const sourceId = Number(process.env.CW_LIVE_REQUEST_SOURCE_ID);
    assert.isTrue(Number.isSafeInteger(sourceId) && sourceId > 0, 'Designate a positive source request ID');
    cw.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath || 'cityworks', version: Number(process.env.cwversion || 23)});
    await cw.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword);
    originalRunRequest = cw.Cityworks.runRequest;
    cw.Cityworks.runRequest = async function(servicePath, data, file) {
      const response = await originalRunRequest.call(this, servicePath, data, file);
      if(/\/(Create|Update|Move|MoveToRequest|Add|AddToRequest|Delete|Cancel|Uncancel|Close|ReOpen|ChangeProblem|ChangeCustomFieldCategory|AddRequestAttachment|UpdateRequestAttachment|DeleteRequestAttachments)$/.test(servicePath)) {
        const value = response === true ? true : response && response.Value;
        const sample = Array.isArray(value) ? value[0] : value;
        observed.set(servicePath, {type: value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value,
          keyCount: sample && typeof sample === 'object' ? Object.keys(sample).length : 0});
      }
      return response;
    };
    source = await cw.request.getById(sourceId);
    assert.isObject(source);
    if(process.env.CW_LIVE_REQUEST_ID) {
      id = Number(process.env.CW_LIVE_REQUEST_ID);
      const existing = await read();
      assert.match(existing.Text1, /^Cityworks wrapper request write test /, 'Only a labelled scratch request may be reused');
      marker = existing.Text1;
    } else {
      const created = await cw.request.create({ProblemSid: source.ProblemSid, DomainId: source.DomainId, Details: marker, Text1: marker}, caller);
      id = created.RequestId;
    }
    assert.isTrue(Number.isSafeInteger(id) && id > 0, 'Creation must return a request ID');
    console.log('\n  Retained scratch RequestId: ' + id);
    if(process.env.CW_LIVE_CALL_ID) {
      callId = Number(process.env.CW_LIVE_CALL_ID);
      assert.isTrue((await calls(id)).some(call => call.IncidentNum === callId), 'Designated caller must belong to the scratch request');
    }
    if(process.env.CW_LIVE_REQUEST_DISPOSABLE_ID) {
      otherId = Number(process.env.CW_LIVE_REQUEST_DISPOSABLE_ID);
      assert.notStrictEqual(otherId, id);
      assert.match((await cw.request.getById(otherId)).Text1, /^Cityworks wrapper request write test /, 'Only a labelled disposable request may be deleted');
    }
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cityworks-request-'));
    fs.writeFileSync(path.join(directory, 'wrapper.txt'), marker + '\n');
  });

  after(function() {
    if(originalRunRequest) cw.Cityworks.runRequest = originalRunRequest;
    for(const [endpoint, shape] of observed) console.log('  Observed ' + endpoint + ': ' + JSON.stringify(shape));
    if(directory) {
      fs.unlinkSync(path.join(directory, 'wrapper.txt'));
      fs.rmdirSync(directory);
    }
  });

  beforeEach(function() {
    if(!id) this.skip();
  });

  it('creates a request and reads its problem, domain, and test fields back', async () => {
    const record = await read();
    assert.strictEqual(record.RequestId, id);
    assert.strictEqual(record.ProblemSid, source.ProblemSid);
    assert.strictEqual(record.DomainId, source.DomainId);
    assert.match(record.Text1, /^Cityworks wrapper request write test /);
    assert.match(record.Details, /^Cityworks wrapper request write test /);
  });

  it('updates editable request fields and persists them', async () => {
    await cw.request.update({RequestId: id, Details: marker + ' updated', Text1: marker});
    const record = await read();
    assert.strictEqual(record.Details, marker + ' updated');
    assert.strictEqual(record.Text1, marker);
  });

  it('moves the request and persists the returned coordinates', async () => {
    const before = await read();
    let moved = await cw.request.move(id, point.x, point.y, point.projection, 0);
    let record = await read();
    if(record.SRX === before.SRX && record.SRY === before.SRY) {
      moved = await cw.request.move(id, point.x + 0.001, point.y, point.projection, 0);
      record = await read();
    }
    assert.isObject(moved);
    assert.closeTo(record.SRX, moved.X, 0.01);
    assert.closeTo(record.SRY, moved.Y, 0.01);
    assert.isTrue(record.SRX !== before.SRX || record.SRY !== before.SRY, 'Coordinates must actually change');
  });

  it('changes the problem to a different active template and restores it', async () => {
    const alternate = Number(process.env.CW_LIVE_REQUEST_ALTERNATE_PROBLEM);
    assert.isTrue(Number.isSafeInteger(alternate) && alternate > 0 && alternate !== source.ProblemSid, 'Designate a different alternate problem SID');
    const template = await cw.request.getProblemLeaf(alternate);
    assert.isFalse(template.Cancel, 'Alternate template must be active');
    assert.strictEqual(template.DomainId, source.DomainId);
    await cw.request.changeProblem(id, alternate);
    assert.strictEqual((await read()).ProblemSid, alternate);
    await cw.request.changeProblem(id, source.ProblemSid);
    assert.strictEqual((await read()).ProblemSid, source.ProblemSid);
  });

  it('changes the custom-field category and verifies fields before restoring it', async () => {
    const category = Number(process.env.CW_LIVE_REQUEST_ALTERNATE_CATEGORY);
    assert.isTrue(Number.isSafeInteger(category) && category > 0 && category !== source.ReqCustFieldCatId, 'Designate a different category ID');
    await cw.request.changeCustomFieldCategory([id], category);
    assert.strictEqual((await read()).ReqCustFieldCatId, category);
    const fields = await cw.request.getCustomFields([id]);
    assert.isNotEmpty(fields[id]);
    fields[id].forEach(field => assert.strictEqual(field.CategoryId, category));
    await cw.request.changeCustomFieldCategory([id], source.ReqCustFieldCatId);
    assert.strictEqual((await read()).ReqCustFieldCatId, source.ReqCustFieldCatId);
  });

  it('cancels and uncancels the request with persisted state', async () => {
    await cw.request.cancel([id], marker);
    const cancelled = await read();
    assert.isTrue(cancelled.Cancel);
    assert.strictEqual(cancelled.CancelReason, marker);
    await cw.request.uncancel([id]);
    assert.isFalse((await read()).Cancel);
  });

  it('closes and reopens the request with persisted state', async () => {
    const before = await read();
    const closeProblem = Number(process.env.CW_LIVE_REQUEST_CLOSE_PROBLEM);
    assert.isTrue(Number.isSafeInteger(closeProblem) && closeProblem > 0, 'Designate an active close-test problem with no incomplete required fields');
    const template = await cw.request.getProblemLeaf(closeProblem);
    assert.isFalse(template.Cancel);
    assert.strictEqual(template.DomainId, source.DomainId);
    await cw.request.changeProblem(id, closeProblem);
    try {
      const fields = (await cw.request.getCustomFields([id]))[id];
      assert.isTrue(fields === null || Array.isArray(fields), 'Custom fields must be a collection or null');
      if(fields) assert.isFalse(fields.some(field => field.IsRequired && !field.CustFieldValue), 'Close fixture must have its required fields completed');
      await cw.request.close([id]);
      assert.isTrue((await read()).IsClosed);
      await cw.request.reopen([id]);
      assert.isFalse((await read()).IsClosed);
    } finally {
      await cw.request.changeProblem(id, before.ProblemSid);
      if((await read()).ReqCustFieldCatId !== before.ReqCustFieldCatId) {
        await cw.request.changeCustomFieldCategory([id], before.ReqCustFieldCatId);
      }
    }
  });

  it('adds a caller, matches email without an incident number, and records a repeat call', async () => {
    const result = await cw.request.update({RequestId: id}, {...caller, Comments: marker});
    assert.lengthOf(result.CustomerCalls, 1);
    callId = result.CustomerCalls[0].IncidentNum;
    assert.isTrue(Number.isSafeInteger(callId) && callId > 0);
    const before = await calls(id);
    const updated = await cw.request.update({RequestId: id}, {Email: caller.Email.toUpperCase(), Comments: marker + ' updated'});
    assert.strictEqual(updated.CustomerCalls[0].IncidentNum, callId);
    assert.lengthOf(await calls(id), before.length);
    assert.strictEqual((await calls(id)).find(call => call.IncidentNum === callId).Comments, marker + ' updated');
    const repeated = await cw.request.update({RequestId: id}, caller, {newCall: true});
    assert.notStrictEqual(repeated.CustomerCalls[0].IncidentNum, callId);
    assert.lengthOf(await calls(id), before.length + 1);
    console.log('\n  Retained caller IncidentNums: ' + (await calls(id)).map(call => call.IncidentNum).join(', '));
  });

  it('updates and moves a customer call with persisted fields', async () => {
    assert.isNumber(callId);
    await cw.request.customerCall.updateCall(callId, {RequestId: id, Comments: marker + ' direct update'});
    const moved = await cw.request.customerCall.moveCall(callId, point.x, point.y, point.projection, 0);
    const found = (await calls(id)).find(call => call.IncidentNum === callId);
    assert.strictEqual(found.Comments, marker + ' direct update');
    assert.closeTo(found.CCX, moved.X, 0.01);
    assert.closeTo(found.CCY, moved.Y, 0.01);
  });

  it('moves a call to another scratch request and back, then deletes a disposable call', async () => {
    if(!otherId) otherId = (await create()).RequestId;
    console.log('\n  Disposable scratch RequestId: ' + otherId);
    await cw.request.customerCall.moveToRequest(id, otherId, [callId]);
    assert.isFalse((await calls(id)).some(call => call.IncidentNum === callId));
    assert.isTrue((await calls(otherId)).some(call => call.IncidentNum === callId));
    await cw.request.customerCall.moveToRequest(otherId, id, [callId]);
    assert.isTrue((await calls(id)).some(call => call.IncidentNum === callId));
    const disposable = await cw.request.customerCall.addToRequest(id, {...caller, Comments: marker + ' disposable'});
    await cw.request.customerCall.deleteCall(disposable.IncidentNum);
    assert.isFalse((await calls(id)).some(call => call.IncidentNum === disposable.IncidentNum));
  });

  it('adds and updates a comment and reads the edited text back', async () => {
    const added = await cw.request.comment.add(id, marker, false);
    assert.isTrue(Number.isSafeInteger(added.CommentId) && added.CommentId > 0);
    await cw.request.comment.update(added.CommentId, marker + ' edited', false);
    const found = (await cw.request.comment.get([id])).find(comment => comment.CommentId === added.CommentId);
    assert.strictEqual(found.Comments, marker + ' edited');
    assert.isFalse(found.IsPublic);
    console.log('\n  Retained CommentId: ' + added.CommentId);
  });

  it('uploads and edits an attachment and downloads identical contents', async () => {
    const added = process.env.CW_LIVE_ATTACHMENT_ID
      ? await cw.request.attachments.getById(Number(process.env.CW_LIVE_ATTACHMENT_ID))
      : await cw.request.attachments.add(id, path.join(directory, 'wrapper.txt'), 'wrapper.txt', 'attachment', undefined, marker);
    assert.isNumber(added.Id);
    assert.strictEqual(added.RequestId, id);
    console.log('\n  Retained AttachmentId: ' + added.Id);
    await cw.request.attachments.update(added.Id, marker, marker + ' description');
    const fetched = await cw.request.attachments.getById(added.Id);
    assert.strictEqual(fetched.Title, marker);
    assert.strictEqual(fetched.Description, marker + ' description');
    assert.strictEqual(await cw.request.attachments.download(added.Id), marker + '\n');
    const listed = await cw.request.attachments.getByNodesId(id);
    assert.isTrue(listed.some(attachment => attachment.Id === added.Id));
  });

  it('deletes a disposable attachment and verifies that it is absent', async () => {
    const added = await cw.request.attachments.add(id, path.join(directory, 'wrapper.txt'), 'disposable.txt');
    console.log('\n  Disposable AttachmentId: ' + added.Id);
    await cw.request.attachments.delete(added.Id);
    assert.isFalse((await cw.request.attachments.getByNodesId(id)).some(attachment => attachment.Id === added.Id));
  });

  it('deletes only the disposable request and verifies that it is absent', async function() {
    if(!otherId) {
      otherId = (await create()).RequestId;
      console.log('\n  Disposable scratch RequestId: ' + otherId);
    }
    try {
      await cw.request.delete([otherId]);
    } catch(e) {
      if(!/does not have permissions to delete request/.test(e.message || e.Message || '')) throw e;
      assert.strictEqual((await cw.request.getById(otherId)).RequestId, otherId);
      console.log('\n  BLOCKED: deletion permission denied; retained disposable RequestId ' + otherId);
      this.skip();
    }
    const remaining = await cw.request.getByIds([otherId]);
    assert.isArray(remaining);
    assert.isFalse(remaining.some(record => record.RequestId === otherId), 'A success response alone does not establish deletion');
  });
});
