var assert = require('assert');
var chai = require('chai');
var Ubik = require('../dist/commonjs/Ubik');
var Message = Ubik.Message;
var Queue = Ubik.Queue;
var InMemoryBackend = Ubik.InMemoryBackend;
var Handler = Ubik.Handler;
var Listener = Ubik.Listener;
describe('Queue', function () {
  describe('constructor()', function () {
    it('without backend', function () {
      // arrange
      // act
      var q = new Queue("someQueue");
      // assert
      assert.equal(null, q._backend);
    });

    it('with backend', function () {
      // arrange
      var qb = new InMemoryBackend();
      // act
      var q = new Queue("someQueue", qb);
      // assert
      assert.notEqual(null, q._backend);
      assert.equal("InMemoryBackend", q._backend.constructor.name);
    });
    it('with handler', function () {
      // arrange
      var qb = new InMemoryBackend();
      var h = new Handler(function (message) { });
      // act
      var q = new Queue("someQueue", qb, h);
      // assert
      assert.notEqual(null, q._backend);
      assert.equal("InMemoryBackend", q._backend.constructor.name);
      assert.equal("Handler", q.handler.constructor.name);
    });
    it('with listener', function () {
      // arrange
      var qb = new InMemoryBackend();
      var h = new Handler(function (message) { });
      var l = new Listener(function (message) { },function (message) { },function (message) { });
      // act
      var q = new Queue("someQueue", qb, h, l);
      // assert
      assert.notEqual(null, q._backend);
      assert.equal("InMemoryBackend", q._backend.constructor.name);
      assert.equal("Handler", q.handler.constructor.name);
      assert.equal("Listener", q.responseListener.constructor.name);
    });
  });
  
});