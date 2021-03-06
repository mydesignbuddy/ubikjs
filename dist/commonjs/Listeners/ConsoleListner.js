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
        var _this = _super.call(this, function (message) {
            this.success(message);
        }, function (message) {
            this.error(message);
        }, function (response) {
            this.expired(response);
        }) || this;
        _this.isNode = false;
        if ((typeof process !== 'undefined') && (typeof process.versions.node !== 'undefined')) {
            _this.isNode = true;
        }
        return _this;
    }
    ConsoleListner.prototype.success = function (message) {
        if (this.isNode) {
            console.log("\x1b[32m" + JSON.stringify(message) + "\x1b[0m");
        }
        else {
            console.log(message);
        }
    };
    ConsoleListner.prototype.error = function (message) {
        if (this.isNode) {
            console.log("\x1b[31m" + JSON.stringify(message) + "\x1b[0m");
        }
        else {
            console.debug(message);
        }
    };
    ConsoleListner.prototype.expired = function (response) {
        if (this.isNode) {
            console.log("\x1b[33m" + JSON.stringify(response) + "\x1b[0m");
        }
        else {
            console.info(response);
        }
    };
    return ConsoleListner;
}(Listener_1.Listener));
exports.ConsoleListner = ConsoleListner;
