'use strict';

var express = require('express');
var controller = require('./show.controller');
var auth = require('../../auth/auth.service');
var isAuth = auth.isAuthenticated;
var router = express.Router();

router.get('/',             isAuth(),   controller.getShows);
router.post('/',            isAuth(),   controller.addShow);
router.put('/:id',          isAuth(),   controller.updateShow);

module.exports = router;
