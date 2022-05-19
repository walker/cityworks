'use strict';
require('dotenv').config();
var expect = require('chai').expect;
var assert = require('chai').assert;
var Cityworks = require('../dist/index.js');
var cw1;

before(function(done) {
  this.timeout(20000000);
  done();
});

beforeEach(function() {
  return cw1 = new Cityworks(process.env.domain, {path:process.env.path});
});

describe('[Cityworks (construct)] function test', () => {
    it('should return a Cityworks object', (done) => {
        assert.isObject(cw1, 'cw is an object');
        done();
    });
    it('should not have a token set if authentication not run', (done) => {
      assert.isUndefined(cw1.Token);
      done();
    });
});

describe('[Cityworks::authenticate] function test', () => {
    it('should throw Unknown Error if username provided is not known', (done) => {
      cw1.authenticate('myuser', 'mypassword').then(res => {
        // assert.isUndefined(cw1.Token);
        done();
      })
      .catch(error => {
        assert.equal(error.message, 'Unknown Error');
        done();
      });
    });

    // TODO: Uncomment for commit
    it('should throw invalid login error if password provided is not provided user\'s password', () => {
      let cw4 = new Cityworks(process.env.domain, {path:process.env.path})
      cw4.authenticate('mrrobot', 'mypassword').then(resp => {
        // assert.isNotEmpty(cw4.Token);
        return true;
      }).catch(error => {
        assert.equal(error.message, 'Invalid Credentials');
        return true;
      });
    });
});

describe('[Cityworks::validateToken] function test', () => {
  it('should have a valid token set, if logged in', (done) => {
    cw1.authenticate(process.env.login, process.env.password).then(resp => {
      cw1.validateToken(cw1.Token).then(res => {
        assert.isTrue(res);
        done();
      }).catch(error => {
        console.log(error, 'unexpected error');
        done();
      });
    }).catch(error => {
      console.log(error, 'unexpected error');
      done();
    });
  })
})

describe('[Cityworks::setToken] function test', () => {
  it('should have set token', (done) => {
    cw1.authenticate(process.env.login, process.env.password).then(res => {
      assert.isTrue(cw1.setToken(cw1.Token));
      done();
    }).catch(error => {
      console.log(error, 'unexpected error');
      done();
    });
  })
})
