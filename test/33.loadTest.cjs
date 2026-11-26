'use strict';
var assert = require('chai').assert;
const cw = require('../dist/index.js');

// CWError is not an Error subclass, so check its Message ourselves
function thrown(fn) {
  try { fn(); } catch (e) { return e; }
  assert.fail('expected a throw');
}

describe('[Cityworks::configure] load option test', () => {
  afterEach(() => {
    cw.Cityworks.configure('cityworks.example.test', {path: 'cityworks', version: 23});
  });

  it('should make every module available when load is not specified', () => {
    cw.Cityworks.configure('cityworks.example.test');
    ['general', 'activity_link', 'message_queue', 'gis', 'search', 'query', 'request', 'inspection', 'workorder', 'case', 'report', 'employee', 'equipment', 'contractor', 'recent_activity', 'general_admin'].forEach(name => {
      assert.isTrue(cw.Cityworks.isLoaded(name), name);
    });
    assert.isFunction(cw.request.create);
    assert.isFunction(cw.workorder.create);
  });

  it('should only allow the listed modules when load is specified', () => {
    cw.Cityworks.configure('cityworks.example.test', {}, ['request', 'briefcase']);
    assert.isTrue(cw.Cityworks.isLoaded('request'));
    assert.isTrue(cw.Cityworks.isLoaded('case'));
    assert.isTrue(cw.Cityworks.isLoaded('briefcase'));
    assert.isFalse(cw.Cityworks.isLoaded('workorder'));
    assert.isFunction(cw.request.create);
    assert.isFunction(cw.briefcase.getById);
    assert.match(thrown(() => cw.workorder.create).Message, /"workorder" module is not loaded/);
  });

  it('should load everything again when configure is called without load', () => {
    cw.Cityworks.configure('cityworks.example.test', {}, ['gis']);
    assert.isFalse(cw.Cityworks.isLoaded('request'));
    cw.Cityworks.configure('cityworks.example.test');
    assert.isTrue(cw.Cityworks.isLoaded('request'));
  });

  it('should reject unknown module names', () => {
    assert.match(thrown(() => cw.Cityworks.configure('cityworks.example.test', {}, ['request', 'nope'])).Message, /Unknown module\(s\) in load: nope/);
  });

  it('should still build report (and its dependencies) when only report is loaded', () => {
    cw.Cityworks.configure('cityworks.example.test', {}, ['report']);
    assert.isFunction(cw.report.print);
    assert.match(thrown(() => cw.request.create).Message, /not loaded/);
  });
});
