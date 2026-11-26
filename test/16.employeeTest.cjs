'use strict';
// Mocked tests: no Cityworks instance is contacted.
const assert = require('chai').assert;
const cw16 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

describe('[Employee (construct)] function test', () => {
  it('should be a defined object', () => {
    assert.isObject(cw16.employee, 'Employee is an object');
  });
});

describe('[Employee] mocked request tests', () => {
  const mock = createMock(cw16.Cityworks);

  describe('[Employee::all] function test', () => {
    const employees = [
      {EmployeeSid: 1, LastName: 'Active', IsActive: true},
      {EmployeeSid: 2, LastName: 'Inactive', IsActive: false}
    ];

    beforeEach(() => {
      mock.on('Ams/Employee/All', (data) => employees.filter(e => data.IncludeInactive || e.IsActive));
    });

    it('should return a list of only active employees by default', async () => {
      const resp = await cw16.employee.all();
      assert.deepEqual(mock.lastCall('Ams/Employee/All').data, {IncludeInactive: false});
      assert.lengthOf(resp, 1);
      assert.isTrue(resp.every(e => e.IsActive === true));
    });

    it('should return a list including inactive employees', async () => {
      const resp = await cw16.employee.all(true);
      assert.deepEqual(mock.lastCall('Ams/Employee/All').data, {IncludeInactive: true});
      assert.isTrue(resp.some(e => e.IsActive === false));
    });

    it('should reject when the API fails', async () => {
      mock.onError('Ams/Employee/All', {Message: 'nope'});
      try {
        await cw16.employee.all();
        assert.fail('should have rejected');
      } catch (e) {
        assert.include(e.Message, 'nope');
      }
    });
  });

  describe('[Employee::addEmployee] function test', () => {
    it('should create and return a new employee record', async () => {
      mock.on('Ams/Employee/Add', (data) => Object.assign({EmployeeSid: 42}, data));
      const employee = {LastName: 'TestEmployee', FirstName: 'Test', LoginName: 'testemployee', Email: 'testemployee@example.com'};
      const resp = await cw16.employee.add(employee);
      assert.deepEqual(mock.lastCall('Ams/Employee/Add').data, employee);
      assert.equal(resp.EmployeeSid, 42);
      assert.equal(resp.LastName, employee.LastName);
    });
  });

  describe('[Employee::updateEmployee] function test', () => {
    beforeEach(() => {
      mock.on('Ams/Employee/Update', (data) => data.EmployeeSids.map(sid => Object.assign({EmployeeSid: sid}, data)));
    });

    it('should update and return the employee record, wrapping a single SID in an array', async () => {
      const updated = await cw16.employee.update(42, {LastName: 'TestUpdate', FirstName: 'Updated'});
      assert.deepEqual(mock.lastCall('Ams/Employee/Update').data, {EmployeeSids: [42], LastName: 'TestUpdate', FirstName: 'Updated'});
      assert.equal(updated[0].FirstName, 'Updated');
    });

    it('should accept multiple SIDs', async () => {
      const updated = await cw16.employee.update([1, 2], {LastName: 'Same'});
      assert.deepEqual(mock.lastCall('Ams/Employee/Update').data.EmployeeSids, [1, 2]);
      assert.lengthOf(updated, 2);
    });

    it('should strip EmployeeId and EmployeeSid from the properties so they cannot select employees', async () => {
      await cw16.employee.update(42, {LastName: 'X', EmployeeId: 'E-1', EmployeeSid: 99});
      assert.deepEqual(mock.lastCall('Ams/Employee/Update').data, {EmployeeSids: [42], LastName: 'X'});
    });
  });

  describe('[Employee] lookups', () => {
    it('should get custom data fields with and without field IDs', async () => {
      mock.on('Ams/Employee/CustomDataFields', [{CustFieldId: 'a'}]);
      assert.deepEqual(await cw16.employee.customDataFields(5), [{CustFieldId: 'a'}]);
      assert.deepEqual(mock.lastCall('Ams/Employee/CustomDataFields').data, {EmployeeSid: 5});
      await cw16.employee.customDataFields(5, ['a', 'b']);
      assert.deepEqual(mock.lastCall('Ams/Employee/CustomDataFields').data, {EmployeeSid: 5, CustFieldIds: ['a', 'b']});
    });

    it('should get employees by group', async () => {
      mock.on('Ams/Employee/ByGroup', [{EmployeeSid: 1}]);
      assert.deepEqual(await cw16.employee.byGroup(3), [{EmployeeSid: 1}]);
      assert.deepEqual(mock.lastCall('Ams/Employee/ByGroup').data, {GroupId: 3, IncludeInactive: false});
      await cw16.employee.byGroup(3, true);
      assert.deepEqual(mock.lastCall('Ams/Employee/ByGroup').data, {GroupId: 3, IncludeInactive: true});
    });

    it('should get employees by IDs and resolve only the first row from getById', async () => {
      mock.on('Ams/Employee/ByIds', (data) => data.EmployeeSids.map(sid => ({EmployeeSid: sid})));
      assert.deepEqual(await cw16.employee.getByIds([1, 2]), [{EmployeeSid: 1}, {EmployeeSid: 2}]);
      assert.deepEqual(await cw16.employee.getById(7), {EmployeeSid: 7});
      assert.deepEqual(mock.lastCall('Ams/Employee/ByIds').data, {EmployeeSids: [7]});
    });

    it('should propagate errors from getById', async () => {
      mock.onError('Ams/Employee/ByIds', {Message: 'missing'});
      try {
        await cw16.employee.getById(7);
        assert.fail('should have rejected');
      } catch (e) {
        assert.include(e.Message, 'missing');
      }
    });

    it('should get groups by employee SIDs', async () => {
      mock.on('Ams/Employee/Groups', [{GroupId: 1}]);
      assert.deepEqual(await cw16.employee.getGroupsByEmployeeSid([1]), [{GroupId: 1}]);
      assert.deepEqual(mock.lastCall('Ams/Employee/Groups').data, {EmployeeSids: [1]});
    });

    it('should check names for uniqueness', async () => {
      mock.on('Ams/Employee/NamesAreUnique', [{Name: 'a', IsUnique: true}]);
      await cw16.employee.checkNames(['a']);
      assert.deepEqual(mock.lastCall('Ams/Employee/NamesAreUnique').data, {Names: ['a']});
    });

    it('should delete employees by SID', async () => {
      mock.on('Ams/Employee/Delete', true);
      assert.isTrue(await cw16.employee.delete([1, 2]));
      assert.deepEqual(mock.lastCall('Ams/Employee/Delete').data, {EmployeeSids: [1, 2]});
    });
  });

  describe('[Employee::addLicenses] function test', () => {
    it('should add licenses for valid employee IDs', async () => {
      mock.on('Ams/Employee/AddLicensedItems', []);
      const resp = await cw16.employee.addLicenses([1], ['LIC1']);
      assert.deepEqual(mock.lastCall('Ams/Employee/AddLicensedItems').data, {EmployeeIds: [1], LicenseCodes: ['LIC1']});
      assert.isNotNull(resp);
    });

    it('should propagate API errors', async () => {
      mock.onError('Ams/Employee/AddLicensedItems', {Message: 'bad license'});
      try {
        await cw16.employee.addLicenses([1], ['BAD']);
        assert.fail('should have rejected');
      } catch (e) {
        assert.include(e.Message, 'bad license');
      }
    });
  });

  describe('[Employee::deleteLicenses] function test', () => {
    it('should delete licenses for valid employee IDs', async () => {
      mock.on('Ams/Employee/DeleteLicensedItems', []);
      const resp = await cw16.employee.deleteLicenses([1], ['LIC1']);
      assert.deepEqual(mock.lastCall('Ams/Employee/DeleteLicensedItems').data, {EmployeeIds: [1], LicenseCodes: ['LIC1']});
      assert.isNotNull(resp);
    });
  });

  describe('[Employee::search] function test', () => {
    it('should find a user when one present that matches search parameters', async () => {
      mock.on('Ams/Employee/Search', [101]);
      const resp = await cw16.employee.search({UniqueName: ['Doe, Jane']});
      assert.deepEqual(mock.lastCall('Ams/Employee/Search').data, {IsActive: true, MaxResults: 20, UniqueName: ['Doe, Jane']});
      assert.isNumber(resp[0]);
    });

    it('should honor the active and maxResults arguments', async () => {
      mock.on('Ams/Employee/Search', []);
      await cw16.employee.search({Email: ['jane@example.com']}, false, 5);
      assert.deepEqual(mock.lastCall('Ams/Employee/Search').data, {IsActive: false, MaxResults: 5, Email: ['jane@example.com']});
    });
  });
});
