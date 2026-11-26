'use strict';
// Mocked tests: no Cityworks instance is contacted.
const assert = require('chai').assert;
const cw18 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

const RECORD_DATE = new Date('2024-05-01T12:00:00.000Z');

describe('[Equipment::Changeout] construct function test', () => {
  it('should have a defined changeout object', () => {
    assert.isObject(cw18.equipment.changeout, 'Equipment changeout is an object');
  });
});

describe('[Equipment::changeout] mocked request tests', () => {
  const mock = createMock(cw18.Cityworks);
  const co = () => cw18.equipment.changeout;

  describe('[Equipment::changeout::addChangeOutRead] function test', () => {
    it('should send the identifiers and merge the read data', async () => {
      mock.on('Ams/EquipmentChangeOut/AddChangeOutRead', {ReadId: 3});
      const resp = await co().addChangeOutRead(1, 2, true, {Text1: 'Test Read', Num1: 4});
      assert.deepEqual(resp, {ReadId: 3});
      assert.deepEqual(mock.lastCall('Ams/EquipmentChangeOut/AddChangeOutRead').data, {ChangeOutId: 1, OperationId: 2, IsNewRead: true, Text1: 'Test Read', Num1: 4});
    });

    it('should work without read data', async () => {
      mock.on('Ams/EquipmentChangeOut/AddChangeOutRead', {});
      await co().addChangeOutRead(1, 2, false);
      assert.deepEqual(mock.lastCall('Ams/EquipmentChangeOut/AddChangeOutRead').data, {ChangeOutId: 1, OperationId: 2, IsNewRead: false});
    });

    it('should reject with the API error', async () => {
      mock.onError('Ams/EquipmentChangeOut/AddChangeOutRead', {Message: 'bad read'});
      try {
        await co().addChangeOutRead(1, 2, true);
        assert.fail('should have rejected');
      } catch (e) {
        assert.isObject(e);
        assert.include(e.Message, 'bad read');
      }
    });
  });

  describe('[Equipment::changeout::addOperation] function test', () => {
    it('should send operation parameters and prefix read fields with NewRead_/OldRead_', async () => {
      mock.on('Ams/EquipmentChangeOut/AddOperation', {OperationId: 9});
      const resp = await co().addOperation({
        ChangeOutId: 1,
        Operation: 4,
        RecordDate: RECORD_DATE,
        OperationComments: 'Test operation',
        NewRead: {Text1: 'n'},
        OldRead: {Num1: 2}
      });
      assert.deepEqual(resp, {OperationId: 9});
      assert.deepEqual(mock.lastCall('Ams/EquipmentChangeOut/AddOperation').data, {
        ChangeOutId: 1,
        Operation: 4,
        RecordDate: RECORD_DATE.toISOString(),
        OperationComments: 'Test operation',
        NewRead_Text1: 'n',
        OldRead_Num1: 2
      });
    });
  });

  describe('[Equipment::changeout::attach] function test', () => {
    it('should send attach parameters and prefix the new read fields', async () => {
      mock.on('Ams/EquipmentChangeOut/Attach', {OperationId: 1});
      const resp = await co().attach({
        ChangeOutId: 1,
        NewUid: 'TEST-ATTACH-001',
        AssetType: 'GIS',
        RecordDate: RECORD_DATE,
        OperationComments: 'Test attach',
        NewRead: {Text2: 'r'},
        UpdateMap: false
      });
      assert.deepEqual(resp, {OperationId: 1});
      assert.deepEqual(mock.lastCall('Ams/EquipmentChangeOut/Attach').data, {
        ChangeOutId: 1,
        NewUid: 'TEST-ATTACH-001',
        AssetType: 'GIS',
        RecordDate: RECORD_DATE.toISOString(),
        OperationComments: 'Test attach',
        NewRead_Text2: 'r',
        UpdateMap: false
      });
    });
  });

  describe('[Equipment::changeout::detach] function test', () => {
    it('should send detach parameters and prefix the old read fields', async () => {
      mock.on('Ams/EquipmentChangeOut/Detach', {OperationId: 2});
      const resp = await co().detach({
        ChangeOutId: 1,
        OldUid: 'TEST-DETACH-001',
        AssetType: 'GIS',
        RecordDate: RECORD_DATE,
        OperationComments: 'Test detach',
        OldRead: {Date1: '2024-01-01'},
        WorkOrderSid: 77
      });
      assert.deepEqual(resp, {OperationId: 2});
      assert.deepEqual(mock.lastCall('Ams/EquipmentChangeOut/Detach').data, {
        ChangeOutId: 1,
        OldUid: 'TEST-DETACH-001',
        AssetType: 'GIS',
        RecordDate: RECORD_DATE.toISOString(),
        OperationComments: 'Test detach',
        OldRead_Date1: '2024-01-01',
        WorkOrderSid: 77
      });
    });
  });

  describe('[Equipment::changeout::replace] function test', () => {
    it('should send replace parameters and prefix both read sets', async () => {
      mock.on('Ams/EquipmentChangeOut/Replace', {OperationId: 3});
      const resp = await co().replace({
        ChangeOutId: 1,
        OldUid: 'TEST-OLD-001',
        NewUid: 'TEST-NEW-001',
        AssetType: 'GIS',
        RecordDate: RECORD_DATE,
        OperationComments: 'Test replace',
        OldRead: {Num1: 1},
        NewRead: {Num1: 2},
        FeatureSid: 5
      });
      assert.deepEqual(resp, {OperationId: 3});
      assert.deepEqual(mock.lastCall('Ams/EquipmentChangeOut/Replace').data, {
        ChangeOutId: 1,
        OldUid: 'TEST-OLD-001',
        NewUid: 'TEST-NEW-001',
        AssetType: 'GIS',
        RecordDate: RECORD_DATE.toISOString(),
        OperationComments: 'Test replace',
        OldRead_Num1: 1,
        NewRead_Num1: 2,
        FeatureSid: 5
      });
    });

    it('should reject with the API error', async () => {
      mock.onError('Ams/EquipmentChangeOut/Replace', {Message: 'cannot replace'});
      try {
        await co().replace({ChangeOutId: 1, OldUid: 'a', NewUid: 'b'});
        assert.fail('should have rejected');
      } catch (e) {
        assert.isObject(e);
        assert.include(e.Message, 'cannot replace');
      }
    });
  });
});
