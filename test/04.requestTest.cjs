'use strict';
// Mocked tests: no Cityworks instance is contacted.
const path = require('path');
const assert = require('chai').assert;
const _ = require('lodash');
const cw4 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

const rejection = async (promise) => {
  try {
    await promise;
  } catch (e) {
    return e;
  }
  return assert.fail('expected the promise to reject');
};

describe('[Request (construct)] function test', () => {
  it('should be a defined object', () => {
    assert.isObject(cw4.request, 'Request is an object');
  });
  it('should have an admin property which is a defined object', () => {
    assert.isObject(cw4.request.admin, 'Admin is an object');
  });
  it('should have an comment property which is a defined object', () => {
    assert.isObject(cw4.request.comment, 'Comment is an object');
  });
});

describe('[Request] mocked service request tests', () => {
  const mock = createMock(cw4.Cityworks);
  const BASE = 'Ams/ServiceRequest/';

  describe('[Request::getProblemNodes] function test', () => {
    const nodes = [
      {NodeName: 'A | Alpha', Description: 'Alpha', Cancel: false},
      {NodeName: 'B | Beta', Description: 'Beta', Cancel: true}
    ];

    it('should return the list of problem nodes with default flags', async () => {
      mock.on(BASE + 'ProblemNodes', nodes);
      const resp = await cw4.request.getProblemNodes(1);
      assert.deepEqual(resp, nodes);
      assert.property(resp[0], 'Cancel');
      assert.deepEqual(mock.lastCall(BASE + 'ProblemNodes').data, {DomainId: 1, IncludeCancelled: false, ViewOnly: false});
    });
    it('should send view only privileges', async () => {
      mock.on(BASE + 'ProblemNodes', nodes);
      await cw4.request.getProblemNodes(1, true);
      assert.deepEqual(mock.lastCall(BASE + 'ProblemNodes').data, {DomainId: 1, IncludeCancelled: false, ViewOnly: true});
    });
    it('should include cancelled nodes when requested', async () => {
      mock.on(BASE + 'ProblemNodes', nodes);
      const resp = await cw4.request.getProblemNodes(1, false, null, true);
      assert.isTrue(_.some(resp, {Cancel: true}));
      assert.deepEqual(mock.lastCall(BASE + 'ProblemNodes').data, {DomainId: 1, IncludeCancelled: true, ViewOnly: false});
    });
    it('should send code and description display mode with its delimiter', async () => {
      mock.on(BASE + 'ProblemNodes', nodes);
      const delimiter = ' | ';
      const resp = await cw4.request.getProblemNodes(1, true, {DisplayTextMode: 'CD', DisplayTextDelimeter: delimiter});
      assert.deepEqual(mock.lastCall(BASE + 'ProblemNodes').data, {DomainId: 1, IncludeCancelled: false, ViewOnly: true, DisplayTextMode: 'CD', DisplayTextDelimeter: delimiter});
      assert.equal(_.split(resp[0].NodeName, delimiter)[1], resp[0].Description);
    });
    it('should send description display mode without a delimiter', async () => {
      mock.on(BASE + 'ProblemNodes', [{NodeName: 'Alpha', Description: 'Alpha'}]);
      const resp = await cw4.request.getProblemNodes(1, true, {DisplayTextMode: 'D', DisplayTextDelimeter: '-'});
      assert.deepEqual(mock.lastCall(BASE + 'ProblemNodes').data, {DomainId: 1, IncludeCancelled: false, ViewOnly: true, DisplayTextMode: 'D'});
      assert.equal(resp[0].NodeName, resp[0].Description);
    });
    it('should ignore a display mode object without DisplayTextMode', async () => {
      mock.on(BASE + 'ProblemNodes', []);
      await cw4.request.getProblemNodes(1, false, {DisplayTextDelimeter: '-'});
      assert.notProperty(mock.lastCall(BASE + 'ProblemNodes').data, 'DisplayTextMode');
      assert.notProperty(mock.lastCall(BASE + 'ProblemNodes').data, 'DisplayTextDelimeter');
    });
    it('should propagate API errors', async () => {
      mock.onError(BASE + 'ProblemNodes', {Message: 'nope'});
      const e = await rejection(cw4.request.getProblemNodes(1));
      assert.equal(e.Message, 'nope');
    });
  });

  describe('[Request::getProblems] function test', () => {
    it('should return a list of problems using default flags', async () => {
      mock.on(BASE + 'Problems', [{ProblemSid: 1}]);
      const resp = await cw4.request.getProblems();
      assert.deepEqual(resp, [{ProblemSid: 1}]);
      assert.deepEqual(mock.lastCall(BASE + 'Problems').data, {ForPublicOnly: false, OnlyActiveTemplates: true});
    });
    it('should send flags and domain IDs when provided', async () => {
      mock.on(BASE + 'Problems', []);
      await cw4.request.getProblems(true, false, [1, 2]);
      assert.deepEqual(mock.lastCall(BASE + 'Problems').data, {ForPublicOnly: true, OnlyActiveTemplates: false, DomainIds: [1, 2]});
    });
    it('should propagate API errors', async () => {
      mock.onError(BASE + 'Problems', {Message: 'nope'});
      assert.equal((await rejection(cw4.request.getProblems())).Message, 'nope');
    });
  });

  describe('[Request::create] function test', () => {
    it('should return a new request and send the payload', async () => {
      mock.on(BASE + 'Create', (data) => _.assign({RequestId: 7}, data));
      const resp = await cw4.request.create({ProblemSid: 309});
      assert.equal(resp.ProblemSid, 309);
      assert.equal(resp.RequestId, 7);
      assert.deepEqual(mock.lastCall(BASE + 'Create').data, {ProblemSid: 309});
    });
    it('should reject without calling the API when ProblemSid is missing', async () => {
      const e = await rejection(cw4.request.create({Description: 'x'}));
      assert.equal(e.Code, 2);
      assert.deepEqual(mock.calls, []);
    });
    it('should propagate API errors', async () => {
      mock.onError(BASE + 'Create', {Message: 'nope'});
      assert.equal((await rejection(cw4.request.create({ProblemSid: 1}))).Message, 'nope');
    });
  });

  describe('[Request::update] function test', () => {
    it('should return the updated request and send the payload', async () => {
      mock.on(BASE + 'Update', (data) => ({RequestId: data.RequestId, ProbAddress: data.Address}));
      const resp = await cw4.request.update({RequestId: 5, Address: '1 TEST ST'});
      assert.equal(resp.ProbAddress, '1 TEST ST');
      assert.deepEqual(mock.lastCall(BASE + 'Update').data, {RequestId: 5, Address: '1 TEST ST'});
    });
    it('should reject without calling the API when RequestId is missing', async () => {
      const e = await rejection(cw4.request.update({Address: '1 TEST ST'}));
      assert.equal(e.Code, 3);
      assert.deepEqual(mock.calls, []);
    });
    it('should propagate API errors', async () => {
      mock.onError(BASE + 'Update', {Message: 'nope'});
      assert.equal((await rejection(cw4.request.update({RequestId: 5}))).Message, 'nope');
    });
  });

  describe('[Request::move] function test', () => {
    it('should send coordinates merged with the projection', async () => {
      mock.on(BASE + 'Move', {X: 1, Y: 2});
      const resp = await cw4.request.move(5, 1, 2, {WKID: '4326'});
      assert.deepEqual(resp, {X: 1, Y: 2});
      assert.deepEqual(mock.lastCall(BASE + 'Move').data, {RequestId: 5, X: 1, Y: 2, WKID: '4326'});
    });
    it('should include Z (including 0) and WKT/VcsWKID when provided', async () => {
      mock.on(BASE + 'Move', true);
      await cw4.request.move(5, 1, 2, {WKT: 'PROJCS[]', VcsWKID: '5703'}, 0);
      assert.deepEqual(mock.lastCall(BASE + 'Move').data, {RequestId: 5, X: 1, Y: 2, Z: 0, WKT: 'PROJCS[]', VcsWKID: '5703'});
    });
    it('should reject when neither WKID nor WKT is provided', async () => {
      mock.on(BASE + 'Move', true);
      const e = await rejection(cw4.request.move(5, 1, 2, {VcsWKID: '5703'}));
      assert.equal(e.Code, 6);
      assert.deepEqual(mock.paths(), []);
    });
    it('should propagate API errors', async () => {
      mock.onError(BASE + 'Move', {Message: 'nope'});
      assert.equal((await rejection(cw4.request.move(5, 1, 2, {WKID: '4326'}))).Message, 'nope');
    });
  });

  describe('[Request::delete] function test', () => {
    it('should return the deleted request ID(s)', async () => {
      mock.on(BASE + 'Delete', (data) => data.RequestIds);
      const resp = await cw4.request.delete([5, 6]);
      assert.deepEqual(resp, [5, 6]);
      assert.deepEqual(mock.lastCall(BASE + 'Delete').data, {RequestIds: [5, 6]});
    });
    it('should reject with CWError 4 when the response status is an error', async () => {
      mock.onRaw(BASE + 'Delete', {Status: 1, Message: 'cannot delete', Value: null});
      const e = await rejection(cw4.request.delete([5]));
      assert.equal(e.Code, 4);
      assert.equal(e.Message, 'cannot delete');
    });
    it('should propagate API errors', async () => {
      mock.onError(BASE + 'Delete', {Message: 'nope'});
      assert.equal((await rejection(cw4.request.delete([5]))).Message, 'nope');
    });
  });

  describe('[Request::cancel] function test', () => {
    it('should return the updated request(s)', async () => {
      mock.on(BASE + 'Cancel', (data) => _.map(data.RequestIds, id => ({RequestId: id})));
      const resp = await cw4.request.cancel([5]);
      assert.isTrue(_.some(resp, {RequestId: 5}));
      assert.deepEqual(mock.lastCall(BASE + 'Cancel').data, {RequestIds: [5]});
    });
    it('should send the cancel reason and date when provided', async () => {
      mock.on(BASE + 'Cancel', []);
      const date = new Date('2024-01-02T03:04:05.000Z');
      await cw4.request.cancel([5], 'duplicate', date);
      assert.deepEqual(mock.lastCall(BASE + 'Cancel').data, {RequestIds: [5], CancelReason: 'duplicate', DateCancelled: date.toISOString()});
    });
    it('should propagate API errors', async () => {
      mock.onError(BASE + 'Cancel', {Message: 'nope'});
      assert.equal((await rejection(cw4.request.cancel([5]))).Message, 'nope');
    });
  });

  describe('[Request::uncancel] function test', () => {
    it('should return the updated request(s)', async () => {
      mock.on(BASE + 'Uncancel', (data) => _.map(data.RequestIds, id => ({RequestId: id})));
      const resp = await cw4.request.uncancel([5]);
      assert.isTrue(_.some(resp, {RequestId: 5}));
      assert.deepEqual(mock.lastCall(BASE + 'Uncancel').data, {RequestIds: [5]});
    });
    it('should propagate API errors', async () => {
      mock.onError(BASE + 'Uncancel', {Message: 'nope'});
      assert.equal((await rejection(cw4.request.uncancel([5]))).Message, 'nope');
    });
  });

  describe('[Request::close] function test', () => {
    it('should return the closed request(s)', async () => {
      mock.on(BASE + 'Close', (data) => _.map(data.RequestIds, id => ({RequestId: id})));
      const resp = await cw4.request.close([5]);
      assert.isTrue(_.some(resp, {RequestId: 5}));
      assert.deepEqual(mock.lastCall(BASE + 'Close').data, {RequestIds: [5]});
    });
    it('should reject with CWError 5 when the response status is an error', async () => {
      mock.onRaw(BASE + 'Close', {Status: 1, Message: 'cannot close', Value: null});
      const e = await rejection(cw4.request.close([5]));
      assert.equal(e.Code, 5);
      assert.equal(e.Message, 'cannot close');
    });
    it('should propagate API errors', async () => {
      mock.onError(BASE + 'Close', {Message: 'nope'});
      assert.equal((await rejection(cw4.request.close([5]))).Message, 'nope');
    });
  });

  describe('[Request::reopen] function test', () => {
    it('should return the reopened request(s)', async () => {
      mock.on(BASE + 'ReOpen', (data) => _.map(data.RequestIds, id => ({RequestId: id})));
      const resp = await cw4.request.reopen([5]);
      assert.isTrue(_.some(resp, {RequestId: 5}));
      assert.deepEqual(mock.lastCall(BASE + 'ReOpen').data, {RequestIds: [5]});
    });
    it('should propagate API errors', async () => {
      mock.onError(BASE + 'ReOpen', {Message: 'nope'});
      assert.equal((await rejection(cw4.request.reopen([5]))).Message, 'nope');
    });
  });

  describe('[Request::changeProblem] function test', () => {
    it('should send the request and problem IDs and return the request', async () => {
      mock.on(BASE + 'ChangeProblem', (data) => ({RequestId: data.RequestId, ProblemSid: data.ProblemSid}));
      const resp = await cw4.request.changeProblem(5, 309);
      assert.deepEqual(resp, {RequestId: 5, ProblemSid: 309});
      assert.deepEqual(mock.lastCall(BASE + 'ChangeProblem').data, {RequestId: 5, ProblemSid: 309});
    });
    it('should propagate API errors', async () => {
      mock.onError(BASE + 'ChangeProblem', {Message: 'nope'});
      assert.equal((await rejection(cw4.request.changeProblem(5, 309))).Message, 'nope');
    });
  });

  describe('[Request::changeCustomFieldCategory] function test', () => {
    it('should send the request IDs and category ID', async () => {
      mock.on(BASE + 'ChangeCustomFieldCategory', [{RequestId: 5}]);
      const resp = await cw4.request.changeCustomFieldCategory([5], 12);
      assert.deepEqual(resp, [{RequestId: 5}]);
      assert.deepEqual(mock.lastCall(BASE + 'ChangeCustomFieldCategory').data, {RequestIds: [5], CategoryId: 12});
    });
  });

  describe('[Request::getAuditLog] function test', () => {
    it('should send the request ID and return the log', async () => {
      mock.on(BASE + 'AuditLog', [{Action: 'Created'}]);
      assert.deepEqual(await cw4.request.getAuditLog(5), [{Action: 'Created'}]);
      assert.deepEqual(mock.lastCall(BASE + 'AuditLog').data, {RequestId: 5});
    });
  });

  describe('[Request::getById] function test', () => {
    it('should send the request ID and return the request', async () => {
      mock.on(BASE + 'ById', (data) => ({RequestId: data.RequestId}));
      assert.deepEqual(await cw4.request.getById(5), {RequestId: 5});
      assert.deepEqual(mock.lastCall(BASE + 'ById').data, {RequestId: 5});
    });
    it('should propagate API errors', async () => {
      mock.onError(BASE + 'ById', {Message: 'nope'});
      assert.equal((await rejection(cw4.request.getById(5))).Message, 'nope');
    });
  });

  describe('[Request::getByIds] function test', () => {
    it('should send the request IDs and return the requests', async () => {
      mock.on(BASE + 'ByIds', (data) => _.map(data.RequestIds, id => ({RequestId: id})));
      assert.deepEqual(await cw4.request.getByIds([5, 6]), [{RequestId: 5}, {RequestId: 6}]);
      assert.deepEqual(mock.lastCall(BASE + 'ByIds').data, {RequestIds: [5, 6]});
    });
  });

  describe('[Request::getCustomFields] function test', () => {
    it('should send the request IDs and return the custom fields', async () => {
      mock.on(BASE + 'CustomFields', [{RequestId: 5, Fields: []}]);
      assert.deepEqual(await cw4.request.getCustomFields([5]), [{RequestId: 5, Fields: []}]);
      assert.deepEqual(mock.lastCall(BASE + 'CustomFields').data, {RequestIds: [5]});
    });
  });

  describe('[Request::search / searchObject] function test', () => {
    it('should send the search data as the payload and return the IDs', async () => {
      mock.on(BASE + 'Search', [5, 6]);
      assert.deepEqual(await cw4.request.search({ProblemSids: [1], Status: 'OPEN'}), [5, 6]);
      assert.deepEqual(mock.lastCall(BASE + 'Search').data, {ProblemSids: [1], Status: 'OPEN'});
    });
    it('should send the request ID to the object search', async () => {
      mock.on(BASE + 'SearchObject', [{RequestId: 5}]);
      assert.deepEqual(await cw4.request.searchObject('5'), [{RequestId: 5}]);
      assert.deepEqual(mock.lastCall(BASE + 'SearchObject').data, {RequestId: '5'});
    });
  });

  describe('[Request::createSearchDefinition] function test', () => {
    it('should send the search data untouched when no name is given', async () => {
      mock.on(BASE + 'CreateSearchDefinition', {SearchId: 1});
      assert.deepEqual(await cw4.request.createSearchDefinition({Status: 'OPEN'}), {SearchId: 1});
      assert.deepEqual(mock.lastCall(BASE + 'CreateSearchDefinition').data, {Status: 'OPEN'});
    });
    it('should save the definition with EURL enabled when a name is given', async () => {
      mock.on(BASE + 'CreateSearchDefinition', {SearchId: 1});
      await cw4.request.createSearchDefinition({Status: 'OPEN'}, 'My search');
      assert.deepEqual(mock.lastCall(BASE + 'CreateSearchDefinition').data, {Status: 'OPEN', SearchName: 'My search', SaveDefinition: true, EnableEurl: true});
    });
    it('should honor the saveDefinition and enableEurl flags', async () => {
      mock.on(BASE + 'CreateSearchDefinition', {SearchId: 1});
      await cw4.request.createSearchDefinition({}, 'My search', undefined, false, false);
      assert.deepEqual(mock.lastCall(BASE + 'CreateSearchDefinition').data, {SearchName: 'My search', SaveDefinition: false, EnableEurl: false});
    });
  });

  describe('[Request] problem option getters', () => {
    it('should get problems by keywords', async () => {
      mock.on(BASE + 'ProblemsByKeywords', [{ProblemSid: 1}]);
      assert.deepEqual(await cw4.request.getProblemsByKeywords('pothole'), [{ProblemSid: 1}]);
      assert.deepEqual(mock.lastCall(BASE + 'ProblemsByKeywords').data, {Keywords: 'pothole'});
    });
    it('should get priorities, custom field templates, Q&A and the problem leaf by ProblemSid', async () => {
      mock.on(BASE + 'Priorities', ['High']);
      mock.on(BASE + 'TemplateCustomFields', ['cf']);
      mock.on(BASE + 'QA', ['qa']);
      mock.on(BASE + 'ProblemLeafBySid', {ProblemSid: 309});
      assert.deepEqual(await cw4.request.getPriorities(309), ['High']);
      assert.deepEqual(await cw4.request.getCustomFieldTemplate(309), ['cf']);
      assert.deepEqual(await cw4.request.getQASettings(309), ['qa']);
      assert.deepEqual(await cw4.request.getProblemLeaf(309), {ProblemSid: 309});
      assert.deepEqual(mock.lastCall(BASE + 'Priorities').data, {ProblemSids: 309});
      assert.deepEqual(mock.lastCall(BASE + 'TemplateCustomFields').data, {ProblemSids: 309});
      assert.deepEqual(mock.lastCall(BASE + 'QA').data, {ProblemSids: 309});
      assert.deepEqual(mock.lastCall(BASE + 'ProblemLeafBySid').data, {ProblemSid: 309});
    });
    it('should get default statuses for domains', async () => {
      mock.on(BASE + 'DefaultStatus', ['OPEN']);
      assert.deepEqual(await cw4.request.getStatuses([1, 2]), ['OPEN']);
      assert.deepEqual(mock.lastCall(BASE + 'DefaultStatus').data, {DomainIds: [1, 2]});
    });
    it('should get street codes with an empty payload', async () => {
      mock.on(BASE + 'AllStreetCode', ['MAIN']);
      assert.deepEqual(await cw4.request.streetCodes(), ['MAIN']);
      assert.deepEqual(mock.lastCall(BASE + 'AllStreetCode').data, {});
    });
  });

  describe('[Request] employee lists', () => {
    it('should get DispatchTo and SubmitTo lists from their own endpoints', async () => {
      mock.on(BASE + 'DispatchTo', ['d']);
      mock.on(BASE + 'SubmitTo', ['s']);
      assert.deepEqual(await cw4.request.getDispatchTos(3), ['d']);
      assert.deepEqual(await cw4.request.getSubmitTos(3), ['s']);
      assert.deepEqual(mock.lastCall(BASE + 'DispatchTo').data, {DomainId: 3});
      assert.deepEqual(mock.lastCall(BASE + 'SubmitTo').data, {DomainId: 3});
    });
    it('should reject an unknown list type without calling the API', async () => {
      const e = await rejection(cw4.request.getEmployeeLists('Other', 3));
      assert.equal(e.Code, 2);
      assert.deepEqual(mock.calls, []);
    });
  });

  describe('[Request] templates', () => {
    const T = 'Ams/ServiceRequestTemplate/';
    it('should search templates and send search data as the payload', async () => {
      mock.on(T + 'Search', [1]);
      assert.deepEqual(await cw4.request.searchTemplates({Active: true}), [1]);
      assert.deepEqual(mock.lastCall(T + 'Search').data, {Active: true});
    });
    it('should create a template search definition', async () => {
      mock.on(T + 'CreateSearchDefinition', {SearchId: 2});
      assert.deepEqual(await cw4.request.createTemplateSearchDefinition({Active: true}, 'Tpl search', undefined, false), {SearchId: 2});
      assert.deepEqual(mock.lastCall(T + 'CreateSearchDefinition').data, {Active: true, SearchName: 'Tpl search', SaveDefinition: false});
    });
    it('should not add search name fields to an unnamed template search definition', async () => {
      mock.on(T + 'CreateSearchDefinition', {SearchId: 2});
      await cw4.request.createTemplateSearchDefinition({Active: true});
      assert.deepEqual(mock.lastCall(T + 'CreateSearchDefinition').data, {Active: true});
    });
    it('should get templates with default flags', async () => {
      mock.on(T + 'Templates', [{ProblemSid: 1}]);
      assert.deepEqual(await cw4.request.getTemplates(undefined), [{ProblemSid: 1}]);
      assert.deepEqual(mock.lastCall(T + 'Templates').data, {CanCreate: false, IncludeInactiveIf: false});
    });
    it('should get templates with IDs, flags and modified dates', async () => {
      mock.on(T + 'Templates', []);
      const min = new Date('2024-01-01T00:00:00.000Z');
      const max = new Date('2024-02-01T00:00:00.000Z');
      await cw4.request.getTemplates([1, 2], true, true, min, max);
      assert.deepEqual(mock.lastCall(T + 'Templates').data, {CanCreate: true, IncludeInactiveIf: true, TemplateIds: [1, 2], MinimumDateModified: min.toISOString(), MaximumDateModified: max.toISOString()});
    });
    it('should get work order templates by ProblemSids', async () => {
      mock.on(T + 'WorkOrderTemplates', [{Id: 1}]);
      assert.deepEqual(await cw4.request.getWOTemplates([1, 2], true), [{Id: 1}]);
      assert.deepEqual(mock.lastCall(T + 'WorkOrderTemplates').data, {ProblemSids: [1, 2], IncludeInactive: true});
      await cw4.request.getWOTemplates([3]);
      assert.deepEqual(mock.lastCall(T + 'WorkOrderTemplates').data, {ProblemSids: [3], IncludeInactive: false});
    });
    it('should call the by-ID and Q&A template endpoints and return the response values', async () => {
      mock.on(T + 'ByIds', [{ProblemSid: 1}]);
      mock.on(T + 'QA', [{Question: 'q'}]);
      assert.deepEqual(await cw4.request.getTemplatesById([1]), [{ProblemSid: 1}]);
      assert.deepEqual(await cw4.request.getTemplateQAs([1]), [{Question: 'q'}]);
      assert.equal(mock.callsTo(T + 'ByIds').length, 1);
      assert.equal(mock.callsTo(T + 'QA').length, 1);
      assert.deepEqual(mock.lastCall(T + 'ByIds').data, {ProblemSids: [1]});
      assert.deepEqual(mock.lastCall(T + 'QA').data, {ProblemSids: [1]});
    });
    it('should send modified dates to the by-ID template endpoint', async () => {
      mock.on(T + 'ByIds', []);
      const min = new Date('2024-01-01T00:00:00.000Z');
      await cw4.request.getTemplatesById([1], min);
      assert.equal(mock.lastCall(T + 'ByIds').data.MinimumDateModified, min.toISOString());
      assert.notProperty(mock.lastCall(T + 'ByIds').data, 'MaximumDateModified');
    });
  });

  describe('[Request] map layer fields', () => {
    const M = 'Ams/TemplateMapLayer/';
    it('should get map layer fields by request ID', async () => {
      mock.on(M + 'ServiceRequestInstanceMapLayersByRequestId', [{Id: 1}]);
      assert.deepEqual(await cw4.request.getMLFs(5), [{Id: 1}]);
      assert.deepEqual(mock.lastCall(M + 'ServiceRequestInstanceMapLayersByRequestId').data, {ServiceRequestId: 5});
    });
    it('should update existing map layer fields when a problem ID is provided', async () => {
      mock.on(M + 'UpdateServiceRequestInstanceMapLayers', {Updated: true});
      const resp = await cw4.request.updateMLFs(5, {x: 1, y: 2, z: 3}, 309, 4);
      assert.deepEqual(resp, {Updated: true});
      assert.deepEqual(mock.lastCall(M + 'UpdateServiceRequestInstanceMapLayers').data, {x: 1, y: 2, z: 3, ProblemsId: 309, ServiceRequestId: 5, DomainId: 4});
    });
    it('should use the by-template endpoint without a problem ID and omit DomainId', async () => {
      mock.on(M + 'UpdateServiceRequestInstanceMapLayersByTemplate', {Updated: true});
      await cw4.request.updateMLFs(5, {x: 1, y: 2});
      assert.deepEqual(mock.paths(), [M + 'UpdateServiceRequestInstanceMapLayersByTemplate']);
      assert.deepEqual(mock.lastCall(M + 'UpdateServiceRequestInstanceMapLayersByTemplate').data, {x: 1, y: 2, ServiceRequestId: 5});
    });
    it('should not mutate the provided coordinates', async () => {
      mock.on(M + 'UpdateServiceRequestInstanceMapLayers', true);
      const coords = {x: 1, y: 2};
      await cw4.request.updateMLFs(5, coords, 309);
      assert.deepEqual(coords, {x: 1, y: 2});
    });
    it('should delete map layer fields by request ID', async () => {
      mock.on(M + 'DeleteServiceRequestInstancesByRequestId', [{Id: 1}]);
      assert.deepEqual(await cw4.request.deleteMLFs(5), [{Id: 1}]);
      assert.deepEqual(mock.lastCall(M + 'DeleteServiceRequestInstancesByRequestId').data, {ServiceRequestId: 5});
    });
  });
});

describe('[Request::comment] mocked function test', () => {
  const mock = createMock(cw4.Cityworks);

  it('should add a comment using the Request activity type', async () => {
    mock.on('Ams/Comment/Add', (data) => ({Comments: data.Comments}));
    const resp = await cw4.request.comment.add(5, 'New comment');
    assert.equal(resp.Comments, 'New comment');
    assert.deepEqual(mock.lastCall('Ams/Comment/Add').data, {ActivityType: 1, ActivitySid: 5, Comments: 'New comment'});
  });

  it('should update a comment', async () => {
    mock.on('Ams/Comment/Update', (data) => ({Comments: data.Comments}));
    const resp = await cw4.request.comment.update(9, 'Updated comment');
    assert.equal(resp.Comments, 'Updated comment');
    assert.deepEqual(mock.lastCall('Ams/Comment/Update').data, {ActivityType: 1, CommentId: 9, Comments: 'Updated comment'});
  });

  it('should propagate API errors when adding', async () => {
    mock.onError('Ams/Comment/Add', {Message: 'nope'});
    assert.equal((await rejection(cw4.request.comment.add(5, 'x'))).Message, 'nope');
  });

  it('should return the comments for a single request unwrapped', async () => {
    mock.on('Ams/Comment/ByActivitySids', {5: [{Comments: 'a'}]});
    const resp = await cw4.request.comment.get([5]);
    assert.deepEqual(resp, [{Comments: 'a'}]);
    assert.deepEqual(mock.lastCall('Ams/Comment/ByActivitySids').data, {ActivitySids: [5], ActivityType: 1});
  });

  it('should reject when the comments API errors', async () => {
    mock.onError('Ams/Comment/ByActivitySids', {Message: 'nope'});
    const e = await rejection(cw4.request.comment.get([5]));
    assert.equal(e.Message, 'nope');
  });

  it('should return the comments keyed by request for several requests', async () => {
    mock.on('Ams/Comment/ByActivitySids', {5: [{Comments: 'a'}], 6: []});
    const resp = await cw4.request.comment.get([5, 6]);
    assert.deepEqual(resp, {5: [{Comments: 'a'}], 6: []});
  });

  it('should return predefined comments for an activity type with the default ProblemSid', async () => {
    mock.on('Ams/Comment/PredefinedComments', [{Comments: 'pre'}]);
    const resp = await cw4.request.comment.getPredefined();
    assert.deepEqual(resp, [{Comments: 'pre'}]);
    assert.deepEqual(mock.lastCall('Ams/Comment/PredefinedComments').data, {ProblemSid: 0, ActivityType: 1});
  });

  it('should send the category for predefined Request comments', async () => {
    mock.on('Ams/Comment/PredefinedComments', []);
    await cw4.request.comment.getPredefined(738, 'General');
    assert.deepEqual(mock.lastCall('Ams/Comment/PredefinedComments').data, {ProblemSid: 738, Category: 'General', ActivityType: 1});
  });
});

describe('[Request::attachments] mocked function test', () => {
  const mock = createMock(cw4.Cityworks);
  const file = path.join(path.dirname(__dirname), 'uploads', 'test.pdf');

  it('should know it is a request attachment instance', () => {
    assert.equal(cw4.request.attachments.currentActivityType, 'Request');
  });

  it('should add a request attachment, sending the file and payload', async () => {
    mock.on('Ams/Attachments/AddRequestAttachment', {Id: 3, Attachment: {Filename: 'test.pdf'}});
    const r = await cw4.request.attachments.add(5, file, 'test.pdf');
    assert.isDefined(r.Attachment);
    const call = mock.lastCall('Ams/Attachments/AddRequestAttachment');
    assert.deepEqual(call.data, {Filename: 'test.pdf', RequestId: 5});
    assert.equal(call.file, file);
  });

  it('should return the attachments for a request ID as a collection', async () => {
    mock.on('Ams/Attachments/RequestAttachments', []);
    const r = await cw4.request.attachments.getByNodesId(5);
    assert.isArray(r);
    assert.deepEqual(mock.lastCall('Ams/Attachments/RequestAttachments').data, {RequestIds: [5]});
  });

  it('should delete attachments and resolve the full response', async () => {
    mock.on('Ams/Attachments/DeleteRequestAttachments', true);
    const r = await cw4.request.attachments.delete(7);
    assert.deepEqual(r, {Status: 0, Value: true});
    assert.deepEqual(mock.lastCall('Ams/Attachments/DeleteRequestAttachments').data, {AttachmentIds: [7]});
  });

  it('should propagate API errors when deleting', async () => {
    mock.onError('Ams/Attachments/DeleteRequestAttachments', {Message: 'nope'});
    assert.equal((await rejection(cw4.request.attachments.delete([7]))).Message, 'nope');
  });
});
