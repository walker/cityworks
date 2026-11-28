'use strict';
// Mocked tests: no Cityworks instance is contacted.
var assert = require('chai').assert;
const cw23 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

describe('[CasePeople (construct)] function test', () => {
  it('should be a defined object', () => {
    assert.isObject(cw23.briefcase.people, 'Briefcase.people is an object');
    assert.isFunction(cw23.briefcase.people.get);
  });
});

describe('[CasePeople] mocked function tests', () => {
  const mock = createMock(cw23.Cityworks);
  const people = () => cw23.briefcase.people;

  describe('getRoles', () => {
    it('should return the collection of people roles', async () => {
      const roles = [{RoleId: 1, RoleDesc: 'Owner'}, {RoleId: 2, RoleDesc: 'Applicant'}];
      mock.on('Pll/PeopleRole/All', () => roles);
      const r = await people().getRoles();
      assert.deepEqual(r, roles);
      assert.deepEqual(mock.lastCall('Pll/PeopleRole/All').data, {});
    });

    it('should propagate API errors', async () => {
      mock.onError('Pll/PeopleRole/All', {Message: 'boom'});
      let err;
      try { await people().getRoles(); } catch (e) { err = e; }
      assert.isDefined(err);
      assert.equal(err.Message, 'boom');
    });
  });

  describe('get', () => {
    it('should return people records for a case', async () => {
      const recs = [{CaPeopleId: 1, CaObjectId: 100, Name: 'Pat'}];
      mock.on('Pll/CasePeople/ByCaObjectId', () => recs);
      const r = await people().get(100);
      assert.deepEqual(r, recs);
      assert.deepEqual(mock.lastCall('Pll/CasePeople/ByCaObjectId').data, {CaObjectId: 100});
    });

    it('should propagate API errors', async () => {
      mock.onError('Pll/CasePeople/ByCaObjectId', {Message: 'nope'});
      let err;
      try { await people().get(100); } catch (e) { err = e; }
      assert.equal(err.Message, 'nope');
    });
  });

  describe('search', () => {
    it('should return people objects when idsOnly is false', async () => {
      const recs = [{CaPeopleId: 1, Name: 'Pat'}];
      mock.on('Pll/CasePeople/SearchObject', () => recs);
      const r = await people().search({CaObjectId: 100}, false);
      assert.deepEqual(r, recs);
      assert.deepEqual(mock.paths(), ['Pll/CasePeople/SearchObject']);
      assert.deepEqual(mock.lastCall('Pll/CasePeople/SearchObject').data, {CaObjectId: 100});
    });

    it('should default to returning people objects when idsOnly is omitted', async () => {
      mock.on('Pll/CasePeople/SearchObject', () => []);
      await people().search({Name: 'Pat'});
      assert.deepEqual(mock.paths(), ['Pll/CasePeople/SearchObject']);
    });

    it('should return people IDs when idsOnly is true', async () => {
      mock.on('Pll/CasePeople/Search', () => [1, 2, 3]);
      const r = await people().search({CaObjectId: 100}, true);
      assert.deepEqual(r, [1, 2, 3]);
      assert.deepEqual(mock.paths(), ['Pll/CasePeople/Search']);
      assert.deepEqual(mock.lastCall('Pll/CasePeople/Search').data, {CaObjectId: 100});
    });
  });

  describe('add', () => {
    it('should send the case ID and name and return the new person', async () => {
      mock.on('Pll/CasePeople/Add', (data) => Object.assign({CaPeopleId: 9}, data));
      const r = await people().add(100, 'Case People Test');
      assert.equal(r.CaPeopleId, 9);
      assert.equal(r.Name, 'Case People Test');
      assert.deepEqual(mock.lastCall('Pll/CasePeople/Add').data, {CaObjectId: 100, Name: 'Case People Test'});
    });

    it('should merge extra options into the payload', async () => {
      mock.on('Pll/CasePeople/Add', (data) => data);
      await people().add(100, 'Pat', {Email: 'pat@example.com', RoleId: 2});
      assert.deepEqual(mock.lastCall('Pll/CasePeople/Add').data, {CaObjectId: 100, Name: 'Pat', Email: 'pat@example.com', RoleId: 2});
    });

    it('should propagate API errors', async () => {
      mock.onError('Pll/CasePeople/Add', {Message: 'bad'});
      let err;
      try { await people().add(100, 'Pat'); } catch (e) { err = e; }
      assert.equal(err.Message, 'bad');
    });
  });

  describe('delete', () => {
    it('should delete by CaPeopleId and return the deleted person', async () => {
      mock.on('Pll/CasePeople/Delete', () => ({CaPeopleId: 1, CaObjectId: 100}));
      const r = await people().delete(1);
      assert.deepEqual(r, {CaPeopleId: 1, CaObjectId: 100});
      assert.deepEqual(mock.lastCall('Pll/CasePeople/Delete').data, {CaPeopleId: 1});
    });

    it('should propagate API errors', async () => {
      mock.onError('Pll/CasePeople/Delete', {Message: 'missing'});
      let err;
      try { await people().delete(1); } catch (e) { err = e; }
      assert.equal(err.Message, 'missing');
    });
  });

  describe('deleteAll', () => {
    it('should delete all people for a case', async () => {
      mock.on('Pll/CasePeople/DeleteByCaObjectId', () => undefined);
      await people().deleteAll(100);
      assert.deepEqual(mock.lastCall('Pll/CasePeople/DeleteByCaObjectId').data, {CaObjectId: 100});
    });

    it('should propagate API errors', async () => {
      mock.onError('Pll/CasePeople/DeleteByCaObjectId', {Message: 'denied'});
      let err;
      try { await people().deleteAll(100); } catch (e) { err = e; }
      assert.equal(err.Message, 'denied');
    });
  });
});
