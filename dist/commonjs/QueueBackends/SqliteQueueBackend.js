"use strict";
var SqliteQueueBackend = (function () {
    function SqliteQueueBackend() {
    }
    SqliteQueueBackend.prototype.count = function () {
        return 0;
    };
    SqliteQueueBackend.prototype.peek = function () {
        return null;
    };
    SqliteQueueBackend.prototype.enqueue = function (message) {
        throw "enqueue not implemented";
    };
    SqliteQueueBackend.prototype.dequeue = function () {
        throw "dequeue not implemented";
    };
    SqliteQueueBackend.prototype.clear = function () {
        throw "clear not implemented";
    };
    SqliteQueueBackend.prototype.getMessages = function () {
        throw "getMessages not implemented";
    };
    return SqliteQueueBackend;
}());
exports.SqliteQueueBackend = SqliteQueueBackend;
