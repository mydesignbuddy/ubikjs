"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../Message.ts" />
/// <reference path="../Queue.ts" />
/// <reference path="QueueFilter.ts" />
var Message_1 = require("../Message");
var QueueFilter_1 = require("./QueueFilter");
var ExpirationFilter = (function (_super) {
    __extends(ExpirationFilter, _super);
    function ExpirationFilter() {
        return _super.apply(this, arguments) || this;
    }
    ExpirationFilter.prototype.beforeRun = function (queue, message) {
        message = Message_1.Message.load(message);
        var expiration = message.getHeader("expirationDate");
        if (expiration !== null) {
            if (expiration instanceof Date) {
                if (expiration <= new Date()) {
                    if (queue.responseListener !== null) {
                        queue.responseListener.expired(message);
                    }
                    return null;
                }
                else {
                    return message;
                }
            }
            else {
                return message;
            }
        }
        else {
            return message;
        }
    };
    return ExpirationFilter;
}(QueueFilter_1.QueueFilter));
exports.ExpirationFilter = ExpirationFilter;
