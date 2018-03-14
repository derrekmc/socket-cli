// "use strict";
//
// class SOCKET_EVENT {
//     constructor (name) {
//         this.name = name;
//         return "name";
//     }
//     toString() {
//         return `${this.name}`;
//     }
//     get EventType() {
//         return String("SOCKET_EVENT");//`SOCKET_EVENT.${this.name}`;
//     }
// }

// SOCKET_EVENT.MSG = new SOCKET_EVENT('msg');


module.exports = {
    MSG: "msg",
    MESSAGE: "message",
    REQUEST: "request",
    CLOSE: "close",
    DATA: "data",
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    ERROR: "error",
    END: "end"
};