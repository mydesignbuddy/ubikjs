"use strict";
var Message_1 = require("../Message");
var InMemoryBackend = (function () {
    function InMemoryBackend() {
        this._messages = [];
    }
    InMemoryBackend.prototype.count = function () {
        return this._messages.length;
    };
    InMemoryBackend.prototype.enqueue = function (message) {
        this._messages.push(message);
    };
    InMemoryBackend.prototype.peek = function () {
        if (this._messages.length > 0) {
            var message = Message_1.Message.load(this._messages[0]);
            return message;
        }
        return null;
    };
    InMemoryBackend.prototype.dequeue = function () {
        if (this._messages.length > 0) {
            this._messages.shift();
        }
    };
    InMemoryBackend.prototype.clear = function () {
        this._messages = [];
    };
    InMemoryBackend.prototype.getMessages = function () {
        return this._messages;
    };
    return InMemoryBackend;
}());
exports.InMemoryBackend = InMemoryBackend;
