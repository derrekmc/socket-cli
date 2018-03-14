const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "Welcome to live cli chat",
    handle: "chat",
    index: function (data) {
        if(data.msg) this.title = data.msg;
        cliv.view(this.title, this.handle);
        cliv.print("Use these commands to do queries on the API");
        cliv.print("Enter valid json to send a query directly or");
        cliv.header("Use the  following predefined requests:");
    
        
        cliv.print("/menu - to return to cliv menu");
        cliv.print("/exit - to return to cliv exit");
    
    
        cliv.print("");
        cliv.prompt("#");
        
    }
};