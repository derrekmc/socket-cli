#!/usr/bin/env node
"use strict";

const encoding = 'utf-8';

let io = require('socket.io-client');

let data,err,socket,connectionTimeout;

const remote = {
    host: "http://localhost:1337"
};



// process.argv.forEach((val, index) => {
//     // console.log(`${index}: ${val}`);
//
//     let val.replace("=","-").split("-");
//
//     console.log(val);
//     if(val.indexOf("-" ) != -1){
//         console.log("command:", val);
//     }
// });

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.on("SIGPIPE", process.exit);

process.stdin.on('data', function(data) {
    console.log("data", data);
});

console.log("Attempting to connect to host", remote.host);



socket = io.connect(remote.host);

connectionTimeout = setTimeout(function(){
    console.log("Connection timed out");
}, 8000);


socket.on('connect', function(){
    console.log("Connection successful");
    console.log("socket.send:",process.argv[2],"to",remote.host);
    // check if process.argv[2] is valid json
    
    socket.send(process.argv[2]);
    clearTimeout(connectionTimeout);
});

socket.on('message', function(message){
    if(message && message.hasOwnProperty("type")){
        console.log("message::" + message.type + ":", message);
    }else{
        console.log("message::unknown:", message);
    }
    
});

socket.on('event', console.log);

socket.on('disconnect', console.error);


process.stdin.resume();

process.on('SIGINT', function () {
    socket.disconnect();
    console.log('SIGINT. Program terminated.');
    process.exit(0);
});

// if (err) {
//     process.exit(1);
// } else {
//     process.exit(0);
// }