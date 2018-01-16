import { Listener } from './Listener';
import { Message } from '../Message';
import { HandlerResponse } from '../Handlers/HandlerResponse';

export class ConsoleListener extends Listener {
    isNode: boolean = false;
    constructor() {
        super(function (message: Message) {
            this.success(message);
        }, function (message: Message) {
            this.error(message);
        }, function (response: HandlerResponse) {
            this.expired(response);
        });
        if ((typeof process !== 'undefined') && (typeof process.versions.node !== 'undefined')) {
            this.isNode = true;
        }
    }

    success(message) {
        if (this.isNode) {
            console.log("\x1b[32m" + JSON.stringify(message) + "\x1b[0m");
        } else {
            console.log(message);
        }
    }
    error(message) {
        if (this.isNode) {
            console.log("\x1b[31m" + JSON.stringify(message) + "\x1b[0m");
        } else {
            console.debug(message);
        }
    }
    expired(response) {
        if (this.isNode) {
            console.log("\x1b[33m" + JSON.stringify(response) + "\x1b[0m");
        } else {
            console.info(response);
        }
    }
}
