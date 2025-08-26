'use strict';
require('dotenv').config({quiet: true, debug: false});
var chai = require('chai');
var expect = require('chai').expect;
var assert = require('chai').assert;
var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
const cw11 = require('../dist/index.js');
cw11.Cityworks.configure(process.env.domain, {path: process.env.path, version: process.env.version});

before(function(done) {
  this.timeout(20000000);
  cw11.Cityworks.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

