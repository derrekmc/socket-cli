"use strict";

class SOCKET_EVENT {
    constructor (name) {
        this.name = name;
    }
    toString() {
        return this.name; //`SOCKET_EVENT.${this.name}`;
    }
    // get EventType() {
    //     return String("SOCKET_EVENT");//`SOCKET_EVENT.${this.name}`;
    // }
}

SOCKET_EVENT.MESSAGE = new SOCKET_EVENT('message');
SOCKET_EVENT.CLOSE = new SOCKET_EVENT('close');
SOCKET_EVENT.DATA = new SOCKET_EVENT('data');
SOCKET_EVENT.CONNECT = new SOCKET_EVENT('connect');
SOCKET_EVENT.DISCONNECT = new SOCKET_EVENT('disconnect');
SOCKET_EVENT.RECONNECT = new SOCKET_EVENT('reconnect_attempt');
SOCKET_EVENT.ERROR = new SOCKET_EVENT('error');
SOCKET_EVENT.EVENT = new SOCKET_EVENT('event');

module.exports = SOCKET_EVENT;