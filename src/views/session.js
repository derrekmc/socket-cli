const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "Session",
    handle: "session",
    index: function (data) {
        cliv.print("/exit - to quite the program");
        console.log(cliv.session);
        cliv.session.loggedIn = true;
    }
};