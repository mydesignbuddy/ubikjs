import { Message } from '../Message';
import { HandlerResponse } from './HandlerResponse';
import { IQueueHandler } from './IQueueHandler';
import { Queue } from '../Queue';

export class Handler implements IQueueHandler {
    funct: Function;
    constructor(funct: Function) {
        this.funct = funct;
    }
    handle(queue: Queue, message: Message): void {
        let result = HandlerResponse.load(this.funct(message));
        queue.response(new HandlerResponse(message, result.data, result.wasSuccessful));
    }
}
