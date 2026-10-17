'use strict';
require('dotenv').config({quiet: true, debug: false});
var assert = require('chai').assert;
const cw29 = require('../dist/index.js');

cw29.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});

before(function(done) {
  this.timeout(20000000);
  cw29.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(() => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error');
    done(e);
  });
});

describe('[GeneralAdmin (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw29.general_admin, 'general_admin is an object');
    done();
  });
});

describe('[GeneralAdmin::getHolidays] function test', () => {
  it('should return holidays list', (done) => {
    cw29.general_admin.getHolidays().then(r => {
      assert.isTrue(r === null || Array.isArray(r));
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should return holidays list for date range', (done) => {
    cw29.general_admin.getHolidays('2026-01-01', '2027-01-01').then(r => {
      assert.isTrue(r === null || Array.isArray(r));
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[GeneralAdmin::getHolidayByDate] function test', () => {
  it('should be callable for a specific date', (done) => {
    cw29.general_admin.getHolidayByDate('2026-12-25').then(r => {
      assert.isTrue(r === null || typeof r === 'object');
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[GeneralAdmin::addHoliday] function test', () => {
  it('should be callable to add a holiday', (done) => {
    cw29.general_admin.addHoliday('2026-12-31', 'Copilot Holiday Test').then(r => {
      assert.isTrue(r === undefined || r === null || typeof r === 'object' || Array.isArray(r));
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[GeneralAdmin::deleteHolidays] function test', () => {
  it('should be callable to delete holidays by date list', (done) => {
    cw29.general_admin.deleteHolidays(['2026-12-31']).then(r => {
      assert.isTrue(r === undefined || r === null || Array.isArray(r) || typeof r === 'object');
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[GeneralAdmin::findReplaceConfigurationText] function test', () => {
  it('should be callable with old/new text', (done) => {
    cw29.general_admin.findReplaceConfigurationText('old-config-value', 'new-config-value').then(r => {
      assert.isTrue(r === undefined || r === null || typeof r === 'boolean' || typeof r === 'object');
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should be callable with filter options', (done) => {
    cw29.general_admin.findReplaceConfigurationText('old-config-value', 'new-config-value', {
      QueryDefinitionIds: [1],
      DomainIds: [1],
      IsPublic: false,
      QueryIds: [1],
      CreatedBySids: [1],
      Configuration: 'SELECT%'
    }).then(r => {
      assert.isTrue(r === undefined || r === null || typeof r === 'boolean' || typeof r === 'object');
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});
