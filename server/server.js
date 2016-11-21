/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
    var async = require('async');
var mongoose = require('mongoose');
var config = require('./config/environment');
var configFile = require('./utils/config.json');
//add timestamps in front of log messages
require('console-stamp')(console, {
    pattern : 'mmm dd, HH:MM:ss',
    label : false
});

//What abt cluster mode?
//App is now running on single core :(

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Setup server
var app = express();
app.set('etag', false);
var http = require('http');

startServer();

// Expose app
exports = module.exports = app;

function startServer() {
    var server = http.createServer(app);
    require('./config/express')(app);
    require('./routes')(app);
    var subfolder = configFile.subfolder;
    // Start server
    server.listen(config.port, config.ip, function () {
        console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
    });
}
