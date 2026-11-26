'use strict';
// Mocked tests: no Cityworks instance is contacted.
const assert = require('chai').assert;
const cw15 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

describe('[CaseFlag] mocked function tests', () => {
  const mock = createMock(cw15.Cityworks);

  describe('[CaseFlag::add] function test', () => {
    it('Should add one flag to the case', async () => {
      const applied = new Date('2027-02-01T12:00:00Z');
      mock.on('Pll/CaseFlags/Add', () => 9001);
      const r = await cw15.briefcase.flag.add(107213, 7, 'FLAG', 420, applied);
      assert.strictEqual(r, 9001);
      assert.deepEqual(mock.lastCall('Pll/CaseFlags/Add').data, {
        CaObjectId: 107213, FlagId: 7, Severity: 'FLAG', AppliedBy: 420, DateApplied: applied.toISOString()
      });
    });

    it('Should merge options into the payload', async () => {
      mock.on('Pll/CaseFlags/Add', () => 9002);
      await cw15.briefcase.flag.add(1, 2, 'WARN', 3, new Date(0), {Notes: 'note', DisciplineId: 5});
      const d = mock.lastCall('Pll/CaseFlags/Add').data;
      assert.equal(d.Notes, 'note');
      assert.equal(d.DisciplineId, 5);
      assert.equal(d.Severity, 'WARN');
    });

    it('Should propagate API errors', async () => {
      mock.onError('Pll/CaseFlags/Add', {Message: 'nope'});
      let err;
      try { await cw15.briefcase.flag.add(1, 2, 'FLAG', 3, new Date()); } catch(e) { err = e; }
      assert.isDefined(err);
      assert.equal(err.Message, 'nope');
    });
  });

  describe('[CaseFlag::delete] function test', () => {
    it('Should delete one flag', async () => {
      mock.on('Pll/CaseFlags/Delete', () => 1);
      const r = await cw15.briefcase.flag.delete(555);
      assert.strictEqual(r, 1);
      assert.deepEqual(mock.lastCall('Pll/CaseFlags/Delete').data, {CaFlagId: 555});
    });
  });

  describe('[CaseFlag::deleteAll] function test', () => {
    it('Should delete all flags', async () => {
      mock.on('Pll/CaseFlags/DeleteByCaObjectId', () => 3);
      const r = await cw15.briefcase.flag.deleteAll(107213);
      assert.strictEqual(r, 3);
      assert.deepEqual(mock.lastCall('Pll/CaseFlags/DeleteByCaObjectId').data, {CaObjectId: 107213});
    });
  });

  describe('[CaseFlag::getForCase] function test', () => {
    it('Should get all flags for provided CaseID', async () => {
      const flags = [{CaFlagId: 1, FlagDesc: 'One'}, {CaFlagId: 2, FlagDesc: 'Two'}];
      mock.on('Pll/CaseFlags/ByCaObjectId', () => flags);
      const r = await cw15.briefcase.flag.getForCase(107213);
      assert.deepEqual(r, flags);
      assert.deepEqual(mock.lastCall('Pll/CaseFlags/ByCaObjectId').data, {CaObjectId: 107213});
    });
  });

  describe('[CaseFlag::search] function test', () => {
    it('Should get all flags that match the provided search criteria', async () => {
      mock.on('Pll/CaseFlags/Search', () => [{CaFlagId: 4, FlagDesc: 'Unprocessed'}]);
      const r = await cw15.briefcase.flag.search({FlagDesc: 'Unprocessed'});
      assert.deepEqual(r, [{CaFlagId: 4, FlagDesc: 'Unprocessed'}]);
      assert.deepEqual(mock.lastCall('Pll/CaseFlags/Search').data, {FlagDesc: 'Unprocessed'});
    });

    it('Should reject with CWError 3 when no recognised filter is provided', async () => {
      mock.on('Pll/CaseFlags/Search', () => []);
      let err;
      try { await cw15.briefcase.flag.search({Other: 1}); } catch(e) { err = e; }
      assert.equal(err.Code, 3);
      assert.include(err.Message, 'At least one of the attributes');
    });
  });
});
