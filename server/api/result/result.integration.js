/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newResult;

describe('Result API:', function() {
  describe('GET /(api/result/)', function() {
    var results;
    beforeEach(function(done) {
      request(app)
        .get('/(api/result/)')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          results = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      results.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/result/', function() {
    beforeEach(function(done) {
      request(app)
        .post('/(api/result/)')
        .send({
          name: 'New Result',
          info: 'This is the brand new result!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newResult = res.body;
          done();
        });
    });

    it('should respond with the newly created result', function() {
      newResult.name.should.equal('New Result');
      newResult.info.should.equal('This is the brand new result!!!');
    });
  });

  describe('GET /(api/result/)/:id', function() {
    var result;

    beforeEach(function(done) {
      request(app)
        .get(`/(api/result/)/${newResult._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          result = res.body;
          done();
        });
    });

    afterEach(function() {
      result = {};
    });

    it('should respond with the requested result', function() {
      result.name.should.equal('New Result');
      result.info.should.equal('This is the brand new result!!!');
    });
  });

  describe('PUT /(api/result/)/:id', function() {
    var updatedResult;

    beforeEach(function(done) {
      request(app)
        .put(`/(api/result/)/${newResult._id}`)
        .send({
          name: 'Updated Result',
          info: 'This is the updated result!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedResult = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedResult = {};
    });

    it('should respond with the updated result', function() {
      updatedResult.name.should.equal('Updated Result');
      updatedResult.info.should.equal('This is the updated result!!!');
    });

    it('should respond with the updated result on a subsequent GET', function(done) {
      request(app)
        .get(`/(api/result/)/${newResult._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let result = res.body;

          result.name.should.equal('Updated Result');
          result.info.should.equal('This is the updated result!!!');

          done();
        });
    });
  });

  describe('PATCH /(api/result/)/:id', function() {
    var patchedResult;

    beforeEach(function(done) {
      request(app)
        .patch(`/(api/result/)/${newResult._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Result' },
          { op: 'replace', path: '/info', value: 'This is the patched result!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedResult = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedResult = {};
    });

    it('should respond with the patched result', function() {
      patchedResult.name.should.equal('Patched Result');
      patchedResult.info.should.equal('This is the patched result!!!');
    });
  });

  describe('DELETE /(api/result/)/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/(api/result/)/${newResult._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when result does not exist', function(done) {
      request(app)
        .delete(`/(api/result/)/${newResult._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
