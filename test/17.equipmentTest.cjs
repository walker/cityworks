'use strict';
require('dotenv').config({quiet: true, debug: false});
var assert = require('chai').assert;
const cw17 = require('../dist/index.js');

cw17.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});

before(function(done) {
  this.timeout(20000000);
  cw17.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(() => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error');
    done(e);
  });
});

describe('[Equipment (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw17.equipment, 'Equipment is an object');
    done();
  });
});

describe('[Equipment::all] function test', () => {
  it('should return a list of viewable equipment by default', (done) => {
    cw17.equipment.all().then(resp => {
      assert.isArray(resp, 'Expected response to be an array');
      done();
    }).catch(e => {
      done(e);
    });
  });

  it('should return a list including all equipment when viewableOnly is false', (done) => {
    cw17.equipment.all(false).then(resp => {
      assert.isArray(resp, 'Expected response to be an array');
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Equipment::addEquipment] function test', () => {
  it('should create and return a new equipment record', (done) => {
    var unique = Date.now().toString();
    var equipment = {
      EquipmentUid: 'TESTEQ' + unique,
      Description: 'Test Equipment ' + unique,
      Manufacturer: 'Test Manufacturer',
      Model: 'Model A',
      ForCheckout: true,
      Viewable: true
    };

    cw17.equipment.add(equipment).then(resp => {
      assert.property(resp, 'EquipmentSid');
      assert.equal(resp.EquipmentUid, equipment.EquipmentUid);
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Equipment::updateEquipment] function test', () => {
  it('should update and return the equipment record', (done) => {
    var unique = Date.now().toString();
    var baseEquipment = {
      EquipmentUid: 'TESTUPDATE' + unique,
      Description: 'Initial Description',
      Manufacturer: 'Original Manufacturer',
      Model: 'Model B'
    };

    cw17.equipment.add(baseEquipment).then(created => {
      cw17.equipment.update(created.EquipmentSid, {
        Description: 'Updated Description',
        Manufacturer: 'Updated Manufacturer'
      }).then(updated => {
        assert.equal(updated[0].Description, 'Updated Description');
        assert.equal(updated[0].Manufacturer, 'Updated Manufacturer');
        done();
      }).catch(e => {
        done(e);
      });
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Equipment::getById] function test', () => {
  it('should retrieve equipment by ID', (done) => {
    cw17.equipment.all(false).then(list => {
      if (!Array.isArray(list) || list.length === 0 || !list[0].EquipmentSid) {
        done('No equipment records available to test getById');
        return;
      }

      return cw17.equipment.getById(list[0].EquipmentSid).then(resp => {
        assert.isObject(resp);
        assert.property(resp, 'EquipmentSid');
        done();
      });
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Equipment::getByIds] function test', () => {
  it('should retrieve equipment by multiple IDs', (done) => {
    cw17.equipment.all(false).then(list => {
      if (!Array.isArray(list) || list.length === 0 || !list[0].EquipmentSid) {
        done('No equipment records available to test getByIds');
        return;
      }

      const equipmentSids = list.slice(0, Math.min(3, list.length)).map(e => e.EquipmentSid);
      return cw17.equipment.getByIds(equipmentSids).then(resp => {
        assert.isArray(resp);
        assert.isAtLeast(resp.length, 1);
        done();
      });
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Equipment::search] function test', () => {
  it('should search for equipment by EquipmentUid', (done) => {
    cw17.equipment.all(false).then(list => {
      if (!Array.isArray(list) || list.length === 0 || !list[0].EquipmentUid) {
        done('No equipment records available to test search');
        return;
      }

      return cw17.equipment.search({ EquipmentUid: [list[0].EquipmentUid] }).then(resp => {
        assert.isArray(resp);
        done();
      });
    }).catch(e => {
      done(e);
    });
  });
});
