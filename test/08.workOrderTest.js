'use strict';
require('dotenv').config();
var chai = require('chai');
var expect = require('chai').expect;
var assert = require('chai').assert;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Cityworks = require('../dist/index.js');
var cw8 = new Cityworks(process.env.domain, {path: process.env.path});

before(function(done) {
  this.timeout(20000000);
  cw8.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[WorkOrder (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw8.request, 'Request is an object');
    done();
  });
  it('should have an admin property which is a defined object', (done) => {
    assert.isObject(cw8.case.admin, 'Admin is an object');
    done();
  });
  it('should have an comment property which is a defined object', (done) => {
    assert.isObject(cw8.case.comment, 'Comment is an object');
    done();
  });
});

describe('[WorkOrder::create] function test', () => {
  it('should resolve collection of WorkOrders', (done) => {
    cw8.workorder.create({WOTemplateId: 209, EntityType: 'MAINTENANCE_CATEGORIZATION'}).then(r => {
      assert.property(r[0], 'WorkOrderSid');
      done();
    }).catch(e => {
      console.log(e, 'unexpected error')
      done();
    });
  });
  it('should have attached inspections when specified');
  it('should have attached service requests when specified');
});
