'use strict';
require('dotenv').config();
var expect = require('chai').expect;
var assert = require('chai').assert;
var Cityworks = require('../dist/index.js');
var cw2 = new Cityworks(process.env.domain, {path: process.env.path});

before(function(done) {
  this.timeout(2000000);
  cw2.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[ActivityLink (construct)] function test', () => {
  it('should be undefined', (done) => {
    assert.isObject(cw2.activity_link, 'ActivityLink is an object');
    done();
  });
});

describe('[ActivityLink::get] function test', () => {
  it('should return error if type doesn\'t exist', (done) => {
    cw2.activity_link.get('something').then(resp => {
    }).catch(error => {
      assert.equal(error.message, 'Activity type not found.');
      done();
    });
  });

  it('should return collection', (done) => {
    cw2.activity_link.get('case', [10512]).then(resp => {
      assert.isArray(resp);
      done();
    }).catch(error => {
      console.log(error, 'unexpected error');
      done();
    });
  });
});

describe('[ActivityLink::clone] function test', () => {
  it('should create a clone of an existing link, if it exists');
  it('should not create a clone of an existing link, if it does not exist');
});

describe('[ActivityLink::delete] function test', () => {
  it('should delete an activity link if the ID is found');
  it('should fail to delete an activity link if the ID cannot be found');
});

describe('[ActivityLink::remove] function test', () => {
  it('should remove a link when all items provided');
  it('should fail when any 1 item is not provided');
});
