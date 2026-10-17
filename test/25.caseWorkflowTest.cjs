'use strict';
require('dotenv').config({quiet: true, debug: false});
var assert = require('chai').assert;
const cw25 = require('../dist/index.js');

cw25.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});

before(function(done) {
  this.timeout(20000000);
  cw25.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(() => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error');
    done(e);
  });
});

describe('[CaseWorkflow (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw25.briefcase.workflow, 'Briefcase.workflow is an object');
    assert.isObject(cw25.briefcase.workflow.task, 'Briefcase.workflow.task is an object');
    done();
  });
});

describe('[CaseWorkflow::get/search methods] function test', () => {
  it('should call getTasksByCaseId', (done) => {
    cw25.briefcase.workflow.getTasksByCaseId(107138).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      done(e);
    });
  });

  it('should call getTasksById', (done) => {
    cw25.briefcase.workflow.getTasksById([1]).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call getResultsByTaskId', (done) => {
    cw25.briefcase.workflow.getResultsByTaskId([1]).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call getCommentsForTask', (done) => {
    cw25.briefcase.workflow.getCommentsForTask(1).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call getCommentsForTasks', (done) => {
    cw25.briefcase.workflow.getCommentsForTasks([1]).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should reject searchForTasks when no filters are provided', (done) => {
    cw25.briefcase.workflow.searchForTasks({}).then(() => {
      done('Expected searchForTasks to reject with no filters');
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call searchForTaskResults', (done) => {
    cw25.briefcase.workflow.searchForTaskResults({ CaTaskId: 1 }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[CaseWorkflow::mutator methods] function test', () => {
  it('should call addTask', (done) => {
    cw25.briefcase.workflow.addTask(107138, 1, 0, 0).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call addTaskResult', (done) => {
    cw25.briefcase.workflow.addTaskResult(107138, 1, 1, 1, 1).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call addTaskComment', (done) => {
    cw25.briefcase.workflow.addTaskComment(1, 'workflow test comment').then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call updateTask', (done) => {
    cw25.briefcase.workflow.updateTask(1, { TaskComment: 'updated from test' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should reject setTaskResult without TaskCompleteDate or TaskCompletedBy', (done) => {
    cw25.briefcase.workflow.setTaskResult(1, 'TEST', {}).then(() => {
      done('Expected setTaskResult to reject without completion options');
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call setTaskResult with TaskCompletedBy', (done) => {
    cw25.briefcase.workflow.setTaskResult(1, 'TEST', { TaskCompletedBy: 1 }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call deleteTask', (done) => {
    cw25.briefcase.workflow.deleteTask(1).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call deleteTasksOnCase', (done) => {
    cw25.briefcase.workflow.deleteTasksOnCase(107138).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call deleteTaskComments', (done) => {
    cw25.briefcase.workflow.deleteTaskComments([1]).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call getTaskAttachments', (done) => {
    cw25.briefcase.workflow.getTaskAttachments(1).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

});
