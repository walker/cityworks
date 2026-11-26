'use strict';
// Mocked tests: no Cityworks instance is contacted.
var assert = require('chai').assert;
const cw27 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

describe('[CaseAssets coverage (construct)] function test', () => {
  it('should be a defined object', () => {
    assert.isObject(cw27.briefcase.asset, 'Briefcase.asset is an object');
    assert.isFunction(cw27.briefcase.asset.attach);
    assert.isFunction(cw27.briefcase.asset.detach);
    assert.isFunction(cw27.briefcase.asset.detachAll);
    assert.isFunction(cw27.briefcase.asset.getForCase);
    assert.isFunction(cw27.briefcase.asset.search);
  });
});

describe('[CaseAssets coverage::attach/detach methods] mocked function test', () => {
  const mock = createMock(cw27.Cityworks);

  it('should call attach and merge options into the payload', async () => {
    const added = {AddressId: 55, CaObjectId: 107138, AssetType: 'ADDRESS', StreetName: 'Main'};
    mock.on('Pll/CaseAddress/Add', () => added);
    const r = await cw27.briefcase.asset.attach(107138, false, {AssetType: 'ADDRESS', StreetName: 'Main'});
    assert.deepEqual(r, added);
    assert.deepEqual(mock.paths(), ['Pll/CaseAddress/Add']);
    assert.deepEqual(mock.lastCall('Pll/CaseAddress/Add').data, {
      CaObjectId: 107138, UpdateXY: false, AssetType: 'ADDRESS', StreetName: 'Main'
    });
  });

  it('should default attach UpdateXY to true when no options are given', async () => {
    mock.on('Pll/CaseAddress/Add', (data) => data);
    const r = await cw27.briefcase.asset.attach(107138);
    assert.deepEqual(r, {CaObjectId: 107138, UpdateXY: true});
    assert.deepEqual(mock.lastCall('Pll/CaseAddress/Add').data, {CaObjectId: 107138, UpdateXY: true});
  });

  it('should let attach options override the default UpdateXY', async () => {
    mock.on('Pll/CaseAddress/Add', (data) => data);
    await cw27.briefcase.asset.attach(107138, true, {UpdateXY: false});
    assert.deepEqual(mock.lastCall('Pll/CaseAddress/Add').data, {CaObjectId: 107138, UpdateXY: false});
  });

  it('should propagate an attach error', async () => {
    mock.onError('Pll/CaseAddress/Add', {Code: 9, Message: 'attach failed'});
    try {
      await cw27.briefcase.asset.attach(107138, false);
      assert.fail('Expected attach to reject');
    } catch(e) {
      assert.equal(e.Code, 9);
      assert.equal(e.Message, 'attach failed');
    }
  });

  it('should call detach', async () => {
    mock.on('Pll/CaseAddress/Delete', () => 1);
    const r = await cw27.briefcase.asset.detach(1, false);
    assert.equal(r, 1);
    assert.deepEqual(mock.lastCall('Pll/CaseAddress/Delete').data, {CaAddressId: 1, UpdateXY: false});
  });

  it('should default detach UpdateXY to true', async () => {
    mock.on('Pll/CaseAddress/Delete', () => 1);
    await cw27.briefcase.asset.detach(1);
    assert.deepEqual(mock.lastCall('Pll/CaseAddress/Delete').data, {CaAddressId: 1, UpdateXY: true});
  });

  it('should propagate a detach error', async () => {
    mock.onError('Pll/CaseAddress/Delete', {Code: 9, Message: 'detach failed'});
    try {
      await cw27.briefcase.asset.detach(1, false);
      assert.fail('Expected detach to reject');
    } catch(e) {
      assert.equal(e.Code, 9);
    }
  });

  it('should call detachAll', async () => {
    mock.on('Pll/CaseAddress/DeleteByCaObjectId', () => [11, 12]);
    const r = await cw27.briefcase.asset.detachAll(107138, false);
    assert.deepEqual(r, [11, 12]);
    assert.deepEqual(mock.lastCall('Pll/CaseAddress/DeleteByCaObjectId').data, {CaObjectId: 107138, UpdateXY: false});
  });

  it('should default detachAll UpdateXY to false', async () => {
    mock.on('Pll/CaseAddress/DeleteByCaObjectId', () => []);
    const r = await cw27.briefcase.asset.detachAll(107138);
    assert.deepEqual(r, []);
    assert.deepEqual(mock.lastCall('Pll/CaseAddress/DeleteByCaObjectId').data, {CaObjectId: 107138, UpdateXY: false});
  });

  it('should propagate a detachAll error', async () => {
    mock.onError('Pll/CaseAddress/DeleteByCaObjectId', {Code: 9, Message: 'detach all failed'});
    try {
      await cw27.briefcase.asset.detachAll(107138, false);
      assert.fail('Expected detachAll to reject');
    } catch(e) {
      assert.equal(e.Code, 9);
    }
  });
});

describe('[CaseAssets coverage::get/search methods] mocked function test', () => {
  const mock = createMock(cw27.Cityworks);

  it('should call getForCase', async () => {
    const rows = [{CaAddressId: 1, CaObjectId: 107138}, {CaAddressId: 2, CaObjectId: 107138}];
    mock.on('Pll/CaseAddress/ByCaObjectId', () => rows);
    const r = await cw27.briefcase.asset.getForCase(107138);
    assert.deepEqual(r, rows);
    assert.deepEqual(mock.lastCall('Pll/CaseAddress/ByCaObjectId').data, {CaObjectId: 107138});
  });

  it('should resolve null from getForCase when the case has no assets', async () => {
    mock.onRaw('Pll/CaseAddress/ByCaObjectId', {Status: 0, Value: null});
    const r = await cw27.briefcase.asset.getForCase(107138);
    assert.isNull(r);
  });

  it('should propagate a getForCase error', async () => {
    mock.onError('Pll/CaseAddress/ByCaObjectId', {Code: 9, Message: 'get failed'});
    try {
      await cw27.briefcase.asset.getForCase(107138);
      assert.fail('Expected getForCase to reject');
    } catch(e) {
      assert.equal(e.Code, 9);
    }
  });

  it('should reject search with no filters using CWError code 3', async () => {
    try {
      await cw27.briefcase.asset.search({});
      assert.fail('Expected search to reject without filters');
    } catch(e) {
      assert.equal(e.Code, 3);
      assert.equal(e.Name, 'Cityworks Exception');
      assert.include(e.Message, 'At least one of the attributes');
      assert.deepEqual(mock.paths(), []);
    }
  });

  it('should reject search with only unrecognized filters using CWError code 3', async () => {
    try {
      await cw27.briefcase.asset.search({Bogus: 1});
      assert.fail('Expected search to reject without recognized filters');
    } catch(e) {
      assert.equal(e.Code, 3);
    }
  });

  it('should reject search when filters are omitted using CWError code 3', async () => {
    try {
      await cw27.briefcase.asset.search();
      assert.fail('Expected search to reject without filters');
    } catch(e) {
      assert.equal(e.Code, 3);
    }
  });

  it('should call search with filters', async () => {
    const rows = [{CaAddressId: 1, CaObjectId: 107138}];
    mock.on('Pll/CaseAddress/Search', () => rows);
    const r = await cw27.briefcase.asset.search({CaObjectId: 107138});
    assert.deepEqual(r, rows);
    assert.deepEqual(mock.lastCall('Pll/CaseAddress/Search').data, {CaObjectId: 107138});
  });

  it('should propagate a search error', async () => {
    mock.onError('Pll/CaseAddress/Search', {Code: 9, Message: 'search failed'});
    try {
      await cw27.briefcase.asset.search({CaObjectId: 107138});
      assert.fail('Expected search to reject');
    } catch(e) {
      assert.equal(e.Code, 9);
    }
  });
});
