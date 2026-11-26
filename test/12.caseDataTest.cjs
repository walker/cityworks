'use strict';
// Mocked tests: no Cityworks instance is contacted.
const assert = require('chai').assert;
const _ = require('lodash');
const cw12 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

async function rejection(promise) {
  try {
    await promise;
  } catch (e) {
    return e;
  }
  assert.fail('should have rejected');
}

const data = () => cw12.briefcase.data;

describe('[CaseData (construct)] function test', () => {
  it('should be a defined object', () => {
    assert.isObject(data(), 'Briefcase.data is an object');
  });
});

describe('[CaseData] simple wrapper methods', () => {
  const mock = createMock(cw12.Cityworks);

  // [method, path, args, expected payload]
  const cases = [
    ['getGroupsByCaseId', 'Pll/CaseDataGroup/ByCaObjectId', [77950], {CaObjectId: 77950}],
    ['addGroup', 'Pll/CaseDataGroup/Add', [106149, 1, 'TEST'], {CaObjectId: 106149, CaseDataGroupId: 1, GroupCode: 'TEST'}],
    ['addGroup', 'Pll/CaseDataGroup/Add', [106149, 1, 'TEST', {GroupDesc: 'Test Group'}], {CaObjectId: 106149, CaseDataGroupId: 1, GroupCode: 'TEST', GroupDesc: 'Test Group'}],
    ['addDefaultGroups', 'Pll/CaseDataGroup/AddDefault', [106149, 1], {CaObjectId: 106149, BusCaseId: 1}],
    ['deleteGroupsByCaseId', 'Pll/CaseDataGroup/DeleteByCaObjectId', [106149], {CaObjectId: 106149}],
    ['checkGIS', 'Pll/CaseDataGroup/CheckGISChanges', ['ASSET', 'UID-1', {CaObjectId: 106149}], {EntityType: 'ASSET', EntityUid: 'UID-1', CaObjectId: 106149}],
    ['checkGIS', 'Pll/CaseDataGroup/CheckGISChanges', ['ASSET', 'UID-1', {CaseDataGroupId: 4, CaseDataDetailId: 9}], {EntityType: 'ASSET', EntityUid: 'UID-1', CaseDataGroupId: 4, CaseDataDetailId: 9}],
    ['updateGroupsFromAsset', 'Pll/CaseDataGroup/UpdateFromAsset', [106149, 'ASSET', 'UID-1'], {CaObjectId: 106149, EntityType: 'ASSET', EntityUid: 'UID-1'}],
    ['updateGroupsFromAsset', 'Pll/CaseDataGroup/UpdateFromAsset', [106149, 'ASSET', 'UID-1', 5], {CaObjectId: 106149, EntityType: 'ASSET', EntityUid: 'UID-1', CaDataGroupId: 5}],
    ['addDetail', 'Pll/CaseDataDetail/Add', [1, 2], {CaDataGroupId: 1, CaseDataDetailId: 2}],
    ['addDetail', 'Pll/CaseDataDetail/Add', [1, 2, {TextValue: 'x'}], {CaDataGroupId: 1, CaseDataDetailId: 2, TextValue: 'x'}],
    ['updateDetail', 'Pll/CaseDataDetail/Update', [1, {TextValue: 'Updated'}], {CaDataDetailId: 1, TextValue: 'Updated'}],
    ['lockDetail', 'Pll/CaseDataDetail/UpdateLock', [1], {CaDataDetailId: 1, Lock: true}],
    ['unlockDetail', 'Pll/CaseDataDetail/UpdateLock', [1], {CaDataDetailId: 1, Lock: false}],
    ['getAllDataDetails', 'Pll/CaseDataGroup/GetItemsForXml', [106149], {CaObjectId: 106149}],
    ['addListValue', 'Pll/CaseDataListValues/Add', [1, 'TestValue'], {CaDataDetailId: 1, ListValue: 'TestValue'}],
    ['deleteListValue', 'Pll/CaseDataListValues/Delete', [1], {CaDataDetailId: 1}],
    ['wipAddDetail', 'Pll/CaseDataDetail/Add', [1, 2, 'A', 'TEST', 3, {Extra: 1}], {CaseDataDetailId: 1, CaDataGroupId: 2, ColumnSequence: 'A', DetailCode: 'TEST', DetailSequence: 3, Extra: 1}]
  ];

  cases.forEach(([method, path, args, payload], i) => {
    it('should call ' + method + ' (#' + i + ') with the expected path and payload and resolve the Value', async () => {
      mock.on(path, {Ok: i});
      assert.deepEqual(await data()[method](...args), {Ok: i});
      assert.deepEqual(mock.paths(), [path]);
      assert.deepEqual(mock.lastCall(path).data, payload);
    });

    it('should propagate ' + method + ' (#' + i + ') API errors', async () => {
      mock.onError(path, {Message: 'Dummy failure'});
      assert.equal((await rejection(data()[method](...args))).Message, 'Dummy failure');
    });
  });

  it('should resolve getGroupsByCaseId as a collection', async () => {
    mock.on('Pll/CaseDataGroup/ByCaObjectId', [{CaDataGroupId: 1}, {CaDataGroupId: 2}]);
    assert.isArray(await data().getGroupsByCaseId(77950));
  });
});

describe('[CaseData] search methods', () => {
  const mock = createMock(cw12.Cityworks);

  // [method, path, bad filters, code, good filters]
  const searches = [
    ['searchForGroups', 'Pll/CaseDataGroup/Search', {}, 2, {GroupCode: 'TEST'}],
    ['searchForDetails', 'Pll/CaseDataDetail/SearchObject', {Unrelated: 1}, 2, {DetailCode: 'TEST'}],
    ['searchForListValueIds', 'Pll/CaseDataListValues/Search', {}, 3, {ListValue: 'East'}],
    ['searchForListValueObjects', 'Pll/CaseDataListValues/SearchObject', {}, 4, {ListValue: 'East'}]
  ];

  searches.forEach(([method, path, bad, code, good]) => {
    it('should reject ' + method + ' (code ' + code + ') when no recognised filters are provided', async () => {
      mock.on(path, []);
      const e = await rejection(data()[method](bad));
      assert.equal(e.Code, code);
      assert.match(e.Message, /At least one of the attributes/);
      assert.deepEqual(mock.paths(), []);
    });

    it('should call ' + method + ' with filters and resolve the Value', async () => {
      mock.on(path, [{Id: 1}]);
      assert.deepEqual(await data()[method](good), [{Id: 1}]);
      assert.deepEqual(mock.lastCall(path).data, good);
    });

    it('should propagate ' + method + ' API errors', async () => {
      mock.onError(path, {Message: 'Dummy failure'});
      assert.equal((await rejection(data()[method](good))).Message, 'Dummy failure');
    });
  });

  it('should reject checkGIS (code 1) when neither CaObjectId nor CaseDataGroupId is provided', async () => {
    mock.on('Pll/CaseDataGroup/CheckGISChanges', []);
    const e = await rejection(data().checkGIS('ASSET', 'UID-1', {}));
    assert.equal(e.Code, 1);
    assert.deepEqual(mock.paths(), []);
  });
});

describe('[CaseData::updateDetailItemValue] function test', () => {
  const mock = createMock(cw12.Cityworks);
  const search = 'Pll/CaseDataDetail/SearchObject';
  const update = 'Pll/CaseDataDetail/Update';

  const withDetail = (flags) => {
    mock.on(search, [Object.assign({CaDataDetailId: 837005}, flags)]);
    mock.on(update, (d) => d);
  };

  it('should look up the detail by id, then update the right value field and resolve the updated item', async () => {
    withDetail({NumberFlag: 'Y'});
    const r = await data().updateDetailItemValue(837005, 654321);
    assert.deepEqual(mock.lastCall(search).data, {CaDataDetailId: 837005});
    assert.deepEqual(mock.lastCall(update).data, {CaDataDetailId: 837005, NumberValue: 654321});
    assert.equal(r.NumberValue, 654321);
  });

  // [flag, value, expected extra payload]
  const byFlag = [
    ['TextFlag', 'Test Text Value Here', {TextValue: 'Test Text Value Here'}],
    ['DateFlag', '2027-02-01', {DateValue: '2027-02-01'}],
    ['CommentFlag', 'A long comment', {CommentValue: 'A long comment'}],
    ['CurrencyFlag', 1.25, {CurrencyValue: 1.25}],
    ['ListValuesFlag', 'East', {ListValue: 'East'}],
    ['ValueFlag', 2, {Value: 2}],
    ['YesNoFlag', 'Yes', {YesNoValue: 'Y'}],
    ['YesNoFlag', 'No', {YesNoValue: 'N'}],
    ['YesNoFlag', 'Y', {YesNoValue: 'Y'}],
    ['DateCountFlag', ['2027-02-01', '2027-02-06'], {DateCountValue: '{"dateCount":2,"value":["2027-02-01","2027-02-06"]}'}],
    ['DateCountFlag', '2027-02-01', {DateCountValue: '{"dateCount":1,"value":["2027-02-01"]}'}]
  ];

  byFlag.forEach(([flag, value, extra]) => {
    it('should set the right field for a ' + flag + ' detail given ' + JSON.stringify(value), async () => {
      withDetail({[flag]: 'Y'});
      await data().updateDetailItemValue(837005, value);
      assert.deepEqual(mock.lastCall(update).data, Object.assign({CaDataDetailId: 837005}, extra));
    });
  });

  it('should send Rate and Quantity when provided', async () => {
    withDetail({ValueFlag: 'Y'});
    await data().updateDetailItemValue(837005, 2, 1.5, 4);
    assert.deepEqual(mock.lastCall(update).data, {CaDataDetailId: 837005, Quantity: 4, Rate: 1.5, Value: 2});
  });

  it('should multiply Q1, Q2 and Q3 (and the rate) for a Q1Q2Q3 detail', async () => {
    withDetail({Q1Q2Q3Flag: 'Y'});
    await data().updateDetailItemValue(837005, [2, 3, 2]);
    assert.deepEqual(mock.lastCall(update).data, {CaDataDetailId: 837005, Quantity: 2, Q2Value: 3, Q3Value: 2, Value: 12});
    await data().updateDetailItemValue(837005, [2, 3, 2], 2);
    assert.deepEqual(mock.lastCall(update).data, {CaDataDetailId: 837005, Rate: 2, Quantity: 2, Q2Value: 3, Q3Value: 2, Value: 24});
  });

  it('should reject (code 1) when no data detail is found', async () => {
    mock.on(search, []);
    mock.on(update, (d) => d);
    const e = await rejection(data().updateDetailItemValue(1, 5));
    assert.equal(e.Code, 1);
    assert.include(e.Message, 'No data detail found with CaDataDetailId 1');
    assert.lengthOf(mock.callsTo(update), 0);
  });

  it('should propagate errors from the lookup and the update', async () => {
    mock.onError(search, {Message: 'search failed'});
    assert.equal((await rejection(data().updateDetailItemValue(1, 5))).Message, 'search failed');
    withDetail({NumberFlag: 'Y'});
    mock.onError(update, {Message: 'update failed'});
    assert.equal((await rejection(data().updateDetailItemValue(1, 5))).Message, 'update failed');
  });
});

describe('[CaseData::setCaseData / setCaseDataItem] function test', () => {
  const mock = createMock(cw12.Cityworks);
  const items = 'Pll/CaseDataGroup/GetItemsForXml';
  const search = 'Pll/CaseDataDetail/SearchObject';
  const update = 'Pll/CaseDataDetail/Update';

  beforeEach(() => {
    mock.on(items, [
      {GroupCode: 'OTHER', DetailCode: 'TSTNBR', CaDataDetailId: 1},
      {GroupCode: 'TEST', DetailCode: 'TSTNBR', CaDataDetailId: 10},
      {GroupCode: 'TEST', DetailCode: 'TSTLIST', CaDataDetailId: 20},
      {GroupCode: 'TEST', DetailCode: 'LAST', CaDataDetailId: 30}
    ]);
    mock.on(search, (d) => [{CaDataDetailId: d.CaDataDetailId, NumberFlag: d.CaDataDetailId === 10 ? 'Y' : undefined, ListValuesFlag: d.CaDataDetailId === 20 ? 'Y' : undefined, TextFlag: d.CaDataDetailId === 30 ? 'Y' : undefined}]);
    mock.on(update, (d) => d);
  });

  it('should find the detail by group and item code and set a number value', async () => {
    const r = await data().setCaseDataItem(106149, 'TEST.TSTNBR', 456789);
    assert.deepEqual(mock.lastCall(items).data, {CaObjectId: 106149});
    assert.deepEqual(mock.lastCall(update).data, {CaDataDetailId: 10, NumberValue: 456789});
    assert.equal(r.NumberValue, 456789);
  });

  it('should set a list value on the matching detail', async () => {
    const r = await data().setCaseDataItem(106149, 'TEST.TSTLIST', 'East');
    assert.equal(r.ListValue, 'East');
    assert.equal(mock.lastCall(update).data.CaDataDetailId, 20);
  });

  it('should match the last detail in the list too', async () => {
    const r = await data().setCaseData(106149, [{code: 'TEST.LAST', value: 'Test Text Value Here'}]);
    assert.equal(r.TextValue, 'Test Text Value Here');
  });

  it('should match on the detail code alone when no group code is given', async () => {
    await data().setCaseDataItem(106149, 'TSTLIST', 'West');
    assert.equal(mock.lastCall(update).data.CaDataDetailId, 20);
    assert.equal(mock.lastCall(update).data.ListValue, 'West');
  });

  it('should reject (code 2) if a data detail item is not found', async () => {
    const e = await rejection(data().setCaseData(77950, [{code: 'TEST.TESTNOFIELD', value: 123456}]));
    assert.equal(e.Code, 2);
    assert.include(e.Message, 'The matching data detail item was not found for TEST.TESTNOFIELD');
    assert.lengthOf(mock.callsTo(update), 0);
  });

  it('should propagate errors from loading the case data', async () => {
    mock.onError(items, {Message: 'nope'});
    assert.equal((await rejection(data().setCaseDataItem(1, 'TEST.TSTNBR', 1))).Message, 'nope');
  });

  it('should pass rate and quantity through to the update', async () => {
    mock.on(search, [{CaDataDetailId: 10, ValueFlag: 'Y'}]);
    await data().setCaseDataItem(106149, 'TEST.TSTNBR', 2, 1.5, 4);
    assert.deepEqual(mock.lastCall(update).data, {CaDataDetailId: 10, Quantity: 4, Rate: 1.5, Value: 2});
  });
});
