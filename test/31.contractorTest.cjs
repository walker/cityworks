'use strict';
// Mocked tests: no Cityworks instance is contacted.
var assert = require('chai').assert;
const cw31 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

async function assertRejects(promise, pattern) {
  let err;
  try {
    await promise;
  } catch(e) {
    err = e;
  }
  assert.isDefined(err, 'expected promise to reject');
  if(pattern) {
    assert.match(err.message || err.Message, pattern);
  }
  return err;
}

function buildContractor(unique) {
  return {
    ContractorName: 'Test Contractor ' + unique,
    ContractorNumber: 'CN' + unique,
    Viewable: true
  };
}

describe('[Contractor (construct)] function test', () => {
  it('should be a defined object', () => {
    assert.isObject(cw31.contractor, 'Contractor is an object');
    assert.isObject(cw31.contractor.type, 'Contractor.type is an object');
  });
});

describe('[Contractor] mocked function tests', () => {
  const mock = createMock(cw31.Cityworks);

  describe('[Contractor::all]', () => {
    it('should return the list of contractors, defaulting ViewableOnly to false', async () => {
      const list = [{ContractorSid: 1}, {ContractorSid: 2}];
      mock.on('Ams/Contractor/All', list);
      const resp = await cw31.contractor.all();
      assert.deepEqual(resp, list);
      assert.deepEqual(mock.paths(), ['Ams/Contractor/All']);
      assert.deepEqual(mock.lastCall('Ams/Contractor/All').data, {ViewableOnly: false});
    });

    it('should pass ViewableOnly through', async () => {
      mock.on('Ams/Contractor/All', []);
      await cw31.contractor.all(true);
      assert.deepEqual(mock.lastCall('Ams/Contractor/All').data, {ViewableOnly: true});
    });

    it('should propagate API errors', async () => {
      mock.onError('Ams/Contractor/All', {Message: 'boom'});
      const err = await assertRejects(cw31.contractor.all());
      assert.equal(err.Message, 'boom');
    });
  });

  describe('[Contractor::add]', () => {
    it('should create and return a new contractor record', async () => {
      const contractor = buildContractor('123');
      mock.on('Ams/Contractor/Add', (data) => Object.assign({ContractorSid: 42}, data));
      const resp = await cw31.contractor.add(contractor);
      assert.equal(resp.ContractorSid, 42);
      assert.equal(resp.ContractorName, contractor.ContractorName);
      assert.deepEqual(mock.paths(), ['Ams/Contractor/Add']);
      assert.deepEqual(mock.lastCall('Ams/Contractor/Add').data, contractor);
    });

    it('should propagate API errors', async () => {
      mock.onError('Ams/Contractor/Add', {Message: 'duplicate'});
      const err = await assertRejects(cw31.contractor.add(buildContractor('1')));
      assert.equal(err.Message, 'duplicate');
    });
  });

  describe('[Contractor::update]', () => {
    it('should send the ContractorSid merged with the properties and return the record', async () => {
      mock.on('Ams/Contractor/Update', (data) => data);
      const resp = await cw31.contractor.update(42, {
        ContractorName: 'Test Contractor 123',
        Description: 'Updated contractor description'
      });
      assert.equal(resp.Description, 'Updated contractor description');
      assert.deepEqual(mock.lastCall('Ams/Contractor/Update').data, {
        ContractorSid: 42,
        ContractorName: 'Test Contractor 123',
        Description: 'Updated contractor description'
      });
    });

    it('should prefer the ContractorSid argument over one in the properties', async () => {
      mock.on('Ams/Contractor/Update', (data) => data);
      await cw31.contractor.update(42, {ContractorSid: 99, Description: 'x'});
      assert.deepEqual(mock.lastCall('Ams/Contractor/Update').data, {ContractorSid: 42, Description: 'x'});
    });

    it('should propagate API errors', async () => {
      mock.onError('Ams/Contractor/Update', {Message: 'not found'});
      const err = await assertRejects(cw31.contractor.update(42, {Description: 'x'}));
      assert.equal(err.Message, 'not found');
    });
  });

  describe('[Contractor::getById]', () => {
    it('should retrieve contractor by ID', async () => {
      mock.on('Ams/Contractor/ById', (data) => ({ContractorSid: data.ContractorSid, ContractorName: 'Acme'}));
      const resp = await cw31.contractor.getById(7);
      assert.deepEqual(resp, {ContractorSid: 7, ContractorName: 'Acme'});
      assert.deepEqual(mock.lastCall('Ams/Contractor/ById').data, {ContractorSid: 7});
    });

    it('should propagate API errors', async () => {
      mock.onError('Ams/Contractor/ById', {Message: 'missing'});
      const err = await assertRejects(cw31.contractor.getById(7));
      assert.equal(err.Message, 'missing');
    });
  });

  describe('[Contractor::search]', () => {
    it('should search by an array of ContractorSids', async () => {
      mock.on('Ams/Contractor/Search', [{ContractorSid: 1}, {ContractorSid: 2}]);
      const resp = await cw31.contractor.search([1, 2]);
      assert.deepEqual(resp, [{ContractorSid: 1}, {ContractorSid: 2}]);
      assert.deepEqual(mock.paths(), ['Ams/Contractor/Search']);
      assert.deepEqual(mock.lastCall('Ams/Contractor/Search').data, {ContractorSids: [1, 2]});
    });

    it('should use the PLL search when given an object with BusinessName or ContractorId', async () => {
      mock.on('Pll/ContractorPll/SearchObject', [{ContractorId: 3}]);
      const resp = await cw31.contractor.search({BusinessName: 'Acme', ContractorId: 3});
      assert.deepEqual(resp, [{ContractorId: 3}]);
      assert.deepEqual(mock.paths(), ['Pll/ContractorPll/SearchObject']);
      assert.deepEqual(mock.lastCall('Pll/ContractorPll/SearchObject').data, {BusinessName: 'Acme', ContractorId: 3});
    });

    it('should reject an object with no searchable attributes without calling the API', async () => {
      await assertRejects(cw31.contractor.search({}), /BusinessName, ContractorId/);
      await assertRejects(cw31.contractor.search({Other: 1}), /BusinessName, ContractorId/);
      assert.lengthOf(mock.calls, 0);
    });

    it('should propagate API errors', async () => {
      mock.onError('Ams/Contractor/Search', {Message: 'bad'});
      mock.onError('Pll/ContractorPll/SearchObject', {Message: 'bad pll'});
      assert.equal((await assertRejects(cw31.contractor.search([1]))).Message, 'bad');
      assert.equal((await assertRejects(cw31.contractor.search({ContractorId: 1}))).Message, 'bad pll');
    });
  });

  describe('[Contractor::customDataFields]', () => {
    it('should retrieve custom data fields for a contractor', async () => {
      mock.on('Ams/Contractor/CustomDataFields', [{CustFieldId: 1, Value: 'a'}]);
      const resp = await cw31.contractor.customDataFields(7);
      assert.deepEqual(resp, [{CustFieldId: 1, Value: 'a'}]);
      assert.deepEqual(mock.lastCall('Ams/Contractor/CustomDataFields').data, {ContractorSid: 7});
    });

    it('should include CustFieldIds when provided', async () => {
      mock.on('Ams/Contractor/CustomDataFields', []);
      await cw31.contractor.customDataFields(7, [1, 2]);
      assert.deepEqual(mock.lastCall('Ams/Contractor/CustomDataFields').data, {ContractorSid: 7, CustFieldIds: [1, 2]});
    });

    it('should propagate API errors', async () => {
      mock.onError('Ams/Contractor/CustomDataFields', {Message: 'bad'});
      assert.equal((await assertRejects(cw31.contractor.customDataFields(7))).Message, 'bad');
    });
  });

  describe('[Contractor::delete]', () => {
    it('should delete contractor records', async () => {
      mock.on('Ams/Contractor/Delete', {Deleted: 2});
      const resp = await cw31.contractor.delete([42, 43]);
      assert.deepEqual(resp, {Deleted: 2});
      assert.deepEqual(mock.lastCall('Ams/Contractor/Delete').data, {ContractorSids: [42, 43]});
    });

    it('should propagate API errors', async () => {
      mock.onError('Ams/Contractor/Delete', {Message: 'bad'});
      assert.equal((await assertRejects(cw31.contractor.delete([1]))).Message, 'bad');
    });
  });

  describe('[Contractor::keywords]', () => {
    it('should retrieve contractor keywords for valid contractor IDs', async () => {
      mock.on('Ams/Contractor/Keywords', [{ContractorSid: 1, Keywords: ['a']}]);
      const resp = await cw31.contractor.keywords([1]);
      assert.deepEqual(resp, [{ContractorSid: 1, Keywords: ['a']}]);
      assert.deepEqual(mock.lastCall('Ams/Contractor/Keywords').data, {ContractorSids: [1]});
    });

    it('should propagate API errors', async () => {
      mock.onError('Ams/Contractor/Keywords', {Message: 'bad'});
      assert.equal((await assertRejects(cw31.contractor.keywords([1]))).Message, 'bad');
    });
  });

  describe('[Contractor::addKeywords]', () => {
    it('should add keywords for valid contractor IDs', async () => {
      mock.on('Ams/Contractor/AddKeywords', {Added: 1});
      const resp = await cw31.contractor.addKeywords([1], ['test-keyword']);
      assert.deepEqual(resp, {Added: 1});
      assert.deepEqual(mock.lastCall('Ams/Contractor/AddKeywords').data, {ContractorSids: [1], Keywords: ['test-keyword']});
    });

    it('should propagate API errors', async () => {
      mock.onError('Ams/Contractor/AddKeywords', {Message: 'bad'});
      assert.equal((await assertRejects(cw31.contractor.addKeywords([1], ['k']))).Message, 'bad');
    });
  });

  describe('[Contractor::deleteKeywords]', () => {
    it('should delete keywords for valid contractor IDs, defaulting All to false', async () => {
      mock.on('Ams/Contractor/DeleteKeywords', {Deleted: 1});
      const resp = await cw31.contractor.deleteKeywords([1], ['test-keyword']);
      assert.deepEqual(resp, {Deleted: 1});
      assert.deepEqual(mock.lastCall('Ams/Contractor/DeleteKeywords').data, {
        ContractorSids: [1],
        Keywords: ['test-keyword'],
        All: false
      });
    });

    it('should pass All through', async () => {
      mock.on('Ams/Contractor/DeleteKeywords', {});
      await cw31.contractor.deleteKeywords([1], [], true);
      assert.deepEqual(mock.lastCall('Ams/Contractor/DeleteKeywords').data, {ContractorSids: [1], Keywords: [], All: true});
    });

    it('should propagate API errors', async () => {
      mock.onError('Ams/Contractor/DeleteKeywords', {Message: 'bad'});
      assert.equal((await assertRejects(cw31.contractor.deleteKeywords([1], ['k']))).Message, 'bad');
    });
  });
});

describe('[ContractorType] mocked function tests', () => {
  const mock = createMock(cw31.Cityworks);
  const types = [{ContractorTypeId: 1, ContractorType: 'Paving', ContractorDesc: 'Road work'}];

  describe('[ContractorType::all]', () => {
    it('should return a list of contractor types', async () => {
      mock.on('Pll/ContractorType/All', types);
      const resp = await cw31.contractor.type.all();
      assert.deepEqual(resp, types);
      assert.deepEqual(mock.paths(), ['Pll/ContractorType/All']);
      assert.deepEqual(mock.lastCall('Pll/ContractorType/All').data, {});
    });

    it('should propagate API errors', async () => {
      mock.onError('Pll/ContractorType/All', {Message: 'bad'});
      assert.equal((await assertRejects(cw31.contractor.type.all())).Message, 'bad');
    });
  });

  [
    ['search', 'Pll/ContractorType/Search'],
    ['searchObject', 'Pll/ContractorType/SearchObject']
  ].forEach(([method, path]) => {
    describe('[ContractorType::' + method + ']', () => {
      [
        {ContractorTypeId: 1},
        {ContractorType: 'Paving'},
        {ContractorDesc: 'Road work'}
      ].forEach(filters => {
        it('should search by ' + Object.keys(filters)[0], async () => {
          mock.on(path, types);
          const resp = await cw31.contractor.type[method](filters);
          assert.deepEqual(resp, types);
          assert.deepEqual(mock.paths(), [path]);
          assert.deepEqual(mock.lastCall(path).data, filters);
        });
      });

      it('should reject without any searchable attribute and not call the API', async () => {
        await assertRejects(cw31.contractor.type[method]({}), /ContractorDesc, ContractorType, ContractorTypeId/);
        assert.lengthOf(mock.calls, 0);
      });

      it('should propagate API errors', async () => {
        mock.onError(path, {Message: 'bad'});
        assert.equal((await assertRejects(cw31.contractor.type[method]({ContractorTypeId: 1}))).Message, 'bad');
      });
    });
  });
});
