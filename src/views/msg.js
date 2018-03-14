const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "Message",
    handle: "msg",
    index: function (data) {
        
        let message = data.msg;
        let repliedToMe = message.reply === cliv.session.name;
        
        if(message){
            // Only show me the response
            if(message.time && repliedToMe){
                cliv.alert('Time:  ' + (message.random  ? message.random : ' ')+(message.count ? message.count : ' ') +(message.time ?  message.time : ' ') + (message.date ? message.date : ' '));
            }
    
            // Only show me the response
            if(message.count && repliedToMe){
                cliv.alert('Count:  ' + (message.random  ? message.random : ' ')+(message.count ? message.count : ' ') +(message.time ?  message.time : ' ') + (message.date ? message.date : ' '));
            }
    
            // Only show me the response
            if(message.random > 30 && repliedToMe){
                cliv.boat((message.sender ? '' : '') + ': Random number above 30 is true! random = ' + message.random);
                console.log(message);
            }
    
            // dont show requests by others
            if(message.request){
                //cliv.alert(message.id + ': requesting - ' + message.request);
            }
    
            // live chat!
            if(message.msg && cliv.session.chatEnabled == true){
                cliv.print(data.date +  ' ' + data.sender + ': ' + message.msg+'\n');
            }
            cliv.prompt('#');
            //console.log(message);
        }
    
        
    }
};