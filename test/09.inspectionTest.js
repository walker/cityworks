'use strict';
require('dotenv').config();
var chai = require('chai');
var expect = require('chai').expect;
var assert = require('chai').assert;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Cityworks = require('../dist/index.js');
var cw9 = new Cityworks(process.env.domain, {path: process.env.path});

before(function(done) {
  this.timeout(20000000);
  cw9.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[Inspection::create] function test', () => {
  it('should resolve (empty) results even when the string is not found', (done) => {
    cw9.inspection.create('SomethingSidewalk').then(r => {
      assert.property(r, 'Permits');
      done();
    });
  });
});
