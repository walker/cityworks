'use strict';
const assert = require('chai').assert;
const cw = require('../dist/index.js');

describe('[Cityworks::getBaseUrl] function test', () => {
  afterEach(() => {
    cw.Cityworks.configure('cityworks.example.test', {path: 'cityworks', version: 23});
  });

  it('should build the secure URL from the configured domain and path', () => {
    cw.Cityworks.configure('cw.example.test', {path: 'cityworks', version: 23});
    assert.equal(cw.Cityworks.getBaseUrl(), 'https://cw.example.test/cityworks');
  });

  it('should use http when secure is false', () => {
    cw.Cityworks.configure('cw.example.test', {path: 'cw', secure: false});
    assert.equal(cw.Cityworks.getBaseUrl(), 'http://cw.example.test/cw');
  });
});
