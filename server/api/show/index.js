'use strict';

var express = require('express');
var controller = require('./show.controller');
var auth = require('../../auth/auth.service');
var isAuth = auth.isAuthenticated;
var router = express.Router();

router.get('/',                         isAuth(),   controller.getShows);
router.post('/',                        isAuth(),   controller.addShow);
router.put('/:showId',                  isAuth(),   controller.updateShow);
router.get('/upcoming',                 isAuth(),   controller.getUpcoming);
router.get('/cancelShow/:showId',       isAuth(),   controller.cancelShow);


module.exports = router;
