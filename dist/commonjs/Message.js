"use strict";
var Message = (function () {
    function Message(payload, headers) {
        var _this = this;
        this.setHeader = function (name, value) {
            _this.headers[name] = value;
        };
        this.payload = payload;
        this.headers = {};
        if (headers !== undefined && headers !== null) {
            for (var headerKey in headers) {
                this.setHeader(headerKey, headers[headerKey]);
            }
        }
    }
    Message.prototype.getHeader = function (name) {
        if (this.headers[name] !== undefined) {
            return this.headers[name];
        }
        return null;
    };
    Message.load = function (message) {
        if (message !== null) {
            var newMessage = new Message(message.payload, message.headers);
            if (message.id !== undefined) {
                newMessage.id = message.id;
            }
            return newMessage;
        }
        return null;
    };
    return Message;
}());
exports.Message = Message;
