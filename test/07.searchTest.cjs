'use strict';
// Mocked tests: no Cityworks instance is contacted.
const assert = require('chai').assert;
const cw7 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

const rejection = async (promise) => {
  try {
    await promise;
  } catch (e) {
    return e;
  }
  return assert.fail('expected the promise to reject');
};

describe('[Search] mocked function tests', () => {
  const mock = createMock(cw7.Cityworks);

  describe('[Search::quick] function test', () => {
    it('should resolve results and send the search text', async () => {
      mock.on('General/QuickSearch/QuickSearch', {ServiceRequests: [{RequestId: 5}], Permits: []});
      const r = await cw7.search.quick('256460');
      assert.property(r, 'ServiceRequests');
      assert.deepEqual(r.ServiceRequests, [{RequestId: 5}]);
      assert.deepEqual(mock.lastCall('General/QuickSearch/QuickSearch').data, {QuickSearchText: '256460'});
    });

    it('should resolve (empty) results even when the string is not found', async () => {
      mock.on('General/QuickSearch/QuickSearch', {ServiceRequests: [], Permits: []});
      const r = await cw7.search.quick('SomethingSidewalk');
      assert.property(r, 'Permits');
      assert.isEmpty(r.Permits);
    });

    it('should propagate API errors', async () => {
      mock.onError('General/QuickSearch/QuickSearch', {Message: 'nope'});
      assert.equal((await rejection(cw7.search.quick('x'))).Message, 'nope');
    });
  });

  describe('[Search::execute] function test', () => {
    it('should resolve a collection of search results', async () => {
      mock.on('Ams/Search/Execute', [1, 2, 3]);
      const r = await cw7.search.execute(3897);
      assert.deepEqual(r, [1, 2, 3]);
      assert.deepEqual(mock.lastCall('Ams/Search/Execute').data, {SearchId: 3897});
    });

    it('should merge the options into the payload', async () => {
      mock.on('Ams/Search/Execute', []);
      const options = {IdsOnly: true, MaxResults: 10, EmployeeSid: 4, ResultFields: ['RequestId']};
      await cw7.search.execute(3897, options);
      assert.deepEqual(mock.lastCall('Ams/Search/Execute').data, {SearchId: 3897, IdsOnly: true, MaxResults: 10, EmployeeSid: 4, ResultFields: ['RequestId']});
    });

    it('should resolve an empty array if search ID is not found', async () => {
      mock.on('Ams/Search/Execute', []);
      assert.isEmpty(await cw7.search.execute(999999999));
    });

    it('should propagate API errors', async () => {
      mock.onError('Ams/Search/Execute', {Message: 'nope'});
      assert.equal((await rejection(cw7.search.execute(1))).Message, 'nope');
    });
  });

  describe('[Search::getSaved] function test', () => {
    it('should resolve a collection of saved searches', async () => {
      mock.on('Ams/Search/RequestSaved', [{SearchId: 1}]);
      const r = await cw7.search.getSaved('Request');
      assert.deepEqual(r, [{SearchId: 1}]);
      assert.deepEqual(mock.lastCall('Ams/Search/RequestSaved').data, {});
    });

    it('should build the endpoint from the search type and send applyToEntities', async () => {
      mock.on('Ams/Search/WorkOrderSaved', []);
      await cw7.search.getSaved('WorkOrder', ['EASEMENT_TREES']);
      assert.deepEqual(mock.lastCall('Ams/Search/WorkOrderSaved').data, {ApplyToEntities: ['EASEMENT_TREES']});
    });

    it('should use the SavedByType endpoint when an employeeSid and/or domainId is provided', async () => {
      mock.on('Ams/Search/SavedByType', []);
      await cw7.search.getSaved('Request', undefined, 127, 1);
      assert.deepEqual(mock.lastCall('Ams/Search/SavedByType').data, {EmployeeSid: 127, DomainId: 1});
      await cw7.search.getSaved('Request', undefined, 127);
      assert.deepEqual(mock.lastCall('Ams/Search/SavedByType').data, {EmployeeSid: 127});
      await cw7.search.getSaved('Request', null, undefined, 1);
      assert.deepEqual(mock.lastCall('Ams/Search/SavedByType').data, {DomainId: 1});
    });

    it('should allow an empty applyToEntities together with an employeeSid', async () => {
      mock.on('Ams/Search/SavedByType', []);
      await cw7.search.getSaved('Request', [], 127);
      assert.deepEqual(mock.lastCall('Ams/Search/SavedByType').data, {EmployeeSid: 127});
    });

    it('should reject with an error if the search type does not exist', async () => {
      const e = await rejection(cw7.search.getSaved('ServiceRequest'));
      assert.equal(e.Code, 2);
      assert.equal(e.Message, 'SearchType provided does not exist or is mispelled.');
      assert.deepEqual(mock.paths(), []);
    });

    it('should use the Pll saved searches endpoint for Case searches', async () => {
      mock.on('Ams/Search/PllSaved', []);
      await cw7.search.getSaved('Case');
      assert.deepEqual(mock.paths(), ['Ams/Search/PllSaved']);
    });

    it('should reject with an error if the applyToEntities and employeeSid/domainId are all set at the same time', async () => {
      const e = await rejection(cw7.search.getSaved('Request', ['EASEMENT_TREES'], 127, 1));
      assert.equal(e.Code, 3);
      assert.equal(e.Message, 'You cannot specify both applyToEntities AND employeeSid/domainId');
      assert.deepEqual(mock.paths(), []);
    });

    it('should propagate API errors', async () => {
      mock.onError('Ams/Search/RequestSaved', {Message: 'nope'});
      assert.equal((await rejection(cw7.search.getSaved('Request'))).Message, 'nope');
    });
  });

  describe('[Search::displayFields] function test', () => {
    it('should resolve a collection of display fields and send the numeric search type', async () => {
      mock.on('Ams/Search/DisplayFields', [{Name: 'WorkOrderId'}]);
      const r = await cw7.search.displayFields('WorkOrder');
      assert.deepEqual(r, [{Name: 'WorkOrderId'}]);
      assert.deepEqual(mock.lastCall('Ams/Search/DisplayFields').data, {searchType: 2});
    });

    it('should reject with an error if the searchType is not found', async () => {
      const e = await rejection(cw7.search.displayFields('ServiceRequest'));
      assert.equal(e.Code, 1);
      assert.deepEqual(mock.paths(), []);
      assert.equal(e.Message, 'SearchType provided does not exist or is mispelled.');
    });
  });

  describe('[Search::types] function test', () => {
    it('should resolve a collection of types', async () => {
      mock.on('Ams/Search/Types', [{Name: 'Request'}]);
      assert.deepEqual(await cw7.search.types(), [{Name: 'Request'}]);
      assert.deepEqual(mock.lastCall('Ams/Search/Types').data, {});
    });
  });

  describe('[Search::disableServices] function test', () => {
    it('should resolve dictionary of searchIDs and boolean', async () => {
      mock.on('Ams/Search/UpdateEurl', {4338: true});
      const r = await cw7.search.disableServices([4338]);
      assert.propertyVal(r, 4338, true);
      assert.deepEqual(mock.lastCall('Ams/Search/UpdateEurl').data, {Enable: false, SearchIds: [4338]});
    });
    it('should be "False" if search ID does not exist', async () => {
      mock.on('Ams/Search/UpdateEurl', {9999999: false});
      assert.propertyVal(await cw7.search.disableServices([9999999]), 9999999, false);
    });
  });

  describe('[Search::enableServices] function test', () => {
    it('should resolve dictionary of searchIDs and boolean', async () => {
      mock.on('Ams/Search/UpdateEurl', {4338: true});
      const r = await cw7.search.enableServices([4338]);
      assert.propertyVal(r, 4338, true);
      assert.deepEqual(mock.lastCall('Ams/Search/UpdateEurl').data, {Enable: true, SearchIds: [4338]});
    });
    it('should be "False" if search ID does not exist', async () => {
      mock.on('Ams/Search/UpdateEurl', {9999999: false});
      assert.propertyVal(await cw7.search.enableServices([9999999]), 9999999, false);
    });
  });

  describe('[Search::getDefinition] function test', () => {
    it('should resolve the definition of the search', async () => {
      mock.on('Ams/Search/Definition', {SearchId: 4338, SearchFields: [{Name: 'a'}]});
      const r = await cw7.search.getDefinition(4338);
      assert.isObject(r);
      assert.equal(r.SearchId, 4338);
      assert.deepEqual(mock.lastCall('Ams/Search/Definition').data, {SearchId: 4338});
    });
    it('should send the employeeSid when provided', async () => {
      mock.on('Ams/Search/Definition', {});
      await cw7.search.getDefinition(4338, 12);
      assert.deepEqual(mock.lastCall('Ams/Search/Definition').data, {SearchId: 4338, EmployeeSid: 12});
    });
    it('should resolve a blanked search definition if the definition does not exist', async () => {
      mock.on('Ams/Search/Definition', {SearchFields: []});
      assert.isEmpty((await cw7.search.getDefinition(9999999)).SearchFields);
    });
    it('should propagate API errors', async () => {
      mock.onError('Ams/Search/Definition', {Message: 'nope'});
      assert.equal((await rejection(cw7.search.getDefinition(1))).Message, 'nope');
    });
  });

  describe('[Search::getDefinitions] function test', () => {
    it('should resolve the definitions of the searches', async () => {
      mock.on('Ams/Search/Definitions', [{SearchId: 4338}, {SearchId: 4337}, {SearchId: 4336}]);
      const r = await cw7.search.getDefinitions([4338, 4337, 4336]);
      assert.isArray(r);
      assert.lengthOf(r, 3);
      assert.deepEqual(mock.lastCall('Ams/Search/Definitions').data, {SearchIds: [4338, 4337, 4336]});
    });
    it('should send the employeeSid when provided', async () => {
      mock.on('Ams/Search/Definitions', []);
      await cw7.search.getDefinitions([1], 12);
      assert.deepEqual(mock.lastCall('Ams/Search/Definitions').data, {SearchIds: [1], EmployeeSid: 12});
    });
    it('should resolve blanked search definition(s) if the definitions do not exist', async () => {
      mock.on('Ams/Search/Definitions', [{SearchFields: []}]);
      assert.isEmpty((await cw7.search.getDefinitions([9999999, 99999999, 999999999]))[0].SearchFields);
    });
  });

  describe('[Search::getDefinitionNames] function test', () => {
    it('should resolve a collection', async () => {
      mock.on('Ams/Search/DefinitionNames', [{SearchId: 1, Name: 'one'}]);
      const r = await cw7.search.getDefinitionNames([1, 2, 3, 4, 5]);
      assert.isArray(r);
      assert.deepEqual(mock.lastCall('Ams/Search/DefinitionNames').data, {SearchIds: [1, 2, 3, 4, 5]});
    });
  });

  describe('[Search::saveDefinition] function test', () => {
    it('should resolve the saved definition and send the numeric search type with SearchId 0', async () => {
      mock.on('Ams/Search/SaveDefinition', {SearchId: 55});
      const r = await cw7.search.saveDefinition('Request');
      assert.isNumber(r.SearchId);
      assert.deepEqual(mock.lastCall('Ams/Search/SaveDefinition').data, {SearchFor: 1, SearchId: 0});
    });
    it('should merge options and use the provided searchId', async () => {
      mock.on('Ams/Search/SaveDefinition', {SearchId: 9});
      await cw7.search.saveDefinition('WorkOrder', {SearchName: 'Mine'}, 9);
      assert.deepEqual(mock.lastCall('Ams/Search/SaveDefinition').data, {SearchFor: 2, SearchId: 9, SearchName: 'Mine'});
    });
    it('should reject with an error if the search type does not exist', async () => {
      const e = await rejection(cw7.search.saveDefinition('ServiceRequest'));
      assert.equal(e.Code, 1);
      assert.deepEqual(mock.paths(), []);
      assert.equal(e.Message, 'SearchType provided does not exist or is mispelled.');
    });
  });

  describe('[Search::deleteDefinitions] function test', () => {
    it('should resolve a list of success or failure to delete per id', async () => {
      mock.on('Ams/Search/SaveDefinition', {SearchId: 55});
      mock.on('Ams/Search/DeleteDefinitions', (data) => ({[data.SearchIds[0]]: true}));
      const saved = await cw7.search.saveDefinition('Request');
      const rez = await cw7.search.deleteDefinitions([saved.SearchId]);
      assert.isBoolean(rez[saved.SearchId]);
      assert.deepEqual(mock.lastCall('Ams/Search/DeleteDefinitions').data, {SearchIds: [55]});
    });
    it('should propagate API errors', async () => {
      mock.onError('Ams/Search/DeleteDefinitions', {Message: 'nope'});
      assert.equal((await rejection(cw7.search.deleteDefinitions([1]))).Message, 'nope');
    });
  });

  describe('[Search::convertToQuery] function test', () => {
    it('should resolve the converted queries using default flags', async () => {
      mock.on('General/Query/SearchToQuery', [{QueryId: 1}]);
      assert.deepEqual(await cw7.search.convertToQuery([63]), [{QueryId: 1}]);
      assert.deepEqual(mock.lastCall('General/Query/SearchToQuery').data, {SearchIds: [63], SaveQuery: false, AddEurl: false, AllowMultipleBooleanValues: false, AllowEmptyQuery: false});
    });
    it('should send the provided flags', async () => {
      mock.on('General/Query/SearchToQuery', []);
      await cw7.search.convertToQuery([63], true, true, true, true);
      assert.deepEqual(mock.lastCall('General/Query/SearchToQuery').data, {SearchIds: [63], SaveQuery: true, AddEurl: true, AllowMultipleBooleanValues: true, AllowEmptyQuery: true});
    });
  });
});
