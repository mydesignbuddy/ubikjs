import { Message } from '../Message';
import { IBackend } from './IBackend';

export class InMemoryBackend implements IBackend {
    private _messages: Message[];

    constructor() {
        this._messages = [];
    }

    public count(): number {
        return this._messages.length;
    }

    public enqueue(message: Message): void {
        this._messages.push(message);
    }
    public peek(): Message {
        if (this._messages.length > 0) {
            let message = Message.load(this._messages[0]);
            return message;
        }
        return null;
    }
    public dequeue(): void {
        if (this._messages.length > 0) {
            this._messages.shift();
        }
    }
    public clear(): void {
        this._messages = [];
    }

    public getMessages(): Message[] {
        return this._messages;
    }
}
