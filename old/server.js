/**
 * Register Application
 */
var server = require('./app');

var port = process.env.PORT || _Config.server.port || 3000;

server(port, function(port){
    log.info("");
    log.info(_Config.application.name + " is now listening on port: " + port);
    log.info("");
});
