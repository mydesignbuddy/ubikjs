import { HandlerResponse } from '../Handlers/HandlerResponse';
import { Message } from '../Message';
import { Queue } from '../Queue';
import { IQueueFilter } from './IQueueFilter';

export class QueueFilter implements IQueueFilter {
    beforeEnqueue(queue: Queue, message: Message): Message {
        message = message as Message;
        return message;
    }
    afterEnqueue(queue: Queue, message: Message): void {

    }
    beforeRun(queue: Queue, message: Message): Message {
        message = Message.load(message);
        return message;
    }
    afterRun(queue: Queue, message: Message): void {

    }
    beforeResponse(queue: Queue, response: HandlerResponse): HandlerResponse {
        response = response as HandlerResponse;
        return response;
    }
    afterResponse(queue: Queue, response: HandlerResponse): void {

    }
    getType(): string {
        return (<any>this).constructor.name;
    }
}
