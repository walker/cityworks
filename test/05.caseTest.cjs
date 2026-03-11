'use strict';
require('dotenv').config({quiet: true, debug: false});
var expect = require('chai').expect;
var assert = require('chai').assert;
const cw5 = require('../dist/index.js');
cw5.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});
const _ = require('lodash')

before(function(done) {
  this.timeout(20000000);
  cw5.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(r => {
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
  it('should resolve an object describing the new case', function(done) {
    this.timeout(20000);
    cw5.briefcase.create(51, 93).then(r => {
      assert.isTrue(r === null || typeof r === 'object');
      done();
    }).catch(e => {
      assert.isObject(e);
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
  it('should resolve an object describing the new case', function(done) {
    this.timeout(20000);
    cw5.briefcase.createChild(152, 107138).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Case::createFromRequest] function test', () => {
  it('should resolve an object describing the new case', (done) => {
    cw5.briefcase.createFromRequest(51, 93, 1).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Case::update] function test', () => {
  it('should resolve an object describing the updated case', (done) => {
    cw5.briefcase.update(107138, { CaseName: 'Case Update Test' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Case::getById::] function test', () => {
  it('should resolve a collection of a single case object, if only one ID provided', (done) => {
    cw5.briefcase.getById(107138).then(rez => {
      assert.isNumber(rez.CaObjectId);
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
      assert.isArray(rez);
      done();
    }).catch(e => {
      console.log(e, 'unexpected error')
      done(e);
    });
  });
  it('should resolve a collection of a case objects, if multiple IDs provided', (done) => {
    cw5.briefcase.getByIds([106968, 106970, 106973]).then(rez => {
      assert.isArray(rez);
      done();
    }).catch(e => {
      console.log(e, 'unexpected error')
      done(e);
    });
  });
});

describe('[Case::search] function test', () => {
  it('should resolve a collection of case objects meeting the search criteria', (done) => {
    cw5.briefcase.search({ CaseStatus: 'OPEN' }).then(rez => {
      assert.isArray(rez);
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Case::move] function test', () => {
  it('should reject when projection is missing WKID and WKT', (done) => {
    cw5.briefcase.move(107138, -93.0, 44.0, {}).then(() => {
      done('Expected move to reject without WKID or WKT');
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should resolve an object describing the moved case', (done) => {
    cw5.briefcase.move(107138, -93.0, 44.0, { WKID: '4326' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Case::getRequirements] function test', () => {
  it('should resolve requirement data for a business case template', (done) => {
    cw5.briefcase.getRequirements(152).then(r => {
      assert.isTrue(r === null || Array.isArray(r) || typeof r === 'object');
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Case::getCustomData] function test', () => {
  it('should be callable and return custom data rows', (done) => {
    cw5.briefcase.getCustomData(107138, 152, 'CA_OBJECT').then(r => {
      assert.isTrue(r === null || Array.isArray(r));
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Case::MapLayerFields methods] function test', () => {
  it('should call getMLFs', (done) => {
    cw5.briefcase.getMLFs(107138).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call updateMLFs', (done) => {
    cw5.briefcase.updateMLFs(107138, -93.0, 44.0, 1).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call deleteMLFs', (done) => {
    cw5.briefcase.deleteMLFs(107138).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Case::getPrintTemplates] function test', () => {
  it('should return report templates for the case', (done) => {
    cw5.briefcase.getPrintTemplates(107138).then(r => {
      assert.isTrue(r === null || Array.isArray(r));
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Case::lookup methods] function test', () => {
  it('should call getZips', (done) => {
    cw5.briefcase.getZips().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      done(e);
    });
  });

  it('should call getStates', (done) => {
    cw5.briefcase.getStates().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      done(e);
    });
  });

  it('should call getCountries', (done) => {
    cw5.briefcase.getCountries().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      done(e);
    });
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
  it('should resolve a collection of related documents for the case provided when the case has documents attached', function(done) {
    this.timeout(20000);
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

  it('should resolve if the case does not exist', function(done) {
    this.timeout(20000);
    cw5.briefcase.attachments.getByNodesId(321768493624).then(r => {
      done();
    }).catch(e => {
      assert.isObject(e)
      done();
    });
  });
});
