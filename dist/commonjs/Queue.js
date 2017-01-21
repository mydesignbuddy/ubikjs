"use strict";
var Message_1 = require("./Message");
var Queue = (function () {
    function Queue(name, queue, handler, responseListener) {
        this._filters = [];
        this.name = name;
        this._backend = queue;
        if (handler !== null) {
            this.setHandler(handler);
        }
        this.setResponseListener((responseListener != null) ? responseListener : null);
    }
    Queue.prototype.addFilter = function (filter) {
        var filterExist = false;
        for (var _i = 0, _a = this._filters; _i < _a.length; _i++) {
            var f = _a[_i];
            if (f.getType() === filter.getType()) {
                filterExist = true;
            }
        }
        if (!filterExist) {
            this._filters.push(filter);
        }
    };
    Queue.prototype.getFilters = function () {
        return this._filters;
    };
    Queue.prototype.getMessages = function () {
        return this._backend.getMessages();
    };
    Queue.prototype.setHandler = function (handler) {
        this.handler = handler;
    };
    Queue.prototype.setResponseListener = function (listener) {
        this.responseListener = listener;
    };
    Queue.prototype.enqueue = function (message) {
        message = Message_1.Message.load(message);
        if (this._filters.length > 0) {
            for (var _i = 0, _a = this._filters; _i < _a.length; _i++) {
                var filter = _a[_i];
                message = filter.beforeEnqueue(this, message);
            }
        }
        this._backend.enqueue(message);
        if (this._filters.length > 0) {
            for (var _b = 0, _c = this._filters; _b < _c.length; _b++) {
                var filter = _c[_b];
                filter.afterEnqueue(this, message);
            }
        }
    };
    Queue.prototype.peek = function () {
        return this._backend.peek();
    };
    Queue.prototype.dequeue = function () {
        this._backend.dequeue();
    };
    Queue.prototype.count = function () {
        return this._backend.count();
    };
    Queue.prototype.clear = function () {
        this._backend.clear();
    };
    Queue.prototype.run = function () {
        if (this.count() > 0) {
            var message = this.peek();
            message = message;
            this.dequeue();
            if (this._filters.length > 0) {
                for (var _i = 0, _a = this._filters; _i < _a.length; _i++) {
                    var filter = _a[_i];
                    message = filter.beforeRun(this, message);
                }
            }
            if (message !== null) {
                this.handler.handle(this, message);
                if (this._filters.length > 0) {
                    for (var _b = 0, _c = this._filters; _b < _c.length; _b++) {
                        var filter = _c[_b];
                        filter.afterRun(this, message);
                    }
                }
            }
        }
    };
    Queue.prototype.response = function (response) {
        response = response;
        if (this._filters.length > 0) {
            for (var _i = 0, _a = this._filters; _i < _a.length; _i++) {
                var filter = _a[_i];
                response = filter.beforeResponse(this, response);
            }
        }
        if (!response.wasSuccessful) {
            this.responseListener.failure(response);
        }
        else {
            this.responseListener.successful(response);
        }
        if (this._filters.length > 0) {
            for (var _b = 0, _c = this._filters; _b < _c.length; _b++) {
                var filter = _c[_b];
                filter.afterResponse(this, response);
            }
        }
    };
    return Queue;
}());
exports.Queue = Queue;
