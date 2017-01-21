"use strict";
var FilesystemBackend = (function () {
    function FilesystemBackend() {
    }
    FilesystemBackend.prototype.count = function () {
        return 0;
    };
    FilesystemBackend.prototype.peek = function () {
        return null;
    };
    FilesystemBackend.prototype.enqueue = function (message) {
        throw "enqueue not implemented";
    };
    FilesystemBackend.prototype.dequeue = function () {
        throw "dequeue not implemented";
    };
    FilesystemBackend.prototype.clear = function () {
        throw "clear not implemented";
    };
    FilesystemBackend.prototype.getMessages = function () {
        throw "getMessages not implemented";
    };
    return FilesystemBackend;
}());
exports.FilesystemBackend = FilesystemBackend;
