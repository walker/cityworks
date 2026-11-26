'use strict';
// Mocked tests: no Cityworks instance is contacted.
var assert = require('chai').assert;
const cw9 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

describe('[CaseAssets] mocked tests', () => {
  const mock = createMock(cw9.Cityworks);

  const assertRejects = async (promise) => {
    try {
      await promise;
    } catch (e) {
      return e;
    }
    assert.fail('should have rejected');
  };

  describe('[CaseAssets (construct)] function test', () => {
    it('should be a defined object', () => {
      assert.isObject(cw9.briefcase.financial, 'Request is an object');
      assert.isObject(cw9.briefcase.asset, 'Asset is an object');
    });
  });

  describe('[CaseFinancial::getFees] function test', () => {
    it('should resolve a collection of case fees limited to the known fields', async () => {
      mock.on('Pll/CaseFees/GetList', () => [
        {CaFeeId: 1, CaObjectId: 16086, Amount: 12.5, FeeCode: 'F1', Unknown: 'dropped'},
        {CaFeeId: 2, CaObjectId: 16086, Amount: 3, FeeCode: 'F2'}
      ]);
      const r = await cw9.briefcase.financial.getFees(16086);
      assert.isArray(r);
      assert.lengthOf(r, 2);
      assert.equal(r[0].CaFeeId, 1);
      assert.equal(r[0].Amount, 12.5);
      assert.equal(r[1].FeeCode, 'F2');
      assert.notProperty(r[0], 'Unknown');
      assert.deepEqual(mock.paths(), ['Pll/CaseFees/GetList']);
      assert.deepEqual(mock.lastCall('Pll/CaseFees/GetList').data, {WhereClause: 'CA_FEES_VW.CA_OBJECT_ID=16086'});
    });

    it('should resolve an empty array when there are no fees', async () => {
      mock.on('Pll/CaseFees/GetList', () => []);
      assert.deepEqual(await cw9.briefcase.financial.getFees(16086), []);
    });

    it('should propagate API errors', async () => {
      mock.onError('Pll/CaseFees/GetList', {Message: 'boom'});
      const e = await assertRejects(cw9.briefcase.financial.getFees(16086));
      assert.equal(e.Message, 'boom');
    });
  });

  describe('[CaseFinancial::addFee] function test', () => {
    it('should resolve a fee object', async () => {
      mock.on('Pll/CaseFees/Add', (data) => ({CaFeeId: 77, CaObjectId: data.CaObjectId, FeeSetupId: data.FeeSetupId}));
      const r = await cw9.briefcase.financial.addFee(16085, 183, {});
      assert.isNumber(r.CaFeeId);
      assert.deepEqual(mock.lastCall('Pll/CaseFees/Add').data, {CaObjectId: 16085, FeeSetupId: 183});
    });

    it('should merge options into the payload', async () => {
      mock.on('Pll/CaseFees/Add', (data) => Object.assign({CaFeeId: 78}, data));
      const r = await cw9.briefcase.financial.addFee(16085, 183, {AutoRecalculate: 'Y', Amount: 9});
      assert.equal(r.CaFeeId, 78);
      assert.deepEqual(mock.lastCall('Pll/CaseFees/Add').data, {CaObjectId: 16085, FeeSetupId: 183, AutoRecalculate: 'Y', Amount: 9});
    });

    it('should propagate API errors', async () => {
      mock.onError('Pll/CaseFees/Add', {Message: 'nope'});
      const e = await assertRejects(cw9.briefcase.financial.addFee(16085, 183));
      assert.equal(e.Message, 'nope');
    });
  });

  describe('[CaseAssets::attach] function test', () => {
    it('should default UpdateXY to true and resolve the response value', async () => {
      mock.on('Pll/CaseAddress/Add', (data) => ({AddressId: 5, CaObjectId: data.CaObjectId}));
      const r = await cw9.briefcase.asset.attach(42337);
      assert.deepEqual(r, {AddressId: 5, CaObjectId: 42337});
      assert.deepEqual(mock.paths(), ['Pll/CaseAddress/Add']);
      assert.deepEqual(mock.lastCall('Pll/CaseAddress/Add').data, {CaObjectId: 42337, UpdateXY: true});
    });

    it('should merge options and honor updateXY=false', async () => {
      mock.on('Pll/CaseAddress/Add', (data) => data);
      await cw9.briefcase.asset.attach(42337, false, {AssetType: 'WATERMAIN', AssetId: 'GUID-1', XCoord: 1.5, YCoord: 2.5, UpdateCaseData: true});
      assert.deepEqual(mock.lastCall('Pll/CaseAddress/Add').data, {
        CaObjectId: 42337, UpdateXY: false, AssetType: 'WATERMAIN', AssetId: 'GUID-1', XCoord: 1.5, YCoord: 2.5, UpdateCaseData: true
      });
    });

    it('should propagate API errors', async () => {
      mock.onError('Pll/CaseAddress/Add', {Message: 'attach failed'});
      const e = await assertRejects(cw9.briefcase.asset.attach(42337));
      assert.equal(e.Message, 'attach failed');
    });
  });

  describe('[CaseAssets::detach] function test', () => {
    it('should default UpdateXY to true and resolve the response value', async () => {
      mock.on('Pll/CaseAddress/Delete', () => ({CaAddressId: 9}));
      const r = await cw9.briefcase.asset.detach(9);
      assert.deepEqual(r, {CaAddressId: 9});
      assert.deepEqual(mock.paths(), ['Pll/CaseAddress/Delete']);
      assert.deepEqual(mock.lastCall('Pll/CaseAddress/Delete').data, {CaAddressId: 9, UpdateXY: true});
    });

    it('should pass updateXY=false', async () => {
      mock.on('Pll/CaseAddress/Delete', () => true);
      await cw9.briefcase.asset.detach(9, false);
      assert.deepEqual(mock.lastCall('Pll/CaseAddress/Delete').data, {CaAddressId: 9, UpdateXY: false});
    });

    it('should propagate API errors', async () => {
      mock.onError('Pll/CaseAddress/Delete', {Message: 'detach failed'});
      const e = await assertRejects(cw9.briefcase.asset.detach(9));
      assert.equal(e.Message, 'detach failed');
    });
  });

  describe('[CaseAssets::detachAll] function test', () => {
    it('should default UpdateXY to false and resolve the detached ids', async () => {
      mock.on('Pll/CaseAddress/DeleteByCaObjectId', () => [11, 12]);
      const r = await cw9.briefcase.asset.detachAll(42337);
      assert.deepEqual(r, [11, 12]);
      assert.deepEqual(mock.paths(), ['Pll/CaseAddress/DeleteByCaObjectId']);
      assert.deepEqual(mock.lastCall('Pll/CaseAddress/DeleteByCaObjectId').data, {CaObjectId: 42337, UpdateXY: false});
    });

    it('should pass updateXY=true', async () => {
      mock.on('Pll/CaseAddress/DeleteByCaObjectId', () => []);
      const r = await cw9.briefcase.asset.detachAll(42337, true);
      assert.deepEqual(r, []);
      assert.deepEqual(mock.lastCall('Pll/CaseAddress/DeleteByCaObjectId').data, {CaObjectId: 42337, UpdateXY: true});
    });

    it('should propagate API errors', async () => {
      mock.onError('Pll/CaseAddress/DeleteByCaObjectId', {Message: 'detach all failed'});
      const e = await assertRejects(cw9.briefcase.asset.detachAll(42337));
      assert.equal(e.Message, 'detach all failed');
    });
  });

  describe('[CaseAssets::getForCase] function test', () => {
    it('should resolve a collection of case assets', async () => {
      mock.on('Pll/CaseAddress/ByCaObjectId', (data) => [{CaAddressId: 1, CaObjectId: data.CaObjectId}, {CaAddressId: 2, CaObjectId: data.CaObjectId}]);
      const r = await cw9.briefcase.asset.getForCase(42337);
      assert.isArray(r);
      assert.deepEqual(r.map(a => a.CaAddressId), [1, 2]);
      assert.deepEqual(mock.paths(), ['Pll/CaseAddress/ByCaObjectId']);
      assert.deepEqual(mock.lastCall('Pll/CaseAddress/ByCaObjectId').data, {CaObjectId: 42337});
    });

    it('should propagate API errors', async () => {
      mock.onError('Pll/CaseAddress/ByCaObjectId', {Message: 'lookup failed'});
      const e = await assertRejects(cw9.briefcase.asset.getForCase(42337));
      assert.equal(e.Message, 'lookup failed');
    });
  });

  describe('[CaseAssets::search] function test', () => {
    it('should resolve the matching case assets and pass the filters through', async () => {
      mock.on('Pll/CaseAddress/Search', () => [{CaAddressId: 3, CaObjectId: 18480}]);
      const r = await cw9.briefcase.asset.search({CaObjectId: 18480});
      assert.deepEqual(r, [{CaAddressId: 3, CaObjectId: 18480}]);
      assert.deepEqual(mock.paths(), ['Pll/CaseAddress/Search']);
      assert.deepEqual(mock.lastCall('Pll/CaseAddress/Search').data, {CaObjectId: 18480});
    });

    it('should accept any one of the supported filters alongside others', async () => {
      mock.on('Pll/CaseAddress/Search', () => []);
      await cw9.briefcase.asset.search({AssetType: 'HYDRANT', ZipCode: '00000', Other: 'ignored'});
      assert.deepEqual(mock.lastCall('Pll/CaseAddress/Search').data, {AssetType: 'HYDRANT', ZipCode: '00000', Other: 'ignored'});
    });

    it('should reject with CWError 3 when no supported filter is given', async () => {
      mock.on('Pll/CaseAddress/Search', () => []);
      const e = await assertRejects(cw9.briefcase.asset.search({Unsupported: 1}));
      assert.equal(e.Code, 3);
      assert.include(e.Message, 'At least one of the attributes');
      assert.deepEqual(mock.paths(), []);
    });

    it('should reject with CWError 3 when filters are empty or omitted', async () => {
      mock.on('Pll/CaseAddress/Search', () => []);
      assert.equal((await assertRejects(cw9.briefcase.asset.search({}))).Code, 3);
      assert.equal((await assertRejects(cw9.briefcase.asset.search())).Code, 3);
      assert.deepEqual(mock.paths(), []);
    });

    it('should propagate API errors', async () => {
      mock.onError('Pll/CaseAddress/Search', {Message: 'search failed'});
      const e = await assertRejects(cw9.briefcase.asset.search({CaObjectId: 18480}));
      assert.equal(e.Message, 'search failed');
    });
  });
});
