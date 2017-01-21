var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("Message", ["require", "exports"], function (require, exports) {
    "use strict";
    var Message = (function () {
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
    exports.Message = Message;
});
define("Handlers/HandlerResponse", ["require", "exports"], function (require, exports) {
    "use strict";
    var HandlerResponse = (function () {
        function HandlerResponse(message, errorMessages, wasSuccessful) {
            this.message = message;
            this.data = errorMessages;
            this.wasSuccessful = wasSuccessful;
        }
        return HandlerResponse;
    }());
    exports.HandlerResponse = HandlerResponse;
});
define("Listeners/Listener", ["require", "exports"], function (require, exports) {
    "use strict";
    var Listener = (function () {
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
    exports.Listener = Listener;
});
define("Handlers/IQueueHandler", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("Filters/IQueueFilter", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("Backends/IBackend", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("Queue", ["require", "exports", "Message"], function (require, exports, Message_1) {
    "use strict";
    var Queue = (function () {
        function Queue(name, queue, handler, responseListener) {
            this._filters = [];
            this.name = name;
            this._backend = queue;
            if (handler !== null) {
                this.setHandler(handler);
            }
            this.setResponseListener((responseListener != null) ? responseListener : null);
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
        Queue.prototype.setResponseListener = function (listener) {
            this.responseListener = listener;
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
            return this._backend.peek();
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
                message = message;
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
            response = response;
            if (this._filters.length > 0) {
                for (var _i = 0, _a = this._filters; _i < _a.length; _i++) {
                    var filter = _a[_i];
                    response = filter.beforeResponse(this, response);
                }
            }
            if (!response.wasSuccessful) {
                this.responseListener.failure(response);
            }
            else {
                this.responseListener.successful(response);
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
    exports.Queue = Queue;
});
define("Listeners/ConsoleListner", ["require", "exports", "Listeners/Listener"], function (require, exports, Listener_1) {
    "use strict";
    var ConsoleListner = (function (_super) {
        __extends(ConsoleListner, _super);
        function ConsoleListner() {
            return _super.call(this, function (message) {
                console.log("Successful", message);
            }, function (message) {
                console.debug("Failure", message);
            }, function (response) {
                console.info("Expirated", response);
            }) || this;
        }
        return ConsoleListner;
    }(Listener_1.Listener));
    exports.ConsoleListner = ConsoleListner;
});
define("Handlers/Handler", ["require", "exports", "Handlers/HandlerResponse"], function (require, exports, HandlerResponse_1) {
    "use strict";
    var Handler = (function () {
        function Handler(funct) {
            this.funct = funct;
        }
        Handler.prototype.handle = function (queue, message) {
            var result = this.funct(message);
            queue.response(new HandlerResponse_1.HandlerResponse(message, result.data, result.wasSuccessful));
        };
        return Handler;
    }());
    exports.Handler = Handler;
});
define("Backends/FilesystemBackend", ["require", "exports"], function (require, exports) {
    "use strict";
    var FilesystemBackend = (function () {
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
    exports.FilesystemBackend = FilesystemBackend;
});
define("Backends/InMemoryBackend", ["require", "exports", "Message"], function (require, exports, Message_2) {
    "use strict";
    var InMemoryBackend = (function () {
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
    exports.InMemoryBackend = InMemoryBackend;
});
define("Backends/LocalStorageBackend", ["require", "exports"], function (require, exports) {
    "use strict";
    var LocalStorageBackend = (function () {
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
    exports.LocalStorageBackend = LocalStorageBackend;
});
define("Backends/SqliteBackend", ["require", "exports"], function (require, exports) {
    "use strict";
    var SqliteBackend = (function () {
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
    exports.SqliteBackend = SqliteBackend;
});
define("Filters/QueueFilter", ["require", "exports", "Message"], function (require, exports, Message_3) {
    "use strict";
    var QueueFilter = (function () {
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
    exports.QueueFilter = QueueFilter;
});
define("Filters/ExpirationFilter", ["require", "exports", "Message", "Filters/QueueFilter"], function (require, exports, Message_4, QueueFilter_1) {
    "use strict";
    var ExpirationFilter = (function (_super) {
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
                        if (queue.responseListener !== null) {
                            queue.responseListener.expired(message);
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
    exports.ExpirationFilter = ExpirationFilter;
});
define("Filters/RetryFilter", ["require", "exports", "Filters/QueueFilter"], function (require, exports, QueueFilter_2) {
    "use strict";
    var RetryFilter = (function (_super) {
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
    exports.RetryFilter = RetryFilter;
});
define("Filters/UUIDFilter", ["require", "exports", "Message", "Filters/QueueFilter"], function (require, exports, Message_5, QueueFilter_3) {
    "use strict";
    var UUIDFilter = (function (_super) {
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
    exports.UUIDFilter = UUIDFilter;
});
define("QueueBuilder", ["require", "exports", "Listeners/ConsoleListner", "Handlers/Handler", "Queue", "Backends/FilesystemBackend", "Backends/InMemoryBackend", "Backends/LocalStorageBackend", "Backends/SqliteBackend", "Filters/ExpirationFilter", "Filters/RetryFilter", "Filters/UUIDFilter"], function (require, exports, ConsoleListner_1, Handler_1, Queue_1, FilesystemBackend_1, InMemoryBackend_1, LocalStorageBackend_1, SqliteBackend_1, ExpirationFilter_1, RetryFilter_1, UUIDFilter_1) {
    "use strict";
    var QueueBuilder = (function () {
        function QueueBuilder(name, backend) {
            this._name = name;
            if (backend !== null) {
                this._backend = backend;
            }
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
        QueueBuilder.prototype.InMemory = function () {
            this._backend = new InMemoryBackend_1.InMemoryBackend();
        };
        QueueBuilder.prototype.Filesystem = function () {
            this._backend = new FilesystemBackend_1.FilesystemBackend();
        };
        QueueBuilder.prototype.LocalStorage = function () {
            this._backend = new LocalStorageBackend_1.LocalStorageBackend();
        };
        QueueBuilder.prototype.Sqlite = function () {
            this._backend = new SqliteBackend_1.SqliteBackend();
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
        QueueBuilder.prototype.supportExpiration = function () {
            this.filter(new ExpirationFilter_1.ExpirationFilter());
            return this;
        };
        QueueBuilder.prototype.supportUUID = function () {
            this.filter(new UUIDFilter_1.UUIDFilter());
            return this;
        };
        QueueBuilder.prototype.debug = function () {
            this._listener = new ConsoleListner_1.ConsoleListner();
            return this;
        };
        QueueBuilder.prototype.listener = function (listener) {
            this._listener = listener;
            return this;
        };
        QueueBuilder.prototype.build = function () {
            if (this._backend !== null) {
                this._queue = new Queue_1.Queue(name, this._backend);
                if (this._handler !== null) {
                    this._queue.setHandler(this._handler);
                    if (this._filters.length > 0) {
                        for (var _i = 0, _a = this._filters; _i < _a.length; _i++) {
                            var filter = _a[_i];
                            this._queue.addFilter(filter);
                        }
                    }
                    if (this._listener !== null) {
                        this._queue.setResponseListener(this._listener);
                    }
                }
                else {
                    throw "You must set a handler";
                }
            }
            else {
                throw "You must set a backend";
            }
            return this._queue;
        };
        return QueueBuilder;
    }());
    exports.QueueBuilder = QueueBuilder;
});
define("Ubik", ["require", "exports", "Message", "Queue", "QueueBuilder", "Backends/FilesystemBackend", "Backends/InMemoryBackend", "Backends/LocalStorageBackend", "Backends/SqliteBackend", "Filters/ExpirationFilter", "Filters/QueueFilter", "Filters/RetryFilter", "Filters/UUIDFilter", "Handlers/Handler", "Handlers/HandlerResponse", "Listeners/Listener", "Listeners/ConsoleListner"], function (require, exports, Message_6, Queue_2, QueueBuilder_1, FilesystemBackend_2, InMemoryBackend_2, LocalStorageBackend_2, SqliteBackend_2, ExpirationFilter_2, QueueFilter_4, RetryFilter_2, UUIDFilter_2, Handler_2, HandlerResponse_2, Listener_2, ConsoleListner_2) {
    "use strict";
    exports.Message = Message_6.Message;
    exports.Queue = Queue_2.Queue;
    exports.QueueBuilder = QueueBuilder_1.QueueBuilder;
    exports.FilesystemBackend = FilesystemBackend_2.FilesystemBackend;
    exports.InMemoryBackend = InMemoryBackend_2.InMemoryBackend;
    exports.LocalStorageBackend = LocalStorageBackend_2.LocalStorageBackend;
    exports.SqliteBackend = SqliteBackend_2.SqliteBackend;
    exports.ExpirationFilter = ExpirationFilter_2.ExpirationFilter;
    exports.QueueFilter = QueueFilter_4.QueueFilter;
    exports.RetryFilter = RetryFilter_2.RetryFilter;
    exports.UUIDFilter = UUIDFilter_2.UUIDFilter;
    exports.Handler = Handler_2.Handler;
    exports.HandlerResponse = HandlerResponse_2.HandlerResponse;
    exports.Listener = Listener_2.Listener;
    exports.ConsoleListner = ConsoleListner_2.ConsoleListner;
});
