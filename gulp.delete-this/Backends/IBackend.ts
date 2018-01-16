import { Message } from "../Message";

export interface IBackend {
    count(): number;
    enqueue(message: Message): void;
    peek(): Message;
    dequeue(): void;
    clear(): void;
    getMessages(): Message[];
}
