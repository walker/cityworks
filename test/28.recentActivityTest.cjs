'use strict';
require('dotenv').config({quiet: true, debug: false});
var assert = require('chai').assert;
const cw28 = require('../dist/index.js');

cw28.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});

before(function(done) {
  this.timeout(20000000);
  cw28.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(() => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error');
    done(e);
  });
});

describe('[RecentActivity (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw28.recent_activity, 'recent_activity is an object');
    done();
  });
});

describe('[RecentActivity::user] function test', () => {
  it('should return user recent activity collection', (done) => {
    cw28.recent_activity.user({ IncludeCases: true, IncludeRequests: true, MaxResults: 10 }).then(r => {
      assert.isTrue(r === null || Array.isArray(r));
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[RecentActivity::clear] function test', () => {
  it('should clear selected recent activity groups', (done) => {
    cw28.recent_activity.clear({ Cases: true, Inspections: true, Requests: false, WorkOrders: false }).then(r => {
      assert.isTrue(r === undefined || r === null || typeof r === 'boolean' || Array.isArray(r));
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[RecentActivity::*Viewed] function tests', () => {
  it('should call caseViewed', (done) => {
    cw28.recent_activity.caseViewed(107138, new Date()).then(r => {
      assert.isTrue(r === undefined || r === null || typeof r === 'boolean' || typeof r === 'object');
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call fireHydFlowTestViewed', (done) => {
    cw28.recent_activity.fireHydFlowTestViewed(1, new Date()).then(r => {
      assert.isTrue(r === undefined || r === null || typeof r === 'boolean' || typeof r === 'object');
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call inspectionViewed', (done) => {
    cw28.recent_activity.inspectionViewed(1, new Date()).then(r => {
      assert.isTrue(r === undefined || r === null || typeof r === 'boolean' || typeof r === 'object');
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call manholeInspectionViewed', (done) => {
    cw28.recent_activity.manholeInspectionViewed(1, new Date()).then(r => {
      assert.isTrue(r === undefined || r === null || typeof r === 'boolean' || typeof r === 'object');
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call pavementInspectionViewed', (done) => {
    cw28.recent_activity.pavementInspectionViewed(1, new Date()).then(r => {
      assert.isTrue(r === undefined || r === null || typeof r === 'boolean' || typeof r === 'object');
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call requestViewed', (done) => {
    cw28.recent_activity.requestViewed(1, new Date()).then(r => {
      assert.isTrue(r === undefined || r === null || typeof r === 'boolean' || typeof r === 'object');
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call tvInspectionViewed', (done) => {
    cw28.recent_activity.tvInspectionViewed(1, new Date()).then(r => {
      assert.isTrue(r === undefined || r === null || typeof r === 'boolean' || typeof r === 'object');
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call workOrderViewed', (done) => {
    cw28.recent_activity.workOrderViewed(1, 'WO-1', new Date()).then(r => {
      assert.isTrue(r === undefined || r === null || typeof r === 'boolean' || typeof r === 'object');
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});
