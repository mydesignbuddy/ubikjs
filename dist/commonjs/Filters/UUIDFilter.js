"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Message_1 = require("../Message");
var QueueFilter_1 = require("./QueueFilter");
var UUIDFilter = (function (_super) {
    __extends(UUIDFilter, _super);
    function UUIDFilter() {
        return _super.apply(this, arguments) || this;
    }
    UUIDFilter.prototype.beforeEnqueue = function (queue, message) {
        message = Message_1.Message.load(message);
        if (message.id === null || message.id === "" || message.id === undefined) {
            message.id = this._generateUuid();
        }
        return message;
    };
    UUIDFilter.prototype._generateUuid = function () {
        var d = new Date().getTime();
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            /* tslint:disable */
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
            /* tslint:enable */
        });
        return uuid;
    };
    return UUIDFilter;
}(QueueFilter_1.QueueFilter));
exports.UUIDFilter = UUIDFilter;
