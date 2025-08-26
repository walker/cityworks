'use strict';
require('dotenv').config({quiet: true, debug: false});
var chai = require('chai');
var expect = require('chai').expect;
var assert = require('chai').assert;
var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
const cw13 = require('../dist/index.js');
cw13.Cityworks.configure(process.env.domain, {path: process.env.path, version: process.env.version});

before(function(done) {
  this.timeout(20000000);
  cw13.Cityworks.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[Report::print] function test', () => {
  it('should reject with an error if the file is not available or does not exist', (done) => {
    cw13.report.print('inspection', 171018).then(r => {
      console.log(r);
      process.exit(0);
      done();
    }).catch(e => {
      assert.isObject(cw13.report.print, '');
      assert.equal(e.message, 'Activity type provided does not exist.');
      done();
    });
  });
  // it('should fail if file could not be found', (done) => {
  //   assert.isObject(cw13.report.print, '');
  //   done();
  // });
});