"use strict";
var Message_1 = require("../Message");
var QueueFilter = (function () {
    function QueueFilter() {
    }
    QueueFilter.prototype.beforeEnqueue = function (queue, message) {
        message = message;
        return message;
    };
    QueueFilter.prototype.afterEnqueue = function (queue, message) {
    };
    QueueFilter.prototype.beforeRun = function (queue, message) {
        message = Message_1.Message.load(message);
        return message;
    };
    QueueFilter.prototype.afterRun = function (queue, message) {
    };
    QueueFilter.prototype.beforeResponse = function (queue, response) {
        response = response;
        return response;
    };
    QueueFilter.prototype.afterResponse = function (queue, response) {
    };
    QueueFilter.prototype.getType = function () {
        return this.constructor.name;
    };
    return QueueFilter;
}());
exports.QueueFilter = QueueFilter;
