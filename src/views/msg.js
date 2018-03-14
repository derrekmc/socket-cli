const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "Message",
    handle: "msg",
    index: function (data) {
        
        let message = data.msg;
        let repliedToMe = (message && message.reply === cliv.session.name);
        
        if(message){
            // Only show me the response
            if(message.time && repliedToMe){
                cliv.alert('Time:  ' + (message.random  ? message.random : ' ')+(message.count ? message.count : ' ') +(message.time ?  message.time : ' ') + (message.date ? message.date : ' '));
                cliv.prompt('#');
            }
    
            // Only show me the response
            if(message.count && repliedToMe){
                cliv.alert('Count:  ' + (message.random  ? message.random : ' ')+(message.count ? message.count : ' ') +(message.time ?  message.time : ' ') + (message.date ? message.date : ' '));
                cliv.prompt('#');
            }
    
            // Only show me the response
            if(message.random > 30 && repliedToMe){
                cliv.header((message.sender ? '' : '') + ': Random number above 30 hit! Number: ' + message.random);
                cliv.baloon();
                cliv.prompt('#');
            }
    
            // dont show requests by others
            if(message.request){
                //cliv.alert(message.id + ': requesting - ' + message.request);
            }
    
            // live chat!
            if(message.msg && cliv.session.chatEnabled == true){
                cliv.print(data.date +  ' ' + data.sender + ': ' + message.msg+'\n');
            }
            
            //console.log(message);
        }
    
        
    }
};