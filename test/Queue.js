var assert = require('assert');
var chai = require('chai');
var sinon = require('sinon');
var Ubik = require('../dist/commonjs/Ubik');
var Message = Ubik.Message;
var Queue = Ubik.Queue;
var InMemoryBackend = Ubik.InMemoryBackend;
var Handler = Ubik.Handler;
var HandlerResponse = Ubik.HandlerResponse;
var Listener = Ubik.Listener;
var QueueFilter = Ubik.QueueFilter;
var UUIDFilter = Ubik.UUIDFilter;


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
      var l = new Listener(function (message) { }, function (message) { }, function (message) { });
      // act
      var q = new Queue("someQueue", qb, h, l);
      // assert
      assert.notEqual(null, q._backend);
      assert.equal("InMemoryBackend", q._backend.constructor.name);
      assert.equal("Handler", q.handler.constructor.name);
      assert.equal("Listener", q.listener.constructor.name);
    });
  });

  describe('Filters', function () {
    it('addFilter()', function () {
      // arrange
      var q = new Queue("someQueue");

      // act
      q.addFilter(new QueueFilter());

      // assert
      assert.equal(1, q._filters.length);
      assert.equal("QueueFilter", q._filters[0].constructor.name);
    });

    it('addFilter() no duplicates', function () {
      // arrange
      var q = new Queue("someQueue");

      // act
      q.addFilter(new QueueFilter());
      q.addFilter(new QueueFilter());

      // assert
      assert.equal(1, q._filters.length);
    });

    it('getFilters()', function () {
      // arrange
      var q = new Queue("someQueue");
      q.addFilter(new QueueFilter());

      // act
      var result = q.getFilters();

      // assert
      assert.equal(1, result.length);
      assert.equal("QueueFilter", result[0].constructor.name);
    });
  });
  describe('messages', function () {
    it('getMessages()', function () {
      // arrange
      var q = new Queue("someQueue", new InMemoryBackend());
      q.enqueue(new Message("some data1"));
      q.enqueue(new Message("some data2"));
      q.enqueue(new Message("some data3"));

      // act
      var result = q.getMessages();

      // assert
      assert.equal(3, result.length);
    });
    it('getMessages() no messages', function () {
      // arrange
      var q = new Queue("someQueue", new InMemoryBackend());

      // act
      var result = q.getMessages();

      // assert
      assert.equal(0, result.length);
    });
  });
  describe('handler', function () {
    it('setHandler()', function () {
      // arrange
      var q = new Queue("someQueue");

      // act
      q.setHandler(new Handler(function () { }, function () { }));

      // assert
      assert.equal('Handler', q.handler.constructor.name);
    });
  });
  describe('listener', function () {
    it('setListener()', function () {
      // arrange
      var q = new Queue("someQueue");

      // act
      q.setListener(new Listener(function (d) { }, function (d) { }, function (d) { }));

      // assert
      assert.equal('Listener', q.listener.constructor.name);
    });
  });
  describe('enqueue', function () {
    it('enqueue()', function () {
      // arrange
      var q = new Queue("someQueue", new InMemoryBackend());
      var date = new Date();

      // act
      q.enqueue(new Message("some data1"));
      q.enqueue(new Message({ body: "some data2" }, { expiration: date }));

      // assert
      var msgs = q.getMessages();
      assert.equal(2, msgs.length);
      assert.equal("some data1", msgs[0].payload);
      assert.equal("some data2", msgs[1].payload.body);
      assert.equal(date, msgs[1].headers.expiration);
    });
  });
  describe('peek', function () {
    it('peek()', function () {
      // arrange
      var q = new Queue("someQueue", new InMemoryBackend());
      q.enqueue(new Message({ body: "some data1" }));

      // act
      msg = q.peek();

      // assert
      assert.equal("Message", msg.constructor.name);
      assert.equal("some data1", msg.payload.body);
    });

    it('peek() with one beforeEnqueue filter', function () {
      // arrange
      var q = new Queue("someQueue", new InMemoryBackend());
      var f = new QueueFilter();
      sinon.spy(f, "beforeEnqueue");
      q.addFilter(f);
      q.enqueue(new Message({ body: "some data1" }));

      // act
      msg = q.peek();

      // assert
      assert(f.beforeEnqueue.calledOnce);
    });

    it('peek() with many beforeEnqueue filters', function () {
      // arrange
      var q = new Queue("someQueue", new InMemoryBackend());
      var f1 = new QueueFilter();
      var f2 = new UUIDFilter();
      sinon.spy(f1, "beforeEnqueue");
      sinon.spy(f2, "beforeEnqueue");
      q.addFilter(f1);
      q.addFilter(f2);
      q.enqueue(new Message({ body: "some data1" }));

      // act
      msg = q.peek();

      // assert
      assert(f1.beforeEnqueue.calledOnce);
      assert(f2.beforeEnqueue.calledOnce);
    });

    it('peek() with one afterEnqueue filter', function () {
      // arrange
      var q = new Queue("someQueue", new InMemoryBackend());
      var f = new QueueFilter();
      sinon.spy(f, "afterEnqueue");
      q.addFilter(f);
      q.enqueue(new Message({ body: "some data1" }));

      // act
      msg = q.peek();

      // assert
      assert(f.afterEnqueue.calledOnce);
    });

    it('peek() with many afterEnqueue filters', function () {
      // arrange
      var q = new Queue("someQueue", new InMemoryBackend());
      var f1 = new QueueFilter();
      var f2 = new UUIDFilter();
      sinon.spy(f1, "beforeEnqueue");
      sinon.spy(f2, "beforeEnqueue");
      q.addFilter(f1);
      q.addFilter(f2);
      q.enqueue(new Message({ body: "some data1" }));

      // act
      msg = q.peek();

      // assert
      assert(f1.beforeEnqueue.calledOnce);
      assert(f2.beforeEnqueue.calledOnce);
    });
  });
  describe('dequeue', function () {
    it('dequeue()', function () {
      // arrange
      var q = new Queue("someQueue", new InMemoryBackend());
      q.enqueue(new Message({ id: "1" }));
      q.enqueue(new Message({ id: "2" }));
      q.enqueue(new Message({ id: "3" }));
      var countBefore = q.getMessages().length;

      // act
      q.dequeue();

      // assert
      var newPeekMsg = q.peek();
      var msgs = q.getMessages();
      assert.equal(3, countBefore);
      assert.equal(2, msgs.length);
      assert.equal("2", newPeekMsg.payload.id);
    });
  });
  describe('count', function () {
    it('count()', function () {
      // arrange
      var q = new Queue("someQueue", new InMemoryBackend());
      q.enqueue(new Message({ id: "1" }));
      q.enqueue(new Message({ id: "2" }));
      q.enqueue(new Message({ id: "3" }));
      var countA = q.getMessages().length;

      // act
      var countB = q.count();
      // assert
      assert.equal(countA, countB);
    });
  });
  describe('clear', function () {
    it('clear()', function () {
      // arrange
      var q = new Queue("someQueue", new InMemoryBackend());
      q.enqueue(new Message({ id: "1" }));
      q.enqueue(new Message({ id: "2" }));
      q.enqueue(new Message({ id: "3" }));

      // act
      q.clear();

      // assert
      assert.equal(0, q.count());
    });
  });
  describe('run', function () {
    it('run() no filters', function () {
      // arrange
      var h = new Handler(function (d) { return new HandlerResponse(d, null, true) });
      var l = new Listener(function (d) { }, function (d) { }, function (d) { });
      sinon.spy(h, "handle");

      var q = new Queue("someQueue", new InMemoryBackend(), h, l);
      sinon.spy(q, "dequeue");
      q.enqueue(new Message({ id: "1" }));
      q.enqueue(new Message({ id: "2" }));
      q.enqueue(new Message({ id: "3" }));
      var beforeCount = q.count();

      // act
      q.run();

      // assert
      assert.equal(3, beforeCount);
      assert.equal(2, q.count());
      assert(q.dequeue.calledOnce);
      assert(h.handle.calledOnce);
    });
    it('run() with one beforeRun filter', function () {
      // arrange
      var h = new Handler(function (d) { return new HandlerResponse(d, null, true) });
      var l = new Listener(function (d) { }, function (d) { }, function (d) { });

      var q = new Queue("someQueue", new InMemoryBackend(), h, l);

      var f1 = new QueueFilter();
      sinon.spy(f1, "beforeRun");
      q.addFilter(f1);

      q.enqueue(new Message({ id: "1" }));
      q.enqueue(new Message({ id: "2" }));
      q.enqueue(new Message({ id: "3" }));
      var beforeCount = q.count();

      // act
      q.run();

      // assert
      assert(f1.beforeRun.calledOnce);
    });

    it('run() with many beforeRun filters', function () {
      // arrange
      var h = new Handler(function (d) { return new HandlerResponse(d, null, true) });
      var l = new Listener(function (d) { }, function (d) { }, function (d) { });

      var q = new Queue("someQueue", new InMemoryBackend(), h, l);

      var f1 = new QueueFilter();
      var f2 = new UUIDFilter();
      sinon.spy(f1, "beforeRun");
      sinon.spy(f2, "beforeRun");
      q.addFilter(f1);
      q.addFilter(f2);

      q.enqueue(new Message({ id: "1" }));
      q.enqueue(new Message({ id: "2" }));
      q.enqueue(new Message({ id: "3" }));

      // act
      q.run();

      // assert
      assert(f1.beforeRun.calledOnce);
      assert(f2.beforeRun.calledOnce);
    });
    it('run() with one afterRun filter', function () {
      // arrange
      var h = new Handler(function (d) { return new HandlerResponse(d, null, true) });
      var l = new Listener(function (d) { }, function (d) { }, function (d) { });

      var q = new Queue("someQueue", new InMemoryBackend(), h, l);

      var f1 = new QueueFilter();
      sinon.spy(f1, "afterRun");
      q.addFilter(f1);

      q.enqueue(new Message({ id: "1" }));
      q.enqueue(new Message({ id: "2" }));
      q.enqueue(new Message({ id: "3" }));

      // act
      q.run();

      // assert
      assert(f1.afterRun.calledOnce);
    });

    it('run() with many afterRun filters', function () {
      // arrange
      var h = new Handler(function (d) { return new HandlerResponse(d, null, true) });
      var l = new Listener(function (d) { }, function (d) { }, function (d) { });

      var q = new Queue("someQueue", new InMemoryBackend(), h, l);

      var f1 = new QueueFilter();
      var f2 = new UUIDFilter();
      sinon.spy(f1, "afterRun");
      sinon.spy(f2, "afterRun");
      q.addFilter(f1);
      q.addFilter(f2);

      q.enqueue(new Message({ id: "1" }));
      q.enqueue(new Message({ id: "2" }));
      q.enqueue(new Message({ id: "3" }));

      // act
      q.run();

      // assert
      assert(f1.afterRun.calledOnce);
      assert(f2.afterRun.calledOnce);
    });
  });

  describe('response', function () {
    it('response() successful result', function () {
      // arrange
      var h = new Handler(function (d) { return new HandlerResponse(d, null, true) });
      var l = new Listener(function (d) { }, function (d) { }, function (d) { });
      sinon.spy(l, "successful");

      var q = new Queue("someQueue", new InMemoryBackend(), h, l);
      q.enqueue(new Message({ id: "1" }));

      // act
      q.run();

      // assert
      assert(l.successful.calledOnce);
    });
    it('response() failure result', function () {
      // arrange
      var h = new Handler(function (d) { return new HandlerResponse(d, null, false) });
      var l = new Listener(function (d) { }, function (d) { }, function (d) { });
      sinon.spy(l, "failure");

      var q = new Queue("someQueue", new InMemoryBackend(), h, l);
      q.enqueue(new Message({ id: "1" }));

      // act
      q.run();

      // assert
      assert(l.failure.calledOnce);
    });

    it('response() with one beforeRun filter', function () {
      // arrange
      var h = new Handler(function (d) { return new HandlerResponse(d, null, true) });
      var l = new Listener(function (d) { }, function (d) { }, function (d) { });

      var q = new Queue("someQueue", new InMemoryBackend(), h, l);

      var f1 = new QueueFilter();
      sinon.spy(f1, "beforeRun");
      q.addFilter(f1);

      q.enqueue(new Message({ id: "1" }));
      q.enqueue(new Message({ id: "2" }));
      q.enqueue(new Message({ id: "3" }));

      // act
      q.run();

      // assert
      assert(f1.beforeRun.calledOnce);
    });

    it('response() with many beforeRun filters', function () {
      // arrange
      var h = new Handler(function (d) { return new HandlerResponse(d, null, true) });
      var l = new Listener(function (d) { }, function (d) { }, function (d) { });

      var q = new Queue("someQueue", new InMemoryBackend(), h, l);

      var f1 = new QueueFilter();
      var f2 = new UUIDFilter();
      sinon.spy(f1, "beforeRun");
      sinon.spy(f2, "beforeRun");
      q.addFilter(f1);
      q.addFilter(f2);

      q.enqueue(new Message({ id: "1" }));
      q.enqueue(new Message({ id: "2" }));
      q.enqueue(new Message({ id: "3" }));

      // act
      q.run();

      // assert
      assert(f1.beforeRun.calledOnce);
      assert(f2.beforeRun.calledOnce);
    });
  });
  it('response() with one afterRun filter', function () {
    // arrange
    var h = new Handler(function (d) { return new HandlerResponse(d, null, true) });
    var l = new Listener(function (d) { }, function (d) { }, function (d) { });

    var q = new Queue("someQueue", new InMemoryBackend(), h, l);

    var f1 = new QueueFilter();
    sinon.spy(f1, "afterRun");
    q.addFilter(f1);

    q.enqueue(new Message({ id: "1" }));
    q.enqueue(new Message({ id: "2" }));
    q.enqueue(new Message({ id: "3" }));

    // act
    q.run();

    // assert
    assert(f1.afterRun.calledOnce);
  });

  it('response() with many afterRun filters', function () {
    // arrange
    var h = new Handler(function (d) { return new HandlerResponse(d, null, true) });
    var l = new Listener(function (d) { }, function (d) { }, function (d) { });

    var q = new Queue("someQueue", new InMemoryBackend(), h, l);

    var f1 = new QueueFilter();
    var f2 = new UUIDFilter();
    sinon.spy(f1, "afterRun");
    sinon.spy(f2, "afterRun");
    q.addFilter(f1);
    q.addFilter(f2);

    q.enqueue(new Message({ id: "1" }));
    q.enqueue(new Message({ id: "2" }));
    q.enqueue(new Message({ id: "3" }));

    // act
    q.run();

    // assert
    assert(f1.afterRun.calledOnce);
    assert(f2.afterRun.calledOnce);
  });
});