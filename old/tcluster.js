/**
 * New relic stats
 */
global.newrelic = require('newrelic');

var throng = require('throng');

var WORKERS = process.env.WEB_CONCURRENCY || 1;

throng(start, {
  workers: WORKERS,
  lifetime: Infinity
});

function start() {
    /**
     * Register Globals
     */
    require('./config/globals');
    
    var server = require('./app')(process.env.PORT || 8080, function(port){
        log.info("A worker is now listening on port:" + port);
    });
}




