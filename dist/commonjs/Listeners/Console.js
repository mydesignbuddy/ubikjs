"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="Listener.ts" />
/// <reference path="../Message.ts" />
/// <reference path="../QueueHandlers/HandlerResponse.ts" />
var Listener_1 = require("./Listener");
var Console = (function (_super) {
    __extends(Console, _super);
    function Console() {
        return _super.call(this, function (message) {
            console.log("Successful", message);
        }, function (message) {
            console.debug("Failure", message);
        }, function (response) {
            console.info("Expirated", response);
        }) || this;
    }
    return Console;
}(Listener_1.Listener));
exports.Console = Console;
