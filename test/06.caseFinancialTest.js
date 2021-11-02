'use strict';
require('dotenv').config();
var expect = require('chai').expect;
var assert = require('chai').assert;
var Cityworks = require('../dist/index.js');
var cw6 = new Cityworks(process.env.domain, {path: process.env.path});
const _ = require('lodash')

before(function(done) {
  this.timeout(20000000);
  cw6.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[CaseFinancial (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw6.case.financial, 'Request is an object');
    done();
  });
});

describe('[CaseFinancial::getCaseFees] function test', () => {
  it('should resolve a collection of case fees', (done) => {
    cw6.case.financial.getCaseFees(16086).then(r => { // TODO: find case, then get fees
      assert.isArray(r);
      done();
    });
  });
});
