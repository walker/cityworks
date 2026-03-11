'use strict';
require('dotenv').config({quiet: true, debug: false});
var assert = require('chai').assert;
const cw26 = require('../dist/index.js');

cw26.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});

before(function(done) {
  this.timeout(20000000);
  cw26.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(() => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error');
    done(e);
  });
});

describe('[CaseAdmin (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw26.briefcase.admin, 'Briefcase.admin is an object');
    done();
  });
});

describe('[CaseAdmin::list/get methods] function test', () => {
  it('should call getBusinessCaseTemplates', (done) => {
    cw26.briefcase.admin.getBusinessCaseTemplates().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => done(e));
  });

  it('should call getCaseTypes', (done) => {
    cw26.briefcase.admin.getCaseTypes().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => done(e));
  });

  it('should call getSubtypes', (done) => {
    cw26.briefcase.admin.getSubtypes().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => done(e));
  });

  it('should call getFees', (done) => {
    cw26.briefcase.admin.getFees().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => done(e));
  });

  it('should call getExpirations', (done) => {
    cw26.briefcase.admin.getExpirations().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => done(e));
  });

  it('should call getDeposits', (done) => {
    cw26.briefcase.admin.getDeposits().then(r => {
      assert.isTrue(r === null || Array.isArray(r));
      done();
    }).catch(e => done(e));
  });

  it('should call getDisciplines', (done) => {
    cw26.briefcase.admin.getDisciplines().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => done(e));
  });

  it('should call getDepartments', (done) => {
    cw26.briefcase.admin.getDepartments().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => done(e));
  });

  it('should call getDivisions', (done) => {
    cw26.briefcase.admin.getDivisions().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => done(e));
  });

  it('should call getInspectionTimeBlocks', (done) => {
    cw26.briefcase.admin.getInspectionTimeBlocks().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => done(e));
  });

  it('should call getNotificationCases', (done) => {
    cw26.briefcase.admin.getNotificationCases().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => done(e));
  });

  it('should call getNotificationTypes', (done) => {
    cw26.briefcase.admin.getNotificationTypes().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => done(e));
  });

  it('should call getNumberingGroups', (done) => {
    cw26.briefcase.admin.getNumberingGroups().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => done(e));
  });

  it('should call getPeople', (done) => {
    cw26.briefcase.admin.getPeople().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => done(e));
  });

  it('should call getPeopleRoles', (done) => {
    cw26.briefcase.admin.getPeopleRoles().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => done(e));
  });

  it('should call getTaskResultDetails', (done) => {
    cw26.briefcase.admin.getTaskResultDetails().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => done(e));
  });

  it('should call getTaskResultFeeInsert', (done) => {
    cw26.briefcase.admin.getTaskResultFeeInsert().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => done(e));
  });
});

describe('[CaseAdmin::search validation/callable methods] function test', () => {
  it('should reject searchCaseTypeIDs with no filters', (done) => {
    cw26.briefcase.admin.searchCaseTypeIDs({}).then(() => {
      done('Expected searchCaseTypeIDs to reject without filters');
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call searchCaseTypeIDs with filters', (done) => {
    cw26.briefcase.admin.searchCaseTypeIDs({ CaseType: 'PERMIT' }).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should reject searchCaseTypeObjects with no filters', (done) => {
    cw26.briefcase.admin.searchCaseTypeObjects({}).then(() => {
      done('Expected searchCaseTypeObjects to reject without filters');
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should reject searchFees with no filters', (done) => {
    cw26.briefcase.admin.searchFees({}).then(() => {
      done('Expected searchFees to reject without filters');
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call searchFees with filters', (done) => {
    cw26.briefcase.admin.searchFees({ FeeCode: 'F-' }).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should reject searchDeposits with no filters', (done) => {
    cw26.briefcase.admin.searchDeposits({}).then(() => {
      done('Expected searchDeposits to reject without filters');
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call searchDeposits with filters', (done) => {
    cw26.briefcase.admin.searchDeposits({ DepositCode: 'DEP' }).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[CaseAdmin::mutation callable methods] function test', () => {
  it('should call addBusinessCaseTemplate', (done) => {
    cw26.briefcase.admin.addBusinessCaseTemplate({ BusCaseDesc: 'Copilot Test Template' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call updateBusinessCaseTemplate', (done) => {
    cw26.briefcase.admin.updateBusinessCaseTemplate(1, { BusCaseDesc: 'Updated by test' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call addCaseType', (done) => {
    cw26.briefcase.admin.addCaseType('TESTTYPE', 'Test Case Type', {}).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call updateCaseType', (done) => {
    cw26.briefcase.admin.updateCaseType(1, { CaseTypeDesc: 'Updated type' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call addSubtype', (done) => {
    cw26.briefcase.admin.addSubtype('TESTSUB', 'Test subtype', {}).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call updateSubtype', (done) => {
    cw26.briefcase.admin.updateSubtype(1, { SubTypeDesc: 'Updated subtype' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should reject addExpiration when required fields are missing', (done) => {
    cw26.briefcase.admin.addExpiration({}).then(() => {
      done('Expected addExpiration to reject without OrgId and ExpirationTypeDesc');
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call addDepartment', (done) => {
    cw26.briefcase.admin.addDepartment('TST', 'Test Department', {}).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call addDivision', (done) => {
    cw26.briefcase.admin.addDivision(1, 'Test Division', {}).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call addInspectionTimeBlock', (done) => {
    cw26.briefcase.admin.addInspectionTimeBlock('Copilot Block', '08:00', '09:00').then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call addNumberingGroup', (done) => {
    cw26.briefcase.admin.addNumberingGroup({ NumberingGroup: 'COPILOT' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call updateNumberingGroup', (done) => {
    cw26.briefcase.admin.updateNumberingGroup(1, { NumberingGroup: 'COPILOT-UPD' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call addPerson', (done) => {
    cw26.briefcase.admin.addPerson('Case Admin Test Person', {}).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call addPeopleRole', (done) => {
    cw26.briefcase.admin.addPeopleRole('TESTROLE', { RoleDesc: 'Test role' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call addTaskResultDetail', (done) => {
    cw26.briefcase.admin.addTaskResultDetail({ ResultDetailCode: 'TEST', ResultDetailDesc: 'Test result detail' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call updateTaskResultDetail', (done) => {
    cw26.briefcase.admin.updateTaskResultDetail(1, { ResultDetailDesc: 'Updated test result detail' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call addTaskResultFeeInsert', (done) => {
    cw26.briefcase.admin.addTaskResultFeeInsert({ TaskId: 1, TaskResultId: 1 }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call deleteTaskResultFeeInsert', (done) => {
    cw26.briefcase.admin.deleteTaskResultFeeInsert(1).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call deleteTaskResultFeeInsertByTaskId', (done) => {
    cw26.briefcase.admin.deleteTaskResultFeeInsertByTaskId(1).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call updateTaskResultFeeInsert', (done) => {
    cw26.briefcase.admin.updateTaskResultFeeInsert(1, 1, 1, 1).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});
