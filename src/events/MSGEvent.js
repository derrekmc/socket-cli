module.exports = {
    HEARTBEAT: "heartbeat",
    MESSAGE: "msg",
    REQUEST: "request",
    WELCOME: "welcome",
    TIME: "time",
    COUNT: "count",
    REPLY: "reply",
    DATE: "date",
    ERROR: "error"
};
//
// "use strict";
//
// class MESSAGE_EVENT {
//     constructor (name) {
//         this.name = name;
//         return "name";
//     }
//     toString() {
//         return String(this.name);
//     }
//     get EventType() {
//         return `MESSAGE_EVENT.${this.name}`;
//     }
// }
//
// MESSAGE_EVENT.HEARTBEAT = new MESSAGE_EVENT("heartbeat");
// MESSAGE_EVENT.MESSAGE = new MESSAGE_EVENT("msg");
// MESSAGE_EVENT.TIME = new MESSAGE_EVENT("time");
// MESSAGE_EVENT.COUNT = new MESSAGE_EVENT("count");
// MESSAGE_EVENT.WELCOME = new MESSAGE_EVENT("welcome");
//
// module.exports = {
//     PREFIX: "",
//     HEARTBEAT: this.PREFIX + "heartbeat",
//     MESSAGE: this.PREFIX + "msg",
//     REQUEST: this.PREFIX + "request",
//     WELCOME: this.PREFIX + "welcome",
//     TIME: this.PREFIX + "time",
//     COUNT: this.PREFIX + "count",
//     REPLY: this.PREFIX + "reply",
//     DATE: this.PREFIX + "date",
//     ERROR: this.PREFIX + "error"
// };