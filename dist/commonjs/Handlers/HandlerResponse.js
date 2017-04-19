"use strict";
var HandlerResponse = (function () {
    function HandlerResponse(message, errorMessages, wasSuccessful) {
        this.message = message;
        this.data = errorMessages;
        this.wasSuccessful = wasSuccessful;
    }
    HandlerResponse.load = function (obj) {
        var message = null;
        var data = null;
        var wasSuccessful = false;
        if (obj.message !== undefined) {
            message = obj.message;
        }
        if (obj.data !== undefined) {
            data = obj.data;
        }
        if (obj.wasSuccessful !== undefined) {
            wasSuccessful = obj.wasSuccessful;
        }
        return new HandlerResponse(message, data, wasSuccessful);
    };
    return HandlerResponse;
}());
exports.HandlerResponse = HandlerResponse;
