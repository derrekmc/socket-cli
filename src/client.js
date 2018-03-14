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
    
        this.host = host;
        this.port = port;
        
        let NetConnection = new net.Socket();
        let EventEmitter = require('events');
    
        class SocketEmitter extends EventEmitter {}
        let socket = new SocketEmitter();
    
        class MessageEmitter extends EventEmitter {}
        let message = new MessageEmitter();
        
        this.NetConnection = NetConnection;
        this.socket = socket;
    
        this.maxConnectionAttempts = 20;
        this.connectionAttempts = 0;
        
        // NetConnection.connectionTimeout = setTimeout(function(){
        //     __.onTimeout();
        // }, 8000);
        //
        // NetConnection.connect(port, host, function() {
        //     socket.emit(SOCKET_EVENT.CONNECT);
        // });
       
        this.connect(port, host);
        
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
            if(!data || data === "" || data === null || data==='\n') {
                cliv.splash('Nothing to send');
                return false;
            }
            
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
            this.reconnect();
        });
    
        NetConnection.on('error', function(err) {
            log.error('connection error', err)
            this.reconnect();
        });

        NetConnection.on('end', function() {
            log.error('end program received');
            this.reconnect();
        });
    
        message.on(MESSAGE_EVENT.WELCOME, function (data) {
            //log.info(MESSAGE_EVENT.WELCOME, data);
        });
        message.on(MESSAGE_EVENT.MESSAGE, function (data) {
            //console.log(data.msg);
            //if(data.request) views.pipe(data.request, data);
            //if(data.count) views.pipe(MESSAGE_EVENT.COUNT, data);
        });
        message.on(MESSAGE_EVENT.ERROR, function (err) {
            cliv.alert(MESSAGE_EVENT.ERROR + ' ' + err);
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
            cliv.request();
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
    
    disconnect() {
        this.reconnect();
    }
    
    onTimeout() {
        cliv.alert('x - Connection timed out');
    
    }
    
    connect(port, host){
        let __ = this;
        
        __.connectionTimeout = setTimeout(function(){
            __.onTimeout();
        }, 8000);
        
        __.NetConnection.connect(port, host, function() {
            clearTimeout(__.reconnectTimer);
            clearTimeout(__.connectionTimeout);
            __.socket.emit(SOCKET_EVENT.CONNECT);
        })
        
    }
    
    reconnect(){
        let __ = this;
        if(this.connectionAttempts < this.maxConnectionAttempts){
            
            this.connectionAttempts++;
    
            if(this.connectionAttempts > 2) cliv.alert("Attempting #" + this.connectionAttempts + " to reconnect");
            
            this.reconnectTimer = setTimeout(function () {
                _.connect(this.port, this.host);
            }, 5000);
        }else{
            this.disconnect();
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