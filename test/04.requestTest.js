'use strict';
require('dotenv').config();
var expect = require('chai').expect;
var assert = require('chai').assert;
var Cityworks = require('../dist/index.js');
var cw2 = new Cityworks(process.env.domain, {path: process.env.path});
const _ = require('lodash')

before(function(done) {
  this.timeout(20000000);
  cw2.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[Request (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw2.request, 'Request is an object');
    done();
  });
});

describe('[Request::getProblemNodes] function test', () => {
  it('should return a list of problem nodes for a known domain', (done) => {
    cw2.request.getProblemNodes(1).then(resp => {
      assert.property(resp[0], 'Cancel');
      done();
    }).catch(e => {
      console.log(e);
    });
  });
  it('should return a list of problem nodes with view only priviledges', (done) => {
    cw2.request.getProblemNodes(1, true).then(resp => {
      assert.property(resp[0], 'Cancel');
      done();
    }).catch(e => {
      console.log(e);
    });
  });
  it('should return a list of problem nodes including cancelled nodes', (done) => {
    let result = false;
    cw2.request.getProblemNodes(1, false, null, true).then(resp => {
      if(resp.length==0) {
        result = true;
      } else {
        for (let i = 0; i < resp.length; i++) {
          if(resp[i].Cancel==true) {
            result = true;
            break;
          }
        }
      }
      assert.isTrue(result);
      done();
    }).catch(e => {
      console.log(e);
    });
  });
  it('should return a list of problem nodes code and description delimited by [pipe]', (done) => {
    let delimiter = ' | ';
    let delimiter_test = false;
    cw2.request.getProblemNodes(1, true, {DisplayTextMode:'CD', DisplayTextDelimeter:delimiter}).then(resp => {
      if(resp.length==0) {
        delimiter_test = true;
      } else {
        for (let i = 0; i < resp.length; i++) {
          let names = _.split(resp[i].NodeName, delimiter);
          if(names[1]==resp[i].Description) {
            delimiter_test = true;
            break;
          }
        }
      }
      assert.isTrue(delimiter_test);
      done();
    }).catch(e => {
      console.log(e);
    });
  });
  it('should return the description as the name if D is set and description is not empty', (done) => {
    let description_as_name_test = false;
    cw2.request.getProblemNodes(1, true, {DisplayTextMode:'D'}).then(resp => {
      if(resp.length==0) {
        description_as_name_test = true;
      } else {
        for (let i = 0; i < resp.length; i++) {
          if(resp[i].NodeName==resp[i].Description && !_.isEmpty(resp[i].Description)) {
            description_as_name_test = true;
            break;
          }
        }
      }
      assert.isTrue(description_as_name_test);
      done();
    }).catch(e => {
      console.log(e);
    });
  });
});

describe('[Request::getProblems] function test', () => {
  it('should return a list of problems', (done) => {
    cw2.request.getProblems().then(resp => {
      assert.isArray(resp);
      done();
    }).catch(e => {
      console.log(e);
    });
  });
});

describe('[Request::create] function test', () => {
  it('should return a new request', (done) => {
    cw2.request.create({ProblemSid: 309}).then(resp => {
      assert.equal(resp.ProblemSid, 309);
      done();
    }).catch(e => {
      console.log(e);
    });
  });
});

describe('[Request::update] function test', () => {
  it('should return the updated request', (done) => {
    cw2.request.update({RequestId: 1520672, Address: '1520 MARKET ST'}).then(resp => {
      assert.equal(resp.ProbAddress, '1520 MARKET ST');
      done();
    }).catch(e => {
      console.log(e);
    });
  });
});

describe('[Request::delete] function test', () => {
  it('should return the updated request', (done) => {
    cw2.request.delete([1520678]).then(resp => { // TODO: Make this pull REQ, _then_ delete
      console.log(resp);
      done();
    }).catch(e => {
      console.log(e);
    });
  });
});

describe('[Request::cancel] function test', () => {
});

describe('[Request::uncancel] function test', () => {
});

describe('[Request::close] function test', () => {
});

describe('[Request::reopen] function test', () => {

});

describe('[Request::comment] function test', () => {

});

describe('[Request::changeProblem] function test', () => {

});

describe('[Request::changeCustomFieldCategory] function test', () => {

});

describe('[Request::getAuditLog] function test', () => {

});

describe('[Request::getById] function test', () => {

});

describe('[Request::getByIds] function test', () => {

});

describe('[Request::getCustomFields] function test', () => {

});

describe('[Request::createSearchDefinition] function test', () => {

});
