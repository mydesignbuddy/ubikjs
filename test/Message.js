var assert = require('assert');
var Message = require('../dist/commonjs/Ubik').Message;
describe('Message', function () {
  describe('constructor()', function () {
    it('without headers', function () {
      // arrange
      // act
      var msg = new Message({ someData: "someValue" });
      // assert
      assert.equal(0, Object.keys(msg.headers).length);
    });

    it('with headers', function () {
      // arrange
      var headers = { "some header": "some value", "header1": true }
      // act
      var msg = new Message({ someData: "someValue" }, headers);
      // assert
      assert.equal("some value", msg.headers["some header"]);
      assert.equal(true, msg.headers["header1"]);
    });
  });
  describe('setHeader()', function () {
    it('should set new header on Message', function () {
      // arrange
      var msg = new Message({ someData: "someValue" });

      // act
      msg.setHeader("some name", "some value");

      // assert
      assert.equal("some value", msg.headers["some name"]);
    });
  });

  describe('load()', function () {
    it('should return a new Message object from a standard object', function () {
      // arrange
      var payload = { some: "obj" };
      var headers = { isValid: true };

      // act
      var msg = Message.load({ payload: payload, headers: headers });

      // assert
      assert.equal("Message", msg.constructor.name);
      assert.equal("obj", msg.payload.some);
      assert.equal(1, Object.keys(msg.headers).length);
    });
  });

  describe('getHeader()', function () {
    it('should get header on Message by name', function () {
      // arrange
      var headers = { "some header": "some value", "header1": true }
      var msg = new Message({ someData: "someValue" }, headers);

      // act
      var header1 = msg.getHeader("header1");
      var header2 = msg.getHeader("some header");

      // assert
      assert.equal(2, Object.keys(msg.headers).length);
      assert.equal("some value", header2);
      assert.equal(true, header1);
    });
  });
});
