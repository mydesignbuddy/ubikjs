import { Listener } from './Listeners/Listener';
import { ConsoleListener } from './Listeners/ConsoleListener';
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

    private _successFunct: Function;
    private _failureFunct: Function;
    private _expireFunct: Function;


    constructor(name, backend?: IBackend) {
        this._name = name;
        if (backend !== null) {
            this._backend = backend;
        }
        this._filters = [];
        this._successFunct = () => { };
        this._failureFunct = () => { };
        this._expireFunct = () => { };
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

    public success(funct: Function): QueueBuilder{
        this._successFunct = funct;
        return this;
    }
    public failure(funct: Function): QueueBuilder{
        this._failureFunct = funct;
        return this;
    }
    public expire(funct: Function): QueueBuilder{
        this._expireFunct = funct;
        return this;
    }

    public inMemory() : QueueBuilder {
        this._backend = new InMemoryBackend();
        return this;
    }
    public filesystem() : QueueBuilder {
        this._backend = new FilesystemBackend();
        return this;
    }
    public localStorage() : QueueBuilder {
        this._backend = new LocalStorageBackend();
        return this;
    }
    public sqlite() : QueueBuilder {
        this._backend = new SqliteBackend();
        return this;
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
        this._listener = new ConsoleListener();
        return this;
    }

    public listener(listener: Listener): QueueBuilder {
        this._listener = listener;
        return this;
    }
    public build(): Queue {
        if (this._backend !== null && this._backend !== undefined) {
            this._queue = new Queue(this._name, this._backend);
        } else {
            this._queue = new Queue(this._name, new InMemoryBackend());
        }

        if (this._handler !== null) {
            this._queue.setHandler(this._handler);

            if (this._filters.length > 0) {
                for (let i = 0; i < this._filters.length; i++) {
                    this._queue.addFilter(this._filters[i]);
                }
            }

            if (this._listener !== null) {
                this._queue.setListener(this._listener);
            } else {
                this._queue.setListener(new Listener(this._successFunct, this._failureFunct, this._expireFunct));
            }
        } else {
            throw "You must set a handler";
        }

        return this._queue;
    }
}
