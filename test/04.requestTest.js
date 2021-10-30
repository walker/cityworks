'use strict';
require('dotenv').config();
var expect = require('chai').expect;
var assert = require('chai').assert;
var Cityworks = require('../dist/index.js');
var cw2 = new Cityworks(process.env.domain, {path: process.env.path});

before(function(done) {
  this.timeout(2000000);
  cw2.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[Request (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw2.request, 'Request is an object');
    done();
  });
});

describe('[Request::create] function test', () => {
});

describe('[Request::update] function test', () => {
});

describe('[Request::delete] function test', () => {
});

describe('[Request::cancel] function test', () => {
});

describe('[Request::uncancel] function test', () => {
});

describe('[Request::close] function test', () => {
});

describe('[Request::reopen] function test', () => {
});

describe('[Request::comment] function test', () => {
});

describe('[Request::changeProblem] function test', () => {
});

describe('[Request::changeCustomFieldCategory] function test', () => {
});

describe('[Request::getAuditLog] function test', () => {
});

describe('[Request::getById] function test', () => {
});

describe('[Request::getByIds] function test', () => {
});

describe('[Request::getCustomFields] function test', () => {
});

describe('[Request::createSearchDefinition] function test', () => {
});
