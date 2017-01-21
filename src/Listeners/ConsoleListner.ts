import { Listener } from './Listener';
import { Message } from '../Message';
import { HandlerResponse } from '../Handlers/HandlerResponse';

export class ConsoleListner extends Listener {
    constructor() {
        super(function (message: Message) {
            console.log("Successful", message);
        }, function (message: Message) {
            console.debug("Failure", message);
        }, function (response: HandlerResponse) {
            console.info("Expirated", response);
        });
    }
}
