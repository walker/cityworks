'use strict';
require('dotenv').config({quiet: true, debug: false});
var assert = require('chai').assert;
const cw22 = require('../dist/index.js');

cw22.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});

before(function(done) {
  this.timeout(20000000);
  cw22.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(() => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error');
    done(e);
  });
});

describe('[WorkOrderCosts (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw22.workorder.costs, 'WorkOrderCosts is an object');
    done();
  });

  it('should have WorkOrder as currentActivityType', (done) => {
    assert.equal(cw22.workorder.costs.currentActivityType, 'WorkOrder');
    done();
  });
});

describe('[WorkOrderCosts::getCodes] function test', () => {
  it('should be callable with employee IDs', (done) => {
    cw22.workorder.costs.getCodes([1], false).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[WorkOrderCosts::getJobCodes] function test', () => {
  it('should be callable', (done) => {
    cw22.workorder.costs.getJobCodes().then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[WorkOrderCosts::addLabor] function test', () => {
  it('should be callable with work order labor inputs', (done) => {
    cw22.workorder.costs.addLabor(1, 1, { Estimated: true }).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[WorkOrderCosts::getLabor] function test', () => {
  it('should be callable with work order IDs', (done) => {
    cw22.workorder.costs.getLabor([1], true).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[WorkOrderCosts::deleteLabor] function test', () => {
  it('should be callable with labor cost IDs', (done) => {
    cw22.workorder.costs.deleteLabor([1], true).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[WorkOrderCosts::addEquipment] function test', () => {
  it('should be callable with equipment cost inputs', (done) => {
    cw22.workorder.costs.addEquipment(1, { Estimated: true, Hours: 1, Units: 1 }).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[WorkOrderCosts::getEquipment] function test', () => {
  it('should be callable with work order ID', (done) => {
    cw22.workorder.costs.getEquipment(1, true).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[WorkOrderCosts::deleteEquipment] function test', () => {
  it('should be callable with equipment cost IDs', (done) => {
    cw22.workorder.costs.deleteEquipment([1], true).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[WorkOrderCosts::addMaterial] function test', () => {
  it('should be callable with material cost inputs', (done) => {
    cw22.workorder.costs.addMaterial(1, 1, { Estimated: true, MaterialSids: [1] }, true).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[WorkOrderCosts::getMaterial] function test', () => {
  it('should be callable with work order ID', (done) => {
    cw22.workorder.costs.getMaterial(1, true).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[WorkOrderCosts::deleteMaterial] function test', () => {
  it('should be callable with material cost IDs', (done) => {
    cw22.workorder.costs.deleteMaterial(1, true).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});
