#!/usr/bin/env node
"use strict";

let Client = require('./src/client');
let client = new Client(9432, "35.188.0.214");


//client.connect();

process.stdin.setEncoding('utf8');
process.stdin.resume();
process.stdin.on('data', function(data){
    if(client.login(data)){
        client.onInput(data);
    }
    
});
process.on('SIGINT', function () {
    client.deconstructor();
    process.stdout.write(' goodbye.');
    process.exit(0);
});
