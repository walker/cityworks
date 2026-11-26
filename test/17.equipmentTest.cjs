'use strict';
// Mocked tests: no Cityworks instance is contacted.
const assert = require('chai').assert;
const cw17 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

describe('[Equipment (construct)] function test', () => {
  it('should be a defined object', () => {
    assert.isObject(cw17.equipment, 'Equipment is an object');
  });

  it('should expose the changeout, cost and reservation sub-modules', () => {
    assert.isObject(cw17.equipment.changeout);
    assert.isObject(cw17.equipment.cost);
    assert.isObject(cw17.equipment.reservation);
  });
});

describe('[Equipment] mocked request tests', () => {
  const mock = createMock(cw17.Cityworks);

  describe('[Equipment::all] function test', () => {
    beforeEach(() => {
      mock.on('Ams/Equipment/All', [{EquipmentSid: 1}, {EquipmentSid: 2}]);
    });

    it('should request viewable equipment by default', async () => {
      const resp = await cw17.equipment.all();
      assert.isArray(resp, 'Expected response to be an array');
      assert.deepEqual(mock.lastCall('Ams/Equipment/All').data, {ViewableOnly: true});
    });

    it('should return a list including all equipment when viewableOnly is false', async () => {
      const resp = await cw17.equipment.all(false);
      assert.lengthOf(resp, 2);
      assert.deepEqual(mock.lastCall('Ams/Equipment/All').data, {ViewableOnly: false});
    });

    it('should reject when the API fails', async () => {
      mock.onError('Ams/Equipment/All', {Message: 'nope'});
      try {
        await cw17.equipment.all();
        assert.fail('should have rejected');
      } catch (e) {
        assert.include(e.Message, 'nope');
      }
    });
  });

  describe('[Equipment::addEquipment] function test', () => {
    it('should create and return a new equipment record', async () => {
      mock.on('Ams/Equipment/Add', (data) => Object.assign({EquipmentSid: 12}, data));
      const equipment = {EquipmentUid: 'TESTEQ1', Description: 'Test Equipment', Manufacturer: 'Test Manufacturer', Model: 'Model A', ForCheckout: true, Viewable: true};
      const resp = await cw17.equipment.add(equipment);
      assert.deepEqual(mock.lastCall('Ams/Equipment/Add').data, equipment);
      assert.equal(resp.EquipmentSid, 12);
      assert.equal(resp.EquipmentUid, equipment.EquipmentUid);
    });
  });

  describe('[Equipment::updateEquipment] function test', () => {
    beforeEach(() => {
      mock.on('Ams/Equipment/Update', (data) => data.EquipmentSids.map(sid => Object.assign({EquipmentSid: sid}, data)));
    });

    it('should update and return the equipment record, wrapping a single SID in an array', async () => {
      const updated = await cw17.equipment.update(12, {Description: 'Updated Description', Manufacturer: 'Updated Manufacturer'});
      assert.deepEqual(mock.lastCall('Ams/Equipment/Update').data, {EquipmentSids: [12], Description: 'Updated Description', Manufacturer: 'Updated Manufacturer'});
      assert.equal(updated[0].Description, 'Updated Description');
      assert.equal(updated[0].Manufacturer, 'Updated Manufacturer');
    });

    it('should accept multiple SIDs', async () => {
      const updated = await cw17.equipment.update([1, 2], {Viewable: false});
      assert.deepEqual(mock.lastCall('Ams/Equipment/Update').data, {EquipmentSids: [1, 2], Viewable: false});
      assert.lengthOf(updated, 2);
    });

    it('should strip EquipmentSid from the properties', async () => {
      await cw17.equipment.update(12, {Description: 'x', EquipmentSid: 99});
      assert.deepEqual(mock.lastCall('Ams/Equipment/Update').data, {EquipmentSids: [12], Description: 'x'});
    });
  });

  describe('[Equipment::customDataFields] function test', () => {
    it('should send CustFieldIds only when provided', async () => {
      mock.on('Ams/Equipment/CustomDataFields', [{CustFieldId: 3}]);
      assert.deepEqual(await cw17.equipment.customDataFields(5), [{CustFieldId: 3}]);
      assert.deepEqual(mock.lastCall('Ams/Equipment/CustomDataFields').data, {EquipmentSid: 5});
      await cw17.equipment.customDataFields(5, [3, 4]);
      assert.deepEqual(mock.lastCall('Ams/Equipment/CustomDataFields').data, {EquipmentSid: 5, CustFieldIds: [3, 4]});
    });
  });

  describe('[Equipment::getById] function test', () => {
    it('should retrieve a single equipment record by ID via ByIds', async () => {
      mock.on('Ams/Equipment/ByIds', (data) => data.EquipmentSids.map(sid => ({EquipmentSid: sid})));
      const resp = await cw17.equipment.getById(7);
      assert.isObject(resp);
      assert.equal(resp.EquipmentSid, 7);
      assert.deepEqual(mock.paths(), ['Ams/Equipment/ByIds']);
      assert.deepEqual(mock.lastCall('Ams/Equipment/ByIds').data, {EquipmentSids: [7]});
    });

    it('should propagate errors', async () => {
      mock.onError('Ams/Equipment/ByIds', {Message: 'missing'});
      try {
        await cw17.equipment.getById(7);
        assert.fail('should have rejected');
      } catch (e) {
        assert.include(e.Message, 'missing');
      }
    });
  });

  describe('[Equipment::getByIds] function test', () => {
    it('should retrieve equipment by multiple IDs', async () => {
      mock.on('Ams/Equipment/ByIds', (data) => data.EquipmentSids.map(sid => ({EquipmentSid: sid})));
      const resp = await cw17.equipment.getByIds([1, 2, 3]);
      assert.isArray(resp);
      assert.lengthOf(resp, 3);
      assert.deepEqual(mock.lastCall('Ams/Equipment/ByIds').data, {EquipmentSids: [1, 2, 3]});
    });
  });

  describe('[Equipment::delete] function test', () => {
    it('should delete equipment by SID', async () => {
      mock.on('Ams/Equipment/Delete', true);
      assert.isTrue(await cw17.equipment.delete([1, 2]));
      assert.deepEqual(mock.lastCall('Ams/Equipment/Delete').data, {EquipmentSids: [1, 2]});
    });
  });

  describe('[Equipment::search] function test', () => {
    it('should search for equipment by EquipmentUid with the default max results', async () => {
      mock.on('Ams/Equipment/Search', [1]);
      const resp = await cw17.equipment.search({EquipmentUid: ['TESTEQ1']});
      assert.isArray(resp);
      assert.deepEqual(mock.lastCall('Ams/Equipment/Search').data, {MaxResults: 20, EquipmentUid: ['TESTEQ1']});
    });

    it('should honor maxResults', async () => {
      mock.on('Ams/Equipment/Search', []);
      await cw17.equipment.search({Manufacturer: ['Acme'], ForCheckout: true}, 5);
      assert.deepEqual(mock.lastCall('Ams/Equipment/Search').data, {MaxResults: 5, Manufacturer: ['Acme'], ForCheckout: true});
    });
  });
});
