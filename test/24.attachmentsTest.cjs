'use strict';
// Mocked tests: no Cityworks instance is contacted.
const path = require('path');
var assert = require('chai').assert;
const cw24 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

const TEST_FILE = path.join(path.dirname(__dirname), 'uploads', 'test.pdf');

describe('[Attachments (construct)] function test', () => {
  it('should expose attachments objects on case/request/workorder/inspection', () => {
    assert.isObject(cw24.briefcase.attachments, 'Case attachments object expected');
    assert.isObject(cw24.request.attachments, 'Request attachments object expected');
    assert.isObject(cw24.workorder.attachments, 'WorkOrder attachments object expected');
    assert.isObject(cw24.inspection.attachments, 'Inspection attachments object expected');
  });

  it('should set correct currentActivityType values', () => {
    assert.equal(cw24.briefcase.attachments.currentActivityType, 'Case');
    assert.equal(cw24.request.attachments.currentActivityType, 'Request');
    assert.equal(cw24.workorder.attachments.currentActivityType, 'WorkOrder');
    assert.equal(cw24.inspection.attachments.currentActivityType, 'Inspection');
  });

  it('should expose the download service paths', () => {
    assert.deepEqual(cw24.request.attachments.constructor.downloadUrls(), {
      case: 'Pll/CaseRelDocs/DownloadCaRelDocs',
      inspection: 'Ams/Attachments/DownloadInspectionAttachment',
      request: 'Ams/Attachments/DownloadRequestAttachment',
      workorder: 'Ams/Attachments/DownloadWorkOrderAttachment'
    });
  });
});

describe('[Attachments] mocked function tests', () => {
  const mock = createMock(cw24.Cityworks);
  const expectReject = async (promise) => {
    try {
      await promise;
    } catch (e) {
      return e;
    }
    assert.fail('should have rejected');
  };
  // An Attachments object with an unsupported activity type
  const unknownType = () => new cw24.request.attachments.constructor(cw24.request.attachments.cw, 'Bogus');

  describe('getByNodesId', () => {
    it('should retrieve case related docs by case ID (not wrapped in an array)', async () => {
      mock.on('Pll/CaseRelDocs/ByCaObjectId', () => [{CaRelDocId: 1}]);
      const r = await cw24.briefcase.attachments.getByNodesId(100);
      assert.deepEqual(r, [{CaRelDocId: 1}]);
      assert.deepEqual(mock.lastCall('Pll/CaseRelDocs/ByCaObjectId').data, {CaObjectId: 100});
    });

    it('should retrieve request attachments by request ID', async () => {
      mock.on('Ams/Attachments/RequestAttachments', () => [{AttachmentId: 1}]);
      const r = await cw24.request.attachments.getByNodesId(500);
      assert.deepEqual(r, [{AttachmentId: 1}]);
      assert.deepEqual(mock.lastCall('Ams/Attachments/RequestAttachments').data, {RequestIds: [500]});
    });

    it('should use WorkOrderSids for numeric ids', async () => {
      mock.on('Ams/Attachments/WorkOrderAttachments', () => []);
      const r = await cw24.workorder.attachments.getByNodesId([100196]);
      assert.deepEqual(r, []);
      assert.deepEqual(mock.lastCall('Ams/Attachments/WorkOrderAttachments').data, {WorkOrderSids: [100196]});
    });

    it('should use WorkOrderIds for string ids', async () => {
      mock.on('Ams/Attachments/WorkOrderAttachments', () => []);
      await cw24.workorder.attachments.getByNodesId(['WO-1']);
      assert.deepEqual(mock.lastCall('Ams/Attachments/WorkOrderAttachments').data, {WorkOrderIds: ['WO-1']});
    });

    it('should retrieve inspection attachments by ID list', async () => {
      mock.on('Ams/Attachments/InspectionAttachments', () => [{AttachmentId: 3}]);
      const r = await cw24.inspection.attachments.getByNodesId([144882]);
      assert.deepEqual(r, [{AttachmentId: 3}]);
      assert.deepEqual(mock.lastCall('Ams/Attachments/InspectionAttachments').data, {InspectionIds: [144882]});
    });

    it('should alias getAttachments and getRelatedDocs to getByNodesId', async () => {
      mock.on('Ams/Attachments/RequestAttachments', () => []);
      mock.on('Pll/CaseRelDocs/ByCaObjectId', () => []);
      await cw24.request.attachments.getAttachments([1, 2]);
      await cw24.briefcase.attachments.getRelatedDocs(7);
      assert.deepEqual(mock.lastCall('Ams/Attachments/RequestAttachments').data, {RequestIds: [1, 2]});
      assert.deepEqual(mock.lastCall('Pll/CaseRelDocs/ByCaObjectId').data, {CaObjectId: 7});
    });

    it('should propagate API errors', async () => {
      mock.onError('Ams/Attachments/InspectionAttachments', {Message: 'boom'});
      const e = await expectReject(cw24.inspection.attachments.getByNodesId([1]));
      assert.equal(e.Message, 'boom');
    });

    it('should reject for an unknown activity type', async () => {
      const e = await expectReject(unknownType().getByNodesId(1));
      assert.equal(e.Code, 132);
    });
  });

  describe('add', () => {
    it('should add request attachment', async () => {
      mock.on('Ams/Attachments/AddRequestAttachment', () => ({Id: 11}));
      const r = await cw24.request.attachments.add(500, TEST_FILE, 'test.pdf');
      assert.deepEqual(r, {Id: 11});
      const c = mock.lastCall('Ams/Attachments/AddRequestAttachment');
      assert.deepEqual(c.data, {Filename: 'test.pdf', RequestId: 500});
      assert.equal(c.file, TEST_FILE);
    });

    it('should add workorder attachment by workorder ID string', async () => {
      mock.on('Ams/Attachments/AddWorkOrderAttachment', () => ({Id: 12}));
      const r = await cw24.workorder.attachments.add('WO-100', TEST_FILE, 'test.pdf', 'attachment', 4, 'a comment');
      assert.deepEqual(r, {Id: 12});
      const c = mock.lastCall('Ams/Attachments/AddWorkOrderAttachment');
      assert.deepEqual(c.data, {Filename: 'test.pdf', Comments: 'a comment', WorkOrderId: 'WO-100', TaskId: 4, AttachmentType: 0});
      assert.equal(c.file, TEST_FILE);
    });

    it('should add workorder attachment by numeric sid and map the attachment type', async () => {
      mock.on('Ams/Attachments/AddWorkOrderAttachment', () => ({}));
      await cw24.workorder.attachments.add(100196, 'http://example.test/', undefined, 'url');
      assert.deepEqual(mock.lastCall('Ams/Attachments/AddWorkOrderAttachment').data, {WorkOrderSid: 100196, AttachmentType: 2});
    });

    it('should add inspection attachment with attachment type', async () => {
      mock.on('Ams/Attachments/AddInspectionAttachment', () => ({Id: 13}));
      const r = await cw24.inspection.attachments.add(144882, TEST_FILE, 'test.pdf', 'signature');
      assert.deepEqual(r, {Id: 13});
      const c = mock.lastCall('Ams/Attachments/AddInspectionAttachment');
      assert.deepEqual(c.data, {Filename: 'test.pdf', InspectionId: 144882, AttachmentType: 1});
      assert.equal(c.file, TEST_FILE);
    });

    it('should add case attachment with label text', async () => {
      mock.on('Pll/CaseRelDocs/Add', () => ([{ReldocsId: 14, Name: 'test.pdf'}]));
      const r = await cw24.briefcase.attachments.add(100, TEST_FILE, 'test.pdf', 'attachment', undefined, 'note', 'Label');
      assert.deepEqual(r, [{ReldocsId: 14, Name: 'test.pdf'}]);
      assert.deepEqual(mock.lastCall('Pll/CaseRelDocs/Add').data, {Filename: 'test.pdf', Comments: 'note', LabelText: 'Label', CaObjectId: 100});
    });

    it('should not send LabelText for non-case attachments', async () => {
      mock.on('Ams/Attachments/AddRequestAttachment', () => ({}));
      await cw24.request.attachments.add(500, TEST_FILE, 'test.pdf', 'attachment', undefined, undefined, 'Label');
      assert.notProperty(mock.lastCall('Ams/Attachments/AddRequestAttachment').data, 'LabelText');
    });

    it('should propagate API errors', async () => {
      mock.onError('Ams/Attachments/AddRequestAttachment', {Message: 'upload failed'});
      const e = await expectReject(cw24.request.attachments.add(500, TEST_FILE, 'test.pdf'));
      assert.equal(e.Message, 'upload failed');
    });

    it('should reject for an unknown activity type', async () => {
      const e = await expectReject(unknownType().add(1, TEST_FILE));
      assert.equal(e.Code, 132);
    });
  });

  describe('getById', () => {
    it('should call getById for request attachments', async () => {
      mock.on('Ams/Attachments/RequestAttachmentById', () => ({AttachmentId: 1}));
      const r = await cw24.request.attachments.getById(1);
      assert.deepEqual(r, {AttachmentId: 1});
      assert.deepEqual(mock.lastCall('Ams/Attachments/RequestAttachmentById').data, {AttachmentId: 1});
    });

    it('should call the inspection and workorder endpoints', async () => {
      mock.on('Ams/Attachments/InspectionAttachmentById', () => ({}));
      mock.on('Ams/Attachments/WorkOrderAttachmentById', () => ({}));
      await cw24.inspection.attachments.getById(2);
      await cw24.workorder.attachments.getById(3);
      assert.deepEqual(mock.lastCall('Ams/Attachments/InspectionAttachmentById').data, {AttachmentId: 2});
      assert.deepEqual(mock.lastCall('Ams/Attachments/WorkOrderAttachmentById').data, {AttachmentId: 3});
    });

    it('should reject with 133 for case attachments', async () => {
      const e = await expectReject(cw24.briefcase.attachments.getById(1));
      assert.equal(e.Code, 133);
    });

    it('should propagate API errors', async () => {
      mock.onError('Ams/Attachments/RequestAttachmentById', {Message: 'missing'});
      const e = await expectReject(cw24.request.attachments.getById(1));
      assert.equal(e.Message, 'missing');
    });
  });

  describe('update', () => {
    it('should call update for request attachments', async () => {
      mock.on('Ams/Attachments/UpdateRequestAttachment', () => ({AttachmentId: 1, Title: 'Updated Title'}));
      const r = await cw24.request.attachments.update(1, 'Updated Title', 'Updated Description');
      assert.equal(r.Title, 'Updated Title');
      assert.deepEqual(mock.lastCall('Ams/Attachments/UpdateRequestAttachment').data, {Title: 'Updated Title', Description: 'Updated Description', AttachmentId: 1});
    });

    it('should call the inspection and workorder endpoints', async () => {
      mock.on('Ams/Attachments/UpdateInspectionAttachment', () => ({}));
      mock.on('Ams/Attachments/UpdateWorkOrderAttachment', () => ({}));
      await cw24.inspection.attachments.update(2, 'T');
      await cw24.workorder.attachments.update(3, undefined, 'D');
      assert.deepEqual(mock.lastCall('Ams/Attachments/UpdateInspectionAttachment').data, {Title: 'T', AttachmentId: 2});
      assert.deepEqual(mock.lastCall('Ams/Attachments/UpdateWorkOrderAttachment').data, {Description: 'D', AttachmentId: 3});
    });

    it('should use CaRelDocId and LabelText for case attachments', async () => {
      mock.on('Pll/CaseRelDocs/Update', () => ({}));
      await cw24.briefcase.attachments.update(5, 'T', 'D', 'Label');
      assert.deepEqual(mock.lastCall('Pll/CaseRelDocs/Update').data, {Title: 'T', Description: 'D', LabelText: 'Label', CaRelDocId: 5});
    });

    it('should propagate API errors and reject unknown types', async () => {
      mock.onError('Ams/Attachments/UpdateRequestAttachment', {Message: 'nope'});
      const e = await expectReject(cw24.request.attachments.update(1, 'T'));
      assert.equal(e.Message, 'nope');
      const e2 = await expectReject(unknownType().update(1, 'T'));
      assert.equal(e2.Code, 132);
    });
  });

  describe('delete', () => {
    it('should wrap a single request attachment ID in an array and resolve the full response', async () => {
      mock.on('Ams/Attachments/DeleteRequestAttachments', () => undefined);
      const r = await cw24.request.attachments.delete(1);
      assert.isTrue(r);
      assert.deepEqual(mock.lastCall('Ams/Attachments/DeleteRequestAttachments').data, {AttachmentIds: [1]});
    });

    it('should pass arrays of IDs for inspection and workorder attachments', async () => {
      mock.on('Ams/Attachments/DeleteInspectionAttachments', () => undefined);
      mock.on('Ams/Attachments/DeleteWorkOrderAttachments', () => undefined);
      await cw24.inspection.attachments.delete([1, 2]);
      await cw24.workorder.attachments.delete(3);
      assert.deepEqual(mock.lastCall('Ams/Attachments/DeleteInspectionAttachments').data, {AttachmentIds: [1, 2]});
      assert.deepEqual(mock.lastCall('Ams/Attachments/DeleteWorkOrderAttachments').data, {AttachmentIds: [3]});
    });

    it('should delete only the first ID for case attachments', async () => {
      mock.on('Pll/CaseRelDocs/Delete', () => undefined);
      await cw24.briefcase.attachments.delete([8, 9]);
      assert.deepEqual(mock.lastCall('Pll/CaseRelDocs/Delete').data, {CaRelDocId: 8});
    });

    it('should propagate API errors and reject unknown types', async () => {
      mock.onError('Ams/Attachments/DeleteRequestAttachments', {Message: 'nope'});
      const e = await expectReject(cw24.request.attachments.delete(1));
      assert.equal(e.Message, 'nope');
      const e2 = await expectReject(unknownType().delete(1));
      assert.equal(e2.Code, 132);
    });
  });

  describe('download', () => {
    it('should call download for request attachments and resolve the raw response', async () => {
      const body = Buffer.from('dummy');
      mock.onRaw('Ams/Attachments/DownloadRequestAttachment', () => body);
      const r = await cw24.request.attachments.download(1);
      assert.strictEqual(r, body);
      assert.deepEqual(mock.lastCall('Ams/Attachments/DownloadRequestAttachment').data, {AttachmentId: 1});
    });

    it('should use the matching endpoint and id key per activity type', async () => {
      mock.onRaw('Pll/CaseRelDocs/DownloadCaRelDocs', () => 'c');
      mock.onRaw('Ams/Attachments/DownloadInspectionAttachment', () => 'i');
      mock.onRaw('Ams/Attachments/DownloadWorkOrderAttachment', () => 'w');
      assert.equal(await cw24.briefcase.attachments.download(1), 'c');
      assert.equal(await cw24.inspection.attachments.download(2), 'i');
      assert.equal(await cw24.workorder.attachments.download(3), 'w');
      assert.deepEqual(mock.lastCall('Pll/CaseRelDocs/DownloadCaRelDocs').data, {CaRelDocsId: 1, Thumbnail: false});
      assert.deepEqual(mock.lastCall('Ams/Attachments/DownloadInspectionAttachment').data, {AttachmentId: 2});
      assert.deepEqual(mock.lastCall('Ams/Attachments/DownloadWorkOrderAttachment').data, {AttachmentId: 3});
    });

    it('should allow explicit case thumbnail downloads', async () => {
      mock.onRaw('Pll/CaseRelDocs/DownloadCaRelDocs', () => 'thumbnail');
      assert.equal(await cw24.briefcase.attachments.download(1, true), 'thumbnail');
      assert.deepEqual(mock.lastCall('Pll/CaseRelDocs/DownloadCaRelDocs').data, {CaRelDocsId: 1, Thumbnail: true});
    });

    it('should propagate API errors and reject unknown types', async () => {
      mock.onError('Ams/Attachments/DownloadRequestAttachment', {Message: 'nope'});
      const e = await expectReject(cw24.request.attachments.download(1));
      assert.equal(e.Message, 'nope');
      const e2 = await expectReject(unknownType().download(1));
      assert.equal(e2.Code, 132);
    });
  });

  describe('tags', () => {
    it('should get available attachment tags', async () => {
      const tags = [{TagId: 1, TagText: 'TestTag'}];
      mock.on('Pll/AttachmentTags/GetAll', () => tags);
      const r = await cw24.briefcase.attachments.getTags();
      assert.deepEqual(r, tags);
      assert.deepEqual(mock.lastCall('Pll/AttachmentTags/GetAll').data, {});
    });

    it('should call setTags for case attachments', async () => {
      mock.on('Pll/AttachmentActivityTags/SyncTags', () => ({Synced: true}));
      const r = await cw24.briefcase.attachments.setTags(1, [{tagid: 1, tagtext: 'TestTag'}], 'Case');
      assert.deepEqual(r, {Synced: true});
      assert.deepEqual(mock.paths(), ['Pll/AttachmentActivityTags/SyncTags']);
      assert.deepEqual(mock.lastCall('Pll/AttachmentActivityTags/SyncTags').data, {AttachmentId: 1, Tags: [{tagid: 1, tagtext: 'TestTag'}]});
    });

    it('should reject setTags for non-Case attachments without calling the API', async () => {
      const e = await expectReject(cw24.request.attachments.setTags(1, [], 'Request'));
      assert.equal(e.Code, 132);
      assert.deepEqual(mock.paths(), []);
    });

    it('should propagate setTags API errors', async () => {
      mock.onError('Pll/AttachmentActivityTags/SyncTags', {Message: 'nope'});
      const e = await expectReject(cw24.briefcase.attachments.setTags(1, [], 'Case'));
      assert.equal(e.Message, 'nope');
    });
  });
});
