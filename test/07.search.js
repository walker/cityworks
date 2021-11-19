'use strict';
require('dotenv').config();
var chai = require('chai');
var expect = require('chai').expect;
var assert = require('chai').assert;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Cityworks = require('../dist/index.js');
var cw7 = new Cityworks(process.env.domain, {path: process.env.path});

before(function(done) {
  this.timeout(20000000);
  cw7.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[Search::quick] function test', () => {
  it('should resolve results', (done) => {
    cw7.search.quick('256460').then(r => {
      assert.property(r, 'ServiceRequests');
      done();
    });
  });

  it('should resolve (empty) results even when the string is not found', (done) => {
    cw7.search.quick('SomethingSidewalk').then(r => {
      assert.property(r, 'Permits');
      done();
    });
  });
});
