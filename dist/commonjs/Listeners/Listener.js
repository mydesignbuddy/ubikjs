"use strict";
var Listener = (function () {
    function Listener(successfulFunction, failureFunction, expiredFunction) {
        this._successfulFunction = successfulFunction;
        this._failureFunction = failureFunction;
        this._expiredFunction = expiredFunction;
    }
    Listener.prototype.successful = function (response) {
        this._successfulFunction(response);
    };
    Listener.prototype.failure = function (response) {
        this._failureFunction(response);
    };
    Listener.prototype.expired = function (message) {
        this._expiredFunction(message);
    };
    return Listener;
}());
exports.Listener = Listener;
