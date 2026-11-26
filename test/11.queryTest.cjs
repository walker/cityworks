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
      mock.on(path, () => ({Query: 'built'}));
      const r = await cw11.query.build('Status = "OPEN"');
      assert.deepEqual(r, {Query: 'built'});
      assert.deepEqual(mock.paths(), [path]);
      assert.deepEqual(mock.lastCall(path).data, {QueryValue: 'Status = "OPEN"'});
    });

    it('should send a number as QueryId', async () => {
      mock.on(path, () => []);
      await cw11.query.build(42);
      assert.deepEqual(mock.lastCall(path).data, {QueryId: 42});
    });

    it('should treat a numeric string as QueryId', async () => {
      mock.on(path, () => []);
      await cw11.query.build('42');
      assert.deepEqual(mock.lastCall(path).data, {QueryId: 42});
    });

    it('should merge options and add DomainId', async () => {
      mock.on(path, () => []);
      const options = {Page: 2, PageSize: 10, SortDescending: true, SortField: 'RequestId', Variables: {a: 1}};
      await cw11.query.build('x = 1', options, 3);
      assert.deepEqual(mock.lastCall(path).data, {
        QueryValue: 'x = 1', Page: 2, PageSize: 10, SortDescending: true, SortField: 'RequestId', Variables: {a: 1}, DomainId: 3
      });
    });

    it('should include DomainId 0', async () => {
      mock.on(path, () => []);
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
      mock.on(path, () => ['WorkOrder', 'ServiceRequest']);
      const r = await cw11.query.getTypes();
      assert.deepEqual(r, ['WorkOrder', 'ServiceRequest']);
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
      mock.on(path, () => [{Name: 'WorkOrder'}]);
      const r = await cw11.query.getTypesInfo();
      assert.deepEqual(r, [{Name: 'WorkOrder'}]);
      assert.deepEqual(mock.lastCall(path).data, {IncludeDefaultSchemasInclude: true, IncludeGisSchemas: true});
    });

    it('should send explicit flags and DomainId', async () => {
      mock.on(path, () => []);
      await cw11.query.getTypesInfo(false, false, 5);
      assert.deepEqual(mock.lastCall(path).data, {IncludeDefaultSchemasInclude: false, IncludeGisSchemas: false, DomainId: 5});
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
      mock.on(path, () => ({IsValid: true}));
      const r = await cw11.query.validateQuery('Status = @s', {s: 'OPEN'});
      assert.deepEqual(r, {IsValid: true});
      assert.deepEqual(mock.lastCall(path).data, {Query: 'Status = @s', Variables: {s: 'OPEN'}});
    });

    it('should add DomainId when provided', async () => {
      mock.on(path, () => ({IsValid: true}));
      await cw11.query.validateQuery('x = 1', {}, 4);
      assert.deepEqual(mock.lastCall(path).data, {Query: 'x = 1', Variables: {}, DomainId: 4});
    });

    it('should omit Variables when undefined', async () => {
      mock.on(path, () => ({IsValid: false}));
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
      mock.on(path, () => ({IsValid: true}));
      const def = {Fields: ['RequestId', 'Status']};
      const r = await cw11.query.validateResponseDefinition('ServiceRequest', def);
      assert.deepEqual(r, {IsValid: true});
      assert.deepEqual(mock.lastCall(path).data, {QueryType: 'ServiceRequest', ResponseDefinition: def});
    });

    it('should add DomainId when provided', async () => {
      mock.on(path, () => ({}));
      await cw11.query.validateResponseDefinition('WorkOrder', {}, 8);
      assert.deepEqual(mock.lastCall(path).data, {QueryType: 'WorkOrder', ResponseDefinition: {}, DomainId: 8});
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
      mock.on(path, () => ({Fields: [{Name: 'RequestId'}]}));
      const r = await cw11.query.getSchema('ServiceRequest');
      assert.deepEqual(r, {Fields: [{Name: 'RequestId'}]});
      assert.deepEqual(mock.lastCall(path).data, {QueryType: 'ServiceRequest'});
    });

    it('should add DomainId when provided', async () => {
      mock.on(path, () => ({}));
      await cw11.query.getSchema('WorkOrder', 6);
      assert.deepEqual(mock.lastCall(path).data, {QueryType: 'WorkOrder', DomainId: 6});
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

    it('should run a string query via General/Query/Query with QueryValue', async () => {
      mock.on(path, () => [{RequestId: 1}]);
      const r = await cw11.query.run('Status = "OPEN"');
      assert.deepEqual(r, [{RequestId: 1}]);
      assert.deepEqual(mock.paths(), [path]);
      assert.deepEqual(mock.lastCall(path).data, {QueryValue: 'Status = "OPEN"'});
    });

    it('should run a numeric query via General/Query/RunById with QueryId', async () => {
      mock.on(byIdPath, () => [{RequestId: 2}]);
      const r = await cw11.query.run(12);
      assert.deepEqual(r, [{RequestId: 2}]);
      assert.deepEqual(mock.paths(), [byIdPath]);
      assert.deepEqual(mock.lastCall(byIdPath).data, {QueryId: 12});
    });

    it('should treat a numeric string as a saved query id', async () => {
      mock.on(byIdPath, () => []);
      await cw11.query.run('12');
      assert.deepEqual(mock.lastCall(byIdPath).data, {QueryId: 12});
    });

    it('should merge options into the request', async () => {
      mock.on(path, () => []);
      const options = {Page: 1, PageSize: 25, SortField: 'RequestId', SortDescending: false, ResponseFields: {A: 1}, Variables: {v: 2}};
      await cw11.query.run('x = @v', options);
      assert.deepEqual(mock.lastCall(path).data, {
        QueryValue: 'x = @v', Page: 1, PageSize: 25, SortField: 'RequestId', SortDescending: false, ResponseFields: {A: 1}, Variables: {v: 2}
      });
    });

    it('should drop options.QueryValue when the query is a string', async () => {
      mock.on(path, () => []);
      await cw11.query.run('x = 1', {QueryValue: 'ignored', Page: 3});
      assert.deepEqual(mock.lastCall(path).data, {QueryValue: 'x = 1', Page: 3});
    });

    it('should append options.QueryValue to a saved query run by id', async () => {
      mock.on(byIdPath, () => []);
      await cw11.query.run(7, {QueryValue: 'Status = "OPEN"'});
      assert.deepEqual(mock.lastCall(byIdPath).data, {QueryId: 7, QueryValue: 'Status = "OPEN"'});
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
      mock.on(path, () => [{QueryId: 1}]);
      const r = await cw11.query.getSaved();
      assert.deepEqual(r, [{QueryId: 1}]);
      assert.deepEqual(mock.lastCall(path).data, {CreatedOnly: false, IncludeQuery: true});
    });

    it('should send a single type as QueryType', async () => {
      mock.on(path, () => []);
      await cw11.query.getSaved(['WorkOrder']);
      assert.deepEqual(mock.lastCall(path).data, {CreatedOnly: false, IncludeQuery: true, QueryType: 'WorkOrder'});
    });

    it('should send multiple types as QueryTypes', async () => {
      mock.on(path, () => []);
      await cw11.query.getSaved(['WorkOrder', 'ServiceRequest']);
      assert.deepEqual(mock.lastCall(path).data, {CreatedOnly: false, IncludeQuery: true, QueryTypes: ['WorkOrder', 'ServiceRequest']});
    });

    it('should send CreatedOnly, IncludeQuery and DomainId', async () => {
      mock.on(path, () => []);
      await cw11.query.getSaved([], true, false, true, 2);
      assert.deepEqual(mock.lastCall(path).data, {CreatedOnly: true, IncludeQuery: false, DomainId: 2});
    });

    it('should propagate errors', async () => {
      mock.onError(path, {Code: 10, Message: 'bad'});
      const e = await rejection(cw11.query.getSaved());
      assert.equal(e.Code, 10);
    });
  });
});
