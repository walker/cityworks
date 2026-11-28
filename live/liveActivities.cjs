'use strict';
require('dotenv').config({quiet: true, debug: false});
const assert = require('chai').assert;
const fs = require('fs');
const os = require('os');
const path = require('path');
const cw = require('../dist/index.js');

describe('[Live activities] scratch inspection and work-order writes', function() {
  this.timeout(60000);
  let directory;
  let originalRunRequest;
  let inspectionSource;
  let workOrderSource;
  let entityType;
  let workOrderEntityType;
  const observed = new Map();
  const settings = {};
  const positiveSetting = name => {
    const value = Number(process.env[name]);
    assert.isTrue(Number.isSafeInteger(value) && value > 0, name + ' must be a positive integer');
    return value;
  };

  before(async function() {
    if(process.env.CW_LIVE_ACTIVITY_WRITE !== '1') {
      console.log('\n  Skipped: set CW_LIVE_ACTIVITY_WRITE=1 with source IDs and scratch template IDs');
      this.skip();
    }
    const missing = ['cwdomain', 'cwlogin', 'cwpassword'].filter(key => !process.env[key]);
    if(missing.length) throw new Error('Missing live settings: ' + missing.join(', '));
    for(const name of ['CW_LIVE_INSPECTION_SOURCE_ID', 'CW_LIVE_WORKORDER_SOURCE_SID',
      'CW_LIVE_INSPECTION_TEMPLATE_ID', 'CW_LIVE_WORKORDER_TEMPLATE_ID']) {
      settings[name] = positiveSetting(name);
    }
    for(const name of ['CW_LIVE_INSPECTION_ID', 'CW_LIVE_WORKORDER_SID',
      'CW_LIVE_INSPECTION_DISPOSABLE_ID', 'CW_LIVE_WORKORDER_DISPOSABLE_SID',
      'CW_LIVE_INSPECTION_ATTACHMENT_ID', 'CW_LIVE_WORKORDER_ATTACHMENT_ID', 'CW_LIVE_WORKORDER_COMMENT_ID']) {
      if(process.env[name]) settings[name] = positiveSetting(name);
    }
    cw.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath || 'cityworks', version: Number(process.env.cwversion || 23)});
    await cw.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword);
    inspectionSource = await cw.inspection.getById(settings.CW_LIVE_INSPECTION_SOURCE_ID);
    workOrderSource = await cw.workorder.getById(settings.CW_LIVE_WORKORDER_SOURCE_SID);
    assert.strictEqual(inspectionSource.InspectionId, settings.CW_LIVE_INSPECTION_SOURCE_ID);
    assert.strictEqual(workOrderSource.WorkOrderSid, settings.CW_LIVE_WORKORDER_SOURCE_SID);
    entityType = inspectionSource.EntityType;
    assert.isString(entityType);
    assert.isNotEmpty(entityType);
    workOrderEntityType = process.env.CW_LIVE_WORKORDER_ENTITY_TYPE || entityType;
    assert.isNotEmpty(workOrderEntityType.trim(), 'Work-order entity type must not be blank');
    const inspectionTemplates = await cw.inspection.getTemplates([entityType], true);
    const inspectionTemplate = inspectionTemplates.find(record => record.InspTemplateId === settings.CW_LIVE_INSPECTION_TEMPLATE_ID);
    assert.isDefined(inspectionTemplate, 'Inspection template must be creatable for the source entity type');
    assert.strictEqual(inspectionTemplate.DomainId, inspectionSource.DomainId);
    assert.isTrue(inspectionTemplate.IsActive);
    assert.isFalse(inspectionTemplate.RequireAssetOnClose, 'Asset writes are excluded from this suite');
    const workOrderTemplates = await cw.workorder.admin.getTemplates(workOrderEntityType, false, false);
    const workOrderTemplate = workOrderTemplates.find(record => Number(record.WOTemplateId) === settings.CW_LIVE_WORKORDER_TEMPLATE_ID);
    assert.isDefined(workOrderTemplate, 'Work-order template must support the selected entity type');
    assert.strictEqual(workOrderTemplate.DomainId, workOrderSource.DomainId);
    assert.isFalse(workOrderTemplate.Cancel);
    assert.isFalse(workOrderTemplate.RequireAssetOnClose, 'Asset writes are excluded from this suite');
    const rights = await cw.workorder.admin.getTemplateGroupRights([settings.CW_LIVE_WORKORDER_TEMPLATE_ID]);
    assert.isTrue(rights[settings.CW_LIVE_WORKORDER_TEMPLATE_ID].some(record => record.CanAdd), 'Work-order template must grant creation rights');
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cityworks-activities-'));
    originalRunRequest = cw.Cityworks.runRequest;
    cw.Cityworks.runRequest = async function(endpoint, data, file) {
      const response = await originalRunRequest.call(this, endpoint, data, file);
      if(/\/(Create|Update|Move|Cancel|Uncancel|Close|ReOpen|Reopen|Delete|Add|AddInspectionAttachment|UpdateInspectionAttachment|DeleteInspectionAttachments|AddWorkOrderAttachment|UpdateWorkOrderAttachment|DeleteWorkOrderAttachments)$/.test(endpoint)) {
        const value = response === true ? true : response && response.Value;
        const sample = Array.isArray(value) ? value[0] : value;
        observed.set(endpoint, {
          type: value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value,
          keyCount: sample && typeof sample === 'object' ? Object.keys(sample).length : 0
        });
      }
      return response;
    };
  });

  after(function() {
    if(originalRunRequest) cw.Cityworks.runRequest = originalRunRequest;
    for(const [endpoint, shape] of observed) console.log('  Observed ' + endpoint + ': ' + JSON.stringify(shape));
    if(directory) {
      for(const filename of ['inspection.txt', 'workorder.txt']) {
        const file = path.join(directory, filename);
        if(fs.existsSync(file)) fs.unlinkSync(file);
      }
      fs.rmdirSync(directory);
    }
  });

  for(const kind of ['inspection', 'workorder']) {
    describe(kind, function() {
      const inspection = kind === 'inspection';
      const api = cw[kind];
      const idKey = inspection ? 'InspectionId' : 'WorkOrderSid';
      const templateKey = inspection ? 'InspTemplateId' : 'WOTemplateId';
      const prefix = 'Cityworks wrapper ' + kind + ' write test ';
      const mainSetting = inspection ? 'CW_LIVE_INSPECTION_ID' : 'CW_LIVE_WORKORDER_SID';
      const disposableSetting = inspection ? 'CW_LIVE_INSPECTION_DISPOSABLE_ID' : 'CW_LIVE_WORKORDER_DISPOSABLE_SID';
      const attachmentSetting = inspection ? 'CW_LIVE_INSPECTION_ATTACHMENT_ID' : 'CW_LIVE_WORKORDER_ATTACHMENT_ID';
      let marker = prefix + Date.now();
      let id;
      let workOrderId;
      let disposableId;
      let file;
      const read = () => api.getById(id);
      // These work-order lifecycle endpoints take displayed IDs, not SIDs.
      const lifecycleIds = () => [inspection ? id : workOrderId];
      const templateId = () => settings[inspection ? 'CW_LIVE_INSPECTION_TEMPLATE_ID' : 'CW_LIVE_WORKORDER_TEMPLATE_ID'];
      const source = () => inspection ? inspectionSource : workOrderSource;
      const create = async disposable => {
        const result = await api.create({
          [templateKey]: templateId(), EntityType: inspection ? entityType : workOrderEntityType, DomainId: source().DomainId,
          Text1: marker + (disposable ? ' disposable' : '')
        });
        const records = Array.isArray(result) ? result : [result];
        for(const record of records) {
          if(record && record[idKey]) console.log('\n  ' + (disposable ? 'Disposable' : 'Retained') + ' ' + idKey + ': ' + record[idKey] +
            (!inspection ? ' (WorkOrderId: ' + record.WorkOrderId + ')' : ''));
        }
        if(inspection) assert.isFalse(Array.isArray(result), 'Inspection creation returns an object');
        else assert.isArray(result, 'Work-order creation returns an array');
        assert.lengthOf(records, 1, 'Create exactly one scratch record without attaching assets');
        assert.isTrue(Number.isSafeInteger(records[0][idKey]) && records[0][idKey] > 0);
        return records[0];
      };

      before(async function() {
        if(settings[mainSetting]) {
          id = settings[mainSetting];
          assert.notStrictEqual(id, source()[idKey], 'The source must stay read only');
          const existing = await read();
          assert.isString(existing.Text1);
          assert.isTrue(existing.Text1.startsWith(prefix) && !existing.Text1.endsWith(' disposable'), 'Reuse only a labelled main scratch record');
          marker = existing.Text1;
        } else {
          id = (await create(false))[idKey];
        }
        const record = await read();
        assert.strictEqual(Number(record[templateKey]), templateId(), 'Scratch record must use the selected template');
        assert.strictEqual(record.DomainId, source().DomainId);
        if(!inspection) workOrderId = record.WorkOrderId;
        assert.isFalse(record.Cancel, 'A reused scratch record must be uncancelled');
        assert.isFalse(record.IsClosed, 'A reused scratch record must be open');
        if(settings[disposableSetting]) {
          disposableId = settings[disposableSetting];
          assert.notStrictEqual(disposableId, id);
          assert.notStrictEqual(disposableId, source()[idKey]);
          assert.strictEqual((await api.getById(disposableId)).Text1, marker + ' disposable');
        }
        file = path.join(directory, kind + '.txt');
        fs.writeFileSync(file, marker + '\n');
        console.log('\n  Testing retained ' + idKey + ': ' + id + (!inspection ? ' (WorkOrderId: ' + workOrderId + ')' : ''));
      });

      it('creates and reads back the selected template, domain, and scratch label', async () => {
        const record = await read();
        assert.strictEqual(record[idKey], id);
        assert.strictEqual(Number(record[templateKey]), templateId());
        assert.strictEqual(record.DomainId, source().DomainId);
        assert.strictEqual(record.Text1, marker);
      });

      it('updates editable fields and verifies persisted values', async () => {
        const field = 'Resolution';
        await api.update({[idKey]: id, Text1: marker, [field]: marker + ' updated'});
        const record = await read();
        assert.strictEqual(record[field], marker + ' updated');
        assert.strictEqual(record.Text1, marker);
      });

      it('moves the point and reads back projected coordinates', async () => {
        const xKey = inspection ? 'InspX' : 'WOXCoordinate';
        const yKey = inspection ? 'InspY' : 'WOYCoordinate';
        const previous = await read();
        let moved = await api.move(inspection ? id : workOrderId, -80.6, 28.3, {WKID: '4326'}, 0);
        if(Math.abs(previous[xKey] - moved.X) < 0.01 && Math.abs(previous[yKey] - moved.Y) < 0.01) {
          moved = await api.move(inspection ? id : workOrderId, -80.6001, 28.3001, {WKID: '4326'}, 0);
        }
        assert.isNumber(moved.X);
        assert.isNumber(moved.Y);
        const record = await read();
        assert.closeTo(record[xKey], moved.X, 0.01);
        assert.closeTo(record[yKey], moved.Y, 0.01);
        assert.isTrue(Math.abs(previous[xKey] - record[xKey]) > 0.01 || Math.abs(previous[yKey] - record[yKey]) > 0.01, 'Verify an actual location change');
      });

      it('cancels and uncancels with persisted state', async () => {
        try {
          await api.cancel(lifecycleIds(), marker);
          const record = await read();
          assert.isTrue(record.Cancel);
          assert.strictEqual(record.CancelReason, marker);
        } finally {
          if((await read()).Cancel) await api.uncancel(lifecycleIds());
        }
        assert.isFalse((await read()).Cancel);
      });

      it('closes and reopens with persisted state', async function() {
        try {
          await api.close(lifecycleIds());
          assert.isTrue((await read()).IsClosed);
        } catch(error) {
          const messages = (error.message || error.Message || '').trim().split(/\r?\n/);
          if(inspection || !messages.every(message => message === 'Work order ' + workOrderId + ' has incomplete tasks.' ||
            message === 'Work order ' + workOrderId + ' has incomplete required custom fields.')) throw error;
          assert.isFalse((await read()).IsClosed);
          console.log('\n  BLOCKED: close/reopen requires completed tasks/custom fields on WorkOrderSid ' + id);
          this.skip();
        } finally {
          if((await read()).IsClosed) await api.reopen(lifecycleIds());
        }
        assert.isFalse((await read()).IsClosed);
      });

      if(!inspection) {
        it('adds and edits a private comment and reads it back by SID', async () => {
          const added = settings.CW_LIVE_WORKORDER_COMMENT_ID
            ? (await api.comment.get([id])).find(record => record.CommentId === settings.CW_LIVE_WORKORDER_COMMENT_ID)
            : await api.comment.add(id, marker, false);
          assert.isDefined(added, 'The designated comment must belong to the scratch work order');
          assert.isTrue(added.Comments.startsWith(marker), 'Reuse only a labelled test comment');
          assert.isTrue(Number.isSafeInteger(added.CommentId) && added.CommentId > 0);
          console.log('\n  Retained work-order CommentId: ' + added.CommentId);
          await api.comment.update(added.CommentId, marker + ' edited', false);
          const found = (await api.comment.get([id])).find(record => record.CommentId === added.CommentId);
          assert.isDefined(found);
          assert.strictEqual(found.Comments, marker + ' edited');
          assert.isFalse(found.IsPublic);
        });
      }

      it('uploads, edits, lists, and downloads an attachment with identical contents', async () => {
        const added = settings[attachmentSetting]
          ? await api.attachments.getById(settings[attachmentSetting])
          : await api.attachments.add(id, file, kind + '-wrapper.txt', 'attachment', undefined, marker);
        assert.isTrue(Number.isSafeInteger(added.Id) && added.Id > 0);
        console.log('\n  Retained ' + kind + ' AttachmentId: ' + added.Id);
        assert.strictEqual(added[idKey], id, 'The attachment must belong to the scratch record');
        await api.attachments.update(added.Id, marker, marker + ' description');
        const record = await api.attachments.getById(added.Id);
        assert.strictEqual(record.Title, marker);
        assert.strictEqual(record.Description, marker + ' description');
        assert.strictEqual(record[idKey], id);
        assert.strictEqual(await api.attachments.download(added.Id), marker + '\n');
        assert.isTrue((await api.attachments.getByNodesId(id)).some(record => record.Id === added.Id));
      });

      it('deletes a disposable attachment and verifies absence', async () => {
        const added = await api.attachments.add(id, file, kind + '-disposable.txt');
        assert.strictEqual(added[idKey], id);
        assert.isTrue(Number.isSafeInteger(added.Id) && added.Id > 0);
        console.log('\n  Disposable ' + kind + ' AttachmentId: ' + added.Id);
        await api.attachments.delete(added.Id);
        assert.isFalse((await api.attachments.getByNodesId(id)).some(record => record.Id === added.Id));
      });

      it('deletes only a disposable scratch record and verifies absence', async function() {
        if(!disposableId) disposableId = (await create(true))[idKey];
        const disposable = await api.getById(disposableId);
        assert.strictEqual(disposable.Text1, marker + ' disposable');
        try {
          await api.delete([disposableId]);
        } catch(error) {
          const message = error.message || error.Message || '';
          if(!/does not have permissions to delete (inspection|work order|workorder)/i.test(message)) throw error;
          assert.strictEqual((await api.getById(disposableId))[idKey], disposableId);
          console.log('\n  BLOCKED: deletion permission denied; retained disposable ' + idKey + ' ' + disposableId);
          this.skip();
        }
        const remaining = await api.getByIds([disposableId]);
        assert.isArray(remaining);
        assert.isFalse(remaining.some(record => record[idKey] === disposableId), 'Verify deletion by readback, not just the write response');
      });
    });
  }
});
