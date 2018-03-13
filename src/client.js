
"use strict";
const pkg = require("../package");
const net = require('net');


const SOCKET_EVENT = require('./events/SocketEvent');

class Client{
    
    constructor(port, host){
        let __ = this;
        
        this.heartbeatInterval;
        this.port = this.port || port;
        this.host = this.host || host;
        
        this.loggedIn = false;
        
        
        this.netConnection = new net.Socket();
        
        this.connectionTimeout = setTimeout(function(){
            __.onTimeout();
        }, 8000);
        
        this.netConnection.connect(port, host, function () {
          
            console.log("connected");
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
            log.error('end');
            __.view('Exit', SOCKET_EVENT.END, 'exit');
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
    
                if(obj['type'] != "heartbeat")  {
                    //log.verbose('onData: ' + data);
                    __.updateView(obj['type'], obj);
                }
                
            }
        });
    
        
        //process.stdout.write("..");
        
    }
    
    updateView(viewHandle, data){
        //log.verbose('updateView', viewHandle, data);
        if(!viewHandle) {
            log.error('Error in updateView(viewHandle). No viewHandle passed.');
            return false;
        }
        viewHandle = viewHandle || this.currentView.handle;
        
        this.currentView.handle = viewHandle;
        this.currentView.data = data;
        
        this.__onUpdateView(viewHandle, data);
    }
    
    __onUpdateView(viewHandle, data) {
        
        
        //log.info('__onUpdateView', viewHandle);
        
        this.currentView.handle = viewHandle || this.currentView.handle;
        this.currentView.data = data || this.currentView.data;
        
        //viewHandle = this.currentView.handle;
        //data = this.currentView.data;
        
        
        switch (viewHandle) {
            
            case 'login':
                if (this.login(data)) {
                    if (IsJsonString(data)) {
                        this.send(data);
                    } else {
                        log.warn("Please enter your name to continue");
                    }
                }
                break;
            
            case 'welcome':
                //console.log("Welcome", data);
                this.dialog(data.msg, 'authenticated');
                this.prompt("Press any key to continue..");
                this.loggedIn = true;
                break;
            
            case 'msg':
                this.printf('\n - ' + data.date + ' | ' + data.sender + ': ' + data.msg.msg + '');
                this.prompt("");
                break;
            
            case 'authenticated':
                //console.log('VIEW', viewHandle);
                this.view("Socket Cli - COMMANDS", "chat");
                
                this.print("/count");
                this.print("/time");
                
                this.prompt("#");
                if (IsJsonString(data)) {
                    var payLoad = data;//.replace(/\n/g,'');
                    this.send(payLoad);
                    this.prompt("#");
                } else {
                    var payLoad = '{"type":"' + SOCKET_EVENT.MSG + '","msg":"' + data + '"}'.replace(/\n/g, '');
                    this.send(payLoad);
                }
                
                break;
            
            case 'error':
                this.view("Error", "error");
                this.dialog(data.result);
                
                this.prompt("#");
                break;
            
            case 'exit':
                this.view("Application Quit", "exit");
                break;
            
            default:
                
                this.view("No View Specified");
                
                this.print("/count");
                this.print("/time");
                
                this.prompt("#");
                this.send(payLoad);
            
            
            
        }
        
    }
    
    onInput(data){
        
        //log.info("onInput", data);
    
        data = this.sanitize(data);
        
        //Object.assign(dto, data);
        
        let payLoad = data;
        let obj = {};
        
        if(IsJsonString(data)) {
            //log.info("onInput", data);
            this.send(payLoad);
            obj = JSON.parse(data);
            payLoad = obj;
            this.updateView(obj.type, obj);
            
            this.prompt("you");
        }else{
            payLoad = {
                type: SOCKET_EVENT.MSG,
                msg: data,
                sender: this.name,
                id: this.name,
                date: new Date().toLocaleTimeString()
            };
            process.stdout.write('\n ---- ' + payLoad.date + ' | ' + payLoad.sender + ': ' + payLoad.msg + ' ');
            this.send(payLoad);
            this.prompt("you");
        }
    
       
        
        
    }
    
    send(data){
        /**
         * Check for empty string or null
         */
        if(!data) {
            this.splash('Nothing to send');
            return;
        }
        if(!data || data == "" || data === null || data==='\n') {
            return false;
        }
        
        
        
        // if(IsJsonString(data)){
        //     let payLoad = data;
        //     //payLoad = data.replace(/\n/g,'');
        //     this.send(payLoad);
        //     this.prompt("#");
        //     this.netConnection.write(payLoad);
        // }else{
        //     let payLoad = '{"type":"'+SOCKET_EVENT.MSG+'","id":"'+data+'"}'.replace(/\n/g,'');
        //     payLoad = payLoad.replace(/\n/g,'');
        //     this.send(payLoad);
        //     this.prompt("#");
        //     this.netConnection.write(payLoad);
        // }
        
        
        this.netConnection.write(JSON.stringify(data));
        //log.info('send: ' + data);
    }
    
    sanitize(input){
        return input.replace(/\n/g,'');
    }
    
    printc(data){
        if(data['msg'] && data['msg']['msg']){
            process.stdout.write('\n' + data['date'] + ' | ' + data['sender'] + ': ' + data['msg']['msg'] + '');
        }else{
            process.stdout.write('\n' + new Date().toLocaleTimeString() + ' | ' + this.name + ': ' + data.msg + '');
        }
    }
    
    
    
    
    onConnect(){
    
    
    }
    
    login(name){
        name = name.replace(/\n/g,'');
        if(!name) {
            //this.alert('No name passed to login');
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
        process.stdout.write(
            '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
            '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
            
    }
    
    alert(message){
        
        process.stdout.write('\n\n!-----------------------------------------!\n');
        process.stdout.write('| ' + message + '\n');
        process.stdout.write('!-----------------------------------------!\n');
    }
    
    prompt(message, variable){
        process.stdout.write('\n'+message + ': ' );
    }
    
    printf(message){
        process.stdout.write(message);
    }
    
    print(message){
        process.stdout.write('\n'+message+ '');
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

global.isFunction = function isFunction(functionToCheck) {
    var getType = {};
    if(functionToCheck) return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

global.isArray = function isArray(arrayToCheck) {
    var getType = {};
    if(arrayToCheck) return arrayToCheck && getType.toString.call(arrayToCheck) === '[object Array]';
};

global.requiredFields = function requiredFields(object, requiredFieldsArray, callback){
    if(!callback) callback = function(){};
    if(isArray(requiredFieldsArray)) {
        var foundFields = new Array();
        for(var i in object){
            for(var j in requiredFieldsArray){
                if(i == requiredFieldsArray[j]){
                    foundFields.push(requiredFieldsArray[j]);
                }
            }
        }
        if(foundFields.length == requiredFieldsArray.length){
            callback(null);
            return null;
        }else{
            //var diff = _.difference(object, requiredFieldsArray);
            var error = "Missing one of the required fields(" + requiredFieldsArray.toString() + ")\n Fields Found: (" + foundFields.toString() + ")";
            callback(error);
            return error;
        }
    }else{
        var error = "requireFields param 2 is not an Array";
        if(isFunction(callback)) callback(error);
        return error;
    }
    
};

global.objectValue = function valueFromObject(object, field){
    if(object){
        if(object.hasOwnProperty(field)){
            return object[field];
        }else{
            return false;
        }
    }else{
        return false;
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