"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Listener_1 = require("./Listener");
var ConsoleListner = (function (_super) {
    __extends(ConsoleListner, _super);
    function ConsoleListner() {
        return _super.call(this, function (message) {
            console.log("Successful", message);
        }, function (message) {
            console.debug("Failure", message);
        }, function (response) {
            console.info("Expirated", response);
        }) || this;
    }
    return ConsoleListner;
}(Listener_1.Listener));
exports.ConsoleListner = ConsoleListner;
