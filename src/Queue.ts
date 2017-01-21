import { Message } from './Message';
import { Listener } from './Listeners/Listener';
import { IQueueHandler } from './Handlers/IQueueHandler';
import { HandlerResponse } from './Handlers/HandlerResponse';
import { IQueueFilter } from './Filters/IQueueFilter';
import { IBackend } from './Backends/IBackend';
export class Queue {
    public name: string;
    public handler: IQueueHandler;
    public responseListener: Listener;
    private _backend: IBackend;
    private _filters: IQueueFilter[];

    constructor(name: string, queue: IBackend, handler?: IQueueHandler, responseListener?: Listener) {
        this._filters = [];
        this.name = name;
        this._backend = queue;
        if (handler !== null) {
            this.setHandler(handler);
        }
        this.setResponseListener((responseListener != null) ? responseListener : null);
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

    public setResponseListener(listener: Listener): void {
        this.responseListener = listener;
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
        return this._backend.peek();
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
            message = message as Message;
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
        response = <HandlerResponse>response;

        if (this._filters.length > 0) {
            for (let filter of this._filters) {
                response = filter.beforeResponse(this, response);
            }
        }

        if (!response.wasSuccessful) {
            this.responseListener.failure(response);
        } else {
            this.responseListener.successful(response);
        }

        if (this._filters.length > 0) {
            for (let filter of this._filters) {
                filter.afterResponse(this, response);
            }
        }
    }
}
