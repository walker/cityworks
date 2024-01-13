'use strict';
require('dotenv').config();
var expect = require('chai').expect;
var assert = require('chai').assert;
const cw6 = require('../dist/index.js');
cw6.Cityworks.configure(process.env.domain, {path: process.env.install_path, version: process.env.version});
const _ = require('lodash')

before(function(done) {
  this.timeout(20000000);
  cw6.Cityworks.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[CaseFinancial (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw6.case.financial, 'Request is an object');
    done();
  });
});

describe('[CaseFinancial::getFees] function test', () => {
  it('should resolve a collection of case fees', (done) => {
    cw6.case.financial.getFees(16086).then(r => { // TODO: find case, then get fees
      assert.isArray(r);
      done();
    });
  });
});

describe('[CaseFinancial::addFee] function test', () => {
  it('should resolve a fee object', (done) => {
    cw6.case.financial.addFee(16085, 183, {AutoRecalculate: 'Y', Amount: 9}).then(r => { // TODO: find case, then get fees
      assert.isNumber(r.CaFeeId);
      done();
    });
  });
});

describe('[CaseFinancial::addDefaultFees] function test', () => {
  it('should resolve a ', (done) => {
    cw6.case.financial.addDefaultFees(42337, 152).then(r => { // TODO: find case, then get fees
      assert.isArray(r);
      done();
    }).catch(e => {
      console.log(e, e)
    })
  });
});

describe('[CaseFinancial::updateFee] function test', () => {
  it('should resolve a fee object with the updated amount', (done) => {
    var newAmount = ((Math.random()*100)*8).toFixed(2);
    cw6.case.financial.updateFee(18480, {Amount: newAmount}).then(r => { // TODO: find case, then get fees
      assert.equal(r.Amount, newAmount);
      done();
    });
  });
});

describe('[CaseFinancial::getAllFeeTemplates] function test', () => {
  it('should resolve a collection of all fee templates', (done) => {
    cw6.case.financial.getAllFeeTemplates().then(r => {
      assert.isArray(r);
      done();
    });
  });
});

describe('[CaseFinancial::searchFeeTemplates] function test', () => {
  it('should resolve a collection of case fees with interest in the name', (done) => {
    cw6.case.financial.searchFeeTemplates({FeeDesc: 'interest'}).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      console.log(e, 'e')
    })
  });
});

describe('[CaseFinancial::searchCaseInstruments] function test', () => {
  it('should resolve a collection of case instruments with MO in the state code', (done) => {
    cw6.case.financial.searchCaseInstruments({StateCode: 'MO'}).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      console.log(e, 'e')
    })
  });
});

describe('[CaseFinancial::getInstrumentList] function test', () => {
  it('should resolve a collection of instruments', (done) => {
    cw6.case.financial.getInstrumentList().then(r => {
      expect(r).to.satisfy(function (iLA) {
          if (iLA===null || _.isArray(iLA)) {
              return true;
          } else {
              return false;
          }
      });
      done();
    }).catch(e => {
      console.log(e, 'e')
    })
  });
});


describe('[CaseFinancial::addCaseInstrumentRelease] function test', () => {
  it('should resolve an object with the new case instrument releases\' info');
});

describe('[CaseFinancial::deleteCaseInstrumentRelease] function test', () => {
  it('should resolve an object with the deleted case instrument releases\' info');
});

describe('[CaseFinancial::searchCaseInstrumentReleases] function test', () => {
  it('should resolve a collection of case instrument releases which meet the search critera', (done) => {
    cw6.case.financial.searchCaseInstrumentReleases({PercentReleased: '100'}).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      console.log(e, 'e')
    })
  });
});

describe('[CaseFinancial::fees] function test', () => {
  it('should resolve a collection of all fees configured', (done) => {
    cw6.case.financial.fees().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      console.log(e, 'e')
    })
  });
});

describe('[CaseFinancial::searchAvailableFees] function test', () => {
  it('should resolve an array of fee IDs which meet the specified search criteria', (done) => {
    cw6.case.financial.searchAvailableFees({FeeCode: 'F-'}).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      console.log(e, 'e')
    })
  });
});

describe('[CaseFinancial::getTenderTypes] function test', () => {
  it('should resolve a collection of all tender types configured', (done) => {
    cw6.case.financial.getTenderTypes().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      console.log(e, 'e')
    })
  });
});

describe('[CaseFinancial::addTenderType] function test', () => {
  it('should resolve an object with the new tender type\'s info');
});

describe('[CaseFinancial::updateTenderType] function test', () => {
  it('should resolve an object with the details of the updated tender type');
});
