import { Listener } from './Listeners/Listener';
import { ConsoleListner } from './Listeners/ConsoleListner';
import { IQueueHandler } from './Handlers/IQueueHandler';
import { Handler } from './Handlers/Handler';
import { Queue } from './Queue';
import { IBackend } from './Backends/IBackend';
import { FilesystemBackend } from './Backends/FilesystemBackend';
import { InMemoryBackend } from './Backends/InMemoryBackend';
import { LocalStorageBackend } from './Backends/LocalStorageBackend';
import { SqliteBackend } from './Backends/SqliteBackend';
import { IQueueFilter } from './Filters/IQueueFilter';
import { QueueFilter } from './Filters/QueueFilter';
import { ExpirationFilter } from './Filters/ExpirationFilter';
import { RetryFilter } from './Filters/RetryFilter';
import { UUIDFilter } from './Filters/UUIDFilter';

export class QueueBuilder {
    private _name: string;
    private _backend: IBackend;
    private _handler: IQueueHandler;
    private _queue: Queue;
    private _filters: IQueueFilter[];
    private _listener: Listener;
    constructor(name, backend?: IBackend) {
        this._name = name;
        if (backend !== null) {
            this._backend = backend;
        }
    }

    public handler(handler: IQueueHandler): QueueBuilder {
        let type = (<any>handler).constructor.name;
        if (type === "Handler") {
            this._handler = handler;
        } else if (type === "Function") {
            this._handler = new Handler((<any>handler));
        }
        return this;
    }

    public InMemory() {
        this._backend = new InMemoryBackend();
    }
    public Filesystem() {
        this._backend = new FilesystemBackend();
    }
    public LocalStorage() {
        this._backend = new LocalStorageBackend();
    }
    public Sqlite() {
        this._backend = new SqliteBackend();
    }

    public filter(filter: IQueueFilter): QueueBuilder {
        this._filters.push(filter);
        return this;
    }
    public filters(filters: IQueueFilter[]): QueueBuilder {
        for (let filter of filters) {
            this.filter(filter);
        }
        return this;
    }

    public retries(maxNumberRetries: number): QueueBuilder {
        this.filter(new RetryFilter(maxNumberRetries));
        return this;
    }
    public expiration(): QueueBuilder {
        this.filter(new ExpirationFilter());
        return this;
    }
    public UUID(): QueueBuilder {
        this.filter(new UUIDFilter());
        return this;
    }
    public debug(): QueueBuilder {
        this._listener = new ConsoleListner();
        return this;
    }

    public listener(listener: Listener): QueueBuilder {
        this._listener = listener;
        return this;
    }
    public build(): Queue {
        if (this._backend !== null) {
            this._queue = new Queue(name, this._backend);

            if (this._handler !== null) {
                this._queue.setHandler(this._handler);

                if (this._filters.length > 0) {
                    this.filters(this._filters);
                }

                if (this._listener !== null) {
                    this._queue.setListener(this._listener);
                }
            } else {
                throw "You must set a handler";
            }
        } else {
            throw "You must set a backend";
        }

        return this._queue;
    }
}
