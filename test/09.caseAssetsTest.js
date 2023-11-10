'use strict';
require('dotenv').config();
var expect = require('chai').expect;
var assert = require('chai').assert;
const cw9 = require('../dist/index.js');
cw9.Cityworks.configure(process.env.domain, {path: process.env.install_path, version: process.env.version});
const _ = require('lodash')

before(function(done) {
  this.timeout(20000000);
  cw9.Cityworks.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[CaseAssets (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw9.case.financial, 'Request is an object');
    done();
  });
});

describe('[CaseAssets::attach] function test', () => {
  it('should resolve a collection of case fees', (done) => {
    cw9.case.financial.getFees(16086).then(r => {
      assert.isArray(r);
      done();
    });
  });
});

describe('[CaseAssets::detach] function test', () => {
  it('should resolve a fee object', (done) => {
    cw9.case.financial.addFee(16085, 183, {}).then(r => {
      assert.isNumber(r.CaFeeId);
      done();
    });
  });
});

describe('[CaseAssets::detachAll] function test', () => {
  it('should resolve a fee object', (done) => {
    cw9.case.financial.addFee(16085, 183, {AutoRecalculate: 'Y', Amount: 9}).then(r => { 
      assert.isNumber(r.CaFeeId);
      done();
    });
  });
});

describe('[CaseAssets::getForCase] function test', () => {
  it('should resolve a ', (done) => {
    cw9.case.assets.getForCase(42337).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      console.log(e, e)
    })
  });
});

describe('[CaseAssets::search] function test', () => {
  it('should resolve a fee object with the updated amount', (done) => {
    var newAmount = ((Math.random()*100)*8).toFixed(2);
    cw9.case.assets.search(18480, {}).then(r => { // TODO: ?
      // assert.equal(r.Amount, newAmount);
      done();
    });
  });
});
