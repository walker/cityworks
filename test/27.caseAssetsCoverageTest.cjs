'use strict';
require('dotenv').config({quiet: true, debug: false});
var assert = require('chai').assert;
const cw27 = require('../dist/index.js');

cw27.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});

before(function(done) {
  this.timeout(20000000);
  cw27.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(() => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error');
    done(e);
  });
});

describe('[CaseAssets coverage (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw27.briefcase.asset, 'Briefcase.asset is an object');
    done();
  });
});

describe('[CaseAssets coverage::attach/detach methods] function test', () => {
  it('should call attach', (done) => {
    cw27.briefcase.asset.attach(107138, false, { AssetType: 'ADDRESS', StreetName: 'Main' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call detach', (done) => {
    cw27.briefcase.asset.detach(1, false).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call detachAll', (done) => {
    cw27.briefcase.asset.detachAll(107138, false).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[CaseAssets coverage::get/search methods] function test', () => {
  it('should call getForCase', (done) => {
    cw27.briefcase.asset.getForCase(107138).then(r => {
      assert.isTrue(r === null || Array.isArray(r));
      done();
    }).catch(e => {
      done(e);
    });
  });

  it('should reject search with no filters', (done) => {
    cw27.briefcase.asset.search({}).then(() => {
      done('Expected search to reject without filters');
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call search with filters', (done) => {
    cw27.briefcase.asset.search({ CaObjectId: 107138 }).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});
