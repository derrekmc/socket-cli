const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "Error",
    handle: "Error",
    index: function (data) {
        cliv.view("Error" , "error");
        if(data.result){
            cliv.alert(data.reason);
            cliv.alert(data.result);
        }else{
            cliv.alert(data.msg);
        }
        cliv.prompt("#");
    }
};