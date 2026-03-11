'use strict';
require('dotenv').config({quiet: true, debug: false});
const path = require('path');
var assert = require('chai').assert;
const cw24 = require('../dist/index.js');

cw24.Cityworks.configure(process.env.cwdomain, {path: process.env.cwpath, version: process.env.cwversion});

before(function(done) {
  this.timeout(20000000);
  cw24.Cityworks.authenticate(process.env.cwlogin, process.env.cwpassword).then(() => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error');
    done(e);
  });
});

describe('[Attachments (construct)] function test', () => {
  it('should expose attachments objects on case/request/workorder/inspection', (done) => {
    assert.isObject(cw24.briefcase.attachments, 'Case attachments object expected');
    assert.isObject(cw24.request.attachments, 'Request attachments object expected');
    assert.isObject(cw24.workorder.attachments, 'WorkOrder attachments object expected');
    assert.isObject(cw24.inspection.attachments, 'Inspection attachments object expected');
    done();
  });

  it('should set correct currentActivityType values', (done) => {
    assert.equal(cw24.briefcase.attachments.currentActivityType, 'Case');
    assert.equal(cw24.request.attachments.currentActivityType, 'Request');
    assert.equal(cw24.workorder.attachments.currentActivityType, 'WorkOrder');
    assert.equal(cw24.inspection.attachments.currentActivityType, 'Inspection');
    done();
  });
});

describe('[Attachments::getByNodesId] function test', () => {
  it('should retrieve case related docs by case ID', (done) => {
    cw24.briefcase.attachments.getByNodesId(79986).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      done(e);
    });
  });

  it('should retrieve request attachments by request ID', (done) => {
    cw24.request.attachments.getByNodesId(1763986).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      done(e);
    });
  });

  it('should be callable for workorder attachments by sid', (done) => {
    cw24.workorder.attachments.getByNodesId([100196]).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should be callable for inspection attachments by ID list', (done) => {
    cw24.inspection.attachments.getByNodesId([144882]).then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});

describe('[Attachments::add] function test', () => {
  it('should add request attachment', (done) => {
    cw24.request.attachments.add(
      1763986,
      path.join(path.dirname(__dirname), 'uploads', 'test.pdf'),
      'test.pdf'
    ).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      done(e);
    });
  });

  it('should add workorder attachment by workorder ID string', (done) => {
    cw24.workorder.attachments.add(
      '100196',
      path.join(path.dirname(__dirname), 'uploads', 'test.pdf'),
      'test.pdf'
    ).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      done(e);
    });
  });

  it('should add inspection attachment', (done) => {
    cw24.inspection.attachments.add(
      144882,
      path.join(path.dirname(__dirname), 'uploads', 'test.pdf'),
      'test.pdf'
    ).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      done(e);
    });
  });
});

describe('[Attachments::other methods callable] function test', () => {
  it('should call getById for request attachments', (done) => {
    cw24.request.attachments.getById(1).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call update for request attachments', (done) => {
    cw24.request.attachments.update(1, 'Updated Title', 'Updated Description').then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call delete for request attachments', (done) => {
    cw24.request.attachments.delete(1).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should call download for request attachments', (done) => {
    cw24.request.attachments.download(1).then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });

  it('should get available case attachment tags', (done) => {
    cw24.briefcase.attachments.getTags().then(r => {
      assert.isArray(r);
      done();
    }).catch(e => {
      done(e);
    });
  });

  it('should call setTags for case attachments', (done) => {
    cw24.briefcase.attachments.setTags(1, [{ tagid: 1, tagtext: 'TestTag' }], 'Case').then(r => {
      assert.isNotNull(r);
      done();
    }).catch(e => {
      assert.isObject(e);
      done();
    });
  });
});
