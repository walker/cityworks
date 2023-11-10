'use strict';
require('dotenv').config();
var chai = require('chai');
var expect = require('chai').expect;
var assert = require('chai').assert;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const cw7 = require('../dist/index.js');
cw7.Cityworks.configure(process.env.domain, {path: process.env.install_path, version: process.env.version});

before(function(done) {
  this.timeout(20000000);
  cw7.Cityworks.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[Search::quick] function test', () => {
  it('should resolve results', (done) => {
    cw7.search.quick('256460').then(r => {
      assert.property(r, 'ServiceRequests');
      done();
    });
  });

  it('should resolve (empty) results even when the string is not found', (done) => {
    cw7.search.quick('SomethingSidewalk').then(r => {
      assert.property(r, 'Permits');
      done();
    });
  });
});

describe('[Search::execute] function test', () => {
  it('should resolve a collection of search results', (done) => {
    cw7.search.execute(3897).then(r => {
      assert.isArray(r);
      done();
    });
  });

  it('should resolve an empty array if search ID is not found', (done) => {
    cw7.search.execute(999999999).then(r => {
      assert.isEmpty(r);
      done();
    });
  });
});

describe('[Search::getSaved] function test', () => {
  it('should resolve a collection of saved searches', (done) => {
    cw7.search.getSaved('Request').then(r => {
      assert.isArray(r);
      done();
    });
  });

  it('should reject with an error if the search type does not exist', (done) => {
    cw7.search.getSaved('ServiceRequest').then(r => {
    }).catch(e => {
      assert.equal(e.message, 'SearchType provided does not exist or is mispelled.')
      done();
    });
  });

  it('should reject with an error if the applyToEntities and employeeSid/domainId are all set at the same time', (done) => {
    cw7.search.getSaved('Request', ['EASEMENT_TREES'], 127, 1).then(r => {
    }).catch(e => {
      assert.equal(e.message, 'You cannot specify both applyToEntities AND employeeSid/domainId')
      done();
    });
  });
});

describe('[Search::displayFields] function test', () => {
  it('should resolve a collection of display fields', (done) => {
    cw7.search.displayFields('WorkOrder').then(r => {
      assert.isArray(r);
      done();
    });
  });

  it('should reject with an error if the searchType is not found', (done) => {
    cw7.search.displayFields('ServiceRequest').then(r => {
    }).catch(e => {
      assert.equal(e.message, 'SearchType provided does not exist or is mispelled.')
      done();
    });
  });
});

describe('[Search::types] function test', () => {
  it('should resolve a collection of types', (done) => {
    cw7.search.types().then(r => {
      assert.isArray(r);
      done();
    });
  });
});

describe('[Search::disableServices] function test', () => {
  it('should resolve dictionary of searchIDs and boolean', (done) => {
    cw7.search.disableServices([4338]).then(r => {
      assert.propertyVal(r, 4338, true);
      done();
    });
  });
  it('should always be "False" if search ID does not exist', (done) => {
    cw7.search.disableServices([9999999]).then(r => {
      assert.propertyVal(r, 9999999, false);
      done();
    });
  });
});

describe('[Search::enableServices] function test', () => {
  it('should resolve dictionary of searchIDs and boolean', (done) => {
    cw7.search.enableServices([4338]).then(r => {
      assert.propertyVal(r, 4338, true);
      done();
    });
  });
  it('should always be "False" if search ID does not exist', (done) => {
    cw7.search.enableServices([9999999]).then(r => {
      assert.propertyVal(r, 9999999, false);
      done();
    });
  });
});

describe('[Search::getDefinition] function test', () => {
  it('should resolve the definition of the search', (done) => {
    cw7.search.getDefinition(4338).then(r => {
      assert.isObject(r);
      done();
    });
  });
  it('should be blanked search definition if the definition doesn\'t exist', (done) => {
    cw7.search.getDefinition(9999999).then(r => {
      assert.isEmpty(r.SearchFields);
      done();
    });
  });
});

describe('[Search::getDefinitions] function test', () => {
  it('should resolve the definition of the search', (done) => {
    cw7.search.getDefinitions([4338,4337,4336]).then(r => {
      assert.isArray(r);
      done();
    });
  });
  it('should be blanked search definition(s) if the definitions don\'t exist', (done) => {
    cw7.search.getDefinitions([9999999,99999999,999999999]).then(r => {
      assert.isEmpty(r[0].SearchFields);
      done();
    });
  });
});

describe('[Search::getDefinitionNames] function test', () => {
  it('should resolve a collection', (done) => {
    cw7.search.getDefinitionNames([1,2,3,4,5]).then(r => {
      assert.isArray(r);
      done();
    });
  });
});

describe('[Search::saveDefinition] function test', () => {
  it('should resolve a collection', (done) => {
    cw7.search.saveDefinition('Request').then(r => {
      assert.isNumber(r.SearchId);
      done();
    });
  });
});

describe('[Search::deleteDefinitions] function test', () => {
  it('should resolve a list of success or failure to delete per id', (done) => {
    cw7.search.saveDefinition('Request').then(r => {
      cw7.search.deleteDefinitions([r.SearchId]).then(rez => {
        assert.isBoolean(rez[r.SearchId]);
        done();
      });
    });
  });
});

describe('[Search::convertToQuery] function test', () => {
  it('should resolve a list of the search to query results', (done) => {
    cw7.search.convertToQuery([63]).then(r => {
      done();      
    });
  });
});