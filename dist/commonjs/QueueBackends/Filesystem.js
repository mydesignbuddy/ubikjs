"use strict";
var Filesystem = (function () {
    function Filesystem() {
    }
    Filesystem.prototype.count = function () {
        return 0;
    };
    Filesystem.prototype.peek = function () {
        return null;
    };
    Filesystem.prototype.enqueue = function (message) {
        throw "enqueue not implemented";
    };
    Filesystem.prototype.dequeue = function () {
        throw "dequeue not implemented";
    };
    Filesystem.prototype.clear = function () {
        throw "clear not implemented";
    };
    Filesystem.prototype.getMessages = function () {
        throw "getMessages not implemented";
    };
    return Filesystem;
}());
exports.Filesystem = Filesystem;
