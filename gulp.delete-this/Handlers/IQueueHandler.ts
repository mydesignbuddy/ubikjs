import { Message } from "../Message";
import { Queue } from "../Queue";

export interface IQueueHandler {
    handle(queue: Queue, message: Message): void;
}