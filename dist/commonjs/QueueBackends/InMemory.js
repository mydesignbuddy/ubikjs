"use strict";
/// <reference path="../Message.ts" />
/// <reference path="IQueueBackend.ts" />
var Message_1 = require("../Message");
var InMemory = (function () {
    function InMemory() {
        this._messages = [];
    }
    InMemory.prototype.count = function () {
        return this._messages.length;
    };
    InMemory.prototype.enqueue = function (message) {
        this._messages.push(message);
    };
    InMemory.prototype.peek = function () {
        if (this._messages.length > 0) {
            var message = Message_1.Message.load(this._messages[0]);
            return message;
        }
        return null;
    };
    InMemory.prototype.dequeue = function () {
        if (this._messages.length > 0) {
            this._messages.shift();
        }
    };
    InMemory.prototype.clear = function () {
        this._messages = [];
    };
    InMemory.prototype.getMessages = function () {
        return this._messages;
    };
    return InMemory;
}());
exports.InMemory = InMemory;
