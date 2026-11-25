'use strict';
// Shared mock for the Cityworks API. Replaces `Cityworks.runRequest` with an in-memory fake so tests never touch the network.
//
// Usage (inside a top-level describe, because mocha hooks registered at file root are global):
//
//   const cw4 = require('../dist/index.js');
//   const { createMock } = require('./mockCityworks');
//   describe('[Thing] tests', () => {
//     const mock = createMock(cw4.Cityworks);   // registers beforeEach/afterEach for you
//     it('does x', async () => {
//       mock.on('Ams/ServiceRequest/ById', (data) => ({RequestId: data.RequestId}));
//       const r = await cw4.request.getById(5);
//       assert.deepEqual(mock.lastCall('Ams/ServiceRequest/ById').data, {RequestId: 5});
//     });
//   });

const SETTINGS = {path: 'cityworks', version: 23};
const DOMAIN = 'cityworks.example.test';

class CWMockError {
  constructor(code, message, info) {
    this.Name = 'Cityworks Exception';
    this.Code = code;
    this.Message = message;
    this.Info = info;
  }
}

function createMock(cw, options) {
  options = options || {};
  const handlers = {};
  const mock = {
    /** Every call made to runRequest: {path, data, file} */
    calls: [],

    /**
     * Register a response for a service path. `response` is either a value or a function(data, path, file) returning
     * a value (or a promise of one). The value is wrapped like the API does: {Status: 0, Value: value}, and, like the real
     * runRequest, resolves `true` when the value is undefined.
     */
    on(path, response) {
      handlers[path] = {type: 'value', response: response};
      return mock;
    },

    /** Register the full raw API response (e.g. {Status: 0, Value: ..., Message: ...}) for a path. Accepts a function too. */
    onRaw(path, response) {
      handlers[path] = {type: 'raw', response: response};
      return mock;
    },

    /** Make a path reject. `error` may be a function(data) or a value; by default a CWError-like object is built. */
    onError(path, error) {
      handlers[path] = {type: 'error', response: error};
      return mock;
    },

    /** All recorded calls for a path (or all calls if no path is given) */
    callsTo(path) {
      return path ? mock.calls.filter(c => c.path === path) : mock.calls.slice();
    },

    lastCall(path) {
      const list = mock.callsTo(path);
      return list[list.length - 1];
    },

    /** The list of paths called, in order */
    paths() {
      return mock.calls.map(c => c.path);
    },

    reset() {
      mock.calls.length = 0;
      Object.keys(handlers).forEach(k => delete handlers[k]);
      return mock;
    },

    install() {
      cw.configure(DOMAIN, SETTINGS);
      cw.runRequest = function(path, data, file) {
        mock.calls.push({path: path, data: JSON.parse(JSON.stringify(data === undefined ? null : data)), file: file});
        const h = handlers[path];
        if(!h) {
          return Promise.reject(new Error('Unmocked Cityworks path: ' + path));
        }
        const resolveWith = (fn) => (typeof fn === 'function' ? Promise.resolve(fn(data, path, file)) : Promise.resolve(fn));
        if(h.type === 'error') {
          return resolveWith(h.response).then(e => Promise.reject(e instanceof Error || (e && e.Code) ? e : new CWMockError(1, (e && e.Message) || 'Error', e)));
        }
        return resolveWith(h.response).then(v => {
          if(h.type === 'raw') return v;
          return v === undefined ? true : {Status: 0, Value: v};
        });
      };
      return mock;
    },

    restore() {
      delete cw.runRequest;
      return mock;
    }
  };

  if(options.hooks !== false && typeof beforeEach === 'function') {
    beforeEach(() => { mock.reset(); mock.install(); });
    afterEach(() => { mock.restore(); });
  }
  return mock;
}

module.exports = { createMock, CWMockError };
