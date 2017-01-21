"use strict";
var LocalStorageBackend = (function () {
    function LocalStorageBackend() {
    }
    LocalStorageBackend.prototype.count = function () {
        return 0;
    };
    LocalStorageBackend.prototype.peek = function () {
        return null;
    };
    LocalStorageBackend.prototype.enqueue = function (message) {
        throw "enqueue not implemented";
    };
    LocalStorageBackend.prototype.dequeue = function () {
        throw "dequeue not implemented";
    };
    LocalStorageBackend.prototype.clear = function () {
        throw "clear not implemented";
    };
    LocalStorageBackend.prototype.getMessages = function () {
        throw "getMessages not implemented";
    };
    return LocalStorageBackend;
}());
exports.LocalStorageBackend = LocalStorageBackend;
