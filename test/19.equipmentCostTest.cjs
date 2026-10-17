'use strict';
require('dotenv').config({quiet: true, debug: false});
var assert = require('chai').assert;
const cw19 = require('../dist/index.js');

cw19.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});

before(function(done) {
  this.timeout(20000000);
  cw19.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(() => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error');
    done(e);
  });
});

describe('[Equipment::Cost] construct function test', () => {
  it('should have a defined cost object', (done) => {
    assert.isObject(cw19.equipment.cost, 'Equipment cost is an object');
    done();
  });
});

describe('[Equipment::cost::addInspectionCosts] function test', () => {
  it('should be callable with inspection cost parameters', (done) => {
    cw19.equipment.cost.addInspectionCosts(1, {
      Hours: 1,
      Units: 1,
      Estimated: true
    }).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::cost::addRequestCosts] function test', () => {
  it('should be callable with request cost parameters', (done) => {
    cw19.equipment.cost.addRequestCosts(1, {
      Hours: 1,
      Units: 1,
      Estimated: true
    }).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::cost::addWorkOrderCosts] function test', () => {
  it('should be callable with work order cost parameters', (done) => {
    cw19.equipment.cost.addWorkOrderCosts(1, {
      Hours: 1,
      Units: 1,
      Estimated: true
    }).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::cost::deleteInspectionCosts] function test', () => {
  it('should be callable with inspection equipment cost IDs', (done) => {
    cw19.equipment.cost.deleteInspectionCosts([1], true).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::cost::deleteRequestCosts] function test', () => {
  it('should be callable with request equipment cost IDs', (done) => {
    cw19.equipment.cost.deleteRequestCosts([1], true).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::cost::deleteWorkOrderCosts] function test', () => {
  it('should be callable with work order equipment cost IDs', (done) => {
    cw19.equipment.cost.deleteWorkOrderCosts([1], true).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::cost::inspectionCostsByInspection] function test', () => {
  it('should be callable with inspection IDs', (done) => {
    cw19.equipment.cost.inspectionCostsByInspection([1], true).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::cost::requestCostsByRequest] function test', () => {
  it('should be callable with request IDs', (done) => {
    cw19.equipment.cost.requestCostsByRequest([1], true).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::cost::workOrderCostsByWorkOrder] function test', () => {
  it('should be callable with work order IDs and SIDs', (done) => {
    cw19.equipment.cost.workOrderCostsByWorkOrder(['100001'], [1], true).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});
