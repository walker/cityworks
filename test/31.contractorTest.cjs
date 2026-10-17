'use strict';
require('dotenv').config({quiet: true, debug: false});
var assert = require('chai').assert;
const cw31 = require('../dist/index.js');

cw31.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});

before(function(done) {
  this.timeout(20000000);
  cw31.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(() => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error');
    done(e);
  });
});

function buildContractor(unique) {
  return {
    ContractorName: 'Test Contractor ' + unique,
    ContractorNumber: 'CN' + unique,
    Viewable: true
  };
}

describe('[Contractor (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw31.contractor, 'Contractor is an object');
    assert.isObject(cw31.contractor.type, 'Contractor.type is an object');
    done();
  });
});

describe('[Contractor::all] function test', () => {
  it('should return a list of contractors', (done) => {
    cw31.contractor.all().then(resp => {
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
    var contractor = buildContractor(unique);

    cw31.contractor.add(contractor).then(resp => {
      assert.property(resp, 'ContractorSid');
      assert.equal(resp.ContractorName, contractor.ContractorName);
      return cw31.contractor.delete([resp.ContractorSid]).then(() => {
        done();
      });
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Contractor::update] function test', () => {
  it('should update and return a contractor record', (done) => {
    var unique = Date.now().toString();
    var contractor = buildContractor(unique);

    cw31.contractor.add(contractor).then(created => {
      return cw31.contractor.update(created.ContractorSid, {
        ContractorName: created.ContractorName,
        Description: 'Updated contractor description'
      }).then(updated => {
        assert.equal(updated.Description, 'Updated contractor description');
        return cw31.contractor.delete([created.ContractorSid]);
      });
    }).then(() => {
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Contractor::getById] function test', () => {
  it('should retrieve contractor by ID', (done) => {
    cw31.contractor.all().then(list => {
      if (!Array.isArray(list) || list.length === 0 || !list[0].ContractorSid) {
        done('No contractor records available to test getById');
        return;
      }

      return cw31.contractor.getById(list[0].ContractorSid).then(resp => {
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
    cw31.contractor.all().then(list => {
      if (!Array.isArray(list) || list.length === 0 || !list[0].ContractorSid) {
        done('No contractor records available to test search');
        return;
      }

      return cw31.contractor.search([list[0].ContractorSid]).then(resp => {
        assert.isArray(resp);
        done();
      });
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Contractor::customDataFields] function test', () => {
  it('should retrieve custom data fields for a contractor', (done) => {
    cw31.contractor.all().then(list => {
      if (!Array.isArray(list) || list.length === 0 || !list[0].ContractorSid) {
        done('No contractor records available to test customDataFields');
        return;
      }

      return cw31.contractor.customDataFields(list[0].ContractorSid).then(resp => {
        assert.isDefined(resp);
        done();
      });
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Contractor::delete] function test', () => {
  it('should delete a created contractor record', (done) => {
    var unique = Date.now().toString();
    var contractor = buildContractor(unique);

    cw31.contractor.add(contractor).then(created => {
      return cw31.contractor.delete([created.ContractorSid]).then(resp => {
        assert.isDefined(resp);
        done();
      });
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Contractor::keywords] function test', () => {
  it('should retrieve contractor keywords for valid contractor IDs', (done) => {
    cw31.contractor.all().then(list => {
      if (!Array.isArray(list) || list.length === 0 || !list[0].ContractorSid) {
        done('No contractor records available to test keywords');
        return;
      }

      return cw31.contractor.keywords([list[0].ContractorSid]).then(resp => {
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
    var keyword = 'test-keyword-' + Date.now();

    cw31.contractor.all().then(list => {
      if (!Array.isArray(list) || list.length === 0 || !list[0].ContractorSid) {
        done('No contractor records available to test addKeywords');
        return;
      }

      return cw31.contractor.addKeywords([list[0].ContractorSid], [keyword]).then(resp => {
        assert.isNotNull(resp);
        return cw31.contractor.deleteKeywords([list[0].ContractorSid], [keyword]);
      }).then(() => {
        done();
      });
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Contractor::deleteKeywords] function test', () => {
  it('should delete keywords for valid contractor IDs', (done) => {
    var keyword = 'test-keyword-' + Date.now();

    cw31.contractor.all().then(list => {
      if (!Array.isArray(list) || list.length === 0 || !list[0].ContractorSid) {
        done('No contractor records available to test deleteKeywords');
        return;
      }

      return cw31.contractor.addKeywords([list[0].ContractorSid], [keyword]).then(() => {
        return cw31.contractor.deleteKeywords([list[0].ContractorSid], [keyword]);
      }).then(resp => {
        assert.isNotNull(resp);
        done();
      });
    }).catch(e => {
      done(e);
    });
  });
});

describe('[ContractorType::all] function test', () => {
  it('should return a list of contractor types', (done) => {
    cw31.contractor.type.all().then(resp => {
      assert.isArray(resp);
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[ContractorType::search] function test', () => {
  it('should search for contractor types by available search fields', (done) => {
    cw31.contractor.type.all().then(list => {
      var filters = {};

      if (!Array.isArray(list) || list.length === 0) {
        done('No contractor type records available to test search');
        return;
      }

      if (list[0].ContractorTypeId) {
        filters.ContractorTypeId = list[0].ContractorTypeId;
      } else if (list[0].ContractorType) {
        filters.ContractorType = list[0].ContractorType;
      } else if (list[0].ContractorDesc) {
        filters.ContractorDesc = list[0].ContractorDesc;
      } else {
        done('No contractor type search fields available to test search');
        return;
      }

      return cw31.contractor.type.search(filters).then(resp => {
        assert.isArray(resp);
        done();
      });
    }).catch(e => {
      done(e);
    });
  });
});

describe('[ContractorType::searchObject] function test', () => {
  it('should search for contractor type objects by available search fields', (done) => {
    cw31.contractor.type.all().then(list => {
      var filters = {};

      if (!Array.isArray(list) || list.length === 0) {
        done('No contractor type records available to test searchObject');
        return;
      }

      if (list[0].ContractorTypeId) {
        filters.ContractorTypeId = list[0].ContractorTypeId;
      } else if (list[0].ContractorType) {
        filters.ContractorType = list[0].ContractorType;
      } else if (list[0].ContractorDesc) {
        filters.ContractorDesc = list[0].ContractorDesc;
      } else {
        done('No contractor type search fields available to test searchObject');
        return;
      }

      return cw31.contractor.type.searchObject(filters).then(resp => {
        assert.isArray(resp);
        done();
      });
    }).catch(e => {
      done(e);
    });
  });
});