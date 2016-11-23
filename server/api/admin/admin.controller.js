'use strict';

var path = require('path');
var config = require('../../config/environment');

exports.getAdminPage = function(req, res) {
    res.sendfile(path.resolve(config.root+'/server/client/') + '/index.html');
};