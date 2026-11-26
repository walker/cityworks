'use strict';
// Mocked tests: no Cityworks instance is contacted.
var assert = require('chai').assert;
const cw28 = require('../dist/index.js');
const { createMock, CWMockError } = require('./mockCityworks');

async function rejection(promise) {
  try {
    await promise;
  } catch(e) {
    return e;
  }
  assert.fail('expected promise to reject');
}

describe('[RecentActivity (construct)] function test', () => {
  it('should be a defined object', () => {
    assert.isObject(cw28.recent_activity);
    assert.isFunction(cw28.recent_activity.user);
    assert.isFunction(cw28.recent_activity.clear);
  });
});

describe('[RecentActivity::user] function test', () => {
  const mock = createMock(cw28.Cityworks);

  it('should return user recent activity collection and pass the options through', async () => {
    const activity = [{Type: 'Case', Id: 1}, {Type: 'Request', Id: 2}];
    mock.on('Ams/RecentActivity/User', activity);
    const options = { IncludeCases: true, IncludeRequests: true, MaxResults: 10 };
    const r = await cw28.recent_activity.user(options);
    assert.deepEqual(r, activity);
    assert.deepEqual(mock.paths(), ['Ams/RecentActivity/User']);
    assert.deepEqual(mock.lastCall('Ams/RecentActivity/User').data, options);
  });

  it('should send an empty payload when no options are given', async () => {
    mock.on('Ams/RecentActivity/User', []);
    const r = await cw28.recent_activity.user();
    assert.deepEqual(r, []);
    assert.deepEqual(mock.lastCall('Ams/RecentActivity/User').data, {});
  });

  it('should resolve null when the API returns a null value', async () => {
    mock.on('Ams/RecentActivity/User', null);
    const r = await cw28.recent_activity.user({ MaxResults: 1 });
    assert.isNull(r);
  });

  it('should propagate CWError rejections', async () => {
    mock.onError('Ams/RecentActivity/User', new CWMockError(3, 'Not authenticated'));
    const e = await rejection(cw28.recent_activity.user());
    assert.equal(e.Code, 3);
    assert.equal(e.Message, 'Not authenticated');
  });
});

describe('[RecentActivity::clear] function test', () => {
  const mock = createMock(cw28.Cityworks);

  it('should clear selected recent activity groups', async () => {
    mock.on('Ams/RecentActivity/Clear', true);
    const options = { Cases: true, Inspections: true, Requests: false, WorkOrders: false };
    const r = await cw28.recent_activity.clear(options);
    assert.isTrue(r);
    assert.deepEqual(mock.paths(), ['Ams/RecentActivity/Clear']);
    assert.deepEqual(mock.lastCall('Ams/RecentActivity/Clear').data, options);
  });

  it('should send an empty payload when no options are given', async () => {
    mock.on('Ams/RecentActivity/Clear', true);
    await cw28.recent_activity.clear();
    assert.deepEqual(mock.lastCall('Ams/RecentActivity/Clear').data, {});
  });

  it('should propagate CWError rejections', async () => {
    mock.onError('Ams/RecentActivity/Clear', new CWMockError(5, 'Cannot clear'));
    const e = await rejection(cw28.recent_activity.clear({ Cases: true }));
    assert.equal(e.Code, 5);
    assert.equal(e.Message, 'Cannot clear');
  });
});

describe('[RecentActivity::*Viewed] function tests', () => {
  const mock = createMock(cw28.Cityworks);
  const stamp = new Date('2024-01-02T03:04:05.000Z');
  const stampJson = stamp.toISOString();

  const cases = [
    { method: 'caseViewed', path: 'Ams/RecentActivity/CaseViewed', args: [107138], payload: { CaseId: 107138 } },
    { method: 'fireHydFlowTestViewed', path: 'Ams/RecentActivity/FireHydFlowTestViewed', args: [1], payload: { TestId: 1 } },
    { method: 'inspectionViewed', path: 'Ams/RecentActivity/InspectionViewed', args: [2], payload: { InspectionId: 2 } },
    { method: 'manholeInspectionViewed', path: 'Ams/RecentActivity/ManholeInspectionViewed', args: [3], payload: { InspectionId: 3 } },
    { method: 'pavementInspectionViewed', path: 'Ams/RecentActivity/PavementInspectionViewed', args: [4], payload: { InspectionSid: 4 } },
    { method: 'requestViewed', path: 'Ams/RecentActivity/RequestViewed', args: [5], payload: { RequestId: 5 } },
    { method: 'tvInspectionViewed', path: 'Ams/RecentActivity/TvInspectionViewed', args: [6], payload: { TvId: 6 } }
  ];

  cases.forEach(c => {
    it('should call ' + c.method + ' with the DateTimeStamp', async () => {
      mock.on(c.path, true);
      const r = await cw28.recent_activity[c.method](...c.args, stamp);
      assert.isTrue(r);
      assert.deepEqual(mock.paths(), [c.path]);
      assert.deepEqual(mock.lastCall(c.path).data, Object.assign({}, c.payload, { DateTimeStamp: stampJson }));
    });

    it('should omit DateTimeStamp from ' + c.method + ' when it is not provided', async () => {
      mock.on(c.path, true);
      await cw28.recent_activity[c.method](...c.args);
      assert.deepEqual(mock.lastCall(c.path).data, c.payload);
    });

    it('should propagate CWError rejections from ' + c.method, async () => {
      mock.onError(c.path, new CWMockError(7, 'Cannot record view'));
      const e = await rejection(cw28.recent_activity[c.method](...c.args, stamp));
      assert.equal(e.Code, 7);
      assert.equal(e.Message, 'Cannot record view');
    });
  });

  it('should accept a string DateTimeStamp', async () => {
    mock.on('Ams/RecentActivity/CaseViewed', true);
    await cw28.recent_activity.caseViewed(1, '2024-05-06T07:08:09Z');
    assert.deepEqual(mock.lastCall('Ams/RecentActivity/CaseViewed').data, { CaseId: 1, DateTimeStamp: '2024-05-06T07:08:09Z' });
  });

  it('should call workOrderViewed with the work order id and DateTimeStamp', async () => {
    mock.on('Ams/RecentActivity/WorkOrderViewed', true);
    const r = await cw28.recent_activity.workOrderViewed(1, 'WO-1', stamp);
    assert.isTrue(r);
    assert.deepEqual(mock.paths(), ['Ams/RecentActivity/WorkOrderViewed']);
    assert.deepEqual(mock.lastCall('Ams/RecentActivity/WorkOrderViewed').data, { WorkOrderSid: 1, WorkOrderId: 'WO-1', DateTimeStamp: stampJson });
  });

  it('should omit optional workOrderViewed fields when not provided', async () => {
    mock.on('Ams/RecentActivity/WorkOrderViewed', true);
    await cw28.recent_activity.workOrderViewed(1);
    assert.deepEqual(mock.lastCall('Ams/RecentActivity/WorkOrderViewed').data, { WorkOrderSid: 1 });
    await cw28.recent_activity.workOrderViewed(2, 'WO-2');
    assert.deepEqual(mock.lastCall('Ams/RecentActivity/WorkOrderViewed').data, { WorkOrderSid: 2, WorkOrderId: 'WO-2' });
  });

  it('should propagate CWError rejections from workOrderViewed', async () => {
    mock.onError('Ams/RecentActivity/WorkOrderViewed', new CWMockError(7, 'Cannot record view'));
    const e = await rejection(cw28.recent_activity.workOrderViewed(1, 'WO-1', stamp));
    assert.equal(e.Code, 7);
  });
});
