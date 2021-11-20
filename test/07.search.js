'use strict';
require('dotenv').config();
var chai = require('chai');
var expect = require('chai').expect;
var assert = require('chai').assert;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Cityworks = require('../dist/index.js');
var cw7 = new Cityworks(process.env.domain, {path: process.env.path});

before(function(done) {
  this.timeout(20000000);
  cw7.authenticate(process.env.login, process.env.password).then(resp => {
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
      // console.log(e)
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
