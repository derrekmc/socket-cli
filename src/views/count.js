const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "Count Results",
    handle: "count",
    index: function (data) {
        
            cliv.alert('Xount:' + data.count);
        
    }
};