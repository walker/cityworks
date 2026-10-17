'use strict';
require('dotenv').config({quiet: true, debug: false});
var assert = require('chai').assert;
const cw21 = require('../dist/index.js');

cw21.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});

before(function(done) {
  this.timeout(20000000);
  cw21.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(() => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error');
    done(e);
  });
});

describe('[Contractor (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw21.contractor, 'Contractor is an object');
    done();
  });
});

describe('[Contractor::all] function test', () => {
  it('should return a list of contractors', (done) => {
    cw21.contractor.all().then(resp => {
      assert.isArray(resp);
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Contractor::add] function test', () => {
  it('should create and return a new contractor record', (done) => {
    var unique = Date.now().toString();
    var contractor = {
      ContractorName: 'Test Contractor ' + unique,
      ContractorNumber: 'CN' + unique,
      Viewable: true
    };

    cw21.contractor.add(contractor).then(resp => {
      assert.property(resp, 'ContractorSid');
      assert.equal(resp.ContractorName, contractor.ContractorName);
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Contractor::update] function test', () => {
  it('should update and return a contractor record', (done) => {
    var unique = Date.now().toString();
    var baseContractor = {
      ContractorName: 'Update Contractor ' + unique,
      ContractorNumber: 'UC' + unique,
      Viewable: true
    };

    cw21.contractor.add(baseContractor).then(created => {
      cw21.contractor.update(created.ContractorSid, {
        ContractorName: created.ContractorName,
        Description: 'Updated contractor description'
      }).then(updated => {
        assert.equal(updated.Description, 'Updated contractor description');
        done();
      }).catch(e => {
        done(e);
      });
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Contractor::getById] function test', () => {
  it('should retrieve contractor by ID', (done) => {
    cw21.contractor.all().then(list => {
      if (!Array.isArray(list) || list.length === 0 || !list[0].ContractorSid) {
        done('No contractor records available to test getById');
        return;
      }

      return cw21.contractor.getById(list[0].ContractorSid).then(resp => {
        assert.isObject(resp);
        assert.property(resp, 'ContractorSid');
        done();
      });
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Contractor::search] function test', () => {
  it('should search for contractor by ContractorSid', (done) => {
    cw21.contractor.all().then(list => {
      if (!Array.isArray(list) || list.length === 0 || !list[0].ContractorSid) {
        done('No contractor records available to test search');
        return;
      }

      return cw21.contractor.search([list[0].ContractorSid]).then(resp => {
        assert.isArray(resp);
        done();
      });
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Contractor::keywords] function test', () => {
  it('should retrieve contractor keywords for valid contractor IDs', (done) => {
    cw21.contractor.all().then(list => {
      if (!Array.isArray(list) || list.length === 0 || !list[0].ContractorSid) {
        done('No contractor records available to test keywords');
        return;
      }

      return cw21.contractor.keywords([list[0].ContractorSid]).then(resp => {
        assert.isArray(resp);
        done();
      });
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Contractor::addKeywords] function test', () => {
  it('should add keywords for valid contractor IDs', (done) => {
    cw21.contractor.all().then(list => {
      if (!Array.isArray(list) || list.length === 0 || !list[0].ContractorSid) {
        done('No contractor records available to test addKeywords');
        return;
      }

      return cw21.contractor.addKeywords([list[0].ContractorSid], ['test-keyword']).then(resp => {
        assert.isNotNull(resp);
        done();
      });
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Contractor::deleteKeywords] function test', () => {
  it('should delete keywords for valid contractor IDs', (done) => {
    cw21.contractor.all().then(list => {
      if (!Array.isArray(list) || list.length === 0 || !list[0].ContractorSid) {
        done('No contractor records available to test deleteKeywords');
        return;
      }

      return cw21.contractor.deleteKeywords([list[0].ContractorSid], ['test-keyword']).then(resp => {
        assert.isNotNull(resp);
        done();
      });
    }).catch(e => {
      done(e);
    });
  });
});
