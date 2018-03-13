"use strict";
global.log = require("./src/lib/logger");
const pkg = require("./package");
const net = require('net');

const SOCKET_EVENT = require('./src/events/SocketEvent');

class Client{
    
    constructor(port, host){
    
        var __ = this;
        
        this.focus = "initializing";
        this.port = this.port || port;
        this.host = this.host || host;
        
        this.loggedIn = false;
        
        this.name="";
        
        this.socket = new net.Socket();
        
        var socket = this.socket;
        
        this.connectionTimeout = setTimeout(function(){
            __.onTimeout();
        }, 8000);
    
        this.socket.connect(port, host, function(soc) {
            //process.stdout.write("connected");
        });
        
        this.connectionAttempts = 0;
        this.maxConnectionAttempts = 5;
        
        this.splash('Socket Chat');
        
        this.view('Socket Cli');
        
        process.stdout.write("connecting to: " + host + ":" + port);
    
        this.socket.on(SOCKET_EVENT.DISCONNECT, function() {
            __.onDisconnect();
        });
    
        this.socket.on(SOCKET_EVENT.ERROR, function(err) {
            __.onError(err);
        });
    
        this.socket.on(SOCKET_EVENT.CLOSE, function() {
            __.onDisconnect();
        });
    
        this.socket.on(SOCKET_EVENT.CONNECT, function() {
            __.onConnect();
        });
    

        this.socket.on(SOCKET_EVENT.DATA, function(data) {
            console.log('onData: ' + data);
    
    
            if(IsJsonString(data)){
                let obj = JSON.parse(data);
        
                switch(obj['type']){
            
                    case 'heartbeat':
                        this.alert('**************************  ' + obj.type + '  **************************');
                        break;
            
                    case 'welcome':
                        this.loggedIn = true;
                        this.alert('**************************  ' + obj.type + '  **************************');
                        break;
            
                    case 'msg':
                        this.alert('**************************  ' + obj.type + '  **************************');
                        break;
            
                    default:
                        log.warn('No formatting specified for type:', obj.type);
                        log.info(obj.type + ': ' + obj.msg);
                }
        
            }
    
        });
        
        
        process.stdout.write("....");
        
    }
    
    onConnect(){
        clearTimeout(this.connectionTimeout);
        process.stdout.write('connected\n-------------------------------------------\n\n');
        
        this.print("Welcome, Just type your name to begin.");
        
        process.stdout.write('\n');
        
        this.header("Login");
        let name;
        this.prompt("Name: ", name);
        
    }
    
    login(name){
        if(!name) {
            this.alert('No name passed to login');
            return false;
        }
        if(this.loggedIn) return true;
        
        this.name = name;
        
        this.send('{"name":"'+name+'"}');
        
        //log.info(name + " paste some json and hit enter to send a request");
        this.printf("Thank you, " + name);
        
        return this.loggedIn;
    }
    
    header(title){
        process.stdout.write('\n               ' + title);
        process.stdout.write('\n-------------------------------------------\n');
    }
    
    splash(title){
        this.focus = title;
        this.clear();
        process.stdout.write('\n-------------------------------------------\n');
        process.stdout.write('\n\n               ' + title + '\n\n');
        process.stdout.write('\n-------------------------------------------\n');
        process.stdout.write('\n\n\n\n');
    }
    
    view(title){
        this.focus = title;
        this.clear();
        process.stdout.write('\n-------------------------------------------\n');
        process.stdout.write('\n\n               ' + title + '\n\n');
        process.stdout.write('\n-------------------------------------------\n');
    }
    
    dialog(title){
        this.focus = title;
        
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
    
    printf(message){
        process.stdout.write(message);
    }
    
    print(message){
        process.stdout.write(message + '\n');
    }
    
    onInput(data){
        
        // if(!this.login(data)){
             log.info("Please log in");
        // }
    
        if(this.login(data)){
            if(IsJsonString(data)){
                this.send(data);
            }else{
                log.warn("ONLY JSON ACCEPTED");
            }
        }
        
        
        
    }
    
    send(data){
    
        this.socket.write(data);
        // /**
        //  * Check for empty string or null
        //  */
        // if(!data || data == "" || data === null || data==='\n') {
        //     this.print("JSON: ");
        //     return false;
        // }
        //
        // socket.write('"{"request"}"');
        // this.print('Sending -- > ' + data);
        
    }
    
    onData(data){
        
        console.log('onData: ' + data);
        
        
        if(IsJsonString(data)){
            let obj = JSON.parse(data);
            
            switch(obj['type']){
                
                case 'heartbeat':
                    this.alert('**************************  ' + obj.type + '  **************************');
                    break;
                
                case 'welcome':
                    this.loggedIn = true;
                    this.alert('**************************  ' + obj.type + '  **************************');
                    break;
                
                case 'msg':
                    this.alert('**************************  ' + obj.type + '  **************************');
                    break;
                
                default:
                    log.warn('No formatting specified for type:', obj.type);
                    log.info(obj.type + ': ' + obj.msg);
            }
            
        }
        
        
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
        //socket.destroy();
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

function jsonToObject(str) {
    let object;
    try {
        object = JSON.parse(str);
    } catch (e) {
        return false;
    }
    return object;
}

//const client = new Client();


//let Client = require('./src/client');
let client = new Client(9432, "35.188.0.214");

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data){
    //if(client.login(data)){
        client.onInput(data);
    //}
    
});
process.on('SIGINT', function () {
    client.splash('Good Bye ;-)');
    client.deconstructor();
    //process.stdout.write(' goodbye.');
    process.exit(0);
});
