'use strict';

var express = require('express');
var controller = require('./movie.controller');
var auth = require('../../auth/auth.service');
var isAuth = auth.isAuthenticated;
var router = express.Router();

router.get('/',                                        controller.getMovies);
router.get('/search',                                  controller.searchMovies); //Ex: api/movies/search?key='anything'
router.post('/',                                       controller.addMovie);
router.put('/:id',                                     controller.updateMovie);
router.put('/addToWishList/:movieId',                  isAuth(), controller.addToWishList);
router.put('/removeFromWishlist/:movieId',             isAuth(), controller.removeFromWishlist);
router.get('/trending',                                controller.getTrending);
router.get('/myWishList',                              isAuth(), controller.getMyWishlist);

module.exports = router;
