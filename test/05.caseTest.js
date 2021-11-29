'use strict';
require('dotenv').config();
var expect = require('chai').expect;
var assert = require('chai').assert;
var Cityworks = require('../dist/index.js');
var cw5 = new Cityworks(process.env.domain, {path: process.env.path});
const _ = require('lodash')

before(function(done) {
  this.timeout(20000000);
  cw5.authenticate(process.env.login, process.env.password).then(r => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[Case (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw5.case, 'Case is an object');
    done();
  });
  it('should have an financial property which is a defined object', (done) => {
    assert.isObject(cw5.case.financial, 'Financial is an object');
    done();
  });
  it('should have an data property which is a defined object', (done) => {
    assert.isObject(cw5.case.data, 'Financial is an object');
    done();
  });
  it('should have an workflow property which is a defined object', (done) => {
    assert.isObject(cw5.case.workflow, 'Financial is an object');
    done();
  });
  it('should have an comment property which is a defined object', (done) => {
    assert.isObject(cw5.case.comment, 'Financial is an object');
    done();
  });
  it('should have an admin property which is a defined object', (done) => {
    assert.isObject(cw5.case.admin, 'Financial is an object');
    done();
  });
});

describe('[Case::create] function test', () => {
  it('should resolve an object describing the new case', (done) => {
    cw5.case.create(51, 93).then(r => {
      assert.isObject(r);
      done();
    });
  });
  it('should resolve null if case type/subtype do not exist', (done) => {
    cw5.case.create(999999, 99999999).then(r => {
      assert.isNull(r);
      done();
    }).catch(e => {
      console.log(e, 'unexpected error')
      done();
    });
  });
});

describe('[Case::createChild] function test', () => {
  it('should resolve an object describing the new case', (done) => {
  });
});

describe('[Case::createFromRequest] function test', () => {
  it('should resolve an object describing the new case', (done) => {
  });
});

describe('[Case::update] function test', () => {
  it('should resolve an object describing the updated case', (done) => {
  });
});

describe('[Case::getByIds] function test', () => {
  it('should resolve a collection of case objects', (done) => {
  });
});

describe('[Case::search] function test', () => {
  it('should resolve a collection of case objects meeting the search criteria', (done) => {
  });
});

describe('[Case::move] function test', () => {
  it('should resolve an object describing the moved case', (done) => {
  });
});

describe('[Case::delete] function test', () => {
  it('should resolve a 1 (success) or 0 (failure)', (done) => {
    cw5.case.delete(44069).then(rez => {
      expect(rez).to.satisfy(function (deletionSwitch) {
          if (deletionSwitch===1 || deletionSwitch===0) {
              return true;
          } else {
              return false;
          }
      });
      done();
    }).catch(e => {
      console.log(e, 'unexpected error')
      done();
    });
  });
});
