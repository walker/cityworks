'use strict';
// Mocked tests: no Cityworks instance is contacted.
var assert = require('chai').assert;
const cw30 = require('../dist/index.js');
const { createMock, CWMockError } = require('./mockCityworks');

const PATH = 'General/CwMetaData/ByTableNameSids';

describe('[AuditLogs::context] function test', () => {
  it('should expose request.audit with REQUEST context', () => {
    assert.isObject(cw30.request.audit, 'request.audit is an object');
    assert.equal(cw30.request.audit.currentTableName, 'REQUEST');
  });

  it('should expose inspection.audit with INSPECTION context', () => {
    assert.isObject(cw30.inspection.audit, 'inspection.audit is an object');
    assert.equal(cw30.inspection.audit.currentTableName, 'INSPECTION');
  });

  it('should expose workorder.audit with WORKORDER context', () => {
    assert.isObject(cw30.workorder.audit, 'workorder.audit is an object');
    assert.equal(cw30.workorder.audit.currentTableName, 'WORKORDER');
  });

  it('should upper-case a valid table name given to the constructor', () => {
    const AuditLogs = cw30.request.audit.constructor;
    assert.equal(new AuditLogs(cw30.Cityworks, 'workorder').currentTableName, 'WORKORDER');
  });

  it('should throw a CWError (code 1) for an unsupported table name', () => {
    const AuditLogs = cw30.request.audit.constructor;
    let err;
    try {
      new AuditLogs(cw30.Cityworks, 'bogus');
    } catch (e) {
      err = e;
    }
    assert.isOk(err, 'constructor should throw');
    assert.equal(err.Name, 'Cityworks Exception');
    assert.equal(err.Code, 1);
    assert.equal(err.Message, 'Audit log table name not found.');
    assert.deepEqual(JSON.parse(err.Info), {provided: 'bogus', options: ['INSPECTION', 'REQUEST', 'WORKORDER']});
  });
});

describe('[AuditLogs::get] mocked function test', () => {
  const mock = createMock(cw30.Cityworks);
  const rows = [
    {CWId: 'a1', CwSid: 1, ObjectId: 1001, TableName: 'REQUEST', FieldName: 'Status', OldValue: 'Open', NewValue: 'Closed', LoginName: 'tester', DateModified: '2024-01-01T00:00:00Z'}
  ];

  it('should get request audit log metadata by single request id', async () => {
    mock.on(PATH, rows);
    const r = await cw30.request.audit.get(1001);
    assert.deepEqual(r, rows);
    assert.deepEqual(mock.paths(), [PATH]);
    assert.deepEqual(mock.lastCall(PATH).data, {Ids: [1001], TableName: 'REQUEST'});
  });

  it('should get request audit log metadata by request ids', async () => {
    mock.on(PATH, rows);
    const r = await cw30.request.audit.get([1001, 1002]);
    assert.deepEqual(r, rows);
    assert.deepEqual(mock.lastCall(PATH).data, {Ids: [1001, 1002], TableName: 'REQUEST'});
  });

  it('should get inspection audit log metadata by inspection id', async () => {
    mock.on(PATH, (data) => [{TableName: data.TableName, ObjectId: data.Ids[0]}]);
    const r = await cw30.inspection.audit.get(2001);
    assert.deepEqual(r, [{TableName: 'INSPECTION', ObjectId: 2001}]);
    assert.deepEqual(mock.lastCall(PATH).data, {Ids: [2001], TableName: 'INSPECTION'});
  });

  it('should get workorder audit log metadata by workorder sid', async () => {
    mock.on(PATH, (data) => [{TableName: data.TableName, ObjectId: data.Ids[0]}]);
    const r = await cw30.workorder.audit.get(3001);
    assert.deepEqual(r, [{TableName: 'WORKORDER', ObjectId: 3001}]);
    assert.deepEqual(mock.lastCall(PATH).data, {Ids: [3001], TableName: 'WORKORDER'});
  });

  it('should resolve an empty array when there is no audit history', async () => {
    mock.on(PATH, []);
    assert.deepEqual(await cw30.request.audit.get(1), []);
  });

  it('should resolve null when the API returns a null Value', async () => {
    mock.onRaw(PATH, {Status: 0, Value: null});
    assert.isNull(await cw30.request.audit.get(1));
  });

  it('should propagate a Cityworks error from the API', async () => {
    mock.onError(PATH, new CWMockError(7, 'Audit failure', {Message: 'Audit failure'}));
    let err;
    try {
      await cw30.workorder.audit.get(3001);
    } catch (e) {
      err = e;
    }
    assert.isOk(err, 'get should reject');
    assert.equal(err.Code, 7);
    assert.equal(err.Message, 'Audit failure');
    assert.equal(mock.callsTo(PATH).length, 1);
  });
});
