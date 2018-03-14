"use strict";
const pkg = require("../package");
const net = require('net');
const log = require("./lib/logger");
const helper = require("./lib/helpers");
const cliv = require("./lib/cli-viewer");
const MESSAGE_EVENT = require('./events/MSGEvent');
const SOCKET_EVENT = require('./events/SocketEvent');
//const VIEW_EVENT = require('./events/ViewEvent');
const views = require('./views');

class Client {
    
    onInput (data) {
       //log.info("onInput:",data);
    }
    
    constructor(port, host){
        
        let name = "";
    
        views.pipe("login", {
            host: host,
            port: port
        });
    
        let NetConnection = new net.Socket();
        let EventEmitter = require('events');
    
        class SocketEmitter extends EventEmitter {}
        let socket = new SocketEmitter();
    
        class MessageEmitter extends EventEmitter {}
        let message = new MessageEmitter();
    
        NetConnection.connect(9432, '35.188.0.214', function() {
            socket.emit(SOCKET_EVENT.CONNECT);
        });
    
        NetConnection.on(SOCKET_EVENT.DATA, function(data) {
            // clean up data, events, flow because the server is sending garbage
            data = data.toString();
            let chunks = data.split('\n');
            chunks.forEach(function(chunk, index, list){
                //console.log("chunk",chunk);
                let part = helper.jsonToObject(chunk);
                if(part) socket.emit(SOCKET_EVENT.DATA, part);
            });
        });
    
        socket.on(SOCKET_EVENT.CONNECT, function() {
            //log.info("connected");
            process.stdout.write("..connected");
            let payLoad = {name:"derrek"};
            socket.send({name:"derrek"});
        });
        
        socket.on(SOCKET_EVENT.DATA, function (data) {
            //log.info(SOCKET_EVENT.DATA + ' Received');
            if(data && data.type && data.type !== 'heartbeat') {
                
                views.pipe(data.type, data);
                message.emit(data.type, data);
            }
        });
    
        NetConnection.on('close', function() {
            log.info('connection closed');
        });
    
        NetConnection.on('error', function(err) {
            log.error('connection error', err);
        });
    
        socket.send = function(data){
            /**
             * Check for empty string or null
             */
            if(!data) {
                cliv.splash('Nothing to send');
                return;
            }
            if(!data || data == "" || data === null || data==='\n') {
                return false;
            }
            //log.info('send', content);
            if(typeof data === 'object') data.id = name;
            
            let payLoad = JSON.stringify(data);
            NetConnection.write(payLoad);
        };
    
        message.on(MESSAGE_EVENT.WELCOME, function (data) {
            //log.info(MESSAGE_EVENT.WELCOME, data);
            //socket.send({request:"time"});
        });
        message.on(MESSAGE_EVENT.MESSAGE, function (data) {
            //console.log(data.msg);
            //cliv.print(data.date + " - " + data.sender +": " + data.msg.random + data.msg.time)
        });
        message.on(MESSAGE_EVENT.ERROR, function (err) {
            log.error(MESSAGE_EVENT.ERROR, err);
        });
    
    
        
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', function(data){
            data = helper.sanitize(data);
            
            let payLoad = data;
            let obj = helper.jsonToObject(data);
    
            if (obj) {
                //log.info("onInput", data);
                socket.send(payLoad);
                obj = JSON.parse(data);
                payLoad = obj;
                cliv.prompt("#");
            }else if(data.indexOf("/")!=-1){
                
                let request = data.split("/")[1];
                
                
                
                let route = ['welcome', 'chat', 'exit'];
                
                if(route.indexOf(request) != -1){
                    views.pipe(request, data);
                }
    
                let requests = [
                    MESSAGE_EVENT.COUNT,
                    MESSAGE_EVENT.TIME
                ];
                if(requests.indexOf(request) != -1){
                    cliv.request(request);
                    socket.send({request: request});
                }else{
                    cliv.alert('Invalid Entry Cannot Send');
                    cliv.prompt("#");
                }
                
                
            }else{
                payLoad = {
                    type: SOCKET_EVENT.MSG,
                    msg: data,
                    sender: name,
                    id: name,
                    date: new Date().toLocaleTimeString()
                };
                cliv.print('\n - ' + payLoad.date + ' | ' + payLoad.sender + ': ' + payLoad.msg + ' ');
                socket.send(payLoad);
                cliv.prompt("#");
            }
        });
    
    
        
    
        
        
    }
    
    deconstructor(){
        //NetConnection.destroy();
        cliv.exit();
    }
    
    
    
};

//const client = new Client();
module.exports = Client;