/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var usersCtrlStub = {
  index: 'usersCtrl.index',
  show: 'usersCtrl.show',
  create: 'usersCtrl.create',
  upsert: 'usersCtrl.upsert',
  patch: 'usersCtrl.patch',
  destroy: 'usersCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var usersIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './users.controller': usersCtrlStub
});

describe('Users API Router:', function() {
  it('should return an express router instance', function() {
    usersIndex.should.equal(routerStub);
  });

  describe('GET /api/userss', function() {
    it('should route to users.controller.index', function() {
      routerStub.get
        .withArgs('/', 'usersCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/userss/:id', function() {
    it('should route to users.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'usersCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/userss', function() {
    it('should route to users.controller.create', function() {
      routerStub.post
        .withArgs('/', 'usersCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/userss/:id', function() {
    it('should route to users.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'usersCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/userss/:id', function() {
    it('should route to users.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'usersCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/userss/:id', function() {
    it('should route to users.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'usersCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
