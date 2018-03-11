/**
 * Logging levels pulled from
 * http://en.wikipedia.org/wiki/Syslog#Severity_levels
 */
var winston = require('winston');
const adapter = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'verbose',
            colorize : true,
            timestamp: false,
            transports: []
        })
    ]
});

module.exports = adapter;
//module.exports.winston = adapter;

