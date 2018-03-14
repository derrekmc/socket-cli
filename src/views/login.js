const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "Login",
    handle: "login",
    index: function (data) {
        cliv.print("Welcome, Just type your name to begin.");
        cliv.print('');
        cliv.header("Login");
        cliv.prompt("Name");
    }
};