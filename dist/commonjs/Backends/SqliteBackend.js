"use strict";
var SqliteBackend = (function () {
    function SqliteBackend() {
    }
    SqliteBackend.prototype.count = function () {
        return 0;
    };
    SqliteBackend.prototype.peek = function () {
        return null;
    };
    SqliteBackend.prototype.enqueue = function (message) {
        throw "enqueue not implemented";
    };
    SqliteBackend.prototype.dequeue = function () {
        throw "dequeue not implemented";
    };
    SqliteBackend.prototype.clear = function () {
        throw "clear not implemented";
    };
    SqliteBackend.prototype.getMessages = function () {
        throw "getMessages not implemented";
    };
    return SqliteBackend;
}());
exports.SqliteBackend = SqliteBackend;
