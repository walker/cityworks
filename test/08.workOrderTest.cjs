'use strict';
// Mocked tests: no Cityworks instance is contacted.
const path = require('path');
const assert = require('chai').assert;
const cw8 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

const PDF = path.join(path.dirname(__dirname), 'uploads', 'test.pdf');

async function rejection(promise) {
  try {
    await promise;
  } catch (e) {
    return e;
  }
  assert.fail('should have rejected');
}

describe('[WorkOrder (construct)] function test', () => {
  it('should be a defined object', () => {
    assert.isObject(cw8.workorder, 'Workorder is an object');
  });
  it('should have an admin property which is a defined object', () => {
    assert.isObject(cw8.workorder.admin, 'Admin is an object');
  });
  it('should have an comment property which is a defined object', () => {
    assert.isObject(cw8.workorder.comment, 'Comment is an object');
  });
  it('should have an costs property which is a defined object', () => {
    assert.isObject(cw8.workorder.costs, 'Costs is an object');
  });
});

describe('[WorkOrder::create] function test', () => {
  const mock = createMock(cw8.Cityworks);

  it('should resolve collection of WorkOrders', async () => {
    mock.on('Ams/WorkOrder/Create', () => [{WorkOrderSid: 1001, WorkOrderId: 'WO-1001'}]);
    const payload = {WOTemplateId: 209, EntityType: 'MAINTENANCE_CATEGORIZATION'};
    const r = await cw8.workorder.create(payload);
    assert.property(r[0], 'WorkOrderSid');
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/Create').data, payload);
    assert.lengthOf(mock.calls, 1);
  });

  it('should reject, without calling the API, when WOTemplateId or EntityType is missing', async () => {
    for (const bad of [{WOTemplateId: 1}, {EntityType: 'X'}, {}]) {
      const e = await rejection(cw8.workorder.create(bad));
      assert.equal(e.Code, 2);
      assert.equal(e.Message, 'WOTemplateId & EntityType must be provided.');
      assert.deepEqual(JSON.parse(e.Info), {provided: bad});
    }
    assert.deepEqual(mock.calls, []);
  });

  it('should attach inspection and request ids when specified', async () => {
    mock.on('Ams/WorkOrder/Create', () => []);
    await cw8.workorder.create({WOTemplateId: 1, EntityType: 'X'}, [5, 6], [7]);
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/Create').data, {WOTemplateId: 1, EntityType: 'X', InspectionIds: [5, 6], RequestIds: [7]});
  });

  it('should not override ids already in the payload, and ignore null ids', async () => {
    mock.on('Ams/WorkOrder/Create', () => []);
    await cw8.workorder.create({WOTemplateId: 1, EntityType: 'X', InspectionIds: [1], RequestIds: [2]}, [5], [7]);
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/Create').data, {WOTemplateId: 1, EntityType: 'X', InspectionIds: [1], RequestIds: [2]});
    await cw8.workorder.create({WOTemplateId: 1, EntityType: 'X'}, null, null);
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/Create').data, {WOTemplateId: 1, EntityType: 'X'});
  });

  it('should propagate API errors', async () => {
    mock.onError('Ams/WorkOrder/Create', {Code: 4, Message: 'Not authorized'});
    const e = await rejection(cw8.workorder.create({WOTemplateId: 1, EntityType: 'X'}));
    assert.equal(e.Code, 4);
  });
});

describe('[WorkOrder::createFromParent] function test', () => {
  const mock = createMock(cw8.Cityworks);

  it('should reject without calling the API when template or entity type is missing', async () => {
    const e = await rejection(cw8.workorder.createFromParent({WOTemplateId: 1}, 5));
    assert.equal(e.Code, 2);
    assert.deepEqual(mock.calls, []);
  });

  it('should send WorkOrderId for a string and WorkOrderSid for a number', async () => {
    mock.on('Ams/WorkOrder/CreateFromParent', () => [{WorkOrderSid: 2}]);
    assert.deepEqual(await cw8.workorder.createFromParent({WOTemplateId: 1, EntityType: 'X'}, 'WO-9'), [{WorkOrderSid: 2}]);
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/CreateFromParent').data, {WOTemplateId: 1, EntityType: 'X', WorkOrderId: 'WO-9'});
    await cw8.workorder.createFromParent({WOTemplateId: 1, EntityType: 'X'}, 9);
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/CreateFromParent').data, {WOTemplateId: 1, EntityType: 'X', WorkOrderSid: 9});
  });
});

describe('[WorkOrder::update] function test', () => {
  const mock = createMock(cw8.Cityworks);

  it('should reject without calling the API when no id is provided', async () => {
    const e = await rejection(cw8.workorder.update({Description: 'x'}));
    assert.equal(e.Code, 3);
    assert.equal(e.Message, 'WorkOrderId or WorkOrderSid must be provided.');
    assert.deepEqual(mock.calls, []);
  });

  it('should accept either id and send the payload', async () => {
    mock.on('Ams/WorkOrder/Update', (d) => d);
    assert.deepEqual(await cw8.workorder.update({WorkOrderSid: 4, Description: 'x'}), {WorkOrderSid: 4, Description: 'x'});
    assert.deepEqual(await cw8.workorder.update({WorkOrderId: 'WO-4'}), {WorkOrderId: 'WO-4'});
    assert.lengthOf(mock.callsTo('Ams/WorkOrder/Update'), 2);
  });
});

describe('[WorkOrder::combine/close/delete/...] Status handling function test', () => {
  const mock = createMock(cw8.Cityworks);

  it('should send the combine payload and resolve the Value', async () => {
    mock.on('Ams/WorkOrder/Combine', () => ({Combined: true}));
    assert.deepEqual(await cw8.workorder.combine(['A', 'B'], 'C'), {Combined: true});
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/Combine').data, {CancelCombinedWorkOrders: true, ToWorkOrderId: 'C', FromWorkOrderIds: ['A', 'B']});
    await cw8.workorder.combine(['A'], 'C', false);
    assert.isFalse(mock.lastCall('Ams/WorkOrder/Combine').data.CancelCombinedWorkOrders);
  });

  it('should reject with a CWError when the response Status is non-zero', async () => {
    const cases = [
      ['combine', [['A'], 'C'], 'Ams/WorkOrder/Combine', 4],
      ['close', [[1]], 'Ams/WorkOrder/Close', 5],
      ['delete', [[1]], 'Ams/WorkOrder/Delete', 4],
      ['getEntities', [[1]], 'Ams/WorkOrder/Entities', 4],
      ['addEntities', [1, {EntityUids: ['u'], EntityType: 'T'}], 'Ams/WorkOrder/AddEntities', 4],
      ['removeEntities', [1, {ObjectIds: [1]}], 'Ams/WorkOrder/RemoveEntities', 4],
      ['getWOsByEntities', ['T', ['u']], 'Ams/WorkOrder/SearchForSids', 4],
      ['getSearchList', ['WO-1'], 'Ams/WorkOrder/SearchObject', 4]
    ];
    for (const [fn, args, p, code] of cases) {
      mock.onRaw(p, {Status: 2, Message: 'failed ' + fn, Value: null});
      const e = await rejection(cw8.workorder[fn](...args));
      assert.equal(e.Code, code, fn);
      assert.equal(e.Message, 'failed ' + fn, fn);
      assert.equal(JSON.parse(e.Info).response.Status, 2, fn);
    }
  });
});

describe('[WorkOrder::move] function test', () => {
  const mock = createMock(cw8.Cityworks);

  it('should merge the projection into the payload', async () => {
    mock.on('Ams/WorkOrder/Move', () => ({Moved: true}));
    assert.deepEqual(await cw8.workorder.move('WO-1', 1, 2, {WKID: 4326}), {Moved: true});
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/Move').data, {WorkOrderId: 'WO-1', X: 1, Y: 2, WKID: 4326});
    await cw8.workorder.move('WO-1', 1, 2, {WKT: 'wkt'}, 3);
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/Move').data, {WorkOrderId: 'WO-1', X: 1, Y: 2, Z: 3, WKT: 'wkt'});
  });

  it('should reject when neither WKID nor WKT is provided', async () => {
    mock.on('Ams/WorkOrder/Move', () => true);
    const e = await rejection(cw8.workorder.move('WO-1', 1, 2, {}));
    assert.equal(e.Code, 6);
    assert.equal(e.Message, 'You must provide either the WKID or WKT for the x/y coordinates.');
  });
});

describe('[WorkOrder::getById] function test', () => {
  const mock = createMock(cw8.Cityworks);

  it('should use ById for a string id', async () => {
    mock.on('Ams/WorkOrder/ById', (d) => ({WorkOrderId: d.WorkOrderId}));
    assert.deepEqual(await cw8.workorder.getById('WO-1'), {WorkOrderId: 'WO-1'});
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/ById').data, {WorkOrderId: 'WO-1'});
  });

  it('should use BySid for a numeric id', async () => {
    mock.on('Ams/WorkOrder/BySid', (d) => ({WorkOrderSid: d.WorkOrderSid}));
    assert.deepEqual(await cw8.workorder.getById(12), {WorkOrderSid: 12});
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/BySid').data, {WorkOrderSid: 12});
  });

  it('should propagate API errors', async () => {
    mock.onError('Ams/WorkOrder/BySid', {Code: 60, Message: 'not found'});
    assert.equal((await rejection(cw8.workorder.getById(1))).Code, 60);
  });
});

describe('[WorkOrder] getByIds / getInstructions / getCustomFieldValues / getEntities function test', () => {
  const mock = createMock(cw8.Cityworks);

  it('should choose the endpoint and key from the type of the first id', async () => {
    const table = [
      ['getByIds', ['A', 'B'], 'Ams/WorkOrder/ByIds', {WorkOrderIds: ['A', 'B']}],
      ['getByIds', [1, 2], 'Ams/WorkOrder/BySids', {WorkOrderSids: [1, 2]}],
      ['getInstructions', ['A'], 'Ams/WorkOrder/InstructionsByWorkOrderIds', {WorkOrderIds: ['A']}],
      ['getInstructions', [1], 'Ams/WorkOrder/InstructionsByWorkOrderSids', {WorkOrderSids: [1]}],
      ['getCustomFieldValues', ['A'], 'Ams/WorkOrder/CustomFields', {WorkOrderIds: ['A']}],
      ['getCustomFieldValues', [1], 'Ams/WorkOrder/CustomFieldsByWorkOrderSids', {WorkOrderSids: [1]}],
      ['getEntities', ['A'], 'Ams/WorkOrder/Entities', {GetGisData: true, WorkOrderIds: ['A']}],
      ['getEntities', [1], 'Ams/WorkOrder/Entities', {GetGisData: true, WorkOrderSids: [1]}]
    ];
    for (const [fn, ids, p, expected] of table) {
      mock.on(p, () => ({fn: fn}));
      assert.deepEqual(await cw8.workorder[fn](ids), {fn: fn});
      assert.deepEqual(mock.lastCall(p).data, expected, fn);
    }
    mock.on('Ams/WorkOrder/Entities', () => []);
    await cw8.workorder.getEntities([1], false);
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/Entities').data, {GetGisData: false, WorkOrderSids: [1]});
  });

  it('should reject empty id lists without calling the API', async () => {
    let e = await rejection(cw8.workorder.getByIds([]));
    assert.equal(e.Code, 101);
    e = await rejection(cw8.workorder.getInstructions([]));
    assert.equal(e.Code, 102);
    e = await rejection(cw8.workorder.getEntities([]));
    assert.equal(e.Code, 11);
    assert.deepEqual(mock.callsTo('Ams/WorkOrder/ByIds'), []);
    assert.deepEqual(mock.callsTo('Ams/WorkOrder/InstructionsByWorkOrderIds'), []);
  });

  it('should reject ids that are neither strings nor numbers', async () => {
    mock.on('Ams/WorkOrder/ByIds', () => []);
    mock.on('Ams/WorkOrder/InstructionsByWorkOrderIds', () => []);
    mock.on('Ams/WorkOrder/CustomFields', () => []);
    mock.on('Ams/WorkOrder/Entities', () => []);
    for (const fn of ['getByIds', 'getInstructions', 'getCustomFieldValues']) {
      assert.equal((await rejection(cw8.workorder[fn]([{}]))).Code, 9, fn);
    }
    assert.equal((await rejection(cw8.workorder.getEntities([{}]))).Code, 12);
  });

  it('should propagate API errors', async () => {
    mock.onError('Ams/WorkOrder/BySids', {Code: 3, Message: 'boom'});
    assert.equal((await rejection(cw8.workorder.getByIds([1]))).Code, 3);
  });
});

describe('[WorkOrder::getAuditLog] function test', () => {
  const mock = createMock(cw8.Cityworks);

  it('should send WorkOrderId for strings and WorkOrderSid for numbers', async () => {
    mock.on('Ams/WorkOrder/AuditLog', () => [{Entry: 1}]);
    assert.deepEqual(await cw8.workorder.getAuditLog('WO-1'), [{Entry: 1}]);
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/AuditLog').data, {WorkOrderId: 'WO-1'});
    await cw8.workorder.getAuditLog(4);
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/AuditLog').data, {WorkOrderSid: 4});
  });

  it('should reject when the id is neither a string nor a number', async () => {
    mock.on('Ams/WorkOrder/AuditLog', () => []);
    assert.equal((await rejection(cw8.workorder.getAuditLog(null))).Code, 9);
  });
});

describe('[WorkOrder] entity function tests', () => {
  const mock = createMock(cw8.Cityworks);

  it('addEntities should send ids, entity info, facility info and UpdateXY', async () => {
    mock.on('Ams/WorkOrder/AddEntities', () => ({Added: 1}));
    const info = {EntityUids: ['u1', 'u2'], EntityType: 'T', Facility_Id: 'F', Level_Id: 'L'};
    assert.deepEqual(await cw8.workorder.addEntities(5, info), {Added: 1});
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/AddEntities').data, {UpdateXY: true, WorkOrderSid: 5, Facility_Id: 'F', Level_Id: 'L', EntityUids: ['u1', 'u2'], EntityType: 'T'});
    await cw8.workorder.addEntities('WO-5', {EntityUids: ['u1'], EntityType: 'T'}, false);
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/AddEntities').data, {UpdateXY: false, WorkOrderId: 'WO-5', EntityUids: ['u1'], EntityType: 'T'});
  });

  it('addEntities, updateEntity and removeEntities should reject incomplete entity info', async () => {
    mock.on('Ams/WorkOrder/AddEntities', () => true);
    mock.on('Ams/WorkOrder/UpdateEntity', () => true);
    mock.on('Ams/WorkOrder/RemoveEntities', () => true);
    let e = await rejection(cw8.workorder.addEntities(5, {EntityType: 'T'}));
    assert.equal(e.Code, 7);
    e = await rejection(cw8.workorder.updateEntity(5, {EntityType: 'T'}));
    assert.equal(e.Code, 7);
    e = await rejection(cw8.workorder.removeEntities(5, {EntityType: 'T'}));
    assert.equal(e.Code, 8);
    assert.equal(e.Message, 'No entity info was provided.');
  });

  it('updateEntity should send ids, facility info and WorkComplete', async () => {
    mock.on('Ams/WorkOrder/UpdateEntity', () => ({Updated: 1}));
    const r = await cw8.workorder.updateEntity('WO-5', {EntityUid: 'u', EntityType: 'T', Facility_Id: 'F'}, true);
    assert.deepEqual(r, {Updated: 1});
    const data = mock.lastCall('Ams/WorkOrder/UpdateEntity').data;
    assert.equal(data.WorkOrderId, 'WO-5');
    assert.isTrue(data.WorkComplete);
    assert.equal(data.Facility_Id, 'F');
    assert.equal(data.EntityType, 'T');
    assert.equal(data.EntityUid, 'u');
  });

  it('removeEntities should prefer ObjectIds, else EntityUids with EntityType', async () => {
    mock.on('Ams/WorkOrder/RemoveEntities', () => ({Removed: 1}));
    await cw8.workorder.removeEntities(5, {ObjectIds: [1, 2], EntityUids: ['u'], EntityType: 'T'});
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/RemoveEntities').data, {UpdateXY: true, WorkOrderSid: 5, ObjectIds: [1, 2]});
    await cw8.workorder.removeEntities('WO-5', {EntityUids: ['u'], EntityType: 'T'}, false);
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/RemoveEntities').data, {UpdateXY: false, WorkOrderId: 'WO-5', EntityUids: ['u'], EntityType: 'T'});
  });
});

describe('[WorkOrder] simple endpoint function tests', () => {
  const mock = createMock(cw8.Cityworks);

  const cases = [
    ['cancel', [[1, 2]], 'Ams/WorkOrder/Cancel', {WorkOrderIds: [1, 2]}],
    ['cancel', [[1], 'dup', '2024-01-02T03:04:05.000Z'], 'Ams/WorkOrder/Cancel', {WorkOrderIds: [1], CancelReason: 'dup', DateCancelled: '2024-01-02T03:04:05.000Z'}],
    ['uncancel', [[1]], 'Ams/WorkOrder/Uncancel', {WorkOrderIds: [1]}],
    ['close', [[1]], 'Ams/WorkOrder/Close', {WorkOrderIds: [1]}],
    ['reopen', [[1]], 'Ams/WorkOrder/ReOpen', {WorkOrderIds: [1]}],
    ['delete', [[1]], 'Ams/WorkOrder/Delete', {WorkOrderIds: [1]}],
    ['getSearchList', ['WO-1'], 'Ams/WorkOrder/SearchObject', {WorkOrderId: 'WO-1'}],
    ['getStatuses', [], 'Ams/WorkOrder/Statuses', {}],
    ['getCategories', [], 'Ams/WorkOrder/Categories', {}],
    ['getPriorities', [], 'Ams/WorkOrder/Priorities', {}],
    ['getCycleFrom', [], 'Ams/WorkOrder/CycleFrom', {}],
    ['getCycleIntervals', [], 'Ams/WorkOrder/CycleIntervals', {}],
    ['getCycleTypes', [], 'Ams/WorkOrder/CycleTypes', {}],
    ['getStages', [], 'Ams/WorkOrder/Stages', {}],
    ['getExpenseTypes', [], 'Ams/WorkOrder/ExpenseTypes', {}],
    ['getMLFs', ['WO-1'], 'Ams/TemplateMapLayer/WorkOrderInstanceMapLayersByWorkOrderId', {WorkOrderId: 'WO-1'}],
    ['deleteMLFs', ['WO-1'], 'Ams/TemplateMapLayer/DeleteWorkOrderInstancesByWorkOrderId', {WorkOrderId: 'WO-1'}]
  ];

  cases.forEach(([fn, args, p, expected]) => {
    it(`${fn}(${JSON.stringify(args)}) should post ${JSON.stringify(expected)} to ${p} and resolve the Value`, async () => {
      mock.on(p, () => ({Result: fn}));
      assert.deepEqual(await cw8.workorder[fn](...args), {Result: fn});
      assert.deepEqual(mock.paths(), [p]);
      assert.deepEqual(mock.lastCall(p).data, expected);
    });
  });

  it('should propagate API errors from every simple endpoint', async () => {
    for (const [fn, args, p] of cases) {
      mock.onError(p, {Code: 9, Message: 'bad ' + fn});
      const e = await rejection(cw8.workorder[fn](...args));
      assert.equal(e.Code, 9, fn);
      assert.equal(e.Message, 'bad ' + fn, fn);
    }
  });
});

describe('[WorkOrder::getWOsByEntities] function test', () => {
  const mock = createMock(cw8.Cityworks);

  it('should search for sids by default and send the entity type and uids', async () => {
    mock.on('Ams/WorkOrder/SearchForSids', () => [1, 2]);
    assert.deepEqual(await cw8.workorder.getWOsByEntities('T', ['u1']), [1, 2]);
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/SearchForSids').data, {EntityType: 'T', EntityUids: ['u1']});
  });

  it('should use the full search endpoint when s is false', async () => {
    mock.on('Ams/WorkOrder/Search', () => [{WorkOrderSid: 1}]);
    assert.deepEqual(await cw8.workorder.getWOsByEntities('T', ['u1'], undefined, false), [{WorkOrderSid: 1}]);
    assert.deepEqual(mock.paths(), ['Ams/WorkOrder/Search']);
  });
});

describe('[WorkOrder::getEmployeeLists] function test', () => {
  const mock = createMock(cw8.Cityworks);

  it('should send IncludeInactiveEmployees and optional DomainIds to the list endpoint', async () => {
    mock.on('Ams/WorkOrder/SubmitTos', () => [{EmployeeSid: 1}]);
    mock.on('Ams/WorkOrder/Supervisors', () => [{EmployeeSid: 2}]);
    assert.deepEqual(await cw8.workorder.getSubmitTos(), [{EmployeeSid: 1}]);
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/SubmitTos').data, {IncludeInactiveEmployees: false});
    assert.deepEqual(await cw8.workorder.getSupervisors(true, [3]), [{EmployeeSid: 2}]);
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/Supervisors').data, {IncludeInactiveEmployees: true, DomainIds: [3]});
    await cw8.workorder.getEmployeeLists('Supervisors', false, null);
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/Supervisors').data, {IncludeInactiveEmployees: false});
  });

  it('should reject an unknown list type without calling the API', async () => {
    const e = await rejection(cw8.workorder.getEmployeeLists('Other'));
    assert.equal(e.Code, 2);
    assert.equal(e.Message, 'listType must be either SubmitTos or Supervisors.');
    assert.deepEqual(mock.calls, []);
  });

  it('should propagate API errors', async () => {
    mock.onError('Ams/WorkOrder/Supervisors', {Code: 5, Message: 'nope'});
    assert.equal((await rejection(cw8.workorder.getSupervisors())).Code, 5);
  });
});

describe('[WorkOrder::updateMLFs] function test', () => {
  const mock = createMock(cw8.Cityworks);

  it('should use the by-work-order endpoint without a template id', async () => {
    const p = 'Ams/TemplateMapLayer/UpdateWorkOrderInstanceMapLayersByWorkOrderId';
    mock.on(p, () => ({Ok: 1}));
    assert.deepEqual(await cw8.workorder.updateMLFs('WO-1', {x: 1, y: 2}), {Ok: 1});
    assert.deepEqual(mock.lastCall(p).data, {x: 1, y: 2, WorkOrderId: 'WO-1'});
    await cw8.workorder.updateMLFs(7, {x: 1, y: 2}, undefined, 4);
    assert.deepEqual(mock.lastCall(p).data, {x: 1, y: 2, WorkOrderSid: 7, DomainId: 4});
  });

  it('should use the by-template endpoint when a template id is given', async () => {
    const p = 'Ams/TemplateMapLayer/UpdateWorkOrderInstanceMapLayersByTemplate';
    mock.on(p, () => ({Ok: 2}));
    await cw8.workorder.updateMLFs('WO-1', {x: 1, y: 2, z: 3}, 9);
    assert.deepEqual(mock.lastCall(p).data, {x: 1, y: 2, z: 3, WoTemplateId: 9, WorkOrderId: 'WO-1'});
  });

  it('should reject when the id is neither a string nor a number', async () => {
    mock.on('Ams/TemplateMapLayer/UpdateWorkOrderInstanceMapLayersByWorkOrderId', () => true);
    assert.equal((await rejection(cw8.workorder.updateMLFs(null, {x: 1, y: 2}))).Code, 9);
  });
});

describe('[WorkOrder::addAttachment] function test', () => {
  const mock = createMock(cw8.Cityworks);
  const p = 'Ams/Attachments/AddWorkOrderAttachment';

  it('should know it is an workorder attachment instance', () => {
    assert.equal(cw8.workorder.attachments.currentActivityType, 'WorkOrder');
  });

  it('should return an attachment if attached by workorderid string', async () => {
    mock.on(p, (d) => ({WorkOrderId: d.WorkOrderId}));
    const r = await cw8.workorder.attachments.add('100196', PDF, 'test.pdf');
    assert.equal(r.WorkOrderId, '100196');
    const call = mock.lastCall(p);
    assert.deepEqual(call.data, {Filename: 'test.pdf', WorkOrderId: '100196', AttachmentType: 0});
    assert.equal(call.file, PDF);
  });

  it('should return an attachment if attached by workordersid number', async () => {
    mock.on(p, (d) => ({WorkOrderSid: d.WorkOrderSid}));
    const r = await cw8.workorder.attachments.add(100196, PDF, 'test.pdf');
    assert.equal(r.WorkOrderSid, 100196);
    assert.deepEqual(mock.lastCall(p).data, {Filename: 'test.pdf', WorkOrderSid: 100196, AttachmentType: 0});
  });

  it('should pass the task id, comments and attachment type', async () => {
    mock.on(p, () => ({}));
    await cw8.workorder.attachments.add(5, PDF, 'sig.pdf', 'signature', 33, 'signed');
    assert.deepEqual(mock.lastCall(p).data, {Filename: 'sig.pdf', Comments: 'signed', WorkOrderSid: 5, TaskId: 33, AttachmentType: 1});
  });

  it('should propagate API errors', async () => {
    mock.onError(p, {Code: 4, Message: 'denied'});
    assert.equal((await rejection(cw8.workorder.attachments.add(1, PDF, 'test.pdf'))).Code, 4);
  });
});
