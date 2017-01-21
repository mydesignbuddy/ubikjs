"use strict";
var Sqlite = (function () {
    function Sqlite() {
    }
    Sqlite.prototype.count = function () {
        return 0;
    };
    Sqlite.prototype.peek = function () {
        return null;
    };
    Sqlite.prototype.enqueue = function (message) {
        throw "enqueue not implemented";
    };
    Sqlite.prototype.dequeue = function () {
        throw "dequeue not implemented";
    };
    Sqlite.prototype.clear = function () {
        throw "clear not implemented";
    };
    Sqlite.prototype.getMessages = function () {
        throw "getMessages not implemented";
    };
    return Sqlite;
}());
exports.Sqlite = Sqlite;
