'use strict';
// Mocked tests: no Cityworks instance is contacted.
const assert = require('chai').assert;
const https = require('https');
const EventEmitter = require('events');
const cw1 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

const CW = cw1.Cityworks.constructor;
const AUTH = 'General/Authentication/Authenticate';
const COL_AUTH = 'General/Authentication/CityworksOnlineAuthenticate';

async function rejection(promise) {
  try {
    await promise;
  } catch (e) {
    return e;
  }
  assert.fail('should have rejected');
}

describe('[Cityworks::construct] function test', () => {
  it('should export a Cityworks instance that is not authenticated', () => {
    assert.isObject(cw1.Cityworks);
    assert.isFalse(new CW('cw.example.test').getToken());
  });

  it('should default to version 23 and accept version overrides in configure', () => {
    const cw = new CW('cw.example.test');
    assert.equal(cw.v(), 23);
    cw.configure('cw.example.test', {version: 15, bogus: 1});
    assert.equal(cw.v(), 15);
    cw.configure('cw.example.test');
    assert.equal(cw.v(), 23);
  });
});

describe('[Cityworks::authenticate] function test', () => {
  const cw = new CW('cw.example.test');
  const mock = createMock(cw);

  it('should store the token and credentials payload on success', async () => {
    mock.on(AUTH, {Token: 'dummy-token'});
    assert.isTrue(await cw.authenticate('myuser', 'mypassword'));
    assert.deepEqual(mock.lastCall(AUTH).data, {LoginName: 'myuser', Password: 'mypassword'});
    assert.equal(cw.getToken(), 'dummy-token');
  });

  it('should reject with Unknown Error if no token is returned', async () => {
    mock.on(AUTH, {});
    const e = await rejection(cw.authenticate('myuser', 'mypassword'));
    assert.equal(e.Code, 11);
    assert.equal(e.Message, 'Unknown Error');
  });

  it('should reject with the API message when the response has a failing Status', async () => {
    mock.onRaw(AUTH, {Status: 3, Message: 'Invalid Credentials'});
    const e = await rejection(cw.authenticate('myuser', 'wrong'));
    assert.equal(e.Code, 100);
    assert.equal(e.Message, 'Invalid Credentials');
  });

  it('should propagate request errors', async () => {
    mock.onError(AUTH, {Message: 'Network down'});
    const e = await rejection(cw.authenticate('myuser', 'mypassword'));
    assert.include(e.Message, 'Network down');
  });

  it('should use the Cityworks Online path when no domain is configured', async () => {
    const online = new CW();
    const onlineMock = createMock(online, {hooks: false}).install();
    // install() configures the example domain, so restore the default domain
    online.configure();
    onlineMock.on(COL_AUTH, {Token: 'online-token'});
    await online.authenticate('myuser', 'mypassword');
    assert.deepEqual(onlineMock.paths(), [COL_AUTH]);
    assert.equal(online.getToken(), 'online-token');
    onlineMock.restore();
  });
});

describe('[Cityworks::validateToken] function test', () => {
  const cw = new CW('cw.example.test');
  const mock = createMock(cw);

  it('should resolve the validity returned by the API without setting the token by default', async () => {
    mock.on('General/Authentication/Validate', true);
    assert.isTrue(await cw.validateToken('abc'));
    assert.deepEqual(mock.lastCall('General/Authentication/Validate').data, {Token: 'abc'});
    assert.isFalse(cw.getToken());
  });

  it('should set the token when asked to and valid', async () => {
    mock.on('General/Authentication/Validate', true);
    await cw.validateToken('abc', true);
    assert.equal(cw.getToken(), 'abc');
  });

  it('should resolve false when the API reports a failing Status', async () => {
    mock.onRaw('General/Authentication/Validate', {Status: 2, Message: 'Unauthorized'});
    assert.isFalse(await cw.validateToken('bad'));
  });
});

describe('[Cityworks::setToken/getToken] function test', () => {
  it('should set and return a token', () => {
    const cw = new CW('cw.example.test');
    assert.isTrue(cw.setToken('dummy'));
    assert.equal(cw.getToken(), 'dummy');
  });

  it('should refuse empty or null tokens and leave the existing token', () => {
    const cw = new CW('cw.example.test');
    cw.setToken('dummy');
    assert.isFalse(cw.setToken(''));
    assert.isFalse(cw.setToken(null));
    assert.equal(cw.getToken(), 'dummy');
  });
});

describe('[Cityworks::runRequest] function test', () => {
  const realRequest = https.request;
  let seen;

  // Stubs https.request with a fake that answers with the given status code and body
  function respondWith(body, statusCode) {
    seen = {};
    https.request = (options, cb) => {
      seen.options = options;
      const req = new EventEmitter();
      req.write = (s) => { seen.written = s; };
      req.end = () => {
        const res = new EventEmitter();
        res.statusCode = statusCode || 200;
        cb(res);
        res.emit('data', body);
        res.emit('end');
      };
      return req;
    };
  }

  afterEach(() => { https.request = realRequest; });

  it('should resolve the parsed JSON and send the token header on v23', async () => {
    respondWith(JSON.stringify({Status: 0, Value: {A: 1}}));
    const cw = new CW('cw.example.test', {path: 'cw', version: 23});
    cw.setToken('dummy');
    const r = await cw.runRequest('Ams/Thing/Get', {Id: 1});
    assert.deepEqual(r, {Status: 0, Value: {A: 1}});
    assert.equal(seen.options.hostname, 'cw.example.test');
    assert.equal(seen.options.path, '/cw/services/Ams/Thing/Get');
    assert.equal(seen.options.headers.Authorization, 'cityworks dummy');
    assert.equal(seen.options.method, 'POST');
    assert.equal(seen.written, 'data=' + encodeURIComponent('{"Id":1}'));
  });

  it('should send the token in the body on versions before 23', async () => {
    respondWith(JSON.stringify({Status: 0, Value: 1}));
    const cw = new CW('cw.example.test', {version: 15});
    cw.setToken('dummy');
    await cw.runRequest('Ams/Thing/Get', {Id: 1});
    assert.include(seen.written, 'token=dummy');
    assert.isUndefined(seen.options.headers.Authorization);
  });

  it('should resolve true when Status is 0 and there is no Value', async () => {
    respondWith(JSON.stringify({Status: 0}));
    assert.isTrue(await new CW('cw.example.test').runRequest('Ams/Thing/Do', {}));
  });

  it('should reject with codes 1, 2 and 3 for API Status 1, 2 and 3', async () => {
    const expected = {1: 'Error', 2: 'Unauthorized', 3: 'InvalidCredentials'};
    for (const status of [1, 2, 3]) {
      respondWith(JSON.stringify({Status: status}));
      const e = await rejection(new CW('cw.example.test').runRequest('Ams/Thing/Get', {}));
      assert.equal(e.Code, status);
      assert.equal(e.Message, expected[status]);
    }
  });

  it('should prefer the API Message over the default error message', async () => {
    respondWith(JSON.stringify({Status: 1, Message: 'Custom failure'}));
    const e = await rejection(new CW('cw.example.test').runRequest('Ams/Thing/Get', {}));
    assert.equal(e.Code, 1);
    assert.equal(e.Message, 'Custom failure');
  });

  it('should reject when Cityworks returns HTML or invalid JSON', async () => {
    respondWith('<html><h2>Object moved to here</h2></html>');
    let e = await rejection(new CW('cw.example.test').runRequest('Ams/Thing/Get', {}));
    assert.equal(e.Code, 5);
    respondWith('not json');
    e = await rejection(new CW('cw.example.test').runRequest('Ams/Thing/Get', {}));
    assert.equal(e.Code, 6);
  });
});
