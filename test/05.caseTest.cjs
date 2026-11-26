'use strict';
// Mocked tests: no Cityworks instance is contacted.
const assert = require('chai').assert;
const cw5 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

async function rejection(promise) {
  try {
    await promise;
  } catch (e) {
    return e;
  }
  assert.fail('should have rejected');
}

describe('[Case (construct)] function test', () => {
  it('should be a defined object', () => {
    assert.isObject(cw5.briefcase, 'Case is an object');
  });
  it('should have a financial property which is a defined object', () => {
    assert.isObject(cw5.briefcase.financial, 'Financial is an object');
  });
  it('should have a data property which is a defined object', () => {
    assert.isObject(cw5.briefcase.data, 'Data is an object');
  });
  it('should have a workflow property which is a defined object', () => {
    assert.isObject(cw5.briefcase.workflow, 'Workflow is an object');
  });
  it('should have a comment property which is a defined object', () => {
    assert.isObject(cw5.briefcase.comment, 'Comment is an object');
  });
  it('should have an admin property which is a defined object', () => {
    assert.isObject(cw5.briefcase.admin, 'Admin is an object');
  });
});

describe('[Case::create] function test', () => {
  const mock = createMock(cw5.Cityworks);

  it('should resolve an object describing the new case', async () => {
    mock.on('Pll/Case/Create', (d) => ({CaObjectId: 501, CaseTypeId: d.CaseTypeId, SubTypeId: d.SubTypeId}));
    const r = await cw5.briefcase.create(51, 93);
    assert.deepEqual(r, {CaObjectId: 501, CaseTypeId: 51, SubTypeId: 93});
    assert.deepEqual(mock.lastCall('Pll/Case/Create').data, {CaseTypeId: 51, SubTypeId: 93});
    assert.equal(cw5.briefcase.current_case, 501);
  });

  it('should merge options into the payload', async () => {
    mock.on('Pll/Case/Create', () => ({CaObjectId: 502}));
    await cw5.briefcase.create(51, 93, {CaseName: 'Dummy', X: 1, Y: 2});
    assert.deepEqual(mock.lastCall('Pll/Case/Create').data, {CaseTypeId: 51, SubTypeId: 93, CaseName: 'Dummy', X: 1, Y: 2});
  });

  it('should propagate API errors', async () => {
    mock.onError('Pll/Case/Create', {Code: 4, Message: 'Not authorized'});
    const e = await rejection(cw5.briefcase.create(999999, 99999999));
    assert.equal(e.Code, 4);
    assert.equal(e.Message, 'Not authorized');
  });
});

describe('[Case::createChild] function test', () => {
  const mock = createMock(cw5.Cityworks);

  it('should resolve an object describing the new case', async () => {
    mock.on('Pll/Case/CreateChild', () => ({CaObjectId: 601, ParentCaObjectId: 107138}));
    const r = await cw5.briefcase.createChild(152, 107138);
    assert.isNotNull(r);
    assert.equal(r.CaObjectId, 601);
    assert.deepEqual(mock.lastCall('Pll/Case/CreateChild').data, {BusCaseId: 152, ParentCaObjectId: 107138});
    assert.equal(cw5.briefcase.current_case, 601);
  });

  it('should merge options and propagate API errors', async () => {
    mock.on('Pll/Case/CreateChild', () => ({CaObjectId: 602}));
    await cw5.briefcase.createChild(152, 1, {CaseName: 'Child'});
    assert.deepEqual(mock.lastCall('Pll/Case/CreateChild').data, {BusCaseId: 152, ParentCaObjectId: 1, CaseName: 'Child'});
    mock.onError('Pll/Case/CreateChild', {Code: 4, Message: 'denied'});
    assert.equal((await rejection(cw5.briefcase.createChild(152, 1))).Code, 4);
  });
});

describe('[Case::createFromRequest] function test', () => {
  const mock = createMock(cw5.Cityworks);

  it('should resolve an object describing the new case', async () => {
    mock.on('Pll/CaseObject/CreateCaseFromServiceRequest', () => ({CaObjectId: 701}));
    const r = await cw5.briefcase.createFromRequest(51, 93, 1, {CaseName: 'From SR'});
    assert.isNotNull(r);
    assert.equal(r.CaObjectId, 701);
    assert.deepEqual(mock.lastCall('Pll/CaseObject/CreateCaseFromServiceRequest').data, {CaseTypeId: 51, SubTypeId: 93, ServiceRequestId: 1, CaseName: 'From SR'});
    assert.equal(cw5.briefcase.current_case, 701);
  });

  it('should propagate API errors', async () => {
    mock.onError('Pll/CaseObject/CreateCaseFromServiceRequest', {Code: 4, Message: 'denied'});
    assert.equal((await rejection(cw5.briefcase.createFromRequest(51, 93, 1))).Code, 4);
  });
});

describe('[Case::update] function test', () => {
  const mock = createMock(cw5.Cityworks);

  it('should resolve an object describing the updated case', async () => {
    mock.on('Pll/CaseObject/Update', (d) => ({CaObjectId: d.CaObjectId, CaseName: d.CaseName}));
    const r = await cw5.briefcase.update(107138, {CaseName: 'Case Update Test'});
    assert.deepEqual(r, {CaObjectId: 107138, CaseName: 'Case Update Test'});
    assert.deepEqual(mock.lastCall('Pll/CaseObject/Update').data, {CaObjectId: 107138, CaseName: 'Case Update Test'});
    assert.equal(cw5.briefcase.current_case, 107138);
  });

  it('should send only the id when no options are given, and propagate errors', async () => {
    mock.on('Pll/CaseObject/Update', (d) => d);
    await cw5.briefcase.update(5);
    assert.deepEqual(mock.lastCall('Pll/CaseObject/Update').data, {CaObjectId: 5});
    mock.onError('Pll/CaseObject/Update', {Code: 60, Message: 'not found'});
    assert.equal((await rejection(cw5.briefcase.update(5))).Code, 60);
  });
});

describe('[Case::getById::] function test', () => {
  const mock = createMock(cw5.Cityworks);

  it('should resolve a single case object for the ID provided', async () => {
    mock.on('Pll/CaseObject/ByIds', (d) => d.CaObjectIds.map(id => ({CaObjectId: id})));
    const rez = await cw5.briefcase.getById(654660);
    assert.isNumber(rez.CaObjectId);
    assert.equal(rez.CaObjectId, 654660);
    assert.deepEqual(mock.lastCall('Pll/CaseObject/ByIds').data, {CaObjectIds: [654660]});
  });

  it('should resolve undefined when no case is returned', async () => {
    mock.on('Pll/CaseObject/ByIds', () => []);
    assert.isUndefined(await cw5.briefcase.getById(1));
  });

  it('should propagate API errors', async () => {
    mock.onError('Pll/CaseObject/ByIds', {Code: 4, Message: 'denied'});
    assert.equal((await rejection(cw5.briefcase.getById(1))).Code, 4);
  });
});

describe('[Case::getByIds] function test', () => {
  const mock = createMock(cw5.Cityworks);

  it('should resolve a collection of a single case object, if only one ID provided', async () => {
    mock.on('Pll/CaseObject/ByIds', (d) => d.CaObjectIds.map(id => ({CaObjectId: id})));
    const rez = await cw5.briefcase.getByIds([106968]);
    assert.isArray(rez);
    assert.deepEqual(rez, [{CaObjectId: 106968}]);
  });

  it('should resolve a collection of a case objects, if multiple IDs provided', async () => {
    mock.on('Pll/CaseObject/ByIds', (d) => d.CaObjectIds.map(id => ({CaObjectId: id})));
    const rez = await cw5.briefcase.getByIds([106968, 106970, 106973]);
    assert.isArray(rez);
    assert.lengthOf(rez, 3);
    assert.deepEqual(mock.lastCall('Pll/CaseObject/ByIds').data, {CaObjectIds: [106968, 106970, 106973]});
  });

  it('should propagate API errors', async () => {
    mock.onError('Pll/CaseObject/ByIds', {Code: 4, Message: 'denied'});
    assert.equal((await rejection(cw5.briefcase.getByIds([1]))).Code, 4);
  });
});

describe('[Case::search] function test', () => {
  const mock = createMock(cw5.Cityworks);

  it('should resolve a collection of case objects meeting the search criteria', async () => {
    mock.on('Pll/CaseObject/Search', () => [{CaObjectId: 1}, {CaObjectId: 2}]);
    const rez = await cw5.briefcase.search({CaseStatus: 'OPEN'});
    assert.isArray(rez);
    assert.lengthOf(rez, 2);
    assert.deepEqual(mock.lastCall('Pll/CaseObject/Search').data, {CaseStatus: 'OPEN'});
  });

  it('should remember the case when exactly one is found', async () => {
    mock.on('Pll/CaseObject/Search', () => [{CaObjectId: 77}]);
    await cw5.briefcase.search({CaseStatus: 'OPEN'});
    assert.equal(cw5.briefcase.current_case, 77);
  });

  it('should propagate API errors', async () => {
    mock.onError('Pll/CaseObject/Search', {Code: 30, Message: 'invalid field'});
    assert.equal((await rejection(cw5.briefcase.search({}))).Code, 30);
  });
});

describe('[Case::getCustomData] function test', () => {
  const mock = createMock(cw5.Cityworks);

  it('should resolve an array of custom data for the case', async () => {
    mock.on('Pll/CaseObject/ByIds', () => [{CaObjectId: 654660, BusCaseId: 152}]);
    mock.on('Pll/CustomColumnsDetail/GetListForAdd', () => [{ColumnName: 'A'}]);
    const caseObj = await cw5.briefcase.getById(654660);
    const r = await cw5.briefcase.getCustomData(caseObj.CaObjectId, caseObj.BusCaseId, 'BUSINESS_CASE');
    assert.isArray(r);
    assert.deepEqual(mock.lastCall('Pll/CustomColumnsDetail/GetListForAdd').data, {PrimaryId: 654660, ConfigurationId: 152, TableName: 'BUSINESS_CASE'});
  });

  it('should be callable and return custom data rows', async () => {
    mock.on('Pll/CustomColumnsDetail/GetListForAdd', () => []);
    const r = await cw5.briefcase.getCustomData(107138, 152, 'CA_OBJECT');
    assert.deepEqual(r, []);
    assert.deepEqual(mock.lastCall('Pll/CustomColumnsDetail/GetListForAdd').data, {PrimaryId: 107138, ConfigurationId: 152, TableName: 'CA_OBJECT'});
  });

  it('should propagate API errors', async () => {
    mock.onError('Pll/CustomColumnsDetail/GetListForAdd', {Code: 4, Message: 'denied'});
    assert.equal((await rejection(cw5.briefcase.getCustomData(1, 2, 'CA_OBJECT'))).Code, 4);
  });
});

describe('[Case::move] function test', () => {
  const mock = createMock(cw5.Cityworks);

  it('should reject when projection is missing WKID and WKT', async () => {
    mock.on('Pll/CaseObject/Move', () => true);
    const e = await rejection(cw5.briefcase.move(107138, -93.0, 44.0, {}));
    assert.equal(e.Code, 1);
    assert.equal(e.Message, 'You must provide either the WKID or WKT for the x/y coordinates.');
  });

  it('should resolve an object describing the moved case', async () => {
    mock.on('Pll/CaseObject/Move', () => ({CaObjectId: 107138, CX: -93.0, CY: 44.0}));
    const r = await cw5.briefcase.move(107138, -93.0, 44.0, {WKID: '4326'});
    assert.deepEqual(r, {CaObjectId: 107138, CX: -93.0, CY: 44.0});
    assert.deepEqual(mock.lastCall('Pll/CaseObject/Move').data, {CaObjectId: 107138, X: -93.0, Y: 44.0, WKID: '4326'});
  });

  it('should include z and the projection when provided', async () => {
    mock.on('Pll/CaseObject/Move', () => ({}));
    await cw5.briefcase.move(1, 2, 3, {WKT: 'wkt', VcsWKID: '5703'}, 4);
    assert.deepEqual(mock.lastCall('Pll/CaseObject/Move').data, {CaObjectId: 1, X: 2, Y: 3, Z: 4, WKT: 'wkt', VcsWKID: '5703'});
  });

  it('should propagate API errors', async () => {
    mock.onError('Pll/CaseObject/Move', {Code: 68, Message: 'invalid wkid'});
    assert.equal((await rejection(cw5.briefcase.move(1, 2, 3, {WKID: '1'}))).Code, 68);
  });
});

describe('[Case::getRequirements] function test', () => {
  const mock = createMock(cw5.Cityworks);

  it('should resolve requirement data for a business case template', async () => {
    mock.on('Pll/CaseReqItems/GetByBusCaseId', () => [{ReqItemId: 1}]);
    assert.deepEqual(await cw5.briefcase.getRequirements(152), [{ReqItemId: 1}]);
    assert.deepEqual(mock.lastCall('Pll/CaseReqItems/GetByBusCaseId').data, {BusCaseId: 152});
  });

  it('should propagate API errors', async () => {
    mock.onError('Pll/CaseReqItems/GetByBusCaseId', {Code: 4, Message: 'denied'});
    assert.equal((await rejection(cw5.briefcase.getRequirements(152))).Code, 4);
  });
});

describe('[Case::MapLayerFields methods] function test', () => {
  const mock = createMock(cw5.Cityworks);

  it('should call getMLFs', async () => {
    mock.on('Ams/TemplateMapLayer/CaseInstanceMapLayersByCaObjectId', () => [{Field: 'a'}]);
    const r = await cw5.briefcase.getMLFs(107138);
    assert.deepEqual(r, [{Field: 'a'}]);
    assert.deepEqual(mock.lastCall('Ams/TemplateMapLayer/CaseInstanceMapLayersByCaObjectId').data, {CaObjectId: 107138});
  });

  it('should call updateMLFs with only the numeric coordinates provided', async () => {
    const p = 'Ams/TemplateMapLayer/UpdateCaseInstanceMapLayers';
    mock.on(p, () => ({Updated: 1}));
    const r = await cw5.briefcase.updateMLFs(107138, -93.0, 44.0, 1);
    assert.deepEqual(r, {Updated: 1});
    assert.deepEqual(mock.lastCall(p).data, {CaObjectId: 107138, X: -93.0, Y: 44.0, DomainId: 1});
    await cw5.briefcase.updateMLFs(107138, undefined, undefined, undefined, 5);
    assert.deepEqual(mock.lastCall(p).data, {CaObjectId: 107138, Z: 5});
  });

  it('should call deleteMLFs', async () => {
    const p = 'Ams/TemplateMapLayer/DeleteCaseInstanceMapLayersByCaObjectId';
    mock.on(p, () => ({Deleted: 1}));
    assert.deepEqual(await cw5.briefcase.deleteMLFs(107138), {Deleted: 1});
    assert.deepEqual(mock.lastCall(p).data, {CaObjectId: 107138});
  });

  it('should propagate API errors', async () => {
    mock.onError('Ams/TemplateMapLayer/CaseInstanceMapLayersByCaObjectId', {Code: 4, Message: 'denied'});
    mock.onError('Ams/TemplateMapLayer/UpdateCaseInstanceMapLayers', {Code: 5, Message: 'denied'});
    mock.onError('Ams/TemplateMapLayer/DeleteCaseInstanceMapLayersByCaObjectId', {Code: 6, Message: 'denied'});
    assert.equal((await rejection(cw5.briefcase.getMLFs(1))).Code, 4);
    assert.equal((await rejection(cw5.briefcase.updateMLFs(1, 1, 1))).Code, 5);
    assert.equal((await rejection(cw5.briefcase.deleteMLFs(1))).Code, 6);
  });
});

describe('[Case::getPrintTemplates] function test', () => {
  const mock = createMock(cw5.Cityworks);

  it('should return report templates for the case', async () => {
    mock.on('Pll/BusinessCaseReports/ByCaObjectId', () => [{FileName: 'Report'}]);
    assert.deepEqual(await cw5.briefcase.getPrintTemplates(107138), [{FileName: 'Report'}]);
    assert.deepEqual(mock.lastCall('Pll/BusinessCaseReports/ByCaObjectId').data, {CaObjectId: 107138});
  });

  it('should propagate API errors', async () => {
    mock.onError('Pll/BusinessCaseReports/ByCaObjectId', {Code: 4, Message: 'denied'});
    assert.equal((await rejection(cw5.briefcase.getPrintTemplates(1))).Code, 4);
  });
});

describe('[Case::lookup methods] function test', () => {
  const mock = createMock(cw5.Cityworks);
  const cases = [
    ['getZips', 'Pll/Zip/GetAll'],
    ['getStates', 'Pll/State/GetList'],
    ['getCountries', 'Pll/Country/GetAll']
  ];

  cases.forEach(([fn, p]) => {
    it(`should call ${fn}`, async () => {
      mock.on(p, () => [{Name: fn}]);
      const r = await cw5.briefcase[fn]();
      assert.isArray(r);
      assert.deepEqual(r, [{Name: fn}]);
      assert.deepEqual(mock.paths(), [p]);
      assert.deepEqual(mock.lastCall(p).data, {});
    });

    it(`should propagate API errors from ${fn}`, async () => {
      mock.onError(p, {Code: 4, Message: 'denied'});
      assert.equal((await rejection(cw5.briefcase[fn]())).Code, 4);
    });
  });
});

describe('[Case::delete] function test', () => {
  const mock = createMock(cw5.Cityworks);

  it('should resolve the 1 (success) or 0 (failure) returned by the API', async () => {
    mock.on('Pll/CaseObject/DeleteCase', () => 1);
    assert.strictEqual(await cw5.briefcase.delete(44069), 1);
    assert.deepEqual(mock.lastCall('Pll/CaseObject/DeleteCase').data, {CaObjectId: 44069});
    mock.on('Pll/CaseObject/DeleteCase', () => 0);
    assert.strictEqual(await cw5.briefcase.delete(44069), 0);
  });

  it('should propagate API errors', async () => {
    mock.onError('Pll/CaseObject/DeleteCase', {Code: 4, Message: 'denied'});
    assert.equal((await rejection(cw5.briefcase.delete(1))).Code, 4);
  });
});

describe('[Case::addDetail] function test', () => {
  const mock = createMock(cw5.Cityworks);

  it('should post the group and detail ids, merging options', async () => {
    mock.on('Pll/CaseDataDetail/Add', () => ({CaDataDetailId: 9}));
    assert.deepEqual(await cw5.briefcase.data.addDetail(10, 20), {CaDataDetailId: 9});
    assert.deepEqual(mock.lastCall('Pll/CaseDataDetail/Add').data, {CaDataGroupId: 10, CaseDataDetailId: 20});
    await cw5.briefcase.data.addDetail(10, 20, {Value: 'x'});
    assert.deepEqual(mock.lastCall('Pll/CaseDataDetail/Add').data, {CaDataGroupId: 10, CaseDataDetailId: 20, Value: 'x'});
  });

  it('should resolve null if the API returns null for unknown ids', async () => {
    mock.on('Pll/CaseDataDetail/Add', () => null);
    assert.isNull(await cw5.briefcase.data.addDetail(999999, 99999999));
  });

  it('should propagate API errors', async () => {
    mock.onError('Pll/CaseDataDetail/Add', {Code: 60, Message: 'not found'});
    assert.equal((await rejection(cw5.briefcase.data.addDetail(1, 2))).Code, 60);
  });
});

describe('[Case::getRelatedDocs] function test', () => {
  const mock = createMock(cw5.Cityworks);
  const p = 'Pll/CaseRelDocs/ByCaObjectId';

  it('should know it is a case attachment instance', () => {
    assert.equal(cw5.briefcase.attachments.currentActivityType, 'Case');
  });

  it('should resolve a collection of related documents for the case provided when the case has documents attached', async () => {
    mock.on(p, () => [{CaRelDocId: 1}, {CaRelDocId: 2}]);
    const r = await cw5.briefcase.attachments.getByNodesId(79986);
    assert.isArray(r);
    assert.lengthOf(r, 2);
    assert.deepEqual(mock.lastCall(p).data, {CaObjectId: 79986});
  });

  it('should resolve an empty collection for the case provided when the case has no documents attached', async () => {
    mock.on(p, () => []);
    assert.isEmpty(await cw5.briefcase.attachments.getRelatedDocs(11611));
    assert.isEmpty(await cw5.briefcase.attachments.getAttachments(11611));
    assert.lengthOf(mock.callsTo(p), 2);
  });

  it('should reject if the API reports the case does not exist', async () => {
    mock.onError(p, {Code: 60, Message: 'Item not found'});
    const e = await rejection(cw5.briefcase.attachments.getByNodesId(321768493624));
    assert.equal(e.Code, 60);
    assert.deepEqual(mock.lastCall(p).data, {CaObjectId: 321768493624});
  });
});

describe('[Case::print] function test', () => {
  const mock = createMock(cw5.Cityworks);
  const p = 'Pll/BusinessCaseReports/Download';

  it('should request the report for the case and resolve the pdf contents with a file name', async () => {
    mock.onRaw(p, '%PDF-1.4 dummy');
    const r = await cw5.briefcase.print(79986, 'CaseReport');
    assert.deepEqual(r, {file: '%PDF-1.4 dummy', name: 'CaseReport.pdf'});
    assert.deepEqual(mock.lastCall(p).data, {CaObjectId: 79986, FileName: 'CaseReport'});
  });

  it('should reject with the error Cityworks returns instead of a pdf', async () => {
    mock.onRaw(p, JSON.stringify({Status: 1, Message: 'Report failed'}));
    const e = await rejection(cw5.briefcase.print(79986, 'Missing'));
    assert.equal(e.Message, 'Report failed');
  });

  it('should propagate API errors', async () => {
    mock.onError(p, {Message: 'nope'});
    assert.equal((await rejection(cw5.briefcase.print(1, 'x'))).Message, 'nope');
  });
});
