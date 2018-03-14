const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "WELCOME to live cli chat",
    handle: "chat",
    index: function (data) {
        
        if(data.msg) this.title = data.msg;
        cliv.view(this.title, this.handle);
        
        cliv.print("Just type something and if someone is");
        cliv.print("in the room they'll reply. \nThats it!");
        
        cliv.header("Use the commands to navigate around:");
    
        
        cliv.print("/WELCOME - to return to the WELCOME screen");
        
        cliv.print("/exit - to return to exit the program");
    
    
        cliv.print("");
        cliv.prompt("type");
        
    }
};