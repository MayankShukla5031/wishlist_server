
/**
 * Main application routes
 */

'use strict';
var express = require('express');
var config = require('./config/environment');
var path = require('path');
var errors = require('./components/errors');
var authService = require('./auth/auth.service');

module.exports = function(app) {
    // Add authentication for all API routes
    //app.all('/api/*', authService.isAuthenticated());

    app.use('/api/users', require('./api/user'));
    app.use('/api/movies', require('./api/movie'));
    app.use('/api/artists', require('./api/artist'));
    app.use('/api/productionHouses', require('./api/productionHouse'));
    app.use('/api/screens', require('./api/screen'));
    app.use('/api/shows', require('./api/show'));
    app.use('/admin', require('./api/admin'));
    app.use('/auth', require('./auth'));
    app.route('/config')
    .get(function(req, res) {
            res.sendfile('utils/config.json');
        });
    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    app.route('/*')
        .get(function(req, res) {
            res.sendfile(path.resolve(app.get('clientAppPath')) + '/index.html');
        });
};
