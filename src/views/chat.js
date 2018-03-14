const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "Welome to Socket-Cli Live Chat",
    handle: "chat",
    index: function (data) {
        
        if(data.msg) this.title = data.msg;
        cliv.view(this.title, this.handle);
        
        cliv.print("Just type something and if someone is");
        cliv.print("in the room they'll reply. \nThats it!");
        
        cliv.header("Use the commands to navigate around:");
        
        cliv.print("/welcome - to return to the WELCOME screen");
        
        cliv.print("/exit - to return to exit the program");
        
        cliv.print("");
        cliv.prompt(cliv.session.date() + ' ' + cliv.session.name);
        
        cliv.session.chatEnabled = true;
    }
};