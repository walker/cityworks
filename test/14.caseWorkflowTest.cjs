'use strict';
require('dotenv').config({quiet: true, debug: false});
var chai = require('chai');
var expect = require('chai').expect;
var assert = require('chai').assert;
var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
const cw14 = require('../dist/index.js');
cw14.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});
  
before(function(done) {
  this.timeout(20000000);
  cw14.Cityworks.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[CaseWorkflow::setTaskResult] function test', () => {
  it('set a task result', (done) => {
    cw14.caseWorkflow.setTaskResult(171018, 'TestTask').then(r => {
      assert.isNumber(r.CaTaskId);
      done();
    }).catch(e => {
      done(e);
    });
  });
});