#!/usr/bin/env node
"use strict";
const net = require('net');
global.log = require("./src/lib/logger");

// client.connect('9432', '35.188.0.214',function() {
//     console.log('Connected');
//     client.write('Hello, server! Love, Client.');
// });
process.stdout.write("connecting....");

var client = new net.Socket();
client.connect(9432, '35.188.0.214', function() {
    process.stdout.write("connected");
    client.write('{"name":"derrek"}');
    console.log('{"name":"derrek"}');
    
});



client.on('data', function(data) {
    console.log('Received: ' + data);
    //client.destroy(); // kill client after server's response
    if(IsJsonString(data)){
        log.info(data);
        
        
        let obj = JSON.parse(data);
        
        switch(obj['type']){
            
            case 'heartbeat':
                break;
            
            case 'msg':
                console.log('**************************  ' + obj.type + '  **************************');
                console.log('{"request":"count"}');
                //client.write('{"request":"count"}');
                break;
            
            case 'error':
                console.error('**************************  ' + obj.type + '  **************************');
                break;
            
            default:
        }
    }
    
});

client.on('close', function() {
    console.log('Connection closed');
});

client.on('error', function(err) {
    console.log('error', err);
});
































































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


