'use strict';
// Read-only live checks with an explicitly designated saved query.
require('dotenv').config({quiet: true, debug: false});
const assert = require('chai').assert;
const cw = require('../dist/index.js');

describe('[Live query] saved query and metadata checks', function() {
  this.timeout(60000);
  let saved;
  let requestId;
  before(async function() {
    const missing = ['cwdomain', 'cwlogin', 'cwpassword'].filter(k => !process.env[k]);
    if(missing.length || !process.env.CW_LIVE_QUERY_ID) {
      console.log('\n  Skipped: set Cityworks credentials and CW_LIVE_QUERY_ID');
      this.skip();
    }
    const id = Number(process.env.CW_LIVE_QUERY_ID);
    assert.isTrue(Number.isSafeInteger(id) && id > 0, 'CW_LIVE_QUERY_ID must be a positive integer');
    cw.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion ? Number(process.env.cwversion) : undefined});
    await cw.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword);
    const queries = await cw.query.getSaved();
    assert.isArray(queries);
    saved = queries.find(query => query.Id === id);
    assert.isDefined(saved, 'designated saved query must be accessible');
    assert.isString(saved.Query);
    assert.isNotEmpty(saved.Query);
    assert.isString(saved.QueryType);
    if(saved.QueryType === 'Service Request') {
      const sample = await cw.query.run(saved.Id, {PageSize: 1});
      if(Array.isArray(sample.Results) && sample.Results.length) {
        const id = Number(sample.Results[0].RequestId);
        if(Number.isSafeInteger(id) && id > 0) requestId = id;
      }
    }
  });

  it('honors the default and GIS schema inclusion flags', async function() {
    for(const flags of [[false, false], [true, false], [false, true]]) {
      const actual = await cw.query.getTypesInfo(flags[0], flags[1]);
      const raw = await cw.Cityworks.runRequest('General/Query/QueryTypeInformation', {
        IncludeDefaultSchemas: flags[0], IncludeGisSchemas: flags[1]
      });
      assert.isArray(actual);
      assert.deepEqual(actual, raw.Value);
    }
    assert.include(await cw.query.getTypes(), saved.QueryType);
  });

  it('forwards both mobile visibility filters to saved-query lookup', async function() {
    for(const visible of [true, false]) {
      const actual = await cw.query.getSaved([], false, true, visible);
      const raw = await cw.Cityworks.runRequest('General/Query/SavedQueries', {
        CreatedOnly: false, IncludeQuery: true, VisibleToMobile: visible
      });
      assert.isArray(actual);
      assert.deepEqual(actual.map(q => q.Id).sort((a, b) => a - b), raw.Value.map(q => q.Id).sort((a, b) => a - b));
    }
  });

  it('filters saved queries by type and can omit query text', async function() {
    const queries = await cw.query.getSaved([saved.QueryType], false, false);
    assert.isArray(queries);
    assert.isTrue(queries.every(query => query.QueryType === saved.QueryType));
    const found = queries.find(query => query.Id === saved.Id);
    assert.isDefined(found);
    assert.isTrue(found.Query == null || found.Query === '');
  });

  it('retrieves and validates the query schema and saved query text', async function() {
    assert.isObject(await cw.query.getSchema(saved.QueryType));
    assert.isArray(await cw.query.validateResponseDefinition(saved.QueryType, {}));
    assert.deepEqual(await cw.query.validateQuery(saved.Query), []);
  });

  it('builds and executes the saved query by ID and by text', async function() {
    const byId = await cw.query.build(saved.Id, {PageSize: 1});
    const byText = await cw.query.build(saved.Query, {PageSize: 1});
    assert.isObject(byId);
    assert.isObject(byText);
    assert.isString(byId.CommandText);
    assert.strictEqual(byId.SchemaName, byText.SchemaName);
    const idResult = await cw.query.run(saved.Id, {PageSize: 1});
    const textResult = await cw.query.run(saved.Query, {PageSize: 1});
    for(const result of [idResult, textResult]) {
      assert.isObject(result);
      assert.isArray(result.Results);
      assert.isAtMost(result.Results.length, 1);
      assert.isNumber(result.Page);
      assert.isNumber(result.TotalRecordCount);
      assert.isBoolean(result.HasMore);
    }
    assert.strictEqual(idResult.TotalRecordCount, textResult.TotalRecordCount);
  });

  it('substitutes variables in validation, building and query execution', async function() {
    if(!requestId) this.skip();
    const text = 'ServiceRequest(RequestId = $target)';
    assert.deepEqual(await cw.query.validateQuery(text, {target: requestId}), []);
    const positive = await cw.query.build(text, {PageSize: 1, Variables: {target: requestId}});
    const negative = await cw.query.build(text, {PageSize: 1, Variables: {target: 0}});
    assert.isArray(positive.Parameters);
    assert.notDeepEqual(positive.Parameters, negative.Parameters);
    const found = await cw.query.run(text, {PageSize: 1, Variables: {target: requestId}});
    const missing = await cw.query.run(text, {PageSize: 1, Variables: {target: 0}});
    assert.strictEqual(found.TotalRecordCount, 1);
    assert.strictEqual(Number(found.Results[0].RequestId), requestId);
    assert.strictEqual(missing.TotalRecordCount, 0);
    assert.isEmpty(missing.Results);
  });

  it('applies an appended query expression and its variables to a saved query', async function() {
    if(!requestId) this.skip();
    const text = 'ServiceRequest(RequestId = $target)';
    const found = await cw.query.run(saved.Id, {QueryValue: text, PageSize: 1, Variables: {target: requestId}});
    const missing = await cw.query.run(saved.Id, {QueryValue: text, PageSize: 1, Variables: {target: 0}});
    assert.strictEqual(found.TotalRecordCount, 1);
    assert.strictEqual(Number(found.Results[0].RequestId), requestId);
    assert.strictEqual(missing.TotalRecordCount, 0);
    assert.isEmpty(missing.Results);
  });

  it('validates and applies a non-empty response-field map', async function() {
    if(!requestId) this.skip();
    const fields = {RequestId: true, Status: true};
    assert.deepEqual(await cw.query.validateResponseDefinition('Service Request', fields), []);
    const errors = await cw.query.validateResponseDefinition('Service Request', {DefinitelyNotAField: true});
    assert.isTrue(errors.some(error => error.FieldName === 'DefinitelyNotAField' && error.ErrorType === 'ResponseFieldDoesNotExist'));
    const result = await cw.query.run('ServiceRequest(RequestId = $target)', {
      PageSize: 1, Variables: {target: requestId}, ResponseFields: fields
    });
    assert.strictEqual(result.TotalRecordCount, 1);
    assert.sameMembers(Object.keys(result.Results[0]), ['RequestId', 'Status']);
    assert.strictEqual(Number(result.Results[0].RequestId), requestId);
  });
});
