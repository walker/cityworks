'use strict';
require('dotenv').config({quiet: true, debug: false});
const { shouldRunBefore } = require('./testGuard');
const suiteName = 'query';
var chai = require('chai');
var expect = require('chai').expect;
var assert = require('chai').assert;
var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
const cw11 = require('../dist/index.js');
cw11.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});

before(function(done) {
  if (!shouldRunBefore(suiteName)) {
    return done();
  }

  this.timeout(20000000);
  cw11.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

