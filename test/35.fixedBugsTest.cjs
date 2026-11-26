'use strict';
// Regression tests for bugs that were fixed in the wrappers. No Cityworks instance is contacted.
const assert = require('chai').assert;
const https = require('https');
const EventEmitter = require('events');
const cw = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

const CW = cw.Cityworks.constructor;

async function rejection(promise) {
  try {
    await promise;
  } catch (e) {
    return e;
  }
  assert.fail('should have rejected');
}

describe('[Cityworks] auth promises settle on request errors', () => {
  const client = new CW('cw.example.test');
  const mock = createMock(client);

  it('validateToken should reject when the request fails', async () => {
    mock.onError('General/Authentication/Validate', {Message: 'down'});
    assert.equal((await rejection(client.validateToken('abc'))).Message, 'down');
  });

  it('revokeToken should reject when the request fails', async () => {
    mock.onError('General/Token/RevokeUser', {Message: 'down'});
    assert.equal((await rejection(client.revokeToken())).Message, 'down');
  });

  it('authenticateWithGISToken should reject on a request error and on a failing Status', async () => {
    const p = 'General/Authentication/AuthenticateGisToken';
    mock.onError(p, {Message: 'down'});
    assert.equal((await rejection(client.authenticateWithGISToken('u', 't', 'https://gis'))).Message, 'down');
    mock.onRaw(p, {Status: 4, Message: 'Not allowed'});
    const e = await rejection(client.authenticateWithGISToken('u', 't', 'https://gis'));
    assert.equal(e.Code, 100);
    assert.equal(e.Message, 'Not allowed');
  });

  it('authenticateWithGISToken should default Expires to two weeks and keep a provided value', async () => {
    const p = 'General/Authentication/AuthenticateGisToken';
    mock.on(p, {Token: 'tok'});
    assert.isTrue(await client.authenticateWithGISToken('u', 't', 'https://gis'));
    assert.equal(mock.lastCall(p).data.Expires, 1209600000);
    await client.authenticateWithGISToken('u', 't', 'https://gis', 5000);
    assert.equal(mock.lastCall(p).data.Expires, 5000);
    assert.equal(client.getToken(), 'tok');
  });
});

describe('[Report::print] older Cityworks versions', () => {
  createMock(cw.Cityworks);
  afterEach(() => cw.Cityworks.configure('cityworks.example.test', {path: 'cityworks', version: 23}));

  it('should reject instead of hanging when connected to a version before 23', async () => {
    cw.Cityworks.configure('cityworks.example.test', {path: 'cityworks', version: 15});
    const e = await rejection(cw.report.print('request', 5));
    assert.equal(e.Code, 407);
  });
});

describe('[General::getActivityMetadataByIds] validation', () => {
  const mock = createMock(cw.Cityworks);

  it('should not call the API after rejecting an unknown table', async () => {
    assert.equal((await rejection(cw.general.getActivityMetadataByIds([1], 'NOPE'))).Code, 2);
    assert.deepEqual(mock.paths(), []);
  });
});

describe('[Query] inputs are not modified and ids are numbers', () => {
  const mock = createMock(cw.Cityworks);

  it('getSaved should leave the queryTypes array intact', async () => {
    mock.on('General/Query/SavedQueries', []);
    const types = ['Request'];
    await cw.query.getSaved(types);
    assert.deepEqual(types, ['Request']);
    assert.equal(mock.lastCall('General/Query/SavedQueries').data.QueryType, 'Request');
  });

  it('run should leave the options object intact and let the query text win over options.QueryValue', async () => {
    mock.on('General/Query/Query', []);
    const options = {QueryValue: 'ignored', Page: 2};
    await cw.query.run('Request()', options);
    assert.deepEqual(options, {QueryValue: 'ignored', Page: 2});
    assert.deepEqual(mock.lastCall('General/Query/Query').data, {QueryValue: 'Request()', Page: 2});
  });

  it('should send numeric strings as numeric ids but an empty string as query text', async () => {
    mock.on('General/Query/Builder', []);
    await cw.query.build('42');
    assert.deepEqual(mock.lastCall('General/Query/Builder').data, {QueryId: 42});
    await cw.query.build('');
    assert.deepEqual(mock.lastCall('General/Query/Builder').data, {QueryValue: ''});
  });
});

describe('[Contractor::update] input handling', () => {
  const mock = createMock(cw.Cityworks);

  it('should not change the properties object passed in', async () => {
    mock.on('Ams/Contractor/Update', (d) => d);
    const props = {ContractorSid: 9, Description: 'x'};
    await cw.contractor.update(1, props);
    assert.deepEqual(props, {ContractorSid: 9, Description: 'x'});
    assert.deepEqual(mock.lastCall('Ams/Contractor/Update').data, {ContractorSid: 1, Description: 'x'});
  });

  it('should reject missing search attributes with CWError codes', async () => {
    assert.equal((await rejection(cw.contractor.search({}))).Code, 3);
    assert.equal((await rejection(cw.contractor.type.search({}))).Code, 1);
    assert.equal((await rejection(cw.contractor.type.searchObject({}))).Code, 2);
    assert.deepEqual(mock.paths(), []);
  });
});

describe('[Inspection] update, answers and move', () => {
  const mock = createMock(cw.Cityworks);

  it('update should resolve the updated inspection', async () => {
    mock.on('Ams/Inspection/Update', (d) => d);
    assert.deepEqual(await cw.inspection.update({InspectionId: 5, Remarks: 'x'}), {InspectionId: 5, Remarks: 'x'});
  });

  it('update should reject without an InspectionId', async () => {
    assert.equal((await rejection(cw.inspection.update({}))).Code, 1);
  });

  it('getAnswers should send InspectionId for a single inspection and InspectionIds for several', async () => {
    mock.on('Ams/Inspection/Answers', []);
    await cw.inspection.getAnswers([7]);
    assert.deepEqual(mock.lastCall('Ams/Inspection/Answers').data, {InspectionId: 7});
    await cw.inspection.getAnswers([7, 8]);
    assert.deepEqual(mock.lastCall('Ams/Inspection/Answers').data, {InspectionIds: [7, 8]});
  });

  it('move should not call the API when the projection is missing', async () => {
    assert.equal((await rejection(cw.inspection.move(1, 1, 2, {}))).Code, 3);
    assert.deepEqual(mock.paths(), []);
  });
});

describe('[WorkOrder] move and entities', () => {
  const mock = createMock(cw.Cityworks);

  it('should send an upper-case Z when moving', async () => {
    mock.on('Ams/WorkOrder/Move', true);
    await cw.workorder.move('WO-1', 1, 2, {WKID: 4326}, 5);
    assert.equal(mock.lastCall('Ams/WorkOrder/Move').data.Z, 5);
  });

  it('updateEntity should require and send EntityUid', async () => {
    mock.on('Ams/WorkOrder/UpdateEntity', {Status: 0});
    assert.equal((await rejection(cw.workorder.updateEntity(5, {EntityUids: ['u'], EntityType: 'T'}))).Code, 7);
    await cw.workorder.updateEntity(5, {EntityUid: 'u', EntityType: 'T'});
    assert.equal(mock.lastCall('Ams/WorkOrder/UpdateEntity').data.EntityUid, 'u');
  });
});

describe('[Briefcase] current case tracking', () => {
  const mock = createMock(cw.Cityworks);

  it('getByIds should remember the case id (not the whole object)', async () => {
    mock.on('Pll/CaseObject/ByIds', [{CaObjectId: 654660}]);
    await cw.briefcase.getByIds([654660]);
    assert.equal(cw.briefcase.current_case, 654660);
  });

  it('create should resolve null when the API returns no case instead of throwing', async () => {
    mock.onRaw('Pll/Case/Create', {Status: 0, Value: null});
    assert.isNull(await cw.briefcase.create(1, 2));
  });
});

describe('[Comments::get] and [Attachments::setTagsOnMany]', () => {
  const mock = createMock(cw.Cityworks);

  it('comments.get should reject rather than hang when no ids are given', async () => {
    assert.equal((await rejection(cw.request.comment.get(null))).Code, 2);
    assert.deepEqual(mock.paths(), []);
  });

  it('setTagsOnMany should wait for every attachment to be tagged and resolve their results', async () => {
    let n = 0;
    mock.on('Pll/AttachmentActivityTags/SyncTags', () => ({Synced: ++n}));
    const r = await cw.briefcase.attachments.setTagsOnMany([1, 2, 3], [{tagid: 1, tagtext: 'T'}]);
    assert.lengthOf(r, 3);
    assert.sameMembers(r.map(x => x.Synced), [1, 2, 3]);
    assert.deepEqual(mock.callsTo('Pll/AttachmentActivityTags/SyncTags').map(c => c.data.AttachmentId), [1, 2, 3]);
  });
});

describe('[Request::getTemplateQAs] dates', () => {
  const mock = createMock(cw.Cityworks);

  it('should send the modified-date filters when provided', async () => {
    mock.on('Ams/ServiceRequestTemplate/QA', []);
    const min = new Date('2024-01-01T00:00:00.000Z');
    await cw.request.getTemplateQAs([1], min);
    assert.deepEqual(mock.lastCall('Ams/ServiceRequestTemplate/QA').data, {ProblemSids: [1], MinimumDateModified: min.toISOString()});
  });
});

describe('[CaseFinancial::makePayment] validation', () => {
  const mock = createMock(cw.Cityworks);

  it('should not call the API when a payment is malformed', async () => {
    const e = await rejection(cw.briefcase.financial.makePayment([['Cash', '5']], [1]));
    assert.equal(e.Code, 301);
    assert.deepEqual(mock.paths(), []);
    const e2 = await rejection(cw.briefcase.financial.makePayment([['Cash', 'abc', 'c', '2026-01-01', 'r']], [1]));
    assert.equal(e2.Code, 302);
    assert.deepEqual(mock.paths(), []);
  });
});

describe('[Cityworks::runRequest] network failures', () => {
  const realRequest = https.request;
  afterEach(() => { https.request = realRequest; });

  it('should reject (CWError 13) when the connection fails instead of crashing', async () => {
    https.request = () => {
      const req = new EventEmitter();
      req.write = () => {};
      req.end = () => { setImmediate(() => req.emit('error', new Error('ETIMEDOUT'))); };
      return req;
    };
    const e = await rejection(new CW('cw.example.test').runRequest('Ams/Thing/Get', {}));
    assert.equal(e.Code, 13);
  });

  it('should destroy the request and reject when it times out', async () => {
    https.request = () => {
      const req = new EventEmitter();
      req.write = () => {};
      req.destroy = (err) => { setImmediate(() => req.emit('error', err)); };
      req.end = () => { setImmediate(() => req.emit('timeout')); };
      return req;
    };
    const e = await rejection(new CW('cw.example.test').runRequest('Ams/Thing/Get', {}));
    assert.equal(e.Code, 13);
  });
});
