'use strict';

var express = require('express');
var controller = require('./artist.controller');
var auth = require('../../auth/auth.service');
var isAuth = auth.isAuthenticated;
var router = express.Router();

router.get('/',             isAuth(),   controller.getArtists);
router.post('/',            isAuth(),   controller.addArtist);
router.put('/:id',          isAuth(),   controller.updateArtist);

module.exports = router;
