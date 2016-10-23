'use strict';

var express = require('express');
var controller = require('./movie.controller');
var auth = require('../../auth/auth.service');
var isAuth = auth.isAuthenticated;
var router = express.Router();

router.get('/',             isAuth(),   controller.getMovies);
router.post('/',            isAuth(),   controller.addMovie);
router.put('/:id',          isAuth(),   controller.updateMovie);

module.exports = router;
