const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "Socket Closed",
    handle: "close",
    index: function (data) {
        cliv.alert("Socket Closed");
    }
};