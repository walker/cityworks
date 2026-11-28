'use strict';
// Mocked tests: no Cityworks instance is contacted.
// Comments are available on service requests, work orders and cases. Inspections have no comment support in the wrapper (see the last describe).
const assert = require('chai').assert;
const cw = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

async function rejection(promise) {
  try {
    await promise;
  } catch (e) {
    return e;
  }
  assert.fail('should have rejected');
}

// [label, object accessor, activity type name, numeric ActivityType sent to Cityworks, supports predefined-comment categories]
const targets = [
  ['Service Request', () => cw.request, 'Request', 1, true],
  ['Work Order', () => cw.workorder, 'WorkOrder', 2, true],
  ['(Brief)Case', () => cw.briefcase, 'CaObject', 4, false]
];

targets.forEach(([label, owner, typeName, typeNumber, categories]) => {
  describe('[Comments] ' + label + ' comments', () => {
    const mock = createMock(cw.Cityworks);
    const comment = () => owner().comment;

    it('should be wired with the ' + typeName + ' activity type (' + typeNumber + ')', () => {
      assert.isObject(comment());
      assert.equal(comment().currentActivityType, typeName);
      assert.equal(comment().activityTypes.get(typeName), typeNumber);
    });

    it('add should send the activity type, SID and text and resolve the comment record', async () => {
      mock.on('Ams/Comment/Add', (d) => ({CommentId: 9, Comments: d.Comments}));
      const r = await comment().add(1234, 'A comment');
      assert.deepEqual(r, {CommentId: 9, Comments: 'A comment'});
      const expected = {ActivityType: typeNumber, ActivitySid: 1234, Comments: 'A comment'};
      // case (PLL) comments are explicitly private unless someone decides otherwise
      if(typeName === 'CaObject') expected.IsPublic = false;
      assert.deepEqual(mock.lastCall('Ams/Comment/Add').data, expected);
    });

    it('should leave visibility to Cityworks for ' + (typeName === 'CaObject' ? 'nothing: case comments always say' : 'comments that do not say') + ' whether they are public', async () => {
      mock.on('Ams/Comment/Add', (d) => d);
      await comment().add(1, 'x');
      assert.equal('IsPublic' in mock.lastCall('Ams/Comment/Add').data, typeName === 'CaObject');
    });

    if(typeName !== 'CaObject') {
      it('update should send the activity type, comment id and new text and leave visibility to Cityworks', async () => {
        mock.on('Ams/Comment/Update', (d) => ({CommentId: d.CommentId, Comments: d.Comments}));
        const r = await comment().update(9, 'Edited');
        assert.deepEqual(r, {CommentId: 9, Comments: 'Edited'});
        assert.deepEqual(mock.lastCall('Ams/Comment/Update').data, {ActivityType: typeNumber, CommentId: 9, Comments: 'Edited'});
      });
    } else {
      it('update should reject without calling the API when neither isPublic nor the case is given (visibility must never change by accident)', async () => {
        mock.on('Ams/Comment/Update', (d) => d);
        const e = await rejection(comment().update(9, 'Edited'));
        assert.equal(e.Code, 3);
        assert.deepEqual(mock.paths(), []);
      });

      it('update should keep a public comment public and a private one private when given the case it belongs to', async () => {
        mock.on('Ams/Comment/ByActivitySids', {1234: [{CommentId: 9, IsPublic: true}, {CommentId: 10, IsPublic: false}]});
        mock.on('Ams/Comment/Update', (d) => d);
        await comment().update(9, 'Edited public', {activitySid: 1234});
        assert.deepEqual(mock.lastCall('Ams/Comment/ByActivitySids').data, {ActivitySids: [1234], ActivityType: typeNumber});
        assert.deepEqual(mock.lastCall('Ams/Comment/Update').data, {ActivityType: typeNumber, CommentId: 9, Comments: 'Edited public', IsPublic: true});
        await comment().update(10, 'Edited private', {activitySid: 1234});
        assert.deepEqual(mock.lastCall('Ams/Comment/Update').data, {ActivityType: typeNumber, CommentId: 10, Comments: 'Edited private', IsPublic: false});
      });

      it('update should only make a public comment private when explicitly told to (and skip the lookup)', async () => {
        mock.on('Ams/Comment/Update', (d) => d);
        await comment().update(9, 'Now private', {isPublic: false, activitySid: 1234});
        assert.deepEqual(mock.paths(), ['Ams/Comment/Update']);
        assert.isFalse(mock.lastCall('Ams/Comment/Update').data.IsPublic);
        await comment().update(9, 'Now public', true);
        assert.isTrue(mock.lastCall('Ams/Comment/Update').data.IsPublic);
      });

      it('update should reject (code 4) when the comment is not on the given case, and not update anything', async () => {
        mock.on('Ams/Comment/ByActivitySids', {1234: [{CommentId: 1, IsPublic: true}]});
        mock.on('Ams/Comment/Update', (d) => d);
        const e = await rejection(comment().update(9, 'x', {activitySid: 1234}));
        assert.equal(e.Code, 4);
        assert.deepEqual(mock.paths(), ['Ams/Comment/ByActivitySids']);
      });

      it('update should propagate a failed lookup', async () => {
        mock.onError('Ams/Comment/ByActivitySids', {Message: 'lookup failed'});
        assert.equal((await rejection(comment().update(9, 'x', {activitySid: 1234}))).Message, 'lookup failed');
      });
    }

    it('add and update should send IsPublic when it is given', async () => {
      mock.on('Ams/Comment/Add', (d) => d);
      mock.on('Ams/Comment/Update', (d) => d);
      await comment().add(1234, 'Public note', true);
      assert.deepEqual(mock.lastCall('Ams/Comment/Add').data, {ActivityType: typeNumber, ActivitySid: 1234, Comments: 'Public note', IsPublic: true});
      await comment().update(9, 'Public note', true);
      assert.deepEqual(mock.lastCall('Ams/Comment/Update').data, {ActivityType: typeNumber, CommentId: 9, Comments: 'Public note', IsPublic: true});
    });

    it('get should unwrap the comments for a single SID', async () => {
      mock.on('Ams/Comment/ByActivitySids', {1234: [{CommentId: 9, Comments: 'A comment'}]});
      assert.deepEqual(await comment().get([1234]), [{CommentId: 9, Comments: 'A comment'}]);
      assert.deepEqual(mock.lastCall('Ams/Comment/ByActivitySids').data, {ActivitySids: [1234], ActivityType: typeNumber});
    });

    it('get should resolve undefined for a single SID that has no comments', async () => {
      mock.on('Ams/Comment/ByActivitySids', {});
      assert.isUndefined(await comment().get([1234]));
    });

    it('get should resolve the dictionary of comments keyed by SID for several SIDs', async () => {
      mock.on('Ams/Comment/ByActivitySids', {1: [{CommentId: 1}], 2: []});
      assert.deepEqual(await comment().get([1, 2]), {1: [{CommentId: 1}], 2: []});
      assert.deepEqual(mock.lastCall('Ams/Comment/ByActivitySids').data, {ActivitySids: [1, 2], ActivityType: typeNumber});
    });

    it('get should not send the same id twice (Cityworks fails on duplicate ids) and still unwrap a single id', async () => {
      mock.on('Ams/Comment/ByActivitySids', {1234: [{CommentId: 9}]});
      assert.deepEqual(await comment().get([1234, 1234]), [{CommentId: 9}]);
      assert.deepEqual(mock.lastCall('Ams/Comment/ByActivitySids').data, {ActivitySids: [1234], ActivityType: typeNumber});
    });

    it('get should reject without calling the API when no SIDs are given', async () => {
      assert.equal((await rejection(comment().get(undefined))).Code, 2);
      assert.equal((await rejection(comment().get(null))).Code, 2);
      assert.deepEqual(mock.paths(), []);
    });

    it('getPredefined should default the ProblemSid to 0 and send the activity type', async () => {
      mock.on('Ams/Comment/PredefinedComments', [{Comments: 'Template'}]);
      assert.deepEqual(await comment().getPredefined(), [{Comments: 'Template'}]);
      assert.deepEqual(mock.lastCall('Ams/Comment/PredefinedComments').data, {ProblemSid: 0, ActivityType: typeNumber});
    });

    it('getPredefined should ' + (categories ? '' : 'not ') + 'send the category', async () => {
      mock.on('Ams/Comment/PredefinedComments', []);
      await comment().getPredefined(738, 'General');
      const expected = {ProblemSid: 738, ActivityType: typeNumber};
      if(categories) expected.Category = 'General';
      assert.deepEqual(mock.lastCall('Ams/Comment/PredefinedComments').data, expected);
    });

    if(typeName === 'CaObject') {
      it('case comments should default to public only when the account is a public (non-employee) user', async () => {
        mock.on('Ams/Comment/Add', (d) => d);
        mock.on('Ams/Comment/Update', (d) => d);
        cw.Cityworks.configure('cityworks.example.test', {publicUser: true});
        await comment().add(1, 'from a resident');
        assert.isTrue(mock.lastCall('Ams/Comment/Add').data.IsPublic);
        await comment().update(9, 'edited');
        assert.isTrue(mock.lastCall('Ams/Comment/Update').data.IsPublic);
        assert.deepEqual(mock.paths().filter(p => p === 'Ams/Comment/ByActivitySids'), []);
        await comment().add(1, 'staff-only even though the account is public', false);
        assert.isFalse(mock.lastCall('Ams/Comment/Add').data.IsPublic);
      });

      it('case comments should be private for employees unless isPublic is passed', async () => {
        mock.on('Ams/Comment/Add', (d) => d);
        assert.isFalse(cw.Cityworks.isPublicUser());
        await comment().add(1, 'a');
        assert.isFalse(mock.lastCall('Ams/Comment/Add').data.IsPublic);
        await comment().add(1, 'b', true);
        assert.isTrue(mock.lastCall('Ams/Comment/Add').data.IsPublic);
      });
    }

    ['add', 'update', 'get', 'getPredefined'].forEach(method => {
      it('should propagate API errors from ' + method, async () => {
        mock.onError('Ams/Comment/Add', {Code: 60, Message: 'Item not found'});
        mock.onError('Ams/Comment/Update', {Code: 60, Message: 'Item not found'});
        mock.onError('Ams/Comment/ByActivitySids', {Code: 60, Message: 'Item not found'});
        mock.onError('Ams/Comment/PredefinedComments', {Code: 60, Message: 'Item not found'});
        const args = {add: [1, 'x'], update: [1, 'x', false], get: [[1]], getPredefined: []}[method];
        const e = await rejection(comment()[method](...args));
        assert.equal(e.Code, 60);
        assert.equal(e.Message, 'Item not found');
      });
    });
  });
});

describe('[Comments] activity types', () => {
  const Comments = cw.request.comment.constructor;

  it('should map every supported activity type to its Cityworks number', () => {
    const c = new Comments(cw.Cityworks, 'Request');
    const expected = {Unknown: 0, Request: 1, WorkOrder: 2, CaTask: 3, CaObject: 4, CaCorrection: 5, Project: 6, Contract: 7};
    Object.keys(expected).forEach(name => assert.equal(c.activityTypes.get(name), expected[name], name));
  });

  it('should throw a CWError (code 1) for an unknown activity type', () => {
    try {
      new Comments(cw.Cityworks, 'Nope');
      assert.fail('should have thrown');
    } catch (e) {
      assert.equal(e.Code, 1);
    }
  });
});

describe('[Comments] inspections', () => {
  // The Comments activity types (Request, WorkOrder, CaTask, CaObject, CaCorrection, Project, Contract) do not include Inspection, and
  // inspection.comment is not wired. A probe of a Cityworks 23.12 instance found Ams/Comment/ByActivitySids only returns per-id results for
  // ActivityType 1-7 (0 and 8+ answer with an empty dictionary), so Cityworks itself has no inspection comments to wrap.
  it('are not supported yet: inspection.comment is not available and Inspection is not a comment activity type', () => {
    assert.isUndefined(cw.inspection.comment);
    const Comments = cw.request.comment.constructor;
    assert.throws(() => new Comments(cw.Cityworks, 'Inspection'));
  });
});
