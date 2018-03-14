const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "Exit",
    handle: "exit",
    index: function (data) {
        cliv.splash("GoodBye ;-] ");
        cliv.print("");
        process.exit(0);
    }
};