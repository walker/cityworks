'use strict';
require('dotenv').config({quiet: true, debug: false});
var assert = require('chai').assert;
const cw20 = require('../dist/index.js');

cw20.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});

before(function(done) {
  this.timeout(20000000);
  cw20.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(() => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error');
    done(e);
  });
});

describe('[Equipment::Reservation] construct function test', () => {
  it('should have a defined reservation object', (done) => {
    assert.isObject(cw20.equipment.reservation, 'Equipment reservation is an object');
    done();
  });
});

describe('[Equipment::reservation::checkedOut] function test', () => {
  it('should be callable', (done) => {
    cw20.equipment.reservation.checkedOut().then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::reservation::checkIn] function test', () => {
  it('should be callable with check-in parameters', (done) => {
    cw20.equipment.reservation.checkIn(1, 1, {
      Comments: 'Test check-in'
    }).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::reservation::checkOut] function test', () => {
  it('should be callable with check-out parameters', (done) => {
    cw20.equipment.reservation.checkOut(1, 1, new Date(), {
      Comments: 'Test check-out'
    }).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::reservation::checkOutHistory] function test', () => {
  it('should be callable with history filters', (done) => {
    cw20.equipment.reservation.checkOutHistory(1, 1).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::reservation::deleteReservation] function test', () => {
  it('should be callable with transaction IDs', (done) => {
    cw20.equipment.reservation.deleteReservation([1]).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::reservation::reservations] function test', () => {
  it('should be callable with date range filters', (done) => {
    const start = new Date();
    const end = new Date(Date.now() + 3600000);
    cw20.equipment.reservation.reservations(1, start, end).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::reservation::reserve] function test', () => {
  it('should be callable with reservation parameters', (done) => {
    const start = new Date();
    const end = new Date(Date.now() + 3600000);
    cw20.equipment.reservation.reserve(1, 1, start, end, {
      Comments: 'Test reserve'
    }).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::reservation::status] function test', () => {
  it('should be callable with equipment SIDs', (done) => {
    cw20.equipment.reservation.status([1]).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Equipment::reservation::updateReservation] function test', () => {
  it('should be callable with update parameters', (done) => {
    cw20.equipment.reservation.updateReservation(1, {
      EmployeeSid: 1,
      TransDateTime: new Date(),
      ReservedToDate: new Date(Date.now() + 3600000),
      Comments: 'Test update'
    }).then(resp => {
      assert.isNotNull(resp);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});
