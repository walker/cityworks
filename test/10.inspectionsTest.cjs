'use strict';
// Mocked tests: no Cityworks instance is contacted.
const path = require('path');
const assert = require('chai').assert;
const cw10 = require('../dist/index.js');
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

describe('[Inspection (construct)] function test', () => {
  it('should be a defined object', () => {
    assert.isObject(cw10.inspection, 'Inspection is an object');
  });
  it('should have an admin property which is a defined object', () => {
    assert.isObject(cw10.inspection.admin, 'Admin is an object');
  });
  it('should have an costs property which is a defined object', () => {
    assert.isObject(cw10.inspection.costs, 'Costs is an object');
  });
});

describe('[Inspection::create] function test', () => {
  const mock = createMock(cw10.Cityworks);
  const createFns = {
    create: ['Ams/Inspection/Create', []],
    createFromEntities: ['Ams/Inspection/CreateFromEntities', []],
    createFromParent: ['Ams/Inspection/CreateFromParent', ['InspectionId']],
    createFromServiceRequest: ['Ams/Inspection/CreateFromServiceRequest', ['RequestId']],
    createFromWorkOrder: ['Ams/Inspection/CreateFromWorkOrder', ['WorkOrderId']]
  };

  it('should resolve the Inspection and send the payload untouched', async () => {
    mock.on('Ams/Inspection/Create', () => ({InspectionId: 11}));
    const payload = {InspTemplateId: 209, EntityType: 'MAINTENANCE_CATEGORIZATION'};
    const r = await cw10.inspection.create(payload);
    assert.deepEqual(r, {InspectionId: 11});
    assert.property(r, 'InspectionId');
    assert.deepEqual(mock.lastCall('Ams/Inspection/Create').data, payload);
    assert.lengthOf(mock.calls, 1);
  });

  it('should reject, without calling the API, when EntityType or InspTemplateId is missing', async () => {
    for (const fn of Object.keys(createFns)) {
      const extra = {};
      createFns[fn][1].forEach(k => { extra[k] = 1; });
      let e = await rejection(cw10.inspection[fn](Object.assign({EntityType: 'X'}, extra)));
      assert.equal(e.Code, 1, fn);
      assert.equal(e.Message, 'EntityType and InspTemplateId properties must be provided.', fn);
      e = await rejection(cw10.inspection[fn](Object.assign({InspTemplateId: 1}, extra)));
      assert.equal(e.Code, 1, fn);
      // the old (incorrect) property name is not accepted
      const old = Object.assign({InspectionTemplateId: 209, EntityType: 'X'}, extra);
      e = await rejection(cw10.inspection[fn](old));
      assert.equal(e.Code, 1, fn);
      assert.deepEqual(JSON.parse(e.Info), {provided: old}, fn);
    }
    assert.deepEqual(mock.calls, []);
  });

  it('should require the parent identifier for the parent-based creates, without calling the API', async () => {
    for (const fn of ['createFromParent', 'createFromServiceRequest', 'createFromWorkOrder']) {
      const e = await rejection(cw10.inspection[fn]({EntityType: 'X', InspTemplateId: 1}));
      assert.equal(e.Code, 1, fn);
    }
    assert.deepEqual(mock.calls, []);
  });

  const relationshipCases = [
    {title: 'should have an attached work order when specified', method: 'createFromWorkOrder', parentKey: 'WorkOrderSid', parentType: 4, parentId: 31, linkType: 2},
    {title: 'should have an attached parent inspection when specified', method: 'createFromParent', parentKey: 'InspectionId', parentType: 2, parentId: 32, linkType: 1},
    {title: 'should have an attached service request when specified', method: 'createFromServiceRequest', parentKey: 'RequestId', parentType: 3, parentId: 33, linkType: 2}
  ];

  relationshipCases.forEach(({title, method, parentKey, parentType, parentId, linkType}) => {
    it(title, async () => {
      const endpoint = createFns[method][0];
      const links = [];
      const inspectionId = 77;
      const payload = {EntityType: 'X', InspTemplateId: 5, [parentKey]: parentId};
      const expectedPayload = method === 'createFromWorkOrder' ? {...payload, WorkOrderId: 'WO-31'} : payload;
      if(method === 'createFromWorkOrder') mock.on('Ams/WorkOrder/BySid', {WorkOrderSid: parentId, WorkOrderId: 'WO-31'});
      const result = method === 'createFromParent' ? {InspectionId: inspectionId, ParentInspId: parentId} : {InspectionId: inspectionId};
      mock.on(endpoint, data => {
        links.push({ActivityLinkId: 1, SourceType: parentType, SourceSid: data[parentKey], DestType: 2, DestSid: inspectionId, LinkType: linkType});
        return result;
      });
      mock.on('General/ActivityLink/ByActivitySids', data =>
        links.filter(link => data.ActivityType === 2 && data.ActivitySids.includes(link.DestSid))
      );

      const created = await cw10.inspection[method](payload);
      assert.deepEqual(created, result);
      assert.deepEqual(mock.lastCall(endpoint).data, expectedPayload);
      assert.deepEqual(payload, {EntityType: 'X', InspTemplateId: 5, [parentKey]: parentId});
      const attached = await cw10.activity_link.get('inspection', [created.InspectionId]);
      assert.deepEqual(attached, [{ActivityLinkId: 1, SourceType: parentType, SourceSid: parentId, DestType: 2, DestSid: inspectionId, LinkType: linkType}]);
      assert.deepEqual(mock.lastCall('General/ActivityLink/ByActivitySids').data, {ActivityType: 2, ActivitySids: [inspectionId]});
      assert.deepEqual(mock.paths(), [...(method === 'createFromWorkOrder' ? ['Ams/WorkOrder/BySid'] : []), endpoint, 'General/ActivityLink/ByActivitySids']);
    });
  });

  it('should create from a work order ID without a SID lookup', async () => {
    const payload = {EntityType: 'X', InspTemplateId: 5, WorkOrderId: 'WO-31'};
    mock.on('Ams/Inspection/CreateFromWorkOrder', {InspectionId: 77});
    assert.deepEqual(await cw10.inspection.createFromWorkOrder(payload), {InspectionId: 77});
    assert.deepEqual(mock.paths(), ['Ams/Inspection/CreateFromWorkOrder']);
    assert.deepEqual(mock.lastCall('Ams/Inspection/CreateFromWorkOrder').data, payload);
  });

  it('should pass through both work order identifiers without a lookup', async () => {
    const payload = {EntityType: 'X', InspTemplateId: 5, WorkOrderId: 'WO-31', WorkOrderSid: 31};
    mock.on('Ams/Inspection/CreateFromWorkOrder', {InspectionId: 77});
    assert.deepEqual(await cw10.inspection.createFromWorkOrder(payload), {InspectionId: 77});
    assert.deepEqual(mock.paths(), ['Ams/Inspection/CreateFromWorkOrder']);
    assert.deepEqual(mock.lastCall('Ams/Inspection/CreateFromWorkOrder').data, payload);
  });

  it('should reject a missing or unresolvable work order before creating an inspection', async () => {
    assert.equal((await rejection(cw10.inspection.createFromWorkOrder({EntityType: 'X', InspTemplateId: 5}))).Message, 'WorkOrderId or WorkOrderSid must be provided.');
    mock.on('Ams/WorkOrder/BySid', null);
    const e = await rejection(cw10.inspection.createFromWorkOrder({EntityType: 'X', InspTemplateId: 5, WorkOrderSid: 31}));
    assert.equal(e.Message, 'Could not resolve WorkOrderId for the provided WorkOrderSid.');
    assert.deepEqual(mock.paths(), ['Ams/WorkOrder/BySid']);
  });

  it('should propagate a work order lookup error without creating an inspection', async () => {
    mock.onError('Ams/WorkOrder/BySid', {Code: 4, Message: 'lookup failed'});
    const e = await rejection(cw10.inspection.createFromWorkOrder({EntityType: 'X', InspTemplateId: 5, WorkOrderSid: 31}));
    assert.equal(e.Message, 'lookup failed');
    assert.deepEqual(mock.paths(), ['Ams/WorkOrder/BySid']);
  });

  it('should propagate creation errors after resolving a work order SID', async () => {
    mock.on('Ams/WorkOrder/BySid', {WorkOrderId: 'WO-31'});
    mock.onError('Ams/Inspection/CreateFromWorkOrder', {Code: 4, Message: 'create failed'});
    const e = await rejection(cw10.inspection.createFromWorkOrder({EntityType: 'X', InspTemplateId: 5, WorkOrderSid: 31}));
    assert.equal(e.Message, 'create failed');
    assert.deepEqual(mock.paths(), ['Ams/WorkOrder/BySid', 'Ams/Inspection/CreateFromWorkOrder']);
  });

  it('should post each create variant to its own endpoint and resolve the Value', async () => {
    for (const fn of Object.keys(createFns)) {
      const p = createFns[fn][0];
      const result = fn === 'createFromEntities' ? [{InspectionId: 77, From: p}] : {InspectionId: 77, From: p};
      mock.on(p, () => result);
      const payload = {EntityType: 'X', InspTemplateId: 5};
      createFns[fn][1].forEach(k => { payload[k] = k === 'WorkOrderId' ? 'WO-3' : 3; });
      const r = await cw10.inspection[fn](payload);
      assert.deepEqual(r, result);
      assert.deepEqual(mock.lastCall(p).data, payload);
    }
    assert.lengthOf(mock.calls, 5);
  });

  it('should propagate API errors', async () => {
    mock.onError('Ams/Inspection/Create', {Code: 4, Message: 'Not authorized'});
    const e = await rejection(cw10.inspection.create({EntityType: 'X', InspTemplateId: 5}));
    assert.equal(e.Code, 4);
    assert.equal(e.Message, 'Not authorized');
  });
});

describe('[Inspection::update] function test', () => {
  const mock = createMock(cw10.Cityworks);

  // update() wraps its work in a nested promise whose result is never wired to the returned promise, so only the request is observable
  it('should send the Update request with the given payload', () => {
    mock.on('Ams/Inspection/Update', (d) => d);
    cw10.inspection.update({InspectionId: 5, Description: 'x'});
    assert.deepEqual(mock.lastCall('Ams/Inspection/Update').data, {InspectionId: 5, Description: 'x'});
  });
});

describe('[Inspection::getById] function test', () => {
  const mock = createMock(cw10.Cityworks);

  it('should return an inspection', async () => {
    mock.on('Ams/Inspection/ById', (d) => ({InspectionId: d.InspectionId, Status: 'OPEN'}));
    const r = await cw10.inspection.getById(171018);
    assert.property(r, 'InspectionId');
    assert.deepEqual(r, {InspectionId: 171018, Status: 'OPEN'});
    assert.deepEqual(mock.lastCall('Ams/Inspection/ById').data, {InspectionId: 171018});
  });

  it('should propagate API errors', async () => {
    mock.onError('Ams/Inspection/ById', {Code: 60, Message: 'Item not found'});
    const e = await rejection(cw10.inspection.getById(1));
    assert.equal(e.Code, 60);
  });
});

describe('[Inspection] simple endpoint function tests', () => {
  const mock = createMock(cw10.Cityworks);

  const cases = [
    ['getByIds', [[1, 2]], 'Ams/Inspection/ByIds', {InspectionIds: [1, 2]}],
    ['cancel', [[1, 2]], 'Ams/Inspection/Cancel', {InspectionIds: [1, 2]}],
    ['cancel', [[1], 'dup', '2024-01-02T03:04:05.000Z'], 'Ams/Inspection/Cancel', {InspectionIds: [1], CancelReason: 'dup', DateCancelled: '2024-01-02T03:04:05.000Z'}],
    ['uncancel', [[3]], 'Ams/Inspection/Uncancel', {InspectionIds: [3]}],
    ['close', [[3]], 'Ams/Inspection/Close', {InspectionIds: [3]}],
    ['reopen', [[3]], 'Ams/Inspection/Reopen', {InspectionIds: [3]}],
    ['delete', [[3, 4]], 'Ams/Inspection/Delete', {InspectionIds: [3, 4]}],
    ['search', [{Status: 'OPEN'}], 'Ams/Inspection/Search', {Status: 'OPEN'}],
    ['searchObject', ['55'], 'Ams/ServiceRequest/SearchObject', {InspectionId: '55'}],
    ['statuses', [], 'Ams/Inspection/Statuses', {}],
    ['getAuditLog', [9], 'Ams/Inspection/AuditLog', {InspectionId: 9}],
    ['getCycleFrom', [], 'Ams/Inspection/CycleFrom', {}],
    ['getCycleIntervals', [], 'Ams/Inspection/CycleIntervals', {}],
    ['getCycleTypes', [], 'Ams/Inspection/CycleTypes', {}],
    ['getDistricts', [], 'Ams/Inspection/Districts', {}],
    ['getTemplatesByIds', [[7, 8]], 'Ams/InspectionTemplate/ByIds', {InspTemplateIds: [7, 8]}],
    ['getTemplatesByIds', [[7], {MinimumDateModified: '2024-01-01'}], 'Ams/InspectionTemplate/ByIds', {InspTemplateIds: [7], MinimumDateModified: '2024-01-01'}],
    ['getTemplateEntityTypes', [[7]], 'Ams/InspectionTemplate/EntityTypes', {InspTemplateIds: [7]}],
    ['getQA', [[7]], 'Ams/InspectionTemplate/QA', {InspTemplateIds: [7]}],
    ['getQConditions', [[7]], 'Ams/InspectionTemplate/QuestionConditions', {InspTemplateIds: [7]}],
    ['getMLFs', [12], 'Ams/TemplateMapLayer/ServiceRequestInstanceMapLayersByRequestId', {ServiceRequestId: 12}],
    ['deleteMLFs', [12], 'Ams/TemplateMapLayer/DeleteInspectionInstancesByInspectionId', {InspectionId: 12}]
  ];

  cases.forEach(([fn, args, p, expected]) => {
    it(`${fn}(${JSON.stringify(args)}) should post ${JSON.stringify(expected)} to ${p} and resolve the Value`, async () => {
      mock.on(p, () => ({Result: fn}));
      const r = await cw10.inspection[fn](...args);
      assert.deepEqual(r, {Result: fn});
      assert.deepEqual(mock.paths(), [p]);
      assert.deepEqual(mock.lastCall(p).data, expected);
    });
  });

  it('should propagate API errors from every simple endpoint', async () => {
    for (const [fn, args, p] of cases) {
      mock.onError(p, {Code: 9, Message: 'bad ' + fn});
      const e = await rejection(cw10.inspection[fn](...args));
      assert.equal(e.Code, 9, fn);
      assert.equal(e.Message, 'bad ' + fn, fn);
    }
  });
});

describe('[Inspection::submitTos / getSubmitTos / getEmployeeLists] function test', () => {
  const mock = createMock(cw10.Cityworks);

  it('should only send the options that are set for submitTos', async () => {
    mock.on('Ams/Inspection/SubmitTos', () => [{EmployeeSid: 1}]);
    assert.deepEqual(await cw10.inspection.submitTos(), [{EmployeeSid: 1}]);
    assert.deepEqual(mock.lastCall('Ams/Inspection/SubmitTos').data, {});
    await cw10.inspection.submitTos(true, [4, 5]);
    assert.deepEqual(mock.lastCall('Ams/Inspection/SubmitTos').data, {IncludeInactiveEmployees: true, DomainIds: [4, 5]});
  });

  it('should always send IncludeInactiveEmployees for getSubmitTos and getEmployeeLists', async () => {
    mock.on('Ams/Inspection/SubmitTos', () => [{EmployeeSid: 2}]);
    assert.deepEqual(await cw10.inspection.getSubmitTos(), [{EmployeeSid: 2}]);
    assert.deepEqual(mock.lastCall('Ams/Inspection/SubmitTos').data, {IncludeInactiveEmployees: false});
    await cw10.inspection.getEmployeeLists('SubmitTos', true, [3]);
    assert.deepEqual(mock.lastCall('Ams/Inspection/SubmitTos').data, {IncludeInactiveEmployees: true, DomainIds: [3]});
    await cw10.inspection.getEmployeeLists('SubmitTos', false, null);
    assert.deepEqual(mock.lastCall('Ams/Inspection/SubmitTos').data, {IncludeInactiveEmployees: false});
  });

  it('should reject an unknown list type without calling the API', async () => {
    const e = await rejection(cw10.inspection.getEmployeeLists('Other'));
    assert.equal(e.Code, 2);
    assert.equal(e.Message, 'listType must be "SubmitTos".');
    assert.deepEqual(mock.calls, []);
  });

  it('should propagate API errors', async () => {
    mock.onError('Ams/Inspection/SubmitTos', {Code: 5, Message: 'nope'});
    assert.equal((await rejection(cw10.inspection.submitTos())).Code, 5);
    assert.equal((await rejection(cw10.inspection.getSubmitTos())).Code, 5);
  });
});

describe('[Inspection::connectAsset] function test', () => {
  const mock = createMock(cw10.Cityworks);

  it('should send EntityType and EntityUid when both are given', async () => {
    mock.on('Ams/Inspection/AddEntity', () => ({Added: true}));
    const r = await cw10.inspection.connectAsset({EntityType: 'WATERMAIN', EntityUid: 'abc', Entity: {ignored: true}}, 5);
    assert.deepEqual(r, {Added: true});
    assert.deepEqual(mock.lastCall('Ams/Inspection/AddEntity').data, {InspectionId: 5, EntityType: 'WATERMAIN', EntityUid: 'abc'});
  });

  it('should send the Entity object and facility info when provided', async () => {
    mock.on('Ams/Inspection/AddEntity', () => true);
    await cw10.inspection.connectAsset({Entity: {A: 1}}, 6, true, {Facility_Id: 'F1', Level_Id: 'L2'});
    assert.deepEqual(mock.lastCall('Ams/Inspection/AddEntity').data, {InspectionId: 6, Entity: {A: 1}, Facility_Id: 'F1', Level_Id: 'L2'});
  });

  it('should propagate API errors', async () => {
    mock.onError('Ams/Inspection/AddEntity', {Code: 21, Message: 'ErrorUnknownEntityType'});
    const e = await rejection(cw10.inspection.connectAsset({EntityType: 'X', EntityUid: '1'}, 5));
    assert.equal(e.Code, 21);
  });
});

describe('[Inspection::getAnswers] function test', () => {
  const mock = createMock(cw10.Cityworks);

  it('should send the list of InspectionIds', async () => {
    mock.on('Ams/Inspection/Answers', () => [{Answer: 'yes'}]);
    assert.deepEqual(await cw10.inspection.getAnswers([1, 2]), [{Answer: 'yes'}]);
    assert.deepEqual(mock.lastCall('Ams/Inspection/Answers').data, {InspectionIds: [1, 2]});
  });
});

describe('[Inspection::createSearchDefinition] function test', () => {
  const mock = createMock(cw10.Cityworks);

  it('should send the search data as-is without a name', async () => {
    mock.on('Ams/Inspection/CreateSearchDefinition', () => ({SearchId: 1}));
    assert.deepEqual(await cw10.inspection.createSearchDefinition({Status: 'OPEN'}), {SearchId: 1});
    assert.deepEqual(mock.lastCall('Ams/Inspection/CreateSearchDefinition').data, {Status: 'OPEN'});
  });

  it('should add SearchName, SaveDefinition and EnableEurl when a name is given', async () => {
    mock.on('Ams/Inspection/CreateSearchDefinition', () => ({SearchId: 2}));
    await cw10.inspection.createSearchDefinition({Status: 'OPEN'}, 'My search');
    assert.deepEqual(mock.lastCall('Ams/Inspection/CreateSearchDefinition').data, {Status: 'OPEN', SearchName: 'My search', SaveDefinition: true, EnableEurl: true});
    await cw10.inspection.createSearchDefinition({Status: 'OPEN'}, 'My search', undefined, false, false);
    assert.deepEqual(mock.lastCall('Ams/Inspection/CreateSearchDefinition').data, {Status: 'OPEN', SearchName: 'My search', SaveDefinition: false, EnableEurl: false});
  });
});

describe('[Inspection::move] function test', () => {
  const mock = createMock(cw10.Cityworks);

  it('should merge the projection into the payload', async () => {
    mock.on('Ams/Inspection/Move', () => ({Moved: true}));
    assert.deepEqual(await cw10.inspection.move(5, 1.5, 2.5, {WKID: '4326'}), {Moved: true});
    assert.deepEqual(mock.lastCall('Ams/Inspection/Move').data, {InspectionId: 5, X: 1.5, Y: 2.5, WKID: '4326'});
    await cw10.inspection.move(5, 1, 2, {WKT: 'wkt', VcsWKID: '5703'}, 3);
    assert.deepEqual(mock.lastCall('Ams/Inspection/Move').data, {InspectionId: 5, X: 1, Y: 2, Z: 3, WKT: 'wkt', VcsWKID: '5703'});
  });

  it('should reject when neither WKID nor WKT is provided', async () => {
    mock.on('Ams/Inspection/Move', () => true);
    const e = await rejection(cw10.inspection.move(5, 1, 2, {}));
    assert.equal(e.Code, 3);
    assert.equal(e.Message, 'You must provide either the WKID or WKT for the x/y coordinates.');
  });
});

describe('[Inspection::getTemplates] function test', () => {
  const mock = createMock(cw10.Cityworks);

  it('should default CanCreate to true', async () => {
    mock.on('Ams/InspectionTemplate/Templates', () => [{InspTemplateId: 1}]);
    assert.deepEqual(await cw10.inspection.getTemplates(), [{InspTemplateId: 1}]);
    assert.deepEqual(mock.lastCall('Ams/InspectionTemplate/Templates').data, {CanCreate: true});
  });

  it('should send entity types, CanCreate and extra options', async () => {
    mock.on('Ams/InspectionTemplate/Templates', () => []);
    await cw10.inspection.getTemplates(['A', 'B'], false, {IncludeInactive: true, TemplateIds: [1]});
    assert.deepEqual(mock.lastCall('Ams/InspectionTemplate/Templates').data, {EntityTypes: ['A', 'B'], CanCreate: false, IncludeInactive: true, TemplateIds: [1]});
  });
});

describe('[Inspection::updateMLFs] function test', () => {
  const mock = createMock(cw10.Cityworks);

  it('should use the instance endpoint when a template id is given', async () => {
    const p = 'Ams/TemplateMapLayer/UpdateInspectionInstanceMapLayers';
    mock.on(p, () => ({Ok: 1}));
    assert.deepEqual(await cw10.inspection.updateMLFs(5, {x: 1, y: 2, z: 3}, 9, 4), {Ok: 1});
    assert.deepEqual(mock.lastCall(p).data, {x: 1, y: 2, z: 3, InspTemplateId: 9, InspectionId: 5, DomainId: 4});
  });

  it('should use the by-template endpoint when no template id is given', async () => {
    const p = 'Ams/TemplateMapLayer/UpdateInspectionInstanceMapLayersByTemplate';
    mock.on(p, () => ({Ok: 2}));
    assert.deepEqual(await cw10.inspection.updateMLFs(5, {x: 1, y: 2}), {Ok: 2});
    assert.deepEqual(mock.lastCall(p).data, {x: 1, y: 2, InspectionId: 5});
  });
});

describe('[Inspection::addAttachment] function test', () => {
  const mock = createMock(cw10.Cityworks);

  it('should know it is an inspection attachment instance', () => {
    assert.equal(cw10.inspection.attachments.currentActivityType, 'Inspection');
  });

  it('should return an attachment if attached', async () => {
    mock.on('Ams/Attachments/AddInspectionAttachment', (d) => ({Id: 1, InspectionId: d.InspectionId, Attachment: 'test.pdf'}));
    const r = await cw10.inspection.attachments.add(144882, PDF, 'test.pdf');
    assert.equal(r.Id, 1);
    assert.equal(r.Attachment, 'test.pdf');
    assert.equal(r.InspectionId, 144882);
    const call = mock.lastCall('Ams/Attachments/AddInspectionAttachment');
    assert.deepEqual(call.data, {Filename: 'test.pdf', InspectionId: 144882, AttachmentType: 0});
    assert.equal(call.file, PDF);
  });

  it('should map the attachment type and pass comments', async () => {
    mock.on('Ams/Attachments/AddInspectionAttachment', () => ({Id: 2}));
    await cw10.inspection.attachments.add(5, PDF, 'sig.pdf', 'signature', undefined, 'signed');
    assert.deepEqual(mock.lastCall('Ams/Attachments/AddInspectionAttachment').data, {Filename: 'sig.pdf', Comments: 'signed', InspectionId: 5, AttachmentType: 1});
  });

  it('should propagate API errors', async () => {
    mock.onError('Ams/Attachments/AddInspectionAttachment', {Code: 4, Message: 'denied'});
    const e = await rejection(cw10.inspection.attachments.add(1, PDF, 'test.pdf'));
    assert.equal(e.Code, 4);
  });
});
