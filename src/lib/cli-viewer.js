"use strict";
let Session = {
    name: "John",
    loggedIn: false
};

var cliViwer = {
    
    focus: "main",
    
    session: Session,
    
    getFocus(){
        return this.focus;
    },
    
    setFocus(name){
        this.focus = name;
    },
    
    header(title){
        process.stdout.write('\n\n' + title);
        process.stdout.write('\n-------------------------------------------');
    },
    
    splash(title){
        this.setFocus(title);
        this.clear();
        process.stdout.write('\n-------------------------------------------\n');
        process.stdout.write('\n\n  ' + title + '\n\n');
        process.stdout.write('\n-------------------------------------------\n');
        process.stdout.write('\n\n\n\n');
    },
    
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
    },
    
    dialog(title){
        this.setFocus(title);
        process.stdout.write('\n\n-------------------------------------------\n');
        process.stdout.write('\n\n   ' + title + '\n\n');
        process.stdout.write('\n-------------------------------------------\n');
    },
    
    clear(){
        process.stdout.write('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
        
        
    },
    
    alert(message){
        
        process.stdout.write('\n\n!-----------------------------------------!\n');
        process.stdout.write('| ' + message + '\n');
        process.stdout.write('!-----------------------------------------!\n');
    },
    
    prompt(message, variable){
        process.stdout.write('\n'+message + ': ' );
        
    },
    
    printf(message){
        process.stdout.write(message);
    },
    
    print(message){
        process.stdout.write('\n'+message+ '');
    },
    
    request(requestName){
        process.stdout.write('...requesting '  );
        //process.stdout.write('\n!-----------------------------------------!\n');
    },
    
    exit(){
        this.splash('Good Bye ;-)');
        this.print(' - D. Cordova');
        
        this.print("");
    },
    
    boat(){
        this.title('Random Number Aover 30 hit! ;-)');
        process.stdout.write('\n\n\n' +
            '     ~~~             |\n' +
            '~~~~     ~~~~      -----                    |\n' +
            '     ~~~           )___(                  -----\n' +
            '                     |                    )___(\n' +
            '                 ---------                  |\n' +
            '                /   ;-)   \\              -------\n' +
            '               /___________\\            /       \\\n' +
            '                     |                 /_________\\\n' +
            '              ---------------               |\n' +
            '             /               \\        -------------\n' +
            '            /                 \\      /             \\\n' +
            '           /___________________\\    /_______________\\\n' +
            '         ____________|______________________|__________\n' +
            '          \\_                             !         _/\n' +
            '            \\______________________________________/\n' +
            '     ~~..             ...~~~.           ....~~~...     ..~\n'
        );
    }
};


module.exports = cliViwer;

