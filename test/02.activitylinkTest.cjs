'use strict';
// Mocked tests: no Cityworks instance is contacted.
var assert = require('chai').assert;
const cw2 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

// Rejects with the thrown error so assertions can inspect it (and a resolve fails the test)
const rejection = (promise) => promise.then(() => {
  throw new Error('Expected promise to reject');
}, e => e);

const assertTypeError = (e, code, type) => {
  assert.equal(e.Name, 'Cityworks Exception');
  assert.equal(e.Code, code);
  assert.equal(e.Message, `Activity type "${type}" not found.`);
  assert.equal(JSON.parse(e.Info).provided, type);
};

describe('[ActivityLink (construct)] function test', () => {
  it('should be a defined object', () => {
    assert.isObject(cw2.activity_link, 'ActivityLink is an object');
  });

  it('should map activity and link types to their numeric values', () => {
    assert.equal(cw2.activity_link.activityTypes.get('case'), 1);
    assert.equal(cw2.activity_link.activityTypes.get('inspection'), 2);
    assert.equal(cw2.activity_link.activityTypes.get('request'), 3);
    assert.equal(cw2.activity_link.activityTypes.get('workorder'), 4);
    assert.equal(cw2.activity_link.activityTypes.get('wipcase'), 5);
    assert.equal(cw2.activity_link.linkTypes.get('parent'), 1);
    assert.equal(cw2.activity_link.linkTypes.get('related'), 2);
  });
});

describe('[ActivityLink] mocked function tests', () => {
  const mock = createMock(cw2.Cityworks);

  describe('[ActivityLink::get] function test', () => {
    const path = 'General/ActivityLink/ByActivitySids';

    it('should return error if type doesn\'t exist', async () => {
      const e = await rejection(cw2.activity_link.get('something', [1]));
      assertTypeError(e, 4, 'something');
      assert.lengthOf(mock.calls, 0);
    });

    it('should return collection with the types mapped to numbers', async () => {
      mock.on(path, () => [
        {ActivityLinkId: 1, SourceType: 'case', SourceSid: 10512, DestType: 'workorder', DestSid: 77, LinkType: 'related'}
      ]);
      const resp = await cw2.activity_link.get('case', [10512, 10513]);
      assert.deepEqual(mock.paths(), [path]);
      assert.deepEqual(mock.lastCall(path).data, {ActivityType: 1, ActivitySids: [10512, 10513]});
      assert.isArray(resp);
      assert.lengthOf(resp, 1);
      assert.equal(resp[0].ActivityLinkId, 1);
      assert.equal(resp[0].SourceSid, 10512);
    });

    it('should return an empty collection when there are no links', async () => {
      mock.on(path, () => []);
      const resp = await cw2.activity_link.get('case', [10512]);
      assert.deepEqual(resp, []);
    });

    it('should propagate API errors', async () => {
      mock.onError(path, () => ({Code: 99, Message: 'boom'}));
      const e = await rejection(cw2.activity_link.get('case', [10512]));
      assert.equal(e.Code, 99);
      assert.equal(e.Message, 'boom');
    });
  });

  describe('[ActivityLink::add] function test', () => {
    const path = 'General/ActivityLink/Add';

    it('should return error if source type does not exist', async () => {
      const e = await rejection(cw2.activity_link.add('notatype', 1, 'workorder', 241525));
      assertTypeError(e, 1, 'notatype');
      assert.lengthOf(mock.calls, 0);
    });

    it('should return error if destination type does not exist', async () => {
      const e = await rejection(cw2.activity_link.add('workorder', 241437, 'notatype', 1));
      assertTypeError(e, 2, 'notatype');
      assert.lengthOf(mock.calls, 0);
    });

    it('should return error if link type does not exist', async () => {
      const e = await rejection(cw2.activity_link.add('workorder', 241437, 'workorder', 241525, 'notalinktype'));
      assertTypeError(e, 3, 'notalinktype');
      assert.lengthOf(mock.calls, 0);
    });

    it('should return the new link, defaulting to a related link', async () => {
      mock.on(path, (data) => Object.assign({ActivityLinkId: 5}, data));
      const resp = await cw2.activity_link.add('workorder', 241437, 'workorder', 241525);
      const expected = {SourceType: 4, SourceSid: 241437, DestType: 4, DestSid: 241525, LinkType: 2};
      assert.deepEqual(mock.paths(), [path]);
      assert.deepEqual(mock.lastCall(path).data, expected);
      assert.deepEqual(resp, Object.assign({ActivityLinkId: 5}, expected));
    });

    it('should send the given link type', async () => {
      mock.on(path, () => ({ActivityLinkId: 6}));
      await cw2.activity_link.add('case', 1, 'inspection', 2, 'parent');
      assert.deepEqual(mock.lastCall(path).data, {SourceType: 1, SourceSid: 1, DestType: 2, DestSid: 2, LinkType: 1});
    });

    it('should propagate API errors', async () => {
      mock.onError(path, () => ({Code: 99, Message: 'boom'}));
      const e = await rejection(cw2.activity_link.add('workorder', 1, 'workorder', 2));
      assert.equal(e.Code, 99);
      assert.equal(e.Message, 'boom');
    });
  });

  describe('[ActivityLink::clone] function test', () => {
    const path = 'General/ActivityLink/CloneByActivitySid';

    it('should return error if source type does not exist', async () => {
      const e = await rejection(cw2.activity_link.clone('badtype', 53215, 'inspection', 53217));
      assertTypeError(e, 5, 'badtype');
      assert.lengthOf(mock.calls, 0);
    });

    it('should return error if destination type does not exist', async () => {
      const e = await rejection(cw2.activity_link.clone('inspection', 53215, 'badtype', 53217));
      assertTypeError(e, 6, 'badtype');
      assert.lengthOf(mock.calls, 0);
    });

    it('should create a clone of the link on the source, to the links on the second', async () => {
      const links = [{ActivityLinkId: 11}, {ActivityLinkId: 12}];
      mock.on(path, () => links);
      const resp = await cw2.activity_link.clone('inspection', 53215, 'inspection', 53217);
      assert.deepEqual(mock.paths(), [path]);
      assert.deepEqual(mock.lastCall(path).data, {
        SourceActivityType: 2,
        SourceActivitySid: 53215,
        DestinationActivityType: 2,
        DestinationActivitySid: 53217
      });
      assert.deepEqual(resp, links);
    });

    it('should propagate API errors', async () => {
      mock.onError(path, () => ({Code: 99, Message: 'boom'}));
      const e = await rejection(cw2.activity_link.clone('inspection', 1, 'inspection', 2));
      assert.equal(e.Code, 99);
      assert.equal(e.Message, 'boom');
    });
  });

  describe('[ActivityLink::delete] function test', () => {
    const path = 'General/ActivityLink/Delete';

    it('should delete an activity link if the ID can be found and deleted', async () => {
      mock.on(path, () => undefined);
      const resp = await cw2.activity_link.delete(477102);
      assert.isTrue(resp);
      assert.deepEqual(mock.paths(), [path]);
      assert.deepEqual(mock.lastCall(path).data, {ActivityLinkId: 477102});
    });

    it('should resolve the API response as-is', async () => {
      mock.on(path, () => ({Deleted: 1}));
      const resp = await cw2.activity_link.delete(5);
      assert.deepEqual(resp, {Status: 0, Value: {Deleted: 1}});
    });

    it('should reject with false if the API call fails (e.g. the ID cannot be found)', async () => {
      mock.onError(path, () => ({Code: 99, Message: 'not found'}));
      const e = await rejection(cw2.activity_link.delete(0));
      assert.isFalse(e);
      assert.deepEqual(mock.lastCall(path).data, {ActivityLinkId: 0});
    });
  });

  describe('[ActivityLink::remove] function test', () => {
    const path = 'General/ActivityLink/Remove';

    it('should return error if source type does not exist', async () => {
      const e = await rejection(cw2.activity_link.remove('badtype', 53217, 'request', 1089178));
      assertTypeError(e, 8, 'badtype');
      assert.lengthOf(mock.calls, 0);
    });

    it('should return error if destination type does not exist', async () => {
      const e = await rejection(cw2.activity_link.remove('inspection', 53217, 'badtype', 1089178));
      assertTypeError(e, 9, 'badtype');
      assert.lengthOf(mock.calls, 0);
    });

    it('should return error if link type does not exist', async () => {
      const e = await rejection(cw2.activity_link.remove('inspection', 53217, 'request', 1089178, 'badlink'));
      assertTypeError(e, 10, 'badlink');
      assert.lengthOf(mock.calls, 0);
    });

    it('should remove a link when found, defaulting to a related link', async () => {
      mock.on(path, () => undefined);
      const resp = await cw2.activity_link.remove('inspection', 53217, 'request', 1089178);
      assert.isTrue(resp);
      assert.deepEqual(mock.paths(), [path]);
      assert.deepEqual(mock.lastCall(path).data, {SourceType: 2, SourceSid: 53217, DestType: 3, DestSid: 1089178, LinkType: 2});
    });

    it('should send the given link type', async () => {
      mock.on(path, () => undefined);
      await cw2.activity_link.remove('case', 1, 'wipcase', 2, 'parent');
      assert.deepEqual(mock.lastCall(path).data, {SourceType: 1, SourceSid: 1, DestType: 5, DestSid: 2, LinkType: 1});
    });

    it('should reject with false if the API call fails', async () => {
      mock.onError(path, () => ({Code: 99, Message: 'not found'}));
      const e = await rejection(cw2.activity_link.remove('inspection', 53217, 'request', 1089178));
      assert.isFalse(e);
    });
  });
});
