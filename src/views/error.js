const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "Error",
    handle: "Error",
    index: function (data) {
        cliv.view("Error", "error");
        cliv.dialog(data.result);
        cliv.prompt("#");
    }
};