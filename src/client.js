#!/usr/bin/env node
"use strict";
const pkg = require("../package");
const net = require('net');

const SOCKET_EVENT = require('./events/SocketEvent');

class Client{
    
    constructor(port, host){
        let __ = this;
        
        this.heartbeat;
        this.port = this.port || port;
        this.host = this.host || host;
        
        this.loggedIn = false;
        
        
        this.netConnection = new net.Socket();
        
        this.connectionTimeout = setTimeout(function(){
            __.onTimeout();
        }, 8000);
        
        this.netConnection.connect(port, host, function () {
            //console.log("connected");
            
        });
        
        this.connectionAttempts = 0;
        this.maxConnectionAttempts = 5;
        
        this.splash('Socket Chat');
        
        this.view('=D- TCP Socket Cli', 'login');
        
        process.stdout.write("connecting to: " + host + ":" + port);
        
        this.netConnection.on(SOCKET_EVENT.DISCONNECT, function() {
            __.view('Disconnect Received', SOCKET_EVENT.DISCONNECT);
        });
    
        this.netConnection.on(SOCKET_EVENT.END, function() {
            __.view('END Received', SOCKET_EVENT.END);
        });
        
        this.netConnection.on(SOCKET_EVENT.ERROR, function(err) {
            __.view('' + err, SOCKET_EVENT.ERROR);
            
        });
        
        this.netConnection.on(SOCKET_EVENT.CLOSE, function() {
            __.view('Socket close received', SOCKET_EVENT.CLOSE);
        });
        
        this.netConnection.on(SOCKET_EVENT.CONNECT, function() {
            clearTimeout(__.connectionTimeout);
            process.stdout.write('connected\n-------------------------------------------\n\n');
            
            __.print("Welcome, Just type your name to begin.");
    
            process.stdout.write('\n');
    
            __.header("Login");
            let name;
            __.prompt("Name", name);
        });
    
        this.netConnection.on(SOCKET_EVENT.DATA, function(data) {
            //{"request":"count"}
            if(IsJsonString(data)){
                
                let obj = JSON.parse(data);
                if(obj.type != "heartbeat")  __.print('onData: ' + data);
                
                switch(obj['type']){
                    
                    case 'heartbeat':
                        break;
                    
                    case 'welcome':
                        __.view(obj.msg, 'authenticated');
                        __.prompt("Press any key to continue..");
                        __.loggedIn = true;
                        break;
                    
                    case 'msg':
                        // if(typeof obj.msg == 'object') {
                        //     console.log(obj.sender + ": " + obj["msg"].msg);
                        //     return;
                        // }
                        __.view(obj.sender + ": " + obj["msg"].msg, 'chat');
                        __.prompt('you');
                        break;
    
                    case 'error':
                        __.view("Error: " + obj.msg || data, "Error");
                        __.prompt("Press any key to continue..");
                        break;
                    
                    default:
                        __.print('obj: ' + obj);
                        log.warn('No formatting specified for type:', obj.type);
                        
                }
                
            }
        });
        
        
        process.stdout.write("..");
        
    }
    
    onConnect(){
    
    
    }
    
    login(name){
        if(!name) {
            this.alert('No name passed to login');
            return false;
        }
        
        if(this.loggedIn) return true;
        
        this.name = name;
        
        this.netConnection.write('{"name":"'+name+'"}');
        
        //log.info(name + " paste some json and hit enter to send a request");
        
    }
    
     getFocus(){
        return this.focus;
    }
    
     setFocus(name){
        this.focus = name;
    }
    
    header(title){
        process.stdout.write('\n' + title);
        process.stdout.write('\n-------------------------------------------\n');
    }
    
    splash(title){
        this.setFocus(title);
        this.clear();
        process.stdout.write('\n-------------------------------------------\n');
        process.stdout.write('\n\n  ' + title + '\n\n');
        process.stdout.write('\n-------------------------------------------\n');
        process.stdout.write('\n\n\n\n');
    }
    
    view(title, handle){
        this.focus = title;
        this.currentView = {
            title: title,
            handle: handle
        };
        this.clear();
        process.stdout.write('\n-------------------------------------------\n');
        process.stdout.write('\n  ' + title + '\n');
        process.stdout.write('\n-------------------------------------------\n');
        //process.stdout.write('\n');
    }
    
    dialog(title){
        this.setFocus(title);
        process.stdout.write('\n\n-------------------------------------------\n');
        process.stdout.write('\n\n   ' + title + '\n\n');
        process.stdout.write('\n-------------------------------------------\n');
    }
    
    clear(){
        process.stdout.write('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
    }
    
    alert(message){
        
        process.stdout.write('\n\n!-----------------------------------------!\n');
        process.stdout.write('| ' + message + '\n');
        process.stdout.write('!-----------------------------------------!\n');
    }
    
    prompt(message, variable){
        process.stdout.write(message + ': ' );
    }
    
    printf(message){
        process.stdout.write(message);
    }
    
    print(message){
        process.stdout.write('\n'+message+ '');
    }
    
    onInput(data){
    
        switch(this.currentView.handle){
            
            case 'login':
                if(this.login(data)){
                    if(IsJsonString(data)){
                        this.send(data);
                    }else{
                        log.warn("Please enter your name to continue");
                    }
                }
                break;
    
            case 'chat':
                this.view("Socket Cli - Chat", "chat");
                // this.dialog("Enter JSON amd Hit enter to send");
                //this.prompt(this.name);
                this.prompt("}{");
                if(IsJsonString(data)){
                    var payLoad = data;//.replace(/\n/g,'');
                    this.send(payLoad);
                    this.prompt("#");
                }else{
                    var payLoad = '{"type":"'+SOCKET_EVENT.MSG+'","msg":"'+data+'"}'.replace(/\n/g,'');
                    this.send(payLoad);
                }
    
                break;
    
            case 'authenticated':
                this.view("Socket Cli - COMMANDS", "chat");

                this.print("/count");
                //this.print("/count");

                this.prompt("#");
                if(IsJsonString(data)){
                    var payLoad = data;//.replace(/\n/g,'');
                    this.send(payLoad);
                    this.prompt("#");
                }else{
                    var payLoad = '{"type":"'+SOCKET_EVENT.MSG+'","msg":"'+data+'"}'.replace(/\n/g,'');
                    this.send(payLoad);
                }
                
                break;
    
            case 'error':
                this.view("Error","error");
                this.dialog("Enter JSON amd Hit enter to send");
                //this.prompt(this.name);
                this.prompt("");
                if(IsJsonString(data)){
                    this.send(data);
                    this.prompt("#");
                }else{
                    //log.warn("ONLY JSON ACCEPTED");
                }
        
                break;
                
            default:
                this.view("Socket Cli - Chat");
                // this.dialog("Enter JSON amd Hit enter to send");
                //this.prompt(this.name);
                this.prompt("you");
                if(IsJsonString(data)){
                    var payLoad = data;//.replace(/\n/g,'');
                    this.send(payLoad);
                    this.prompt("#");
                }else{
                    var payLoad = '{"type":"'+SOCKET_EVENT.MSG+'","msg":"'+data+'"}'.replace(/\n/g,'');
                    this.send(payLoad);

                }
                break;
        }
        
        
        
    }
    
    send(data){
        /**
         * Check for empty string or null
         */
        if(!data){
            this.splash('Nothing to send');
            return;
        }
    
        if(!data || data == "" || data === null || data==='\n') {
            //this.print("JSON: ");
            return false;
        }
    
        //this.printf('<-o | ' + data);
        this.netConnection.write(data);
        
        //this.printf('<-o |' + data);
        
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
        console.log("disconnected");
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
module.exports = Client;