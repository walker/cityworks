'use strict';
require('dotenv').config();
var expect = require('chai').expect;
var assert = require('chai').assert;
const cw12 = require('../dist/index.js');
cw12.Cityworks.configure(process.env.domain, {path: process.env.path, version: process.env.version});
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
  // it('should return an error if a data detail item is not found', (done) => {
  //   cw12.briefcase.data.setCaseData(77950, [{code: 'TEST.TESTNOFIELD', value: 123456}]).then(r => {
  //   }).catch(e => {
  //     expect(e.message).to.have.string('The matching data detail item was not found for')
  //     done();
  //   })
  // });

  // it('should set all the case data detail item values if they\'re all found', (done) => {
  //   cw12.briefcase.data.setCaseData(106149, [{code: 'TEST.TESTFIELD', NumberValue: 123456}]).then(r => {
  //     // assert.equal(r.NumberValue, 123456);
  //     done();
  //   }).catch(e => { done(e); })
  // });

  it('should set the single case data detail numbervalue item', (done) => {
    cw12.briefcase.data.setCaseDataItem(106149, 'TEST.TSTNBR', 456789).then(r => {
      assert.equal(r.NumberValue, 456789);
      done();
    }).catch(e => { done(e); })
  });

  it('should set the single case data detail listvalue item', (done) => {
    cw12.briefcase.data.setCaseDataItem(106149, 'TEST.TSTLIST', 'East').then(r => {
      assert.equal(r.ListValue, 'East');
      done();
    }).catch(e => { done(e); })
  });

  it('should set the single case data detail commentvalue item', (done) => {
    cw12.briefcase.data.setCaseDataItem(106149, 'TEST.TSTCMNT', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id turpis ipsum. Nunc eget dignissim sapien. Pellentesque vitae ligula non nibh pellentesque volutpat fermentum sit amet arcu. Mauris ipsum justo, dignissim ac porttitor eu, sollicitudin non mi. Nam at eleifend risus. Vestibulum pellentesque tellus odio, ac congue leo sagittis non. Sed facilisis mi lectus, id egestas tortor ullamcorper sed. Aliquam at enim ac nunc tempus fermentum. Curabitur eget dignissim dolor, vel aliquam ante. Aenean sed urna felis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.').then(r => {
      assert.equal(r.CommentValue, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id turpis ipsum. Nunc eget dignissim sapien. Pellentesque vitae ligula non nibh pellentesque volutpat fermentum sit amet arcu. Mauris ipsum justo, dignissim ac porttitor eu, sollicitudin non mi. Nam at eleifend risus. Vestibulum pellentesque tellus odio, ac congue leo sagittis non. Sed facilisis mi lectus, id egestas tortor ullamcorper sed. Aliquam at enim ac nunc tempus fermentum. Curabitur eget dignissim dolor, vel aliquam ante. Aenean sed urna felis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.');
      done();
    }).catch(e => { done(e); })
  });

  it('should set the single case data detail textvalue item', (done) => {
    cw12.briefcase.data.setCaseDataItem(106149, 'TEST.TEST', 'Test Text Value Here').then(r => {
      assert.equal(r.TextValue, 'Test Text Value Here');
      done();
    }).catch(e => { done(e); })
  });

  it('should set the single case data detail datevalue item', (done) => {
    cw12.briefcase.data.setCaseDataItem(106149, 'TEST.TSTDATE', '2027-02-01').then(r => {
      assert.equal(r.DateValue.substring(0, 10), '2027-02-01');
      done();
    }).catch(e => { done(e); })
  });

  it('should set the single case data detail value item to 2 if only quantity provided and rate defaults to 1 (lots of assumptions)', (done) => {
    cw12.briefcase.data.setCaseDataItem(106149, 'TEST.TSTVAL', 2).then(r => {
      assert.equal(r.Value, 2);
      done();
    }).catch(e => { done(e); })
  });

  it('should set the single case data detail currencyvalue item', (done) => {
    cw12.briefcase.data.setCaseDataItem(106149, 'TEST.TSTCRNCY', 1.25).then(r => {
      assert.equal(r.CurrencyValue, 1.25);
      done();
    }).catch(e => { done(e); })
  });

  it('should set the single case data detail datecount item', (done) => {
    cw12.briefcase.data.setCaseDataItem(106149, 'TEST.TSTDC', ['2027-02-01', '2027-02-06', '2027-03-06']).then(r => {
      assert.equal(r.DateCountValue, '{"dateCount":3,"value":["2027-02-01","2027-02-06","2027-03-06"]}');
      done();
    }).catch(e => { done(e); })
  });

  it('should set the single case data detail YesNoValue item', (done) => {
    cw12.briefcase.data.setCaseDataItem(106149, 'TEST.TSTYN', 'Y').then(r => {
      assert.equal(r.YesNoValue, 'Y');
      done();
    }).catch(e => { done(e); })
  });

  it('should set the single case data detail Q1Q2Q3value item', (done) => {
    cw12.briefcase.data.setCaseDataItem(106149, 'TEST.TSTQ', [2, 3, 2], 2).then(r => {
      assert.equal(r.Quantity, 2);
      assert.equal(r.Q2Value, 3);
      assert.equal(r.Q3Value, 2);
      assert.equal(r.Value, 2*3*2*2);
      done();
    }).catch(e => { done(e); })
  });

});


