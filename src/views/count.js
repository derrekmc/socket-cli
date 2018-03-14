const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "Count Results",
    handle: "count",
    index: function (data) {
        if(cliv.session.name == data.msg.sender) {
            cliv.alert('Xount:' + data.count);
        }
    }
};