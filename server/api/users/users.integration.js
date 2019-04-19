/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newUsers;

describe('Users API:', function() {
  describe('GET /api/userss', function() {
    var userss;

    beforeEach(function(done) {
      request(app)
        .get('/api/userss')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          userss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      userss.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/userss', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/userss')
        .send({
          name: 'New Users',
          info: 'This is the brand new users!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newUsers = res.body;
          done();
        });
    });

    it('should respond with the newly created users', function() {
      newUsers.name.should.equal('New Users');
      newUsers.info.should.equal('This is the brand new users!!!');
    });
  });

  describe('GET /api/userss/:id', function() {
    var users;

    beforeEach(function(done) {
      request(app)
        .get(`/api/userss/${newUsers._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          users = res.body;
          done();
        });
    });

    afterEach(function() {
      users = {};
    });

    it('should respond with the requested users', function() {
      users.name.should.equal('New Users');
      users.info.should.equal('This is the brand new users!!!');
    });
  });

  describe('PUT /api/userss/:id', function() {
    var updatedUsers;

    beforeEach(function(done) {
      request(app)
        .put(`/api/userss/${newUsers._id}`)
        .send({
          name: 'Updated Users',
          info: 'This is the updated users!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedUsers = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedUsers = {};
    });

    it('should respond with the updated users', function() {
      updatedUsers.name.should.equal('Updated Users');
      updatedUsers.info.should.equal('This is the updated users!!!');
    });

    it('should respond with the updated users on a subsequent GET', function(done) {
      request(app)
        .get(`/api/userss/${newUsers._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let users = res.body;

          users.name.should.equal('Updated Users');
          users.info.should.equal('This is the updated users!!!');

          done();
        });
    });
  });

  describe('PATCH /api/userss/:id', function() {
    var patchedUsers;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/userss/${newUsers._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Users' },
          { op: 'replace', path: '/info', value: 'This is the patched users!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedUsers = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedUsers = {};
    });

    it('should respond with the patched users', function() {
      patchedUsers.name.should.equal('Patched Users');
      patchedUsers.info.should.equal('This is the patched users!!!');
    });
  });

  describe('DELETE /api/userss/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/userss/${newUsers._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when users does not exist', function(done) {
      request(app)
        .delete(`/api/userss/${newUsers._id}`)
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
