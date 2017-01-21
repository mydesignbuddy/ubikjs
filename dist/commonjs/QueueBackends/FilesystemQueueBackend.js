"use strict";
var FilesystemQueueBackend = (function () {
    function FilesystemQueueBackend() {
    }
    FilesystemQueueBackend.prototype.count = function () {
        return 0;
    };
    FilesystemQueueBackend.prototype.peek = function () {
        return null;
    };
    FilesystemQueueBackend.prototype.enqueue = function (message) {
        throw "enqueue not implemented";
    };
    FilesystemQueueBackend.prototype.dequeue = function () {
        throw "dequeue not implemented";
    };
    FilesystemQueueBackend.prototype.clear = function () {
        throw "clear not implemented";
    };
    FilesystemQueueBackend.prototype.getMessages = function () {
        throw "getMessages not implemented";
    };
    return FilesystemQueueBackend;
}());
exports.FilesystemQueueBackend = FilesystemQueueBackend;
