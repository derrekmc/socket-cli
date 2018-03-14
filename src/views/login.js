const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "Login",
    handle: "login",
    index: function (data) {
        cliv.splash('Socket Chat');
        cliv.view('=D- TCP Socket CLI Login', 'login');
        cliv.print("connecting to: " + data.host + ":" + data.port);
    }
};