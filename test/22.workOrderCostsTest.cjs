'use strict';
// Mocked tests: no Cityworks instance is contacted.
const assert = require('chai').assert;
const cw22 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

describe('[WorkOrderCosts (construct)] function test', () => {
  it('should be a defined object', () => {
    assert.isObject(cw22.workorder.costs, 'WorkOrderCosts is an object');
  });

  it('should have WorkOrder as currentActivityType', () => {
    assert.equal(cw22.workorder.costs.currentActivityType, 'WorkOrder');
  });
});

describe('[WorkOrderCosts] mocked request tests', () => {
  const mock = createMock(cw22.Cityworks);
  const costs = () => cw22.workorder.costs;

  // [method, args, path, expected payload]
  const cases = [
    ['getCodes', [[1, 2], true], 'Ams/LaborCost/CostCodes', {EmployeeSids: [1, 2], CommonCodesOnly: true}],
    ['getCodes', [[1]], 'Ams/LaborCost/CostCodes', {EmployeeSids: [1], CommonCodesOnly: false}],
    ['getJobCodes', [], 'Ams/LaborCost/JobCodes', null],
    ['addLabor', [1, 2.5, {Estimated: true}], 'Ams/LaborCost/AddWorkOrderCosts', {WorkOrderSid: 1, Hours: 2.5, Estimated: true}],
    ['addLabor', [1, 2.5], 'Ams/LaborCost/AddWorkOrderCosts', {WorkOrderSid: 1, Hours: 2.5}],
    ['getLabor', [[1, 2], true], 'Ams/LaborCost/WorkOrderCostsByWorkOrder', {Estimated: true, WorkOrderSids: [1, 2]}],
    ['getLabor', [[1]], 'Ams/LaborCost/WorkOrderCostsByWorkOrder', {Estimated: false, WorkOrderSids: [1]}],
    ['deleteLabor', [[3, 4], true], 'Ams/LaborCost/DeleteWorkOrderCosts', {LaborCostIds: [3, 4], Estimated: true}],
    ['deleteLabor', [[3]], 'Ams/LaborCost/DeleteWorkOrderCosts', {LaborCostIds: [3], Estimated: false}],
    ['addEquipment', [1, {Estimated: true, Hours: 1, Units: 1}], 'Ams/EquipmentCost/AddWorkOrderCosts', {WorkOrderSid: 1, Estimated: true, Hours: 1, Units: 1}],
    ['addEquipment', [1], 'Ams/EquipmentCost/AddWorkOrderCosts', {WorkOrderSid: 1}],
    ['getEquipment', [1, true], 'Ams/EquipmentCost/WorkOrderCostsByWorkOrder', {WorkOrderSid: 1, Estimated: true}],
    ['getEquipment', [1], 'Ams/EquipmentCost/WorkOrderCostsByWorkOrder', {WorkOrderSid: 1, Estimated: false}],
    ['deleteEquipment', [[5, 6], true], 'Ams/EquipmentCost/DeleteWorkOrderCosts', {EquipmentCostIds: [5, 6], Estimated: true}],
    ['deleteEquipment', [[5]], 'Ams/EquipmentCost/DeleteWorkOrderCosts', {EquipmentCostIds: [5], Estimated: false}],
    ['addMaterial', [1, 3, {Estimated: true, MaterialSids: [1]}, false], 'Ams/MaterialCost/AddWorkOrderCosts', {Units: 3, WorkOrderSid: 1, CombineIssuesByMaterialSid: false, Estimated: true, MaterialSids: [1]}],
    ['addMaterial', [1, 3], 'Ams/MaterialCost/AddWorkOrderCosts', {Units: 3, WorkOrderSid: 1, CombineIssuesByMaterialSid: true}],
    ['addMaterial', [1, 3, {Estimated: true}], 'Ams/MaterialCost/AddWorkOrderCosts', {Units: 3, WorkOrderSid: 1, CombineIssuesByMaterialSid: true, Estimated: true}],
    ['getMaterial', [1, true], 'Ams/MaterialCost/WorkOrderCostsByWorkOrder', {WorkOrderSids: [1], Estimated: true}],
    ['getMaterial', [1], 'Ams/MaterialCost/WorkOrderCostsByWorkOrder', {WorkOrderSids: [1], Estimated: false}],
    ['getMaterial', [[1, 2]], 'Ams/MaterialCost/WorkOrderCostsByWorkOrder', {WorkOrderSids: [1, 2], Estimated: false}],
    ['getMaterial', ['WO-1'], 'Ams/MaterialCost/WorkOrderCostsByWorkOrder', {WorkOrderIds: ['WO-1'], Estimated: false}],
    ['getMaterial', [['WO-1', 'WO-2'], true], 'Ams/MaterialCost/WorkOrderCostsByWorkOrder', {WorkOrderIds: ['WO-1', 'WO-2'], Estimated: true}],
    ['getMaterial', [[1, 'WO-2']], 'Ams/MaterialCost/WorkOrderCostsByWorkOrder', {WorkOrderSids: [1], WorkOrderIds: ['WO-2'], Estimated: false}],
    ['deleteMaterial', [[7], true], 'Ams/MaterialCost/DeleteWorkOrderCosts', {MaterialCostIds: [7], Estimated: true}],
    ['deleteMaterial', [[7, 8]], 'Ams/MaterialCost/DeleteWorkOrderCosts', {MaterialCostIds: [7, 8], Estimated: false}]
  ];

  cases.forEach(([method, args, path, payload]) => {
    const label = `${method}(${JSON.stringify(args)})`;

    it(`${label} should call ${path} and resolve the response value`, async () => {
      const value = [{CostId: 1, Cost: 12.5}];
      mock.on(path, value);
      const resp = await costs()[method](...args);
      assert.deepEqual(resp, value);
      assert.equal(mock.callsTo(path).length, 1);
      assert.deepEqual(mock.lastCall(path).data, payload);
    });

    it(`${label} should reject with the API error`, async () => {
      mock.onError(path, {Code: 12, Message: 'costs failed'});
      try {
        await costs()[method](...args);
        assert.fail('should have rejected');
      } catch (e) {
        assert.equal(e.Code, 12);
        assert.equal(e.Message, 'costs failed');
      }
      assert.deepEqual(mock.paths(), [path]);
    });
  });

  it('getMaterial should reject without calling the API when no work orders are given', async () => {
    for (const bad of [[], undefined, null]) {
      try {
        await costs().getMaterial(bad);
        assert.fail('should have rejected');
      } catch (e) {
        assert.equal(e.Code, 9);
      }
    }
    assert.deepEqual(mock.paths(), []);
  });
});
