'use strict';
const assert = require('chai').assert;
const {CWError, request, workorder, inspection, briefcase} = require('../dist/index.js');

async function rejection(promise) {
  try { await promise; } catch(e) { return e; }
  assert.fail('should have rejected');
}

describe('[CWError] standard and legacy behavior', () => {
  it('is an exported Error with synchronized messages and legacy fields', () => {
    const error = new CWError(3, 'fallback', {Message: 'API error', detail: 4});
    assert.instanceOf(error, Error);
    assert.instanceOf(error, CWError);
    assert.equal(error.name, 'CWError');
    assert.equal(error.Name, 'Cityworks Exception');
    assert.equal(error.Code, 3);
    assert.equal(error.Message, 'API error');
    assert.equal(error.message, 'API error');
    assert.isString(error.stack);
    assert.deepEqual(JSON.parse(error.Info), {Message: 'API error', detail: 4});
    assert.equal(JSON.parse(JSON.stringify(error)).Message, 'API error');
    error.Message = 'changed';
    assert.equal(error.message, 'changed');
    error.message = 'changed again';
    assert.equal(error.Message, 'changed again');
  });

  it('normalizes well-formed and incomplete messages without mutating the response', () => {
    const info = {Message: null, ErrorMessages: [
      {Service: 'ServiceRequest', Name: 'InvalidInput'},
      {Service: null, Name: 12},
      null, 'invalid'
    ]};
    const error = new CWError(1, 'fallback', info);
    assert.equal(error.Message, 'fallback');
    assert.deepEqual(error.Error_messages, [{Service: 'Service Request', Name: 'Invalid Input'}, {Service: null, Name: 12}]);
    assert.equal(info.ErrorMessages[0].Service, 'ServiceRequest');
    assert.equal(info.ErrorMessages[0].Name, 'InvalidInput');
    assert.deepEqual(JSON.parse(error.Info).ErrorMessages, [
      {Service: 'Service Request', Name: 'Invalid Input'}, {Service: null, Name: 12}, null, 'invalid'
    ]);
  });

  it('accepts object-keyed and malformed error-message collections', () => {
    const keyed = new CWError(1, 'failure', {ErrorMessages: {first: {Service: 'CaseTask', Name: 'BadInput'}}});
    assert.deepEqual(keyed.Error_messages, [{Service: 'Case Task', Name: 'Bad Input'}]);
    const malformed = new CWError(1, 'failure', {ErrorMessages: 'invalid'});
    assert.deepEqual(malformed.Error_messages, []);
    assert.equal(JSON.parse(malformed.Info).ErrorMessages, 'invalid');
  });

  it('serializes cycles, repeated references and bigint without losing the error', () => {
    const shared = {value: 1};
    const info = {first: shared, second: shared, number: 12n};
    info.self = info;
    const error = new CWError(4, 'failed', info);
    assert.deepEqual(JSON.parse(error.Info), {
      first: {value: 1}, second: {value: 1}, number: '12', self: '[Circular]'
    });
  });

  it('makes serialization failures explicit and retains the original error', () => {
    const error = new CWError(5, 'original failure', {toJSON() { throw new Error('cannot serialize'); }});
    assert.equal(error.message, 'original failure');
    assert.deepEqual(JSON.parse(error.Info), {serializationError: 'Error details could not be serialized'});
  });

  it('survives unreadable details and non-serializable top-level values', () => {
    const marker = {serializationError: 'Error details could not be serialized'};
    const unreadable = {get ErrorMessages() { throw new Error('unreadable'); }};
    const invalidEntry = {ErrorMessages: [{get Service() { throw new Error('unreadable'); }}]};
    for(const info of [unreadable, invalidEntry, Symbol('detail')]) {
      const error = new CWError(5, 'original failure', info);
      assert.equal(error.message, 'original failure');
      assert.deepEqual(error.Error_messages, []);
      assert.deepEqual(JSON.parse(error.Info), marker);
    }
  });

  it('retains the original cause and defaults unclassified errors to unknown', () => {
    const cause = new Error('network failed');
    const error = new CWError(9, 'wrapped', cause);
    assert.strictEqual(error.cause, cause);
    assert.equal(error.category, 'unknown');
    assert.notProperty(JSON.parse(JSON.stringify(error)), 'cause');
  });

  it('classifies existing input validation across wrappers', async () => {
    for(const invoke of [() => request.create({}), () => workorder.create({}), () => inspection.create({}), () => briefcase.asset.search({})]) {
      const error = await rejection(invoke());
      assert.instanceOf(error, CWError);
      assert.equal(error.category, 'validation');
    }
  });
});
