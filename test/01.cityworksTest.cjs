'use strict';
// Mocked tests: no Cityworks instance is contacted.
const assert = require('chai').assert;
const https = require('https');
const fs = require('fs');
const axios = require('axios');
const EventEmitter = require('events');
const {Readable} = require('stream');
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
  const realPost = axios.post;
  const realCreateReadStream = fs.createReadStream;
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

  afterEach(() => {
    https.request = realRequest;
    axios.post = realPost;
    fs.createReadStream = realCreateReadStream;
  });

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
      assert.instanceOf(e, cw1.CWError);
      assert.equal(e.category, 'api');
      assert.equal(e.servicePath, 'Ams/Thing/Get');
      assert.equal(e.statusCode, 200);
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
    assert.equal(e.category, 'response');
    assert.instanceOf(e.cause, SyntaxError);
  });

  it('should retain HTTP status and legacy Info on an invalid HTTP error response', async () => {
    respondWith('not json', 500);
    const e = await rejection(new CW('cw.example.test').runRequest('Ams/Thing/Get', {}));
    assert.equal(e.Code, 6);
    assert.equal(e.category, 'http');
    assert.equal(e.statusCode, 500);
    assert.equal(JSON.parse(e.Info).statusCode, 500);
  });

  it('should preserve API errors with malformed error details', async () => {
    respondWith(JSON.stringify({Status: 1, Message: 'API failed', ErrorMessages: [{Service: null}, null]}));
    const e = await rejection(new CW('cw.example.test').runRequest('Ams/Thing/Get', {}));
    assert.equal(e.Code, 1);
    assert.equal(e.category, 'api');
    assert.equal(e.Message, 'API failed');
    assert.deepEqual(e.Error_messages, [{Service: null}]);
  });

  it('should reject JSON that is not a valid Cityworks response envelope', async () => {
    for(const value of [false, true, 42, 'text', [], {}, {Status: '0'}, {Status: 0.5}, {Status: 0, Message: {text: 'invalid'}}]) {
      respondWith(JSON.stringify(value));
      const e = await rejection(new CW('cw.example.test').runRequest('Ams/Thing/Get', {}));
      assert.instanceOf(e, cw1.CWError);
      assert.equal(e.Code, 7);
      assert.equal(e.category, 'response');
      assert.equal(e.servicePath, 'Ams/Thing/Get');
    }
  });

  it('should preserve null values, optional messages, and extra response fields', async () => {
    const response = {Status: 0, Message: null, Value: null, Extra: {A: 1}};
    respondWith(JSON.stringify(response));
    assert.deepEqual(await new CW('cw.example.test').runRequest('Ams/Thing/Get', {}), response);
  });

  it('should preserve download responses as strings', async () => {
    respondWith('report contents');
    assert.equal(await new CW('cw.example.test').runRequest('Ams/Reports/DownloadSrReport', {}), 'report contents');
  });

  it('should retain a network failure as the cause', async () => {
    const cause = new Error('connection failed');
    https.request = () => {
      const req = new EventEmitter();
      req.write = () => {};
      req.end = () => req.emit('error', cause);
      return req;
    };
    const e = await rejection(new CW('cw.example.test').runRequest('Ams/Thing/Get', {}));
    assert.equal(e.Code, 13);
    assert.equal(e.category, 'network');
    assert.strictEqual(e.cause, cause);
    assert.equal(e.servicePath, 'Ams/Thing/Get');
  });

  it('should classify upload failures using available Axios context', async () => {
    fs.createReadStream = () => Readable.from(['file']);
    const cases = [
      {cause: Object.assign(new Error('http'), {isAxiosError: true, response: {status: 503}}), category: 'http', status: 503},
      {cause: Object.assign(new Error('network'), {isAxiosError: true, request: {}}), category: 'network'},
      {cause: new Error('other'), category: 'unknown'}
    ];
    for(const test of cases) {
      axios.post = () => Promise.reject(test.cause);
      const e = await rejection(new CW('cw.example.test').runRequest('Ams/Thing/Upload', {}, 'file.txt'));
      assert.equal(e.category, test.category);
      assert.strictEqual(e.cause, test.cause);
      assert.equal(e.statusCode, test.status);
      assert.equal(e.servicePath, 'Ams/Thing/Upload');
    }
  });

  it('should validate upload envelopes without changing supported upload results', async () => {
    fs.createReadStream = () => Readable.from(['file']);
    const cw = new CW('cw.example.test');
    for(const data of [{Status: 0, Value: {Id: 1}}, true, 'uploaded']) {
      axios.post = () => Promise.resolve({data, status: 200});
      assert.deepEqual(await cw.runRequest('Ams/Thing/Upload', {}, 'file.txt'), data);
    }
    axios.post = () => Promise.resolve({data: {Status: '0'}, status: 200});
    const e = await rejection(cw.runRequest('Ams/Thing/Upload', {}, 'file.txt'));
    assert.equal(e.Code, 7);
    assert.equal(e.category, 'response');
    assert.equal(e.statusCode, 200);
    assert.equal(e.servicePath, 'Ams/Thing/Upload');
  });

  it('should authenticate multipart uploads and serialize their metadata', async () => {
    fs.createReadStream = () => Readable.from(['file']);
    for(const version of [15, 23]) {
      let seenUpload;
      axios.post = (url, form, options) => {
        seenUpload = {url, form, options};
        return Promise.resolve({data: {Status: 0, Value: {AttachmentId: 1}}, status: 200});
      };
      const cw = new CW('cw.example.test', {path: 'cw', version});
      cw.setToken('dummy');
      await cw.runRequest('Ams/Attachments/AddRequestAttachment', {RequestId: 7}, 'file.txt');
      assert.match(seenUpload.options.headers['content-type'], /^multipart\/form-data; boundary=/);
      if(version >= 23) {
        assert.equal(seenUpload.options.headers.authorization, 'cityworks dummy');
        assert.notInclude(seenUpload.url, 'token=');
      } else {
        assert.include(seenUpload.url, '?token=dummy');
        assert.isUndefined(seenUpload.options.headers.authorization);
      }
      const chunks = [];
      await new Promise((resolve, reject) => {
        seenUpload.form.on('data', chunk => chunks.push(Buffer.from(chunk)));
        seenUpload.form.on('end', resolve);
        seenUpload.form.on('error', reject);
        seenUpload.form.resume();
      });
      const body = Buffer.concat(chunks).toString();
      assert.include(body, 'name="data"');
      assert.include(body, '{"RequestId":7}');
      assert.include(body, 'name="file"');
      assert.include(body, 'file');
    }
  });

  it('should reject multipart API errors with their original category and message', async () => {
    fs.createReadStream = () => Readable.from(['file']);
    for(const status of [1, 2, 3]) {
      axios.post = () => Promise.resolve({data: {Status: status, Message: 'Upload failed'}, status: 200});
      const e = await rejection(new CW('cw.example.test').runRequest('Ams/Attachments/AddRequestAttachment', {}, 'file.txt'));
      assert.instanceOf(e, cw1.CWError);
      assert.equal(e.Code, status);
      assert.equal(e.category, 'api');
      assert.equal(e.Message, 'Upload failed');
      assert.equal(e.servicePath, 'Ams/Attachments/AddRequestAttachment');
      assert.equal(e.statusCode, 200);
    }
  });

  it('should reject a null JSON response without throwing from the response callback', async () => {
    respondWith('null');
    const e = await rejection(new CW('cw.example.test').runRequest('Ams/Thing/Get', {}));
    assert.equal(e.Code, 7);
    assert.equal(e.category, 'response');
  });
});
