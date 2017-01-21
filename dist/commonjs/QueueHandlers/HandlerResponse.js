"use strict";
var HandlerResponse = (function () {
    function HandlerResponse(message, errorMessages, wasSuccessful) {
        this.message = message;
        this.data = errorMessages;
        this.wasSuccessful = wasSuccessful;
    }
    return HandlerResponse;
}());
exports.HandlerResponse = HandlerResponse;
