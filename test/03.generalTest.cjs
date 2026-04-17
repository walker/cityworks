'use strict';
require('dotenv').config({quiet: true, debug: false});
var chai = require('chai');
var expect = require('chai').expect;
var assert = require('chai').assert;
var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
const cw3 = require('../dist/index.js');
cw3.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});

before(function(done) {
  this.timeout(20000000);
  cw3.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[General::notifications] function test', () => {
  it('should resolve a collection', (done) => {
    cw3.general.notifications().then(resp => {
      assert.isArray(resp);
      done();
    });
  });
});

describe('[General::amIWatching] function test', () => {
  it('should reject with an error if the activity type is not available or does not exist', (done) => {
    cw3.general.amIWatching('request', 42015).then(r => {
    }).catch(e => {
      assert.equal(e.Message, 'Activity type provided does not exist.');
      done();
    });
  });
  it('should resolve a boolean', (done) => {
    cw3.general.amIWatching('case', 42015).then(r => {
      assert.isBoolean(r);
      done();
    });
  });
  it('should resolve with false if id does not exist', (done) => {
    cw3.general.amIWatching('case', 200042015).then(r => {
      assert.isFalse(r);
      done();
    }).catch(e => {
      done();
    });
  });
  it('should reject with an error if the activity id is too large', (done) => {
    cw3.general.amIWatching('case', 10000000000).then(response => {
    }).catch(e => {
      assert.equal(e.Message, 'Unknown error.');
      done();
    });
  });
});

describe('[General::quickSearch] function test', () => {
  it('should resolve results', (done) => {
    cw3.general.quickSearch('256460').then(r => {
      assert.property(r, 'Permits');
      done();
    });
  });

  it('should resolve (empty) results even when the string is not found', (done) => {
    cw3.general.quickSearch('SomethingSidewalk').then(r => {
      assert.property(r, 'Permits');
      done();
    });
  });
});

describe('[General::getHolidays] function test', () => {
  it('should resolve a collection', (done) => {
    cw3.general.getHolidays().then(resp => {
      assert.isArray(resp);
      done();
    });
  });
  it('should not return holidays before the provided start date', (done) => {
    let startDate = new Date('2024-01-01');
    cw3.general.getHolidays(startDate).then(resp => {
      resp.forEach(holiday => {
        let holidayDate = new Date(holiday.HolidayDate);
        assert.isAtLeast(holidayDate.getTime(), startDate.getTime(), `Holiday ${holiday.Description} (${holiday.HolidayDate}) is before ${startDate.toISOString()}`);
      });
      done();
    });
  });
  it('should not return holidays after the provided end date', (done) => {
    let endDate = new Date('2025-12-31');
    cw3.general.getHolidays(undefined, endDate).then(resp => {
      resp.forEach(holiday => {
        let holidayDate = new Date(holiday.HolidayDate);
        assert.isAtMost(holidayDate.getTime(), endDate.getTime(), `Holiday ${holiday.Description} (${holiday.HolidayDate}) is after ${endDate.toISOString()}`);
      });
      done();
    });
  });
});

describe('[General::addHoliday] function test', () => {
  it('should add a holiday and make it available in holiday results', (done) => {
    let holiday = new Date();
    holiday.setHours(0, 0, 0, 0);
    holiday.setDate(holiday.getDate() + 365);
    let nextDay = new Date(holiday.getTime() + 24 * 60 * 60 * 1000);
    let description = `addHoliday test ${Date.now()}`;

    cw3.general.addHoliday(holiday, description).then(resp => {
      assert.isDefined(resp);
      return cw3.general.getHolidays(holiday, nextDay);
    }).then(resp => {
      let hasHoliday = resp.some(h => {
        let holidayDate = new Date(h.HolidayDate);
        return holidayDate.getTime() === holiday.getTime() && h.Description === description;
      });
      assert.isTrue(hasHoliday, `Holiday ${description} on ${holiday.toISOString()} was not returned by getHolidays`);
      return cw3.general.deleteHolidays([holiday]);
    }).then(() => {
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[General::deleteHolidays] function test', () => {
  it('should delete a holiday and remove it from holiday results', (done) => {
    let holiday = new Date();
    holiday.setHours(0, 0, 0, 0);
    holiday.setDate(holiday.getDate() + 366);
    let nextDay = new Date(holiday.getTime() + 24 * 60 * 60 * 1000);
    let description = `deleteHolidays test ${Date.now()}`;

    cw3.general.addHoliday(holiday, description).then(() => {
      return cw3.general.deleteHolidays([holiday]);
    }).then(resp => {
      assert.isDefined(resp);
      return cw3.general.getHolidays(holiday, nextDay);
    }).then(resp => {
      let hasHoliday = resp.some(h => {
        let holidayDate = new Date(h.HolidayDate);
        return holidayDate.getTime() === holiday.getTime() && h.Description === description;
      });
      assert.isFalse(hasHoliday, `Holiday ${description} on ${holiday.toISOString()} was still returned by getHolidays after deletion`);
      done();
    }).catch(e => {
      done(e);
    });
  });

  it('should delete multiple holidays in a single request', (done) => {
    let holiday1 = new Date();
    holiday1.setHours(0, 0, 0, 0);
    holiday1.setDate(holiday1.getDate() + 367);

    let holiday2 = new Date(holiday1.getTime() + 24 * 60 * 60 * 1000);
    let endDate = new Date(holiday2.getTime() + 24 * 60 * 60 * 1000);

    let description1 = `deleteHolidays multi test 1 ${Date.now()}`;
    let description2 = `deleteHolidays multi test 2 ${Date.now()}`;

    Promise.all([
      cw3.general.addHoliday(holiday1, description1),
      cw3.general.addHoliday(holiday2, description2)
    ]).then(() => {
      return cw3.general.deleteHolidays([holiday1, holiday2]);
    }).then(resp => {
      assert.isDefined(resp);
      return cw3.general.getHolidays(holiday1, endDate);
    }).then(resp => {
      let hasHoliday1 = resp.some(h => {
        let holidayDate = new Date(h.HolidayDate);
        return holidayDate.getTime() === holiday1.getTime() && h.Description === description1;
      });
      let hasHoliday2 = resp.some(h => {
        let holidayDate = new Date(h.HolidayDate);
        return holidayDate.getTime() === holiday2.getTime() && h.Description === description2;
      });

      assert.isFalse(hasHoliday1, `Holiday ${description1} on ${holiday1.toISOString()} was still returned by getHolidays after deletion`);
      assert.isFalse(hasHoliday2, `Holiday ${description2} on ${holiday2.toISOString()} was still returned by getHolidays after deletion`);
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[General::getActivityMetadataByIds] function test', () => {
  it('should resolve an activity based on the metadata ids');
});

describe('[General::getWOEntityCostSummary] function test', () => {
  it('should get an Entity\'s cost summary');
});

describe('[General::searchWOEntityCostSummary] function test', () => {
  it('should resolve reults of a search for cost summary of an entity');
});
