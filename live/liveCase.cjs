'use strict';
// Read-only live checks with an explicitly designated case.
require('dotenv').config({quiet: true, debug: false});
const assert = require('chai').assert;
const cw = require('../dist/index.js');

describe('[Live case] populated case checks', function() {
  this.timeout(60000);
  let id;
  let record;
  before(async function() {
    const missing = ['cwdomain', 'cwlogin', 'cwpassword'].filter(k => !process.env[k]);
    if(missing.length || !process.env.CW_LIVE_CASE_ID) {
      console.log('\n  Skipped: set Cityworks credentials and CW_LIVE_CASE_ID');
      this.skip();
    }
    id = Number(process.env.CW_LIVE_CASE_ID);
    assert.isTrue(Number.isSafeInteger(id) && id > 0, 'CW_LIVE_CASE_ID must be a positive integer');
    cw.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion ? Number(process.env.cwversion) : undefined});
    await cw.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword);
    record = await cw.briefcase.getById(id);
    assert.isDefined(record, 'designated case must exist');
    assert.strictEqual(record.CaObjectId, id);
  });

  it('finds the case by its case number and remembers a single result', async function() {
    assert.isString(record.CaseNumber);
    const ids = await cw.briefcase.search({CaseNumber: record.CaseNumber});
    assert.isArray(ids);
    assert.include(ids, id);
    ids.forEach(value => assert.isNumber(value));
    if(ids.length === 1) assert.strictEqual(cw.briefcase.current_case, id);
  });

  it('reads business case templates', async function() {
    const templates = await cw.briefcase.admin.getBusinessCaseTemplates();
    assert.isArray(templates);
    if(templates.length) assert.isNumber(templates[0].BusCaseId);
  });

  it('reads case assets, flags and people', async function() {
    const assets = await cw.briefcase.asset.getForCase(id);
    assert.isTrue(assets === null || Array.isArray(assets));
    assert.isArray(await cw.briefcase.flag.getForCase(id));
    const people = await cw.briefcase.people.get(id);
    assert.isArray(people);
    const ids = await cw.briefcase.people.search({CaObjectId: id}, true);
    assert.isArray(ids);
    people.forEach(person => assert.include(ids, person.CaPeopleId));
  });

  it('reads and searches a populated case data group and its details', async function() {
    const groups = await cw.briefcase.data.getGroupsByCaseId(id);
    assert.isTrue(groups === null || Array.isArray(groups));
    assert.isArray(await cw.briefcase.data.getAllDataDetails(id));
    if(!groups || groups.length === 0) this.skip();
    const groupId = groups[0].CaDataGroupId;
    assert.isNumber(groupId);
    assert.include(await cw.briefcase.data.searchForGroups({CaDataGroupId: groupId}), groupId);
    const details = await cw.briefcase.data.searchForDetails({CaDataGroupId: groupId});
    assert.isArray(details);
    if(details.length) {
      const detailId = details[0].CaDataDetailId;
      assert.isNumber(detailId);
      const matching = await cw.briefcase.data.searchForDetails({CaDataDetailId: detailId});
      assert.isTrue(matching.some(detail => detail.CaDataDetailId === detailId));
    }
  });

  it('reads a populated case task and its related records', async function() {
    const tasks = await cw.briefcase.workflow.getTasksByCaseId(id);
    assert.isArray(tasks);
    if(!tasks.length) this.skip();
    const taskId = tasks[0].CaTaskId;
    assert.isNumber(taskId);
    const matching = await cw.briefcase.workflow.getTasksById([taskId]);
    assert.isTrue(matching.some(task => task.CaTaskId === taskId));
    const results = await cw.briefcase.workflow.getResultsByTaskId([taskId]);
    assert.isArray(results);
    const resultIds = await cw.briefcase.workflow.searchForTaskResults({CaTaskId: taskId});
    assert.isArray(resultIds);
    results.forEach(result => assert.include(resultIds, result.CaTaskResultsId));
    const comments = await cw.briefcase.workflow.getCommentsForTask(taskId);
    const commentsByIds = await cw.briefcase.workflow.getCommentsForTasks([taskId]);
    assert.isArray(comments);
    assert.isArray(commentsByIds);
    assert.lengthOf(commentsByIds, comments.length);
    assert.isArray(await cw.briefcase.workflow.getTaskAttachments(taskId));
  });
});
