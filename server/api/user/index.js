'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var isAuth = auth.isAuthenticated;

var router = express.Router();
var multipart = require('connect-multiparty');

// Get user(s)
router.get('/',                                     isAuth(),                   controller.getAllUsers);
router.post('/',                                                        controller.createUser);

module.exports = router;
