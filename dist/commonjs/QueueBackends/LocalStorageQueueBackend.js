"use strict";
var LocalStorageQueueBackend = (function () {
    function LocalStorageQueueBackend() {
    }
    LocalStorageQueueBackend.prototype.count = function () {
        return 0;
    };
    LocalStorageQueueBackend.prototype.peek = function () {
        return null;
    };
    LocalStorageQueueBackend.prototype.enqueue = function (message) {
        throw "enqueue not implemented";
    };
    LocalStorageQueueBackend.prototype.dequeue = function () {
        throw "dequeue not implemented";
    };
    LocalStorageQueueBackend.prototype.clear = function () {
        throw "clear not implemented";
    };
    LocalStorageQueueBackend.prototype.getMessages = function () {
        throw "getMessages not implemented";
    };
    return LocalStorageQueueBackend;
}());
exports.LocalStorageQueueBackend = LocalStorageQueueBackend;
