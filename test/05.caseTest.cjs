'use strict';
require('dotenv').config();
var expect = require('chai').expect;
var assert = require('chai').assert;
const cw5 = require('../dist/index.js');
cw5.Cityworks.configure(process.env.domain, {path: process.env.path, version: process.env.version});
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

describe('[Case::getById::] function test', () => {
  it('should resolve a collection of a single case object, if only one ID provided', (done) => {
    cw5.briefcase.getByIds([106968]).then(rez => {
      assert.isNumber(rez[0].CaObjectId);
      done();
    }).catch(e => {
      console.log(e, 'unexpected error')
      done(e);
    });
  });
});

describe('[Case::getByIds] function test', () => {
  it('should resolve a collection of a single case object, if only one ID provided', (done) => {
    cw5.briefcase.getByIds([106968]).then(rez => {
      expect(rez).to.be.an('array').of.length(1);
      done();
    }).catch(e => {
      console.log(e, 'unexpected error')
      done(e);
    });
  });
  it('should resolve a collection of a case objects, if multiple IDs provided', (done) => {
    cw5.briefcase.getByIds([106968, 106970, 106973]).then(rez => {
      expect(rez).to.be.an('array').of.length(3);
      done();
    }).catch(e => {
      console.log(e, 'unexpected error')
      done(e);
    });
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

describe('[Case::getRelatedDocs] function test', () => {
  it('should resolve a collection of related documents for the case provided when the case has documents attached', (done) => {
    cw5.briefcase.attachments.getByNodesId(79986).then(r => {
      assert.isArray(r)
      done();
    }).catch(e => {
      console.log(e, 'unexpected error')
      done();
    });
  });

  it('should resolve an empty collection for the case provided when the case has no documents attached', (done) => {
    cw5.briefcase.attachments.getByNodesId(11611).then(r => {
      expect(r).to.be.empty
      done();
    }).catch(e => {
      console.log(e, 'unexpected error')
      done();
    });
  });

  it('should resolve if the case does not exist', (done) => {
    cw5.briefcase.attachments.getByNodesId(321768493624).then(r => {
      done();
    }).catch(e => {
      expect(e).to.have.property('code', 2)
      done();
    });
  });
});
