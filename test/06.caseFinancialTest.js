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

describe('[CaseFinancial::getFees] function test', () => {
  it('should resolve a collection of case fees', (done) => {
    cw6.case.financial.getFees(16086).then(r => { // TODO: find case, then get fees
      assert.isArray(r);
      done();
    });
  });
});

describe('[CaseFinancial::addFee] function test', () => {
  it('should resolve a fee object', (done) => {
    cw6.case.financial.addFee(16085, 183, {AutoRecalculate: 'Y', Amount: 9}).then(r => { // TODO: find case, then get fees
      assert.isNumber(r.CaFeeId);
      done();
    });
  });
});

describe('[CaseFinancial::addDefaultFees] function test', () => {
  it('should resolve a ', (done) => {
    cw6.case.financial.addDefaultFees(42337, 152).then(r => { // TODO: find case, then get fees
      assert.isArray(r);
      done();
    }).catch(e => {
      console.log(e, e)
    })
  });
});

describe('[CaseFinancial::updateFee] function test', () => {
  it('should resolve a fee object with the updated amount', (done) => {
    var newAmount = ((Math.random()*100)*8).toFixed(2);
    cw6.case.financial.updateFee(18480, {Amount: newAmount}).then(r => { // TODO: find case, then get fees
      assert.equal(r.Amount, newAmount);
      done();
    });
  });
});

describe('[CaseFinancial::getAllFeeTemplates] function test', () => {
  it('should resolve a collection of case fees', (done) => {
    cw6.case.financial.getAllFeeTemplates().then(r => { // TODO: find case, then get fees
      assert.isArray(r);
      done();
    });
  });
});

describe('[CaseFinancial::searchFeeTemplates] function test', () => {
  it('should resolve a collection of case fees with interest in the name', (done) => {
    cw6.case.financial.searchFeeTemplates({FeeDesc: 'interest'}).then(r => { // TODO: find case, then get fees
      assert.isArray(r);
      done();
    }).catch(e => {
      console.log(e, 'e')
    })
  });
});
