'use strict';
require('dotenv').config();
var chai = require('chai');
const path = require('path');
var expect = require('chai').expect;
var assert = require('chai').assert;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const cw8 = require('../dist/index.js');
cw8.Cityworks.configure(process.env.domain, {path: process.env.install_path, version: process.env.version});

before(function(done) {
  this.timeout(20000000);
  cw8.Cityworks.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[WorkOrder (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw8.workorder, 'Workorder is an object');
    done();
  });
  it('should have an admin property which is a defined object', (done) => {
    assert.isObject(cw8.workorder.admin, 'Admin is an object');
    done();
  });
  it('should have an comment property which is a defined object', (done) => {
    assert.isObject(cw8.workorder.comment, 'Comment is an object');
    done();
  });
  it('should have an costs property which is a defined object', (done) => {
    assert.isObject(cw8.workorder.costs, 'Costs is an object');
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
  it('should have attached workorders when specified');
  it('should have attached inspections when specified');
  it('should have attached service requests when specified');
});

describe('[WorkOrder::addAttachment] function test', () => {
  it('should know it is an workorder attachment instance', (done) => {
    assert.equal(cw8.workorder.attachments.currentActivityType, 'WorkOrder');
    done()
  });

  it('should return an attachment if attached by workorderid string', (done) => {
    cw8.workorder.attachments.add('100196', path.join(path.dirname(__dirname), 'uploads', 'test.pdf'), 'test.pdf').then((r) => {
      assert.equal(r.WorkOrderId, '100196')
      done()
    }).catch(error => {
      console.log(error, 'unexpected error adding attachment');
      done(new Error("Unexpected error on add attachment", error));
    });
  });

  it('should return an attachment if attached by workordersid number', (done) => {
    cw8.workorder.attachments.add(100196, path.join(path.dirname(__dirname), 'uploads', 'test.pdf'), 'test.pdf').then((r) => {
      assert.equal(r.WorkOrderId, '100297')
      done()
    }).catch(error => {
      console.log(error, 'unexpected error adding attachment');
      done(new Error("Unexpected error on add attachment", error));
    });
  });

});
