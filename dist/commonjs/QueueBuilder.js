"use strict";
var ConsoleListner_1 = require("./Listeners/ConsoleListner");
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
    QueueBuilder.prototype.InMemory = function () {
        this._backend = new InMemoryBackend_1.InMemoryBackend();
    };
    QueueBuilder.prototype.Filesystem = function () {
        this._backend = new FilesystemBackend_1.FilesystemBackend();
    };
    QueueBuilder.prototype.LocalStorage = function () {
        this._backend = new LocalStorageBackend_1.LocalStorageBackend();
    };
    QueueBuilder.prototype.Sqlite = function () {
        this._backend = new SqliteBackend_1.SqliteBackend();
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
        this._listener = new ConsoleListner_1.ConsoleListner();
        return this;
    };
    QueueBuilder.prototype.listener = function (listener) {
        this._listener = listener;
        return this;
    };
    QueueBuilder.prototype.build = function () {
        if (this._backend !== null) {
            this._queue = new Queue_1.Queue(name, this._backend);
            if (this._handler !== null) {
                this._queue.setHandler(this._handler);
                if (this._filters.length > 0) {
                    this.filters(this._filters);
                }
                if (this._listener !== null) {
                    this._queue.setResponseListener(this._listener);
                }
            }
            else {
                throw "You must set a handler";
            }
        }
        else {
            throw "You must set a backend";
        }
        return this._queue;
    };
    return QueueBuilder;
}());
exports.QueueBuilder = QueueBuilder;
