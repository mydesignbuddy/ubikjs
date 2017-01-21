import { Message } from '../Message';
import { Queue } from '../Queue';
import { QueueFilter } from './QueueFilter';

export class UUIDFilter extends QueueFilter {
    beforeEnqueue(queue: Queue, message: Message): Message {
        message = Message.load(message);
        if (message.id === null || message.id === "" || message.id === undefined) {
            message.id = this._generateUuid();
        }
        return message;
    }

    private _generateUuid(): string {
        let d = new Date().getTime();
        let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c: string): string => {
            /* tslint:disable */
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
            /* tslint:enable */
        });
        return uuid;
    }
}
