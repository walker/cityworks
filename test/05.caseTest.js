'use strict';
require('dotenv').config();
var expect = require('chai').expect;
var assert = require('chai').assert;
var Cityworks = require('../dist/index.js');
var cw5 = new Cityworks(process.env.domain, {path: process.env.path});
const _ = require('lodash')

before(function(done) {
  this.timeout(20000000);
  cw5.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[Case (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw5.case, 'Case is an object');
    done();
  });
  it('should have an financial property which is a defined object', (done) => {
    assert.isObject(cw5.case.financial, 'Financial is an object');
    done();
  });
  it('should have an data property which is a defined object', (done) => {
    assert.isObject(cw5.case.data, 'Financial is an object');
    done();
  });
  it('should have an workflow property which is a defined object', (done) => {
    assert.isObject(cw5.case.workflow, 'Financial is an object');
    done();
  });
  it('should have an comment property which is a defined object', (done) => {
    assert.isObject(cw5.case.comment, 'Financial is an object');
    done();
  });
  it('should have an admin property which is a defined object', (done) => {
    assert.isObject(cw5.case.admin, 'Financial is an object');
    done();
  });
});

describe('[Case (construct)] function test', () => {
  // it('should resolve a boolean', (done) => {
  // });
});
