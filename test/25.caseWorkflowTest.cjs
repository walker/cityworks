'use strict';
// Mocked tests: no Cityworks instance is contacted.
var assert = require('chai').assert;
const cw25 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

describe('[CaseWorkflow (construct)] function test', () => {
  it('should be a defined object', () => {
    assert.isObject(cw25.briefcase.workflow, 'Briefcase.workflow is an object');
    assert.isObject(cw25.briefcase.workflow.task, 'Briefcase.workflow.task is an object');
  });

  it('should provide CaTask comments on workflow.task.comment', () => {
    assert.equal(cw25.briefcase.workflow.task.comment.currentActivityType, 'CaTask');
  });
});

describe('[CaseWorkflow] mocked function tests', () => {
  const mock = createMock(cw25.Cityworks);
  const wf = () => cw25.briefcase.workflow;
  const expectReject = async (promise) => {
    try {
      await promise;
    } catch (e) {
      return e;
    }
    assert.fail('should have rejected');
  };

  describe('get/search methods', () => {
    it('should call getTasksByCaseId (CheckRelatedItems defaults to false)', async () => {
      mock.on('Pll/CaseTask/ByCaObjectId', () => [{CaTaskId: 1}]);
      const r = await wf().getTasksByCaseId(100);
      assert.deepEqual(r, [{CaTaskId: 1}]);
      assert.deepEqual(mock.lastCall('Pll/CaseTask/ByCaObjectId').data, {CaObjectId: 100, CheckRelatedItems: false});
    });

    it('should pass CheckRelatedItems through on getTasksByCaseId', async () => {
      mock.on('Pll/CaseTask/ByCaObjectId', () => []);
      await wf().getTasksByCaseId(100, true);
      assert.deepEqual(mock.lastCall('Pll/CaseTask/ByCaObjectId').data, {CaObjectId: 100, CheckRelatedItems: true});
    });

    it('should call getTasksById', async () => {
      mock.on('Pll/CaseTask/ByIds', () => [{CaTaskId: 1}, {CaTaskId: 2}]);
      const r = await wf().getTasksById([1, 2]);
      assert.lengthOf(r, 2);
      assert.deepEqual(mock.lastCall('Pll/CaseTask/ByIds').data, {CaTaskIds: [1, 2], CheckRelatedItems: false});
    });

    it('should call getResultsByTaskId', async () => {
      mock.on('Pll/CaseTaskResults/ByCaTaskIds', () => [{CaTaskId: 1, ResultCode: 'OK'}]);
      const r = await wf().getResultsByTaskId([1]);
      assert.deepEqual(r, [{CaTaskId: 1, ResultCode: 'OK'}]);
      assert.deepEqual(mock.lastCall('Pll/CaseTaskResults/ByCaTaskIds').data, {CaTaskIds: [1]});
    });

    it('should call getCommentsForTask', async () => {
      mock.on('Pll/CaseTaskComments/ByCaTaskId', () => [{CommentText: 'hi'}]);
      const r = await wf().getCommentsForTask(1);
      assert.deepEqual(r, [{CommentText: 'hi'}]);
      assert.deepEqual(mock.lastCall('Pll/CaseTaskComments/ByCaTaskId').data, {caTaskId: 1});
    });

    it('should call getCommentsForTasks', async () => {
      mock.on('Pll/CaseTaskComments/ByCaTaskIds', () => [{CommentText: 'hi'}]);
      const r = await wf().getCommentsForTasks([1, 2]);
      assert.deepEqual(r, [{CommentText: 'hi'}]);
      assert.deepEqual(mock.lastCall('Pll/CaseTaskComments/ByCaTaskIds').data, {caTaskIds: [1, 2]});
    });

    it('should reject searchForTasks (code 1) when no filters are provided', async () => {
      mock.on('Pll/CaseTask/Search', () => []);
      const e = await expectReject(wf().searchForTasks({}));
      assert.equal(e.Code, 1);
      assert.deepEqual(mock.paths(), []);
    });

    it('should reject searchForTasks when filters are missing entirely', async () => {
      mock.on('Pll/CaseTask/Search', () => []);
      const e = await expectReject(wf().searchForTasks());
      assert.equal(e.Code, 1);
    });

    it('should call searchForTasks with a supported filter', async () => {
      mock.on('Pll/CaseTask/Search', () => [1, 2]);
      const r = await wf().searchForTasks({TaskComplete: false, ResponsibleUserId: 4});
      assert.deepEqual(r, [1, 2]);
      assert.deepEqual(mock.lastCall('Pll/CaseTask/Search').data, {TaskComplete: false, ResponsibleUserId: 4});
    });

    it('should call searchForTaskResults', async () => {
      mock.on('Pll/CaseTaskResults/Search', () => [1]);
      const r = await wf().searchForTaskResults({CaTaskId: 1});
      assert.deepEqual(r, [1]);
      assert.deepEqual(mock.lastCall('Pll/CaseTaskResults/Search').data, {CaTaskId: 1});
    });

    it('should propagate API errors', async () => {
      mock.onError('Pll/CaseTask/ByCaObjectId', {Message: 'boom'});
      const e = await expectReject(wf().getTasksByCaseId(100));
      assert.equal(e.Message, 'boom');
    });
  });

  describe('mutator methods', () => {
    it('should call addTask', async () => {
      mock.on('Pll/CaseTask/Add', (data) => Object.assign({CaTaskId: 9}, data));
      const r = await wf().addTask(100, 1, 0, 2);
      assert.equal(r.CaTaskId, 9);
      assert.deepEqual(mock.lastCall('Pll/CaseTask/Add').data, {CaObjectId: 100, TaskId: 1, StartPoint: 0, EndPoint: 2});
    });

    it('should merge options on addTask', async () => {
      mock.on('Pll/CaseTask/Add', () => ({}));
      await wf().addTask(100, 1, 0, 2, {TaskComment: 'x'});
      assert.deepEqual(mock.lastCall('Pll/CaseTask/Add').data, {CaObjectId: 100, TaskId: 1, StartPoint: 0, EndPoint: 2, TaskComment: 'x'});
    });

    it('should call addTaskResult', async () => {
      mock.on('Pll/CaseTaskResults/Add', () => ({CaTaskResultId: 5}));
      const r = await wf().addTaskResult(100, 1, 7, 8, 9, {Comment: 'c'});
      assert.deepEqual(r, {CaTaskResultId: 5});
      assert.deepEqual(mock.lastCall('Pll/CaseTaskResults/Add').data, {CaObjectId: 100, CaTaskId: 1, ResultCode: 7, ResultID: 8, ResultSetID: 9, Comment: 'c'});
    });

    it('should call addTaskComment', async () => {
      mock.on('Pll/CaseTaskComments/Add', () => ({CaTaskCommentId: 3}));
      const r = await wf().addTaskComment(1, 'workflow test comment');
      assert.deepEqual(r, {CaTaskCommentId: 3});
      assert.deepEqual(mock.lastCall('Pll/CaseTaskComments/Add').data, {CaTaskId: 1, CommentText: 'workflow test comment'});
    });

    it('should call updateTask', async () => {
      mock.on('Pll/CaseTask/Update', (data) => data);
      const r = await wf().updateTask(1, {TaskComment: 'updated from test'});
      assert.deepEqual(r, {CaTaskId: 1, TaskComment: 'updated from test'});
      assert.deepEqual(mock.lastCall('Pll/CaseTask/Update').data, {CaTaskId: 1, TaskComment: 'updated from test'});
    });

    it('should call updateTask without options', async () => {
      mock.on('Pll/CaseTask/Update', () => ({}));
      await wf().updateTask(1);
      assert.deepEqual(mock.lastCall('Pll/CaseTask/Update').data, {CaTaskId: 1});
    });

    it('should call updateTaskComment with and without a CommentId', async () => {
      mock.on('Pll/CaseTaskComments/Update', () => ({}));
      await wf().updateTaskComment(3, 'edited');
      assert.deepEqual(mock.lastCall('Pll/CaseTaskComments/Update').data, {CaTaskCommentId: 3, CommentText: 'edited'});
      await wf().updateTaskComment(3, 'edited', 12);
      assert.deepEqual(mock.lastCall('Pll/CaseTaskComments/Update').data, {CaTaskCommentId: 3, CommentText: 'edited', CommentId: 12});
    });

    it('should reject setTaskResult (code 2) without TaskCompleteDate or TaskCompletedBy', async () => {
      mock.on('Pll/CaseTask/SetResult', () => ({}));
      const e = await expectReject(wf().setTaskResult(1, 'TEST', {}));
      assert.equal(e.Code, 2);
      const e2 = await expectReject(wf().setTaskResult(1, 'TEST'));
      assert.equal(e2.Code, 2);
      assert.deepEqual(mock.paths(), []);
    });

    it('should call setTaskResult with TaskCompletedBy', async () => {
      mock.on('Pll/CaseTask/SetResult', (data) => data);
      const r = await wf().setTaskResult(1, 'TEST', {TaskCompletedBy: 1});
      assert.deepEqual(r, {CaTaskId: 1, ResultCode: 'TEST', TaskCompletedBy: 1});
      assert.deepEqual(mock.lastCall('Pll/CaseTask/SetResult').data, {CaTaskId: 1, ResultCode: 'TEST', TaskCompletedBy: 1});
    });

    it('should call setTaskResult with TaskCompleteDate', async () => {
      mock.on('Pll/CaseTask/SetResult', () => ({}));
      await wf().setTaskResult(1, 'TEST', {TaskCompleteDate: '2024-01-01T00:00:00'});
      assert.deepEqual(mock.lastCall('Pll/CaseTask/SetResult').data, {CaTaskId: 1, ResultCode: 'TEST', TaskCompleteDate: '2024-01-01T00:00:00'});
    });

    it('should call deleteTask', async () => {
      mock.on('Pll/CaseTask/Delete', () => undefined);
      const r = await wf().deleteTask(1);
      assert.isUndefined(r);
      assert.deepEqual(mock.lastCall('Pll/CaseTask/Delete').data, {CaTaskId: 1});
    });

    it('should call deleteTasksOnCase', async () => {
      mock.on('Pll/CaseTask/DeleteByCaObjectId', () => undefined);
      await wf().deleteTasksOnCase(100);
      assert.deepEqual(mock.lastCall('Pll/CaseTask/DeleteByCaObjectId').data, {CaObjectId: 100});
    });

    it('should call deleteTaskComments', async () => {
      mock.on('Pll/CaseTaskComments/Delete', () => undefined);
      await wf().deleteTaskComments([1, 2]);
      assert.deepEqual(mock.lastCall('Pll/CaseTaskComments/Delete').data, {CaTaskCommentIds: [1, 2]});
    });

    it('should propagate API errors', async () => {
      mock.onError('Pll/CaseTask/Delete', {Message: 'denied'});
      const e = await expectReject(wf().deleteTask(1));
      assert.equal(e.Message, 'denied');
      mock.onError('Pll/CaseTask/Add', {Message: 'bad'});
      const e2 = await expectReject(wf().addTask(100, 1, 0, 0));
      assert.equal(e2.Message, 'bad');
    });
  });

  describe('task attachments', () => {
    it('should call getTaskAttachments', async () => {
      mock.on('Pll/CaseRelDocs/ByCaTaskId', () => [{CaRelDocId: 1}]);
      const r = await wf().getTaskAttachments(1);
      assert.deepEqual(r, [{CaRelDocId: 1}]);
      assert.deepEqual(mock.lastCall('Pll/CaseRelDocs/ByCaTaskId').data, {CaTaskId: 1});
    });

    it('should call addTaskAttachment passing the file through', async () => {
      mock.on('Pll/CaseRelDocs/AddTaskRelDoc', () => ({CaRelDocId: 2}));
      const r = await wf().addTaskAttachment(1, 100, 'test.pdf', 'uploads/test.pdf');
      assert.deepEqual(r, {CaRelDocId: 2});
      const c = mock.lastCall('Pll/CaseRelDocs/AddTaskRelDoc');
      assert.deepEqual(c.data, {CaObjectId: 100, CaTaskId: 1, DocName: 'test.pdf'});
      assert.equal(c.file, 'uploads/test.pdf');
    });

    it('should include LocationType on addTaskAttachment when provided', async () => {
      mock.on('Pll/CaseRelDocs/AddTaskRelDoc', () => ({}));
      await wf().addTaskAttachment(1, 100, 'test.pdf', 'uploads/test.pdf', 'Local');
      assert.deepEqual(mock.lastCall('Pll/CaseRelDocs/AddTaskRelDoc').data, {CaObjectId: 100, CaTaskId: 1, DocName: 'test.pdf', LocationType: 'Local'});
    });

    it('should call deleteTaskAttachment', async () => {
      mock.on('Pll/CaseRelDocs/Delete', () => undefined);
      await wf().deleteTaskAttachment(2);
      assert.deepEqual(mock.lastCall('Pll/CaseRelDocs/Delete').data, {CaRelDocId: 2});
    });

    it('should propagate API errors', async () => {
      mock.onError('Pll/CaseRelDocs/ByCaTaskId', {Message: 'boom'});
      const e = await expectReject(wf().getTaskAttachments(1));
      assert.equal(e.Message, 'boom');
      mock.onError('Pll/CaseRelDocs/AddTaskRelDoc', {Message: 'upload failed'});
      const e2 = await expectReject(wf().addTaskAttachment(1, 100, 'x', 'f'));
      assert.equal(e2.Message, 'upload failed');
    });
  });

  describe('task comments (Comments helper)', () => {
    it('should add a comment with the CaTask activity type', async () => {
      mock.on('Ams/Comment/Add', () => ({CommentId: 1}));
      const r = await wf().task.comment.add(5, 'hello');
      assert.deepEqual(r, {CommentId: 1});
      assert.deepEqual(mock.lastCall('Ams/Comment/Add').data, {ActivityType: 3, ActivitySid: 5, Comments: 'hello'});
    });
  });
});
