var assert = require('assert');
var Ubik = require('../dist/commonjs/Ubik');

describe('QueueBuilder', function () {
  describe('Backends', function () {
    it('simple inMemory', function () {
      // arrange and act
      var queue = new Ubik.QueueBuilder('queue1').build();
      // assert
      assert.equal("InMemoryBackend", queue._backend.constructor.name);
    });
  });
  describe('Filters', function () {
    it('Retry filter', function () {
      // arrange and act
      var queue = new Ubik.QueueBuilder('queue1').retries(3).build();
      // assert
      var filter = queue.getFilters().find(function (o) { return o.constructor.name === "RetryFilter"; });
      assert.equal(1, queue.getFilters().length);
      assert.equal("object", typeof (filter));
      assert.equal(3, filter.maxRetryAttempts);
      assert.equal("RetryFilter", filter.constructor.name);
    });

    it('UUID filter', function () {
      // arrange and act
      var queue = new Ubik.QueueBuilder('queue1').UUID().build();
      // assert
      var filter = queue.getFilters().find(function (o) { return o.constructor.name === "UUIDFilter"; });
      assert.equal(1, queue.getFilters().length);
      assert.equal("object", typeof (filter));
      assert.equal("UUIDFilter", filter.constructor.name);
    });

    it('Expiration filter', function () {
      // arrange and act
      var queue = new Ubik.QueueBuilder('queue1').expiration().build();
      // assert
      var filter = queue.getFilters().find(function (o) { return o.constructor.name === "ExpirationFilter"; });
      assert.equal(1, queue.getFilters().length);
      assert.equal("object", typeof (filter));
      assert.equal("ExpirationFilter", filter.constructor.name);
    });

    it('add one filter', function () {
      // arrange and act
      var queue = new Ubik.QueueBuilder('queue1')
        .filter(new Ubik.UUIDFilter())
        .build();
      // assert
      assert.equal(1, queue.getFilters().length);
    });

    it('Multiple filters by array', function () {
      // arrange and act
      var queue = new Ubik.QueueBuilder('queue1')
        .filters([
          new Ubik.UUIDFilter(),
          new Ubik.ExpirationFilter(),
          new Ubik.RetryFilter(2),
          new Ubik.UUIDFilter() // it will gracefully ignore duplicates
        ])
        .build();
      // assert
      assert.equal(3, queue.getFilters().length);
    });
  });

  describe('Handler', function () {
    it('Type Handler', function () {
      // arrange and act
      var queue = new Ubik.QueueBuilder('queue1').handler(
        new Ubik.Handler(function (msg) {
          return true;
        }
        )).build();
      // assert
      assert.equal("Handler", queue.handler.constructor.name);
    });
  });

  describe('Listener', function () {
    it('POJO Listener', function () {
      // arrange
      function customListener() {
        this.successful = function (r) { };
        this.failure = function (r) { };
        this.expired = function (r) { };
      }
      // arrange and act
      var queue = new Ubik.QueueBuilder('queue1').listener(new customListener()).build();
      // assert
      assert.equal("customListener", queue.listener.constructor.name);
      assert.equal("function", typeof (queue.listener.successful));
      assert.equal("function", typeof (queue.listener.failure));
      assert.equal("function", typeof (queue.listener.expired));
    });

    it('Type Listener', function () {
      // arrange
      // arrange and act
      var queue = new Ubik.QueueBuilder('queue1').listener(new Ubik.Listener()).build();
      // assert
      assert.equal("Listener", queue.listener.constructor.name);
      assert.equal("function", typeof (queue.listener.successful));
      assert.equal("function", typeof (queue.listener.failure));
      assert.equal("function", typeof (queue.listener.expired));
    });

    it('ConsoleListener Listener', function () {
      // arrange
      // arrange and act
      var queue = new Ubik.QueueBuilder('queue1').listener(new Ubik.ConsoleListener()).build();
      // assert
      assert.equal("ConsoleListener", queue.listener.constructor.name);
      assert.equal("function", typeof (queue.listener.successful));
      assert.equal("function", typeof (queue.listener.failure));
      assert.equal("function", typeof (queue.listener.expired));
    });

    it('Builder Listener', function () {
      // arrange
      // arrange and act
      var queue = new Ubik.QueueBuilder('queue1').handler(new Ubik.Handler())
        .success(function (d) { })
        .failure(function (d) { })
        .expire(function (d) { })
        .build();
      // assert
      assert.equal("Listener", queue.listener.constructor.name);
      assert.equal("function", typeof (queue.listener.successful));
      assert.equal("function", typeof (queue.listener.failure));
      assert.equal("function", typeof (queue.listener.expired));
    });
  });
});
