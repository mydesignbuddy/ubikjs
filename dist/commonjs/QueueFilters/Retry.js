"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QueueFilter_1 = require("./QueueFilter");
var Retry = (function (_super) {
    __extends(Retry, _super);
    function Retry(maxRetryAttempts) {
        var _this = _super.call(this) || this;
        _this.maxRetryAttempts = maxRetryAttempts ? maxRetryAttempts : 3;
        return _this;
    }
    Retry.prototype.beforeResponse = function (queue, response) {
        response = response;
        if (!response.wasSuccessful) {
            var retries = response.message.getHeader("retries");
            if (retries < this.maxRetryAttempts) {
                retries++;
                response.message.setHeader("retries", retries);
                queue.enqueue(response.message);
            }
        }
        return response;
    };
    return Retry;
}(QueueFilter_1.QueueFilter));
exports.Retry = Retry;
