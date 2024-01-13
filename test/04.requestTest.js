'use strict';
require('dotenv').config();
var chai = require('chai');
const path = require('path');
var expect = require('chai').expect;
var assert = require('chai').assert;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const cw4 = require('../dist/index.js');
cw4.Cityworks.configure(process.env.domain, {path: process.env.install_path, version: process.env.version});
const _ = require('lodash')

before(function(done) {
  this.timeout(20000000);
  cw4.Cityworks.authenticate(process.env.login, process.env.password).then(resp => {
    done();
  }).catch(e => {
    console.log(e, 'unexpected error')
    done();
  });
});

describe('[Request (construct)] function test', () => {
  it('should be a defined object', (done) => {
    assert.isObject(cw4.request, 'Request is an object');
    done();
  });
  it('should have an admin property which is a defined object', (done) => {
    assert.isObject(cw4.request.admin, 'Admin is an object');
    done();
  });
  it('should have an comment property which is a defined object', (done) => {
    assert.isObject(cw4.request.comment, 'Comment is an object');
    done();
  });
});

describe('[Request::getProblemNodes] function test', () => {
  it('should return a list of problem nodes for a known domain', (done) => {
    cw4.request.getProblemNodes(1).then(resp => {
      assert.property(resp[0], 'Cancel');
      done();
    }).catch(e => {
      console.log(e);
    });
  });
  it('should return a list of problem nodes with view only priviledges', (done) => {
    cw4.request.getProblemNodes(1, true).then(resp => {
      assert.property(resp[0], 'Cancel');
      done();
    }).catch(e => {
      console.log(e);
    });
  });
  it('should return a list of problem nodes including cancelled nodes', (done) => {
    let result = false;
    cw4.request.getProblemNodes(1, false, null, true).then(resp => {
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
    cw4.request.getProblemNodes(1, true, {DisplayTextMode:'CD', DisplayTextDelimeter:delimiter}).then(resp => {
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
    cw4.request.getProblemNodes(1, true, {DisplayTextMode:'D'}).then(resp => {
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
    cw4.request.getProblems().then(resp => {
      assert.isArray(resp);
      done();
    }).catch(e => {
      console.log(e);
    });
  });
});

describe('[Request::create] function test', () => {
  it('should return a new request', (done) => {
    cw4.request.create({ProblemSid: 309}).then(resp => {
      assert.equal(resp.ProblemSid, 309);
      done();
    }).catch(e => {
      console.log(e);
    });
  });
});

describe('[Request::update] function test', () => {
  it('should return the updated request', (done) => {
    cw4.request.update({RequestId: 1520672, Address: '1520 MARKET ST'}).then(resp => {
      assert.equal(resp.ProbAddress, '1520 MARKET ST');
      done();
    }).catch(e => {
      console.log(e);
    });
  });
});

describe('[Request::delete] function test', () => {
  it('should return a list of the deleted request ID(s)', (done) => {
    cw4.request.delete([1520677]).then(resp => { // TODO: Make this pull REQ, _then_ delete
      console.log(resp);
      done();
    }).catch(e => {
      console.log(e);
    });
  });
});

describe('[Request::cancel] function test', () => {
  it('should return the updated request(s)', (done) => {
    var ID = 1520676;
    cw4.request.cancel([ID]).then(resp => { // TODO: Make this pull REQ, _then_ delete
      expect(_.some(resp, { RequestId: ID })).to.be.true;
      done();
    }).catch(e => {
      console.log(e);
    });
  });
});

describe('[Request::uncancel] function test', () => {
  it('should return the updated request(s)', (done) => {
    var ID = 1520676;
    cw4.request.uncancel([ID]).then(resp => { // TODO: Make this pull REQ, _then_ delete
      expect(_.some(resp, { RequestId: ID })).to.be.true;
      done();
    }).catch(e => {
      console.log(e);
    });
  });
});

describe('[Request::close] function test', () => {
  it('should return the closed request(s)', (done) => {
    var ID = 1520675;
    cw4.request.close([ID]).then(resp => { // TODO: Make this pull REQ, _then_ delete
      expect(_.some(resp, { RequestId: ID })).to.be.true;
      done();
    }).catch(e => {
      console.log(e);
    });
  });
});

describe('[Request::reopen] function test', () => {
  it('should return the reopened request(s)', (done) => {
    var ID = 1520675;
    cw4.request.reopen([ID]).then(resp => { // TODO: Make this pull REQ, _then_ delete
      expect(_.some(resp, { RequestId: ID })).to.be.true;
      done();
    }).catch(e => {
      console.log(e);
    });
  });
});

describe('[Request::comment.add] function test', () => {
  it('should return the reopened request(s)', (done) => {
    var ID = 1520675;
    var comment = 'New comment on ' + Date().toString() + '.';
    cw4.request.comment.add(ID, comment).then(resp => {
      assert.equal(resp.Comments, comment);
      done();
    }).catch(e => {
      console.log(e);
    });
  });
});

describe('[Request::comment.update] function test', () => {
  it('should return the reopened request(s)', (done) => {
    var ID = 1636877;
    var comment = 'Updated this comment on ' + Date().toString() + '.';
    cw4.request.comment.update(ID, comment).then(resp => {
      assert.equal(resp.Comments, comment);
      done();
    }).catch(e => {
      console.log(e);
    });
  });
});

describe('[Request::comment.get] function test', () => {
  it('should return the comments for the request', (done) => {
    var ID = 1520675;
    cw4.request.comment.get([ID]).then(resp => {
      console.log(resp[ID]);
      assert.isArray(resp);
      done();
    }).catch(e => {
      console.log(e);
    });
  });
});


describe('[Request::comment.getPredefined] function test', () => {
  it('should return the comments for the activity type', (done) => {
    cw4.request.comment.getPredefined(738).then(resp => {
      assert.isArray(resp);
      done();
    }).catch(e => {
      console.log(e);
    });
  });
});

// describe('[Request::comment.getForActivityList] function test', () => {
//   it('should return the comments for the activity type', (done) => {
//     cw4.request.comment.getForActivityList().then(resp => {
//       console.log(resp);
//       // assert.isArray(resp);
//       done();
//     }).catch(e => {
//       console.log(e);
//     });
//   });
// });

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

describe('[Request::addAttachment] function test', () => {
  it('should know it is an inspection attachment instance', (done) => {
    assert.equal(cw4.request.attachments.currentActivityType, 'Request');
    done()
  });

  it('should return an attachment if attached', (done) => {
    cw4.request.attachments.add(1763986, path.join(path.dirname(__dirname), 'uploads', 'test.pdf'), 'test.pdf').then((r) => {
      console.log(r.Id)
      assert.isDefined(r.Attachment)
      done()
    }).catch(error => {
      console.log(error, 'unexpected error adding attachment');
      done(new Error("Unexpected error on add attachment", error));
    });
  });

});

describe('[Request::getAttachments] function test', () => {
  it('should return a collection of attachments (if none exist on provided SR, will be empty)', (done) => {
    cw4.request.attachments.getByNodesId(1763986).then((r) => {
      assert.isArray(r)
      done()
    }).catch(error => {
      console.log(error, 'unexpected error adding attachment');
      done(new Error("Unexpected error on add attachment", error));
    });
  });

});

describe('[Request::deleteAttachment] function test', () => {
  it('should know it is an inspection attachment instance', (done) => {
    assert.equal(cw4.request.attachments.currentActivityType, 'Request');
    done()
  });

  it('should return an true if attachment deleted', (done) => {
    cw4.request.attachments.delete(458625, path.join(path.dirname(__dirname), 'uploads', 'test.pdf'), 'test.pdf').then((r) => {
      assert.isTrue(r)
      done()
    }).catch(error => {
      console.log(error, 'unexpected error deleting attachment');
      done(new Error("Unexpected error on delete attachment", error));
    });
  });

});
