'use strict';
// Mocked tests: no Cityworks instance is contacted.
const assert = require('chai').assert;
const cw19 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

describe('[Equipment::Cost] construct function test', () => {
  it('should have a defined cost object', () => {
    assert.isObject(cw19.equipment.cost, 'Equipment cost is an object');
  });
});

describe('[Equipment::cost] mocked request tests', () => {
  const mock = createMock(cw19.Cityworks);
  const cost = () => cw19.equipment.cost;
  const options = {Hours: 1, Units: 1, Estimated: true};

  describe('add costs', () => {
    const cases = [
      ['addInspectionCosts', 'Ams/EquipmentCost/AddInspectionCosts', 'InspectionId'],
      ['addRequestCosts', 'Ams/EquipmentCost/AddRequestCosts', 'RequestId'],
      ['addWorkOrderCosts', 'Ams/EquipmentCost/AddWorkOrderCosts', 'WorkOrderSid']
    ];
    cases.forEach(([method, path, idField]) => {
      it(`${method} should send the ID merged with the options and resolve the response value`, async () => {
        mock.on(path, [{EquipmentCostId: 1}]);
        const resp = await cost()[method](1, options);
        assert.deepEqual(resp, [{EquipmentCostId: 1}]);
        assert.deepEqual(mock.lastCall(path).data, {[idField]: 1, Hours: 1, Units: 1, Estimated: true});
      });

      it(`${method} should work without options and reject with API errors`, async () => {
        mock.on(path, []);
        await cost()[method](2);
        assert.deepEqual(mock.lastCall(path).data, {[idField]: 2});
        mock.onError(path, {Message: 'cost failed'});
        try {
          await cost()[method](2, options);
          assert.fail('should have rejected');
        } catch (e) {
          assert.isObject(e);
          assert.include(e.Message, 'cost failed');
        }
      });
    });

    it('addWorkOrderCosts should pass work-order-specific options', async () => {
      mock.on('Ams/EquipmentCost/AddWorkOrderCosts', []);
      await cost().addWorkOrderCosts(5, {WorkOrderId: 'WO-1', TaskIds: [1, 2], EquipmentSids: [9], StartDate: new Date('2024-05-01T00:00:00.000Z')});
      assert.deepEqual(mock.lastCall('Ams/EquipmentCost/AddWorkOrderCosts').data, {
        WorkOrderSid: 5, WorkOrderId: 'WO-1', TaskIds: [1, 2], EquipmentSids: [9], StartDate: '2024-05-01T00:00:00.000Z'
      });
    });
  });

  describe('delete costs', () => {
    const cases = [
      ['deleteInspectionCosts', 'Ams/EquipmentCost/DeleteInspectionCosts'],
      ['deleteRequestCosts', 'Ams/EquipmentCost/DeleteRequestCosts'],
      ['deleteWorkOrderCosts', 'Ams/EquipmentCost/DeleteWorkOrderCosts']
    ];
    cases.forEach(([method, path]) => {
      it(`${method} should send the cost IDs and default Estimated to false`, async () => {
        mock.on(path, true);
        assert.isTrue(await cost()[method]([1, 2]));
        assert.deepEqual(mock.lastCall(path).data, {EquipmentCostIds: [1, 2], Estimated: false});
        await cost()[method]([1], true);
        assert.deepEqual(mock.lastCall(path).data, {EquipmentCostIds: [1], Estimated: true});
      });
    });
  });

  describe('costs by parent', () => {
    const cases = [
      ['inspectionCostsByInspection', 'Ams/EquipmentCost/InspectionCostsByInspection', 'InspectionIds'],
      ['requestCostsByRequest', 'Ams/EquipmentCost/RequestCostsByRequest', 'RequestIds']
    ];
    cases.forEach(([method, path, idField]) => {
      it(`${method} should send the IDs and default Estimated to false`, async () => {
        mock.on(path, [{EquipmentCostId: 1}]);
        assert.deepEqual(await cost()[method]([1]), [{EquipmentCostId: 1}]);
        assert.deepEqual(mock.lastCall(path).data, {[idField]: [1], Estimated: false});
        await cost()[method]([1, 2], true);
        assert.deepEqual(mock.lastCall(path).data, {[idField]: [1, 2], Estimated: true});
      });

      it(`${method} should reject with API errors`, async () => {
        mock.onError(path, {Message: 'lookup failed'});
        try {
          await cost()[method]([1]);
          assert.fail('should have rejected');
        } catch (e) {
          assert.include(e.Message, 'lookup failed');
        }
      });
    });

    it('workOrderCostsByWorkOrder should send both work order IDs and SIDs when given', async () => {
      mock.on('Ams/EquipmentCost/WorkOrderCostsByWorkOrder', []);
      await cost().workOrderCostsByWorkOrder(['100001'], [1], true);
      assert.deepEqual(mock.lastCall('Ams/EquipmentCost/WorkOrderCostsByWorkOrder').data, {Estimated: true, WorkOrderIds: ['100001'], WorkOrderSids: [1]});
    });

    it('workOrderCostsByWorkOrder should omit undefined ID lists', async () => {
      mock.on('Ams/EquipmentCost/WorkOrderCostsByWorkOrder', []);
      await cost().workOrderCostsByWorkOrder(undefined, [1]);
      assert.deepEqual(mock.lastCall('Ams/EquipmentCost/WorkOrderCostsByWorkOrder').data, {Estimated: false, WorkOrderSids: [1]});
      await cost().workOrderCostsByWorkOrder(['100001']);
      assert.deepEqual(mock.lastCall('Ams/EquipmentCost/WorkOrderCostsByWorkOrder').data, {Estimated: false, WorkOrderIds: ['100001']});
    });
  });
});
