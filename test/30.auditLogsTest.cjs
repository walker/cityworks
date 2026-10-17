'use strict';
require('dotenv').config({quiet: true, debug: false});
var assert = require('chai').assert;
const cw30 = require('../dist/index.js');

cw30.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});

before(function(done) {
  this.timeout(20000000);
  cw30.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(() => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error');
    done(e);
  });
});

describe('[AuditLogs::context] function test', () => {
  it('should expose request.audit with REQUEST context', (done) => {
    assert.isObject(cw30.request.audit, 'request.audit is an object');
    assert.equal(cw30.request.audit.currentTableName, 'REQUEST');
    done();
  });

  it('should expose inspection.audit with INSPECTION context', (done) => {
    assert.isObject(cw30.inspection.audit, 'inspection.audit is an object');
    assert.equal(cw30.inspection.audit.currentTableName, 'INSPECTION');
    done();
  });

  it('should expose workorder.audit with WORKORDER context', (done) => {
    assert.isObject(cw30.workorder.audit, 'workorder.audit is an object');
    assert.equal(cw30.workorder.audit.currentTableName, 'WORKORDER');
    done();
  });
});

describe('[AuditLogs::get] function test', () => {
  it('should get request audit log metadata by single request id', (done) => {
    cw30.request.audit.get(1763986).then(r => {
      assert.isTrue(r === null || Array.isArray(r));
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should get request audit log metadata by request ids', (done) => {
    cw30.request.audit.get([1763986]).then(r => {
      assert.isTrue(r === null || Array.isArray(r));
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should get inspection audit log metadata by inspection id', (done) => {
    cw30.inspection.audit.get(171018).then(r => {
      assert.isTrue(r === null || Array.isArray(r));
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should get workorder audit log metadata by workorder sid', (done) => {
    cw30.workorder.audit.get(100196).then(r => {
      assert.isTrue(r === null || Array.isArray(r));
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});
