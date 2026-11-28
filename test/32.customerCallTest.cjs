'use strict';
// Mocked tests: no Cityworks instance is contacted.
var assert = require('chai').assert;
const _ = require('lodash');
const cw4 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

describe('[CustomerCall (construct)] function test', () => {
  it('should be a Request subclass available on request', () => {
    assert.isObject(cw4.request.customerCall);
    assert.isFunction(cw4.request.customerCall.getById);
    assert.isFunction(cw4.request.customerCall.addToRequest);
    assert.strictEqual(cw4.request.customerCall.customerCall, cw4.request.customerCall);
  });
});

describe('[CustomerCall] mocked request pass-through test', () => {
  const mock = createMock(cw4.Cityworks);
  let stored;
  let nextIncident;
  let calls;
  const paths = () => mock.paths();
  const customerCallPaths = () => _.filter(paths(), p => p.indexOf('Ams/CustomerCall/') === 0);

  beforeEach(() => {
    calls = mock.calls;
    nextIncident = 100;
    stored = [
      {IncidentNum: 5, RequestId: 7, FirstName: 'Pat', HomePhone: '(555) 010-0100', Email: 'pat@example.com'},
      {IncidentNum: 9, RequestId: 7, FirstName: 'Pat', CellPhone: '+1 555 010 0100'}
    ];
    mock.on('Ams/ServiceRequest/Create', (data) => _.assign({RequestId: 7}, data));
    mock.on('Ams/ServiceRequest/Update', (data) => _.assign({}, data));
    mock.on('Ams/CustomerCall/ByRequestId', () => _.cloneDeep(stored));
    mock.on('Ams/CustomerCall/AddToRequest', (data) => {
      const call = _.assign({}, data, {IncidentNum: nextIncident++});
      stored.push(call);
      return call;
    });
    mock.on('Ams/CustomerCall/Update', (data) => {
      const call = _.find(stored, {IncidentNum: data.IncidentNum});
      _.assign(call, data);
      return _.cloneDeep(call);
    });
  });

  it('should leave create and update untouched when no callers are provided', async () => {
    const sr = await cw4.request.create({ProblemSid: 309});
    const upd = await cw4.request.update({RequestId: 7});
    assert.notProperty(sr, 'CustomerCalls');
    assert.notProperty(upd, 'CustomerCalls');
    assert.deepEqual(customerCallPaths(), []);
  });

  it('should add callers to a newly created request using its RequestId', async () => {
    const sr = await cw4.request.create({ProblemSid: 309}, {FirstName: 'Lee', Email: 'pat@example.com'});
    assert.deepEqual(paths(), ['Ams/ServiceRequest/Create', 'Ams/CustomerCall/AddToRequest']);
    assert.equal(calls[1].data.RequestId, 7);
    assert.lengthOf(sr.CustomerCalls, 1);
    assert.equal(sr.CustomerCalls[0].IncidentNum, 100);
  });

  it('should update the call with the given IncidentNum', async () => {
    const sr = await cw4.request.update({RequestId: 7}, {IncidentNum: 9, Comments: 'hi'});
    assert.deepEqual(customerCallPaths(), ['Ams/CustomerCall/Update']);
    assert.equal(calls[1].data.IncidentNum, 9);
    assert.equal(calls[1].data.RequestId, 7);
    assert.equal(sr.CustomerCalls[0].Comments, 'hi');
  });

  it('should update an existing call when a phone number matches (across phone fields, ignoring formatting)', async () => {
    const sr = await cw4.request.update({RequestId: 7}, {FirstName: 'Pat', WorkPhone: '555.010.0100'});
    // 5 and 9 both match; the most recent (highest IncidentNum) wins
    assert.equal(sr.CustomerCalls[0].IncidentNum, 9);
    assert.deepEqual(customerCallPaths(), ['Ams/CustomerCall/ByRequestId', 'Ams/CustomerCall/Update']);
  });

  it('should update an existing call when an email matches (case and whitespace insensitive)', async () => {
    const sr = await cw4.request.update({RequestId: 7}, {Email: '  PAT@Example.com '});
    assert.equal(sr.CustomerCalls[0].IncidentNum, 5);
  });

  it('should add a new call when nothing matches', async () => {
    const sr = await cw4.request.update({RequestId: 7}, [{Email: 'other@example.com'}, {FirstName: 'No contact info'}]);
    assert.deepEqual(_.map(sr.CustomerCalls, 'IncidentNum'), [100, 101]);
    assert.deepEqual(customerCallPaths(), ['Ams/CustomerCall/ByRequestId', 'Ams/CustomerCall/AddToRequest', 'Ams/CustomerCall/AddToRequest']);
  });

  it('should match a call added earlier in the same batch and only look up existing calls once', async () => {
    const sr = await cw4.request.update({RequestId: 7}, [{Email: 'new@example.com', FirstName: 'A'}, {Email: 'NEW@example.com', FirstName: 'B'}]);
    assert.deepEqual(_.map(sr.CustomerCalls, 'IncidentNum'), [100, 100]);
    assert.equal(_.filter(paths(), p => p === 'Ams/CustomerCall/ByRequestId').length, 1);
    assert.equal(stored.length, 3);
  });

  it('should always add a new call (ignoring IncidentNum and matches) when newCall is true', async () => {
    const sr = await cw4.request.update({RequestId: 7}, {IncidentNum: 5, Employee: 'someone', Email: 'pat@example.com'}, {newCall: true});
    assert.deepEqual(customerCallPaths(), ['Ams/CustomerCall/AddToRequest']);
    assert.equal(sr.CustomerCalls[0].IncidentNum, 100);
    assert.notProperty(calls[1].data, 'Employee');
    assert.equal(stored[0].Comments, undefined);
    assert.equal(stored.length, 3);
  });

  it('should reject with the saved request when a caller fails', async () => {
    mock.onError('Ams/CustomerCall/AddToRequest', {Message: 'boom'});
    try {
      await cw4.request.update({RequestId: 7, Description: 'saved'}, {FirstName: 'x'}, {newCall: true});
      assert.fail('should have rejected');
    } catch (e) {
      assert.equal(e.Code, 607);
      assert.include(e.Message, 'boom');
      assert.equal(JSON.parse(e.Info).Request.Description, 'saved');
    }
  });

  it('should validate required identifiers on the wrapper methods', async () => {
    let err;
    try { await cw4.request.customerCall.addToRequest(undefined, {}); } catch (e) { err = e; }
    assert.equal(err.Code, 601);
    err = null;
    try { await cw4.request.customerCall.updateCall(undefined, {}); } catch (e) { err = e; }
    assert.equal(err.Code, 602);
    assert.deepEqual(calls, []);
  });

  it('should call the remaining endpoints with the documented parameters', async () => {
    _.forEach(['ByIncidentNum', 'ByRequestIds', 'CallerQuestions', 'CallerQuestionsByRequestIds', 'Delete', 'Move', 'MoveToRequest'], p => mock.on('Ams/CustomerCall/' + p, true));
    mock.on('Ams/CustomerCall/ByRequestIds', []);
    mock.on('Ams/CustomerCall/CallerQuestions', []);
    mock.on('Ams/CustomerCall/CallerQuestionsByRequestIds', {});
    const cc = cw4.request.customerCall;
    await cc.getByIncidentNum(5);
    await cc.getByRequestIds([1, 2]);
    await cc.getQuestions([5]);
    await cc.getQuestionsByRequestIds([1]);
    await cc.deleteCall(5);
    await cc.moveCall(5, 1, 2, {WKID: 4326}, 3);
    await cc.moveToRequest(1, 2, [5]);
    assert.deepEqual(_.map(calls, c => _.pick(c, ['path', 'data'])), [
      {path: 'Ams/CustomerCall/ByIncidentNum', data: {IncidentNum: 5}},
      {path: 'Ams/CustomerCall/ByRequestIds', data: {RequestIds: [1, 2]}},
      {path: 'Ams/CustomerCall/CallerQuestions', data: {IncidentNums: [5]}},
      {path: 'Ams/CustomerCall/CallerQuestionsByRequestIds', data: {RequestIds: [1]}},
      {path: 'Ams/CustomerCall/Delete', data: {IncidentNum: 5}},
      {path: 'Ams/CustomerCall/Move', data: {IncidentNum: 5, X: 1, Y: 2, WKID: 4326, Z: 3}},
      {path: 'Ams/CustomerCall/MoveToRequest', data: {FromRequestId: 1, ToRequestId: 2, IncidentNums: [5]}}
    ]);
  });
});
