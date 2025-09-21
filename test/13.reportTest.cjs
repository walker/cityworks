'use strict';
require('dotenv').config({quiet: true, debug: false})
const fs = require('fs').promises;
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

describe('[Report::Print] (General Print) function test', () => {
  it('should reject if the type is not found', (done) => {
    cw13.report.print('briefcase', 171018).then(r => {
      done();
    }).catch(e => {
      assert.equal(e.Message, 'Invalid type provided. Must be case, workorder, inspection, or request.');
      done();
    });
  });
  it('should reject if the node is not a nonezero number', (done) => {
    cw13.report.print('case', 0).then(r => {
      done();
    }).catch(e => {
      assert.equal(e.Message, 'Invalid node_id provided. Must be a number greater than 0.');
      done();
    });
  });
});

describe('[Report::SRPrint] (Service Request Print) function test', () => {
  it('should reject with an error if the service request type does not have a print report available and a report filename is not provided', (done) => {
    cw13.report.print('request', 1205001).then(r => {
      assert.fail('Report.print for service requests should have rejected with an error');
    }).catch(e => {
      assert.equal(e.Message, 'No print template defined for this service request');
      done();
    });
  });
  it('should reject with an error if the service request print template file could not be found.', (done) => {
    cw13.report.print('request', 1991421).then(r => {
      assert.fail('Report.print for service request should have rejected with an error');
    }).catch(e => {
      expect(e.Message).to.include('Could not find report');
      done();
    });
  });
  it('should provide a buffer and filename if the service request print template and node are available', (done) => {
    cw13.report.print('request', 1998321).then(r => {
      assert.isString(r.file, 'Report.print did not return a file');
      assert.include(r.file, 'PDF', 'Report.print did not return a PDF file');
      assert.isString(r.name, 'Report.print did not return a name for the file');
      done();
    }).catch(e => {
      console.log('Error in test', e);
      done();
    });
  });
});

describe('[Report::WOPrint] (Work Order Print) function test', () => {
  it('should reject with an error if the work order type does not have a print report available and a report filename is not provided', (done) => {
    cw13.report.print('workorder', 10000).then(r => {
      assert.fail('Report.print for work orders should have rejected with an error');
    }).catch(e => {
      assert.equal(e.Message, 'No print template defined for this work order');
      done();
    });
  });
  it('should reject with an error if the Work Order print template file could not be found.', (done) => {
    cw13.report.print('workorder', 263066).then(r => {
      assert.fail('Report.print for work order should have rejected with an error');
    }).catch(e => {
      expect(e.Message).to.include('Could not find report');
      done();
    });
  });
  it('should provide a buffer and filename if the work order print template and node are available', (done) => {
    cw13.report.print('workorder', 263076).then(r => {
      assert.isString(r.file, 'Report.print did not return a file');
      assert.include(r.file, 'PDF', 'Report.print did not return a PDF file');
      assert.isString(r.name, 'Report.print did not return a name for the file');
      done();
    }).catch(e => {
      console.log('Error in test', e);
      done();
    });
  });
});

describe('[Report::InspPrint] (Inspection Print) function test', () => {
  it('should reject with an error if the inspection type does not have a print report available and a report filename is not provided', (done) => {
    cw13.report.print('inspection', 170800).then(r => {
      assert.fail('Report.print should have rejected with an error');
    }).catch(e => {
      assert.equal(e.Message, 'No print template defined for this inspection type.');
      done();
    });
  });
  it('should reject with an error if the Inspection print template file could not be found.', (done) => {
    cw13.report.print('inspection', 170500).then(r => {
      assert.fail('Report.print should have rejected with an error');
    }).catch(e => {
      expect(e.Message).to.include('Could not find report');
      done();
    });
  });
  it('should provide a PDF string and filename if the inspection print template and node are available', (done) => {
    cw13.report.print('inspection', 171018).then(r => {
      assert.isString(r.file, 'Report.print did not return a file');
      assert.include(r.file, 'PDF', 'Report.print did not return a PDF file');
      assert.isString(r.name, 'Report.print did not return a name for the file');
      done();
    }).catch(e => {
      // console.log('e', e);
      assert.equal(e.Message, 'Activity type provided does not exist.');
      done();
    });
  });
});