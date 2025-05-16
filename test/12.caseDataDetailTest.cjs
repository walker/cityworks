'use strict';
require('dotenv').config();
var expect = require('chai').expect;
var assert = require('chai').assert;
const cw12 = require('../dist/index.js');
cw12.Cityworks.configure(process.env.domain, {path: process.env.install_path, version: process.env.version});
const _ = require('lodash')

before(function(done) {
  this.timeout(20000000);
  cw12.Cityworks.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[CaseData (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw12.briefcase.data, 'Briefcase.data is an object');
    done();
  });
});

describe('[CaseData::getGroupsByCaseId] function test', () => {
  it('should resolve a collection of all case data groups', (done) => {
    cw12.briefcase.data.getGroupsByCaseId(77950).then(r => {
      assert.isArray(r);
      done();
    });
  });
});

describe('[CaseData::updateDetailItemValue] function test', () => {
  it('should resolve an object that is the updated data detail item', (done) => {
    cw12.briefcase.data.updateDetailItemValue(837005, 654321).then(r => {
      // assert.equal(r.CaDataDetailId, 837005);
      assert.equal(r.NumberValue, 654321);
      done();
    });
  });
});

describe('[CaseData::setCaseData] function test', () => {
  it('should return an error if a data detail item is not found', (done) => {
    cw12.briefcase.data.setCaseData(77950, [{code: 'TEST.TESTNOFIELD', value: 123456}]).then(r => {
    }).catch(e => {
      expect(e.message).to.have.string('The matching data detail item was not found for')
      done();
    })
  });
  it('should set all the case data detail item values if they\'re all found', (done) => {
    cw12.briefcase.data.setCaseData(77950, [{code: 'TEST.TESTFIELD', value: 123456}]).then(r => {
      // assert.equal(r.NumberValue, 123456);
      done();
    }).catch(e => { console.log(e); })
  });
  it('should set the single case data detail item', (done) => {
    cw12.briefcase.data.setCaseDataItem(77950, 'TEST.TESTFIELD', 456789).then(r => {
      assert.equal(r.NumberValue, 456789);
      done();
    }).catch(e => { console.log(e); })
  });
  
});


