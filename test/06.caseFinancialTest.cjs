'use strict';
// Mocked tests: no Cityworks instance is contacted.
var assert = require('chai').assert;
const cw6 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

const fin = cw6.briefcase.financial;

async function rejection(promise) {
  try {
    await promise;
  } catch(e) {
    return e;
  }
  return assert.fail('expected promise to reject');
}

describe('[CaseFinancial (construct)] function test', () => {
  it('should be a defined object', () => {
    assert.isObject(fin, 'financial is an object');
    assert.isFunction(fin.getFees);
    assert.deepEqual(cw6.briefcase.financial.constructor.downloadUrls(), {receipt: 'Pll/CasePayment/DownloadReceipt'});
  });
});

describe('[CaseFinancial::getFees] function test', () => {
  const mock = createMock(cw6.Cityworks);

  it('should resolve a collection of case fees limited to the known fee fields', async () => {
    mock.on('Pll/CaseFees/GetList', [
      {CaFeeId: 1, CaObjectId: 685646, Amount: 9, FeeCode: 'F-1', FeeDesc: 'Permit', Extra: 'dropped'},
      {CaFeeId: 2, CaObjectId: 685646, Amount: 4.5, FeeCode: 'F-2', PaymentAmount: 1}
    ]);
    const r = await fin.getFees(685646);
    assert.deepEqual(mock.paths(), ['Pll/CaseFees/GetList']);
    assert.deepEqual(mock.lastCall('Pll/CaseFees/GetList').data, {WhereClause: 'CA_FEES_VW.CA_OBJECT_ID=685646'});
    assert.lengthOf(r, 2);
    assert.equal(r[0].CaFeeId, 1);
    assert.equal(r[0].FeeDesc, 'Permit');
    assert.notProperty(r[0], 'Extra');
    assert.equal(r[1].PaymentAmount, 1);
  });

  it('should resolve an empty array when the case has no fees', async () => {
    mock.on('Pll/CaseFees/GetList', []);
    assert.deepEqual(await fin.getFees(5), []);
  });

  it('should propagate API errors', async () => {
    mock.onError('Pll/CaseFees/GetList', {Message: 'bad case'});
    const e = await rejection(fin.getFees(5));
    assert.include(e.Message, 'bad case');
  });
});

describe('[CaseFinancial::addFee] function test', () => {
  const mock = createMock(cw6.Cityworks);

  it('should resolve a fee object and send the ids merged with the options', async () => {
    mock.on('Pll/CaseFees/Add', (d) => Object.assign({CaFeeId: 77}, d));
    const r = await fin.addFee(16085, 183, {AutoRecalculate: 'Y', Amount: 9});
    assert.deepEqual(mock.lastCall('Pll/CaseFees/Add').data, {CaObjectId: 16085, FeeSetupId: 183, AutoRecalculate: 'Y', Amount: 9});
    assert.isNumber(r.CaFeeId);
    assert.equal(r.Amount, 9);
  });

  it('should send only the ids when no options are given', async () => {
    mock.on('Pll/CaseFees/Add', {CaFeeId: 1});
    await fin.addFee(1, 2);
    assert.deepEqual(mock.lastCall('Pll/CaseFees/Add').data, {CaObjectId: 1, FeeSetupId: 2});
  });

  it('should propagate API errors', async () => {
    mock.onError('Pll/CaseFees/Add', {Message: 'no template'});
    const e = await rejection(fin.addFee(1, 2));
    assert.include(e.Message, 'no template');
  });
});

describe('[CaseFinancial::addDefaultFees] function test', () => {
  const mock = createMock(cw6.Cityworks);

  it('should resolve the collection of default fees added', async () => {
    mock.on('Pll/CaseFees/AddDefault', [{CaFeeId: 1}, {CaFeeId: 2}]);
    const r = await fin.addDefaultFees(42337, 152);
    assert.deepEqual(mock.lastCall('Pll/CaseFees/AddDefault').data, {CaObjectId: 42337, BusCaseId: 152});
    assert.deepEqual(r, [{CaFeeId: 1}, {CaFeeId: 2}]);
  });

  it('should propagate API errors', async () => {
    mock.onError('Pll/CaseFees/AddDefault', {Message: 'nope'});
    const e = await rejection(fin.addDefaultFees(1, 2));
    assert.include(e.Message, 'nope');
  });
});

describe('[CaseFinancial::updateFee] function test', () => {
  const mock = createMock(cw6.Cityworks);

  it('should resolve a fee object with the updated amount', async () => {
    mock.on('Pll/CaseFees/Update', (d) => ({CaFeeId: d.CaFeeId, Amount: d.Amount}));
    const r = await fin.updateFee(18480, {Amount: '42.50'});
    assert.deepEqual(mock.lastCall('Pll/CaseFees/Update').data, {CaFeeId: 18480, Amount: '42.50'});
    assert.equal(r.Amount, '42.50');
  });

  it('should propagate API errors', async () => {
    mock.onError('Pll/CaseFees/Update', {Message: 'locked'});
    const e = await rejection(fin.updateFee(1, {Amount: 1}));
    assert.include(e.Message, 'locked');
  });
});

describe('[CaseFinancial::getAllFeeTemplates] function test', () => {
  const mock = createMock(cw6.Cityworks);

  it('should resolve a collection of all fee templates', async () => {
    mock.on('Pll/FeeSetup/All', [{FeeSetupId: 1}, {FeeSetupId: 2}]);
    const r = await fin.getAllFeeTemplates();
    assert.deepEqual(mock.lastCall('Pll/FeeSetup/All').data, {});
    assert.deepEqual(r, [{FeeSetupId: 1}, {FeeSetupId: 2}]);
  });
});

describe('[CaseFinancial::searchFeeTemplates] function test', () => {
  const mock = createMock(cw6.Cityworks);

  it('should resolve a collection of fee templates with interest in the name', async () => {
    mock.on('Pll/FeeSetup/Search', [{FeeSetupId: 3, FeeDesc: 'Interest'}]);
    const r = await fin.searchFeeTemplates({FeeDesc: 'interest'});
    assert.deepEqual(mock.lastCall('Pll/FeeSetup/Search').data, {FeeDesc: 'interest'});
    assert.deepEqual(r, [{FeeSetupId: 3, FeeDesc: 'Interest'}]);
  });

  it('should reject with code 7 if no searchable attribute is given', async () => {
    mock.on('Pll/FeeSetup/Search', []);
    const e = await rejection(fin.searchFeeTemplates({Other: 1}));
    assert.equal(e.Code, 7);
  });

  it('should propagate API errors', async () => {
    mock.onError('Pll/FeeSetup/Search', {Message: 'search failed'});
    const e = await rejection(fin.searchFeeTemplates({FeeCode: 'x'}));
    assert.include(e.Message, 'search failed');
  });
});

describe('[CaseFinancial::searchCaseInstruments] function test', () => {
  const mock = createMock(cw6.Cityworks);

  it('should resolve a collection of case instruments with MO in the state code', async () => {
    mock.on('Pll/CaseInstrument/Search', [{CaInstrumentId: 1, StateCode: 'MO'}]);
    const r = await fin.searchCaseInstruments({StateCode: 'MO'});
    assert.deepEqual(mock.lastCall('Pll/CaseInstrument/Search').data, {StateCode: 'MO'});
    assert.deepEqual(r, [{CaInstrumentId: 1, StateCode: 'MO'}]);
  });

  it('should reject with code 9 if no searchable attribute is given', async () => {
    mock.on('Pll/CaseInstrument/Search', []);
    const e = await rejection(fin.searchCaseInstruments({Other: 1}));
    assert.equal(e.Code, 9);
  });
});

describe('[CaseFinancial::getInstrumentList] function test', () => {
  const mock = createMock(cw6.Cityworks);

  it('should resolve a collection of instruments', async () => {
    mock.on('Pll/CaseInstrument/GetList', [{CaInstrumentId: 1}]);
    const r = await fin.getInstrumentList({FilterColumn: 'X'});
    assert.deepEqual(mock.lastCall('Pll/CaseInstrument/GetList').data, {FilterColumn: 'X'});
    assert.deepEqual(r, [{CaInstrumentId: 1}]);
  });

  it('should resolve null when the API returns a null value', async () => {
    mock.on('Pll/CaseInstrument/GetList', null);
    assert.isNull(await fin.getInstrumentList({}));
  });
});

describe('[CaseFinancial::addCaseInstrumentRelease] function test', () => {
  const mock = createMock(cw6.Cityworks);
  const released = '2025-01-05T00:00:00.000Z';

  it('should resolve an object with the new case instrument release info (amount)', async () => {
    mock.on('Pll/CaseInstReleases/Add', (d) => Object.assign({CaInstReleasesId: 9}, d));
    const r = await fin.addCaseInstrumentRelease(4, 12, new Date(released), 50, undefined, 'partial');
    assert.deepEqual(mock.lastCall('Pll/CaseInstReleases/Add').data, {CaInstrumentId: 4, ReleasedBy: 12, DateReleased: released, AmountReleased: 50, CommentText: 'partial'});
    assert.equal(r.CaInstReleasesId, 9);
  });

  it('should send PercentReleased when only a percent is given', async () => {
    mock.on('Pll/CaseInstReleases/Add', {CaInstReleasesId: 9});
    await fin.addCaseInstrumentRelease(4, 12, new Date(released), undefined, 100);
    assert.deepEqual(mock.lastCall('Pll/CaseInstReleases/Add').data, {CaInstrumentId: 4, ReleasedBy: 12, DateReleased: released, PercentReleased: 100});
  });

  it('should reject with code 2 if both amount and percent are given', async () => {
    mock.on('Pll/CaseInstReleases/Add', {CaInstReleasesId: 9});
    const e = await rejection(fin.addCaseInstrumentRelease(4, 12, new Date(released), 50, 50));
    assert.equal(e.Code, 2);
  });

  it('should propagate API errors', async () => {
    mock.onError('Pll/CaseInstReleases/Add', {Message: 'over released'});
    const e = await rejection(fin.addCaseInstrumentRelease(4, 12, new Date(released), 50));
    assert.include(e.Message, 'over released');
  });
});

describe('[CaseFinancial::deleteCaseInstrumentRelease] function test', () => {
  const mock = createMock(cw6.Cityworks);

  it('should resolve the API result for the deleted release', async () => {
    mock.on('Pll/CaseInstReleases/Delete', {CaInstReleasesId: 9});
    const r = await fin.deleteCaseInstrumentRelease(9);
    assert.deepEqual(mock.lastCall('Pll/CaseInstReleases/Delete').data, {CaInstReleasesId: 9});
    assert.deepEqual(r, {CaInstReleasesId: 9});
  });
});

describe('[CaseFinancial::searchCaseInstrumentReleases] function test', () => {
  const mock = createMock(cw6.Cityworks);

  it('should resolve a collection of case instrument releases which meet the search criteria', async () => {
    mock.on('Pll/CaseInstReleases/Search', [{CaInstReleasesId: 1, PercentReleased: 100}]);
    const r = await fin.searchCaseInstrumentReleases({PercentReleased: '100'});
    assert.deepEqual(mock.lastCall('Pll/CaseInstReleases/Search').data, {PercentReleased: '100'});
    assert.deepEqual(r, [{CaInstReleasesId: 1, PercentReleased: 100}]);
  });

  it('should reject with code 3 if no searchable attribute is given', async () => {
    mock.on('Pll/CaseInstReleases/Search', []);
    const e = await rejection(fin.searchCaseInstrumentReleases({}));
    assert.equal(e.Code, 3);
  });
});

describe('[CaseFinancial::fees] function test', () => {
  const mock = createMock(cw6.Cityworks);

  it('should resolve a collection of all fees configured', async () => {
    mock.on('Pll/FeeSetup/All', [{FeeSetupId: 1}]);
    const r = await fin.fees();
    assert.deepEqual(mock.lastCall('Pll/FeeSetup/All').data, {});
    assert.deepEqual(r, [{FeeSetupId: 1}]);
  });
});

describe('[CaseFinancial::searchAvailableFees] function test', () => {
  const mock = createMock(cw6.Cityworks);

  it('should resolve the fees which meet the specified search criteria', async () => {
    mock.on('Pll/FeeSetup/Search', [1, 2]);
    const r = await fin.searchAvailableFees({FeeCode: 'F-'});
    assert.deepEqual(mock.lastCall('Pll/FeeSetup/Search').data, {FeeCode: 'F-'});
    assert.deepEqual(r, [1, 2]);
  });

  it('should reject with code 8 if no searchable attribute is given', async () => {
    mock.on('Pll/FeeSetup/Search', []);
    const e = await rejection(fin.searchAvailableFees({}));
    assert.equal(e.Code, 8);
  });
});

describe('[CaseFinancial::getTenderTypes] function test', () => {
  const mock = createMock(cw6.Cityworks);

  it('should resolve a collection of all tender types configured', async () => {
    mock.on('Pll/TenderType/All', [{TenderTypeId: 1, Name: 'CASH'}]);
    const r = await fin.getTenderTypes();
    assert.deepEqual(mock.lastCall('Pll/TenderType/All').data, {});
    assert.deepEqual(r, [{TenderTypeId: 1, Name: 'CASH'}]);
  });
});

describe('[CaseFinancial::addTenderType] function test', () => {
  const mock = createMock(cw6.Cityworks);

  it('should resolve an object with the new tender type\'s info', async () => {
    mock.on('Pll/TenderType/Add', (d) => Object.assign({TenderTypeId: 4}, d));
    const r = await fin.addTenderType({TenderType: 'CHECK'});
    assert.deepEqual(mock.lastCall('Pll/TenderType/Add').data, {TenderType: 'CHECK'});
    assert.deepEqual(r, {TenderTypeId: 4, TenderType: 'CHECK'});
  });
});

describe('[CaseFinancial::updateTenderType] function test', () => {
  const mock = createMock(cw6.Cityworks);

  it('should resolve an object with the details of the updated tender type', async () => {
    mock.on('Pll/TenderType/Update', (d) => d);
    const r = await fin.updateTenderType(4, {TenderType: 'ACH'});
    assert.deepEqual(mock.lastCall('Pll/TenderType/Update').data, {TenderTypeId: 4, TenderType: 'ACH'});
    assert.deepEqual(r, {TenderTypeId: 4, TenderType: 'ACH'});
  });
});

describe('[CaseFinancial::getReceipts] function test', () => {
  const mock = createMock(cw6.Cityworks);

  it('should resolve the receipts for the receipt ids linked to the case', async () => {
    mock.on('Pll/CaseReceiptCase/GetList', [{CaReceiptId: 11}, {CaReceiptId: 12}]);
    mock.on('Pll/CaseReceipt/GetList', [{CaReceiptId: 11, ReceiptFileName: 'a'}, {CaReceiptId: 12, ReceiptFileName: 'b'}]);
    const r = await fin.getReceipts(107529);
    assert.deepEqual(mock.paths(), ['Pll/CaseReceiptCase/GetList', 'Pll/CaseReceipt/GetList']);
    assert.deepEqual(mock.lastCall('Pll/CaseReceiptCase/GetList').data, {FilterColumn: 'CA_RECEIPT_CASES.Ca_Object_Id', FilterOperator: '=', FilterValue: 107529});
    assert.deepEqual(mock.lastCall('Pll/CaseReceipt/GetList').data, {WhereClause: ' CA_RECEIPTS.CA_RECEIPT_ID in (11,12)'});
    assert.lengthOf(r, 2);
    assert.equal(r[0].ReceiptFileName, 'a');
  });

  it('should resolve an empty array without a second call when the case has no receipts', async () => {
    mock.on('Pll/CaseReceiptCase/GetList', []);
    assert.deepEqual(await fin.getReceipts(1), []);
    assert.deepEqual(mock.paths(), ['Pll/CaseReceiptCase/GetList']);
  });

  it('should propagate errors from either call', async () => {
    mock.onError('Pll/CaseReceiptCase/GetList', {Message: 'first'});
    assert.include((await rejection(fin.getReceipts(1))).Message, 'first');
    mock.on('Pll/CaseReceiptCase/GetList', [{CaReceiptId: 1}]);
    mock.onError('Pll/CaseReceipt/GetList', {Message: 'second'});
    assert.include((await rejection(fin.getReceipts(1))).Message, 'second');
  });
});

describe('[CaseFinancial::downloadReceipts] function test', () => {
  const mock = createMock(cw6.Cityworks);
  const PDF = '%PDF-1.4 dummy';

  it('should resolve the receipt\'s file contents and name when given a file name', async () => {
    mock.onRaw('Pll/CasePayment/DownloadReceipt', PDF);
    const r = await fin.downloadReceipt('Receipt_1');
    assert.deepEqual(mock.lastCall('Pll/CasePayment/DownloadReceipt').data, {Name: 'Receipt_1'});
    assert.equal(r.file, PDF);
    assert.equal(r.name, 'Receipt_1.pdf');
    assert.deepEqual(mock.paths(), ['Pll/CasePayment/DownloadReceipt']);
  });

  it('should look up the file name first when given a receipt id', async () => {
    mock.on('Pll/CaseReceipt/GetList', [{CaReceiptId: 33, ReceiptFileName: 'Receipt_33'}]);
    mock.onRaw('Pll/CasePayment/DownloadReceipt', PDF);
    const r = await fin.downloadReceipt(33);
    assert.deepEqual(mock.paths(), ['Pll/CaseReceipt/GetList', 'Pll/CasePayment/DownloadReceipt']);
    assert.deepEqual(mock.lastCall('Pll/CaseReceipt/GetList').data, {WhereClause: ' CA_RECEIPTS.CA_RECEIPT_ID in (33)'});
    assert.deepEqual(mock.lastCall('Pll/CasePayment/DownloadReceipt').data, {Name: 'Receipt_33'});
    assert.equal(r.name, 'Receipt_33.pdf');
    assert.equal(r.file, PDF);
  });

  it('should propagate download errors', async () => {
    mock.onError('Pll/CasePayment/DownloadReceipt', {Message: 'missing receipt'});
    assert.include((await rejection(fin.downloadReceipt('x'))).Message, 'missing receipt');
  });

  it('should propagate lookup errors and not attempt the download', async () => {
    mock.onError('Pll/CaseReceipt/GetList', {Message: 'lookup failed'});
    const e = await rejection(fin.downloadReceipt(33));
    assert.include(e.Message, 'lookup failed');
    assert.notInclude(mock.paths(), 'Pll/CasePayment/DownloadReceipt');
  });
});

describe('[CaseFinancial::makePayment] function test', () => {
  const mock = createMock(cw6.Cityworks);

  beforeEach(() => {
    mock.on('Pll/CasePayment/MakePayment', 12345);
  });

  it('should make a payment on a fee', async () => {
    const r = await fin.makePayment([['CASH', '3.23', 'test comment', '2025-01-05 17:07:04', 'test']], [93572]);
    assert.isNumber(r);
    assert.deepEqual(mock.lastCall('Pll/CasePayment/MakePayment').data, {
      CaFeeIds: [93572],
      TenderTypes: [['CASH', '3.23', 'test comment', '1/5/2025 5:07:04 PM', 'test']],
      CaPayer: {Name: ''}
    });
  });

  it('should make a payment on several fees', async () => {
    const r = await fin.makePayment([['PAYIT CC', '225.72', 'test comment', '2025-11-09 11:45:00', 'test']], [214310, 263031, 269293]);
    assert.isNumber(r);
    const data = mock.lastCall('Pll/CasePayment/MakePayment').data;
    assert.deepEqual(data.CaFeeIds, [214310, 263031, 269293]);
    assert.deepEqual(data.TenderTypes, [['PAYIT CC', '225.72', 'test comment', '11/9/2025 11:45:00 AM', 'test']]);
  });

  it('should make payments on several fees', async () => {
    const r = await fin.makePayment([
      ['ACH', '117.72', 'test comment', '2025-11-23 11:45:00', 'test'],
      ['CC', '108.00', 'test comment', '2025-11-23 11:44:00', 'test']
    ], [263031, 214310, 269293]);
    assert.isNumber(r);
    const data = mock.lastCall('Pll/CasePayment/MakePayment').data;
    assert.lengthOf(data.TenderTypes, 2);
    assert.equal(data.TenderTypes[1][3], '11/23/2025 11:44:00 AM');
  });

  it('should send payer info when provided', async () => {
    await fin.makePayment([['CASH', '1.00', 'c', '2025-01-05 09:05:07', 'r']], [1], {Name: 'Pat Example', Email: 'pat@example.com'});
    const data = mock.lastCall('Pll/CasePayment/MakePayment').data;
    assert.equal(data.CaPayer.Email, 'pat@example.com');
    assert.equal(data.TenderTypes[0][3], '1/5/2025 9:05:07 AM');
  });

  it('should reject with code 301 when a payment does not have 5 elements', async () => {
    const e = await rejection(fin.makePayment([['CASH', '3.23']], [1]));
    assert.equal(e.Code, 301);
  });

  it('should reject with code 302 when the payment amount is not a number', async () => {
    const e = await rejection(fin.makePayment([['CASH', 'abc', 'c', '2025-01-05 17:07:04', 'r']], [1]));
    assert.equal(e.Code, 302);
  });

  it('should propagate API errors', async () => {
    mock.onError('Pll/CasePayment/MakePayment', {Message: 'declined'});
    const e = await rejection(fin.makePayment([['CASH', '1.00', 'c', '2025-01-05 17:07:04', 'r']], [1]));
    assert.include(e.Message, 'declined');
  });
});

describe('[CaseFinancial] mocked pass-through methods', () => {
  const mock = createMock(cw6.Cityworks);
  const cases = [
    ['addPayment', [5, {Amount: 3}], 'Pll/CasePayment/Add', {CaObjectId: 5, Amount: 3}],
    ['addRefund', [6, 2.5, 'oops'], 'Pll/CasePaymentRefund/Add', {CaPaymentId: 6, RefundAmount: 2.5, Comments: 'oops'}],
    ['addDepositPayment', [7, {Amount: 1}], 'Pll/CasePayment/AddDeposit', {CaDepositId: 7, Amount: 1}],
    ['addDeposit', [5, 8], 'Pll/CaseDeposit/Add', {CaObjectId: 5, DepositId: 8}],
    ['addDeposit', [5, 8, 20, 'note'], 'Pll/CaseDeposit/Add', {CaObjectId: 5, DepositId: 8, Amount: 20, CommentText: 'note'}],
    ['addInstrument', [5, 9, 100, '2026-01-01T00:00:00.000Z', {Company: 'Acme'}], 'Pll/CaseInstrument/Add', {CaObjectId: 5, InstTypeId: 9, Amount: 100, DateExpire: '2026-01-01T00:00:00.000Z', Company: 'Acme'}],
    ['voidRefund', [3, 'Y'], 'Pll/CasePaymentRefund/Update', {CaPaymentRefundId: 3, Voided: 'Y'}],
    ['addDefaultDeposits', [5, 6], 'Pll/CaseDeposit/AddDefault', {CaObjectId: 5, BusCaseId: 6}],
    ['getDeposits', [5], 'Pll/CaseDeposit/ByCaObjectId', {CaObjectId: 5}],
    ['getPayments', [5], 'Pll/CasePayment/ByCaObjectId', {CaObjectId: 5}],
    ['getInstruments', [5], 'Pll/CaseInstrument/ByCaObjectId', {CaObjectId: 5}],
    ['deleteFee', [5], 'Pll/CaseFees/Delete', {CaFeeId: 5}],
    ['deleteFeesByCaseId', [5], 'Pll/CaseFees/DeleteByCaObjectId', {CaObjectId: 5}],
    ['deletePayment', [5], 'Pll/CasePayment/Delete', {CaFeeId: 5}],
    ['deleteRefund', [5], 'Pll/CasePaymentRefund/Delete', {CaPaymentRefundId: 5}],
    ['deletePaymentsByCaseId', [5], 'Pll/CasePayment/DeleteByCaObjectId', {CaObjectId: 5}],
    ['deleteDeposit', [5], 'Pll/CaseDeposit/Delete', {CaDepositId: 5}],
    ['deleteDepositsByCaseId', [5], 'Pll/CaseDeposit/DeleteByCaObjectId', {CaObjectId: 5}],
    ['deleteInstrument', [5], 'Pll/CaseInstrument/Delete', {CaInstrumentId: 5}],
    ['deleteInstrumentsByCaseId', [5], 'Pll/CaseInstrument/DeleteByCaObjectId', {CaObjectId: 5}],
    ['getEscrowFees', [5], 'Pll/EscrowFees/GetByBusCaseId', {BusCaseId: 5}],
    ['addEscrowPayment', [[{Amount: 1}]], 'Pll/EscrowPayment/Add', {EscrowPayments: [{Amount: 1}]}],
    ['updateEscrowPayment', [5], 'Pll/EscrowPayment/Update', {BusCaseId: 5}],
    ['searchFees', [{FeeCode: 'F-'}], 'Pll/CaseFees/Search', {FeeCode: 'F-'}],
    ['searchPayments', [{TenderType: 'CASH'}], 'Pll/CasePayment/Search', {TenderType: 'CASH'}],
    ['searchRefunds', [{RefundAmount: 1}], 'Pll/CasePayment/Search', {RefundAmount: 1}],
    ['searchDeposits', [{DepositCode: 'D'}], 'Pll/CaseDeposit/Search', {DepositCode: 'D'}]
  ];

  // These return collections on the live API, so mock them as collections
  const collections = ['getDeposits', 'getEscrowFees', 'searchFees', 'searchPayments', 'searchRefunds', 'searchDeposits'];

  cases.forEach(([method, args, path, payload]) => {
    it(`${method}(${JSON.stringify(args)}) should call ${path} and resolve the response value`, async () => {
      const value = collections.indexOf(method) > -1 ? [{Result: method}] : {Result: method};
      mock.on(path, value);
      const r = await fin[method](...args);
      assert.deepEqual(mock.paths(), [path]);
      assert.deepEqual(mock.lastCall(path).data, payload);
      assert.deepEqual(r, value);
    });

    it(`${method} should propagate API errors`, async () => {
      mock.onError(path, {Message: 'api failure'});
      const e = await rejection(fin[method](...args));
      assert.include(e.Message, 'api failure');
    });
  });

  [
    ['searchFees', 4], ['searchPayments', 5], ['searchRefunds', 6], ['searchDeposits', 1]
  ].forEach(([method, code]) => {
    it(`${method} should reject with code ${code} if no searchable attribute is given`, async () => {
      mock.on('Pll/CaseFees/Search', []).on('Pll/CasePayment/Search', []).on('Pll/CaseDeposit/Search', []);
      const e = await rejection(fin[method]({Unknown: 1}));
      assert.equal(e.Code, code);
    });
  });
});
