"use strict";

global.log = require("./src/lib/logger");
const pkg = require("./package");
const net = require('net');
const cliv = require('./src/lib/cli-viewer');

//const client = new Client();

const Client = require('./src/client');
const client = new Client(9432, "35.188.0.214");

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(data){
    if(client.login(data)){
        client.onInput(data);
    }
});

process.on('SIGINT', function () {
    client.deconstructor();
    process.exit(0);
});
