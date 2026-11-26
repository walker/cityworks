'use strict';
// Mocked tests: no Cityworks instance is contacted.
const assert = require('chai').assert;
const cw13 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

const PDF = '%PDF-1.7 fake report contents';

async function rejection(promise) {
  try {
    await promise;
  } catch (e) {
    return e;
  }
  assert.fail('should have rejected');
}

describe('[Report::Print] (General Print) function test', () => {
  const mock = createMock(cw13.Cityworks);

  it('should reject if the type is not found, without calling the API', async () => {
    const e = await rejection(cw13.report.print('briefcase', 171018));
    assert.equal(e.Code, 405);
    assert.equal(e.Message, 'Invalid type provided. Must be case, workorder, inspection, or request.');
    assert.deepEqual(mock.calls, []);
  });

  it('should reject if the node is not a nonzero number, without calling the API', async () => {
    for (const bad of [0, -3, NaN, undefined, null]) {
      const e = await rejection(cw13.report.print('case', bad));
      assert.equal(e.Code, 406);
      assert.equal(e.Message, 'Invalid node_id provided. Must be a number greater than 0.');
    }
    assert.deepEqual(mock.calls, []);
  });

  it('should skip the template lookup when a filename is provided and name the output after the node', async () => {
    mock.onRaw('Ams/Reports/DownloadSrReport', PDF);
    const r = await cw13.report.print('request', 55, 'CustomSR');
    assert.deepEqual(mock.paths(), ['Ams/Reports/DownloadSrReport']);
    assert.deepEqual(mock.lastCall('Ams/Reports/DownloadSrReport').data, {FileName: 'CustomSR', RequestId: 55});
    assert.deepEqual(r, {file: PDF, name: 'Request_55.pdf'});
  });

  it('should reject with the parsed JSON when the download returns an error document instead of a PDF', async () => {
    mock.onRaw('Ams/Reports/DownloadWoReport', JSON.stringify({Status: 1, Message: 'Report failed'}));
    const e = await rejection(cw13.report.print('workorder', 7, 'x'));
    assert.equal(e.Message, 'Report failed');
  });

  it('should propagate download errors', async () => {
    mock.onError('Ams/Reports/DownloadInspReport', {Message: 'Could not find report'});
    const e = await rejection(cw13.report.print('inspection', 7, 'x'));
    assert.include(e.Message, 'Could not find report');
  });
});

describe('[Report::SRPrint] (Service Request Print) function test', () => {
  const mock = createMock(cw13.Cityworks);

  beforeEach(() => {
    mock.on('Ams/ServiceRequest/ById', (d) => ({RequestId: d.RequestId, ProblemSid: 309}));
  });

  it('should reject with an error if the service request type does not have a print report available and a report filename is not provided', async () => {
    mock.on('Ams/ServiceRequest/problemLeafBySid', {ProblemSid: 309, Description: 'Pothole'});
    const e = await rejection(cw13.report.print('request', 1205001));
    assert.equal(e.Code, 404);
    assert.equal(e.Message, 'No print template defined for this service request');
    assert.notInclude(mock.paths(), 'Ams/Reports/DownloadSrReport');
  });

  it('should treat a null or empty print template as missing', async () => {
    for (const tmpl of [null, '']) {
      mock.on('Ams/ServiceRequest/problemLeafBySid', {ProblemSid: 309, SRPrintTmpt: tmpl});
      const e = await rejection(cw13.report.print('request', 5));
      assert.equal(e.Message, 'No print template defined for this service request');
    }
  });

  it('should reject with an error if the service request print template file could not be found.', async () => {
    mock.on('Ams/ServiceRequest/problemLeafBySid', {SRPrintTmpt: 'Missing', Description: 'Pothole'});
    mock.onError('Ams/Reports/DownloadSrReport', {Message: 'Could not find report template'});
    const e = await rejection(cw13.report.print('request', 1991421));
    assert.include(e.Message, 'Could not find report');
  });

  it('should provide a PDF string and filename if the service request print template and node are available', async () => {
    mock.on('Ams/ServiceRequest/problemLeafBySid', {SRPrintTmpt: 'SRPrint', Description: 'Water leak - main'});
    mock.onRaw('Ams/Reports/DownloadSrReport', PDF);
    const r = await cw13.report.print('request', 1998321);
    assert.deepEqual(mock.paths(), ['Ams/ServiceRequest/ById', 'Ams/ServiceRequest/problemLeafBySid', 'Ams/Reports/DownloadSrReport']);
    assert.deepEqual(mock.lastCall('Ams/ServiceRequest/ById').data, {RequestId: 1998321});
    assert.deepEqual(mock.lastCall('Ams/ServiceRequest/problemLeafBySid').data, {ProblemSid: 309});
    assert.deepEqual(mock.lastCall('Ams/Reports/DownloadSrReport').data, {FileName: 'SRPrint', RequestId: 1998321});
    assert.equal(r.file, PDF);
    assert.equal(r.name, 'Request_1998321_Water_Leak_Main.pdf');
  });

  it('should propagate errors from the request lookup', async () => {
    mock.onError('Ams/ServiceRequest/ById', {Message: 'No such request'});
    const e = await rejection(cw13.report.print('request', 3));
    assert.include(e.Message, 'No such request');
  });
});

describe('[Report::WOPrint] (Work Order Print) function test', () => {
  const mock = createMock(cw13.Cityworks);

  beforeEach(() => {
    mock.on('Ams/WorkOrder/BySid', (d) => ({WorkOrderSid: d.WorkOrderSid, WOTemplateId: 'WOT1'}));
  });

  it('should reject with an error if the work order type does not have a print report available and a report filename is not provided', async () => {
    mock.on('Ams/WorkOrderTemplate/byIds', [{WOTemplateId: 'WOT1', Description: 'Repair'}]);
    const e = await rejection(cw13.report.print('workorder', 10000));
    assert.equal(e.Code, 404);
    assert.equal(e.Message, 'No print template defined for this work order');
  });

  it('should reject with an error if the Work Order print template file could not be found.', async () => {
    mock.on('Ams/WorkOrderTemplate/byIds', [{WOPrintTmpt: 'Missing', Description: 'Repair'}]);
    mock.onError('Ams/Reports/DownloadWoReport', {Message: 'Could not find report template'});
    const e = await rejection(cw13.report.print('workorder', 263066));
    assert.include(e.Message, 'Could not find report');
  });

  it('should provide a PDF string and filename if the work order print template and node are available', async () => {
    mock.on('Ams/WorkOrderTemplate/byIds', [{WOPrintTmpt: 'WOPrint', Description: 'Repair'}]);
    mock.onRaw('Ams/Reports/DownloadWoReport', PDF);
    const r = await cw13.report.print('workorder', 263076);
    assert.deepEqual(mock.lastCall('Ams/WorkOrder/BySid').data, {WorkOrderSid: 263076});
    assert.deepEqual(mock.lastCall('Ams/WorkOrderTemplate/byIds').data, {WOTemplateIds: ['WOT1']});
    assert.deepEqual(mock.lastCall('Ams/Reports/DownloadWoReport').data, {FileName: 'WOPrint', WorkOrderId: 263076});
    assert.equal(r.file, PDF);
    assert.equal(r.name, 'Workorder_263076_Repair.pdf');
  });
});

describe('[Report::InspPrint] (Inspection Print) function test', () => {
  const mock = createMock(cw13.Cityworks);

  beforeEach(() => {
    mock.on('Ams/Inspection/ById', (d) => ({InspectionId: d.InspectionId, InspTemplateId: 'IT1'}));
  });

  it('should reject with an error if the inspection type does not have a print report available and a report filename is not provided', async () => {
    mock.on('Ams/InspectionTemplate/byIds', [{InspTemplateId: 'IT1', Description: 'Hydrant'}]);
    const e = await rejection(cw13.report.print('inspection', 170800));
    assert.equal(e.Code, 404);
    assert.equal(e.Message, 'No print template defined for this inspection type.');
  });

  it('should reject with an error if the Inspection print template file could not be found.', async () => {
    mock.on('Ams/InspectionTemplate/byIds', [{PrintTemplate: 'Missing', Description: 'Hydrant'}]);
    mock.onError('Ams/Reports/DownloadInspReport', {Message: 'Could not find report template'});
    const e = await rejection(cw13.report.print('inspection', 170500));
    assert.include(e.Message, 'Could not find report');
  });

  it('should provide a PDF string and filename if the inspection print template and node are available', async () => {
    mock.on('Ams/InspectionTemplate/byIds', [{PrintTemplate: 'InspPrint', Description: 'Hydrant'}]);
    mock.onRaw('Ams/Reports/DownloadInspReport', PDF);
    const r = await cw13.report.print('inspection', 171018);
    assert.deepEqual(mock.lastCall('Ams/Inspection/ById').data, {InspectionId: 171018});
    assert.deepEqual(mock.lastCall('Ams/InspectionTemplate/byIds').data, {InspTemplateIds: ['IT1']});
    assert.deepEqual(mock.lastCall('Ams/Reports/DownloadInspReport').data, {FileName: 'InspPrint', InspectionId: 171018});
    assert.equal(r.file, PDF);
    assert.equal(r.name, 'Inspection_171018_Hydrant.pdf');
  });

  it('should propagate errors from the inspection template lookup', async () => {
    mock.onError('Ams/InspectionTemplate/byIds', {Message: 'Activity type provided does not exist.'});
    const e = await rejection(cw13.report.print('inspection', 171018));
    assert.equal(e.Message, 'Activity type provided does not exist.');
  });
});

describe('[Report::CasePrint] (Case Print) function test', () => {
  const mock = createMock(cw13.Cityworks);

  beforeEach(() => {
    mock.on('Pll/CaseObject/ByIds', (d) => d.CaObjectIds.map(id => ({CaObjectId: id, CaseNumber: 'BP-2024-001'})));
  });

  it('should reject with an error if the case type does not have a print report available and a report filename is not provided', async () => {
    for (const templates of [null, [{ReportName: '', FileName: 'x.rpt'}], [{FileName: 'x.rpt'}]]) {
      mock.on('Pll/BusinessCaseReports/ByCaObjectId', templates);
      const e = await rejection(cw13.report.print('case', 4777));
      assert.equal(e.Code, 404);
      assert.include(e.Message, 'No print template defined for this case');
    }
    assert.notInclude(mock.paths(), 'Pll/BusinessCaseReports/Download');
  });

  it('should reject with an error if the case print template file could not be found.', async () => {
    mock.on('Pll/BusinessCaseReports/ByCaObjectId', [{ReportName: 'Permit', FileName: 'Missing.rpt'}]);
    mock.onError('Pll/BusinessCaseReports/Download', {Message: 'Could not find report template'});
    const e = await rejection(cw13.report.print('case', 107192));
    assert.include(e.Message, 'Could not find report');
  });

  it('should provide a PDF string and filename if the case print template and node are available', async () => {
    mock.on('Pll/BusinessCaseReports/ByCaObjectId', [{ReportName: 'Building Permit', FileName: 'BuildingPermit.rpt'}, {ReportName: 'Other', FileName: 'Other.rpt'}]);
    mock.onRaw('Pll/BusinessCaseReports/Download', PDF);
    const r = await cw13.report.print('case', 28770);
    assert.deepEqual(mock.lastCall('Pll/CaseObject/ByIds').data, {CaObjectIds: [28770]});
    assert.deepEqual(mock.lastCall('Pll/BusinessCaseReports/ByCaObjectId').data, {CaObjectId: 28770});
    assert.deepEqual(mock.lastCall('Pll/BusinessCaseReports/Download').data, {FileName: 'BuildingPermit', PermitId: 28770});
    assert.equal(r.file, PDF);
    // the case number replaces the default Case_<id> prefix
    assert.equal(r.name, 'BP-2024-001_Building_Permit.pdf');
  });

  it('should fall back to the node name when the case has no case number', async () => {
    mock.on('Pll/CaseObject/ByIds', [{CaObjectId: 9}]);
    mock.on('Pll/BusinessCaseReports/ByCaObjectId', [{ReportName: 'Permit', FileName: 'P.rpt'}]);
    mock.onRaw('Pll/BusinessCaseReports/Download', PDF);
    const r = await cw13.report.print('case', 9);
    assert.equal(r.name, 'Case_9_Permit.pdf');
  });
});
