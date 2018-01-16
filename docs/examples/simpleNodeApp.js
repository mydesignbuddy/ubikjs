/**
 * NodeJS example
 */
'use strict';
var ubik = require('../../dist/commonjs/Ubik');
var Message = ubik.Message;

var queue = new ubik.QueueBuilder("notifications")
    .retries(3)     // enable 3x retries
    .expiration()   // enable message expiration
    .UUID()         // enable auto UUID for all messages
    .handler(function (message) { // logic when processing a message
        // example here will randomly fail a message 
        // for demo purposes
        return randomFailure() ? {
            data: null, wasSuccessful: true
        } : {
            data: { errorcode: 500 },
            wasSuccessful: false
        };
    })
    .debug()
    .build();

// add 30 messages to the queue
for (var n = 0; n < 30; n++) {
    queue.enqueue({
        payload: { text: "hello world " + (n + 1) },
        headers: { expirationDate: randomExpire() }
    });
}

// print out number of messages
console.log('Queue count:' + queue.count())

// setup run loop
setInterval(function () {
    queue.run();
}, 1000);



/******** Below are just functions to help with demonstration *********/

// simulate failures
var randomFailure = function () {
    return Math.random() >= 0.1;
};
function randomExpire() {
    if (Math.random() >= 0.1) {
        return oneDayExpire();
    }
    return new Date(0);
}

function oneDayExpire() {
    var dat = new Date();
    dat.setDate(dat.getDate() + 1);
    return dat;
}

console.log('Press any key to exit');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));