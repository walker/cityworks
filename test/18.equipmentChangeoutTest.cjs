'use strict';
require('dotenv').config({quiet: true, debug: false});
var assert = require('chai').assert;
const cw18 = require('../dist/index.js');

cw18.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});

before(function(done) {
  this.timeout(20000000);
  cw18.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(() => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error');
    done(e);
  });
});

describe('[Equipment::Changeout] construct function test', () => {
  it('should have a defined changeout object', (done) => {
    assert.isObject(cw18.equipment.changeout, 'Equipment changeout is an object');
    done();
  });
});

describe('[Equipment::changeout::addChangeOutRead] function test', () => {
  it('should be callable with proper parameters', (done) => {
    var changeOutId = 1;
    var operationId = 1;
    var isNewRead = true;
    var readData = {
      Text1: 'Test Read'
    };

    cw18.equipment.changeout.addChangeOutRead(changeOutId, operationId, isNewRead, readData).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::changeout::addOperation] function test', () => {
  it('should be callable with operation parameters', (done) => {
    var operation = {
      ChangeOutId: 1,
      Operation: 4,
      RecordDate: new Date(),
      OperationComments: 'Test operation'
    };

    cw18.equipment.changeout.addOperation(operation).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::changeout::attach] function test', () => {
  it('should be callable with attach parameters', (done) => {
    var attachParams = {
      ChangeOutId: 1,
      NewUid: 'TEST-ATTACH-001',
      AssetType: 'GIS',
      RecordDate: new Date(),
      OperationComments: 'Test attach'
    };

    cw18.equipment.changeout.attach(attachParams).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::changeout::detach] function test', () => {
  it('should be callable with detach parameters', (done) => {
    var detachParams = {
      ChangeOutId: 1,
      OldUid: 'TEST-DETACH-001',
      AssetType: 'GIS',
      RecordDate: new Date(),
      OperationComments: 'Test detach'
    };

    cw18.equipment.changeout.detach(detachParams).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::changeout::replace] function test', () => {
  it('should be callable with replace parameters', (done) => {
    var replaceParams = {
      ChangeOutId: 1,
      OldUid: 'TEST-OLD-001',
      NewUid: 'TEST-NEW-001',
      AssetType: 'GIS',
      RecordDate: new Date(),
      OperationComments: 'Test replace'
    };

    cw18.equipment.changeout.replace(replaceParams).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});
