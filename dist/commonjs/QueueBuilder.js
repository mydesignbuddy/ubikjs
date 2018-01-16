"use strict";
var Listener_1 = require("./Listeners/Listener");
var ConsoleListener_1 = require("./Listeners/ConsoleListener");
var Handler_1 = require("./Handlers/Handler");
var Queue_1 = require("./Queue");
var FilesystemBackend_1 = require("./Backends/FilesystemBackend");
var InMemoryBackend_1 = require("./Backends/InMemoryBackend");
var LocalStorageBackend_1 = require("./Backends/LocalStorageBackend");
var SqliteBackend_1 = require("./Backends/SqliteBackend");
var ExpirationFilter_1 = require("./Filters/ExpirationFilter");
var RetryFilter_1 = require("./Filters/RetryFilter");
var UUIDFilter_1 = require("./Filters/UUIDFilter");
var QueueBuilder = (function () {
    function QueueBuilder(name, backend) {
        this._name = name;
        if (backend !== null) {
            this._backend = backend;
        }
        this._filters = [];
        this._successFunct = function () { };
        this._failureFunct = function () { };
        this._expireFunct = function () { };
    }
    QueueBuilder.prototype.handler = function (handler) {
        var type = handler.constructor.name;
        if (type === "Handler") {
            this._handler = handler;
        }
        else if (type === "Function") {
            this._handler = new Handler_1.Handler(handler);
        }
        return this;
    };
    QueueBuilder.prototype.success = function (funct) {
        this._successFunct = funct;
        return this;
    };
    QueueBuilder.prototype.failure = function (funct) {
        this._failureFunct = funct;
        return this;
    };
    QueueBuilder.prototype.expire = function (funct) {
        this._expireFunct = funct;
        return this;
    };
    QueueBuilder.prototype.inMemory = function () {
        this._backend = new InMemoryBackend_1.InMemoryBackend();
        return this;
    };
    QueueBuilder.prototype.filesystem = function () {
        this._backend = new FilesystemBackend_1.FilesystemBackend();
        return this;
    };
    QueueBuilder.prototype.localStorage = function () {
        this._backend = new LocalStorageBackend_1.LocalStorageBackend();
        return this;
    };
    QueueBuilder.prototype.sqlite = function () {
        this._backend = new SqliteBackend_1.SqliteBackend();
        return this;
    };
    QueueBuilder.prototype.filter = function (filter) {
        this._filters.push(filter);
        return this;
    };
    QueueBuilder.prototype.filters = function (filters) {
        for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
            var filter = filters_1[_i];
            this.filter(filter);
        }
        return this;
    };
    QueueBuilder.prototype.retries = function (maxNumberRetries) {
        this.filter(new RetryFilter_1.RetryFilter(maxNumberRetries));
        return this;
    };
    QueueBuilder.prototype.expiration = function () {
        this.filter(new ExpirationFilter_1.ExpirationFilter());
        return this;
    };
    QueueBuilder.prototype.UUID = function () {
        this.filter(new UUIDFilter_1.UUIDFilter());
        return this;
    };
    QueueBuilder.prototype.debug = function () {
        this._listener = new ConsoleListener_1.ConsoleListener();
        return this;
    };
    QueueBuilder.prototype.listener = function (listener) {
        this._listener = listener;
        return this;
    };
    QueueBuilder.prototype.build = function () {
        if (this._backend !== null && this._backend !== undefined) {
            this._queue = new Queue_1.Queue(this._name, this._backend);
        }
        else {
            this._queue = new Queue_1.Queue(this._name, new InMemoryBackend_1.InMemoryBackend());
        }
        if (this._handler !== null) {
            this._queue.setHandler(this._handler);
            if (this._filters.length > 0) {
                for (var i = 0; i < this._filters.length; i++) {
                    this._queue.addFilter(this._filters[i]);
                }
            }
            if (this._listener !== null && this._listener !== undefined) {
                this._queue.setListener(this._listener);
            }
            else {
                this._queue.setListener(new Listener_1.Listener(this._successFunct, this._failureFunct, this._expireFunct));
            }
        }
        else {
            throw "You must set a handler";
        }
        return this._queue;
    };
    return QueueBuilder;
}());
exports.QueueBuilder = QueueBuilder;
