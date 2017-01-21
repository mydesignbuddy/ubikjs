import { HandlerResponse } from '../Handlers/HandlerResponse';
import { Message } from '../Message';
import { Queue } from '../Queue';

export interface IQueueFilter {
    beforeEnqueue(queue: Queue, message: Message): Message;
    afterEnqueue(queue: Queue, message: Message): void;
    beforeRun(queue: Queue, message: Message): Message;
    afterRun(queue: Queue, message: Message): void;
    beforeResponse(queue: Queue, response: HandlerResponse): HandlerResponse;
    afterResponse(queue: Queue, response: HandlerResponse): void;
    getType(): string;
}