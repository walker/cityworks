'use strict';
// Mocked tests: no Cityworks instance is contacted.
const assert = require('chai').assert;
const cw3 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

async function rejection(promise) {
  try {
    await promise;
  } catch (e) {
    return e;
  }
  assert.fail('should have rejected');
}

describe('[General::notifications] function test', () => {
  const mock = createMock(cw3.Cityworks);
  const p = 'General/ActivityNotification/User';

  it('should resolve the collection with an empty payload', async () => {
    mock.on(p, [{ActivityId: 1}]);
    assert.deepEqual(await cw3.general.notifications(), [{ActivityId: 1}]);
    assert.deepEqual(mock.lastCall(p).data, {});
  });

  it('should propagate API errors', async () => {
    mock.onError(p, {Message: 'nope'});
    assert.equal((await rejection(cw3.general.notifications())).Message, 'nope');
  });
});

describe('[General::amIWatching] function test', () => {
  const mock = createMock(cw3.Cityworks);
  const p = 'General/ActivityNotification/UserWatching';

  it('should reject with an error if the activity type is not available or does not exist', async () => {
    const e = await rejection(cw3.general.amIWatching('request', 42015));
    assert.equal(e.Code, 1);
    assert.equal(e.Message, 'Activity type provided does not exist.');
    assert.deepEqual(mock.paths(), []);
  });

  it('should map the activity type to its number and resolve a boolean', async () => {
    mock.on(p, true);
    assert.isTrue(await cw3.general.amIWatching('case', 42015));
    assert.deepEqual(mock.lastCall(p).data, {ActivityType: 1, ActivityId: 42015});
    await cw3.general.amIWatching('task', 7);
    assert.deepEqual(mock.lastCall(p).data, {ActivityType: 2, ActivityId: 7});
  });

  it('should resolve with false if the API says the item is not watched', async () => {
    mock.on(p, false);
    assert.isFalse(await cw3.general.amIWatching('case', 200042015));
  });

  it('should propagate API errors', async () => {
    mock.onError(p, {Message: 'Unknown error.'});
    assert.equal((await rejection(cw3.general.amIWatching('case', 10000000000))).Message, 'Unknown error.');
  });
});

describe('[General::getActivityMetadataByIds] function test', () => {
  const mock = createMock(cw3.Cityworks);
  const p = 'General/CwMetaData/ByTableNameSids';

  it('should send the ids and table name and resolve the metadata', async () => {
    mock.on(p, [{Id: 1}]);
    assert.deepEqual(await cw3.general.getActivityMetadataByIds([1, 2], 'REQUEST'), [{Id: 1}]);
    assert.deepEqual(mock.lastCall(p).data, {Ids: [1, 2], TableName: 'REQUEST'});
  });

  it('should reject (code 2) for an unknown table name', async () => {
    mock.on(p, []);
    const e = await rejection(cw3.general.getActivityMetadataByIds([1], 'NOPE'));
    assert.equal(e.Code, 2);
  });

  it('should propagate API errors', async () => {
    mock.onError(p, {Message: 'nope'});
    assert.equal((await rejection(cw3.general.getActivityMetadataByIds([1], 'WORKORDER'))).Message, 'nope');
  });
});

describe('[General::getHistory] function test', () => {
  const mock = createMock(cw3.Cityworks);
  const p = 'Ams/Search/RecentActivity';

  it('should resolve the recent activity', async () => {
    mock.on(p, [{Activity: 'x'}]);
    assert.deepEqual(await cw3.general.getHistory(), [{Activity: 'x'}]);
    assert.deepEqual(mock.lastCall(p).data, {});
  });

  it('should propagate API errors', async () => {
    mock.onError(p, {Message: 'nope'});
    assert.equal((await rejection(cw3.general.getHistory())).Message, 'nope');
  });
});

describe('[General::getHolidays] function test', () => {
  const mock = createMock(cw3.Cityworks);
  const p = 'Ams/Designer/Holidays';
  const holidays = [
    {Holiday: '2025-12-25T00:00:00', Description: 'Christmas 2025'},
    {Holiday: '2026-01-01T00:00:00', Description: 'New Year 2026'},
    {Holiday: '2026-07-04T00:00:00', Description: 'July 4th 2026'},
    {Holiday: '2026-12-25T00:00:00', Description: 'Christmas 2026'}
  ];
  const names = (list) => list.map(h => h.Description);

  beforeEach(() => {
    mock.on(p, holidays);
  });

  it('should resolve all holidays when no dates are given (and send no filters to the API)', async () => {
    const r = await cw3.general.getHolidays();
    assert.lengthOf(r, 4);
    assert.deepEqual(mock.lastCall(p).data, {});
  });

  it('should not return holidays before the provided start date', async () => {
    const r = await cw3.general.getHolidays(new Date('2026-01-01T00:00:00'));
    assert.deepEqual(names(r), ['New Year 2026', 'July 4th 2026', 'Christmas 2026']);
  });

  it('should not return holidays on or after the provided end date', async () => {
    const r = await cw3.general.getHolidays(undefined, new Date('2026-01-01T00:00:00'));
    assert.deepEqual(names(r), ['Christmas 2025']);
  });

  it('should return only holidays within the provided window', async () => {
    const r = await cw3.general.getHolidays(new Date('2026-01-01T00:00:00'), new Date('2026-12-31T00:00:00'));
    assert.deepEqual(names(r), ['New Year 2026', 'July 4th 2026', 'Christmas 2026']);
  });

  it('should propagate API errors', async () => {
    mock.onError(p, {Message: 'nope'});
    assert.equal((await rejection(cw3.general.getHolidays())).Message, 'nope');
  });
});

describe('[General::addHoliday] function test', () => {
  const mock = createMock(cw3.Cityworks);
  const p = 'General/Holidays/Add';

  it('should send the holiday and description and resolve the Value', async () => {
    const holiday = new Date('2027-01-01T00:00:00.000Z');
    mock.on(p, {Added: true});
    assert.deepEqual(await cw3.general.addHoliday(holiday, 'addHoliday test'), {Added: true});
    assert.deepEqual(mock.lastCall(p).data, {Holiday: holiday.toISOString(), Description: 'addHoliday test'});
  });

  it('should propagate API errors', async () => {
    mock.onError(p, {Message: 'nope'});
    assert.equal((await rejection(cw3.general.addHoliday(new Date(), 'x'))).Message, 'nope');
  });
});

describe('[General::deleteHolidays] function test', () => {
  const mock = createMock(cw3.Cityworks);
  const p = 'General/Holidays/Delete';

  it('should delete multiple holidays in a single request', async () => {
    const h1 = new Date('2027-01-01T00:00:00.000Z');
    const h2 = new Date('2027-01-02T00:00:00.000Z');
    mock.on(p, {Deleted: 2});
    assert.deepEqual(await cw3.general.deleteHolidays([h1, h2]), {Deleted: 2});
    assert.lengthOf(mock.callsTo(p), 1);
    assert.deepEqual(mock.lastCall(p).data, {Holidays: [h1.toISOString(), h2.toISOString()]});
  });

  it('should propagate API errors', async () => {
    mock.onError(p, {Message: 'nope'});
    assert.equal((await rejection(cw3.general.deleteHolidays([new Date()]))).Message, 'nope');
  });
});

describe('[General::batchExecute] function test', () => {
  const mock = createMock(cw3.Cityworks);
  const p = 'General/Batch/Execute';
  const history = {Request: {EntityType: 'EASEMENT_TREES', EntityUid: '{DUMMY}'}, Method: 'ams/entity/workActivityHistory'};
  const query = {Request: {QueryValue: 'CaseObject()'}, Method: 'general/query/query'};
  const costs = {Request: {EntityType: 'EASEMENT_TREES', EntityUids: ['{DUMMY}']}, Method: 'ams/entity/assetCostHistory'};

  it('should wrap a single request with an auto-generated id', async () => {
    mock.on(p, [{Response: {Value: [1]}}]);
    const r = await cw3.general.batchExecute(history);
    assert.deepEqual(r, [{Response: {Value: [1]}}]);
    assert.deepEqual(mock.lastCall(p).data, {Requests: [Object.assign({Id: 0}, history)]});
  });

  it('should number a multi-request batch 0, -1, -2 in order', async () => {
    mock.on(p, []);
    await cw3.general.batchExecute([history, query, costs]);
    const sent = mock.lastCall(p).data.Requests;
    assert.deepEqual(sent.map(r => r.Id), [0, -1, -2]);
    assert.deepEqual(sent.map(r => r.Method), [history.Method, query.Method, costs.Method]);
  });

  it('should propagate API errors', async () => {
    mock.onError(p, {Message: 'nope'});
    assert.equal((await rejection(cw3.general.batchExecute(history))).Message, 'nope');
  });
});

describe('[General::getWOEntityCostSummary] function test', () => {
  const mock = createMock(cw3.Cityworks);
  const p = 'General/CostSummary/WorkOrderEntity';

  it("should get an Entity's cost summary", async () => {
    mock.on(p, [{Cost: 5}]);
    assert.deepEqual(await cw3.general.getWOEntityCostSummary([1, 2]), [{Cost: 5}]);
    assert.deepEqual(mock.lastCall(p).data, {ObjectIds: [1, 2]});
  });

  it('should propagate API errors', async () => {
    mock.onError(p, {Message: 'nope'});
    assert.equal((await rejection(cw3.general.getWOEntityCostSummary([1]))).Message, 'nope');
  });
});

describe('[General::searchWOEntityCostSummary] function test', () => {
  const mock = createMock(cw3.Cityworks);
  const p = 'General/CostSummary/WorkOrderEntitySearch';

  it('should resolve the results of a search for the cost summary of an entity', async () => {
    mock.on(p, [{Cost: 9}]);
    assert.deepEqual(await cw3.general.searchWOEntityCostSummary(12), [{Cost: 9}]);
    assert.deepEqual(mock.lastCall(p).data, {SearchId: 12});
  });

  it('should propagate API errors', async () => {
    mock.onError(p, {Message: 'nope'});
    assert.equal((await rejection(cw3.general.searchWOEntityCostSummary(1))).Message, 'nope');
  });
});
