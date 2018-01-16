var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
System.register("Message", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Message;
    return {
        setters: [],
        execute: function () {
            Message = (function () {
                function Message(payload, headers) {
                    var _this = this;
                    this.setHeader = function (name, value) {
                        _this.headers[name] = value;
                    };
                    this.payload = payload;
                    this.headers = {};
                    if (headers !== undefined && headers !== null) {
                        for (var headerKey in headers) {
                            this.setHeader(headerKey, headers[headerKey]);
                        }
                    }
                }
                Message.prototype.getHeader = function (name) {
                    if (this.headers[name] !== undefined) {
                        return this.headers[name];
                    }
                    return null;
                };
                Message.load = function (message) {
                    if (message !== null) {
                        var newMessage = new Message(message.payload, message.headers);
                        if (message.id !== undefined) {
                            newMessage.id = message.id;
                        }
                        return newMessage;
                    }
                    return null;
                };
                return Message;
            }());
            exports_1("Message", Message);
        }
    };
});
System.register("Handlers/HandlerResponse", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var HandlerResponse;
    return {
        setters: [],
        execute: function () {
            HandlerResponse = (function () {
                function HandlerResponse(message, errorMessages, wasSuccessful) {
                    this.message = message;
                    this.data = errorMessages;
                    this.wasSuccessful = wasSuccessful;
                }
                HandlerResponse.load = function (obj) {
                    var message = null;
                    var data = null;
                    var wasSuccessful = false;
                    if (obj.message !== undefined) {
                        message = obj.message;
                    }
                    if (obj.data !== undefined) {
                        data = obj.data;
                    }
                    if (obj.wasSuccessful !== undefined) {
                        wasSuccessful = obj.wasSuccessful;
                    }
                    return new HandlerResponse(message, data, wasSuccessful);
                };
                return HandlerResponse;
            }());
            exports_2("HandlerResponse", HandlerResponse);
        }
    };
});
System.register("Listeners/Listener", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var Listener;
    return {
        setters: [],
        execute: function () {
            Listener = (function () {
                function Listener(successfulFunction, failureFunction, expiredFunction) {
                    this._successfulFunction = successfulFunction;
                    this._failureFunction = failureFunction;
                    this._expiredFunction = expiredFunction;
                }
                Listener.prototype.successful = function (response) {
                    this._successfulFunction(response);
                };
                Listener.prototype.failure = function (response) {
                    this._failureFunction(response);
                };
                Listener.prototype.expired = function (message) {
                    this._expiredFunction(message);
                };
                return Listener;
            }());
            exports_3("Listener", Listener);
        }
    };
});
System.register("Handlers/IQueueHandler", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Filters/IQueueFilter", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Backends/IBackend", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Queue", ["Message", "Handlers/HandlerResponse"], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var Message_1, HandlerResponse_1, Queue;
    return {
        setters: [
            function (Message_1_1) {
                Message_1 = Message_1_1;
            },
            function (HandlerResponse_1_1) {
                HandlerResponse_1 = HandlerResponse_1_1;
            }
        ],
        execute: function () {
            Queue = (function () {
                function Queue(name, queue, handler, responseListener) {
                    this._filters = [];
                    this.name = name;
                    this._backend = queue;
                    this.setHandler((handler != null) ? handler : null);
                    this.setListener((responseListener != null) ? responseListener : null);
                }
                Queue.prototype.addFilter = function (filter) {
                    var filterExist = false;
                    for (var _i = 0, _a = this._filters; _i < _a.length; _i++) {
                        var f = _a[_i];
                        if (f.getType() === filter.getType()) {
                            filterExist = true;
                        }
                    }
                    if (!filterExist) {
                        this._filters.push(filter);
                    }
                };
                Queue.prototype.getFilters = function () {
                    return this._filters;
                };
                Queue.prototype.getMessages = function () {
                    return this._backend.getMessages();
                };
                Queue.prototype.setHandler = function (handler) {
                    this.handler = handler;
                };
                Queue.prototype.setListener = function (listener) {
                    this.listener = listener;
                };
                Queue.prototype.enqueue = function (message) {
                    message = Message_1.Message.load(message);
                    if (this._filters.length > 0) {
                        for (var _i = 0, _a = this._filters; _i < _a.length; _i++) {
                            var filter = _a[_i];
                            message = filter.beforeEnqueue(this, message);
                        }
                    }
                    this._backend.enqueue(message);
                    if (this._filters.length > 0) {
                        for (var _b = 0, _c = this._filters; _b < _c.length; _b++) {
                            var filter = _c[_b];
                            filter.afterEnqueue(this, message);
                        }
                    }
                };
                Queue.prototype.peek = function () {
                    return Message_1.Message.load(this._backend.peek());
                };
                Queue.prototype.dequeue = function () {
                    this._backend.dequeue();
                };
                Queue.prototype.count = function () {
                    return this._backend.count();
                };
                Queue.prototype.clear = function () {
                    this._backend.clear();
                };
                Queue.prototype.run = function () {
                    if (this.count() > 0) {
                        var message = this.peek();
                        this.dequeue();
                        if (this._filters.length > 0) {
                            for (var _i = 0, _a = this._filters; _i < _a.length; _i++) {
                                var filter = _a[_i];
                                message = filter.beforeRun(this, message);
                            }
                        }
                        if (message !== null) {
                            this.handler.handle(this, message);
                            if (this._filters.length > 0) {
                                for (var _b = 0, _c = this._filters; _b < _c.length; _b++) {
                                    var filter = _c[_b];
                                    filter.afterRun(this, message);
                                }
                            }
                        }
                    }
                };
                Queue.prototype.response = function (response) {
                    response = HandlerResponse_1.HandlerResponse.load(response);
                    if (this._filters.length > 0) {
                        for (var _i = 0, _a = this._filters; _i < _a.length; _i++) {
                            var filter = _a[_i];
                            response = filter.beforeResponse(this, response);
                        }
                    }
                    if (!response.wasSuccessful) {
                        this.listener.failure(response);
                    }
                    else {
                        this.listener.successful(response);
                    }
                    if (this._filters.length > 0) {
                        for (var _b = 0, _c = this._filters; _b < _c.length; _b++) {
                            var filter = _c[_b];
                            filter.afterResponse(this, response);
                        }
                    }
                };
                return Queue;
            }());
            exports_7("Queue", Queue);
        }
    };
});
System.register("Listeners/ConsoleListener", ["Listeners/Listener"], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var Listener_1, ConsoleListener;
    return {
        setters: [
            function (Listener_1_1) {
                Listener_1 = Listener_1_1;
            }
        ],
        execute: function () {
            ConsoleListener = (function (_super) {
                __extends(ConsoleListener, _super);
                function ConsoleListener() {
                    var _this = _super.call(this, function (message) {
                        this.success(message);
                    }, function (message) {
                        this.error(message);
                    }, function (response) {
                        this.expired(response);
                    }) || this;
                    _this.isNode = false;
                    if ((typeof process !== 'undefined') && (typeof process.versions.node !== 'undefined')) {
                        _this.isNode = true;
                    }
                    return _this;
                }
                ConsoleListener.prototype.success = function (message) {
                    if (this.isNode) {
                        console.log("\x1b[32m" + JSON.stringify(message) + "\x1b[0m");
                    }
                    else {
                        console.log(message);
                    }
                };
                ConsoleListener.prototype.error = function (message) {
                    if (this.isNode) {
                        console.log("\x1b[31m" + JSON.stringify(message) + "\x1b[0m");
                    }
                    else {
                        console.debug(message);
                    }
                };
                ConsoleListener.prototype.expired = function (response) {
                    if (this.isNode) {
                        console.log("\x1b[33m" + JSON.stringify(response) + "\x1b[0m");
                    }
                    else {
                        console.info(response);
                    }
                };
                return ConsoleListener;
            }(Listener_1.Listener));
            exports_8("ConsoleListener", ConsoleListener);
        }
    };
});
System.register("Handlers/Handler", ["Handlers/HandlerResponse"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var HandlerResponse_2, Handler;
    return {
        setters: [
            function (HandlerResponse_2_1) {
                HandlerResponse_2 = HandlerResponse_2_1;
            }
        ],
        execute: function () {
            Handler = (function () {
                function Handler(funct) {
                    this.funct = funct;
                }
                Handler.prototype.handle = function (queue, message) {
                    var result = HandlerResponse_2.HandlerResponse.load(this.funct(message));
                    queue.response(new HandlerResponse_2.HandlerResponse(message, result.data, result.wasSuccessful));
                };
                return Handler;
            }());
            exports_9("Handler", Handler);
        }
    };
});
System.register("Backends/FilesystemBackend", [], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var FilesystemBackend;
    return {
        setters: [],
        execute: function () {
            FilesystemBackend = (function () {
                function FilesystemBackend() {
                }
                FilesystemBackend.prototype.count = function () {
                    return 0;
                };
                FilesystemBackend.prototype.peek = function () {
                    return null;
                };
                FilesystemBackend.prototype.enqueue = function (message) {
                    throw "enqueue not implemented";
                };
                FilesystemBackend.prototype.dequeue = function () {
                    throw "dequeue not implemented";
                };
                FilesystemBackend.prototype.clear = function () {
                    throw "clear not implemented";
                };
                FilesystemBackend.prototype.getMessages = function () {
                    throw "getMessages not implemented";
                };
                return FilesystemBackend;
            }());
            exports_10("FilesystemBackend", FilesystemBackend);
        }
    };
});
System.register("Backends/InMemoryBackend", ["Message"], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var Message_2, InMemoryBackend;
    return {
        setters: [
            function (Message_2_1) {
                Message_2 = Message_2_1;
            }
        ],
        execute: function () {
            InMemoryBackend = (function () {
                function InMemoryBackend() {
                    this._messages = [];
                }
                InMemoryBackend.prototype.count = function () {
                    return this._messages.length;
                };
                InMemoryBackend.prototype.enqueue = function (message) {
                    this._messages.push(message);
                };
                InMemoryBackend.prototype.peek = function () {
                    if (this._messages.length > 0) {
                        var message = Message_2.Message.load(this._messages[0]);
                        return message;
                    }
                    return null;
                };
                InMemoryBackend.prototype.dequeue = function () {
                    if (this._messages.length > 0) {
                        this._messages.shift();
                    }
                };
                InMemoryBackend.prototype.clear = function () {
                    this._messages = [];
                };
                InMemoryBackend.prototype.getMessages = function () {
                    return this._messages;
                };
                return InMemoryBackend;
            }());
            exports_11("InMemoryBackend", InMemoryBackend);
        }
    };
});
System.register("Backends/LocalStorageBackend", [], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var LocalStorageBackend;
    return {
        setters: [],
        execute: function () {
            LocalStorageBackend = (function () {
                function LocalStorageBackend() {
                }
                LocalStorageBackend.prototype.count = function () {
                    return 0;
                };
                LocalStorageBackend.prototype.peek = function () {
                    return null;
                };
                LocalStorageBackend.prototype.enqueue = function (message) {
                    throw "enqueue not implemented";
                };
                LocalStorageBackend.prototype.dequeue = function () {
                    throw "dequeue not implemented";
                };
                LocalStorageBackend.prototype.clear = function () {
                    throw "clear not implemented";
                };
                LocalStorageBackend.prototype.getMessages = function () {
                    throw "getMessages not implemented";
                };
                return LocalStorageBackend;
            }());
            exports_12("LocalStorageBackend", LocalStorageBackend);
        }
    };
});
System.register("Backends/SqliteBackend", [], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var SqliteBackend;
    return {
        setters: [],
        execute: function () {
            SqliteBackend = (function () {
                function SqliteBackend() {
                }
                SqliteBackend.prototype.count = function () {
                    return 0;
                };
                SqliteBackend.prototype.peek = function () {
                    return null;
                };
                SqliteBackend.prototype.enqueue = function (message) {
                    throw "enqueue not implemented";
                };
                SqliteBackend.prototype.dequeue = function () {
                    throw "dequeue not implemented";
                };
                SqliteBackend.prototype.clear = function () {
                    throw "clear not implemented";
                };
                SqliteBackend.prototype.getMessages = function () {
                    throw "getMessages not implemented";
                };
                return SqliteBackend;
            }());
            exports_13("SqliteBackend", SqliteBackend);
        }
    };
});
System.register("Filters/QueueFilter", ["Message"], function (exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var Message_3, QueueFilter;
    return {
        setters: [
            function (Message_3_1) {
                Message_3 = Message_3_1;
            }
        ],
        execute: function () {
            QueueFilter = (function () {
                function QueueFilter() {
                }
                QueueFilter.prototype.beforeEnqueue = function (queue, message) {
                    message = message;
                    return message;
                };
                QueueFilter.prototype.afterEnqueue = function (queue, message) {
                };
                QueueFilter.prototype.beforeRun = function (queue, message) {
                    message = Message_3.Message.load(message);
                    return message;
                };
                QueueFilter.prototype.afterRun = function (queue, message) {
                };
                QueueFilter.prototype.beforeResponse = function (queue, response) {
                    response = response;
                    return response;
                };
                QueueFilter.prototype.afterResponse = function (queue, response) {
                };
                QueueFilter.prototype.getType = function () {
                    return this.constructor.name;
                };
                return QueueFilter;
            }());
            exports_14("QueueFilter", QueueFilter);
        }
    };
});
System.register("Filters/ExpirationFilter", ["Message", "Filters/QueueFilter"], function (exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var Message_4, QueueFilter_1, ExpirationFilter;
    return {
        setters: [
            function (Message_4_1) {
                Message_4 = Message_4_1;
            },
            function (QueueFilter_1_1) {
                QueueFilter_1 = QueueFilter_1_1;
            }
        ],
        execute: function () {
            ExpirationFilter = (function (_super) {
                __extends(ExpirationFilter, _super);
                function ExpirationFilter() {
                    return _super.apply(this, arguments) || this;
                }
                ExpirationFilter.prototype.beforeRun = function (queue, message) {
                    message = Message_4.Message.load(message);
                    var expiration = message.getHeader("expirationDate");
                    if (expiration !== null) {
                        if (expiration instanceof Date) {
                            if (expiration <= new Date()) {
                                if (queue.listener !== null) {
                                    queue.listener.expired(message);
                                }
                                return null;
                            }
                            else {
                                return message;
                            }
                        }
                        else {
                            return message;
                        }
                    }
                    else {
                        return message;
                    }
                };
                return ExpirationFilter;
            }(QueueFilter_1.QueueFilter));
            exports_15("ExpirationFilter", ExpirationFilter);
        }
    };
});
System.register("Filters/RetryFilter", ["Filters/QueueFilter"], function (exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var QueueFilter_2, RetryFilter;
    return {
        setters: [
            function (QueueFilter_2_1) {
                QueueFilter_2 = QueueFilter_2_1;
            }
        ],
        execute: function () {
            RetryFilter = (function (_super) {
                __extends(RetryFilter, _super);
                function RetryFilter(maxRetryAttempts) {
                    var _this = _super.call(this) || this;
                    _this.maxRetryAttempts = maxRetryAttempts ? maxRetryAttempts : 3;
                    return _this;
                }
                RetryFilter.prototype.beforeResponse = function (queue, response) {
                    response = response;
                    if (!response.wasSuccessful) {
                        var retries = response.message.getHeader("retries");
                        if (retries < this.maxRetryAttempts) {
                            retries++;
                            response.message.setHeader("retries", retries);
                            queue.enqueue(response.message);
                        }
                    }
                    return response;
                };
                return RetryFilter;
            }(QueueFilter_2.QueueFilter));
            exports_16("RetryFilter", RetryFilter);
        }
    };
});
System.register("Filters/UUIDFilter", ["Message", "Filters/QueueFilter"], function (exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var Message_5, QueueFilter_3, UUIDFilter;
    return {
        setters: [
            function (Message_5_1) {
                Message_5 = Message_5_1;
            },
            function (QueueFilter_3_1) {
                QueueFilter_3 = QueueFilter_3_1;
            }
        ],
        execute: function () {
            UUIDFilter = (function (_super) {
                __extends(UUIDFilter, _super);
                function UUIDFilter() {
                    return _super.apply(this, arguments) || this;
                }
                UUIDFilter.prototype.beforeEnqueue = function (queue, message) {
                    message = Message_5.Message.load(message);
                    if (message.id === null || message.id === "" || message.id === undefined) {
                        message.id = this._generateUuid();
                    }
                    return message;
                };
                UUIDFilter.prototype._generateUuid = function () {
                    var d = new Date().getTime();
                    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                        /* tslint:disable */
                        var r = (d + Math.random() * 16) % 16 | 0;
                        d = Math.floor(d / 16);
                        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
                        /* tslint:enable */
                    });
                    return uuid;
                };
                return UUIDFilter;
            }(QueueFilter_3.QueueFilter));
            exports_17("UUIDFilter", UUIDFilter);
        }
    };
});
System.register("QueueBuilder", ["Listeners/Listener", "Listeners/ConsoleListener", "Handlers/Handler", "Queue", "Backends/FilesystemBackend", "Backends/InMemoryBackend", "Backends/LocalStorageBackend", "Backends/SqliteBackend", "Filters/ExpirationFilter", "Filters/RetryFilter", "Filters/UUIDFilter"], function (exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var Listener_2, ConsoleListener_1, Handler_1, Queue_1, FilesystemBackend_1, InMemoryBackend_1, LocalStorageBackend_1, SqliteBackend_1, ExpirationFilter_1, RetryFilter_1, UUIDFilter_1, QueueBuilder;
    return {
        setters: [
            function (Listener_2_1) {
                Listener_2 = Listener_2_1;
            },
            function (ConsoleListener_1_1) {
                ConsoleListener_1 = ConsoleListener_1_1;
            },
            function (Handler_1_1) {
                Handler_1 = Handler_1_1;
            },
            function (Queue_1_1) {
                Queue_1 = Queue_1_1;
            },
            function (FilesystemBackend_1_1) {
                FilesystemBackend_1 = FilesystemBackend_1_1;
            },
            function (InMemoryBackend_1_1) {
                InMemoryBackend_1 = InMemoryBackend_1_1;
            },
            function (LocalStorageBackend_1_1) {
                LocalStorageBackend_1 = LocalStorageBackend_1_1;
            },
            function (SqliteBackend_1_1) {
                SqliteBackend_1 = SqliteBackend_1_1;
            },
            function (ExpirationFilter_1_1) {
                ExpirationFilter_1 = ExpirationFilter_1_1;
            },
            function (RetryFilter_1_1) {
                RetryFilter_1 = RetryFilter_1_1;
            },
            function (UUIDFilter_1_1) {
                UUIDFilter_1 = UUIDFilter_1_1;
            }
        ],
        execute: function () {
            QueueBuilder = (function () {
                function QueueBuilder(name, backend) {
                    this._name = name;
                    if (backend !== null) {
                        this._backend = backend;
                    }
                    this._filters = [];
                    this._successFunct = function () { };
                    this._failureFunct = function () { };
                    this._expireFunct = function () { };
                }
                QueueBuilder.prototype.handler = function (handler) {
                    var type = handler.constructor.name;
                    if (type === "Handler") {
                        this._handler = handler;
                    }
                    else if (type === "Function") {
                        this._handler = new Handler_1.Handler(handler);
                    }
                    return this;
                };
                QueueBuilder.prototype.success = function (funct) {
                    this._successFunct = funct;
                    return this;
                };
                QueueBuilder.prototype.failure = function (funct) {
                    this._failureFunct = funct;
                    return this;
                };
                QueueBuilder.prototype.expire = function (funct) {
                    this._expireFunct = funct;
                    return this;
                };
                QueueBuilder.prototype.inMemory = function () {
                    this._backend = new InMemoryBackend_1.InMemoryBackend();
                    return this;
                };
                QueueBuilder.prototype.filesystem = function () {
                    this._backend = new FilesystemBackend_1.FilesystemBackend();
                    return this;
                };
                QueueBuilder.prototype.localStorage = function () {
                    this._backend = new LocalStorageBackend_1.LocalStorageBackend();
                    return this;
                };
                QueueBuilder.prototype.sqlite = function () {
                    this._backend = new SqliteBackend_1.SqliteBackend();
                    return this;
                };
                QueueBuilder.prototype.filter = function (filter) {
                    this._filters.push(filter);
                    return this;
                };
                QueueBuilder.prototype.filters = function (filters) {
                    for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
                        var filter = filters_1[_i];
                        this.filter(filter);
                    }
                    return this;
                };
                QueueBuilder.prototype.retries = function (maxNumberRetries) {
                    this.filter(new RetryFilter_1.RetryFilter(maxNumberRetries));
                    return this;
                };
                QueueBuilder.prototype.expiration = function () {
                    this.filter(new ExpirationFilter_1.ExpirationFilter());
                    return this;
                };
                QueueBuilder.prototype.UUID = function () {
                    this.filter(new UUIDFilter_1.UUIDFilter());
                    return this;
                };
                QueueBuilder.prototype.debug = function () {
                    this._listener = new ConsoleListener_1.ConsoleListener();
                    return this;
                };
                QueueBuilder.prototype.listener = function (listener) {
                    this._listener = listener;
                    return this;
                };
                QueueBuilder.prototype.build = function () {
                    if (this._backend !== null && this._backend !== undefined) {
                        this._queue = new Queue_1.Queue(this._name, this._backend);
                    }
                    else {
                        this._queue = new Queue_1.Queue(this._name, new InMemoryBackend_1.InMemoryBackend());
                    }
                    if (this._handler !== null) {
                        this._queue.setHandler(this._handler);
                        if (this._filters.length > 0) {
                            for (var i = 0; i < this._filters.length; i++) {
                                this._queue.addFilter(this._filters[i]);
                            }
                        }
                        if (this._listener !== null && this._listener !== undefined) {
                            this._queue.setListener(this._listener);
                        }
                        else {
                            this._queue.setListener(new Listener_2.Listener(this._successFunct, this._failureFunct, this._expireFunct));
                        }
                    }
                    else {
                        throw "You must set a handler";
                    }
                    return this._queue;
                };
                return QueueBuilder;
            }());
            exports_18("QueueBuilder", QueueBuilder);
        }
    };
});
System.register("Ubik", ["Message", "Queue", "QueueBuilder", "Backends/FilesystemBackend", "Backends/InMemoryBackend", "Backends/LocalStorageBackend", "Backends/SqliteBackend", "Filters/ExpirationFilter", "Filters/QueueFilter", "Filters/RetryFilter", "Filters/UUIDFilter", "Handlers/Handler", "Handlers/HandlerResponse", "Listeners/Listener", "Listeners/ConsoleListener"], function (exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [
            function (Message_6_1) {
                exports_19({
                    "Message": Message_6_1["Message"]
                });
            },
            function (Queue_2_1) {
                exports_19({
                    "Queue": Queue_2_1["Queue"]
                });
            },
            function (QueueBuilder_1_1) {
                exports_19({
                    "QueueBuilder": QueueBuilder_1_1["QueueBuilder"]
                });
            },
            function (FilesystemBackend_2_1) {
                exports_19({
                    "FilesystemBackend": FilesystemBackend_2_1["FilesystemBackend"]
                });
            },
            function (InMemoryBackend_2_1) {
                exports_19({
                    "InMemoryBackend": InMemoryBackend_2_1["InMemoryBackend"]
                });
            },
            function (LocalStorageBackend_2_1) {
                exports_19({
                    "LocalStorageBackend": LocalStorageBackend_2_1["LocalStorageBackend"]
                });
            },
            function (SqliteBackend_2_1) {
                exports_19({
                    "SqliteBackend": SqliteBackend_2_1["SqliteBackend"]
                });
            },
            function (ExpirationFilter_2_1) {
                exports_19({
                    "ExpirationFilter": ExpirationFilter_2_1["ExpirationFilter"]
                });
            },
            function (QueueFilter_4_1) {
                exports_19({
                    "QueueFilter": QueueFilter_4_1["QueueFilter"]
                });
            },
            function (RetryFilter_2_1) {
                exports_19({
                    "RetryFilter": RetryFilter_2_1["RetryFilter"]
                });
            },
            function (UUIDFilter_2_1) {
                exports_19({
                    "UUIDFilter": UUIDFilter_2_1["UUIDFilter"]
                });
            },
            function (Handler_2_1) {
                exports_19({
                    "Handler": Handler_2_1["Handler"]
                });
            },
            function (HandlerResponse_3_1) {
                exports_19({
                    "HandlerResponse": HandlerResponse_3_1["HandlerResponse"]
                });
            },
            function (Listener_3_1) {
                exports_19({
                    "Listener": Listener_3_1["Listener"]
                });
            },
            function (ConsoleListener_2_1) {
                exports_19({
                    "ConsoleListener": ConsoleListener_2_1["ConsoleListener"]
                });
            }
        ],
        execute: function () {
        }
    };
});
