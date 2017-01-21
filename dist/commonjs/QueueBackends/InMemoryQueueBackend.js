"use strict";
/// <reference path="../Message.ts" />
/// <reference path="IQueueBackend.ts" />
var Message_1 = require("../Message");
var InMemoryQueueBackend = (function () {
    function InMemoryQueueBackend() {
        this._messages = [];
    }
    InMemoryQueueBackend.prototype.count = function () {
        return this._messages.length;
    };
    InMemoryQueueBackend.prototype.enqueue = function (message) {
        this._messages.push(message);
    };
    InMemoryQueueBackend.prototype.peek = function () {
        if (this._messages.length > 0) {
            var message = Message_1.Message.load(this._messages[0]);
            return message;
        }
        return null;
    };
    InMemoryQueueBackend.prototype.dequeue = function () {
        if (this._messages.length > 0) {
            this._messages.shift();
        }
    };
    InMemoryQueueBackend.prototype.clear = function () {
        this._messages = [];
    };
    InMemoryQueueBackend.prototype.getMessages = function () {
        return this._messages;
    };
    return InMemoryQueueBackend;
}());
exports.InMemoryQueueBackend = InMemoryQueueBackend;
