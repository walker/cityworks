'use strict';
require('dotenv').config({quiet: true, debug: false});
const assert = require('chai').assert;
const cw = require('../dist/index.js');

const missingEnv = ['cwdomain', 'cwlogin', 'cwpassword'].filter(k => !process.env[k]);
const write = process.env.CW_LIVE_INSPECTION_WRITE === '1';
let fixture;
try {
  fixture = JSON.parse(process.env.CW_LIVE_INSPECTION_RELATIONSHIPS || '{}');
} catch(e) {
  throw new Error('CW_LIVE_INSPECTION_RELATIONSHIPS must be valid JSON');
}

describe('[Live inspection relationships] creation and links', function() {
  this.timeout(60000);
  let created;
  let relatedLinkIds;

  before(async function() {
    if(!write) {
      console.log('\n  Skipped: set CW_LIVE_INSPECTION_WRITE=1 with designated scratch records.');
      this.skip();
    }
    if(missingEnv.length) throw new Error('Missing live settings: ' + missingEnv.join(', '));
    if(!fixture || typeof fixture !== 'object' || Array.isArray(fixture)) throw new Error('The inspection relationship fixture must be an object');
    for(const key of ['templateId', 'workOrderSid', 'parentInspectionId', 'requestId']) {
      if(!Number.isSafeInteger(fixture[key]) || fixture[key] <= 0) throw new Error('A positive numeric ' + key + ' is required');
    }
    if(typeof fixture.entityType !== 'string' || !fixture.entityType.trim()) throw new Error('A non-empty entityType is required');
    cw.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion ? Number(process.env.cwversion) : undefined});
    await cw.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword);
  });

  beforeEach(function() {
    created = [];
    relatedLinkIds = [];
  });

  const cases = [
    {name: 'work order', method: 'createFromWorkOrder', key: 'WorkOrderSid', fixture: 'workOrderSid', type: 4, linkType: 2},
    {name: 'parent inspection', method: 'createFromParent', key: 'InspectionId', fixture: 'parentInspectionId', type: 2, linkType: 1},
    {name: 'service request', method: 'createFromServiceRequest', key: 'RequestId', fixture: 'requestId', type: 3, linkType: 2}
  ];

  cases.forEach(test => {
    it('creates an inspection linked to the ' + test.name, async function() {
      const parentId = fixture[test.fixture];
      const payload = {
        EntityType: fixture.entityType,
        InspTemplateId: fixture.templateId,
        Text1: 'Cityworks wrapper live link test ' + Date.now(),
        [test.key]: parentId
      };
      const result = await cw.inspection[test.method](payload);
      const records = Array.isArray(result) ? result : [result];
      created = records.filter(r => r && Number.isSafeInteger(r.InspectionId) && r.InspectionId > 0).map(r => r.InspectionId);
      if(created.length) console.log('      created inspection IDs: ' + created.join(', '));
      assert.isObject(result, 'creation should return one inspection object');
      assert.isFalse(Array.isArray(result), 'creation should not return an array');
      assert.lengthOf(created, 1, 'creation should return an inspection ID');

      const inspectionId = created[0];
      const readback = await cw.inspection.getById(inspectionId);
      assert.equal(readback.InspectionId, inspectionId);
      if(test.key === 'InspectionId') assert.equal(readback.ParentInspId, parentId);
      const links = await cw.activity_link.get('inspection', [inspectionId]);
      assert.isArray(links);
      const matches = links.filter(link => link.SourceType === test.type && link.SourceSid === parentId &&
        link.DestType === 2 && link.DestSid === inspectionId && link.LinkType === test.linkType);
      if(test.linkType === 2) relatedLinkIds = matches.map(link => link.ActivityLinkId);
      assert.isNotEmpty(matches, 'the created inspection should have the expected activity link');
    });
  });

  afterEach(async function() {
    for(const id of created) {
      let deleteFailure;
      try {
        await cw.inspection.delete([id]);
      } catch(e) {
        deleteFailure = (e && (e.Message || e.message)) || String(e);
      }
      const remaining = await cw.inspection.getByIds([id]);
      assert.isArray(remaining, 'cleanup could not verify deletion of inspection ' + id);
      if(!remaining.some(r => r.InspectionId === id)) continue;
      await cw.inspection.cancel([id], 'Cityworks wrapper live link test cleanup');
      const readback = await cw.inspection.getById(id);
      assert.isTrue(readback.Cancel === true || readback.Status === 'CANCEL', 'cleanup could not cancel inspection ' + id);
      console.log('      retained cancelled inspection ' + id + (deleteFailure ? ': ' + deleteFailure : ' (deletion was not confirmed)'));
      for(const linkId of relatedLinkIds) {
        try {
          await cw.Cityworks.runRequest('General/ActivityLink/Delete', {ActivityLinkId: linkId});
          const links = await cw.activity_link.get('inspection', [id]);
          if(links.some(link => link.ActivityLinkId === linkId)) throw new Error('link still exists');
        } catch(e) {
          throw new Error('Could not remove scratch activity link ' + linkId + ': ' + ((e && (e.Message || e.message)) || String(e)));
        }
      }
      if(!relatedLinkIds.length) console.log('      Activity links may remain on the cancelled inspection.');
    }
  });
});
