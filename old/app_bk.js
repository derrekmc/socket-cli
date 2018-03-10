#!/usr/bin/env node
"use strict";


let io = require('socket.io-client');

let data,err,socket,connectionTimeout;

const remote = {
    host: "http://35.188.0.214:9432"
};

socket = io.connect(remote.host);

//var Query = socket.handshake.query;

connectionTimeout = setTimeout(function(){
    console.log("timed out");
}, 8000);

socket.on('connect', function(){
    
    clearTimeout(connectionTimeout);
    console.log("successful");
    console.log("");
    
//    process.stdout.write('\033c');
    
    console.log("Welcome stranger. I am sam. Sam-I-am!");
    console.log("");
    process.stdout.write("What is your name? ");
    
    var payLoad = {"name":"derrek"};
    //JSON.stringify(payLoad);
    socket.send(payLoad);

});



socket.on('connect_error', () => {
    console.log("connect_error" );
    console.log("connect_error" );
    console.log("connect_error" );
    console.log("connect_error" );
    
    var payLoad = {"name":"derrek"};
    //JSON.stringify(payLoad);
    socket.send(payLoad);
    socket.io.opts.transports = ['polling', 'websocket'];
});


socket.on('reconnect_attempt', () => {
    console.log("reconnect_attempt" );
    console.log("reconnect_attempt" );
    console.log("reconnect_attempt" );
    console.log("reconnect_attempt" );
    var payLoad = {"name":"derrek"};
        //JSON.stringify(payLoad);
    socket.send(payLoad);
    socket.io.opts.transports = ['polling', 'websocket'];
});

socket.on('message', function(message){
    console.log("MESSAGE RECEIVED: " + message);
    if(user.login(message)){
        process.stdout.write("receiving: " + message);
    }
    if(message && message.hasOwnProperty("type")){
        console.log("message:" + message.type, message);
    }else{
        console.log("message:unknown", message);
    }
    
});

socket.on('event', console.log);

socket.on('disconnect', console.error);
socket.on('close',  function(err){
    console.error("********************************",err);
});

socket.on('disconnect', function(err){
    console.error(err);
});

socket.on('error', function(err){
    console.error("$$$$$$$$$$$$$$$$$$$$$",err);
});


class client {
    
    constructor(){
        this.loggedIn = false;
        this.name = null;
        
        // connect
        // authenticate
        // addListeners
    }
    
    policy(fn, cb){
    
    }
    
    clear(){
        return process.stdout.write(question + " ");
    }
    
    prompt(question, answer){
        return process.stdout.write(question + " ");
    }
    
    send(){
    
    }
    
    login(){
    
    }
    
    connect(){
    
    }
    
    reconnect(){
    
    }
    
    disconnect(){
    
    }
    
    login(name){
        if(!name || name == "" || name === null || name==='\n') {
            console.log("invalid input. ");
            return false;
        }
        if(this.loggedIn) return true;
        
        this.name = name;
        this.loggedIn = true;
        socket.send({"name":name});
        console.log(name + " paste some json and hit enter to send a request");
        
        return this.loggedIn;
    }
    
    
    
    deconstructor(){
        this.loggedIn = false;
    }
    
}

let user = new client();

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(data) {
    
    if(user.login(data)){
        if(IsJsonString(data)){
            process.stdout.write("sending: " + data);
        }
    }
    
    // if (err) {
    //     process.exit(1);
    // } else {
    //     process.exit(0);
    // }
});
process.stdout.write("connecting....");


































































function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}




















process.on('SIGINT', function () {
    console.log('Got a SIGINT. Goodbye cruel world');
    process.exit(0);
});
