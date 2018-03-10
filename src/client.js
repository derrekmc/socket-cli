#!/usr/bin/env node
"use strict";
const pkg = require("../package");
const net = require('net');
const log = require("./lib/logger");
const SOCKET_EVENT = require('./events/SocketEvent');

class Client extends Object{
    
    constructor(port, host){
        super();
    
        let __ = this;
        
        this.port = this.port || port;
        this.host = this.host || host;
        
        this.loggedIn = false;
        this.port = port;
        this.host = host;
        this.name;
        this.netConnection = new net.Socket();
        this.connectionTimeout = setTimeout(this.onTimeout, 8000);
        this.netConnection.connect(this.port, this.host);
        this.connectionAttempts = 0;
        this.maxConnectionAttempts = 5;
    
        this.dialog('Socket Chat');
    
        process.stdout.write("connecting to: " + this.host + ":" + this.port + "..");
    
        this.netConnection.on(SOCKET_EVENT.DISCONNECT, function() {
            __.disconnect();
        });
        
        this.netConnection.on(SOCKET_EVENT.ERROR, function(err) {
            __.error(err);
        });
        
        this.netConnection.on(SOCKET_EVENT.CLOSE, function() {
            __.onDisconnect();
        });
    
        this.netConnection.on(SOCKET_EVENT.CONNECT, function() {
            __.onConnect();
        });
        
        //this.netConnection.on(SOCKET_EVENT.DATA, this.onData);
        this.netConnection.on(SOCKET_EVENT.DATA, function(data) {
            __.onData(data);
        });
    
    
        //process.stdout.write("connecting....");
        return this;
    }
    
    onConnect(){
        
        process.stdout.write('connected\n-------------------------------------------\n\n');
        //this.netConnection.write('{"name":"derrek"}');
        clearTimeout(this.connectionTimeout);
        //process.stdout.write('\033c');
    
        this.print("Welcome stranger. Just type your name to begin chatting.");
        
        process.stdout.write('\n');
    
        this.title("Login");
        let name;
        this.prompt("Name: ", name);
        
        //process.stdout.write("What is your name? ");
    
        var payLoad = {"name":"derrek"};
        payLoad = JSON.stringify(payLoad);
        this.netConnection.write(payLoad);
        
    }
    
    login(name){
        
        if(!name || name == "" || name === null || name==='\n') {
            process.stdout.write("JSON: ");
            return false;
        }
        
        if(this.loggedIn) return true;
        
        this.name = name;
        this.loggedIn = true;
        
        this.send({"name":name});
        
        //log.info(name + " paste some json and hit enter to send a request");
        log.info("logging in...");
        
        return this.loggedIn;
    }
    
    title(title){
        process.stdout.write('\n               ' + title);
        process.stdout.write('\n-------------------------------------------\n');
    }
    
    
    dialog(title){
        this.clear();
        process.stdout.write('\n-------------------------------------------\n');
        process.stdout.write('\n\n               ' + title + '\n\n');
        process.stdout.write('\n-------------------------------------------\n');
    }
    
    clear(){
        process.stdout.write('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
    }
    
    alert(message){
        process.stdout.write('\n-------------------------------------------\n');
        process.stdout.write('\n               ' + message + '\n');
        process.stdout.write('\n-------------------------------------------\n');
    }
    
    prompt(message, variable){
        process.stdout.write('' + message );
    }
    
    print(message){
        process.stdout.write(message);
    }
    
    onInput(data){
    
        // if(!this.login(data)){
        //     log.info("Please log in");
        // }
    
        //if(IsJsonString(data)){
            this.send(data);
       // }
        
    }
    
    send(data){
        /**
         * Check for empty string or null
         */
        if(!data){
            log.debug('Nothing to send');
            return;
        }
    
        /**
         * Check if user has already logged in
         */
        if(this.login(data)){
            if(IsJsonString(data)){
                log.info('sending:', data);
                this.netConnection.write(data);
            }else{
               log.warn('payload is not a json string -> ' + data );
            }
        }
        
    }
    
    onData(data){
    
        log.info('onData: ' + data);
        
        if(IsJsonString(data)){
            let obj = JSON.parse(data);
            
            switch(obj.type){
                
                case 'heartbeat':
                    break;
    
                case 'welcome':
                    log.info('**************************  ' + obj.type + '  **************************');
                    break;
                
                case 'msg':
                    log.info('**************************  ' + obj.type + '  **************************');
                    break;
                
                default:
                    log.warn('No formatting specified for type:', obj.type);
                    log.info(obj.type + ': ' + obj.msg);
            }
            
        }
        
        
        
        // log.info("MESSAGE RECEIVED: " + message);
        // if(client.login(message)){
        //     process.stdout.write("receiving: " + message);
        // }
        // if(message && message.hasOwnProperty("type")){
        //     log.info("message:" + message.type, message);
        // }else{
        //     log.info("message:unknown", message);
        // }
        
    }
    
    onError(err){
        log.error(err);
    }
    
    onReconnect(){
        log.debug("socket reconnected");
    }
    
    onTimeout(){
        log.error("connection timed out");
    }
    
    onDisconnect(){
        this.netConnection.destroy();
        console.log("socket disconnected");
    }
    
    deconstructor(){
        this.onDisconnect();
        this.loggedIn = false;
    }
    
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
//const client = new Client();
module.exports = Client;