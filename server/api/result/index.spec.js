/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var resultCtrlStub = {
  index: 'resultCtrl.index',
  show: 'resultCtrl.show',
  create: 'resultCtrl.create',
  upsert: 'resultCtrl.upsert',
  patch: 'resultCtrl.patch',
  destroy: 'resultCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var resultIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './result.controller': resultCtrlStub
});

describe('Result API Router:', function() {
  it('should return an express router instance', function() {
    resultIndex.should.equal(routerStub);
  });

  describe('GET /(api/result/)', function() {
    it('should route to result.controller.index', function() {
      routerStub.get
        .withArgs('/', 'resultCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /(api/result/)/:id', function() {
    it('should route to result.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'resultCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /(api/result/)', function() {
    it('should route to result.controller.create', function() {
      routerStub.post
        .withArgs('/', 'resultCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /(api/result/)/:id', function() {
    it('should route to result.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'resultCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /(api/result/)/:id', function() {
    it('should route to result.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'resultCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /(api/result/)/:id', function() {
    it('should route to result.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'resultCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
