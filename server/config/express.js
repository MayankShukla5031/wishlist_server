/**
 * Express configuration
 */

'use strict';

var express = require('express');
var session = require('express-session');

var SessionStore = require('connect-mongo')(session);

var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var passport = require('passport');
var multipart = require('connect-multiparty');
var dateMorgan=require('./morganDate');

module.exports = function(app) {
    var env = app.get('env');

    app.set('views', config.root + '/server/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');

    if(config.cors) {
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, WWW-Authenticate, X-CSRF-Token");
            res.header("Access-Control-Allow-Methods", "POST,GET,DELETE,PUT,OPTIONS");
            res.header("Access-Control-Allow-Credentials", "true");
            next();
        });
    }

    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    app.use(cookieParser());
    /*app.use(
        session({
            store: new SessionStore({
                url: 'mongodb://localhost:27017/session',
                interval: 1200000
            }),
            cookie: { maxAge: 1200000 },
            secret: 'my secret'
        })
    );*/

    // app.use(session({ secret: 'session secret key' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(multipart());
    var develop=dateMorgan.develop;
    app.use(morgan('develop'));
    if ('production' === env) {
        app.use(express.static(config.root+'\\frontend\\public\\'));
        app.set('adminAppPath', 'client');
        app.set('clientAppPath', '../../frontend');
        app.use(errorHandler()); // Error handler - has to be last
    }else if ('development' === env || 'test' === env) {
        app.use(require('connect-livereload')());
        //app.use(express.static(config.root+'\\server\\client\\'));
        app.use(express.static(config.root+'\\frontend\\public\\'));
        app.set('adminAppPath', 'client');
        app.set('clientAppPath', '../../frontend');
        app.use(errorHandler()); // Error handler - has to be last
    }
};
