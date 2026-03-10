'use strict';
require('dotenv').config({quiet: true, debug: false});
var assert = require('chai').assert;
const cw16 = require('../dist/index.js');

cw16.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});

before(function(done) {
  this.timeout(20000000);
  cw16.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(() => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error');
    done(e);
  });
});

describe('[Employee (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw16.employee, 'Employee is an object');
    done();
  });
});

describe('[Employee::all] function test', () => {
  it('should return a list of only active employees by default', (done) => {
    cw16.employee.all().then(resp => {
      const withIsActive = resp.filter(e => Object.prototype.hasOwnProperty.call(e, 'IsActive'));
      assert.isAbove(withIsActive.length, 0, 'Expected at least one employee with an IsActive property');
      assert.isTrue(withIsActive.every(e => e.IsActive === true));
      done();
    }).catch(e => {
      done(e);
    });
  });

  it('should return a list including inactive employees', (done) => {
    cw16.employee.all(true).then(resp => {
      assert.isTrue(resp.some(e => e.IsActive === false));
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Employee::addEmployee] function test', () => {
  it('should create and return a new employee record', (done) => {
    var unique = Date.now().toString();
    var employee = {
      LastName: 'TestEmployee' + unique,
      FirstName: 'Test',
      LoginName: 'testemployee' + unique,
      Email: 'testemployee' + unique + '@example.com'
    };

    cw16.employee.add(employee).then(resp => {
      assert.property(resp, 'EmployeeSid');
      assert.equal(resp.LastName, employee.LastName);
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Employee::updateEmployee] function test', () => {
  it('should update and return the employee record', (done) => {
    var unique = Date.now().toString();
    var baseEmployee = {
      LastName: 'TestUpdate' + unique,
      FirstName: 'Initial',
      LoginName: 'testupdate' + unique,
      Email: 'testupdate' + unique + '@example.com'
    };

    cw16.employee.add(baseEmployee).then(created => {
      cw16.employee.update(created.EmployeeSid, {
        LastName: created.LastName,
        FirstName: 'Updated',
        LoginName: created.LoginName,
        Email: created.Email
      }).then(updated => {
        assert.equal(updated[0].FirstName, 'Updated');
        done();
      }).catch(e => {
        done(e);
      });
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Employee::addLicenses] function test', () => {
  it('should add licenses for valid employee IDs', (done) => {
    cw16.employee.all().then(list => {
      if (!Array.isArray(list) || list.length === 0 || !list[0].EmployeeSid) {
        done('No employee records available to test addLicenses');
        return;
      }

      return cw16.employee.addLicenses([list[0].EmployeeSid], []).then(resp => {
        assert.isNotNull(resp);
        done();
      });
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Employee::deleteLicenses] function test', () => {
  it('should delete licenses for valid employee IDs', (done) => {
    cw16.employee.all().then(list => {
      if (!Array.isArray(list) || list.length === 0 || !list[0].EmployeeSid) {
        done('No employee records available to test deleteLicenses');
        return;
      }

      return cw16.employee.deleteLicenses([list[0].EmployeeSid], []).then(resp => {
        assert.isNotNull(resp);
        done();
      });
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Employee::search] function test', () => {
  it('should find a user when one present that matches search parameters', (done) => {
    cw16.employee.search({"UniqueName": ["Hamilton, Walker"]}).then(resp => {
      assert.isNumber(resp[0]);
      done();
    }).catch(e => {
      done(e);
    });
  });
});
