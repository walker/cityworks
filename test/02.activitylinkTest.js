'use strict';
require('dotenv').config();
var expect = require('chai').expect;
var assert = require('chai').assert;
const cw2 = require('../dist/index.js');
cw2.Cityworks.configure(process.env.domain, {path: process.env.install_path, version: process.env.version});

before(function(done) {
  this.timeout(20000000);
  cw2.Cityworks.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[ActivityLink (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw2.activity_link, 'ActivityLink is an object');
    done();
  });
});

describe('[ActivityLink::get] function test', () => {
  it('should return error if type doesn\'t exist', (done) => {
    cw2.activity_link.get('something').then(resp => {
    }).catch(e => {
      expect(e.message).to.have.string('not found.').and.to.have.string('Activity type');
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

describe('[ActivityLink::add] function test', () => {
  it('should return the new link', (done) => {
    cw2.activity_link.add('workorder', 241437, 'workorder', 241525).then(resp => {
      assert.isNumber(resp.ActivityLinkId);
      cw2.activity_link.delete(resp.ActivityLinkId).then(r => {
        done();
      }).catch(error => {
        done();
      });
    }).catch(error => {
      console.log(error)
      done();
    });
  });
});

describe('[ActivityLink::clone] function test', () => {
  it('should create a clone of the link on the source, to the links on the second', (done) => {
    cw2.activity_link.clone('inspection', 53215, 'inspection', 53217).then(resp => {
      assert.isArray(resp);
      done();
    }).catch(error => {
      console.log(error)
      done();
    });
  });
});

describe('[ActivityLink::delete] function test', () => {
  // it('should fail to delete an activity link if it is a parent/child relationship', (done) => {
  //   cw2.activity_link.delete(477102).then(resp => {
  //     // console.log('resp', resp)
  //     done();
  //   }).catch(error => {
  //     assert.equal(error.error_messages[0].Name, 'Cannot Delete Parent Links');
  //     done();
  //   });    
  // });
  it('should delete an activity link if the ID can be found and deleted', (done) => {
    cw2.activity_link.add('workorder', 241437, 'workorder', 241525).then(resp => {
      cw2.activity_link.delete(resp.ActivityLinkId).then(r => {
        assert.isTrue(r);
        done();
      }).catch(error => {
        done(error);
      });
    }).catch(error => {
      done(error);
    });
  });
  it('should fail to delete an activity link if the ID cannot be found', (done) => {
    cw2.activity_link.delete(0).then(resp => {
      assert.isTrue(resp);
      done();
    }).catch(error => {
      done(error);
    });
  });
});


describe('[ActivityLink::remove] function test', () => {
  it('should remove a link when found', (done) => {
    cw2.activity_link.remove('inspection', 53217, 'request', 1089178).then(resp => {
      assert.isTrue(resp);
      done();
    }).catch(error => {
      console.log(error)
      // done();
    });
  });
});
