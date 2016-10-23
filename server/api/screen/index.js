'use strict';

var express = require('express');
var controller = require('./screen.controller');
var auth = require('../../auth/auth.service');
var isAuth = auth.isAuthenticated;
var router = express.Router();

router.get('/',             isAuth(),   controller.getScreens);
router.post('/',            isAuth(),   controller.addScreen);
router.put('/:id',          isAuth(),   controller.updateScreen);

module.exports = router;
