'use strict';
require('dotenv').config();
var chai = require('chai');
const path = require('path');
var expect = require('chai').expect;
var assert = require('chai').assert;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const cw10 = require('../dist/index.js');
cw10.Cityworks.configure(process.env.domain, {path: process.env.install_path, version: process.env.version});

before(function(done) {
  this.timeout(20000000);
  cw10.Cityworks.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[Inspection (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw10.inspection, 'Inspection is an object');
    done();
  });
  it('should have an admin property which is a defined object', (done) => {
    assert.isObject(cw10.inspection.admin, 'Admin is an object');
    done();
  });
  it('should have an costs property which is a defined object', (done) => {
    assert.isObject(cw10.inspection.costs, 'Costs is an object');
    done();
  });
});

describe('[Inspection::create] function test', () => {
  it('should resolve collection of Inspections', (done) => {
    cw10.inspection.create({InspectionTemplateId: 209, EntityType: 'MAINTENANCE_CATEGORIZATION'}).then(r => {
      assert.property(r[0], 'InspectionId');
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

describe('[Inspection::create] function test', () => {
  it('', (done) => {
    done()
  });
});

describe('[Inspection::addAttachment] function test', () => {
  it('should know it is an inspection attachment instance', (done) => {
    assert.equal(cw10.inspection.attachments.currentActivityType, 'Inspection');
    done()
  });

  it('should return an attachment if attached', (done) => {
    cw10.inspection.attachments.add(144882, path.join(path.dirname(__dirname), 'uploads', 'test.pdf'), 'test.pdf').then((r) => {
      assert.isDefined(r.Attachment)
      done()
    }).catch(error => {
      console.log(error, 'unexpected error adding attachment');
      done(new Error("Unexpected error on add attachment", error));
    });
  });

});
