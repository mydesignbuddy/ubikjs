import { Message } from '../Message';
import { IBackend } from './IBackend';

export class SqliteBackend implements IBackend {
    public count(): number {
        return 0;
    }
    public peek(): Message {
        return null;
    }
    public enqueue(message: Message): void {
        throw "enqueue not implemented";
    }
    public dequeue(): void {
        throw "dequeue not implemented";
    }
    public clear(): void {
        throw "clear not implemented";
    }
    public getMessages(): Message[] {
        throw "getMessages not implemented";
    }
}
