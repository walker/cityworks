'use strict';
require('dotenv').config({quiet: true, debug: false});
var assert = require('chai').assert;
const cw23 = require('../dist/index.js');

cw23.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});

before(function(done) {
  this.timeout(20000000);
  cw23.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(() => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error');
    done(e);
  });
});

describe('[CasePeople (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw23.briefcase.people, 'Briefcase.people is an object');
    done();
  });
});

describe('[CasePeople::getRoles] function test', () => {
  it('should return a collection of people roles', (done) => {
    cw23.briefcase.people.getRoles().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[CasePeople::get] function test', () => {
  it('should return people records for a case', (done) => {
    cw23.briefcase.people.get(107138).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[CasePeople::search] function test', () => {
  it('should return people objects when idsOnly is false', (done) => {
    cw23.briefcase.people.search({ CaObjectId: 107138 }, false).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      done(e);
    });
  });

  it('should return people IDs when idsOnly is true', (done) => {
    cw23.briefcase.people.search({ CaObjectId: 107138 }, true).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[CasePeople::add] function test', () => {
  it('should be callable with case ID and person name', (done) => {
    cw23.briefcase.people.add(107138, 'Case People Test').then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[CasePeople::delete] function test', () => {
  it('should be callable with a CaPeopleId', (done) => {
    cw23.briefcase.people.delete(1).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[CasePeople::deleteAll] function test', () => {
  it('should be callable with a case ID', (done) => {
    cw23.briefcase.people.deleteAll(107138).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});
