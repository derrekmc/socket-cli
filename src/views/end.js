const cliv = require("../lib/cli-viewer");
module.exports = {
    title: "Count Results",
    handle: "count",
    index: function (data) {
        log.info("Count!");
        cliv.alert(this.title, data.count);
    }
};