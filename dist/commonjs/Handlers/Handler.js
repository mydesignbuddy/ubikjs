"use strict";
var HandlerResponse_1 = require("./HandlerResponse");
var Handler = (function () {
    function Handler(funct) {
        this.funct = funct;
    }
    Handler.prototype.handle = function (queue, message) {
        var result = this.funct(message);
        queue.response(new HandlerResponse_1.HandlerResponse(message, result.data, result.wasSuccessful));
    };
    return Handler;
}());
exports.Handler = Handler;
