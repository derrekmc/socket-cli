"use strict";

class LOG_LVL {
    constructor (name) {
        this.name = name;
    }
    toString() {
        return `LOG_LVL.${this.name}`;
    }
}

LOG_LVL.ERROR = new LOG('error');
LOG_LVL.INFO = new LOG('info');

module.exports = LOG_LVL;