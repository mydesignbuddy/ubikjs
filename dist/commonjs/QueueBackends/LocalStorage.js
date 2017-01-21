"use strict";
var LocalStorage = (function () {
    function LocalStorage() {
    }
    LocalStorage.prototype.count = function () {
        return 0;
    };
    LocalStorage.prototype.peek = function () {
        return null;
    };
    LocalStorage.prototype.enqueue = function (message) {
        throw "enqueue not implemented";
    };
    LocalStorage.prototype.dequeue = function () {
        throw "dequeue not implemented";
    };
    LocalStorage.prototype.clear = function () {
        throw "clear not implemented";
    };
    LocalStorage.prototype.getMessages = function () {
        throw "getMessages not implemented";
    };
    return LocalStorage;
}());
exports.LocalStorage = LocalStorage;
