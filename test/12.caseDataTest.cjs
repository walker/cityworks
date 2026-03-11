'use strict';
require('dotenv').config({quiet: true, debug: false});
var expect = require('chai').expect;
var assert = require('chai').assert;
const cw12 = require('../dist/index.js');
cw12.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});
const _ = require('lodash')

before(function(done) {
  this.timeout(20000000);
  cw12.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(resp => {
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
  //     expect(e.Message).to.have.string('The matching data detail item was not found for')
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

describe('[CaseData::group methods not currently covered] function test', () => {
  it('should call addGroup', (done) => {
    cw12.briefcase.data.addGroup(106149, 1, 'TEST', { GroupDesc: 'Test Group' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call addDefaultGroups', (done) => {
    cw12.briefcase.data.addDefaultGroups(106149, 1).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call wipAddDetail', (done) => {
    cw12.briefcase.data.wipAddDetail(1, 1, 'A', 'TEST', 1, {}).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call deleteGroupsByCaseId', (done) => {
    cw12.briefcase.data.deleteGroupsByCaseId(106149).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should reject searchForGroups when no filters are provided', (done) => {
    cw12.briefcase.data.searchForGroups({}).then(() => {
      done('Expected searchForGroups to reject when no filters are provided');
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call searchForGroups when filters are provided', (done) => {
    cw12.briefcase.data.searchForGroups({ GroupCode: 'TEST' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should reject checkGIS when neither CaObjectId nor CaseDataGroupId is provided', (done) => {
    cw12.briefcase.data.checkGIS('ASSET', 'UID-1', {}).then(() => {
      done('Expected checkGIS to reject without CaObjectId or CaseDataGroupId');
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call checkGIS when CaObjectId is provided', (done) => {
    cw12.briefcase.data.checkGIS('ASSET', 'UID-1', { CaObjectId: 106149 }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call updateGroupsFromAsset', (done) => {
    cw12.briefcase.data.updateGroupsFromAsset(106149, 'ASSET', 'UID-1').then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[CaseData::detail methods not currently covered] function test', () => {
  it('should call addDetail', (done) => {
    cw12.briefcase.data.addDetail(1, 1, {}).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call updateDetail', (done) => {
    cw12.briefcase.data.updateDetail(1, { TextValue: 'Updated' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call lockDetail', (done) => {
    cw12.briefcase.data.lockDetail(1).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call unlockDetail', (done) => {
    cw12.briefcase.data.unlockDetail(1).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should reject searchForDetails when no filters are provided', (done) => {
    cw12.briefcase.data.searchForDetails({}).then(() => {
      done('Expected searchForDetails to reject when no filters are provided');
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call searchForDetails when filters are provided', (done) => {
    cw12.briefcase.data.searchForDetails({ DetailCode: 'TEST' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call getAllDataDetails', (done) => {
    cw12.briefcase.data.getAllDataDetails(106149).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[CaseData::list value methods not currently covered] function test', () => {
  it('should call addListValue', (done) => {
    cw12.briefcase.data.addListValue(1, 'TestValue').then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call deleteListValue', (done) => {
    cw12.briefcase.data.deleteListValue(1).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should reject searchForListValueIds when no filters are provided', (done) => {
    cw12.briefcase.data.searchForListValueIds({}).then(() => {
      done('Expected searchForListValueIds to reject when no filters are provided');
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call searchForListValueIds when filters are provided', (done) => {
    cw12.briefcase.data.searchForListValueIds({ ListValue: 'East' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should reject searchForListValueObjects when no filters are provided', (done) => {
    cw12.briefcase.data.searchForListValueObjects({}).then(() => {
      done('Expected searchForListValueObjects to reject when no filters are provided');
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call searchForListValueObjects when filters are provided', (done) => {
    cw12.briefcase.data.searchForListValueObjects({ ListValue: 'East' }).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});


