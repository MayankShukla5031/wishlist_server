'use strict';

var express = require('express');
var controller = require('./movie.controller');
var auth = require('../../auth/auth.service');
var isAuth = auth.isAuthenticated;
var router = express.Router();

router.get('/',                                     isAuth(),   controller.getMovies);
router.post('/',                                    isAuth(),   controller.addMovie);
router.put('/:id',                                  isAuth(),   controller.updateMovie);
router.put('/addToWishList/:movieId',               isAuth(),   controller.addToWishList);
router.put('/removeFromWishlist/:movieId',          isAuth(),   controller.removeFromWishlist);
router.get('/trending',                             isAuth(),   controller.getTrending);

module.exports = router;
