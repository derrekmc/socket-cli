const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "Message",
    handle: "msg",
    index: function (data) {
    
        if(data.msg && data.msg.time){
            cliv.alert('Time:' + (data.msg.random  ? data.msg.random : ' ')+(data.msg.count ? data.msg.count : ' ') +(data.msg.time ?  data.msg.time : ' ') + (data.msg.date ? data.msg.date : ' '));
        }
    
        if(data.msg && data.msg.count){
            cliv.alert('Count:' + (data.msg.random  ? data.msg.random : ' ')+(data.msg.count ? data.msg.count : ' ') +(data.msg.time ?  data.msg.time : ' ') + (data.msg.date ? data.msg.date : ' '));
        }
        
        if(data.msg && data.msg.random > 30){
            cliv.boat((data.msg.sender ? '' : '') + ': Random number above 30 is true! random = ' + data.msg.random);
        }
        
        if(data.msg && data.msg.msg ){
            cliv.print(data.date +  ' ' + data.sender + ': ' + data.msg.msg+'\n');
        }
        
    }
};