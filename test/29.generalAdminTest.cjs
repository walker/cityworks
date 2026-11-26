'use strict';
// Mocked tests: no Cityworks instance is contacted.
var assert = require('chai').assert;
const cw29 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

describe('[GeneralAdmin (construct)] function test', () => {
  it('should be a defined object', () => {
    assert.isObject(cw29.general_admin, 'general_admin is an object');
    ['getHolidays', 'getHolidayByDate', 'addHoliday', 'deleteHolidays', 'findReplaceConfigurationText'].forEach(fn => {
      assert.isFunction(cw29.general_admin[fn], fn);
    });
  });
});

describe('[GeneralAdmin] mocked request test', () => {
  const mock = createMock(cw29.Cityworks);

  async function assertRejects(promise, code, message) {
    try {
      await promise;
    } catch(e) {
      assert.equal(e.Code, code);
      assert.equal(e.Message, message);
      return;
    }
    assert.fail('expected promise to reject');
  }

  describe('[GeneralAdmin::getHolidays] function test', () => {
    it('should return the holidays list with an empty payload when no dates are given', async () => {
      const holidays = [{Holiday: '2026-12-25', Description: 'Dummy Day'}];
      mock.on('General/Holidays/All', () => holidays);
      const r = await cw29.general_admin.getHolidays();
      assert.deepEqual(r, holidays);
      assert.deepEqual(mock.paths(), ['General/Holidays/All']);
      assert.deepEqual(mock.lastCall('General/Holidays/All').data, {});
    });

    it('should send StartDate and EndDate for a date range', async () => {
      mock.on('General/Holidays/All', () => []);
      const r = await cw29.general_admin.getHolidays('2026-01-01', '2027-01-01');
      assert.deepEqual(r, []);
      assert.deepEqual(mock.lastCall('General/Holidays/All').data, {StartDate: '2026-01-01', EndDate: '2027-01-01'});
    });

    it('should send only StartDate when EndDate is omitted', async () => {
      mock.on('General/Holidays/All', () => []);
      await cw29.general_admin.getHolidays('2026-01-01');
      assert.deepEqual(mock.lastCall('General/Holidays/All').data, {StartDate: '2026-01-01'});
    });

    it('should resolve null when the API returns a null value', async () => {
      mock.on('General/Holidays/All', () => null);
      assert.isNull(await cw29.general_admin.getHolidays());
    });

    it('should propagate API errors', async () => {
      mock.onError('General/Holidays/All', {Code: 7, Message: 'Nope'});
      await assertRejects(cw29.general_admin.getHolidays(), 7, 'Nope');
    });
  });

  describe('[GeneralAdmin::getHolidayByDate] function test', () => {
    it('should request a holiday by date and resolve its value', async () => {
      const holiday = {Holiday: '2026-12-25', Description: 'Dummy Day'};
      mock.on('General/Holidays/ByDate', () => holiday);
      const r = await cw29.general_admin.getHolidayByDate('2026-12-25');
      assert.deepEqual(r, holiday);
      assert.deepEqual(mock.lastCall('General/Holidays/ByDate').data, {Date: '2026-12-25'});
    });

    it('should resolve null when no holiday is defined', async () => {
      mock.on('General/Holidays/ByDate', () => null);
      assert.isNull(await cw29.general_admin.getHolidayByDate('2026-12-26'));
    });

    it('should propagate API errors', async () => {
      mock.onError('General/Holidays/ByDate', {Code: 8, Message: 'Bad date'});
      await assertRejects(cw29.general_admin.getHolidayByDate('bad'), 8, 'Bad date');
    });
  });

  describe('[GeneralAdmin::addHoliday] function test', () => {
    it('should post Holiday and Description', async () => {
      mock.on('General/Holidays/Add', (data) => data);
      const r = await cw29.general_admin.addHoliday('2026-12-31', 'Dummy Holiday');
      assert.deepEqual(r, {Holiday: '2026-12-31', Description: 'Dummy Holiday'});
      assert.deepEqual(mock.paths(), ['General/Holidays/Add']);
      assert.deepEqual(mock.lastCall('General/Holidays/Add').data, {Holiday: '2026-12-31', Description: 'Dummy Holiday'});
    });

    it('should resolve true when the API returns no value', async () => {
      mock.on('General/Holidays/Add', () => undefined);
      assert.isTrue(await cw29.general_admin.addHoliday('2026-12-31', 'Dummy Holiday'));
    });

    it('should propagate API errors', async () => {
      mock.onError('General/Holidays/Add', {Code: 9, Message: 'Duplicate'});
      await assertRejects(cw29.general_admin.addHoliday('2026-12-31', 'Dummy Holiday'), 9, 'Duplicate');
    });
  });

  describe('[GeneralAdmin::deleteHolidays] function test', () => {
    it('should post the list of holiday dates', async () => {
      mock.on('General/Holidays/Delete', () => undefined);
      const r = await cw29.general_admin.deleteHolidays(['2026-12-31', '2027-01-01']);
      assert.isTrue(r);
      assert.deepEqual(mock.paths(), ['General/Holidays/Delete']);
      assert.deepEqual(mock.lastCall('General/Holidays/Delete').data, {Holidays: ['2026-12-31', '2027-01-01']});
    });

    it('should propagate API errors', async () => {
      mock.onError('General/Holidays/Delete', {Code: 10, Message: 'Cannot delete'});
      await assertRejects(cw29.general_admin.deleteHolidays(['2026-12-31']), 10, 'Cannot delete');
    });
  });

  describe('[GeneralAdmin::findReplaceConfigurationText] function test', () => {
    const path = 'General/EurlQuery/FindReplaceConfigurationText';

    it('should post OldText and NewText only when no options are given', async () => {
      mock.on(path, () => undefined);
      const r = await cw29.general_admin.findReplaceConfigurationText('old-config-value', 'new-config-value');
      assert.isTrue(r);
      assert.deepEqual(mock.lastCall(path).data, {OldText: 'old-config-value', NewText: 'new-config-value'});
    });

    it('should merge filter options into the payload', async () => {
      mock.on(path, () => 3);
      const options = {
        QueryDefinitionIds: [1],
        DomainIds: [2],
        IsPublic: false,
        QueryIds: [3],
        CreatedBySids: [4],
        Configuration: 'SELECT%'
      };
      const r = await cw29.general_admin.findReplaceConfigurationText('old-config-value', 'new-config-value', options);
      assert.equal(r, 3);
      assert.deepEqual(mock.lastCall(path).data, Object.assign({OldText: 'old-config-value', NewText: 'new-config-value'}, options));
    });

    it('should propagate API errors', async () => {
      mock.onError(path, {Code: 11, Message: 'Not allowed'});
      await assertRejects(cw29.general_admin.findReplaceConfigurationText('a', 'b'), 11, 'Not allowed');
    });
  });
});
