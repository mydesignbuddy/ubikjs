"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QueueFilter_1 = require("./QueueFilter");
var RetryFilter = (function (_super) {
    __extends(RetryFilter, _super);
    function RetryFilter(maxRetryAttempts) {
        var _this = _super.call(this) || this;
        _this.maxRetryAttempts = maxRetryAttempts ? maxRetryAttempts : 3;
        return _this;
    }
    RetryFilter.prototype.beforeResponse = function (queue, response) {
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
    return RetryFilter;
}(QueueFilter_1.QueueFilter));
exports.RetryFilter = RetryFilter;
