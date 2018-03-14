const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "Welcome",
    handle: "welcome",
    index: function (data) {
        if(data.msg) this.title = data.msg;
        
        cliv.view(this.title, this.handle);
        cliv.print("Use these commands to do queries on the API");
        cliv.print("Enter valid json to send a query directly or");
        cliv.header("Use the  following predefined requests:");
    
        cliv.print("/count - Get to the number of requests");
        cliv.print("/time - time to see what time it is");
        cliv.print("/chat - to join a live chat room");
        cliv.print("/welcome - to return to welcome menu");
        cliv.print("/exit - to quite the program");
    
    
        cliv.print("");
        cliv.prompt("#");
    
        
        cliv.session.loggedIn = true;
    }
};