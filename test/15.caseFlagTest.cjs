'use strict';
require('dotenv').config({quiet: true, debug: false});
var chai = require('chai');
var expect = require('chai').expect;
var assert = require('chai').assert;
var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
const cw15 = require('../dist/index.js');
cw15.Cityworks.configure(process.env.domain, {path: process.env.path, version: process.env.version});
  
before(function(done) {
  this.timeout(20000000);
  cw15.Cityworks.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[CaseFlag::add] function test', () => {
  it('Should add one flag to the case', (done) => {
    cw15.briefcase.flag.add(107213, 7, 'FLAG', 420, new Date()).then(r => {
      assert.isNumber(r);
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[CaseFlag::deleteOne] function test', () => {
  it('Should delete one flag', (done) => {
    cw15.briefcase.flag.delete().then(r => {
      assert.isNumber(r);
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[CaseFlag::deleteAll] function test', () => {
  it('Should delete all flags', (done) => {
    cw15.briefcase.flag.deleteAll(107213).then(r => {
      assert.isNumber(r);
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[CaseFlag::getForCase] function test', () => {
  it('Should get all flags for provided CaseID', (done) => {
    cw15.briefcase.flag.getForCase(107213).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[CaseFlag::search] function test', () => {
  it('Should get all flags that match the provided search criteria', (done) => {
    cw15.briefcase.flag.search({FlagDesc: 'Unprocessed'}).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      done(e);
    });
  });
});