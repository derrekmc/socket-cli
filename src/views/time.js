const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "Time Results",
    handle: "time",
    index: function (data) {
        log.info("TIME!");
        //cliv.alert(this.title, data.time);
    }
};