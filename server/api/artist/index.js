'use strict';

var express = require('express');
var controller = require('./artist.controller');
var auth = require('../../auth/auth.service');
var isAuth = auth.isAuthenticated;
var router = express.Router();

router.get('/',                controller.getArtists);
router.post('/',               controller.addArtist);
router.put('/:id',             controller.updateArtist);

module.exports = router;
