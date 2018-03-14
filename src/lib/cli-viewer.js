"use strict";
let Session = {
    name: "",
    loggedIn: false,
    chatEnabled: false,
    date: function(){
        return new Date().toLocaleTimeString();
    }
};

const cliViwer = {
    
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
 
    baloon(){
        
        process.stdout.write('\n\n\n' +
                            '          ,~-.\n' +
                            '         (  \' )-.          ,~\'`-.\n' +
                            '      ,~\' `  \' ) )       _(   _) )\n' +
                            '     ( ( .--.===.--.    (  `    \' )\n' +
                            '      `.%%.;::|888.#`.   `-\'`~~=~\'\n' +
                            '      /%%/::::|8888\\##\\\n' +
                            '     |%%/:::::|88888\\##|\n' +
                            '     |%%|:::::|88888|##|.,-.\n' +
                            '     \\%%|:::::|88888|##/    )_\n' +
                            '      \\%\\:::::|88888/#/ ( `\'  )\n' +
                            '       \\%\\::::|8888/#/(  ,  -\'`-.\n' +
                            '   ,~-. `%\\:::|888/#\'(  (     \') )\n' +
                            '  (  ) )_ `\\__|__/\'   `~-~=--~~=\'\n' +
                            ' ( ` \')  ) [VVVVV]\n' +
                            '(_(_.~~~\'   \\|_|/   hjw\n' +
                            '            [XXX]\n' +
                            '            `"""\'' +
                            '');
    },
    
    boat(){
        
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

