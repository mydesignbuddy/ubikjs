# UbikJS

## Overview

UbikJS is a simple asynchronous, protocol-less, in-process and centralized message queue system for ECMAscript/JavaScript runtime environments (web browsers, Cordova/PhoneGap, NodeJS, etc.).

## Objectives
UbikJS is a simple message queue framework built from the ground up for UI applications or backend programs that just need a simple way to assign, track, and retry on failures. It is **NOT** intended to replace or compete with more robust MQ systems avaliable. UbikJS' design was influenced by MQ systems but does not try to be compatible with any standards.

## Main Features:
* In-Process message queue that doesn't require additional software. No remote protocols for managing messages.
* Asynchronous task processing
* Simple and efficient built-in retries
* Presistent and Non-Presistent queue storage (depends on backend)
* Message Expirations
* Supports multiple storage backends (Currently only in-memory)
  * in-memory ![](https://raw.githubusercontent.com/mydesignbuddy/ubikjs/master/graphics/nodejs-icon.png)![](https://raw.githubusercontent.com/mydesignbuddy/ubikjs/master/graphics/chrome-icon.png)

## When you **SHOULD** use UbikJS:
1. Applications that rely on remote calls and recover from lost network connectivity is required.
1. You just need a simple message queue system with easy retries and you do not want to installing and/or hosting additional software ([RabbitMQ](https://www.rabbitmq.com/), [MSMQ](https://msdn.microsoft.com/en-us/library/ms711472(v=vs.85).aspx), etc.).
1. You want a simple way to persist unworked tasks even when your app shuts down, crashes, sleeps, lost session, etc.

## When you **SHOULD NOT** use UbikJS:
1. You need a more robust and reliable message queue.
1. You want a distributed architecture.
1. You want to use already available industrial standards like [AMQP](https://www.amqp.org/), [MQTT](http://mqtt.org/), or [STOMP](https://stomp.github.io/).
1. You need a Pub/Sub and/or Message Bus like [PostalJS](https://github.com/postaljs/postal.js)

## UbikJS vs. PostalJS: *UbikJS is not a Message Bus*
**UbikJS is simply a Message Queue**. Message Queue contains FIFO (First-In First-Out) rule whereas in Message Bus does not. This is a key difference that makes UbikJS and libraries like PostalJS become good companions not competitors. UbikJS is all about making sure a task gets completed. PostalJS and other similar libraries that provide a message bus focus on delivering messages/events to multiple subscribers. In combination you can have both reliablity of completing task and the distributed delivery of the results.

## Roadmap Items

* Auto-detect offline mode and restart queues when back online
* More storage backends:
    * sessionStorage ![](https://raw.githubusercontent.com/mydesignbuddy/ubikjs/master/graphics/chrome-icon.png)
    * Filesystem ![](https://raw.githubusercontent.com/mydesignbuddy/ubikjs/master/graphics/nodejs-icon.png)
    * SQLite ![](https://raw.githubusercontent.com/mydesignbuddy/ubikjs/master/graphics/nodejs-icon.png)
    * localStorage ![](https://raw.githubusercontent.com/mydesignbuddy/ubikjs/master/graphics/chrome-icon.png)
* Schedule messages
