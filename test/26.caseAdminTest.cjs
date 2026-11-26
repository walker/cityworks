'use strict';
// Mocked tests: no Cityworks instance is contacted.
var assert = require('chai').assert;
const cw26 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

async function rejection(promise) {
  try {
    await promise;
  } catch (e) {
    return e;
  }
  assert.fail('should have rejected');
}

describe('[CaseAdmin (construct)] function test', () => {
  it('should be a defined object', () => {
    assert.isObject(cw26.briefcase.admin, 'Briefcase.admin is an object');
  });
});

describe('[CaseAdmin::list/get methods] function test', () => {
  const mock = createMock(cw26.Cityworks);

  const getters = [
    ['getBusinessCaseTemplates', 'Pll/BusinessCase/GetList'],
    ['getCaseTypes', 'Pll/CaseType/GetList'],
    ['getSubtypes', 'Pll/SubType/GetList'],
    ['getFees', 'Pll/FeeSetup/All'],
    ['getExpirations', 'Pll/ExpirationType/GetList'],
    ['getDeposits', 'Pll/Deposit/All'],
    ['getDisciplines', 'Pll/Discipline/All'],
    ['getDepartments', 'Pll/Department/GetList'],
    ['getDivisions', 'Pll/Division/GetList'],
    ['getInspectionTimeBlocks', 'Pll/InspectionTimeBlock/GetList'],
    ['getNotificationCases', 'Pll/NotificationCase/GetNotificationCaseList'],
    ['getNotificationTypes', 'Pll/NotificationType/GetNotificationTypeList'],
    ['getNumberingGroups', 'Pll/NumberingGroup/GetList'],
    ['getPeople', 'Pll/People/GetList'],
    ['getPeopleRoles', 'Pll/PeopleRole/GetList'],
    ['getTaskResultDetails', 'Pll/TaskResultDetail/GetList'],
    ['getTaskResultFeeInsert', 'Pll/TaskResultFeeInsert/GetList']
  ];

  getters.forEach(([method, path]) => {
    it('should call ' + method + ' with an empty payload and resolve the Value', async () => {
      const items = [{Id: 1, Name: 'Dummy A'}, {Id: 2, Name: 'Dummy B'}];
      mock.on(path, items);
      const r = await cw26.briefcase.admin[method]();
      assert.deepEqual(r, items);
      assert.deepEqual(mock.paths(), [path]);
      assert.deepEqual(mock.lastCall(path).data, {});
    });

    it('should propagate ' + method + ' errors', async () => {
      mock.onError(path, {Message: 'Dummy failure'});
      const e = await rejection(cw26.briefcase.admin[method]());
      assert.equal(e.Message, 'Dummy failure');
    });
  });

  it('should allow getDeposits to resolve null', async () => {
    mock.on('Pll/Deposit/All', null);
    assert.isNull(await cw26.briefcase.admin.getDeposits());
  });
});

describe('[CaseAdmin::search validation/callable methods] function test', () => {
  const mock = createMock(cw26.Cityworks);

  const searches = [
    ['searchCaseTypeIDs', 'Pll/CaseType/Search', 2, {CaseType: 'PERMIT'}],
    ['searchCaseTypeObjects', 'Pll/CaseType/SearchObject', 3, {CaseTypeId: 4}],
    ['searchFees', 'Pll/FeeSetup/Search', 4, {FeeCode: 'F-'}],
    ['searchDeposits', 'Pll/Deposit/Search', 4, {DepositCode: 'DEP'}]
  ];

  searches.forEach(([method, path, code, filters]) => {
    it('should reject ' + method + ' with no valid filters', async () => {
      mock.on(path, []);
      for (const bad of [{}, {Unrelated: 1}]) {
        const e = await rejection(cw26.briefcase.admin[method](bad));
        assert.equal(e.Code, code);
        assert.match(e.Message, /At least one of the attributes/);
      }
      assert.deepEqual(mock.paths(), []);
    });

    it('should call ' + method + ' with filters and resolve the Value', async () => {
      mock.on(path, [11, 12]);
      const r = await cw26.briefcase.admin[method](filters);
      assert.deepEqual(r, [11, 12]);
      assert.deepEqual(mock.paths(), [path]);
      assert.deepEqual(mock.lastCall(path).data, filters);
    });

    it('should propagate ' + method + ' errors', async () => {
      mock.onError(path, {Message: 'Dummy failure'});
      const e = await rejection(cw26.briefcase.admin[method](filters));
      assert.equal(e.Message, 'Dummy failure');
    });
  });

  it('should accept any one of the documented filters', async () => {
    mock.on('Pll/FeeSetup/Search', []);
    mock.on('Pll/Deposit/Search', []);
    for (const f of ['AccountCode', 'FeeCode', 'FeeDesc', 'FeeSetupId', 'FeeTypeId']) {
      await cw26.briefcase.admin.searchFees({[f]: 1});
    }
    for (const f of ['AccountCode', 'DepositCode', 'DepositDesc', 'DepositId', 'DepositTypeId']) {
      await cw26.briefcase.admin.searchDeposits({[f]: 1});
    }
    assert.lengthOf(mock.callsTo('Pll/FeeSetup/Search'), 5);
    assert.lengthOf(mock.callsTo('Pll/Deposit/Search'), 5);
  });
});

describe('[CaseAdmin::mutation callable methods] function test', () => {
  const mock = createMock(cw26.Cityworks);
  const admin = cw26.briefcase.admin;

  // [name, path, args, expected payload]
  const cases = [
    ['addBusinessCaseTemplate', 'Pll/BusinessCase/Add', [{BusCaseDesc: 'Dummy Template'}], {BusCaseDesc: 'Dummy Template'}],
    ['updateBusinessCaseTemplate', 'Pll/BusinessCase/Update', [1, {BusCaseDesc: 'Updated'}], {BusCaseId: 1, BusCaseDesc: 'Updated'}],
    ['addCaseType', 'Pll/CaseType/Add', ['TESTTYPE', 'Test Case Type', {Extra: 'x'}], {CaseType: 'TESTTYPE', CaseTypeDesciption: 'Test Case Type', Extra: 'x'}],
    ['updateCaseType', 'Pll/CaseType/Update', [1, {CaseTypeDesc: 'Updated type'}], {CaseTypeId: 1, CaseTypeDesc: 'Updated type'}],
    ['addSubtype', 'Pll/SubType/Add', ['TESTSUB', 'Test subtype', {Extra: 'x'}], {SubType: 'TESTSUB', SubTypeDesc: 'Test subtype', Extra: 'x'}],
    ['updateSubtype', 'Pll/SubType/Update', [1, {SubTypeDesc: 'Updated subtype'}], {SubTypeId: 1, SubTypeDesc: 'Updated subtype'}],
    ['addExpiration', 'Pll/ExpirationType/Add', [{OrgId: 1, ExpirationTypeDesc: 'Dummy'}], {OrgId: 1, ExpirationTypeDesc: 'Dummy'}],
    ['addDepartment', 'Pll/Department/Add', ['TST', 'Test Department', {Extra: 'x'}], {DepartmentCode: 'TST', DepartmentName: 'Test Department', Extra: 'x'}],
    ['addDivision', 'Pll/Division/Add', [1, 'Test Division', {Extra: 'x'}], {DepartmentId: 1, DivisionName: 'Test Division', Extra: 'x'}],
    ['addInspectionTimeBlock', 'Pll/InspectionTimeBlock/Add', ['Dummy Block', '08:00', '09:00'], {LabelText: 'Dummy Block', StartTime: '08:00', EndTime: '09:00'}],
    ['addInspectionTimeBlock', 'Pll/InspectionTimeBlock/Add', ['Dummy Block', '08:00', '09:00', [{Day: 1}]], {LabelText: 'Dummy Block', StartTime: '08:00', EndTime: '09:00', InspTimeBlocksDetails: [{Day: 1}]}],
    ['addNumberingGroup', 'Pll/NumberingGroup/Add', [{NumberingGroup: 'DUMMY'}], {NumberingGroup: 'DUMMY'}],
    ['updateNumberingGroup', 'Pll/NumberingGroup/Update', [1, {NumberingGroup: 'DUMMY-UPD'}], {NumberingGroupId: 1, NumberingGroup: 'DUMMY-UPD'}],
    ['addPerson', 'Pll/People/Add', ['Dummy Person', {Email: 'a@example.com'}], {Name: 'Dummy Person', Email: 'a@example.com'}],
    ['addPeopleRole', 'Pll/PeopleRole/Add', ['TESTROLE', {RoleDesc: 'Test role'}], {RoleCode: 'TESTROLE', RoleDesc: 'Test role'}],
    ['addTaskResultDetail', 'Pll/TaskResultDetail/Add', [{ResultDetailCode: 'TEST', ResultDetailDesc: 'Dummy'}], {ResultDetailCode: 'TEST', ResultDetailDesc: 'Dummy'}],
    ['updateTaskResultDetail', 'Pll/TaskResultDetail/Update', [1, {ResultDetailDesc: 'Updated'}], {ResultDetailId: 1, ResultDetailDesc: 'Updated'}],
    ['addTaskResultFeeInsert', 'Pll/TaskResultFeeInsert/Add', [{TaskId: 1, TaskResultId: 2}], {TaskId: 1, TaskResultId: 2}],
    ['deleteTaskResultFeeInsert', 'Pll/TaskResultFeeInsert/Delete', [3], {TaskResultFeeInsertId: 3}],
    ['deleteTaskResultFeeInsertByTaskId', 'Pll/TaskResultFeeInsert/DeleteByTaskId', [4], {TaskId: 4}],
    ['updateTaskResultFeeInsert', 'Pll/TaskResultFeeInsert/Update', [1, 2, 3], {TaskResultFeeInsertId: 1, TaskId: 2, TaskResultId: 3}],
    ['updateTaskResultFeeInsert', 'Pll/TaskResultFeeInsert/Update', [1, 2, 3, 4], {TaskResultFeeInsertId: 1, TaskId: 2, TaskResultId: 3, FeeSetupId: 4}]
  ];

  cases.forEach(([method, path, args, payload], i) => {
    it('should call ' + method + ' (#' + i + ') with the expected payload and resolve the Value', async () => {
      mock.on(path, {Result: 'dummy-' + method});
      const r = await admin[method](...args);
      assert.deepEqual(r, {Result: 'dummy-' + method});
      assert.deepEqual(mock.paths(), [path]);
      assert.deepEqual(mock.lastCall(path).data, payload);
    });

    it('should propagate ' + method + ' (#' + i + ') errors', async () => {
      mock.onError(path, {Message: 'Dummy failure'});
      const e = await rejection(admin[method](...args));
      assert.equal(e.Message, 'Dummy failure');
    });
  });

  it('should resolve the numeric ID returned by the delete methods', async () => {
    mock.on('Pll/TaskResultFeeInsert/Delete', 3);
    mock.on('Pll/TaskResultFeeInsert/DeleteByTaskId', 4);
    assert.equal(await admin.deleteTaskResultFeeInsert(3), 3);
    assert.equal(await admin.deleteTaskResultFeeInsertByTaskId(4), 4);
  });

  it('should reject addExpiration when required fields are missing', async () => {
    mock.on('Pll/ExpirationType/Add', {});
    for (const bad of [{}, {OrgId: 1}, {ExpirationTypeDesc: 'Dummy'}]) {
      const e = await rejection(admin.addExpiration(bad));
      assert.equal(e.Code, 5);
      assert.equal(e.Message, 'OrgId and ExpirationTypeDesc must both be defined.');
    }
  });
});
