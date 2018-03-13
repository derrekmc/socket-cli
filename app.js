"use strict";

global.log = require("./src/lib/logger");
const pkg = require("./package");
const net = require('net');

//const client = new Client();

const Client = require('./src/client');
const client = new Client(9432, "35.188.0.214");

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(data){
    if(client.login(data)){
        client.onInput(data);
    }
});

process.on('SIGINT', function () {
    client.splash('Good Bye ;-)');
    // process.stdout.write('\n\n\n' +
    //     '     ~~~             |\n' +
    //     '~~~~     ~~~~      -----                    |\n' +
    //     '     ~~~           )___(                  -----\n' +
    //     '                     |                    )___(\n' +
    //     '                 ---------                  |\n' +
    //     '                /   ;-)   \\              -------\n' +
    //     '               /___________\\            /       \\\n' +
    //     '                     |                 /_________\\\n' +
    //     '              ---------------               |\n' +
    //     '             /               \\        -------------\n' +
    //     '            /                 \\      /             \\\n' +
    //     '           /___________________\\    /_______________\\\n' +
    //     '         ____________|______________________|__________\n' +
    //     '          \\_ Derrek wishes you a great day!         _/\n' +
    //     '            \\______________________________________/\n' +
    //     '     ~~..             ...~~~.           ....~~~...     ..~\n'
    //     );
    client.deconstructor();
    //process.stdout.write(' goodbye.');
    process.exit(0);
});
