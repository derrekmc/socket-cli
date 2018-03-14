"use strict";
const pkg = require("../package");
const net = require('net');
const log = require("./lib/logger");
const helper = require("./lib/helpers");
const cliv = require("./lib/cli-viewer");
const MESSAGE_EVENT = require('./events/MSGEvent');
const SOCKET_EVENT = require('./events/SocketEvent');
const views = require('./views');


class Client {
    
    constructor(port, host){
        
        let name = "";
        
        cliv.splash('Socket Chat');
        cliv.view('=D- TCP Socket CLI Login', 'login');
        cliv.print("connecting to: " + host + ":" + port);
        
        let __ = this;
    
        let NetConnection = new net.Socket();
        let EventEmitter = require('events');
    
        class SocketEmitter extends EventEmitter {}
        let socket = new SocketEmitter();
    
        class MessageEmitter extends EventEmitter {}
        let message = new MessageEmitter();
    
        NetConnection.connectionTimeout = setTimeout(function(){
            __.onTimeout();
        }, 8000);
    
        NetConnection.connect(9432, '35.188.0.214', function() {
            socket.emit(SOCKET_EVENT.CONNECT);
        });
        
        socket.on(SOCKET_EVENT.CONNECT, function() {
            clearTimeout(NetConnection.connectionTimeout);
            process.stdout.write('..connected\n-------------------------------------------\n\n');
            
            views.pipe("login", {
                host: host,
                port: port
            });
            
        });
        
        NetConnection.on(SOCKET_EVENT.DATA, function(data) {
            // clean up data, events, flow because the server is sending garbage
            data = data.toString();
            let chunks = data.split('\n');
            chunks.forEach(function(chunk, index, list){
                //console.log("chunk",chunk);
                if(data && data.type && data.type === 'heartbeat') return;
                let part = helper.jsonToObject(chunk);
                if(part) {
                        socket.emit(SOCKET_EVENT.DATA, part);
                }else{
                    //console.log("could not parse", chunk,index, list);
                }
            });
        });
        
        socket.on(SOCKET_EVENT.DATA, function (data) {
            if(data && data.type && data.type !== 'heartbeat') {
                if(data.sender == cliv.session.name) {
                    console.log(data);
                }
                views.pipe(data.type, data);
                message.emit(data.type, data);
            }
        });
    
        socket.send = function(data){
            /**
             * Check for empty string or null
             */
            if(!data) {
                cliv.splash('Nothing to send');
                return;
            }
            if(!data || data === "" || data === null || data==='\n') {
                return false;
            }
            //log.info('send', content);
            if(typeof data === 'object') {
                data.id = cliv.session.name;
            }
        
            let payLoad = JSON.stringify(data);
            let chunks = payLoad.split('\n');
            
            chunks.forEach(function(chunk, index, list){
                //console.log("chunk",chunk);
                if(chunk) {
                    NetConnection.write(chunk + '\n');
                }else{
                    //console.log("could not parse", chunk,index, list);
                }
            });
           
        };
        
        NetConnection.on('close', function() {
            log.error('connection closed');
        });
    
        NetConnection.on('error', function(err) {
            log.error('connection error', err);
        });
    
        message.on(MESSAGE_EVENT.WELCOME, function (data) {
            //log.info(MESSAGE_EVENT.WELCOME, data);
        });
        message.on(MESSAGE_EVENT.MESSAGE, function (data) {
            //console.log(data.msg);
        });
        message.on(MESSAGE_EVENT.ERROR, function (err) {
            log.error(MESSAGE_EVENT.ERROR, err);
        });
        
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', function(data){
        
        });
        
        this.NetConnection = NetConnection;
        this.socket = socket;
        
    }
    
    onInput (data) {
        //log.info("onInput:",data);
        data = helper.sanitize(data);
    
        let payLoad = data;
        let obj = helper.jsonToObject(data);
    
        if (obj) {
            //log.info("onInput", data);
            this.socket.send(obj);
            obj = JSON.parse(data);
            payLoad = obj;
            cliv.prompt("#");
        
        }else if(data.indexOf("/")!=-1){
        
            let request = data.split("/")[1];
            let route = ['welcome', 'chat', 'exit','session'];
        
            if(route.indexOf(request) != -1){
                views.pipe(request, data);
                return;
            }
        
            let requests = [
                MESSAGE_EVENT.COUNT,
                MESSAGE_EVENT.TIME
            ];
        
            if(requests.indexOf(request) != -1){
                cliv.request(request);
                this.socket.send({request:request});
            }else{
                cliv.alert('Invalid request');
                cliv.prompt("#");
            }
        
        }else{
            payLoad = {
                type: SOCKET_EVENT.MSG,
                msg: data,
                sender: cliv.session.name,
                id: cliv.session.name,
                date: new Date().toLocaleTimeString()
            };
        
            if(cliv.session.chatEnabled){
                cliv.printf(payLoad.date +' ' + payLoad.sender + ': ');
            } else{
                cliv.prompt("#");
            }
            this.socket.send(payLoad);
        }
    }
    
    login(name){
        
        name = helper.sanitize(name);
        if(!name) {
            return false;
        }
        
        if(cliv.session.loggedIn) return true;
        this.name = name;
        cliv.session.name = name;
        this.NetConnection.write('{"name":"'+name+'"}' + '\n');
    }
    
    deconstructor(){
        this.NetConnection.destroy();
        cliv.exit();
    }
    
}

module.exports = Client;