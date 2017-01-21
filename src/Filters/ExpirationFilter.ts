import { Message } from '../Message';
import { Queue } from '../Queue';
import { QueueFilter } from './QueueFilter';

export class ExpirationFilter extends QueueFilter {
    beforeRun(queue: Queue, message: Message): Message {
        message = Message.load(message);
        var expiration = message.getHeader("expirationDate");
        if (expiration !== null) {
            if (expiration instanceof Date) {
                if (expiration <= new Date()) {
                    if (queue.responseListener !== null) {
                        queue.responseListener.expired(message);
                    }
                    return null;
                } else {
                    return message;
                }
            } else {
                return message;
            }
        } else {
            return message;
        }
    }
}
