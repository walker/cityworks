'use strict';
 require('dotenv').config();
 var chai = require('chai');
 var expect = require('chai').expect;
 var assert = require('chai').assert;
 var chaiAsPromised = require("chai-as-promised");
 chai.use(chaiAsPromised);
 const cw3 = require('../dist/index.js');
 cw3.Cityworks.configure(process.env.domain, {path: process.env.install_path, version: process.env.version});
 
 before(function(done) {
   this.timeout(20000000);
   cw3.Cityworks.authenticate(process.env.login, process.env.password).then(resp => {
     done();
   }).catch(e => {
     console.log(e, 'unexpected error')
     done();
   });
 });

 describe('[General::notifications] function test', () => {
   it('should resolve a collection', (done) => {
     cw3.general.notifications().then(resp => {
       assert.isArray(resp);
       done();
     });
   });
 });

 describe('[General::amIWatching] function test', () => {
   it('should reject with an error if the activity type is not available or does not exist', (done) => {
     cw3.general.amIWatching('request', 42015).then(r => {
     }).catch(e => {
       assert.equal(e.message, 'Activity type provided does not exist.');
       done();
     });
   });
   it('should resolve a boolean', (done) => {
     cw3.general.amIWatching('case', 42015).then(r => {
       assert.isBoolean(r);
       done();
     });
   });
   it('should resolve with false if id does not exist', (done) => {
     cw3.general.amIWatching('case', 200042015).then(r => {
       assert.isFalse(r);
       done();
     }).catch(e => {
       done();
     });
   });
   it('should reject with an error if the activity id is too large', (done) => {
     cw3.general.amIWatching('case', 10000000000).then(response => {
     }).catch(e => {
       assert.equal(e.message, 'Unknown error.');
       done();
     });
   });
 });

 describe('[General::quickSearch] function test', () => {
   it('should resolve results', (done) => {
     cw3.general.quickSearch('256460').then(r => {
       assert.property(r, 'Permits');
       done();
     });
   });

   it('should resolve (empty) results even when the string is not found', (done) => {
     cw3.general.quickSearch('SomethingSidewalk').then(r => {
       assert.property(r, 'Permits');
       done();
     });
   });
 });

 describe('[General::getActivityMetadataByIds] function test', () => {
   it('should resolve an activity based on the metadata ids');
 });

 describe('[General::getWOEntityCostSummary] function test', () => {
   it('should get an Entity\'s cost summary');
 });

 describe('[General::searchWOEntityCostSummary] function test', () => {
   it('should resolve reults of a search for cost summary of an entity');
 });
