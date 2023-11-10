'use strict';
require('dotenv').config();
var expect = require('chai').expect;
var assert = require('chai').assert;
const cw5 = require('../dist/index.js');
cw5.Cityworks.configure(process.env.domain, {path: process.env.install_path, version: process.env.version});
const _ = require('lodash')

before(function(done) {
  this.timeout(20000000);
  cw5.Cityworks.authenticate(process.env.login, process.env.password).then(r => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[Case (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw5.briefcase, 'Case is an object');
    done();
  });
  it('should have a financial property which is a defined object', (done) => {
    assert.isObject(cw5.briefcase.financial, 'Financial is an object');
    done();
  });
  it('should have a data property which is a defined object', (done) => {
    assert.isObject(cw5.briefcase.data, 'Data is an object');
    done();
  });
  it('should have a workflow property which is a defined object', (done) => {
    assert.isObject(cw5.briefcase.workflow, 'Workflow is an object');
    done();
  });
  it('should have a comment property which is a defined object', (done) => {
    assert.isObject(cw5.briefcase.comment, 'Comment is an object');
    done();
  });
  it('should have an admin property which is a defined object', (done) => {
    assert.isObject(cw5.briefcase.admin, 'Admin is an object');
    done();
  });
});

describe('[Case::create] function test', () => {
  it('should resolve an object describing the new case', (done) => {
    cw5.briefcase.create(51, 93).then(r => {
      assert.isObject(r);
      done();
    });
  });
  it('should resolve null if case type/subtype do not exist', (done) => {
    cw5.briefcase.create(999999, 99999999).then(r => {
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
    cw5.briefcase.delete(44069).then(rez => {
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

describe('[Case::addDetail] function test', () => {
  it('should resolve an object describing the moved case', (done) => {
    cw5.briefcase.data.addDetail(999999, 99999999).then(r => {
      assert.isNull(r);
      done();
    }).catch(e => {
      console.log(e, 'unexpected error')
      done();
    });
  });
});
