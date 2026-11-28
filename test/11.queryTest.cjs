'use strict';
// Mocked tests: no Cityworks instance is contacted.
const assert = require('chai').assert;
const cw11 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

async function rejection(promise) {
  try {
    await promise;
  } catch (e) {
    return e;
  }
  assert.fail('should have rejected');
}

describe('[Query] function test', () => {
  const mock = createMock(cw11.Cityworks);

  it('should expose all query methods', () => {
    ['build', 'getTypes', 'getTypesInfo', 'validateQuery', 'validateResponseDefinition', 'getSchema', 'run', 'getSaved'].forEach(m => {
      assert.isFunction(cw11.query[m], m);
    });
  });

  describe('build', () => {
    const path = 'General/Query/Builder';

    it('should send a string as QueryValue and resolve the Value', async () => {
      mock.on(path, () => ({CommandText: 'SELECT ...', SchemaName: 'ServiceRequest'}));
      const r = await cw11.query.build('ServiceRequest()');
      assert.deepEqual(r, {CommandText: 'SELECT ...', SchemaName: 'ServiceRequest'});
      assert.deepEqual(mock.paths(), [path]);
      assert.deepEqual(mock.lastCall(path).data, {QueryValue: 'ServiceRequest()'});
    });

    it('should send a number as QueryId', async () => {
      mock.on(path, () => ({CommandText: 'SELECT ...', SchemaName: 'ServiceRequest'}));
      await cw11.query.build(42);
      assert.deepEqual(mock.lastCall(path).data, {QueryId: 42});
    });

    it('should treat a numeric string as QueryId', async () => {
      mock.on(path, () => ({CommandText: 'SELECT ...', SchemaName: 'ServiceRequest'}));
      await cw11.query.build('42');
      assert.deepEqual(mock.lastCall(path).data, {QueryId: 42});
    });

    it('should merge options and add DomainId', async () => {
      mock.on(path, () => ({CommandText: 'SELECT ...', SchemaName: 'ServiceRequest'}));
      const options = {Page: 2, PageSize: 10, SortDescending: true, SortField: 'RequestId', Variables: {target: 1}};
      await cw11.query.build('ServiceRequest(RequestId = $target)', options, 3);
      assert.deepEqual(mock.lastCall(path).data, {
        QueryValue: 'ServiceRequest(RequestId = $target)', Page: 2, PageSize: 10, SortDescending: true, SortField: 'RequestId', Variables: {target: 1}, DomainId: 3
      });
    });

    it('should include DomainId 0', async () => {
      mock.on(path, () => ({CommandText: 'SELECT ...', SchemaName: 'ServiceRequest'}));
      await cw11.query.build(1, {}, 0);
      assert.deepEqual(mock.lastCall(path).data, {QueryId: 1, DomainId: 0});
    });

    it('should propagate errors', async () => {
      mock.onError(path, {Code: 7, Message: 'nope'});
      const e = await rejection(cw11.query.build('x'));
      assert.equal(e.Code, 7);
    });
  });

  describe('getTypes', () => {
    const path = 'General/Query/QueryTypes';

    it('should post an empty payload and resolve the Value', async () => {
      mock.on(path, () => ['Work Order', 'Service Request']);
      const r = await cw11.query.getTypes();
      assert.deepEqual(r, ['Work Order', 'Service Request']);
      assert.deepEqual(mock.lastCall(path).data, {});
    });

    it('should propagate errors', async () => {
      mock.onError(path, {Code: 9, Message: 'bad'});
      const e = await rejection(cw11.query.getTypes());
      assert.equal(e.Code, 9);
    });
  });

  describe('getTypesInfo', () => {
    const path = 'General/Query/QueryTypeInformation';

    it('should default both include flags to true', async () => {
      mock.on(path, () => [{QueryType: 'Work Order', DisplayName: 'Work Order', SchemaName: 'WorkOrder'}]);
      const r = await cw11.query.getTypesInfo();
      assert.deepEqual(r, [{QueryType: 'Work Order', DisplayName: 'Work Order', SchemaName: 'WorkOrder'}]);
      assert.deepEqual(mock.lastCall(path).data, {IncludeDefaultSchemas: true, IncludeGisSchemas: true});
    });

    it('should send explicit flags and DomainId', async () => {
      mock.on(path, () => []);
      await cw11.query.getTypesInfo(false, false, 5);
      assert.deepEqual(mock.lastCall(path).data, {IncludeDefaultSchemas: false, IncludeGisSchemas: false, DomainId: 5});
    });

    it('should propagate errors', async () => {
      mock.onError(path, {Code: 2, Message: 'bad'});
      const e = await rejection(cw11.query.getTypesInfo());
      assert.equal(e.Code, 2);
    });
  });

  describe('validateQuery', () => {
    const path = 'General/Query/ValidateQuery';

    it('should send Query and Variables and resolve the Value', async () => {
      mock.on(path, () => []);
      const r = await cw11.query.validateQuery('ServiceRequest(RequestId = $target)', {target: 1});
      assert.deepEqual(r, []);
      assert.deepEqual(mock.lastCall(path).data, {Query: 'ServiceRequest(RequestId = $target)', Variables: {target: 1}});
    });

    it('should add DomainId when provided', async () => {
      mock.on(path, () => []);
      await cw11.query.validateQuery('x = 1', {}, 4);
      assert.deepEqual(mock.lastCall(path).data, {Query: 'x = 1', Variables: {}, DomainId: 4});
    });

    it('should omit Variables when undefined', async () => {
      mock.on(path, () => []);
      await cw11.query.validateQuery('x = 1');
      assert.deepEqual(mock.lastCall(path).data, {Query: 'x = 1'});
    });

    it('should propagate errors', async () => {
      mock.onError(path, {Code: 3, Message: 'bad'});
      const e = await rejection(cw11.query.validateQuery('x', {}));
      assert.equal(e.Code, 3);
    });
  });

  describe('validateResponseDefinition', () => {
    const path = 'General/Query/ValidateResponseDefinition';

    it('should send QueryType and ResponseDefinition', async () => {
      mock.on(path, () => []);
      const def = {RequestId: true, Status: true};
      const r = await cw11.query.validateResponseDefinition('Service Request', def);
      assert.deepEqual(r, []);
      assert.deepEqual(mock.lastCall(path).data, {QueryType: 'Service Request', ResponseDefinition: def});
    });

    it('should return validation errors for an unknown response field', async () => {
      const errors = [{FieldName: 'DefinitelyNotAField', ErrorType: 'ResponseFieldDoesNotExist'}];
      mock.on(path, () => errors);
      const def = {DefinitelyNotAField: true};
      assert.deepEqual(await cw11.query.validateResponseDefinition('Service Request', def), errors);
      assert.deepEqual(mock.lastCall(path).data, {QueryType: 'Service Request', ResponseDefinition: def});
    });

    it('should add DomainId when provided', async () => {
      mock.on(path, () => []);
      await cw11.query.validateResponseDefinition('Work Order', {}, 8);
      assert.deepEqual(mock.lastCall(path).data, {QueryType: 'Work Order', ResponseDefinition: {}, DomainId: 8});
    });

    it('should propagate errors', async () => {
      mock.onError(path, {Code: 4, Message: 'bad'});
      const e = await rejection(cw11.query.validateResponseDefinition('x', {}));
      assert.equal(e.Code, 4);
    });
  });

  describe('getSchema', () => {
    const path = 'General/Query/QuerySchema';

    it('should send QueryType and resolve the Value', async () => {
      mock.on(path, () => ({Name: 'ServiceRequest', PrimarySearchFieldName: 'RequestId', Search: {}, Response: {}, DisplayName: 'Service Request'}));
      const r = await cw11.query.getSchema('Service Request');
      assert.deepEqual(r, {Name: 'ServiceRequest', PrimarySearchFieldName: 'RequestId', Search: {}, Response: {}, DisplayName: 'Service Request'});
      assert.deepEqual(mock.lastCall(path).data, {QueryType: 'Service Request'});
    });

    it('should add DomainId when provided', async () => {
      mock.on(path, () => ({}));
      await cw11.query.getSchema('Work Order', 6);
      assert.deepEqual(mock.lastCall(path).data, {QueryType: 'Work Order', DomainId: 6});
    });

    it('should propagate errors', async () => {
      mock.onError(path, {Code: 5, Message: 'bad'});
      const e = await rejection(cw11.query.getSchema('x'));
      assert.equal(e.Code, 5);
    });
  });

  describe('run', () => {
    const path = 'General/Query/Query';
    const byIdPath = 'General/Query/RunById';
    const emptyPage = {HasMore: false, Page: 1, Results: [], TotalRecordCount: 0};

    it('should run a string query via General/Query/Query with QueryValue', async () => {
      mock.on(path, () => ({HasMore: false, Page: 1, Results: [{RequestId: 1}], TotalRecordCount: 1}));
      const r = await cw11.query.run('ServiceRequest()', {PageSize: 1});
      assert.deepEqual(r, {HasMore: false, Page: 1, Results: [{RequestId: 1}], TotalRecordCount: 1});
      assert.deepEqual(mock.paths(), [path]);
      assert.deepEqual(mock.lastCall(path).data, {QueryValue: 'ServiceRequest()', PageSize: 1});
    });

    it('should run a numeric query via General/Query/RunById with QueryId', async () => {
      mock.on(byIdPath, () => ({HasMore: false, Page: 1, Results: [{RequestId: 2}], TotalRecordCount: 1}));
      const r = await cw11.query.run(12, {PageSize: 1});
      assert.deepEqual(r, {HasMore: false, Page: 1, Results: [{RequestId: 2}], TotalRecordCount: 1});
      assert.deepEqual(mock.paths(), [byIdPath]);
      assert.deepEqual(mock.lastCall(byIdPath).data, {QueryId: 12, PageSize: 1});
    });

    it('should treat a numeric string as a saved query id', async () => {
      mock.on(byIdPath, () => emptyPage);
      await cw11.query.run('12');
      assert.deepEqual(mock.lastCall(byIdPath).data, {QueryId: 12});
    });

    it('should merge options into the request', async () => {
      mock.on(path, () => emptyPage);
      const options = {Page: 1, PageSize: 25, SortField: 'RequestId', SortDescending: false, ResponseFields: {RequestId: true, Status: true}, Variables: {target: 2}};
      await cw11.query.run('ServiceRequest(RequestId = $target)', options);
      assert.deepEqual(mock.lastCall(path).data, {
        QueryValue: 'ServiceRequest(RequestId = $target)', Page: 1, PageSize: 25, SortField: 'RequestId', SortDescending: false, ResponseFields: {RequestId: true, Status: true}, Variables: {target: 2}
      });
    });

    it('should drop options.QueryValue when the query is a string', async () => {
      mock.on(path, () => emptyPage);
      await cw11.query.run('x = 1', {QueryValue: 'ignored', Page: 3});
      assert.deepEqual(mock.lastCall(path).data, {QueryValue: 'x = 1', Page: 3});
    });

    it('should append options.QueryValue to a saved query run by id', async () => {
      mock.on(byIdPath, () => emptyPage);
      await cw11.query.run(7, {QueryValue: 'ServiceRequest(RequestId = $target)', Variables: {target: 1}});
      assert.deepEqual(mock.lastCall(byIdPath).data, {QueryId: 7, QueryValue: 'ServiceRequest(RequestId = $target)', Variables: {target: 1}});
    });

    it('should propagate errors for string and id queries', async () => {
      mock.onError(path, {Code: 6, Message: 'bad'});
      mock.onError(byIdPath, {Code: 8, Message: 'bad'});
      assert.equal((await rejection(cw11.query.run('x = 1'))).Code, 6);
      assert.equal((await rejection(cw11.query.run(1))).Code, 8);
    });
  });

  describe('getSaved', () => {
    const path = 'General/Query/SavedQueries';

    it('should use defaults when called with no arguments', async () => {
      mock.on(path, () => [{Id: 1, QueryType: 'Service Request', VisibleToMobile: false}]);
      const r = await cw11.query.getSaved();
      assert.deepEqual(r, [{Id: 1, QueryType: 'Service Request', VisibleToMobile: false}]);
      assert.deepEqual(mock.lastCall(path).data, {CreatedOnly: false, IncludeQuery: true});
    });

    it('should send a single type as QueryType and an explicit mobile filter', async () => {
      mock.on(path, () => []);
      await cw11.query.getSaved(['Work Order'], false, true, false);
      assert.deepEqual(mock.lastCall(path).data, {CreatedOnly: false, IncludeQuery: true, QueryType: 'Work Order', VisibleToMobile: false});
    });

    it('should send multiple types as QueryTypes', async () => {
      mock.on(path, () => []);
      await cw11.query.getSaved(['Work Order', 'Service Request']);
      assert.deepEqual(mock.lastCall(path).data, {CreatedOnly: false, IncludeQuery: true, QueryTypes: ['Work Order', 'Service Request']});
    });

    it('should send CreatedOnly, IncludeQuery, VisibleToMobile and DomainId', async () => {
      mock.on(path, () => []);
      await cw11.query.getSaved([], true, false, true, 2);
      assert.deepEqual(mock.lastCall(path).data, {CreatedOnly: true, IncludeQuery: false, VisibleToMobile: true, DomainId: 2});
    });

    it('should send an explicit false VisibleToMobile filter', async () => {
      mock.on(path, () => []);
      await cw11.query.getSaved([], false, true, false);
      assert.deepEqual(mock.lastCall(path).data, {CreatedOnly: false, IncludeQuery: true, VisibleToMobile: false});
    });

    it('should propagate errors', async () => {
      mock.onError(path, {Code: 10, Message: 'bad'});
      const e = await rejection(cw11.query.getSaved());
      assert.equal(e.Code, 10);
    });
  });
});
