import { Message } from './Message';
import { Listener } from './Listeners/Listener';
import { IQueueHandler } from './Handlers/IQueueHandler';
import { HandlerResponse } from './Handlers/HandlerResponse';
import { IQueueFilter } from './Filters/IQueueFilter';
import { IBackend } from './Backends/IBackend';
export class Queue {
    public name: string;
    public handler: IQueueHandler;
    public listener: Listener;
    private _backend: IBackend;
    private _filters: IQueueFilter[];

    constructor(name: string, queue: IBackend, handler?: IQueueHandler, responseListener?: Listener) {
        this._filters = [];
        this.name = name;
        this._backend = queue;
        this.setHandler((handler != null) ? handler : null);
        this.setListener((responseListener != null) ? responseListener : null);
    }

    public addFilter(filter: IQueueFilter): void {
        let filterExist = false;
        for (let f of this._filters) {
            if (f.getType() === filter.getType()) {
                filterExist = true;
            }
        }
        if (!filterExist) {
            this._filters.push(filter);
        }
    }

    public getFilters(): IQueueFilter[] {
        return this._filters;
    }

    public getMessages(): Message[] {
        return this._backend.getMessages();
    }

    public setHandler(handler: IQueueHandler): void {
        this.handler = handler;
    }

    public setListener(listener: Listener): void {
        this.listener = listener;
    }

    public enqueue(message: Message): void {
        message = Message.load(message);

        if (this._filters.length > 0) {
            for (let filter of this._filters) {
                message = filter.beforeEnqueue(this, message);
            }
        }

        this._backend.enqueue(message);

        if (this._filters.length > 0) {
            for (let filter of this._filters) {
                filter.afterEnqueue(this, message);
            }
        }
    }

    public peek(): Message {
        return Message.load(this._backend.peek());
    }

    public dequeue(): void {
        this._backend.dequeue();
    }

    public count(): number {
        return this._backend.count();
    }

    public clear(): void {
        this._backend.clear();
    }

    public run(): void {
        if (this.count() > 0) {
            let message = this.peek();
            this.dequeue();

            if (this._filters.length > 0) {
                for (let filter of this._filters) {
                    message = filter.beforeRun(this, message);
                }
            }

            if (message !== null) {
                this.handler.handle(this, message);

                if (this._filters.length > 0) {
                    for (let filter of this._filters) {
                        filter.afterRun(this, message);
                    }
                }
            }
        }
    }

    public response(response: HandlerResponse): void {
        response = HandlerResponse.load(response);

        if (this._filters.length > 0) {
            for (let filter of this._filters) {
                response = filter.beforeResponse(this, response);
            }
        }

        if (!response.wasSuccessful) {
            this.listener.failure(response);
        } else {
            this.listener.successful(response);
        }

        if (this._filters.length > 0) {
            for (let filter of this._filters) {
                filter.afterResponse(this, response);
            }
        }
    }
}
