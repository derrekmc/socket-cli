const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "Message",
    handle: "msg",
    index: function (data) {
        
        if(data.msg.time){
            cliv.alert('Time:' + (data.msg.random  ? data.msg.random : ' ')+(data.msg.count ? data.msg.count : ' ') +(data.msg.time ?  data.msg.time : ' ') + (data.msg.date ? data.msg.date : ' '));
        }
    
        if(data.msg.count){
            cliv.alert('Count:' + (data.msg.random  ? data.msg.random : ' ')+(data.msg.count ? data.msg.count : ' ') +(data.msg.time ?  data.msg.time : ' ') + (data.msg.date ? data.msg.date : ' '));
        }
        
        if(data.msg.random > 30){
            cliv.view((data.msg.sender ? '' : '') + ': random > 30 = true; random = ' + data.msg.random);
        }
        
        
        //console.log(data);
        
        
    }
};