
const net = require('net');
const log = require("../src/lib/logger");
let assert = require('assert');
const SOCKET_EVENT = require('../src/events/SocketEvent');
const MESSAGE_EVENT = require('../src/events/MSGEvent');

describe('of Acceptance Criteria - Your program should demonstrate the following as well as demonstrate good coding practices.', function(test){
    /**
     * (All connection information, and message traffic is logged)
     */
    it('1. Connect and log into the system', function(done){
    
        this.timedOut = 2000;
        log.info("connecting....");
    
        let NetConnection = new net.Socket();
        let EventEmitter = require('events');
    
        class SocketEmitter extends EventEmitter {}
        let socket = new SocketEmitter();
    
        class MessageEmitter extends EventEmitter {}
        let message = new MessageEmitter();
    
        NetConnection.connect(9432, '35.188.0.214', function() {
            socket.emit(SOCKET_EVENT.CONNECT);
        });
    
        NetConnection.on(SOCKET_EVENT.DATA, function(data) {
            // clean up data, events, flow because the server is sending garbage
            data = data.toString();
            let chunks = data.split('\n');
            chunks.forEach(function(chunk, index, list){
                //console.log("chunk",chunk);
                let part = jsonToObject(chunk);
                if(part) socket.emit(SOCKET_EVENT.DATA, part);
            });
        });
    
        NetConnection.on('close', function() {
            log.info('connection closed');
        });
    
        NetConnection.on('error', function(err) {
            log.error('connection error', err);
        });
    
        socket.send = function(content){
            log.info('send', content);
            NetConnection.write(content);
        };
    
        socket.on(SOCKET_EVENT.CONNECT, function() {
            log.info("connected");
            socket.send('{"name":"derrek"}');
        });
    
        socket.on(SOCKET_EVENT.DATA, function (data) {
            log.info(SOCKET_EVENT.DATA + ' Received');
            if(data.type && data.type) message.emit(data.type, data);
        });
    
        message.on(MESSAGE_EVENT.WELCOME, function (data) {
            log.info(MESSAGE_EVENT.WELCOME, data);
            socket.send('{"request":"time"}');
            NetConnection.destroy();
            done();
        });
    
        message.on(MESSAGE_EVENT.TIME, function (data) {
            log.info(MESSAGE_EVENT.TIME, data);
        });
        message.on(MESSAGE_EVENT.HEARTBEAT, function (data) {
            log.info(MESSAGE_EVENT.HEARTBEAT, data);
        });
        message.on(MESSAGE_EVENT.MESSAGE, function (data) {
            log.info(MESSAGE_EVENT.MESSAGE, data);
        });
        message.on(MESSAGE_EVENT.ERROR, function (err) {
            log.error(MESSAGE_EVENT.ERROR, err);
            assert(err);
        });
    
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
    
        process.stdin.on('data', function(data){
            NetConnection.emit(SOCKET_EVENT.DATA)
            //sanitize input
            //check for commands
            //check for json
            //send payload
        });
        
    });
    
    it('2. All messages to be send over the connection will be JSON as a single line. This is a "line delimited" protocol. Do not send linebreaks in your JSON, but explain how you will support them if you are requested to send them. You can be sent more than one message at a time by the server process.', function(done){
        done();
    });
    
    it('3. Most messages will have a type attribute to describe what they are for.', function(done){
        done();
    });
    
    it('4. Your program will need to "log in" by specifying your "name" You will identify your connection by sending a JSON object with a key / value pair of "name" / NAME. Example: { "name" : "foo" }', function(done){
        done();
    });
    
    it('5. Verify and validate input to be sent, and also handle errors sent by the server.', function(done){
        done();
    });
    
    it('6. If the random number sent back from the result of the "time" call is greater than 30, it should print out a message saying so.', function(done){
        done();
    });
    
    it('7. Provide a way to send both the "count" and "time" calls to the worker process and show the results in a nicely formatted way.', function(done){
        done();
        test();
    });
    
    
});





























function jsonToObject(str) {
    let object;
    try {
        object = JSON.parse(str);
    } catch (e) {
        return false;
    }
    return object;
}





function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}







process.on('SIGINT', function () {
    console.info('Got a SIGINT. Goodbye cruel world');
    process.exit(0);
});


