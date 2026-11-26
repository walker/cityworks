'use strict';
// Mocked tests: no Cityworks instance is contacted.
const assert = require('chai').assert;
const cw14 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

describe('[CaseWorkflow] mocked function tests', () => {
  const mock = createMock(cw14.Cityworks);
  const wf = () => cw14.briefcase.workflow;

  describe('[CaseWorkflow::setTaskResult] function test', () => {
    it('set a task result', async () => {
      mock.on('Pll/CaseTask/SetResult', (data) => ({CaTaskId: data.CaTaskId, ResultCode: data.ResultCode}));
      const r = await wf().setTaskResult(171018, 'TestTask', {TaskCompletedBy: 1});
      assert.deepEqual(r, {CaTaskId: 171018, ResultCode: 'TestTask'});
      assert.deepEqual(mock.lastCall('Pll/CaseTask/SetResult').data, {CaTaskId: 171018, ResultCode: 'TestTask', TaskCompletedBy: 1});
    });

    it('should accept TaskCompleteDate as the only option', async () => {
      mock.on('Pll/CaseTask/SetResult', () => ({}));
      await wf().setTaskResult(1, 'DONE', {TaskCompleteDate: '2027-02-01'});
      assert.equal(mock.lastCall('Pll/CaseTask/SetResult').data.TaskCompleteDate, '2027-02-01');
    });

    it('should reject with CWError 2 when neither TaskCompletedBy nor TaskCompleteDate is provided', async () => {
      mock.on('Pll/CaseTask/SetResult', () => ({}));
      let err;
      try { await wf().setTaskResult(1, 'DONE'); } catch(e) { err = e; }
      assert.equal(err.Code, 2);
      assert.include(err.Message, 'TaskCompletedBy');
    });

    it('should propagate API errors', async () => {
      mock.onError('Pll/CaseTask/SetResult', {Message: 'bad result'});
      let err;
      try { await wf().setTaskResult(1, 'DONE', {TaskCompletedBy: 1}); } catch(e) { err = e; }
      assert.equal(err.Message, 'bad result');
    });
  });

  describe('[CaseWorkflow] request pass-through tests', () => {
    it('addTask sends the required fields merged with options', async () => {
      mock.on('Pll/CaseTask/Add', (d) => d);
      const r = await wf().addTask(10, 20, 1, 2, {Notes: 'n'});
      assert.deepEqual(r, {CaObjectId: 10, TaskId: 20, StartPoint: 1, EndPoint: 2, Notes: 'n'});
    });

    it('addTaskResult sends the required fields', async () => {
      mock.on('Pll/CaseTaskResults/Add', () => ({CaTaskResultId: 1}));
      const r = await wf().addTaskResult(10, 20, 3, 4, 5, {Notes: 'n'});
      assert.deepEqual(r, {CaTaskResultId: 1});
      assert.deepEqual(mock.lastCall('Pll/CaseTaskResults/Add').data, {CaObjectId: 10, CaTaskId: 20, ResultCode: 3, ResultID: 4, ResultSetID: 5, Notes: 'n'});
    });

    it('getTasksByCaseId and getTasksById default CheckRelatedItems to false', async () => {
      mock.on('Pll/CaseTask/ByCaObjectId', () => [{CaTaskId: 1}]);
      mock.on('Pll/CaseTask/ByIds', () => [{CaTaskId: 1}, {CaTaskId: 2}]);
      assert.deepEqual(await wf().getTasksByCaseId(10), [{CaTaskId: 1}]);
      assert.deepEqual(mock.lastCall('Pll/CaseTask/ByCaObjectId').data, {CaObjectId: 10, CheckRelatedItems: false});
      assert.lengthOf(await wf().getTasksById([1, 2], true), 2);
      assert.deepEqual(mock.lastCall('Pll/CaseTask/ByIds').data, {CaTaskIds: [1, 2], CheckRelatedItems: true});
    });

    it('updateTask, deleteTask and deleteTasksOnCase send the expected payloads', async () => {
      mock.on('Pll/CaseTask/Update', (d) => d);
      mock.on('Pll/CaseTask/Delete', () => ({CaTaskId: 5}));
      mock.on('Pll/CaseTask/DeleteByCaObjectId', () => 10);
      assert.deepEqual(await wf().updateTask(5, {Notes: 'n'}), {CaTaskId: 5, Notes: 'n'});
      assert.deepEqual(await wf().deleteTask(5), {CaTaskId: 5});
      assert.deepEqual(mock.lastCall('Pll/CaseTask/Delete').data, {CaTaskId: 5});
      assert.strictEqual(await wf().deleteTasksOnCase(10), 10);
      assert.deepEqual(mock.lastCall('Pll/CaseTask/DeleteByCaObjectId').data, {CaObjectId: 10});
    });

    it('task comment methods send the expected payloads', async () => {
      mock.on('Pll/CaseTaskComments/Add', (d) => d);
      mock.on('Pll/CaseTaskComments/Update', (d) => d);
      mock.on('Pll/CaseTaskComments/ByCaTaskId', () => [{CommentText: 'a'}]);
      mock.on('Pll/CaseTaskComments/ByCaTaskIds', () => [{CommentText: 'a'}, {CommentText: 'b'}]);
      mock.on('Pll/CaseTaskComments/Delete', () => ({1: true}));
      assert.deepEqual(await wf().addTaskComment(5, 'hi'), {CaTaskId: 5, CommentText: 'hi'});
      assert.deepEqual(await wf().updateTaskComment(6, 'yo'), {CaTaskCommentId: 6, CommentText: 'yo'});
      assert.deepEqual(await wf().updateTaskComment(6, 'yo', 9), {CaTaskCommentId: 6, CommentText: 'yo', CommentId: 9});
      assert.lengthOf(await wf().getCommentsForTask(5), 1);
      assert.deepEqual(mock.lastCall('Pll/CaseTaskComments/ByCaTaskId').data, {caTaskId: 5});
      assert.lengthOf(await wf().getCommentsForTasks([5, 6]), 2);
      assert.deepEqual(mock.lastCall('Pll/CaseTaskComments/ByCaTaskIds').data, {caTaskIds: [5, 6]});
      assert.deepEqual(await wf().deleteTaskComments([1]), {1: true});
      assert.deepEqual(mock.lastCall('Pll/CaseTaskComments/Delete').data, {CaTaskCommentIds: [1]});
    });

    it('getResultsByTaskId and the search methods send the expected payloads', async () => {
      mock.on('Pll/CaseTaskResults/ByCaTaskIds', () => [{CaTaskResultId: 1}]);
      mock.on('Pll/CaseTask/Search', () => [5, 6]);
      mock.on('Pll/CaseTaskResults/Search', () => [{CaTaskResultId: 2}]);
      assert.deepEqual(await wf().getResultsByTaskId([5]), [{CaTaskResultId: 1}]);
      assert.deepEqual(mock.lastCall('Pll/CaseTaskResults/ByCaTaskIds').data, {CaTaskIds: [5]});
      assert.deepEqual(await wf().searchForTasks({TaskComplete: 'N'}), [5, 6]);
      assert.deepEqual(mock.lastCall('Pll/CaseTask/Search').data, {TaskComplete: 'N'});
      assert.deepEqual(await wf().searchForTaskResults({CaTaskId: 5}), [{CaTaskResultId: 2}]);
    });

    it('searchForTasks rejects with CWError 1 when no recognised filter is provided', async () => {
      mock.on('Pll/CaseTask/Search', () => []);
      let err;
      try { await wf().searchForTasks({Other: 1}); } catch(e) { err = e; }
      assert.equal(err.Code, 1);
    });

    it('task attachment methods send the expected payloads', async () => {
      mock.on('Pll/CaseRelDocs/AddTaskRelDoc', () => ({CaRelDocId: 1}));
      mock.on('Pll/CaseRelDocs/ByCaTaskId', () => [{CaRelDocId: 1}]);
      mock.on('Pll/CaseRelDocs/Delete', () => ({CaRelDocId: 1}));
      assert.deepEqual(await wf().addTaskAttachment(5, 10, 'test.pdf', 'uploads/test.pdf', 'F'), {CaRelDocId: 1});
      const add = mock.lastCall('Pll/CaseRelDocs/AddTaskRelDoc');
      assert.deepEqual(add.data, {CaObjectId: 10, CaTaskId: 5, DocName: 'test.pdf', LocationType: 'F'});
      assert.equal(add.file, 'uploads/test.pdf');
      assert.lengthOf(await wf().getTaskAttachments(5), 1);
      assert.deepEqual(mock.lastCall('Pll/CaseRelDocs/ByCaTaskId').data, {CaTaskId: 5});
      assert.deepEqual(await wf().deleteTaskAttachment(1), {CaRelDocId: 1});
      assert.deepEqual(mock.lastCall('Pll/CaseRelDocs/Delete').data, {CaRelDocId: 1});
    });
  });
});
