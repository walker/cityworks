'use strict';
// Mocked tests: no Cityworks instance is contacted.
// Exercises the contractor workflows (add -> update/getById/search/keywords) against a small stateful in-memory fake.
var assert = require('chai').assert;
const cw21 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

describe('[Contractor (construct)] function test', () => {
  it('should be a defined object', () => {
    assert.isObject(cw21.contractor, 'Contractor is an object');
  });
});

describe('[Contractor] mocked workflow tests', () => {
  const mock = createMock(cw21.Cityworks);
  let store;
  let keywords;

  function installFake() {
    store = {};
    keywords = {};
    let nextSid = 100;

    mock.on('Ams/Contractor/Add', (data) => {
      const rec = Object.assign({ContractorSid: nextSid++}, data);
      store[rec.ContractorSid] = rec;
      return rec;
    });
    mock.on('Ams/Contractor/Update', (data) => {
      store[data.ContractorSid] = Object.assign(store[data.ContractorSid], data);
      return store[data.ContractorSid];
    });
    mock.on('Ams/Contractor/All', (data) => Object.keys(store).map(k => store[k]).filter(c => !data.ViewableOnly || c.Viewable));
    mock.on('Ams/Contractor/ById', (data) => store[data.ContractorSid]);
    mock.on('Ams/Contractor/Search', (data) => data.ContractorSids.map(sid => store[sid]).filter(Boolean));
    mock.on('Ams/Contractor/Keywords', (data) => data.ContractorSids.map(sid => ({ContractorSid: sid, Keywords: keywords[sid] || []})));
    mock.on('Ams/Contractor/AddKeywords', (data) => {
      data.ContractorSids.forEach(sid => {
        keywords[sid] = (keywords[sid] || []).concat(data.Keywords);
      });
      return true;
    });
    mock.on('Ams/Contractor/DeleteKeywords', (data) => {
      data.ContractorSids.forEach(sid => {
        keywords[sid] = data.All ? [] : (keywords[sid] || []).filter(k => data.Keywords.indexOf(k) < 0);
      });
      return true;
    });
  }

  // Registered after createMock's beforeEach, so the mock is reset before the fake is installed.
  beforeEach(installFake);

  it('should add a contractor, then update and retrieve it by ID', async () => {
    const created = await cw21.contractor.add({ContractorName: 'Test Contractor A', ContractorNumber: 'CNA', Viewable: true});
    assert.property(created, 'ContractorSid');
    assert.equal(created.ContractorName, 'Test Contractor A');

    const updated = await cw21.contractor.update(created.ContractorSid, {
      ContractorName: created.ContractorName,
      Description: 'Updated contractor description'
    });
    assert.equal(updated.Description, 'Updated contractor description');
    assert.deepEqual(mock.lastCall('Ams/Contractor/Update').data, {
      ContractorSid: created.ContractorSid,
      ContractorName: 'Test Contractor A',
      Description: 'Updated contractor description'
    });

    const fetched = await cw21.contractor.getById(created.ContractorSid);
    assert.deepEqual(fetched, updated);
    assert.deepEqual(mock.lastCall('Ams/Contractor/ById').data, {ContractorSid: created.ContractorSid});
  });

  it('should list added contractors and filter by ViewableOnly', async () => {
    await cw21.contractor.add({ContractorName: 'Visible', Viewable: true});
    await cw21.contractor.add({ContractorName: 'Hidden', Viewable: false});

    const everyone = await cw21.contractor.all();
    assert.deepEqual(everyone.map(c => c.ContractorName), ['Visible', 'Hidden']);

    const viewable = await cw21.contractor.all(true);
    assert.deepEqual(viewable.map(c => c.ContractorName), ['Visible']);
  });

  it('should use a listed contractor ID to getById and search', async () => {
    await cw21.contractor.add({ContractorName: 'One'});
    await cw21.contractor.add({ContractorName: 'Two'});

    const list = await cw21.contractor.all();
    const sid = list[1].ContractorSid;

    const two = await cw21.contractor.getById(sid);
    assert.equal(two.ContractorName, 'Two');

    const found = await cw21.contractor.search([sid]);
    assert.deepEqual(found, [two]);
    assert.deepEqual(mock.lastCall('Ams/Contractor/Search').data, {ContractorSids: [sid]});
  });

  it('should add, list, and delete keywords for a contractor', async () => {
    const created = await cw21.contractor.add({ContractorName: 'Keyworded'});
    const sid = created.ContractorSid;

    await cw21.contractor.addKeywords([sid], ['test-keyword', 'other']);
    assert.deepEqual(await cw21.contractor.keywords([sid]), [{ContractorSid: sid, Keywords: ['test-keyword', 'other']}]);

    await cw21.contractor.deleteKeywords([sid], ['test-keyword']);
    assert.deepEqual(mock.lastCall('Ams/Contractor/DeleteKeywords').data, {
      ContractorSids: [sid],
      Keywords: ['test-keyword'],
      All: false
    });
    assert.deepEqual(await cw21.contractor.keywords([sid]), [{ContractorSid: sid, Keywords: ['other']}]);

    await cw21.contractor.deleteKeywords([sid], [], true);
    assert.deepEqual(await cw21.contractor.keywords([sid]), [{ContractorSid: sid, Keywords: []}]);
  });

  it('should resolve undefined for keyword calls whose response has no Value', async () => {
    mock.onRaw('Ams/Contractor/AddKeywords', {Status: 0});
    mock.onRaw('Ams/Contractor/DeleteKeywords', {Status: 0});
    assert.isUndefined(await cw21.contractor.addKeywords([1], ['k']));
    assert.isUndefined(await cw21.contractor.deleteKeywords([1], ['k']));
  });

  it('should send only the ContractorSid when update is given empty properties', async () => {
    const created = await cw21.contractor.add({ContractorName: 'Empty'});
    await cw21.contractor.update(created.ContractorSid, {});
    assert.deepEqual(mock.lastCall('Ams/Contractor/Update').data, {ContractorSid: created.ContractorSid});
  });

  it('should send the ContractorSid argument rather than one in the properties, without changing the properties object', async () => {
    const props = {ContractorSid: 999, Description: 'x'};
    await cw21.contractor.add({ContractorName: 'Strip'});
    await cw21.contractor.update(100, props);
    assert.deepEqual(mock.lastCall('Ams/Contractor/Update').data, {ContractorSid: 100, Description: 'x'});
    assert.deepEqual(props, {ContractorSid: 999, Description: 'x'});
  });

  it('should reject a failing lookup and stop the chain', async () => {
    mock.onError('Ams/Contractor/All', {Message: 'unavailable'});
    let err;
    try {
      const list = await cw21.contractor.all();
      await cw21.contractor.getById(list[0].ContractorSid);
    } catch(e) {
      err = e;
    }
    assert.equal(err.Message, 'unavailable');
    assert.deepEqual(mock.paths(), ['Ams/Contractor/All']);
  });
});
